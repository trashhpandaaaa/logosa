/**
 * Lets build scripts import the app's TypeScript modules directly.
 *
 * Node strips types natively but resolves like a bundler will not: it needs
 * explicit file extensions, and it does not know the `@/` alias. This hook
 * supplies both, so scripts and the app can share one copy of the scene
 * engine and one copy of the data instead of drifting apart.
 */
import { pathToFileURL } from "node:url";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const src = join(dirname(fileURLToPath(import.meta.url)), "..", "src");

export async function resolve(specifier, context, next) {
  // Project alias: "@/lib/scene" → <root>/src/lib/scene
  if (specifier.startsWith("@/")) {
    specifier = pathToFileURL(join(src, specifier.slice(2))).href;
  }

  const hasExt = /\.[cm]?[jt]sx?$/.test(specifier);
  if (!hasExt && (specifier.startsWith(".") || specifier.startsWith("file:"))) {
    for (const ext of [".ts", ".tsx", "/index.ts"]) {
      try {
        return await next(specifier + ext, context);
      } catch {
        /* try the next candidate */
      }
    }
  }
  return next(specifier, context);
}
