import type { ExperienceId } from "./experiences";

/**
 * JOURNEYS — the routes Logosa can run.
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  ⚠  These are the standard, well-established routes of Nepali trekking and
 *     touring, described factually: real place names, real elevations, real
 *     walking times, real permit requirements.
 *
 *     What is deliberately ABSENT, and must be supplied by Logosa:
 *       · price          — every journey ships with price: null
 *       · included /     — commercial promises. Left empty on purpose: the
 *         excluded         site asks the traveller to request them in writing
 *                          rather than showing terms nobody has agreed to.
 *       · groupSize, guide ratios, accommodation grades
 *
 *     REVIEW REQUIRED: these ship published because each is an accurate
 *     description of a real, standard route — not because Logosa has
 *     confirmed they operate it. Set `status: "draft"` on anything Logosa
 *     does not run and it disappears from the production site.
 * ─────────────────────────────────────────────────────────────────────────
 */

/**
 * Honest difficulty bands. Written so a traveller can self-assess, and
 * deliberately not inflated — overstating difficulty sells gear, understating
 * it hurts people.
 */
export const DIFFICULTY = {
  easy: {
    label: "Easy",
    note: "Day walks under about four hours, below 2,500 m. No altitude risk. Suitable for most reasonably mobile people.",
  },
  moderate: {
    label: "Moderate",
    note: "Four to six hours of walking most days, up to roughly 4,000 m, with sustained ascents. Regular hill walking beforehand makes a real difference.",
  },
  demanding: {
    label: "Demanding",
    note: "Five to seven hours most days with time spent above 4,000 m. Altitude becomes the limiting factor, not fitness.",
  },
  strenuous: {
    label: "Strenuous",
    note: "Long days above 5,000 m, including pass crossings and pre-dawn starts. Genuine altitude risk that acclimatisation schedules manage but do not remove.",
  },
} as const;

export type Difficulty = keyof typeof DIFFICULTY;

export type JourneyStyle =
  | "Teahouse trek"
  | "Guided tour"
  | "Wildlife safari"
  | "Pilgrimage"
  | "Multi-region";

export interface ItineraryDay {
  /** A single day, or a range for rest/acclimatisation blocks. */
  day: number | [number, number];
  title: string;
  note: string;
  /** Elevation slept at, in metres. */
  elevationM?: number;
  /** Hours on foot. Omitted on travel days. */
  walkHours?: string;
  /** Set on days that move by vehicle or air. */
  transfer?: string;
  /** Flagged in the UI — these days exist for a physiological reason. */
  acclimatisation?: boolean;
}

export interface Journey {
  slug: string;
  name: string;
  status: "draft" | "published";
  style: JourneyStyle;
  /** Slugs from destinations.ts. */
  destinations: string[];
  experiences: ExperienceId[];
  days: number;
  difficulty: Difficulty;
  maxAltitudeM?: number;
  startPoint: string;
  endPoint: string;
  bestMonths: number[];
  /** Where travellers sleep. Factual, not a grade claim. */
  accommodation: string;
  summary: string;
  body: string[];
  itinerary: ItineraryDay[];
  permits: string[];
  /** Links to the elevation profile in treks.ts. */
  trekId?: string;
  /** ALWAYS null until Logosa supplies real figures. */
  price: null;
  /** Commercial terms — intentionally empty. See the file header. */
  included: string[];
  excluded: string[];
  image: string;
  imageAlt: string;
}

