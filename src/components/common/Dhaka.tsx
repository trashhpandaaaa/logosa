import { dhakaBandSvg, dhakaFieldSvg, toDataUri } from "@/lib/dhaka";
import { cn } from "@/lib/utils";

/**
 * The woven band that separates one movement of the site from the next —
 * the digital equivalent of the chevron course that divides fields of pattern
 * in a dhaka panel. It carries the transition; it is never decoration on its
 * own, and it always sits between two sections rather than inside one.
 */
export function DhakaBand({
  className,
  ink = "#003047",
  opacity = 0.32,
  unit = 3,
}: {
  className?: string;
  ink?: string;
  opacity?: number;
  unit?: number;
}) {
  const uri = toDataUri(dhakaBandSvg({ unit, ink }));
  return (
    <div
      aria-hidden
      className={cn("w-full", className)}
      style={{
        height: unit * 10,
        opacity,
        backgroundImage: uri,
        backgroundRepeat: "repeat-x",
        backgroundSize: `auto ${unit * 10}px`,
      }}
    />
  );
}

/**
 * A field of pattern for large surfaces. Held at very low opacity — the cloth
 * should be felt rather than seen, and it must never compete with type set
 * over it.
 */
export function DhakaField({
  className,
  ink = "#003047",
  opacity = 0.05,
  unit = 3,
  cells = 32,
  fade,
}: {
  className?: string;
  ink?: string;
  opacity?: number;
  unit?: number;
  cells?: number;
  /** Fades the field out toward one edge so it does not stop abruptly. */
  fade?: "bottom" | "top" | "none";
}) {
  const uri = toDataUri(dhakaFieldSvg({ unit, cells, ink }));
  const mask =
    fade === "bottom"
      ? "linear-gradient(to bottom, #000 0%, #000 45%, transparent 100%)"
      : fade === "top"
        ? "linear-gradient(to top, #000 0%, #000 45%, transparent 100%)"
        : undefined;

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        opacity,
        backgroundImage: uri,
        backgroundRepeat: "repeat",
        backgroundSize: `${unit * cells}px ${unit * cells}px`,
        ...(mask ? { maskImage: mask, WebkitMaskImage: mask } : {}),
      }}
    />
  );
}

/**
 * A single woven lozenge, used as a bullet, a marker and a divider glyph.
 * Same motif as the field, so the smallest mark on the page belongs to the
 * same cloth as the largest surface.
 */
export function DhakaLozenge({
  size = 12,
  className,
  fill = "currentColor",
}: {
  size?: number;
  className?: string;
  fill?: string;
}) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 13 13"
      className={cn("shrink-0", className)}
      shapeRendering="crispEdges"
    >
      <path
        fill={fill}
        d="M6 0h1v1H6zM5 1h3v1H5zM4 2h2v1H4zM7 2h2v1H7zM3 3h2v1H3zM8 3h2v1H8zM2 4h2v1H2zM6 4h1v1H6zM9 4h2v1H9zM1 5h2v1H1zM5 5h3v1H5zM10 5h2v1h-2zM0 6h2v1H0zM4 6h2v1H4zM7 6h2v1H7zM11 6h2v1h-2zM1 7h2v1H1zM5 7h3v1H5zM10 7h2v1h-2zM2 8h2v1H2zM6 8h1v1H6zM9 8h2v1H9zM3 9h2v1H3zM8 9h2v1H8zM4 10h2v1H4zM7 10h2v1H7zM5 11h3v1H5zM6 12h1v1H6z"
      />
    </svg>
  );
}
