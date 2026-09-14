import type { StyleSpecification } from "mapbox-gl";

/**
 * A Logosa map style, composed from Mapbox's vector sources rather than
 * loaded from one of their published styles.
 *
 * The reference is a printed travel atlas: warm paper ground, relief carried
 * by hillshade rather than by colour, hairline contours, water in the logo's
 * teal, and almost no labels. Every default has been replaced — there is no
 * road network, no POI, no green parks, no grey buildings. What is left is
 * terrain, water, and the names of places you can actually go.
 */

const PAPER = "#F7F4EC";
const PAPER_2 = "#EFEADE";
const INK = "#003047";
const INK_SOFT = "#1D4A63";
const WATER = "#2E8BA6";
const SNOW = "#FFFFFF";
const PINE = "#2F5D50";

export function logosaMapStyle(): StyleSpecification {
  return {
    version: 8,
    name: "Logosa Atlas",
    // Archivo is loaded by the page; Mapbox needs one of its own font stacks
    // for glyph rendering, so the closest grotesque is used for labels.
    glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
    sources: {
      terrain: { type: "vector", url: "mapbox://mapbox.mapbox-terrain-v2" },
      streets: { type: "vector", url: "mapbox://mapbox.mapbox-streets-v8" },
      dem: {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      },
    },
    // Fog gives the recession that makes a 3D terrain read as landscape
    // instead of as a lumpy texture. Tuned warm, to sit on paper.
    fog: {
      range: [1.2, 12],
      color: "#EAE6DA",
      "high-color": "#CFDCE6",
      "space-color": "#F7F4EC",
      "horizon-blend": 0.06,
      "star-intensity": 0,
    },
    terrain: { source: "dem", exaggeration: 1.35 },
    layers: [
      { id: "ground", type: "background", paint: { "background-color": PAPER } },

      // Landcover: only the two classes that mean something in Nepal —
      // permanent snow, and forest. Everything else stays as paper.
      {
        id: "wood",
        type: "fill",
        source: "terrain",
        "source-layer": "landcover",
        filter: ["==", ["get", "class"], "wood"],
        paint: { "fill-color": PINE, "fill-opacity": 0.09 },
      },
      {
        id: "snow",
        type: "fill",
        source: "terrain",
        "source-layer": "landcover",
        filter: ["==", ["get", "class"], "snow"],
        paint: { "fill-color": SNOW, "fill-opacity": 0.72 },
      },

      // Relief. This is the layer that does the work.
      {
        id: "relief",
        type: "hillshade",
        source: "dem",
        paint: {
          "hillshade-exaggeration": 0.62,
          "hillshade-shadow-color": INK,
          "hillshade-highlight-color": PAPER,
          "hillshade-accent-color": "#7797B5",
          "hillshade-illumination-direction": 315,
        },
      },

      // Contours — the atlas signature. Index lines only, and only once the
      // camera is close enough for them to describe something.
      {
        id: "contour",
        type: "line",
        source: "terrain",
        "source-layer": "contour",
        filter: ["==", ["get", "index"], 5],
        minzoom: 8,
        paint: {
          "line-color": INK,
          "line-width": 0.6,
          "line-opacity": ["interpolate", ["linear"], ["zoom"], 8, 0, 10, 0.14, 13, 0.22],
        },
      },

      {
        id: "water",
        type: "fill",
        source: "streets",
        "source-layer": "water",
        paint: { "fill-color": WATER, "fill-opacity": 0.85 },
      },
      {
        id: "river",
        type: "line",
        source: "streets",
        "source-layer": "waterway",
        paint: {
          "line-color": WATER,
          "line-width": ["interpolate", ["linear"], ["zoom"], 7, 0.4, 12, 1.6],
          "line-opacity": 0.7,
        },
      },

      // The national border, drawn as a surveyor's dashed line.
      {
        id: "border",
        type: "line",
        source: "streets",
        "source-layer": "admin",
        filter: ["all", ["==", ["get", "admin_level"], 0], ["==", ["get", "maritime"], "false"]],
        paint: {
          "line-color": INK,
          "line-width": 1.1,
          "line-opacity": 0.4,
          "line-dasharray": [4, 2.5],
        },
      },

      // Labels: major settlements only, and nothing else. No POIs, no roads.
      {
        id: "place",
        type: "symbol",
        source: "streets",
        "source-layer": "place_label",
        filter: ["in", ["get", "class"], ["literal", ["settlement", "settlement_subdivision"]]],
        minzoom: 5,
        layout: {
          "text-field": ["get", "name_en"],
          "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 5, 9, 12, 13],
          "text-letter-spacing": 0.14,
          "text-transform": "uppercase",
          "text-max-width": 8,
          "text-padding": 8,
        },
        paint: {
          "text-color": INK_SOFT,
          "text-halo-color": PAPER_2,
          "text-halo-width": 1.4,
          "text-opacity": ["interpolate", ["linear"], ["zoom"], 5, 0.55, 9, 0.9],
        },
      },
    ],
  };
}

/** Sky, added after load so it can be skipped on constrained devices. */
export const SKY_LAYER = {
  id: "sky",
  type: "sky" as const,
  paint: {
    "sky-type": "atmosphere" as const,
    "sky-atmosphere-sun": [0, 4] as [number, number],
    "sky-atmosphere-sun-intensity": 6,
    "sky-atmosphere-color": "#CFDCE6",
    "sky-atmosphere-halo-color": "#FDB614",
    "sky-opacity": 0.75,
  },
};
