/**
 * EXPERIENCES — the eight ways people travel in Nepal.
 *
 * Each carries a hand-drawn glyph rather than an icon from a set. They are
 * built from the same vocabulary as the rest of the identity — ridgelines,
 * tiered roofs, woven diamonds — so a row of them reads as one drawing.
 * Every glyph is authored on a 24×24 grid with a 1.4 stroke.
 */

export type ExperienceId =
  | "trekking"
  | "culture"
  | "adventure"
  | "wildlife"
  | "pilgrimage"
  | "leisure"
  | "food"
  | "photography";

export interface Experience {
  id: ExperienceId;
  name: string;
  /** Set under the name in the finder. Concrete, not aspirational. */
  note: string;
  /** How this reads when the finder assembles a sentence. */
  phrase: string;
  /** SVG path data on a 24×24 grid, stroked not filled. */
  glyph: string;
  /** Optional second path drawn filled, for solid accents. */
  glyphFill?: string;
}

export const experiences: Experience[] = [
  {
    id: "trekking",
    name: "Trekking",
    note: "Multi-day walking, teahouse to teahouse, at altitude.",
    phrase: "walking at altitude",
    glyph: "M2 18 L8 8 L12 13 L17 5 L22 18",
    glyphFill: "M17 5 L19.4 8.8 L14.6 8.8 Z",
  },
  {
    id: "culture",
    name: "Culture & heritage",
    note: "Newar architecture, living ritual, craft still being made.",
    phrase: "temples and craft",
    glyph: "M3 20 H21 M5 20 V14 M19 20 V14 M4 14 H20 L17 10 H7 Z M8 10 V7 H16 V10 M12 7 V4",
  },
  {
    id: "adventure",
    name: "Adventure",
    note: "Rafting, paragliding, canyoning, mountain biking.",
    phrase: "something with adrenaline in it",
    glyph: "M2 9 Q6 5 10 9 T18 9 T22 9 M2 15 Q6 11 10 15 T18 15 T22 15",
  },
  {
    id: "wildlife",
    name: "Wildlife",
    note: "Rhino, gharial and 500-plus bird species on the Terai.",
    phrase: "wildlife on the Terai",
    glyph: "M12 20 C7 20 4 17 4 13.5 C4 10 7 8 12 8 C17 8 20 10 20 13.5 C20 17 17 20 12 20 Z",
    glyphFill: "M7.5 6.5 a2 2 0 1 1 0 3.2 a2 2 0 0 1 0-3.2 M16.5 6.5 a2 2 0 1 1 0 3.2 a2 2 0 0 1 0-3.2",
  },
  {
    id: "pilgrimage",
    name: "Pilgrimage",
    note: "Lumbini, Muktinath, Boudhanath — sites still in use.",
    phrase: "sacred ground",
    glyph: "M12 3 V7 M8 21 H16 M6.5 21 V17 H17.5 V21 M8 17 C8 12 16 12 16 17 M10 12 H14",
  },
  {
    id: "leisure",
    name: "Leisure",
    note: "Lakes, slow mornings, short days, good light.",
    phrase: "an unhurried pace",
    glyph: "M2 14 H22 M4 18 H20 M9 14 V9 a3 3 0 0 1 6 0 v5",
  },
  {
    id: "food",
    name: "Food & local life",
    note: "Newar feasts, bazaar mornings, kitchens that let you in.",
    phrase: "food and everyday life",
    glyph: "M3 12 H21 a9 9 0 0 1-18 0 Z M12 12 V6 M9 8 q3-2 6 0",
  },
  {
    id: "photography",
    name: "Photography",
    note: "Routes and timings built around the light, not the schedule.",
    phrase: "photographs worth the early start",
    glyph: "M2 7 H22 V20 H2 Z M2 12 L8 8 L13 13 L17 10 L22 14",
    glyphFill: "M17.5 4 a1.6 1.6 0 1 1 0 3.2 a1.6 1.6 0 0 1 0-3.2",
  },
];

export const experienceById = (id: ExperienceId) => experiences.find((e) => e.id === id)!;

export const experienceName = (id: ExperienceId) => experienceById(id).name;
