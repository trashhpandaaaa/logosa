/**
 * Renders the illustrated plates that stand in for photography.
 *
 * These are NOT stock images and NOT filler: they are drawn by the site's own
 * scene engine, in the brand palette, one per destination, so the site is
 * coherent and shippable before a photographer is commissioned. Each is
 * recorded in public/images/PLACEHOLDERS.md with the real filename that should
 * replace it.
 *
 * Run: node scripts/build-images.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
// Windows needs a file:// URL for dynamic import of an absolute path.
const mod = (...p) => pathToFileURL(join(root, ...p)).href;

// Node strips TypeScript types natively, so the scene engine is imported
// directly rather than duplicated here.
const { buildScene, sceneToSvg, sceneKindFor } = await import(mod("src", "lib", "scene.ts"));
const { destinations } = await import(mod("src", "data", "destinations.ts"));
const { stories } = await import(mod("src", "data", "stories.ts"));

const destDir = join(root, "public", "images", "destinations");
const storyDir = join(root, "public", "images", "stories");
mkdirSync(destDir, { recursive: true });
mkdirSync(storyDir, { recursive: true });

const rows = [];
const replaced = [];

for (const d of destinations) {
  // A destination pointing at anything but an SVG has a real photograph now.
  // Don't draw a plate it will never use, and don't list it as outstanding.
  if (!d.image.endsWith(".svg")) {
    replaced.push({ path: d.image, subject: d.imageAlt });
    continue;
  }
  const kind = sceneKindFor[d.terrain];
  const scene = buildScene({
    kind,
    seed: d.slug,
    width: 1600,
    height: 1000,
    flags: d.terrain === "mountains",
  });
  const svg = sceneToSvg(scene, d.imageAlt);
  const file = join(destDir, `${d.slug}.svg`);
  writeFileSync(file, svg);
  rows.push({
    path: `/images/destinations/${d.slug}.svg`,
    replaceWith: `${d.slug}.webp`,
    subject: d.imageAlt,
    kind,
    bytes: svg.length,
  });
}

// Story leads use a different aspect and a dusk palette where it suits.
const STORY_SCENES = {
  "walk-high-sleep-low": { kind: "alpine", flags: true },
  "the-gorge-that-made-a-kingdom": { kind: "alpine", flags: false },
  "how-to-read-a-newar-window": { kind: "valley", flags: false },
};

for (const s of stories) {
  const cfg = STORY_SCENES[s.slug] ?? { kind: "alpine", flags: false };
  const scene = buildScene({
    kind: cfg.kind,
    seed: s.slug,
    width: 1600,
    height: 900,
    flags: cfg.flags,
  });
  const svg = sceneToSvg(scene, s.imageAlt);
  const name = s.image.split("/").pop();
  writeFileSync(join(storyDir, name), svg);
  rows.push({
    path: s.image,
    replaceWith: name.replace(/\.svg$/, ".webp"),
    subject: s.imageAlt,
    kind: cfg.kind,
    bytes: svg.length,
  });
}

const total = rows.reduce((a, r) => a + r.bytes, 0);
for (const r of rows) console.log(`  ${r.path}  ${(r.bytes / 1024).toFixed(1)}kB  [${r.kind}]`);
console.log(`\n${rows.length} plates, ${(total / 1024).toFixed(0)}kB total`);

const md = `# Placeholder imagery

Every file listed here is a **generated illustration**, not a photograph and
not stock. They are drawn by \`src/lib/scene.ts\` in the Logosa palette so the
site is complete and coherent before a photographer is commissioned.

## Replacing them

Drop a real image into the same folder and point the \`image\` field in the
corresponding data file at it. Nothing else needs to change — the layout,
cropping and alt text already exist.

| Placeholder | Replace with | Subject the photograph should show |
| --- | --- | --- |
${rows.map((r) => `| \`${r.path}\` | \`${r.replaceWith}\` | ${r.subject} |`).join("\n")}
${
  replaced.length
    ? `
## Already replaced

These carry real photography and are no longer generated. Re-pointing the data
file back at an \`.svg\` path brings the plate back on the next run.

| File | Subject |
| --- | --- |
${replaced.map((r) => `| \`${r.path}\` | ${r.subject} |`).join("\n")}
`
    : ""
}
## Specification for real photography

- **Format** — WebP or AVIF, sRGB. Supply the original alongside.
- **Size** — 2400px on the long edge is enough; the site never serves larger.
- **Aspect** — destinations are cropped to 4:5, 3:2 and 16:9 in different
  places, so leave headroom. Do not supply a tightly cropped subject.
- **Direction** — the identity reads as dawn light: low sun, long shadows,
  cool ranges against warm ground. Midday photographs will not sit next to the
  illustration language.
- **Rights** — Logosa must hold the licence for commercial use. Note the
  photographer's credit in the data file where attribution is required.

Regenerate the placeholders at any time with \`npm run build:images\`.
`;

writeFileSync(join(root, "public", "images", "PLACEHOLDERS.md"), md);
console.log("Wrote public/images/PLACEHOLDERS.md");
