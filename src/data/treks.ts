/**
 * TREKS — elevation profiles.
 *
 * Waypoints carry both an elevation and a coordinate, so the interactive
 * profile and the map read from one source: dragging the profile moves the
 * camera, and there is no second copy of the route to fall out of sync.
 *
 * Distances are cumulative kilometres along the walking route and are
 * approximate — trail distances in Nepal vary between sources by a few
 * kilometres. Elevations are the commonly published figures for each
 * settlement. Neither is precise enough to navigate by, and the UI says so.
 */

export interface Waypoint {
  name: string;
  /** Cumulative distance along the route, km. */
  km: number;
  elevationM: number;
  /** [longitude, latitude] */
  coords: [number, number];
  /** Which itinerary day arrives here. */
  day?: number;
  /** Marks the route's high point. */
  high?: boolean;
  note?: string;
}

export interface Trek {
  id: string;
  name: string;
  /** Slug in journeys.ts this profile belongs to. */
  journeySlug: string;
  waypoints: Waypoint[];
  /** Total ascent is not summed from waypoints — teahouse routes lose and
   *  regain height constantly, so a waypoint sum would understate it badly.
   *  Left undefined rather than guessed. */
  totalAscentM?: number;
  /** Written for the specific route, not boilerplate. */
  preparation: string[];
}

