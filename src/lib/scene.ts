/**
 * SCENE — composed illustrations in the Logosa drawing language.
 *
 * One engine, five scene types. A Terai plain and a Khumbu valley are not the
 * same picture recoloured; they are built from different elements, because the
 * point of the journey is that these places do not look alike. What holds them
 * together is the palette, the faceting, and the flat planes of light and
 * shade taken from the logo.
 *
 * Every scene is seeded from its own name, so a destination always draws the
 * same picture across builds, and returns named layers so the hero can animate
 * them independently.
 */

import {
  ridgeline,
  ridgePath,
  snowCaps,
  shadowFacets,
  waterPath,
  prayerFlagLine,
  rng,
  seedFrom,
  type Pt,
} from "./terrain";

export type SceneKind = "alpine" | "lake" | "valley" | "jungle" | "plain";

export interface ScenePalette {
  sky: string;
  sun: string;
  ghost: [string, string, string];
  massif: string;
  shade: string;
  snow: string;
  water: string;
  accent: string;
}

/** Dawn: the light in the logo. Gold disc, cool ranges, warm ground. */
export const PALETTE: Record<string, ScenePalette> = {
  dawn: {
    sky: "#F7F4EC",
    sun: "#FDB614",
    ghost: ["#C6D6E3", "#A2BAD0", "#7797B5"],
    massif: "#003047",
    shade: "#00212F",
    snow: "#F4F7FA",
    water: "#2E8BA6",
    accent: "#B4542A",
  },
  dusk: {
    sky: "#EFE7D8",
    sun: "#E39A06",
    ghost: ["#C9C3C4", "#A08E96", "#6E6274"],
    massif: "#0B2436",
    shade: "#04161F",
    snow: "#EFEFF4",
    water: "#1B6478",
    accent: "#B4542A",
  },
  jungle: {
    sky: "#F2F1E4",
    sun: "#FDB614",
    ghost: ["#CBD8C4", "#9DB79A", "#6E8F73"],
    massif: "#2F5D50",
    shade: "#1E3E36",
    snow: "#EAF1EA",
    water: "#2E8BA6",
    accent: "#B4542A",
  },
  plain: {
    sky: "#F7F1E2",
    sun: "#FDB614",
    ghost: ["#DCD6C4", "#C0BCA6", "#9AA089"],
    massif: "#3E5B4B",
    shade: "#1E3226",
    snow: "#F4F7FA",
    water: "#2E8BA6",
    accent: "#B4542A",
  },
};

export interface SceneOptions {
  kind: SceneKind;
  seed: string;
  width?: number;
  height?: number;
  palette?: ScenePalette;
  /** Prayer flags across a corner. Used in the hero, sparingly elsewhere. */
  flags?: boolean;
  sun?: boolean;
}

export interface Scene {
  width: number;
  height: number;
  /** Named layers, each a string of SVG elements, for independent animation. */
  layers: {
    sky: string;
    sun: string;
    ghostFar: string;
    ghostMid: string;
    ghostNear: string;
    massif: string;
    detail: string;
    water: string;
    flags: string;
  };
}

const f = (n: number) => Math.round(n * 100) / 100;

/** Layer transform helper: place a range with its base at y and height A. */
const at = (baseY: number, A: number, inner: string) =>
  `<g transform="translate(0 ${f(baseY - A)})">${inner}</g>`;

/** A tiered pagoda silhouette — proportions taken from Newar temple massing:
 *  each roof steps in by about a fifth and the plinth carries three courses. */
