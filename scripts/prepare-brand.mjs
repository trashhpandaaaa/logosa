/**
 * Derives web assets from the supplied Logosa logo.
 *
 * The artwork itself is never altered — not redrawn, recoloured, restyled or
 * regenerated. This script only:
 *   1. keys out the flat paper background by flood-filling inward from the
 *      edges, so the logo can sit on any surface. Interior whites (snow, the
 *      white prayer flag) are preserved because the fill never reaches them.
 *   2. writes PNG + WebP at the sizes the site actually requests.
 *   3. crops the emblem for placements too small for the full lockup — the
 *      navigation bar and the favicon.
 *
 * Run: node scripts/prepare-brand.mjs
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(root, "logo.jpeg");
const OUT = join(root, "public", "brand");
mkdirSync(OUT, { recursive: true });

/** Flood-fill transparency inward from the border. */
async function keyOutBackground(tolerance = 95, feather = 45) {
  const img = sharp(SRC).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: ch } = info;

  // Sample the background from the four corners — the flattest area available.
  const corners = [
    [0, 0],
    [w - 1, 0],
    [0, h - 1],
    [w - 1, h - 1],
  ];
  const bg = [0, 0, 0];
  for (const [x, y] of corners) {
    const i = (y * w + x) * ch;
    bg[0] += data[i] / 4;
    bg[1] += data[i + 1] / 4;
    bg[2] += data[i + 2] / 4;
  }
  const dist = (i) =>
    Math.abs(data[i] - bg[0]) + Math.abs(data[i + 1] - bg[1]) + Math.abs(data[i + 2] - bg[2]);

  const seen = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) {
    stack.push(x, x + (h - 1) * w);
  }
  for (let y = 0; y < h; y++) {
    stack.push(y * w, y * w + w - 1);
  }

  let cleared = 0;
  while (stack.length) {
    const p = stack.pop();
    if (seen[p]) continue;
    seen[p] = 1;
    const i = p * ch;
    const d = dist(i);
    if (d > tolerance + feather) continue;

    // Inside the tolerance band alpha ramps down, which keeps the logo's
    // anti-aliased outline from turning into a hard jagged edge.
    data[i + 3] = d <= tolerance ? 0 : Math.round(((d - tolerance) / feather) * 255);
    if (data[i + 3] === 0) cleared++;
    if (d > tolerance) continue; // stop spreading at the soft edge

    const x = p % w;
    const y = (p / w) | 0;
    if (x > 0) stack.push(p - 1);
    if (x < w - 1) stack.push(p + 1);
    if (y > 0) stack.push(p - w);
    if (y < h - 1) stack.push(p + w);
  }

  console.log(
    `  background keyed: ${((cleared / (w * h)) * 100).toFixed(1)}% of pixels cleared ` +
      `(bg rgb ${bg.map((n) => Math.round(n)).join(",")})`,
  );
  return sharp(data, { raw: { width: w, height: h, channels: ch } });
}

/** Trim to the emblem: everything above the wordmark. */
async function writeAll() {
  const keyed = await keyOutBackground();
  const buf = await keyed.png().toBuffer();
  const meta = await sharp(buf).metadata();
  console.log(`  source ${meta.width}×${meta.height}`);

  // Full lockup, trimmed of transparent margin.
  const full = sharp(buf).trim({ threshold: 1 });
  const fullBuf = await full.png().toBuffer();
  const fullMeta = await sharp(fullBuf).metadata();
  console.log(`  trimmed ${fullMeta.width}×${fullMeta.height}`);

  await sharp(fullBuf)
    .resize({ width: 900, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(join(OUT, "logosa-logo.png"));
  await sharp(fullBuf)
    .resize({ width: 900, withoutEnlargement: true })
    .webp({ quality: 92 })
    .toFile(join(OUT, "logosa-logo.webp"));

  // Emblem only — the illustration above the wordmark. Used where the full
  // lockup would render the wordmark illegibly small.
  const emblemH = Math.round(fullMeta.height * 0.68);
  const emblem = sharp(fullBuf)
    .extract({ left: 0, top: 0, width: fullMeta.width, height: emblemH })
    .trim({ threshold: 1 });
  const emblemBuf = await emblem.png().toBuffer();

  await sharp(emblemBuf)
    .resize({ height: 260, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(join(OUT, "logosa-mark.png"));
  await sharp(emblemBuf)
    .resize({ height: 260, withoutEnlargement: true })
    .webp({ quality: 92 })
    .toFile(join(OUT, "logosa-mark.webp"));

  // Favicon — square, on paper, since a transparent favicon disappears in
  // dark browser chrome.
  await sharp({
    create: { width: 512, height: 512, channels: 4, background: "#F7F4EC" },
  })
    .composite([
      { input: await sharp(emblemBuf).resize({ width: 460, fit: "inside" }).toBuffer(), gravity: "center" },
    ])
    .png()
    .toFile(join(OUT, "icon.png"));

  // Open Graph card: the logo on paper at 1200×630.
  await sharp({
    create: { width: 1200, height: 630, channels: 4, background: "#F7F4EC" },
  })
    .composite([
      { input: await sharp(fullBuf).resize({ height: 470, fit: "inside" }).toBuffer(), gravity: "center" },
    ])
    .png()
    .toFile(join(OUT, "og-default.png"));

  console.log("\nWrote brand assets to public/brand/");
}

writeAll().catch((e) => {
  console.error(e);
  process.exit(1);
});
