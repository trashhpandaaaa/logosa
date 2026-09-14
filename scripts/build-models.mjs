/**
 * Prepares the 3D assets in `public/3d assets/` for the web.
 *
 * Source models are Sketchfab exports of 12–19 MB each, which is far too much
 * to ship. Each is welded, simplified, texture-compressed to WebP and
 * meshopt-encoded, at two levels of detail:
 *
 *   · <name>.glb      desktop  — the quality the hero is art-directed for
 *   · <name>-low.glb  handheld — loaded when the device is small or coarse
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  LICENSING — read before adding a model here.
 *
 *  Both models built by this script are CC-BY-4.0 and REQUIRE visible
 *  attribution, which the site renders in the colophon (see src/data/credits.ts).
 *  Removing that attribution makes the site non-compliant.
 *
 *  `stone_garuda_-_free_low-res_version.glb` is deliberately NOT built.
 *  It is CC-BY-NC-4.0 — NonCommercial — and Logosa is a commercial business,
 *  so shipping it on this site would breach its licence.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Run: node scripts/build-models.mjs
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, statSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(root, "public", "3d assets");
const OUT = join(root, "public", "models");
mkdirSync(OUT, { recursive: true });

/** @type {{src:string,out:string,levels:{suffix:string,error:number|false,texture:number}[]}[]} */
const MODELS = [
  {
    src: "mount_everest_3d_model.glb",
    out: "everest",
    levels: [
      // Terrain: detail is the whole point, so the desktop level stays dense.
      { suffix: "", error: 0.00008, texture: 2048 },
      { suffix: "-low", error: 0.0003, texture: 1024 },
    ],
  },
  {
    src: "kala_bhairava_w_2_lod_-_nepal_heritage.glb",
    out: "kala-bhairava",
    levels: [
      // Already low-poly at 8k verts; the weight here is all texture.
      { suffix: "", error: false, texture: 1536 },
      { suffix: "-low", error: 0.0004, texture: 768 },
    ],
  },
];

const kb = (p) => (statSync(p).size / 1024).toFixed(0) + " KB";

for (const model of MODELS) {
  const input = join(SRC, model.src);
  console.log(`\n${model.src}  (${kb(input)})`);

  for (const level of model.levels) {
    const output = join(OUT, `${model.out}${level.suffix}.glb`);
    const args = [
      "gltf-transform",
      "optimize",
      input,
      output,
      "--compress",
      "meshopt",
      "--texture-compress",
      "webp",
      "--texture-size",
      String(level.texture),
      "--simplify",
      level.error === false ? "false" : "true",
    ];
    if (level.error !== false) args.push("--simplify-error", String(level.error));

    // Windows needs `shell: true` to resolve npx.cmd, and a shell re-splits on
    // spaces — so quote the paths, one of which is `public/3d assets/`.
    const win = process.platform === "win32";
    const safe = win ? args.map((a) => (/\s/.test(a) ? `"${a}"` : a)) : args;
    execFileSync("npx", safe, { stdio: "pipe", shell: win });
    console.log(`  → ${model.out}${level.suffix}.glb  ${kb(output)}`);
  }
}

// Fail loudly if an NC-licensed asset ever gets wired into the build.
const BLOCKED = "stone_garuda";
const credits = readFileSync(join(root, "src", "data", "credits.ts"), "utf8");
if (credits.includes(BLOCKED) && !credits.includes("NOT SHIPPED")) {
  console.error(
    `\n✖  ${BLOCKED} is CC-BY-NC and must not ship on a commercial site.`,
  );
  process.exit(1);
}

console.log("\nDone. Models written to public/models/");
