"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { createTerrainMaterial } from "./terrainMaterial";
import { heroChannel } from "@/lib/animations/scrollState";

/**
 * The opening sequence: a real survey of Everest, graded into the identity.
 *
 * The camera is flown from a scroll channel rather than from React state, and
 * every value it consumes is interpolated inside `useFrame`. Nothing in this
 * component re-renders while the visitor scrolls.
 */

/**
 * Camera path. Positions and targets are in the model's own world space, which
 * spans roughly x ±3.2, y 0.5–1.35, z ±1.9 once the glTF node transform is
 * applied. The move descends from a survey altitude to a raking pass along the
 * ridge — the same movement the site's whole narrative makes, from map to ground.
 */
const KEYS: { at: number; pos: [number, number, number]; look: [number, number, number] }[] = [
  // The tile spans x ±3.2, z ±1.9 and rises to about 1.9 with the base on the
  // origin plane. The path stays above that ceiling throughout, so the camera
  // never drops through the surface or sees the tile's cut edge.
  //
  // The pitch stays shallow throughout. Looking steeply down fills the frame
  // corner to corner and leaves the typography nowhere to sit; held near level,
  // the range reads as a band across the page with margin above and below —
  // which is how a landscape plate is set in print.
  { at: 0.0, pos: [0.1, 3.2, 8.6], look: [0, 2.15, 0] },
  { at: 0.34, pos: [-1.7, 2.95, 4.6], look: [0, 2.1, -0.1] },
  { at: 0.68, pos: [-1.35, 2.75, 2.8], look: [0.1, 2.05, -0.5] },
  { at: 1.0, pos: [0.8, 2.6, 1.2], look: [-1.15, 1.95, -1.6] },
];

/**
 * Vertical exaggeration. The source tile is a 6.4 × 3.8 footprint with only
 * 0.86 of relief, because that is what the ground actually does — but at that
 * ratio a camera low enough to feel like flying reads it as a wrinkled sheet.
 * Survey drawing has stretched the vertical for the same reason for two
 * hundred years; this is that convention, not a distortion of the data.
 */
const Y_EXAGGERATION = 2.2;

function sampleAt(p: number, key: "pos" | "look", out: THREE.Vector3) {
  let i = 0;
  while (i < KEYS.length - 2 && p > KEYS[i + 1].at) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const t = THREE.MathUtils.clamp((p - a.at) / (b.at - a.at), 0, 1);
  // Smoothstep between keys so the flight eases rather than cornering.
  const e = t * t * (3 - 2 * t);
  return out.set(
    THREE.MathUtils.lerp(a[key][0], b[key][0], e),
    THREE.MathUtils.lerp(a[key][1], b[key][1], e),
    THREE.MathUtils.lerp(a[key][2], b[key][2], e),
  );
}

export default function EverestTerrain({ low = false }: { low?: boolean }) {
  const { scene } = useGLTF(low ? "/models/everest-low.glb" : "/models/everest.glb", false);
  const camera = useThree((s) => s.camera);
  const ch = heroChannel();

  const desired = useRef(new THREE.Vector3());
  const target = useRef(new THREE.Vector3());
  const current = useRef(new THREE.Vector3());
  const currentLook = useRef(new THREE.Vector3());
  const started = useRef(false);

  /** Swap in the graded material and measure the mesh for the elevation ramp. */
  const { root, materials } = useMemo(() => {
    const root = scene.clone(true);
    // Stretch before measuring, so the elevation ramp is computed against the
    // geometry the visitor actually sees.
    root.scale.setY(Y_EXAGGERATION);
    root.updateWorldMatrix(true, true);

    // Drop the tile so its base sits on the origin plane. The glTF leaves it
    // floating, and a camera path written against "somewhere above zero" breaks
    // the moment the source model is re-exported.
    let box = new THREE.Box3().setFromObject(root);
    root.position.y -= box.min.y;
    root.updateWorldMatrix(true, true);
    box = new THREE.Box3().setFromObject(root);

    const materials: ReturnType<typeof createTerrainMaterial>[] = [];

    root.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;
      o.castShadow = false;
      o.receiveShadow = false;
      o.frustumCulled = true;
      const src = o.material as THREE.MeshStandardMaterial;
      const map = src?.map;

      if (map) {
        const mat = createTerrainMaterial(map);
        mat.uniforms.uMinY.value = box.min.y;
        mat.uniforms.uMaxY.value = box.max.y;
        o.material = mat;
        materials.push(mat);
      } else {
        // The untextured mesh is the tile's backing plate. It is never seen
        // from the camera path, and any material on it renders as a hard slab
        // that ignores the paper dissolve — so it is simply removed.
        o.visible = false;
      }
      src?.dispose?.();
    });

    return { root, materials };
  }, [scene]);

  useEffect(() => {
    return () => {
      materials.forEach((m) => m.dispose());
    };
  }, [materials]);

  useFrame((_, delta) => {
    const p = THREE.MathUtils.clamp(ch.progress, 0, 1);

    sampleAt(p, "pos", desired.current);
    sampleAt(p, "look", target.current);

    if (!started.current) {
      current.current.copy(desired.current);
      currentLook.current.copy(target.current);
      started.current = true;
    }

    // Frame-rate independent smoothing. The lag is deliberate: it gives the
    // flight weight, so the camera feels like it is being carried rather than
    // welded to the scrollbar.
    const k = 1 - Math.pow(0.0015, delta);
    current.current.lerp(desired.current, k);
    currentLook.current.lerp(target.current, k);

    camera.position.copy(current.current);
    camera.lookAt(currentLook.current);

    // The mountain resolves out of the paper across the first third.
    const reveal = THREE.MathUtils.smoothstep(p, 0.02, 0.3);
    for (const m of materials) m.uniforms.uReveal.value = reveal;
  });

  return <primitive object={root} />;
}

useGLTF.preload("/models/everest.glb", false);