function pagoda(
  x: number,
  baseY: number,
  h: number,
  fill: string,
  tiers = 3,
  widthRatio = 0.66,
): string {
  const w = h * widthRatio;
  let d = "";

  // Plinth: three receding courses across the bottom eighth.
  const plinthH = h * 0.13;
  for (let i = 0; i < 3; i++) {
    const pw = w * (1.12 - i * 0.1);
    const py = baseY - (i * plinthH) / 3;
    d += `M${f(x - pw / 2)} ${f(py)}h${f(pw)}v${f(-plinthH / 3)}h${f(-pw)}z`;
  }

  // Roofs spread across the whole body, not stacked at its foot — the storeys
  // between them are what make the silhouette read as a tiered temple.
  const bodyBase = baseY - plinthH;
  const bodyH = h - plinthH;
  let topOfRoof = bodyBase;
  for (let i = 0; i < tiers; i++) {
    const t = i / Math.max(1, tiers - 1);
    const rw = w * (1 - t * 0.36);
    const ry = bodyBase - bodyH * (0.2 + t * 0.62);
    const rh = bodyH * 0.15;
    // Wall carrying this roof, drawn first so the eaves overhang it.
    const sw = rw * 0.5;
    d += `M${f(x - sw / 2)} ${f(ry)}h${f(sw)}v${f(-bodyH * 0.24)}h${f(-sw)}z`;
    // Roof: shallow trapezoid with upturned eaves, cut as straight planes.
    d +=
      `M${f(x - rw * 0.62)} ${f(ry)}` +
      `L${f(x - rw * 0.52)} ${f(ry - rh * 0.2)}` +
      `L${f(x - rw * 0.3)} ${f(ry - rh)}` +
      `L${f(x + rw * 0.3)} ${f(ry - rh)}` +
      `L${f(x + rw * 0.52)} ${f(ry - rh * 0.2)}` +
      `L${f(x + rw * 0.62)} ${f(ry)}Z`;
    topOfRoof = ry - rh;
  }

  // Finial — a gajur, seated directly on the top roof. Any gap beneath it and
  // it reads as a pin floating over the building.
  d += `M${f(x - h * 0.012)} ${f(topOfRoof + 1)}h${f(h * 0.024)}v${f(-h * 0.05)}h${f(-h * 0.024)}z`;
  d += `M${f(x - h * 0.028)} ${f(topOfRoof - h * 0.045)}L${f(x)} ${f(topOfRoof - h * 0.095)}L${f(x + h * 0.028)} ${f(topOfRoof - h * 0.045)}Z`;
  return `<path d="${d}" fill="${fill}"/>`;
}

/**
 * A flight of birds. The logo carries three, and they are the one element that
 * gives an otherwise still drawing a sense of air. Used only where a scene has
 * a large empty sky to carry them.
 */
function birds(x: number, y: number, scale: number, seed: number, fill: string): string {
  const rand = rng(seed);
  let out = "";
  for (let i = 0; i < 3; i++) {
    const bx = x + (i - 1) * scale * 2.6 + (rand() - 0.5) * scale;
    const by = y + (rand() - 0.5) * scale * 2.4;
    const sc = scale * (0.7 + rand() * 0.5);
    out +=
      `<path d="M${f(bx - sc)} ${f(by)}q${f(sc * 0.5)} ${f(-sc * 0.62)} ${f(sc)} 0` +
      `q${f(sc * 0.5)} ${f(-sc * 0.62)} ${f(sc)} 0" fill="none" stroke="${fill}" ` +
      `stroke-width="${f(sc * 0.19)}" stroke-linecap="round" opacity="0.75"/>`;
  }
  return out;
}

/** A stupa dome with a stepped harmika — Boudhanath's massing, simplified. */
function stupa(x: number, baseY: number, h: number, fill: string): string {
  const r = h * 0.42;
  let d = "";
  for (let i = 0; i < 3; i++) {
    const pw = r * (2.5 - i * 0.35);
    const py = baseY - i * h * 0.06;
    d += `M${f(x - pw / 2)} ${f(py)}h${f(pw)}v${f(-h * 0.06)}h${f(-pw)}z`;
  }
  const domeY = baseY - h * 0.18;
  d += `M${f(x - r)} ${f(domeY)}a${f(r)} ${f(r * 0.92)} 0 0 1 ${f(r * 2)} 0Z`;
  const hw = r * 0.44;
  d += `M${f(x - hw)} ${f(domeY - r * 0.9)}h${f(hw * 2)}v${f(-h * 0.1)}h${f(-hw * 2)}z`;
  // Stepped spire
  for (let i = 0; i < 5; i++) {
    const sw = hw * 1.5 * (1 - i * 0.16);
    const sy = domeY - r * 0.9 - h * 0.1 - i * h * 0.045;
    d += `M${f(x - sw / 2)} ${f(sy)}h${f(sw)}v${f(-h * 0.045)}h${f(-sw)}z`;
  }
  return `<path d="${d}" fill="${fill}"/>`;
}

