import { useMemo } from "react";
import {
  ridgeline,
  ridgePath,
  snowCaps,
  shadowFacets,
  prayerFlagLine,
  seedFrom,
} from "@/lib/terrain";

/**
 * The illustrated range that opens the site.
 *
 * This is the "before" of the hero's central transition. The logo draws its
 * mountains — faceted planes, hard snow, ghost ranges receding into haze — and
 * this reproduces that grammar procedurally so the opening frame is the logo's
 * own world, extended across the page. Scrolling dissolves it into the real
 * survey of Everest underneath.
 *
 * The sun sits on the horizon and is occluded by the lead range, which is both
 * how a sunrise actually looks and how the logo composes it: gold behind rock,
 * never a flat disc floating beside the wordmark.
 */

const W = 1440;
const H = 900;

/**
 * Horizon, as a fraction of frame height. Kept low: the ranges are the floor
 * of the composition, not its subject. Raised any further they swallow the
 * headline, and navy display type on navy rock is unreadable.
 */
const HORIZON = 0.82;

export default function DrawnRange() {
  const scene = useMemo(() => {
    const seed = seedFrom("logosa-hero");
    const baseY = HORIZON * H;

    /** Place a range so its baseline sits on the horizon. */
    const layer = (
      pts: ReturnType<typeof ridgeline>,
      amp: number,
      drop: number,
    ) => ({
      pts,
      amp,
      y: baseY + drop - amp,
      // Close the fill well below the frame so no range floats.
      close: (H - baseY - drop + amp) / amp,
    });

    // Peak counts are high and roughness is generous: across a 1440-wide
    // frame, four summits render as bare triangles. Crags are what make the
    // silhouette read as drawn geology rather than as a chart.
    const far = layer(
      ridgeline({ seed: seed + 41, peaks: 11, height: 0.5, roughness: 0.6, flank: 1.1, vertices: 76 }),
      H * 0.2,
      0,
    );
    const mid = layer(
      ridgeline({ seed: seed + 17, peaks: 8, height: 0.6, roughness: 0.58, flank: 1.0, vertices: 72 }),
      H * 0.17,
      H * 0.025,
    );
    const lead = layer(
      ridgeline({ seed, peaks: 6, height: 0.95, roughness: 0.55, flank: 0.94, vertices: 80 }),
      H * 0.19,
      H * 0.06,
    );

    return {
      far,
      mid,
      lead,
      leadSnow: snowCaps(lead.pts, W, lead.amp, 0.52, seed),
      leadFacets: shadowFacets(lead.pts, W, lead.amp, seed),
      flags: prayerFlagLine(W * 0.40, H * 0.14, W * 1.02, H * 0.33, 34, 8),
    };
  }, []);

  const { far, mid, lead } = scene;

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      {/* The sun, on the horizon and behind the rock */}
      <circle cx={W * 0.62} cy={HORIZON * H - H * 0.015} r={H * 0.135} fill="#FDB614" opacity="0.92" />

      {/* Ranges, receding into haze */}
      <g transform={`translate(0 ${far.y.toFixed(1)})`}>
        <path d={ridgePath(far.pts, W, far.amp, far.close)} fill="#BFD1E0" opacity="0.75" />
      </g>
      <g transform={`translate(0 ${mid.y.toFixed(1)})`}>
        <path d={ridgePath(mid.pts, W, mid.amp, mid.close)} fill="#8FAAC4" opacity="0.85" />
      </g>
      <g transform={`translate(0 ${lead.y.toFixed(1)})`}>
        <path d={ridgePath(lead.pts, W, lead.amp, lead.close)} fill="#003047" />
        {scene.leadFacets.map((d, i) => (
          <path key={`f${i}`} d={d} fill="#00212F" opacity="0.55" />
        ))}
        {scene.leadSnow.map((d, i) => (
          <path key={`s${i}`} d={d} fill="#F4F7FA" />
        ))}
      </g>

      {/* Prayer flags, hung clear of the navigation bar */}
      <path d={scene.flags.curve} fill="none" stroke="#003047" strokeWidth="1.6" />
      {scene.flags.flags.map((f) => (
        <g
          key={f.index}
          transform={`translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) rotate(${f.angle.toFixed(1)})`}
        >
          <rect width="26" height="34" fill={f.colour} stroke="#003047" strokeWidth="0.9" />
        </g>
      ))}
    </svg>
  );
}
