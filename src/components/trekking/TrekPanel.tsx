"use client";

import { useMemo, useState } from "react";
import type { Trek, Waypoint } from "@/data/treks";
import ElevationProfile from "./ElevationProfile";

/**
 * The section and the plan, wired to one another.
 *
 * Scrubbing the elevation profile moves the marker on the route plan beside
 * it, so the two readings of the same walk stay in step. The plan is drawn
 * from the same coordinates the map uses — there is no second copy of the
 * route to drift out of sync.
 */
export default function TrekPanel({ trek }: { trek: Trek }) {
  const [active, setActive] = useState(0);

  // Equirectangular projection, scaled to the route's own bounds. At the size
  // of a single valley the distortion is far below the line weight.
  const plan = useMemo(() => {
    const W = 420;
    const H = 300;
    const pad = 34;
    const lons = trek.waypoints.map((w) => w.coords[0]);
    const lats = trek.waypoints.map((w) => w.coords[1]);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    // Longitude degrees shrink with latitude; without this the plan is stretched.
    const midLat = ((minLat + maxLat) / 2) * (Math.PI / 180);
    const lonScale = Math.cos(midLat);

    const spanX = Math.max((maxLon - minLon) * lonScale, 1e-6);
    const spanY = Math.max(maxLat - minLat, 1e-6);
    const scale = Math.min((W - pad * 2) / spanX, (H - pad * 2) / spanY);

    const cx = (W - spanX * scale) / 2;
    const cy = (H - spanY * scale) / 2;

    const pts = trek.waypoints.map((w) => ({
      ...w,
      x: cx + (w.coords[0] - minLon) * lonScale * scale,
      // Latitude increases northward; SVG y increases downward.
      y: cy + (maxLat - w.coords[1]) * scale,
    }));

    return { W, H, pts, line: pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("") };
  }, [trek]);

  const onActive = (_: Waypoint, index: number) => setActive(index);

  return (
    <div className="grid-editorial gap-y-12">
      <div className="col-span-12 md:col-span-8">
        <ElevationProfile trek={trek} onActive={onActive} />
      </div>

      <div className="col-span-12 md:col-span-3 md:col-start-10">
        <h3 className="label border-b border-rule pb-4 text-ink">Route plan</h3>
        <svg
          viewBox={`0 0 ${plan.W} ${plan.H}`}
          className="mt-6 w-full"
          role="img"
          aria-label={`Plan of the ${trek.name} route, ${trek.waypoints.length} waypoints.`}
        >
          {/* Graticule — the atlas register, at a whole tenth of a degree */}
          <defs>
            <pattern id="grat" width="42" height="42" patternUnits="userSpaceOnUse">
              <path d="M42 0H0V42" fill="none" stroke="#003047" strokeOpacity="0.07" />
            </pattern>
          </defs>
          <rect width={plan.W} height={plan.H} fill="url(#grat)" />

          <path
            d={plan.line}
            fill="none"
            stroke="#003047"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          {plan.pts.map((p, i) => (
            <g key={p.name}>
              <circle
                cx={p.x}
                cy={p.y}
                r={i === active ? 6 : 3}
                fill={i === active ? "#FDB614" : "#F7F4EC"}
                stroke="#003047"
                strokeWidth="1.5"
              />
              {i === active && (
                <text
                  x={p.x}
                  y={p.y - 13}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#003047"
                  fontWeight="600"
                >
                  {p.name}
                </text>
              )}
            </g>
          ))}
        </svg>

        <p className="mt-4 text-small text-ink-faint">
          North is up. Drag the profile, or use the arrow keys, to move along
          the route.
        </p>
      </div>
    </div>
  );
}
