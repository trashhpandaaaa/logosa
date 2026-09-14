/**
 * CREDITS — attribution for third-party assets.
 *
 * The 3D models on this site are Creative Commons Attribution licensed. That
 * licence permits commercial use but REQUIRES that the author, the title, the
 * licence and a link to the source are credited. This file is rendered in the
 * colophon and in the caption of every model on the page it appears on.
 *
 * Deleting or hiding these credits puts Logosa in breach of licence. Do not
 * treat this as decorative small print.
 */

export interface Credit {
  /** Local path under /public/models. */
  file: string;
  title: string;
  author: string;
  authorUrl: string;
  licence: string;
  licenceUrl: string;
  source: string;
  /** Where it appears, for the colophon. */
  usedFor: string;
}

export const modelCredits: Credit[] = [
  {
    file: "/models/everest.glb",
    title: "Mount Everest 3D Model",
    author: "alitural",
    authorUrl: "https://sketchfab.com/alitural",
    licence: "CC BY 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by/4.0/",
    source:
      "https://sketchfab.com/3d-models/mount-everest-3d-model-f4a8c4083ef449caa577c5852eb0d9b7",
    usedFor: "The opening sequence",
  },
  {
    file: "/models/kala-bhairava.glb",
    title: "Kala Bhairava w/ 2 LOD — Nepal Heritage",
    author: "Dystopia",
    authorUrl: "https://sketchfab.com/Dystopia",
    licence: "CC BY 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by/4.0/",
    source:
      "https://sketchfab.com/3d-models/kala-bhairava-w-2-lod-nepal-heritage-3975835d31634f1ca1027aa82836aba7",
    usedFor: "The Craft chapter",
  },
];

/**
 * NOT SHIPPED — kept on record so nobody re-adds it by accident.
 *
 * `stone_garuda_-_free_low-res_version.glb` (Dystopia) is CC-BY-NC-4.0.
 * The NonCommercial term forbids use on a commercial travel agency's website.
 * To use it, Logosa must either license it directly from the author or
 * substitute a CC-BY / commercially licensed Garuda.
 */
export const excludedAssets = [
  {
    file: "stone_garuda_-_free_low-res_version.glb",
    reason: "CC-BY-NC-4.0 — NonCommercial licence, incompatible with commercial use",
    author: "Dystopia",
    authorUrl: "https://sketchfab.com/Dystopia",
    resolution:
      "Licence directly from the author, or replace with a commercially licensed model.",
  },
] as const;

export const creditByFile = (file: string) => modelCredits.find((c) => c.file === file);