export const treks: Trek[] = [
  {
    id: "ebc",
    name: "Everest Base Camp",
    journeySlug: "everest-base-camp",
    waypoints: [
      { name: "Lukla", km: 0, elevationM: 2860, coords: [86.7314, 27.6869], day: 3, note: "Tenzing–Hillary airstrip. The walk begins with a descent." },
      { name: "Phakding", km: 8, elevationM: 2610, coords: [86.7128, 27.7433], day: 3 },
      { name: "Monjo", km: 18, elevationM: 2835, coords: [86.7222, 27.7847], day: 4, note: "Sagarmatha National Park entrance." },
      { name: "Namche Bazaar", km: 21, elevationM: 3440, coords: [86.714, 27.8069], day: 4, note: "First acclimatisation stop. Two nights." },
      { name: "Tengboche", km: 31, elevationM: 3867, coords: [86.7645, 27.8362], day: 6, note: "Monastery ridge, facing Ama Dablam." },
      { name: "Dingboche", km: 41, elevationM: 4410, coords: [86.8306, 27.8917], day: 7, note: "Second acclimatisation stop. Above the treeline." },
      { name: "Lobuche", km: 50, elevationM: 4940, coords: [86.81, 27.95], day: 9 },
      { name: "Gorak Shep", km: 55, elevationM: 5164, coords: [86.8281, 27.9814], day: 10, note: "The last settlement. A sandy flat beside the glacier." },
      { name: "Everest Base Camp", km: 58, elevationM: 5364, coords: [86.8523, 28.0026], day: 10 },
      { name: "Kala Patthar", km: 60, elevationM: 5545, coords: [86.8281, 27.9881], day: 11, high: true, note: "The high point of the route, and the clearest view of the summit." },
    ],
    preparation: [
      "Two acclimatisation days are built into the schedule at Namche and Dingboche. They are the reason this itinerary is fourteen days rather than eleven, and they are the part most often cut. Do not cut them.",
      "Lukla flights are weather-dependent and delays of a day or more are routine. Allow spare days in Kathmandu at the end rather than booking a tight international connection.",
      "Nights are cold above Dingboche from October onward — a sleeping bag rated well below zero is standard, and most lodges rent them in Kathmandu or Namche.",
      "There are no ATMs above Namche and card payment is unreliable throughout. Carry enough Nepali rupees in cash for the whole route.",
    ],
  },

  {
    id: "abc",
    name: "Annapurna Base Camp",
    journeySlug: "annapurna-base-camp",
    waypoints: [
      { name: "Nayapul", km: 0, elevationM: 1070, coords: [83.6833, 28.3167], day: 3, note: "Road head. The trail starts along the Modi Khola." },
      { name: "Ghandruk", km: 12, elevationM: 1940, coords: [83.8117, 28.3756], day: 3, note: "Large Gurung village, stone-paved and slate-roofed." },
      { name: "Chhomrong", km: 22, elevationM: 2170, coords: [83.8175, 28.4108], day: 4, note: "The gateway to the sanctuary. Everything above passes through here." },
      { name: "Bamboo", km: 30, elevationM: 2310, coords: [83.8492, 28.4497], day: 5 },
      { name: "Deurali", km: 38, elevationM: 3230, coords: [83.8683, 28.4931], day: 6, note: "The gorge narrows. Avalanche-prone in late winter." },
      { name: "Machhapuchhre Base Camp", km: 43, elevationM: 3700, coords: [83.8781, 28.5211], day: 7 },
      { name: "Annapurna Base Camp", km: 46, elevationM: 4130, coords: [83.8792, 28.5308], day: 7, high: true, note: "A closed glacial basin ringed by peaks on all sides." },
    ],
    preparation: [
      "The ascent from Bamboo to the sanctuary gains around 1,800 m across two days. That is quick, and the last stretch above Deurali should be walked slowly even if you feel fine.",
      "The Deurali–MBC section runs through avalanche terrain and can be closed after heavy snow, generally between January and March. Local advice at Chhomrong governs.",
      "Chhomrong is the last reliable resupply. Prices rise with altitude above it, for the straightforward reason that everything is carried up.",
      "The hot springs at Jhinu Danda are twenty minutes below the village, down a steep path. Worth the detour on the way out.",
    ],
  },

  {
    id: "circuit",
    name: "Annapurna Circuit",
    journeySlug: "annapurna-circuit",
    waypoints: [
      { name: "Besisahar", km: 0, elevationM: 760, coords: [84.3833, 28.2333], day: 2, note: "Subtropical farmland. Rice and banana." },
      { name: "Jagat", km: 22, elevationM: 1300, coords: [84.3667, 28.35], day: 2 },
      { name: "Dharapani", km: 42, elevationM: 1860, coords: [84.35, 28.5167], day: 3 },
      { name: "Chame", km: 58, elevationM: 2670, coords: [84.2333, 28.55], day: 4, note: "Pine forest. District headquarters of Manang." },
      { name: "Pisang", km: 73, elevationM: 3300, coords: [84.15, 28.6167], day: 5 },
      { name: "Manang", km: 90, elevationM: 3540, coords: [84.0167, 28.6667], day: 6, note: "Acclimatisation stop. Altitude briefings at the HRA post." },
      { name: "Yak Kharka", km: 100, elevationM: 4050, coords: [83.9833, 28.7167], day: 8 },
      { name: "Thorong Phedi", km: 107, elevationM: 4525, coords: [83.9583, 28.7667], day: 9, note: "The foot of the pass. Pre-dawn start from here." },
      { name: "Thorong La", km: 113, elevationM: 5416, coords: [83.9394, 28.7947], day: 10, high: true, note: "The pass. Crossed east to west, before the afternoon wind." },
      { name: "Muktinath", km: 121, elevationM: 3760, coords: [83.8714, 28.8168], day: 10, note: "108 water spouts and a natural gas flame. Sacred to Hindus and Buddhists." },
      { name: "Jomsom", km: 140, elevationM: 2720, coords: [83.7228, 28.7808], day: 12, note: "In the Kali Gandaki. Strong valley wind from late morning." },
    ],
    preparation: [
      "Thorong La is the whole schedule's pivot. The crossing starts between four and five in the morning to be over the top before the wind gets up, and it is the one day that cannot be rearranged.",
      "The pass is occasionally closed by snow, most often in late autumn and winter. There is no alternative route over — a closure means turning back down the Marsyangdi.",
      "Manang's Himalayan Rescue Association post runs a free daily altitude talk. It is genuinely worth an hour, whatever your experience.",
      "The Kali Gandaki wind is a daily certainty, not a weather event. It builds from late morning, so walking south of Jomsom is done early.",
    ],
  },

  {
    id: "poonhill",
    name: "Ghorepani & Poon Hill",
    journeySlug: "ghorepani-poon-hill",
    waypoints: [
      { name: "Nayapul", km: 0, elevationM: 1070, coords: [83.6833, 28.3167], day: 1 },
      { name: "Tikhedhunga", km: 7, elevationM: 1540, coords: [83.7017, 28.3392], day: 1 },
      { name: "Ulleri", km: 10, elevationM: 2050, coords: [83.6994, 28.3597], day: 2, note: "Reached by a stone staircase of around three thousand steps." },
      { name: "Ghorepani", km: 17, elevationM: 2860, coords: [83.6919, 28.3987], day: 2, note: "On the ridge, in rhododendron forest." },
      { name: "Poon Hill", km: 19, elevationM: 3210, coords: [83.6866, 28.4004], day: 3, high: true, note: "Sunrise viewpoint. Annapurna South, Machhapuchhre and Dhaulagiri together." },
      { name: "Tadapani", km: 27, elevationM: 2630, coords: [83.7503, 28.3939], day: 3 },
      { name: "Ghandruk", km: 33, elevationM: 1940, coords: [83.8117, 28.3756], day: 4 },
    ],
    preparation: [
      "The route stays below 3,250 m, so altitude is not a meaningful risk. This is what makes it a sensible first Himalayan trek.",
      "The staircase to Ulleri is the hardest part of the walk and it comes on the second morning. Slow and steady genuinely works better than pushing.",
      "Rhododendron flowers between late March and April, which is the single best argument for spring over autumn on this particular route.",
      "Poon Hill starts in the dark, around half past four. A headtorch is not optional, and the ridge is cold before sunrise in any season.",
    ],
  },

  {
    id: "langtang",
    name: "Langtang Valley",
    journeySlug: "langtang-valley",
    waypoints: [
      { name: "Syabrubesi", km: 0, elevationM: 1460, coords: [85.3383, 28.1611], day: 2, note: "Road head, seven hours from Kathmandu." },
      { name: "Lama Hotel", km: 11, elevationM: 2470, coords: [85.4172, 28.1897], day: 3, note: "In oak and bamboo forest. Langur monkeys are common here." },
      { name: "Langtang village", km: 23, elevationM: 3430, coords: [85.5111, 28.2094], day: 4, note: "Rebuilt after the 2015 avalanche. A memorial marks the original site." },
      { name: "Kyanjin Gompa", km: 30, elevationM: 3870, coords: [85.5636, 28.2114], day: 5, note: "Head of the valley. Monastery and community cheese factory." },
      { name: "Tserko Ri", km: 36, elevationM: 4984, coords: [85.5883, 28.2264], day: 6, high: true, note: "A 1,100 m day ascent for the full circle of the Langtang Himal." },
    ],
    preparation: [
      "No domestic flight is involved, which removes the largest single cause of delay on Nepali treks. The trade is a seven-hour road day at each end.",
      "Tserko Ri gains 1,100 m and loses it again in one day from 3,870 m. It is the hardest day of the trek by a distance, and skipping it for the moraine walk toward Langshisha is a reasonable choice.",
      "Lodges in the valley are largely community-owned and rebuilt since 2015. Booking ahead is not usually necessary outside the October peak.",
      "The valley is avalanche terrain in winter and early spring. Local advice at Syabrubesi and Lama Hotel governs, and it changes year to year.",
    ],
  },

  {
    id: "mustang",
    name: "Upper Mustang",
    journeySlug: "upper-mustang-lo-manthang",
    waypoints: [
      { name: "Jomsom", km: 0, elevationM: 2720, coords: [83.7228, 28.7808], day: 3 },
      { name: "Kagbeni", km: 10, elevationM: 2810, coords: [83.7847, 28.8322], day: 3, note: "The gateway village. Restricted-area checkpoint." },
      { name: "Chele", km: 22, elevationM: 3050, coords: [83.8036, 28.9053], day: 4 },
      { name: "Syangboche", km: 36, elevationM: 3800, coords: [83.8556, 28.9789], day: 5, note: "Two passes above 3,700 m in one day." },
      { name: "Ghami", km: 47, elevationM: 3520, coords: [83.8878, 29.0261], day: 6, note: "Beside one of the longest mani walls in Nepal." },
      { name: "Tsarang", km: 58, elevationM: 3560, coords: [83.9317, 29.0725], day: 7, note: "Old fort and monastery above the Tsarang Khola." },
      { name: "Lo Manthang", km: 70, elevationM: 3840, coords: [83.9578, 29.1833], day: 8, high: true, note: "Walled capital of the former Kingdom of Lo." },
    ],
    preparation: [
      "The restricted-area permit must be arranged in advance through a registered agency, and a minimum group size applies. This is a genuine planning constraint — it cannot be sorted out on arrival.",
      "Mustang sits in the Himalayan rain shadow, so it is walkable from June to August when most of Nepal is not. That is the main reason to choose it.",
      "Wind is the daily pattern rather than an event. Days start early and finish early, because afternoons on the plateau are consistently hard walking.",
      "Lodges are simpler than on the Annapurna and Khumbu routes, and there are long stretches without resupply. Carry what you need between villages.",
    ],
  },
];

