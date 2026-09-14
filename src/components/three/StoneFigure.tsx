"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { craftChannel } from "@/lib/animations/scrollState";

/**
 * A photogrammetry scan of carved stone, framed as an object in a vitrine.
 *
 * Unlike the terrain, this is not regraded — a scan of seventeenth-century
 * stone is already the right colour, and pushing it through the brand ramp
 * would be a costume. What the site contributes instead is the lighting: one
 * hard key from the left and a cold fill, which is how the relief is actually
 * lit in the Durbar Square at the end of the day.
 */
export default function StoneFigure({
  url,
  /** Target height in world units; the source scan is ~45 units tall. */
  height = 2.9,
  /** Radians of rotation across the scroll channel. */
  sweep = 0.5,
}: {
  url: string;
  height?: number;
  sweep?: number;
}) {
  const { scene } = useGLTF(url, false);
  const group = useRef<THREE.Group>(null);
  const ch = craftChannel();

  // Normalise the scan: scale to the requested height, centre on X/Z, and sit
  // it on the origin plane so the camera framing is independent of the export.
  const { root, baseRotation } = useMemo(() => {
    const root = scene.clone(true);
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const scale = height / (size.y || 1);
    root.scale.setScalar(scale);
    root.updateWorldMatrix(true, true);

    // Centred on the origin in all three axes, so the Stage's default camera
    // frames it without the section needing to know the scan's dimensions.
    const scaled = new THREE.Box3().setFromObject(root);
    const centre = scaled.getCenter(new THREE.Vector3());
    root.position.sub(centre);

    root.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.castShadow = false;
        o.receiveShadow = false;
        const m = o.material as THREE.MeshStandardMaterial;
        if (m) {
          // Scans arrive glossy from the capture rig. Stone is not glossy.
          m.roughness = 0.94;
          m.metalness = 0;
        }
      }
    });

    return { root, baseRotation: -0.12 };
  }, [scene, height]);

  useFrame(() => {
    if (!group.current) return;
    const p = THREE.MathUtils.clamp(ch.progress, 0, 1);
    // A slow quarter-turn across the section — enough to read the carving in
    // the round, not enough to become a spinning product shot.
    group.current.rotation.y = baseRotation + (p - 0.5) * sweep;
  });

  return (
    <group ref={group}>
      <primitive object={root} />
    </group>
  );
}
