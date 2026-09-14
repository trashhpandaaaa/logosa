import type { Chapter } from "@/lib/mapbox/journey";
import { destinationBySlug } from "./destinations";

/**
 * The map story.
 *
 * Order is a traverse, not the narrative order of the homepage: east to the
 * Khumbu first, then west along the Himalaya, then down onto the Terai. It is
 * the shape a journey across Nepal actually takes, and it stops the camera
 * jumping back and forth across the country.
 *
 * Camera framing is chosen per place — a high pitch and a bearing that puts
 * the big ground on the horizon for mountain chapters, a lower, flatter camera
 * for the valley and the plain, where the interest is on the ground.
 */

export interface MapChapter extends Chapter {
  slug?: string;
  kicker: string;
  note: string;
}

export const mapChapters: MapChapter[] = [
  {
    id: "nepal",
    name: "Nepal",
    kicker: "147,516 km²",
    note: "Eight hundred kilometres of Himalaya along the northern border, and a subtropical plain along the southern one. Everything else is the space between them.",
    center: [84.1, 28.35],
    zoom: 6.1,
    pitch: 0,
    bearing: 0,
  },
  {
    id: "kathmandu",
    slug: "kathmandu-valley",
    name: "Kathmandu Valley",
    kicker: "1,400 m",
    note: "A bowl in the middle hills holding three former kingdoms and seven UNESCO monument zones. Nearly every journey in Nepal starts here.",
    center: [85.324, 27.7172],
    zoom: 11.1,
    pitch: 54,
    bearing: -18,
  },
  {
    id: "everest",
    slug: "everest-khumbu",
    name: "Everest & Khumbu",
    kicker: "8,848.86 m",
    note: "Sagarmatha, and the Sherpa valleys beneath it. The trail from Lukla climbs 2,700 m over eight walking days, two of which are spent not climbing at all.",
    center: [86.925, 27.9881],
    zoom: 11.4,
    pitch: 74,
    bearing: 38,
  },
  {
    id: "langtang",
    slug: "langtang",
    name: "Langtang",
    kicker: "3,870 m",
    note: "The nearest high valley to the capital, reached by road rather than by air. Rebuilt by its own community after the 2015 earthquake.",
    center: [85.5636, 28.2114],
    zoom: 11.7,
    pitch: 68,
    bearing: 8,
  },
  {
    id: "pokhara",
    slug: "pokhara",
    name: "Pokhara",
    kicker: "822 m",
    note: "A lake at 742 m with an eight-thousander thirty kilometres away. More than seven vertical kilometres of relief, in plain sight from the water.",
    center: [83.9856, 28.2096],
    zoom: 11.3,
    pitch: 62,
    bearing: -32,
  },
  {
    id: "annapurna",
    slug: "annapurna",
    name: "Annapurna",
    kicker: "5,416 m",
    note: "Nepal's largest protected area, and a single route that crosses from rice terraces to Tibetan high desert over the Thorong La.",
    center: [83.8203, 28.5961],
    zoom: 11.5,
    pitch: 71,
    bearing: -10,
  },
  {
    id: "mustang",
    slug: "upper-mustang",
    name: "Upper Mustang",
    kicker: "3,840 m",
    note: "North of the main chain, in the rain shadow. The monsoon never arrives, which is why it is walkable in July.",
    center: [83.9578, 29.1833],
    zoom: 10.9,
    pitch: 60,
    bearing: 6,
  },
  {
    id: "chitwan",
    slug: "chitwan",
    name: "Chitwan",
    kicker: "150 m",
    note: "Down onto the Terai floodplain. Sal forest, elephant grass and the greater one-horned rhinoceros, in Nepal's first national park.",
    center: [84.4977, 27.5798],
    zoom: 10.6,
    pitch: 46,
    bearing: 22,
  },
  {
    id: "lumbini",
    slug: "lumbini",
    name: "Lumbini",
    kicker: "623 BCE",
    note: "Where the Buddha was born, marked by a pillar Ashoka raised in 249 BCE. The southern end of the country, and of the journey.",
    center: [83.2756, 27.4692],
    zoom: 12.1,
    pitch: 40,
    bearing: -8,
  },
];

/** The route line, in the order the camera travels it. */
export const routeCoords = mapChapters
  .filter((c) => c.slug)
  .map((c) => destinationBySlug(c.slug!)!.coords);
