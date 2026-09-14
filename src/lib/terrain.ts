/**
 * TERRAIN — the drawing engine behind Logosa's illustration language.
 *
 * The logo's mountains are drawn, not photographed: hard ridgelines, faceted
 * snow, layered ghost ranges receding into haze. This module reproduces that
 * grammar procedurally so every illustrated surface on the site — the hero
 * scene, destination plates, the atlas — comes out of one hand.
 *
 * Ridges are built the way real ones look: a low-frequency envelope of summits
 * with fractal midpoint displacement layered on top, so detail sharpens toward
 * the peaks and softens in the valleys. Everything is seeded, so a given
 * destination always draws the same mountain.
 */

/** Deterministic PRNG. Same seed, same mountain, every build. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedFrom(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export interface Pt {
  x: number;
  y: number;
}

export interface RidgeOptions {
  seed: number;
  /**
   * Number of vertices across the ridge. Deliberately low: the illustration
   * is faceted, so rock reads as straight planes meeting at crags, not as a
   * smooth noise curve. 40–80 is the drawn range.
   */
  vertices?: number;
  /** Dominant summits. Fewer + higher = Himalayan; more + lower = foothills. */
  peaks?: number;
  /** 0..1 overall height of the range. */
  height?: number;
  /** How jagged the crags are, 0..1. */
  roughness?: number;
  /**
   * Flank profile. Below 1 the faces are concave and flare at the base — the
   * Himalayan silhouette. Above 1 they bulge, which reads as older, softer hill.
   */
  flank?: number;
}

/**
 * Generate a ridgeline as vertices in a 0..1 box.
 * y = 0 is the baseline, y = 1 is the highest possible summit.
 *
 * Two layers: a piecewise envelope of summits with near-straight faces, plus
 * band-limited fractal detail. The detail is cut off well above the sampling
 * frequency so it produces crags of a drawable size instead of fuzz.
 */
export function ridgeline(opts: RidgeOptions): Pt[] {
  const { seed, vertices = 56, peaks = 3, height = 0.8, roughness = 0.5, flank = 0.95 } = opts;
  const rand = rng(seed);

  // Summits, spaced so they overlap into a range rather than standing apart.
  const summits: { x: number; h: number; w: number }[] = [];
  for (let i = 0; i < peaks; i++) {
    const slot = (i + 0.5) / peaks;
    summits.push({
      x: slot + (rand() - 0.5) * (0.7 / peaks),
      h: 0.58 + rand() * 0.42,
      w: (0.62 + rand() * 0.5) / peaks,
    });
  }
  // Every range has a lead peak. Without one the silhouette reads as bumps.
  const lead = Math.floor(rand() * peaks);
  summits[lead].h = 1;
  summits[lead].w *= 1.3;

  // Straight-faced peak: sharp at the apex, flaring into the valley floor.
  const envelope = (x: number) => {
    let y = 0;
    for (const s of summits) {
      const d = Math.abs(x - s.x) / s.w;
      if (d < 1) y = Math.max(y, s.h * Math.pow(1 - d, flank));
    }
    return y;
  };

  // Band-limited midpoint displacement. `octaves` caps the finest wavelength
  // so crags stay large enough to read as drawn geology.
  const octaves = 4;
  const n = 1 << octaves;
  const detail = new Float64Array(n + 1);
  let step = n;
  let amp = 1;
  while (step > 1) {
    const half = step >> 1;
    for (let i = half; i <= n; i += step) {
      detail[i] = (detail[i - half] + detail[i + half]) / 2 + (rand() - 0.5) * amp * 2;
    }
    step = half;
    amp *= roughness;
  }
  // Sample the coarse detail with linear interpolation between its nodes.
  const detailAt = (x: number) => {
    const t = x * n;
    const i = Math.min(n - 1, Math.floor(t));
    return detail[i] + (detail[i + 1] - detail[i]) * (t - i);
  };

  const pts: Pt[] = [];
  for (let i = 0; i < vertices; i++) {
    const x = i / (vertices - 1);
    const e = envelope(x);
    // Crags bite hardest on the upper faces and die out toward the valley.
    const y = Math.max(0, e + detailAt(x) * 0.17 * Math.pow(e, 0.6));
    pts.push({ x, y: Math.min(1, y) * height });
  }

  // Nail the endpoints to the baseline so ranges tuck behind one another.
  pts[0].y *= 0.35;
  pts[pts.length - 1].y *= 0.35;
  return pts;
}

const f = (n: number) => Math.round(n * 100) / 100;

/** Close a ridgeline into a filled silhouette against a baseline. */
export function ridgePath(pts: Pt[], w: number, h: number, baseline = 1): string {
  const px = (p: Pt) => `${f(p.x * w)} ${f((1 - p.y) * h)}`;
  let d = `M0 ${f(baseline * h)}L${px(pts[0])}`;
  for (let i = 1; i < pts.length; i++) d += `L${px(pts[i])}`;
  d += `L${f(w)} ${f(baseline * h)}Z`;
  return d;
}

/** Open ridgeline stroke — used for contour and atlas linework. */
export function ridgeStroke(pts: Pt[], w: number, h: number): string {
  return pts.map((p, i) => `${i ? "L" : "M"}${f(p.x * w)} ${f((1 - p.y) * h)}`).join("");
}

