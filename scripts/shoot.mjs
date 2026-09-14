/**
 * Screenshots the running dev server so the art direction can be reviewed as
 * pixels rather than as code.
 *
 * Usage:
 *   node scripts/shoot.mjs <path> [--at 0,0.35,0.7] [--w 1440] [--h 900] [--out name]
 *
 * Drives the system Edge/Chrome through playwright-core, so nothing is
 * downloaded. WebGL runs on SwiftShader in headless, which is slower than a
 * real GPU but renders the same image.
 */
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = process.env.SHOT_DIR || join(root, ".shots");
mkdirSync(OUT, { recursive: true });

const args = process.argv.slice(2);
const path = args[0]?.startsWith("--") || !args[0] ? "/" : args[0];
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};

const width = Number(flag("w", 1440));
const height = Number(flag("h", 900));
const name = flag("out", path.replace(/\W+/g, "-").replace(/^-|-$/g, "") || "home");
const stops = String(flag("at", "0")).split(",").map(Number);
const base = process.env.BASE_URL || "http://localhost:3000";

const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";

async function exists(p) {
  try {
    const { access } = await import("node:fs/promises");
    await access(p);
    return true;
  } catch {
    return false;
  }
}

const executablePath =
  process.env.BROWSER_PATH || ((await exists(CHROME)) ? CHROME : EDGE);

const browser = await chromium.launch({
  executablePath,
  args: [
    "--enable-unsafe-swiftshader",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--ignore-gpu-blocklist",
    "--enable-webgl",
  ],
});

const page = await browser.newPage({
  viewport: { width, height },
  deviceScaleFactor: 1,
  reducedMotion: process.env.REDUCED === "1" ? "reduce" : "no-preference",
});

const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto(base + path, { waitUntil: "networkidle", timeout: 90_000 });
await page.waitForTimeout(2500); // fonts, GLB decode, first WebGL frames

// Scrolling to a selector is far more reliable than guessing a document
// fraction, which shifts every time a section is added above it.
const sel = flag("sel", null);
if (sel) {
  await page.evaluate((s) => {
    document.querySelector(s)?.scrollIntoView({ block: "center", behavior: "auto" });
  }, sel);
  await page.waitForTimeout(2000);
  const file = join(OUT, `${name}.png`);
  await page.screenshot({ path: file });
  console.log(`  ${file}`);
  if (errors.length) {
    console.log("\nConsole errors:");
    for (const e of [...new Set(errors)].slice(0, 12)) console.log("  ! " + e);
  }
  await browser.close();
  process.exit(0);
}

for (const at of stops) {
  if (at > 0) {
    // Scroll by document proportion, then let Lenis settle and the scrubbed
    // timelines catch up before capturing.
    await page.evaluate((p) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: max * p, behavior: "auto" });
    }, at);
    await page.waitForTimeout(1800);
  }
  const file = join(OUT, `${name}${at ? `-${String(at).replace(".", "")}` : ""}.png`);
  await page.screenshot({ path: file });
  console.log(`  ${file}`);
}

if (errors.length) {
  console.log("\nConsole errors:");
  for (const e of [...new Set(errors)].slice(0, 12)) console.log("  ! " + e);
}

await browser.close();
