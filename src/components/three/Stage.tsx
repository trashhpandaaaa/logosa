"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

/**
 * The shared WebGL surface.
 *
 * Three rules are enforced here rather than left to each scene:
 *   · the render loop stops when the canvas is off-screen. A hero that keeps
 *     rendering while the visitor reads the itinerary six sections down is
 *     the single most expensive mistake available on a site like this.
 *   · device pixel ratio is capped. Terrain at DPR 3 on a phone is a
 *     thermal-throttling exercise with no visible benefit.
 *   · nothing casts shadows. The lighting model is a single hard key,
 *     matching the flat light in the logo, and shadow maps would buy nothing.
 */
export default function Stage({
  children,
  className,
  fov = 42,
  /** Render one frame and stop — used under prefers-reduced-motion. */
  still = false,
  dprMax = 1.75,
}: {
  children: React.ReactNode;
  className?: string;
  fov?: number;
  still?: boolean;
  dprMax?: number;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      // A margin so the scene is warm by the time it scrolls into view.
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={host} className={className}>
      {visible && (
        <Canvas
          frameloop={still ? "demand" : "always"}
          dpr={[1, dprMax]}
          camera={{ fov, near: 0.05, far: 60 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            // The identity lives on warm paper; anything the scene does not
            // cover should be paper, not black.
            toneMapping: THREE.NoToneMapping,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color("#f7f4ec"), 0);
          }}
        >
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      )}
    </div>
  );
}