/** A band of sal-forest canopy: overlapping crowns with a flat base. */
function canopy(
  w: number,
  baseY: number,
  h: number,
  seed: number,
  fill: string,
  count: number,
): string {
  const rand = rng(seed);
  // Crowns overlap heavily and are broad rather than pointed. Spiky triangles
  // read as a saw blade; sal forest reads as a mass with a lumpy top edge.
  const step = w / count;
  let d = `M${f(-step)} ${f(baseY)}`;
  for (let i = -1; i <= count + 1; i++) {
    const x = i * step + (rand() - 0.5) * step * 0.3;
    const ch = h * (0.7 + rand() * 0.6);
    const cw = step * (1.15 + rand() * 0.55);
    d += `L${f(x - cw / 2)} ${f(baseY - ch * 0.42)}`;
    d += `L${f(x - cw * 0.3)} ${f(baseY - ch * 0.94)}`;
    d += `L${f(x)} ${f(baseY - ch)}`;
    d += `L${f(x + cw * 0.3)} ${f(baseY - ch * 0.94)}`;
    d += `L${f(x + cw / 2)} ${f(baseY - ch * 0.42)}`;
  }
  d += `L${f(w + step)} ${f(baseY)}L${f(w + step)} ${f(baseY + h * 3)}L${f(-step)} ${f(baseY + h * 3)}Z`;
  return `<path d="${d}" fill="${fill}"/>`;
}

/** Terraced hillside — the stepped fields of the middle hills, as hairlines. */
function terraces(
  pts: Pt[],
  w: number,
  A: number,
  baseY: number,
  stroke: string,
  count: number,
): string {
  let out = "";
  for (let i = 1; i <= count; i++) {
    const t = i / (count + 1);
    // Each contour follows the ridge, flattened toward the valley floor.
    const d = pts
      .map((p, j) => {
        const y = baseY - (1 - t) * (p.y * A) - t * 6;
        return `${j ? "L" : "M"}${f(p.x * w)} ${f(y)}`;
      })
      .join("");
    out += `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="1" opacity="${(0.5 - t * 0.32).toFixed(2)}"/>`;
  }
  return out;
}

