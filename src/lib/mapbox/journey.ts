import { haversine, clamp, lerp } from "@/lib/utils";

/**
 * The map journey: a camera path and a route line, both driven by one scroll
 * progress value between 0 and 1.
 *
 * Cameras are interpolated and applied with `jumpTo`, never `flyTo`. flyTo runs
 * its own clock, so under a scrubbed scroll the two clocks fight and the camera
 * lags behind the scrollbar. Interpolating ourselves means the camera is a pure
 * function of scroll position — scrub backwards and it retraces exactly.
 */

export interface CameraState {
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
}

export interface Chapter extends CameraState {
  id: string;
  name: string;
}

/** Shortest angular path, so a camera never swings the long way round. */
function lerpBearing(a: number, b: number, t: number): number {
  let d = ((b - a) % 360 + 540) % 360 - 180;
  return a + d * t;
}

/** Ease applied between chapters — slow out of one place, slow into the next. */
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/**
 * Camera at a given journey progress.
 *
 * Each chapter gets a `hold` band around its own keyframe where the camera
 * barely moves, so a destination stays legible while its text is being read,
 * and the travelling happens in between. Without the hold the camera glides
 * continuously and nothing ever feels arrived at.
 */
export function cameraAt(chapters: Chapter[], progress: number, hold = 0.42): CameraState {
  const n = chapters.length;
  if (n === 1) return chapters[0];

  const p = clamp(progress, 0, 1) * (n - 1);
  const i = Math.min(n - 2, Math.floor(p));
  const local = p - i;

  // Remap the local 0..1 so the middle `hold` fraction is stationary.
  const edge = (1 - hold) / 2;
  let t: number;
  if (local < edge) t = 0;
  else if (local > 1 - edge) t = 1;
  else t = easeInOut((local - edge) / (1 - 2 * edge));

  const a = chapters[i];
  const b = chapters[i + 1];
  return {
    center: [lerp(a.center[0], b.center[0], t), lerp(a.center[1], b.center[1], t)],
    zoom: lerp(a.zoom, b.zoom, t),
    pitch: lerp(a.pitch, b.pitch, t),
    bearing: lerpBearing(a.bearing, b.bearing, t),
  };
}

/** Which chapter is currently "arrived at", for the text and marker states. */
export function activeChapter(chapters: Chapter[], progress: number): number {
  const p = clamp(progress, 0, 1) * (chapters.length - 1);
  return Math.round(p);
}

export type Coord = [number, number];

/**
 * Resample a coarse path into a smooth one.
 *
 * A line drawn straight between eight destinations looks like a flight plan.
 * A Catmull–Rom spline through the same points reads as a route, which is what
 * it is — the camera follows the ground between places, not the great circle.
 */
export function smoothPath(points: Coord[], segments = 24): Coord[] {
  if (points.length < 3) return points;
  const out: Coord[] = [];
  const pt = (i: number) => points[clamp(i, 0, points.length - 1)];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = pt(i - 1);
    const p1 = pt(i);
    const p2 = pt(i + 1);
    const p3 = pt(i + 2);
    for (let s = 0; s < segments; s++) {
      const t = s / segments;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 *
        (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(points[points.length - 1]);
  return out;
}

/** Cumulative distance along a path, in kilometres. */
export function cumulative(path: Coord[]): number[] {
  const acc = [0];
  for (let i = 1; i < path.length; i++) acc.push(acc[i - 1] + haversine(path[i - 1], path[i]));
  return acc;
}

/**
 * The leading portion of a path, as a fraction of its total length. Used to
 * draw the route progressively as the journey advances.
 */
export function slicePath(path: Coord[], fraction: number): Coord[] {
  const t = clamp(fraction, 0, 1);
  if (t <= 0) return [path[0]];
  if (t >= 1) return path;

  const acc = cumulative(path);
  const target = acc[acc.length - 1] * t;

  const out: Coord[] = [];
  for (let i = 0; i < path.length; i++) {
    if (acc[i] <= target) {
      out.push(path[i]);
      continue;
    }
    // Interpolate the final partial segment so the line grows smoothly rather
    // than snapping forward one vertex at a time.
    const prev = acc[i - 1];
    const f = (target - prev) / (acc[i] - prev);
    out.push([lerp(path[i - 1][0], path[i][0], f), lerp(path[i - 1][1], path[i][1], f)]);
    break;
  }
  return out.length > 1 ? out : [path[0], path[0]];
}

export const lineFeature = (coords: Coord[]) =>
  ({
    type: "Feature" as const,
    properties: {},
    geometry: { type: "LineString" as const, coordinates: coords },
  });
