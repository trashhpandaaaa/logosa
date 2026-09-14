/**
 * DHAKA — a constructed pattern system.
 *
 * Not a scanned or downloaded textile. Every motif here is authored as a
 * matrix of thread cells, because that is how dhaka (ढाका) is actually made:
 * the geometry is inlaid by hand on a loom, so every diagonal is a staircase
 * of warp and weft crossings. Smooth curves are the tell of a fake — real
 * dhaka steps.
 *
 * Motifs are drawn from the vocabulary of Nepali dhaka weaving: the hooked
 * lozenge (the "buti"), the eight-point star, and the running chevron border
 * that separates bands of pattern. They are simplified and reduced to a single
 * ink so they read as texture at low opacity, never as costume.
 *
 * Everything is parametric, so scale/weight/colour stay under art direction.
 */

/** A motif expressed as thread cells. `#` is a raised thread, `.` is ground. */
type Matrix = string[];

/**
 * The hooked lozenge — the central figure of most dhaka panels.
 * A stepped diamond outline enclosing a small cross "eye".
 */
const DIAMOND: Matrix = [
  "......#......",
  ".....###.....",
  "....##.##....",
  "...##...##...",
  "..##..#..##..",
  ".##..###..##.",
  "##..##.##..##",
  ".##..###..##.",
  "..##..#..##..",
  "...##...##...",
  "....##.##....",
  ".....###.....",
  "......#......",
];

/** The eight-point star, used as a filler between lozenges. */
const STAR: Matrix = [
  "...#...",
  ".#.#.#.",
  "..###..",
  "###.###",
  "..###..",
  ".#.#.#.",
  "...#...",
];

/** A small solid pip — the quietest unit in the system. */
const PIP: Matrix = ["...", ".#.", "..."];

/** Running chevron, the band that divides one field of pattern from the next. */
const CHEVRON: Matrix = ["...##...", "..####..", ".##..##.", "##....##"];

/** A stepped key border, used along frame edges. */
const KEY: Matrix = ["####....", "#..#....", "#..#####", "#......#"];

const MOTIFS = {
  diamond: DIAMOND,
  star: STAR,
  pip: PIP,
  chevron: CHEVRON,
  key: KEY,
} as const;

export type MotifName = keyof typeof MOTIFS;

export function motifSize(name: MotifName): { w: number; h: number } {
  const m = MOTIFS[name];
  return { w: m[0].length, h: m.length };
}

/**
 * Convert a thread matrix to a compact SVG path by merging horizontal runs.
 * One path for a whole motif keeps the DOM light enough to use these as
 * background textures without cost.
 */
function matrixToPath(matrix: Matrix, ox = 0, oy = 0, unit = 1): string {
  const parts: string[] = [];
  for (let y = 0; y < matrix.length; y++) {
    const row = matrix[y];
    let x = 0;
    while (x < row.length) {
      if (row[x] === "#") {
        let len = 1;
        while (x + len < row.length && row[x + len] === "#") len++;
        const px = (ox + x) * unit;
        const py = (oy + y) * unit;
        parts.push(
          `M${round(px)} ${round(py)}h${round(len * unit)}v${round(unit)}h${round(-len * unit)}z`,
        );
        x += len;
      } else {
        x++;
      }
    }
  }
  return parts.join("");
}

const round = (n: number) => Math.round(n * 1000) / 1000;

/** Path data for a single motif, centred on (cx, cy) in unit coordinates. */
export function motifPath(name: MotifName, cx = 0, cy = 0, unit = 1): string {
  const m = MOTIFS[name];
  return matrixToPath(m, cx - m[0].length / 2, cy - m.length / 2, unit);
}

export interface FieldOptions {
  /** Cell size in px. Larger = coarser weave. */
  unit?: number;
  /** Tile size in cells. */
  cells?: number;
  ink?: string;
  opacity?: number;
  /** Drop alternate rows by half a tile, as a real loom repeat does. */
  halfDrop?: boolean;
}

/**
 * A field of pattern for large surfaces. Lozenge at tile centre, stars at the
 * corners so the repeat knits together into a continuous cloth rather than a
 * grid of stamps.
 */
export function dhakaFieldSvg(opts: FieldOptions = {}): string {
  const { unit = 3, cells = 32, ink = "#003047", opacity = 1 } = opts;
  const size = cells * unit;

  let d = motifPath("diamond", cells / 2, cells / 2, unit);
  // Corner stars: drawn four times, clipped by the tile, so the repeat closes.
  for (const [cx, cy] of [
    [0, 0],
    [cells, 0],
    [0, cells],
    [cells, cells],
  ]) {
    d += motifPath("star", cx, cy, unit);
  }
  // Quiet pips on the diagonals keep the field from reading as a lattice.
  d += motifPath("pip", cells / 2, 0, unit);
  d += motifPath("pip", cells / 2, cells, unit);
  d += motifPath("pip", 0, cells / 2, unit);
  d += motifPath("pip", cells, cells / 2, unit);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><path d="${d}" fill="${ink}" fill-opacity="${opacity}" shape-rendering="crispEdges"/></svg>`;
}

export interface BandOptions {
  unit?: number;
  ink?: string;
  /** Include the hairlines that bound a woven band. */
  rules?: boolean;
}

/**
 * A running band — the horizontal divider between chapters. Chevron course
 * between two hairlines, exactly how a dhaka panel separates its fields.
 */
export function dhakaBandSvg(opts: BandOptions = {}): string {
  const { unit = 3, ink = "#003047", rules = true } = opts;
  const cw = 8; // chevron repeat width in cells
  const ch = 4;
  const pad = rules ? 3 : 1;
  const cells = ch + pad * 2;
  const w = cw * unit;
  const h = cells * unit;

  let d = matrixToPath(CHEVRON, 0, pad, unit);
  if (rules) {
    d += `M0 0h${round(w)}v${round(unit)}h${round(-w)}z`;
    d += `M0 ${round(h - unit)}h${round(w)}v${round(unit)}h${round(-w)}z`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="${d}" fill="${ink}" shape-rendering="crispEdges"/></svg>`;
}

/** A vertical key border for frame edges and image margins. */
export function dhakaKeySvg(opts: BandOptions = {}): string {
  const { unit = 3, ink = "#003047" } = opts;
  const w = 8 * unit;
  const h = 4 * unit;
  const d = matrixToPath(KEY, 0, 0, unit);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="${d}" fill="${ink}" shape-rendering="crispEdges"/></svg>`;
}

/** Encode SVG markup for use in a CSS url(). */
export function toDataUri(svg: string): string {
  const encoded = svg
    .replace(/"/g, "'")
    .replace(/%/g, "%25")
    .replace(/#/g, "%23")
    .replace(/</g, "%3C")
    .replace(/>/g, "%3E")
    .replace(/\s+/g, " ");
  return `url("data:image/svg+xml,${encoded}")`;
}