export function buildScene(opts: SceneOptions): Scene {
  const {
    kind,
    seed: seedStr,
    width: W = 1200,
    height: H = 800,
    flags = false,
    sun = true,
  } = opts;

  const p =
    opts.palette ??
    (kind === "jungle" ? PALETTE.jungle : kind === "plain" ? PALETTE.plain : PALETTE.dawn);
  const s = seedFrom(seedStr);
  const rand = rng(s);

  const layers: Scene["layers"] = {
    sky: `<rect width="${W}" height="${H}" fill="${p.sky}"/>`,
    sun: "",
    ghostFar: "",
    ghostMid: "",
    ghostNear: "",
    massif: "",
    detail: "",
    water: "",
    flags: "",
  };

  if (sun) {
    // In the logo the sun sits *behind* the massif — a disc mostly occluded by
    // rock, with only the upper arc in open sky. Floating it clear of the
    // ranges turns it into a spotlight and the whole scene into flat clipart,
    // so it is set low and off the centre line.
    const cx = W * (0.28 + rand() * 0.34);
    const cy = H * (kind === "plain" ? 0.68 : 0.58);
    const r = H * (kind === "plain" ? 0.16 : 0.21);
    layers.sun = `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${p.sun}"/>`;
  }

  // ── Ghost ranges. Present in every scene but the plain, because in Nepal
  //    there is nearly always another ridge behind the one you can see.
  if (kind !== "plain") {
    const specs: [number, number, number, number, string][] = [
      [s + 41, 8, 0.5, H * 0.3, p.ghost[0]],
      [s + 23, 6, 0.62, H * 0.36, p.ghost[1]],
      [s + 11, 5, 0.7, H * 0.42, p.ghost[2]],
    ];
    const bases = [H * 0.7, H * 0.76, H * 0.82];
    const keys = ["ghostFar", "ghostMid", "ghostNear"] as const;
    specs.forEach(([sd, peaks, height, A, colour], i) => {
      const r = ridgeline({
        seed: sd,
        peaks,
        height,
        roughness: 0.55,
        flank: kind === "jungle" || kind === "valley" ? 1.15 : 1.05,
        vertices: 48,
      });
      const baseY = bases[i];
      layers[keys[i]] = at(
        baseY,
        A,
        `<path d="${ridgePath(r, W, A, (H - baseY + A) / A)}" fill="${colour}"/>`,
      );
    });
  }

  // ── The lead form of the scene.
  switch (kind) {
    case "alpine": {
      const A = H * 0.62;
      const baseY = H * 0.94;
      const main = ridgeline({ seed: s, peaks: 3, height: 0.95, roughness: 0.5, flank: 0.92, vertices: 60 });
      layers.massif = at(
        baseY,
        A,
        `<path d="${ridgePath(main, W, A, (H - baseY + A) / A)}" fill="${p.massif}"/>`,
      );
      layers.detail = at(
        baseY,
        A,
        shadowFacets(main, W, A, s).map((d) => `<path d="${d}" fill="${p.shade}" opacity="0.6"/>`).join("") +
          snowCaps(main, W, A, 0.66, s).map((d) => `<path d="${d}" fill="${p.snow}"/>`).join("") +
          snowCaps(main, W, A, 0.82, s + 5).map((d) => `<path d="${d}" fill="#FFFFFF"/>`).join(""),
      );
      break;
    }

    case "lake": {
      const A = H * 0.5;
      const baseY = H * 0.78;
      const main = ridgeline({ seed: s, peaks: 4, height: 0.9, roughness: 0.48, flank: 0.95, vertices: 60 });
      layers.massif = at(
        baseY,
        A,
        `<path d="${ridgePath(main, W, A, (H - baseY + A) / A)}" fill="${p.massif}"/>`,
      );
      layers.detail = at(
        baseY,
        A,
        shadowFacets(main, W, A, s).map((d) => `<path d="${d}" fill="${p.shade}" opacity="0.55"/>`).join("") +
          snowCaps(main, W, A, 0.7, s).map((d) => `<path d="${d}" fill="${p.snow}"/>`).join(""),
      );
      // A broad still lake, with the range reflected as a flattened echo.
      const lakeTop = H * 0.78;
      layers.water =
        `<rect x="0" y="${f(lakeTop)}" width="${W}" height="${f(H - lakeTop)}" fill="${p.water}"/>` +
        `<g transform="translate(0 ${f(lakeTop)}) scale(1 -0.34)" opacity="0.28">` +
        `<path d="${ridgePath(main, W, A, 1)}" fill="${p.shade}" transform="translate(0 ${f(-A)})"/></g>` +
        // Three hairlines of still water, the only horizontal marks in the set.
        [0.14, 0.4, 0.72]
          .map(
            (t) =>
              `<rect x="${f(W * (0.08 + t * 0.1))}" y="${f(lakeTop + (H - lakeTop) * t)}" width="${f(W * (0.5 - t * 0.22))}" height="1.5" fill="${p.snow}" opacity="0.3"/>`,
          )
          .join("");
      break;
    }

    case "valley": {
      // The old cities are read as a skyline, not as a plan: tiered roofs in
      // the foreground standing against sky, with the valley rim behind them.
      // Silhouetting the temples against the hills instead loses them entirely,
      // and the skyline is the whole subject.
      const A = H * 0.2;
      const baseY = H * 0.66;
      const rim = ridgeline({ seed: s, peaks: 6, height: 0.74, roughness: 0.5, flank: 1.25, vertices: 64 });
      layers.massif = at(
        baseY,
        A,
        `<path d="${ridgePath(rim, W, A, (H - baseY + A) / A)}" fill="${p.ghost[2]}"/>` +
          terraces(rim, W, A, A, p.snow, 2),
      );

      // A durbar square is a dense, serrated band of many roofs at different
      // heights, not a row of monuments. Depth comes from a paler back rank
      // overlapped by a darker front one.
      const floor = H * 1.01;
      const back: string[] = [];
      const front: string[] = [];
      for (let i = 0; i < 15; i++) {
        const x = W * ((i + 0.5) / 15 + (rand() - 0.5) * 0.045);
        const isBack = i % 2 === 0;
        const h = H * (isBack ? 0.15 + rand() * 0.1 : 0.2 + rand() * 0.18);
        const fill = p.massif;
        // Varying tier count and proportion is what stops a row of temples
        // reading as one shape stamped repeatedly along the baseline.
        const form =
          rand() < 0.14
            ? stupa(x, floor, h * 0.9, fill)
            : pagoda(x, floor, h, fill, rand() < 0.35 ? 2 : 3, 0.5 + rand() * 0.34);
        (isBack ? back : front).push(form);
      }
      // The back rank is the massif colour held back, not the hill colour —
      // drawn in the hill's own tone it disappears into the ridge behind it.
      layers.detail = `<g opacity="0.45">${back.join("")}</g>${front.join("")}`;
      break;
    }

    case "jungle": {
      // Layered canopy receding into river mist. No ridge in the foreground —
      // the Terai is flat, and its depth comes from stacked bands of forest.
      const bands: [number, number, string, number][] = [
        [H * 0.66, H * 0.1, p.ghost[1], 9],
        [H * 0.78, H * 0.14, p.ghost[2], 7],
        [H * 0.98, H * 0.19, p.massif, 5],
      ];
      layers.massif = bands.map(([y, h, fill, n]) => canopy(W, y, h, s + n, fill, n)).join("");

      // One river channel between the middle and near bands.
      const riverY = H * 0.83;
      layers.water = `<path d="M0 ${f(riverY)}L${f(W * 0.34)} ${f(riverY - H * 0.022)}L${f(W * 0.7)} ${f(riverY + H * 0.016)}L${W} ${f(riverY - H * 0.008)}L${W} ${f(riverY + H * 0.06)}L0 ${f(riverY + H * 0.07)}Z" fill="${p.water}" opacity="0.92"/>`;

      // Mist sits in the far band only, where the air actually holds it.
      layers.detail = `<rect x="0" y="${f(H * 0.63)}" width="${W}" height="${f(H * 0.05)}" fill="${p.sky}" opacity="0.45"/>`;
      break;
    }

    case "plain": {
      // A low horizon, a very big sky, and one vertical. The Terai's whole
      // character is that almost nothing interrupts the line.
      const horizon = H * 0.72;
      layers.massif =
        // Distant treeline, then the ground plane in front of it.
        canopy(W, horizon, H * 0.055, s + 3, p.ghost[2], 11) +
        `<rect x="0" y="${f(horizon)}" width="${W}" height="${f(H - horizon)}" fill="${p.massif}"/>`;

      const shrineX = W * 0.7;
      const shrineH = H * 0.3;
      // A rectangular tank in perspective, with the shrine reflected in it.
      const tankTop = horizon + H * 0.09;
      const tankBot = horizon + H * 0.23;
      layers.water =
        `<path d="M${f(W * 0.1)} ${f(tankTop)}L${f(W * 0.56)} ${f(tankTop)}L${f(W * 0.62)} ${f(tankBot)}L${f(W * 0.02)} ${f(tankBot)}Z" fill="${p.water}" opacity="0.9"/>` +
        `<g opacity="0.2" transform="translate(0 ${f(tankTop * 2 + H * 0.01)}) scale(1 -0.45)">${stupa(
          W * 0.36,
          tankTop,
          shrineH * 0.8,
          p.snow,
        )}</g>`;
      layers.detail =
        stupa(shrineX, horizon + H * 0.04, shrineH, p.shade) +
        `<rect x="0" y="${f(horizon)}" width="${W}" height="1.5" fill="${p.shade}" opacity="0.3"/>`;
      break;
    }
  }

  // Birds, where a scene has open sky to carry them. Three, as in the logo.
  if (kind !== "jungle" && kind !== "valley") {
    layers.flags += birds(
      W * (0.13 + rand() * 0.12),
      H * (0.19 + rand() * 0.13),
      W * 0.012,
      s + 77,
      p.massif,
    );
  }

  if (flags) {
    const line = prayerFlagLine(W * 0.54, H * 0.04, W * 1.02, H * 0.24, H * 0.05, 7);
    const fw = W * 0.017;
    const fh = fw * 1.32;
    layers.flags =
      `<path d="${line.curve}" fill="none" stroke="${p.massif}" stroke-width="1.5" opacity="0.8"/>` +
      line.flags
        .map(
          (fl) =>
            `<g transform="translate(${f(fl.x)} ${f(fl.y)}) rotate(${f(fl.angle)})">` +
            `<rect width="${f(fw)}" height="${f(fh)}" fill="${fl.colour}" stroke="${p.massif}" stroke-width="0.7" stroke-opacity="0.5"/></g>`,
        )
        .join("");
  }

  return { width: W, height: H, layers };
}

/** Flatten a scene to a standalone SVG document. */
export function sceneToSvg(scene: Scene, title?: string): string {
  const { width: W, height: H, layers } = scene;
  const order: (keyof Scene["layers"])[] = [
    "sky",
    "sun",
    "ghostFar",
    "ghostMid",
    "ghostNear",
    "massif",
    "detail",
    "water",
    "flags",
  ];
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img"${
      title ? ` aria-label="${title.replace(/"/g, "&quot;")}"` : ""
    }>` +
    order.map((k) => layers[k]).join("") +
    `</svg>`
  );
}

/** Which scene type a destination's terrain should draw. */
export const sceneKindFor: Record<string, SceneKind> = {
  city: "valley",
  hills: "lake",
  mountains: "alpine",
  wilderness: "jungle",
  terai: "plain",
};
