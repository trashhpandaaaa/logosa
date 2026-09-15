import { useMemo } from "react";
import { prayerFlagLine } from "@/lib/terrain";

/**
 * The drawn sky that frames the opening.
 *
 * The mountains here used to be illustrated — faceted planes and hard snow,
 * the logo's own grammar drawn across the page — and the real survey of
 * Everest dissolved out of them on scroll. The survey now carries the bottom
 * of the frame from the first paint, so what is left of the drawing is the
 * light around it: a gold sun on the horizon, and a line of prayer flags
 * across the head of the page.
 *
 * Both are set in the same 1440 × 900 frame, anchored to the bottom edge, so
 * they hold their position against the terrain band at any viewport size.
 *
 * They are two exports rather than one because they sit on opposite sides of
 * the WebGL canvas: in the logo the sun is behind the rock — a disc mostly
 * occluded, with only its upper arc in open sky — while the flags are strung
 * in front of everything. Drawn as one layer the sun floats over the summit
 * and the whole composition reads as clipart.
 */

const W = 1440;
const H = 900;

/**
 * Where the mountain crosses the frame, as a fraction of frame height. This
 * is not a line anything is drawn against any more — it is the camera in
 * `EverestTerrain` that puts the ridge here — but the sun has to be set
 * against the same horizon, so the two are kept written down together.
 */
const HORIZON = 0.82;

/**
 * Where the sun stands.
 *
 * Off the survey's tallest peak rather than in the saddle beside it, so the
 * disc is cut by rock — and left of the twelfth-column gutter, because the
 * supporting line is set in the right-hand column and a gold disc behind a
 * paragraph turns both to mud.
 */
const SUN = { x: 0.55, y: HORIZON - 0.015, r: 0.135 };

/**
 * The shared plate.
 *
 * Both drawings are cut from the same 1440 × 900 frame, but they are pinned to
 * different edges of it, because they are attached to different things: the
 * sun sits on the horizon, which is the bottom of the frame, and the flags
 * hang from the head of it. Pin both to the same edge and one of them drifts
 * — on a phone, a bottom-pinned flag line lands across the summit caption.
 */
function Plate({
  children,
  anchor = "xMidYMax",
}: {
  children: React.ReactNode;
  anchor?: "xMidYMax" | "xMaxYMin";
}) {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio={`${anchor} slice`}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/**
 * Dawn behind the massif. Rendered under the canvas and occluded by rock.
 *
 * Three parts, and the disc is the least of them. A flat gold circle on paper
 * is a sticker: it has a hard edge, it warms nothing around it, and it sits on
 * the page rather than in the sky. So the light comes first — a wide, very
 * faint wash of gold in the air — then two hairline rings in the same gold the
 * terrain shader draws its contours in, which puts the sun in the atlas's
 * register rather than the poster's, and only then the disc, graded from a
 * warmer crown to the deeper gold the palette keeps for type.
 */
export function Sun() {
  const cx = W * SUN.x;
  const cy = H * SUN.y;
  const r = H * SUN.r;

  return (
    <Plate>
      <defs>
        <radialGradient id="logosa-sun-air">
          <stop offset="0%" stopColor="#FDB614" stopOpacity="0.3" />
          <stop offset="45%" stopColor="#FDB614" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#FDB614" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="logosa-sun-disc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFC63F" />
          <stop offset="58%" stopColor="#FDB614" />
          <stop offset="100%" stopColor="#E39A06" />
        </linearGradient>
      </defs>

      <circle cx={cx} cy={cy} r={r * 2.7} fill="url(#logosa-sun-air)" />
      <circle
        cx={cx}
        cy={cy}
        r={r * 1.34}
        fill="none"
        stroke="#FDB614"
        strokeOpacity="0.4"
        strokeWidth="1.4"
      />
      <circle
        cx={cx}
        cy={cy}
        r={r * 1.72}
        fill="none"
        stroke="#FDB614"
        strokeOpacity="0.22"
        strokeWidth="1.2"
      />
      <circle cx={cx} cy={cy} r={r} fill="url(#logosa-sun-disc)" />
    </Plate>
  );
}

/** Prayer flags, hung clear of the navigation bar. Rendered over the canvas. */
export function PrayerFlags() {
  // Both numbers here are set by the phone, not by this frame.
  //
  // A narrow viewport crops this plate to a slice about a third of its width,
  // and whatever part of the line falls in that slice is drawn clean across
  // the phone. So the line's *start* fixes where the flags cross — they have
  // to land between the summit caption above and the headline below — and its
  // *rake* fixes how thick a band they cut, because a steep line seen through
  // a narrow window drops a long way and lands on both.
  const line = useMemo(
    () => prayerFlagLine(W * 0.4, H * 0.19, W * 1.02, H * 0.3, 34, 8),
    [],
  );

  return (
    <Plate anchor="xMaxYMin">
      <path d={line.curve} fill="none" stroke="#003047" strokeWidth="1.6" />
      {line.flags.map((f) => (
        <g
          key={f.index}
          transform={`translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) rotate(${f.angle.toFixed(1)})`}
        >
          <rect width="26" height="34" fill={f.colour} stroke="#003047" strokeWidth="0.9" />
        </g>
      ))}
    </Plate>
  );
}