export const trekById = (id: string) => treks.find((t) => t.id === id);

/** The high point of a route. */
export const trekHighPoint = (t: Trek) =>
  t.waypoints.reduce((a, b) => (b.elevationM > a.elevationM ? b : a));

/**
 * General altitude guidance. Deliberately conservative and deliberately not
 * medical advice — it points at the recognised sources rather than
 * paraphrasing them into something that reads as authoritative.
 */
export const ALTITUDE_GUIDANCE = {
  heading: "On altitude",
  body: [
    "Above roughly 2,500 m, how fast you ascend matters more than how fit you are. Fitness helps you enjoy the walk; it does not protect you from altitude illness.",
    "Every itinerary here that goes high includes acclimatisation days. They exist for a physiological reason and are the first thing a compressed schedule removes.",
    "Symptoms worth taking seriously are headache that does not respond to painkillers, nausea, breathlessness at rest, and loss of coordination. The reliable response to all of them is to descend.",
  ],
  sources: [
    {
      label: "Himalayan Rescue Association Nepal",
      note: "Runs the aid posts at Manang and Pheriche and gives free daily altitude talks in season.",
    },
    {
      label: "A travel medicine clinic, before you fly",
      note: "For advice on your own history and on medication such as acetazolamide.",
    },
  ],
  disclaimer:
    "This is general information, not medical advice, and it is not a substitute for a briefing from your guide or a consultation with a travel clinic.",
} as const;