export const journeys: Journey[] = [
  {
    slug: "everest-base-camp",
    name: "Everest Base Camp",
    status: "published",
    style: "Teahouse trek",
    destinations: ["everest-khumbu", "kathmandu-valley"],
    experiences: ["trekking", "adventure", "photography"],
    days: 14,
    difficulty: "strenuous",
    maxAltitudeM: 5545,
    startPoint: "Lukla (2,860 m)",
    endPoint: "Lukla (2,860 m)",
    bestMonths: [3, 4, 5, 10, 11],
    accommodation: "Sherpa-run teahouses along the route; hotel in Kathmandu.",
    summary:
      "The classic walk into the Khumbu: Lukla to Base Camp and Kala Patthar, with two built-in acclimatisation days. Fourteen days, two of them spent deliberately not gaining altitude.",
    body: [
      "This is the route almost everyone means by 'Everest'. It follows the Dudh Koshi north from Lukla, climbs to Namche Bazaar, and continues past Tengboche and Dingboche onto the Khumbu glacier moraine.",
      "The schedule is built around ascent rate. Two acclimatisation days — at Namche and Dingboche — are not padding, and removing them to save time is the single most common cause of trouble on this trek. Both are active days: you climb several hundred metres and sleep low again, which is what actually drives acclimatisation.",
      "Lukla flights are weather-dependent. Delays of a day or more are ordinary in October and during the spring, so plan spare time in Kathmandu at the end rather than booking a tight international connection.",
    ],
    itinerary: [
      { day: 1, title: "Arrive Kathmandu", note: "Transfer to hotel. Route briefing and a kit check in the afternoon.", elevationM: 1400, transfer: "Airport transfer" },
      { day: 2, title: "Kathmandu", note: "Permits arranged. Time for anything missing from your kit — Thamel is well supplied.", elevationM: 1400 },
      { day: 3, title: "Fly to Lukla, walk to Phakding", note: "An early flight into Tenzing–Hillary airstrip, then a gentle descending walk along the Dudh Koshi.", elevationM: 2610, walkHours: "3–4 hrs", transfer: "Flight to Lukla" },
      { day: 4, title: "Phakding to Namche Bazaar", note: "Suspension bridges over the Dudh Koshi, then the long climb to Namche. The park entrance is at Monjo.", elevationM: 3440, walkHours: "5–6 hrs" },
      { day: 5, title: "Namche — acclimatisation", note: "Walk high, sleep low: up to the Everest View Hotel at 3,880 m and back down. First clear sight of Everest.", elevationM: 3440, walkHours: "3–4 hrs", acclimatisation: true },
      { day: 6, title: "Namche to Tengboche", note: "A traverse with Ama Dablam ahead, a drop to the Dudh Koshi, then the climb to the monastery ridge.", elevationM: 3867, walkHours: "5 hrs" },
      { day: 7, title: "Tengboche to Dingboche", note: "Through Pangboche and above the treeline into the Imja valley.", elevationM: 4410, walkHours: "5 hrs" },
      { day: 8, title: "Dingboche — acclimatisation", note: "Up Nangkartshang ridge to around 5,080 m and back. A hard afternoon that makes the following week possible.", elevationM: 4410, walkHours: "4 hrs", acclimatisation: true },
      { day: 9, title: "Dingboche to Lobuche", note: "Along the Khumbu glacier moraine past the memorials at Thukla Pass.", elevationM: 4940, walkHours: "5 hrs" },
      { day: 10, title: "Lobuche to Base Camp, sleep Gorak Shep", note: "The moraine walk to Everest Base Camp at 5,364 m, returning to Gorak Shep to sleep.", elevationM: 5164, walkHours: "7–8 hrs" },
      { day: 11, title: "Kala Patthar, descend to Pheriche", note: "Pre-dawn to 5,545 m for the clearest view of Everest's summit pyramid, then a long descent.", elevationM: 4240, walkHours: "7–8 hrs" },
      { day: 12, title: "Pheriche to Namche", note: "Back below the treeline. The air difference is immediate and noticeable.", elevationM: 3440, walkHours: "6–7 hrs" },
      { day: 13, title: "Namche to Lukla", note: "The last walking day, retracing the river to Lukla.", elevationM: 2860, walkHours: "6–7 hrs" },
      { day: 14, title: "Fly to Kathmandu", note: "Morning flight, weather permitting. Keep the day after free.", elevationM: 1400, transfer: "Flight to Kathmandu" },
    ],
    permits: ["Sagarmatha National Park entry permit", "Khumbu Pasang Lhamu Rural Municipality permit"],
    trekId: "ebc",
    price: null,
    included: [],
    excluded: [],
    image: "/images/destinations/khumbu-icefall.webp",
    imageAlt: "The Khumbu icefall and glacier moraine below Everest, prayer flags strung along the camp",
  },

  {
    slug: "annapurna-base-camp",
    name: "Annapurna Base Camp",
    status: "published",
    style: "Teahouse trek",
    destinations: ["annapurna", "pokhara"],
    experiences: ["trekking", "photography", "culture"],
    days: 11,
    difficulty: "demanding",
    maxAltitudeM: 4130,
    startPoint: "Pokhara (822 m)",
    endPoint: "Pokhara (822 m)",
    bestMonths: [3, 4, 5, 10, 11, 12],
    accommodation: "Teahouses through the Modi Khola; hotel in Pokhara and Kathmandu.",
    summary:
      "Up the Modi Khola gorge into a glacial amphitheatre ringed by peaks on all sides. Eleven days, topping out at 4,130 m without a pass crossing.",
    body: [
      "The Annapurna Sanctuary is a closed basin — you walk up a narrowing gorge for days, and then it opens into a ring of mountains standing more than three vertical kilometres above the floor. The approach is the point as much as the arrival.",
      "It is a lower trek than Everest Base Camp and there is no pass to cross, but the ascent from Bamboo to the sanctuary is quick, so the last two days still need to be walked at a measured pace.",
      "Terraced Gurung villages in the lower valley — Ghandruk and Chhomrong — are among the most attractive settlements on any Nepali trail, and worth more than the single night most schedules give them.",
    ],
    itinerary: [
      { day: 1, title: "Arrive Kathmandu", note: "Transfer and briefing.", elevationM: 1400, transfer: "Airport transfer" },
      { day: 2, title: "Kathmandu to Pokhara", note: "By air in 25 minutes, or the Prithvi Highway in six to seven hours.", elevationM: 822, transfer: "Flight or road" },
      { day: 3, title: "Drive to Nayapul, walk to Ghandruk", note: "Into the Gurung terraces. Stone-paved lanes and slate roofs.", elevationM: 1940, walkHours: "4–5 hrs", transfer: "1.5 hr drive" },
      { day: 4, title: "Ghandruk to Chhomrong", note: "Down to the Kimrong Khola and back up. Machhapuchhre ahead all afternoon.", elevationM: 2170, walkHours: "5–6 hrs" },
      { day: 5, title: "Chhomrong to Bamboo", note: "The long stone staircase down to the river, then into bamboo and rhododendron forest.", elevationM: 2310, walkHours: "5 hrs" },
      { day: 6, title: "Bamboo to Deurali", note: "The gorge narrows. Past Himalaya Hotel and out of the treeline.", elevationM: 3230, walkHours: "5 hrs" },
      { day: 7, title: "Deurali to Annapurna Base Camp", note: "Through Machhapuchhre Base Camp at 3,700 m, then into the sanctuary itself.", elevationM: 4130, walkHours: "5–6 hrs" },
      { day: 8, title: "Base Camp to Bamboo", note: "Sunrise on the amphitheatre before a long descent.", elevationM: 2310, walkHours: "6–7 hrs" },
      { day: 9, title: "Bamboo to Jhinu Danda", note: "Down to the hot springs by the Modi Khola — a twenty-minute walk below the village.", elevationM: 1780, walkHours: "5 hrs" },
      { day: 10, title: "Jhinu Danda to Pokhara", note: "Short walk out to the road head and back to the lake.", elevationM: 822, walkHours: "2–3 hrs", transfer: "2 hr drive" },
      { day: 11, title: "Pokhara to Kathmandu", note: "Return by air or road.", elevationM: 1400, transfer: "Flight or road" },
    ],
    permits: ["Annapurna Conservation Area Permit (ACAP)", "TIMS card"],
    trekId: "abc",
    price: null,
    included: [],
    excluded: [],
    image: "/images/destinations/annapurna.webp",
    imageAlt: "Trekkers walking into the Annapurna Sanctuary, a glacial basin ringed by snow peaks",
  },

  {
    slug: "annapurna-circuit",
    name: "Annapurna Circuit & Thorong La",
    status: "published",
    style: "Teahouse trek",
    destinations: ["annapurna", "pokhara", "upper-mustang"],
    experiences: ["trekking", "adventure", "culture", "photography"],
    days: 16,
    difficulty: "strenuous",
    maxAltitudeM: 5416,
    startPoint: "Besisahar (760 m)",
    endPoint: "Pokhara (822 m)",
    bestMonths: [3, 4, 5, 10, 11],
    accommodation: "Teahouses throughout; hotels in Pokhara and Kathmandu.",
    summary:
      "Subtropical farmland to Tibetan high desert in one continuous walk, over the 5,416 m Thorong La. The widest range of landscape available on any single Nepali route.",
    body: [
      "The circuit's value is the transition. You start among rice terraces and banana at around 800 m, walk up through oak and rhododendron, cross a 5,416 m pass, and come down the other side into an arid, Tibetan-influenced valley where it barely rains.",
      "Road building has shortened the classic route at both ends, and most schedules now drive the lower Marsyangdi and finish from Jomsom. This is a genuine loss to the walk, and also what makes a sixteen-day version possible.",
      "Thorong La is crossed west-bound, starting between four and five in the morning to be over before the afternoon wind. It is the one day of the trek where the schedule is not negotiable.",
    ],
    itinerary: [
      { day: 1, title: "Arrive Kathmandu", note: "Transfer, briefing, permits.", elevationM: 1400, transfer: "Airport transfer" },
      { day: 2, title: "Kathmandu to Jagat", note: "Drive to Besisahar and on up the Marsyangdi by jeep.", elevationM: 1300, transfer: "8–9 hr drive" },
      { day: 3, title: "Jagat to Dharapani", note: "Into the gorge proper. The valley closes in.", elevationM: 1860, walkHours: "6 hrs" },
      { day: 4, title: "Dharapani to Chame", note: "Pine forest, and the first sight of Annapurna II.", elevationM: 2670, walkHours: "5–6 hrs" },
      { day: 5, title: "Chame to Pisang", note: "Past the Paungda Danda rock face — a curved slab rising more than a kilometre.", elevationM: 3300, walkHours: "5–6 hrs" },
      { day: 6, title: "Pisang to Manang", note: "The upper route via Ghyaru and Ngawal is longer, higher and much better.", elevationM: 3540, walkHours: "6–7 hrs" },
      { day: 7, title: "Manang — acclimatisation", note: "Day walk to Ice Lake or the Gangapurna viewpoint. Altitude briefing at the HRA post.", elevationM: 3540, walkHours: "4–5 hrs", acclimatisation: true },
      { day: 8, title: "Manang to Yak Kharka", note: "Above the treeline. Short day by design.", elevationM: 4050, walkHours: "3–4 hrs" },
      { day: 9, title: "Yak Kharka to Thorong Phedi", note: "A short, deliberately easy day at the foot of the pass.", elevationM: 4525, walkHours: "3–4 hrs" },
      { day: 10, title: "Thorong La to Muktinath", note: "Start before dawn. Over the pass at 5,416 m, then a 1,600 m descent to Muktinath.", elevationM: 3760, walkHours: "8–9 hrs" },
      { day: 11, title: "Muktinath", note: "The temple complex, its 108 spouts and the natural gas flame. Sacred to Hindus and Buddhists alike.", elevationM: 3760, walkHours: "2 hrs" },
      { day: 12, title: "Muktinath to Marpha", note: "Down the Kali Gandaki through Jomsom to Marpha, a whitewashed Thakali village known for its apples.", elevationM: 2670, walkHours: "5–6 hrs" },
      { day: 13, title: "Marpha to Tatopani", note: "Continuing down the gorge between Annapurna and Dhaulagiri to the hot springs.", elevationM: 1200, walkHours: "5 hrs", transfer: "Partly by jeep" },
      { day: 14, title: "Tatopani to Pokhara", note: "Out along the Kali Gandaki to the road and on to the lake.", elevationM: 822, transfer: "5–6 hr drive" },
      { day: 15, title: "Pokhara", note: "A day at the lake. Sarangkot at sunrise if the weather holds.", elevationM: 822 },
      { day: 16, title: "Pokhara to Kathmandu", note: "Return by air or road.", elevationM: 1400, transfer: "Flight or road" },
    ],
    permits: ["Annapurna Conservation Area Permit (ACAP)", "TIMS card"],
    trekId: "circuit",
    price: null,
    included: [],
    excluded: [],
    image: "/images/destinations/upper-mustang.webp",
    imageAlt: "The arid Kali Gandaki valley north of Thorong La, with eroded cliffs above the riverbed",
  },

  {
    slug: "ghorepani-poon-hill",
    name: "Ghorepani & Poon Hill",
    status: "published",
    style: "Teahouse trek",
    destinations: ["annapurna", "pokhara"],
    experiences: ["trekking", "photography", "culture"],
    days: 5,
    difficulty: "moderate",
    maxAltitudeM: 3210,
    startPoint: "Pokhara (822 m)",
    endPoint: "Pokhara (822 m)",
    bestMonths: [3, 4, 5, 10, 11, 12, 1, 2],
    accommodation: "Teahouses in Gurung and Magar villages; hotel in Pokhara.",
    summary:
      "Five days from Pokhara to a 3,210 m ridge looking straight at Annapurna and Dhaulagiri. No altitude risk, and the best short introduction to Himalayan trekking.",
    body: [
      "This is the trek to do first, or the one to do when time is short. It stays below the altitude at which the mountains become a medical question, and it still puts you on a ridge at 3,210 m with two eight-thousanders in view.",
      "The rhododendron forest between Ghorepani and Tadapani is the finest stretch of forest on any popular Nepali trail, and it flowers through late March and April.",
      "The stone staircase up to Ulleri is the one genuinely hard section — around three thousand steps. It is over in a morning.",
    ],
    itinerary: [
      { day: 1, title: "Pokhara to Tikhedhunga", note: "Drive to Nayapul and walk up the Bhurungdi Khola.", elevationM: 1540, walkHours: "4 hrs", transfer: "1.5 hr drive" },
      { day: 2, title: "Tikhedhunga to Ghorepani", note: "The stone staircase to Ulleri, then oak and rhododendron to the ridge.", elevationM: 2860, walkHours: "6 hrs" },
      { day: 3, title: "Poon Hill, then Tadapani", note: "Up in the dark for sunrise at 3,210 m on Annapurna South, Machhapuchhre and Dhaulagiri, then a forest traverse.", elevationM: 2630, walkHours: "6 hrs" },
      { day: 4, title: "Tadapani to Ghandruk, drive to Pokhara", note: "Down into the largest Gurung village in the region, then back to the lake.", elevationM: 822, walkHours: "3–4 hrs", transfer: "2 hr drive" },
      { day: 5, title: "Pokhara", note: "The lake, the old bazaar, or onward travel.", elevationM: 822 },
    ],
    permits: ["Annapurna Conservation Area Permit (ACAP)", "TIMS card"],
    trekId: "poonhill",
    price: null,
    included: [],
    excluded: [],
    image: "/images/destinations/poon-hill.webp",
    imageAlt: "Dhaulagiri above the Poon Hill ridge, seen over flowering rhododendron in spring",
  },

  {
    slug: "langtang-valley",
    name: "Langtang Valley",
    status: "published",
    style: "Teahouse trek",
    destinations: ["langtang", "kathmandu-valley"],
    experiences: ["trekking", "culture", "photography"],
    days: 9,
    difficulty: "demanding",
    maxAltitudeM: 4984,
    startPoint: "Syabrubesi (1,460 m)",
    endPoint: "Syabrubesi (1,460 m)",
    bestMonths: [3, 4, 5, 10, 11, 12],
    accommodation: "Community-run teahouses rebuilt since 2015; hotel in Kathmandu.",
    summary:
      "Nine days into the nearest high valley to Kathmandu, with no domestic flight to be delayed by. Kyanjin Gompa at 3,870 m, and Tserko Ri at 4,984 m if the legs allow.",
    body: [
      "Langtang is reached by road, which removes the single largest source of uncertainty in Nepali trekking. Seven hours from Kathmandu to Syabrubesi, and you walk from there.",
      "The valley was destroyed by an earthquake-triggered avalanche in April 2015. It has been rebuilt by the families who returned, and most lodges on the route are community-owned. That is a reason to walk here, and it is stated as fact rather than as a cause.",
      "From Kyanjin Gompa the day walks are the reward: Tserko Ri at 4,984 m for the full circle of the Langtang Himal, or the gentler moraine walk toward Langshisha Kharka.",
    ],
    itinerary: [
      { day: 1, title: "Arrive Kathmandu", note: "Transfer and briefing.", elevationM: 1400, transfer: "Airport transfer" },
      { day: 2, title: "Kathmandu to Syabrubesi", note: "A long road day north to the Tibetan border region.", elevationM: 1460, transfer: "7 hr drive" },
      { day: 3, title: "Syabrubesi to Lama Hotel", note: "Up the Langtang Khola through oak and bamboo. Langur monkeys are common.", elevationM: 2470, walkHours: "6 hrs" },
      { day: 4, title: "Lama Hotel to Langtang village", note: "Out of the forest as the valley opens. Past the memorial at the old village site.", elevationM: 3430, walkHours: "6 hrs" },
      { day: 5, title: "Langtang to Kyanjin Gompa", note: "A short day past mani walls and yak pasture to the head of the valley.", elevationM: 3870, walkHours: "3 hrs" },
      { day: 6, title: "Kyanjin — Tserko Ri", note: "A hard 1,100 m ascent to 4,984 m and back, or the easier moraine walk if conditions say otherwise.", elevationM: 3870, walkHours: "6–7 hrs", acclimatisation: true },
      { day: 7, title: "Kyanjin to Lama Hotel", note: "Back down the valley in one long day.", elevationM: 2470, walkHours: "6 hrs" },
      { day: 8, title: "Lama Hotel to Syabrubesi", note: "The last of the forest, and out to the road.", elevationM: 1460, walkHours: "5 hrs" },
      { day: 9, title: "Syabrubesi to Kathmandu", note: "Return by road.", elevationM: 1400, transfer: "7 hr drive" },
    ],
    permits: ["Langtang National Park entry permit", "TIMS card"],
    trekId: "langtang",
    price: null,
    included: [],
    excluded: [],
    image: "/images/destinations/langtang.webp",
    imageAlt: "The upper Langtang valley with glaciated peaks above a prayer-flagged suspension bridge",
  },

  {
    slug: "upper-mustang-lo-manthang",
    name: "Upper Mustang & Lo Manthang",
    status: "published",
    style: "Teahouse trek",
    destinations: ["upper-mustang", "pokhara"],
    experiences: ["trekking", "culture", "photography", "pilgrimage"],
    days: 14,
    difficulty: "demanding",
    maxAltitudeM: 4230,
    startPoint: "Jomsom (2,720 m)",
    endPoint: "Jomsom (2,720 m)",
    bestMonths: [4, 5, 6, 7, 8, 9, 10],
    accommodation: "Simple village lodges in Lo; hotels in Pokhara and Kathmandu.",
    summary:
      "Fourteen days into a restricted Tibetan region north of the Himalaya, ending at the walled capital of the old Kingdom of Lo. Walkable through the monsoon, because it sits in the rain shadow.",
    body: [
      "Upper Mustang requires a restricted-area permit with a minimum group size, arranged in advance through a registered agency — the paperwork is a real constraint on planning and needs lead time.",
      "The landscape north of Kagbeni is unlike anywhere else in Nepal: ochre and grey badlands, cliff-cut caves, whitewashed villages behind mud walls. The architecture, language and religion are Tibetan.",
      "Because the monsoon is blocked by the main Himalayan chain, this is one of the few trekking regions that works between June and August, when almost everywhere else in Nepal is under cloud.",
    ],
    itinerary: [
      { day: 1, title: "Arrive Kathmandu", note: "Permit paperwork begins — allow working days for the restricted-area permit.", elevationM: 1400, transfer: "Airport transfer" },
      { day: 2, title: "Kathmandu to Pokhara", note: "By air or road.", elevationM: 822, transfer: "Flight or road" },
      { day: 3, title: "Fly to Jomsom, walk to Kagbeni", note: "An early mountain flight up the Kali Gandaki, then a short walk to the gateway village of Upper Mustang.", elevationM: 2810, walkHours: "3 hrs", transfer: "Flight to Jomsom" },
      { day: 4, title: "Kagbeni to Chele", note: "Through the permit checkpoint and into the restricted zone.", elevationM: 3050, walkHours: "5–6 hrs" },
      { day: 5, title: "Chele to Syangboche", note: "Over two passes above 3,700 m. Wind from midday onward.", elevationM: 3800, walkHours: "6–7 hrs" },
      { day: 6, title: "Syangboche to Ghami", note: "Past the long mani wall at Ghami — among the longest in Nepal.", elevationM: 3520, walkHours: "5 hrs" },
      { day: 7, title: "Ghami to Tsarang", note: "Across the Ghami Khola and up to the old fort and monastery at Tsarang.", elevationM: 3560, walkHours: "5 hrs" },
      { day: 8, title: "Tsarang to Lo Manthang", note: "Over the Lo La at around 3,950 m for the first view of the walled city.", elevationM: 3840, walkHours: "5 hrs" },
      { day: 9, title: "Lo Manthang", note: "The three principal gompas inside the walls, and the fifteenth-century murals at Thubchen.", elevationM: 3840 },
      { day: 10, title: "Lo Manthang — Chhoser caves", note: "North to the Jhong sky caves, a multi-storey cave complex cut into the cliff.", elevationM: 3840, walkHours: "5 hrs" },
      { day: 11, title: "Lo Manthang to Dhakmar", note: "The western return route past Ghar Gompa, the oldest monastery in the region.", elevationM: 3820, walkHours: "6–7 hrs" },
      { day: 12, title: "Dhakmar to Samar", note: "Red cliffs above Dhakmar, then south along the high route.", elevationM: 3660, walkHours: "6 hrs" },
      { day: 13, title: "Samar to Jomsom", note: "Out through Chele and Kagbeni to Jomsom.", elevationM: 2720, walkHours: "6–7 hrs" },
      { day: 14, title: "Fly to Pokhara, on to Kathmandu", note: "Morning flight before the valley wind gets up.", elevationM: 1400, transfer: "Flights" },
    ],
    permits: [
      "Upper Mustang Restricted Area Permit — arranged in advance, minimum group size applies",
      "Annapurna Conservation Area Permit (ACAP)",
    ],
    trekId: "mustang",
    price: null,
    included: [],
    excluded: [],
    image: "/images/destinations/upper-mustang.webp",
    imageAlt: "A Mustang settlement on the high plateau, whitewashed walls and chortens against ochre cliffs",
  },

  {
    slug: "kathmandu-valley-heritage",
    name: "Kathmandu Valley Heritage",
    status: "published",
    style: "Guided tour",
    destinations: ["kathmandu-valley"],
    experiences: ["culture", "photography", "food", "pilgrimage"],
    days: 4,
    difficulty: "easy",
    startPoint: "Kathmandu",
    endPoint: "Kathmandu",
    bestMonths: [10, 11, 12, 1, 2, 3, 4],
    accommodation: "Hotel in Kathmandu or a restored Newar house in Patan or Bhaktapur.",
    summary:
      "Four days across the three old kingdoms with a guide who can read the iconography — the difference between looking at a temple and understanding one.",
    body: [
      "Four days is enough to see the valley properly rather than tick off durbar squares. The itinerary is arranged around light and crowds: Bhaktapur early, Boudhanath at dusk, Patan Museum in the middle of the day when the sun is unhelpful outside.",
      "The valley's interest is in the detail — strut carving, repoussé metalwork, the sunken hiti water systems still running after eight hundred years. A guide who knows the iconography is the whole difference here.",
      "Craft workshops in Patan and Bhaktapur still work in bronze, wood and clay, and several are open to visitors. This is a working tradition, not a demonstration for tourists.",
    ],
    itinerary: [
      { day: 1, title: "Arrive Kathmandu", note: "Transfer, and an evening walk through the old bazaar routes around Asan and Indra Chowk.", elevationM: 1400, transfer: "Airport transfer" },
      { day: 2, title: "Patan and Kathmandu Durbar Square", note: "Patan Museum in the morning, the durbar squares and the living-goddess house at Kumari Ghar after.", elevationM: 1400 },
      { day: 3, title: "Bhaktapur, then Boudhanath at dusk", note: "Bhaktapur early while it is quiet — Pottery Square, the 55-Window Palace — then Boudhanath for the evening kora.", elevationM: 1400 },
      { day: 4, title: "Swayambhunath and Pashupatinath", note: "The 365 steps up Swayambhunath for the valley's geography, and Pashupatinath on the Bagmati.", elevationM: 1400 },
    ],
    permits: ["Monument-zone entry tickets, purchased on the day"],
    price: null,
    included: [],
    excluded: [],
    image: "/images/destinations/patan.webp",
    imageAlt: "The stone shikhara of Krishna Mandir and tiered temple roofs in Patan Durbar Square",
  },

  {
    slug: "chitwan-wildlife",
    name: "Chitwan Wildlife Safari",
    status: "published",
    style: "Wildlife safari",
    destinations: ["chitwan"],
    experiences: ["wildlife", "photography", "culture", "leisure"],
    days: 3,
    difficulty: "easy",
    startPoint: "Sauraha, Chitwan",
    endPoint: "Sauraha, Chitwan",
    bestMonths: [10, 11, 12, 1, 2, 3],
    accommodation: "Lodges on the park boundary at Sauraha or along the Rapti.",
    summary:
      "Three days on the Terai floodplain: dawn canoe on the Rapti, walking safari with a licensed naturalist, and the grassland where the one-horned rhino is most reliably seen.",
    body: [
      "Chitwan's wildlife is best at the edges of the day. The schedule is built around a dawn canoe drift and a late-afternoon grassland drive, with the hot middle of the day given over to the visitor centre or the elephant breeding centre.",
      "Rhino sightings are common and reasonably dependable in the right habitat. Tigers are present in low density and are rarely seen — any operator implying otherwise is overselling.",
      "Guided walks on foot with a licensed naturalist are permitted in some sectors. They are quiet, close to the ground and completely different from a vehicle, and they carry a briefing you should listen to.",
    ],
    itinerary: [
      { day: 1, title: "Arrive Sauraha", note: "Afternoon walk to the Rapti for sunset, and a Tharu cultural evening in the village.", elevationM: 150, transfer: "Road or flight to Bharatpur" },
      { day: 2, title: "Full day in the park", note: "Dawn canoe on the Rapti, then jungle walk or jeep through sal forest and grassland. Visitor centre in the heat of the day.", elevationM: 150 },
      { day: 3, title: "Morning drive, then onward", note: "An early grassland drive before departure — the best rhino window of the day.", elevationM: 150 },
    ],
    permits: ["Chitwan National Park daily entry permit"],
    price: null,
    included: [],
    excluded: [],
    image: "/images/destinations/chitwan.webp",
    imageAlt: "Morning mist over elephant grass and river channels in Chitwan National Park",
  },

  {
    slug: "lumbini-pilgrimage",
    name: "Lumbini Pilgrimage",
    status: "published",
    style: "Pilgrimage",
    destinations: ["lumbini"],
    experiences: ["pilgrimage", "culture", "photography"],
    days: 3,
    difficulty: "easy",
    startPoint: "Bhairahawa",
    endPoint: "Bhairahawa",
    bestMonths: [10, 11, 12, 1, 2, 3],
    accommodation: "Hotels at Lumbini or Bhairahawa; monastery guest houses where available.",
    summary:
      "Three unhurried days at the birthplace of the Buddha and the monastic zone around it, including the Ashokan pillar of 249 BCE.",
    body: [
      "Most visitors give Lumbini half a day between other places. Three days lets you walk Tange's three-kilometre axis properly, sit in the Maya Devi Temple when it is quiet, and see the monastic zone at both ends of the day.",
      "The nearby sites at Tilaurakot — identified with Kapilavastu, where Siddhartha spent his early life — are an excavated palace complex, and considerably quieter than Lumbini itself.",
      "Early morning at the Bodhi tree and the sacred pond, before the coaches arrive, is the reason to stay overnight rather than pass through.",
    ],
    itinerary: [
      { day: 1, title: "Arrive Lumbini", note: "Evening at the Maya Devi Temple and the sacred pond as the site empties.", elevationM: 150, transfer: "Flight to Bhairahawa or road" },
      { day: 2, title: "The sacred garden and monastic zone", note: "The Ashokan pillar and excavations in the morning, then the monasteries along the central canal.", elevationM: 150 },
      { day: 3, title: "Tilaurakot, then onward", note: "The excavated palace complex at Kapilavastu, 27 km west.", elevationM: 150 },
    ],
    permits: ["Lumbini development zone entry ticket"],
    price: null,
    included: [],
    excluded: [],
    image: "/images/destinations/lumbini.webp",
    imageAlt: "The Maya Devi Temple at Lumbini reflected in the sacred pond in early light",
  },

  {
    slug: "nepal-in-eight-days",
    name: "Nepal in Eight Days",
    status: "published",
    style: "Multi-region",
    destinations: ["kathmandu-valley", "pokhara", "chitwan"],
    experiences: ["culture", "wildlife", "leisure", "photography", "food"],
    days: 8,
    difficulty: "easy",
    startPoint: "Kathmandu",
    endPoint: "Kathmandu",
    bestMonths: [10, 11, 12, 1, 2, 3, 4],
    accommodation: "Hotels in Kathmandu and Pokhara; a lodge on the Chitwan park boundary.",
    summary:
      "The three-region route — valley, lake and jungle — for a first visit with limited time. No trekking, no altitude, and a day walk above Pokhara if you want one.",
    body: [
      "This is the standard shape of a first trip to Nepal, and it works because the three places are genuinely different: a dense medieval valley, a lake beneath eight-thousanders, and subtropical floodplain.",
      "Eight days is tight but not rushed, provided the Kathmandu–Pokhara and Pokhara–Chitwan legs are flown or driven early. The itinerary keeps two full days in the valley, which is where most compressed schedules go wrong.",
      "There is an optional day walk above Pokhara for anyone who wants a taste of the trails without committing to a trek.",
    ],
    itinerary: [
      { day: 1, title: "Arrive Kathmandu", note: "Transfer and an evening in the old city.", elevationM: 1400, transfer: "Airport transfer" },
      { day: 2, title: "Patan and Kathmandu", note: "Patan Museum and the durbar squares.", elevationM: 1400 },
      { day: 3, title: "Bhaktapur and Boudhanath", note: "Bhaktapur early, Boudhanath for the evening kora.", elevationM: 1400 },
      { day: 4, title: "To Pokhara", note: "Fly or drive. Afternoon on Phewa Lake.", elevationM: 822, transfer: "Flight or road" },
      { day: 5, title: "Pokhara", note: "Sarangkot at sunrise; the old bazaar, or an optional day walk on the Annapurna foothill trails.", elevationM: 822 },
      { day: 6, title: "To Chitwan", note: "South to the Terai. Sunset on the Rapti.", elevationM: 150, transfer: "5 hr drive" },
      { day: 7, title: "Chitwan", note: "Dawn canoe and a grassland drive or guided walk.", elevationM: 150 },
      { day: 8, title: "Return to Kathmandu", note: "Road or a short flight from Bharatpur.", elevationM: 1400, transfer: "Flight or road" },
    ],
    permits: ["Monument-zone tickets", "Chitwan National Park entry permit"],
    price: null,
    included: [],
    excluded: [],
    image: "/images/destinations/bhaktapur.webp",
    imageAlt: "The tiered roofs of Nyatapola above Bhaktapur Durbar Square with the valley rim beyond",
  },
];

export const journeyBySlug = (slug: string) => journeys.find((j) => j.slug === slug);

/**
 * In production only confirmed journeys are shown. In development everything
 * renders, with a visible marker, so the catalogue can be reviewed.
 */
export const publishedJourneys =
  process.env.NODE_ENV === "production"
    ? journeys.filter((j) => j.status === "published")
    : journeys;

export const journeysForDestination = (slug: string) =>
  publishedJourneys.filter((j) => j.destinations.includes(slug));

export const journeysForExperience = (id: ExperienceId) =>
  publishedJourneys.filter((j) => j.experiences.includes(id));

/** Formats "14 days" / "1 day". */
export const formatDays = (n: number) => `${n} ${n === 1 ? "day" : "days"}`;

/** Formats an itinerary day label: "Day 3" or "Days 3–4". */
export function dayLabel(day: number | [number, number]): string {
  return Array.isArray(day) ? `Days ${day[0]}–${day[1]}` : `Day ${day}`;
}
