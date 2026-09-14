"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import nepal from "@/data/nepal-boundary.json";
import { mapChapters, routeCoords } from "@/data/map-journey";
import { smoothPath, type Coord } from "@/lib/mapbox/journey";
import { registerGsap, ScrollTrigger, prefersReducedMotion } from "@/lib/animations/motion";
import { ridgeline, ridgeStroke, seedFrom } from "@/lib/terrain";
import { pad2 } from "@/lib/utils";

/**
 * THE DRAWN ATLAS.
 *
 * Shown when there is no Mapbox token, when WebGL is unavailable, or when the
 * visitor has asked for reduced motion. It is not a placeholder: the boundary
 * is real Natural Earth geometry, the destinations are at their true
 * coordinates, and it tells the same story from the same data.
 *
 * Every position is projected properly, so a place plotted here is where it
 * actually is — which is the whole difference between an atlas and a diagram.
 */

const W = 1200;
const H = 620;
const PAD = 46;

type Ring = number[][];
const ring = (nepal as { coordinates: Ring[] }).coordinates[0] as Ring;

/** Equirectangular, x scaled by cos(mean latitude) so the shape is not
 *  stretched. At Nepal's size the distortion against a proper projection is
 *  smaller than the line weight. */
function makeProjection(pts: Ring) {
  let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
  for (const [lon, lat] of pts) {
    minX = Math.min(minX, lon); maxX = Math.max(maxX, lon);
    minY = Math.min(minY, lat); maxY = Math.max(maxY, lat);
  }
  const k = Math.cos((((minY + maxY) / 2) * Math.PI) / 180);
  const w = (maxX - minX) * k;
  const h = maxY - minY;
  const scale = Math.min((W - PAD * 2) / w, (H - PAD * 2) / h);
  const ox = (W - w * scale) / 2;
  const oy = (H - h * scale) / 2;
  return ([lon, lat]: number[]): [number, number] => [
    ox + (lon - minX) * k * scale,
    oy + (maxY - lat) * scale,
  ];
}

