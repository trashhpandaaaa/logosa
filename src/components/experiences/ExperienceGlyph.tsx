import type { Experience } from "@/data/experiences";

/**
 * The experience glyphs, drawn rather than picked from an icon set. One stroke
 * weight, one grid, no fills except where a solid mark carries meaning — a
 * summit, an eye, a sun.
 */
export default function ExperienceGlyph({
  experience,
  size = 30,
  className,
}: {
  experience: Experience;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable="false"
    >
      <path d={experience.glyph} />
      {experience.glyphFill && <path d={experience.glyphFill} fill="currentColor" stroke="none" />}
    </svg>
  );
}
