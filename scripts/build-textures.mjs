/**
 * Generates the static Dhaka texture files used by CSS backgrounds.
 * Run: node scripts/build-textures.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "textures");
mkdirSync(out, { recursive: true });

// Inlined from src/lib/dhaka.ts so the script stays dependency-free.
const DIAMOND = [
  "......#......", ".....###.....", "....##.##....", "...##...##...",
  "..##..#..##..", ".##..###..##.", "##..##.##..##", ".##..###..##.",
  "..##..#..##..", "...##...##...", "....##.##....", ".....###.....",
  "......#......",
];
const STAR = ["...#...", ".#.#.#.", "..###..", "###.###", "..###..", ".#.#.#.", "...#..."];
const PIP = ["...", ".#.", "..."];
const CHEVRON = ["...##...", "..####..", ".##..##.", "##....##"];
const KEY = ["####....", "#..#....", "#..#####", "#......#"];
const M = { diamond: DIAMOND, star: STAR, pip: PIP, chevron: CHEVRON, key: KEY };

const r = (n) => Math.round(n * 1000) / 1000;

function matrixToPath(matrix, ox = 0, oy = 0, unit = 1) {
  const parts = [];
  for (let y = 0; y < matrix.length; y++) {
    const row = matrix[y];
    let x = 0;
    while (x < row.length) {
      if (row[x] === "#") {
        let len = 1;
        while (x + len < row.length && row[x + len] === "#") len++;
        parts.push(
          `M${r((ox + x) * unit)} ${r((oy + y) * unit)}h${r(len * unit)}v${r(unit)}h${r(-len * unit)}z`,
        );
        x += len;
      } else x++;
    }
  }
  return parts.join("");
}
const motifPath = (name, cx, cy, unit) =>
  matrixToPath(M[name], cx - M[name][0].length / 2, cy - M[name].length / 2, unit);

function fieldSvg({ unit = 3, cells = 32, ink = "#003047" } = {}) {
  const size = cells * unit;
  let d = motifPath("diamond", cells / 2, cells / 2, unit);
  for (const [cx, cy] of [[0, 0], [cells, 0], [0, cells], [cells, cells]])
    d += motifPath("star", cx, cy, unit);
  for (const [cx, cy] of [[cells / 2, 0], [cells / 2, cells], [0, cells / 2], [cells, cells / 2]])
    d += motifPath("pip", cx, cy, unit);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><path d="${d}" fill="${ink}" shape-rendering="crispEdges"/></svg>`;
}

function bandSvg({ unit = 3, ink = "#003047", rules = true } = {}) {
  const pad = rules ? 3 : 1;
  const cells = 4 + pad * 2;
  const w = 8 * unit;
  const h = cells * unit;
  let d = matrixToPath(CHEVRON, 0, pad, unit);
  if (rules) {
    d += `M0 0h${r(w)}v${r(unit)}h${r(-w)}z`;
    d += `M0 ${r(h - unit)}h${r(w)}v${r(unit)}h${r(-w)}z`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="${d}" fill="${ink}" shape-rendering="crispEdges"/></svg>`;
}

function keySvg({ unit = 3, ink = "#003047" } = {}) {
  const d = matrixToPath(KEY, 0, 0, unit);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${8 * unit}" height="${4 * unit}" viewBox="0 0 ${8 * unit} ${4 * unit}"><path d="${d}" fill="${ink}" shape-rendering="crispEdges"/></svg>`;
}

const files = {
  "dhaka-field.svg": fieldSvg({ unit: 3, cells: 32 }),
  "dhaka-field-coarse.svg": fieldSvg({ unit: 5, cells: 32 }),
  "dhaka-band.svg": bandSvg({ unit: 3 }),
  "dhaka-band-fine.svg": bandSvg({ unit: 2, rules: false }),
  "dhaka-key.svg": keySvg({ unit: 3 }),
};

for (const [name, svg] of Object.entries(files)) {
  writeFileSync(join(out, name), svg);
  console.log(`  ${name}  ${svg.length}B`);
}
console.log(`\nWrote ${Object.keys(files).length} textures to public/textures/`);