export default function Atlas() {
  const project = useMemo(() => makeProjection(ring), []);
  const rootRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const [active, setActive] = useState(0);

  const border = useMemo(
    () => ring.map((p, i) => `${i ? "L" : "M"}${project(p).map((n) => n.toFixed(1)).join(" ")}`).join("") + "Z",
    [project],
  );

  const routeD = useMemo(() => {
    const pts = smoothPath(routeCoords as Coord[], 22);
    return pts.map((p, i) => `${i ? "L" : "M"}${project(p).map((n) => n.toFixed(1)).join(" ")}`).join("");
  }, [project]);

  // Himalayan relief, drawn as hachure along the northern border — the
  // convention of a hand-drawn atlas rather than a shaded raster.
  const ridges = useMemo(() => {
    const out: string[] = [];
    for (let i = 0; i < 5; i++) {
      const r = ridgeline({
        seed: seedFrom(`atlas-${i}`),
        peaks: 9 + i,
        height: 0.5 + i * 0.06,
        roughness: 0.55,
        flank: 1.1,
        vertices: 70,
      });
      out.push(ridgeStroke(r, W * 0.86, 54 + i * 5));
    }
    return out;
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    registerGsap();

    const path = routeRef.current;
    const len = path?.getTotalLength() ?? 0;
    if (path) {
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = prefersReducedMotion() ? "0" : `${len}`;
    }

    if (prefersReducedMotion()) {
      setActive(mapChapters.length - 1);
      return;
    }

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        const n = mapChapters.length - 1;
        const routeProgress = Math.max(0, (p * n - 1) / (n - 1));
        if (path) path.style.strokeDashoffset = `${len * (1 - routeProgress)}`;
        const idx = Math.round(p * n);
        setActive((prev) => (prev === idx ? prev : idx));
      },
    });
    return () => st.kill();
  }, []);

  const chapter = mapChapters[active];

  return (
    <section
      ref={rootRef}
      aria-labelledby="atlas-title"
      className="relative"
      style={{ height: `${mapChapters.length * 80}vh` }}
    >
      <div className="on-ink paper-grain sticky top-0 flex h-screen w-full flex-col overflow-hidden">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
          focusable="false"
        >
          {/* Graticule — one degree of latitude and longitude */}
          <g stroke="#F7F4EC" strokeOpacity="0.07" strokeWidth="1">
            {[26, 27, 28, 29, 30].map((lat) => {
              const a = project([80, lat]);
              const b = project([89, lat]);
              return <line key={`la${lat}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />;
            })}
            {[81, 83, 85, 87].map((lon) => {
              const a = project([lon, 26]);
              const b = project([lon, 31]);
              return <line key={`lo${lon}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />;
            })}
          </g>

          {/* The country */}
          <path d={border} fill="#012C42" stroke="#F7F4EC" strokeOpacity="0.34" strokeWidth="1.2" />

          {/* Himalayan hachure, clipped to the country */}
          <defs>
            <clipPath id="atlas-clip">
              <path d={border} />
            </clipPath>
          </defs>
          <g clipPath="url(#atlas-clip)" opacity="0.5">
            {ridges.map((d, i) => (
              <path
                key={i}
                d={d}
                transform={`translate(${W * 0.07} ${86 + i * 26})`}
                fill="none"
                stroke="#7797B5"
                strokeWidth="1"
                strokeOpacity={0.75 - i * 0.11}
              />
            ))}
          </g>

          {/* The route */}
          <path
            ref={routeRef}
            d={routeD}
            fill="none"
            stroke="#FDB614"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Destinations */}
          {mapChapters.map((c, i) => {
            if (!c.slug) return null;
            const [x, y] = project(c.center);
            const on = i <= active;
            return (
              <g key={c.id} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
                <rect
                  x={-4}
                  y={-4}
                  width={8}
                  height={8}
                  transform="rotate(45)"
                  fill={i === active ? "#FDB614" : on ? "#F7F4EC" : "#012C42"}
                  stroke="#F7F4EC"
                  strokeWidth="1.2"
                  style={{ transition: "fill .5s ease" }}
                />
                {/*
                  The chapter panel sits over the right of the map, so a label
                  set to the right of an eastern marker runs underneath it.
                  Those labels are placed to the left of their marker instead.
                */}
                <text
                  x={x > W * 0.58 ? -10 : 10}
                  y={4}
                  textAnchor={x > W * 0.58 ? "end" : "start"}
                  fontSize="11"
                  letterSpacing="1.6"
                  fill={i === active ? "#FDB614" : "#F7F4EC"}
                  fillOpacity={i === active ? 1 : 0.55}
                  style={{
                    fontFamily: "var(--font-sans)",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    transition: "fill .5s ease, fill-opacity .5s ease",
                  }}
                >
                  {c.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Chapter */}
        <div className="relative z-10 mt-auto p-[var(--spacing-gutter)] md:absolute md:inset-y-0 md:right-0 md:flex md:w-[min(28rem,38vw)] md:items-center">
          <div className="w-full bg-[color-mix(in_srgb,#00212F_90%,transparent)] p-6 md:p-8">
            <div className="flex items-baseline gap-3">
              <span className="numeral text-small text-gold">{pad2(active + 1)}</span>
              <span className="label text-[color-mix(in_srgb,#F7F4EC_58%,transparent)]">
                of {pad2(mapChapters.length)}
              </span>
              <span className="numeral ml-auto text-small tabular-nums text-gold">
                {chapter.kicker}
              </span>
            </div>
            <h2
              id="atlas-title"
              className="mt-4 font-[family-name:var(--font-display)] text-display-s leading-[1.05] text-paper"
            >
              {chapter.name}
            </h2>
            <p className="mt-3 text-body leading-relaxed text-[color-mix(in_srgb,#F7F4EC_78%,transparent)]">
              {chapter.note}
            </p>
            {chapter.slug && (
              <Link
                href={`/destinations/${chapter.slug}`}
                className="link-rule mt-5 inline-block text-paper"
              >
                <span className="label">Open {chapter.name}</span>
              </Link>
            )}
          </div>
        </div>

        <p className="absolute bottom-2 left-[var(--spacing-gutter)] text-micro text-[color-mix(in_srgb,#F7F4EC_34%,transparent)]">
          Boundary: Natural Earth. Positions are true coordinates.
        </p>
      </div>
    </section>
  );
}
