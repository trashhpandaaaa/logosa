import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 1400 → "1,400 m" */
export function metres(n: number | undefined): string {
  if (n === undefined) return "—";
  return `${n.toLocaleString("en-GB")} m`;
}

/** Two-digit chapter numeral: 1 → "01" */
export const pad2 = (n: number) => String(n).padStart(2, "0");

/** Clamp a number into a range. */
export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Linear interpolation. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Inverse lerp, clamped to 0..1. */
export const progress = (value: number, from: number, to: number) =>
  clamp((value - from) / (to - from), 0, 1);

/**
 * Great-circle distance in kilometres. Used for route lengths and for slicing
 * the map's route line by scroll progress.
 */
export function haversine(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const dLat = ((b[1] - a[1]) * Math.PI) / 180;
  const dLon = ((b[0] - a[0]) * Math.PI) / 180;
  const la1 = (a[1] * Math.PI) / 180;
  const la2 = (b[1] * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(la1) * Math.cos(la2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Stable id from a string, for aria-controls and the like. */
export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
