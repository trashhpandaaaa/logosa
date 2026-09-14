"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";
import type { Trek, Waypoint } from "@/data/treks";
import { metres, clamp } from "@/lib/utils";

/**
 * The route, drawn as a section through the ground.
 *
 * Scrubbing it moves a marker along the profile and reads out the waypoint it
 * has reached. It is a real control, not a decoration: it works with a mouse,
 * with touch, and with the keyboard, and it reports the active waypoint
 * upward so the map can follow the same position.
 *
 * Altitude bands are drawn behind the section because they carry the actual
 * meaning of the shape — 3,000 m is where acclimatisation starts to matter and
 * 5,000 m is where it governs everything.
 */

const BANDS = [
  { at: 3000, label: "3,000 m" },
  { at: 4000, label: "4,000 m" },
  { at: 5000, label: "5,000 m" },
];

export default function ElevationProfile({
  trek,
  onActive,
}: {
  trek: Trek;
  /** Fired with the waypoint under the marker, for the map to follow. */
  onActive?: (w: Waypoint, index: number) => void;
}) {
  const id = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const [index, setIndex] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);

  const W = 1000;
  const H = 300;
  const PAD = { top: 26, right: 16, bottom: 34, left: 52 };

  const { points, maxKm, maxM, minM, area, line } = useMemo(() => {
    const ws = trek.waypoints;
    const maxKm = ws[ws.length - 1].km || 1;
    const hi = Math.max(...ws.map((w) => w.elevationM));
    const lo = Math.min(...ws.map((w) => w.elevationM));
    // Round the axis outward so the section sits on clean contour intervals.
    const maxM = Math.ceil((hi + 200) / 500) * 500;
    const minM = Math.max(0, Math.floor((lo - 200) / 500) * 500);

    const x = (km: number) =>
      PAD.left + (km / maxKm) * (W - PAD.left - PAD.right);
    const y = (m: number) =>
      PAD.top + (1 - (m - minM) / (maxM - minM)) * (H - PAD.top - PAD.bottom);

    const points = ws.map((w) => ({ ...w, cx: x(w.km), cy: y(w.elevationM) }));
    const line = points.map((p, i) => `${i ? "L" : "M"}${p.cx.toFixed(1)} ${p.cy.toFixed(1)}`).join("");
    const floor = H - PAD.bottom;
    const area = `${line}L${points[points.length - 1].cx.toFixed(1)} ${floor}L${points[0].cx.toFixed(1)} ${floor}Z`;

    return { points, maxKm, maxM, minM, area, line, x, y };
  }, [trek, PAD.left, PAD.right, PAD.top, PAD.bottom]);

  const active = trek.waypoints[index];

  const setActive = useCallback(
    (i: number) => {
      const next = clamp(i, 0, trek.waypoints.length - 1);
      setIndex(next);
      onActive?.(trek.waypoints[next], next);
    },
    [trek.waypoints, onActive],
  );

  /** Nearest waypoint to a pointer position, in SVG user units. */
  const pick = useCallback(
    (clientX: number) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const ux = ((clientX - rect.left) / rect.width) * W;
      let best = 0;
      let bestD = Infinity;
      points.forEach((p, i) => {
        const d = Math.abs(p.cx - ux);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      setActive(best);
    },
    [points, setActive],
  );

  const bands = BANDS.filter((b) => b.at > minM && b.at < maxM).map((b) => ({
    ...b,
    y: PAD.top + (1 - (b.at - minM) / (maxM - minM)) * (H - PAD.top - PAD.bottom),
  }));

  return (
    <figure className="not-prose">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-rule pb-4">
        <h3 className="label text-ink">Elevation profile</h3>
        <p className="label-slim">
          {trek.waypoints.length} waypoints · {Math.round(maxKm)} km ·
          high point {metres(Math.max(...trek.waypoints.map((w) => w.elevationM)))}
        </p>
      </figcaption>

      <div className="relative mt-6">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full touch-pan-y select-none"
          role="img"
          aria-label={`Elevation profile for ${trek.name}, from ${trek.waypoints[0].name} at ${trek.waypoints[0].elevationM} metres to a high point of ${Math.max(...trek.waypoints.map((w) => w.elevationM))} metres.`}
          onPointerDown={(e) => {
            setScrubbing(true);
            e.currentTarget.setPointerCapture(e.pointerId);
            pick(e.clientX);
          }}
          onPointerMove={(e) => scrubbing && pick(e.clientX)}
          onPointerUp={(e) => {
            setScrubbing(false);
            e.currentTarget.releasePointerCapture(e.pointerId);
          }}
          onPointerCancel={() => setScrubbing(false)}
        >
          <defs>
            <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#003047" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#003047" stopOpacity="0.03" />
            </linearGradient>
          </defs>

          {/* Altitude bands — the reason the shape matters */}
          {bands.map((b) => (
            <g key={b.at}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={b.y}
                y2={b.y}
                stroke="#003047"
                strokeOpacity="0.16"
                strokeDasharray="2 4"
              />
              <text
                x={PAD.left - 10}
                y={b.y + 4}
                textAnchor="end"
                className="numeral"
                fontSize="11"
                fill="#5b7d90"
              >
                {b.label}
              </text>
            </g>
          ))}

          {/* Ground */}
          <path d={area} fill={`url(#${id}-fill)`} />
          <path d={line} fill="none" stroke="#003047" strokeWidth="2" />

          {/* Waypoints */}
          {points.map((p, i) => (
            <g key={p.name}>
              <circle
                cx={p.cx}
                cy={p.cy}
                r={i === index ? 6 : 3.5}
                fill={i === index ? "#FDB614" : "#F7F4EC"}
                stroke="#003047"
                strokeWidth="1.6"
              />
              {p.high && i !== index && (
                /*
                  The high point is usually the last waypoint, so a centred
                  label runs off the right edge of the viewBox. Anchor it away
                  from whichever edge it is nearest.
                */
                <text
                  x={p.cx}
                  y={p.cy - 14}
                  textAnchor={
                    p.cx > W * 0.75 ? "end" : p.cx < W * 0.25 ? "start" : "middle"
                  }
                  fontSize="10"
                  fill="#5b7d90"
                  className="label"
                >
                  HIGH POINT
                </text>
              )}
            </g>
          ))}

          {/* Marker */}
          <line
            x1={points[index].cx}
            x2={points[index].cx}
            y1={PAD.top - 8}
            y2={H - PAD.bottom}
            stroke="#003047"
            strokeWidth="1"
          />

          {/* Distance axis */}
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={H - PAD.bottom}
            y2={H - PAD.bottom}
            stroke="#003047"
            strokeOpacity="0.3"
          />
          <text x={PAD.left} y={H - 12} fontSize="11" fill="#5b7d90" className="numeral">
            0 km
          </text>
          <text
            x={W - PAD.right}
            y={H - 12}
            textAnchor="end"
            fontSize="11"
            fill="#5b7d90"
            className="numeral"
          >
            {Math.round(maxKm)} km
          </text>
        </svg>

        {/* The control itself. A native range input carries the keyboard and
            screen-reader behaviour for free; it is visually laid over the
            profile rather than reimplemented. */}
        <label className="sr-only" htmlFor={`${id}-range`}>
          Move along the {trek.name} route
        </label>
        <input
          id={`${id}-range`}
          type="range"
          min={0}
          max={trek.waypoints.length - 1}
          step={1}
          value={index}
          onChange={(e) => setActive(Number(e.target.value))}
          aria-valuetext={`${active.name}, ${metres(active.elevationM)}, kilometre ${active.km}`}
          className="absolute inset-x-0 bottom-0 h-9 w-full cursor-ew-resize opacity-0"
        />
      </div>

      {/* Readout */}
      <div
        aria-live="polite"
        className="mt-6 grid-editorial items-baseline gap-y-3 border-t border-rule pt-5"
      >
        <div className="col-span-12 md:col-span-4">
          <p className="label-slim">Waypoint</p>
          <p className="mt-1 text-title text-ink">{active.name}</p>
        </div>
        <div className="col-span-4 md:col-span-2">
          <p className="label-slim">Elevation</p>
          <p className="numeral mt-1 text-title text-ink">{metres(active.elevationM)}</p>
        </div>
        <div className="col-span-4 md:col-span-2">
          <p className="label-slim">Distance</p>
          <p className="numeral mt-1 text-title text-ink">{active.km} km</p>
        </div>
        <div className="col-span-4 md:col-span-1">
          <p className="label-slim">Day</p>
          <p className="numeral mt-1 text-title text-ink">{active.day ?? "—"}</p>
        </div>
        {active.note && (
          <p className="col-span-12 mt-1 max-w-[52ch] text-body text-ink-soft md:col-span-3">
            {active.note}
          </p>
        )}
      </div>

      <p className="mt-5 text-small text-ink-faint">
        Distances are approximate and elevations are the commonly published
        figures for each settlement. This is a picture of the route, not a
        navigational document.
      </p>
    </figure>
  );
}