/**
 * Faceted snow caps, in the logo's idiom: angular white plates that sit on the
 * summit and break into irregular tongues where they meet bare rock.
 */
export function snowCaps(
  pts: Pt[],
  w: number,
  h: number,
  snowline: number,
  seed: number,
): string[] {
  const rand = rng(seed ^ 0x5eed);
  const caps: string[] = [];
  const px = (x: number, y: number) => `${f(x * w)} ${f((1 - y) * h)}`;
  let run: Pt[] = [];

  const flush = () => {
    // A plate needs enough summit to sit on.
    if (run.length < 3) {
      run = [];
      return;
    }
    let d = `M${px(run[0].x, run[0].y)}`;
    for (let i = 1; i < run.length; i++) d += `L${px(run[i].x, run[i].y)}`;

    // Lower edge: a coarse angular boundary, sampled at a stride so it reads
    // as cut planes of snow rather than as noise. Occasional tongues run down
    // the gullies, which is where snow actually survives lowest.
    const stride = Math.max(2, Math.round(run.length / (2.5 + rand() * 2.5)));
    for (let i = run.length - 1 - stride; i > 0; i -= stride) {
      const p = run[i];
      const above = p.y - snowline;
      // Mostly a shallow cut just below the crest; occasionally a tongue
      // running down a gully, which is where snow actually survives lowest.
      const tongue = rand() < 0.25 ? 1.15 + rand() * 0.5 : 0.3 + rand() * 0.35;
      d += `L${px(p.x, p.y - above * tongue)}`;
    }
    // Pin both ends to the ridge so the plate tapers into bare rock.
    caps.push(d + `L${px(run[0].x, run[0].y)}Z`);
    run = [];
  };

  for (const p of pts) {
    if (p.y >= snowline) run.push(p);
    else flush();
  }
  flush();
  return caps;
}

/**
 * Shadow planes on the leeward flank. In the logo each summit reads as solid
 * because one whole face is a darker plane, bounded by the ridge above and a
 * straight cut below. That single device is what makes flat colour look carved.
 */
export function shadowFacets(pts: Pt[], w: number, h: number, seed: number): string[] {
  const rand = rng(seed ^ 0xf00d);
  const px = (x: number, y: number) => `${f(x * w)} ${f((1 - y) * h)}`;
  const out: string[] = [];

  for (let i = 2; i < pts.length - 3; i++) {
    const isSummit =
      pts[i].y > pts[i - 1].y &&
      pts[i].y > pts[i - 2].y &&
      pts[i].y >= pts[i + 1].y &&
      pts[i].y > pts[i + 2].y &&
      pts[i].y > 0.3;
    if (!isSummit) continue;

    // Light falls from the left throughout the identity, so the right-hand
    // face of every summit is the shaded one. Consistency is what makes flat
    // colour read as a single carved object rather than as separate shapes.
    //
    // The face must span the entire flank — summit to the foot of the peak.
    // Shading any narrower slice produces a stripe down the mountain instead
    // of a plane, which is the difference between carved and striped.
    let end = i + 1;
    while (end < pts.length - 1 && pts[end + 1].y <= pts[end].y) end++;
    if (end - i < 3) continue;

    let d = `M${px(pts[i].x, pts[i].y)}`;
    for (let j = i + 1; j <= end; j++) d += `L${px(pts[j].x, pts[j].y)}`;
    // Close down the fall line beneath the summit, so the plane reaches the
    // valley floor rather than floating on the flank.
    d += `L${px(pts[end].x, 0)}L${px(pts[i].x, 0)}Z`;
    out.push(d);
    i = end; // one face per summit
  }
  return out;
}

/**
 * A still water plane — the lake at the foot of the logo. An irregular ellipse
 * so it reads as drawn rather than as a CSS shape.
 */
export function waterPath(
  w: number,
  h: number,
  y: number,
  seed: number,
  width = 0.3,
): string {
  const rand = rng(seed ^ 0x1a4e);
  const cy = y * h;
  const rx = w * width;
  const ry = h * 0.045;
  const steps = 28;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const wobble = 1 + (rand() - 0.5) * 0.16;
    const x = w / 2 + Math.cos(t) * rx * wobble;
    const yy = cy + Math.sin(t) * ry * wobble;
    d += `${i ? "L" : "M"}${f(x)} ${f(yy)}`;
  }
  return d + "Z";
}

/** Prayer-flag line: a catenary between two points, with flags hung from it. */
export function prayerFlagLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  sag: number,
  count: number,
) {
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2 + sag;
  const curve = `M${f(x1)} ${f(y1)}Q${f(cx)} ${f(cy)} ${f(x2)} ${f(y2)}`;

  const at = (t: number) => ({
    x: (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2,
    y: (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2,
  });

  // The five Tibetan Buddhist element colours, in their fixed traditional
  // order: blue (sky), white (air), red (fire), green (water), yellow (earth).
  const COLOURS = ["#2E6FA8", "#F4F1E8", "#C0392B", "#2F7D4F", "#FDB614"];
  const flags = [];
  for (let i = 0; i < count; i++) {
    const t = (i + 0.6) / (count + 0.6);
    const p = at(t);
    const p2 = at(Math.min(1, t + 0.004));
    const angle = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;
    flags.push({ ...p, angle, colour: COLOURS[i % 5], index: i });
  }
  return { curve, flags };
}
