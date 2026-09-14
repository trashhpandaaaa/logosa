import type { ExperienceId } from "./experiences";

/**
 * DESTINATIONS
 *
 * Geographic and cultural facts only — elevations, coordinates, park
 * designations, seasons. These are matters of public record and are cited in
 * `factsNote` where a figure is contested or periodically revised.
 *
 * Nothing here describes what Logosa sells. Commercial claims live in
 * journeys.ts, and prices live nowhere until Logosa supplies them.
 */

/** Which movement of the site's narrative a place belongs to. */
export type Terrain = "city" | "hills" | "mountains" | "wilderness" | "terai";

export interface Fact {
  label: string;
  value: string;
}

export interface Highlight {
  title: string;
  note: string;
}

export interface Destination {
  slug: string;
  name: string;
  /** Devanagari is used as annotation, never as decoration. */
  nameDeva: string;
  province: string;
  terrain: Terrain;
  /** Ordering along the journey, west→east is not the point; narrative is. */
  order: number;
  /** One line, set beneath the name. Concrete, never promotional. */
  kicker: string;
  /** Two or three sentences for cards and meta descriptions. */
  summary: string;
  /** Editorial body, one string per paragraph. */
  body: string[];
  /** [longitude, latitude] */
  coords: [number, number];
  /** Metres above sea level of the main settlement or viewpoint. */
  elevationM: number;
  /** Elevation range where a destination spans a lot of ground. */
  elevationRangeM?: [number, number];
  /** Calendar months that are genuinely good, 1 = January. */
  bestMonths: number[];
  experiences: ExperienceId[];
  highlights: Highlight[];
  facts: Fact[];
  /** Shown where a figure is revised or disputed. */
  factsNote?: string;
  gettingThere: string;
  /** Permits a visitor needs. Fees deliberately excluded — they change. */
  permits?: string[];
  unesco?: string;
  /** Path under /public/images/destinations. See PLACEHOLDERS.md. */
  image: string;
  imageAlt: string;
}

export const destinations: Destination[] = [
  {
    slug: "kathmandu-valley",
    name: "Kathmandu Valley",
    nameDeva: "काठमाडौँ उपत्यका",
    province: "Bagmati",
    terrain: "city",
    order: 1,
    kicker: "Three royal cities in one bowl of hills",
    summary:
      "A single valley holding three former kingdoms — Kathmandu, Patan and Bhaktapur — and seven UNESCO monument zones. Newar craftsmen have been carving its window screens and casting its bronzes for a thousand years, and still are.",
    body: [
      "The valley is small enough to cross in an afternoon and dense enough to spend a month in. Kathmandu, Patan and Bhaktapur were three rival kingdoms until 1769, and each spent centuries trying to out-build the others. What survives is an unusually concentrated body of Newar architecture: tiered pagoda temples, sunken stone water spouts still running, and courtyards where the doorway carving is finer than the building behind it.",
      "The 2015 earthquake took down parts of all three durbar squares. Much has been rebuilt using the original joinery methods, and some scaffolding remains — reconstruction here is a craft process, not a construction one, and it is worth seeing while it is happening.",
      "Boudhanath and Swayambhunath are working pilgrimage sites rather than monuments. Arrive at Boudhanath around dusk, when the kora fills with people walking the stupa clockwise, and the difference between a heritage site and a living one becomes obvious.",
    ],
    coords: [85.324, 27.7172],
    elevationM: 1400,
    bestMonths: [10, 11, 12, 2, 3, 4],
    experiences: ["culture", "food", "photography", "pilgrimage"],
    highlights: [
      {
        title: "Patan Durbar Square",
        note: "The best-preserved of the three, and home to the Patan Museum — the clearest introduction to Newar bronze and iconography anywhere in Nepal.",
      },
      {
        title: "Boudhanath",
        note: "One of the largest stupas in the world and the centre of Tibetan life in Kathmandu. Best at dawn or dusk during kora.",
      },
      {
        title: "Bhaktapur",
        note: "Largely vehicle-free. Pottery Square still fires clay in the open, and the 55-Window Palace carries the finest woodwork in the valley.",
      },
      {
        title: "Swayambhunath",
        note: "Reached by 365 stone steps from the east. The valley's whole geography reads clearly from the terrace.",
      },
    ],
    facts: [
      { label: "Elevation", value: "≈ 1,400 m" },
      { label: "UNESCO monument zones", value: "7" },
      { label: "Historic kingdoms", value: "3" },
      { label: "Language of the old city", value: "Nepal Bhasa (Newar)" },
    ],
    unesco: "Kathmandu Valley — inscribed 1979",
    gettingThere:
      "Tribhuvan International Airport is the country's only international gateway; the valley is the arrival point for almost every visitor to Nepal.",
    image: "/images/destinations/kathmandu-valley.webp",
    imageAlt:
      "The gilded spire and painted eyes of Swayambhunath stupa above the valley, strung with prayer flags",
  },

  {
    slug: "pokhara",
    name: "Pokhara",
    nameDeva: "पोखरा",
    province: "Gandaki",
    terrain: "hills",
    order: 2,
    kicker: "Where the Annapurnas stand up out of a lake",
    summary:
      "A lakeside town at 822 m with 8,000-metre peaks 30 km to the north. Nowhere else in the world does the ground rise so far, so fast, so close — and Pokhara is where most walks into the Annapurnas begin and end.",
    body: [
      "The reason Pokhara looks the way it does is a matter of vertical distance. Phewa Lake sits at roughly 742 m. Annapurna I, in clear line of sight, is 8,091 m. That is more than seven kilometres of relief across about thirty horizontal kilometres — one of the steepest elevation gradients on the planet.",
      "The practical effect is that the mountains are not a backdrop here, they are overhead. On a clear winter morning Machhapuchhre — the fishtail peak, closed to climbing on religious grounds — appears close enough to misjudge entirely.",
      "Most people use Pokhara as a hinge: arrive from Kathmandu, walk into the Annapurnas, come back down. It rewards a couple of unhurried days at either end. The old bazaar north of the lake is a working Nepali town rather than a tourist strip, and the light on the water an hour after sunrise is the reason photographers keep returning.",
    ],
    coords: [83.9856, 28.2096],
    elevationM: 822,
    bestMonths: [10, 11, 12, 1, 2, 3, 4],
    experiences: ["leisure", "adventure", "photography", "trekking"],
    highlights: [
      {
        title: "Phewa Lake",
        note: "Row out early. The reflection holds only while the water is still, which is roughly until nine.",
      },
      {
        title: "Sarangkot",
        note: "1,590 m, a short drive above town, and the standard sunrise viewpoint over the Annapurna range.",
      },
      {
        title: "Paragliding",
        note: "Sarangkot's thermals make this one of the more reliable tandem flying sites in Asia. Season runs roughly November to April.",
      },
      {
        title: "The old bazaar",
        note: "Newar trading houses north of the lake, from when this was a stop on the salt route to Tibet.",
      },
    ],
    facts: [
      { label: "Town elevation", value: "822 m" },
      { label: "Lake elevation", value: "≈ 742 m" },
      { label: "Annapurna I", value: "8,091 m" },
      { label: "Relief across ~30 km", value: "> 7,000 m" },
    ],
    gettingThere:
      "25 minutes by air from Kathmandu, or six to seven hours by road along the Prithvi Highway.",
    image: "/images/destinations/pokhara.webp",
    imageAlt:
      "Painted wooden boats moored on the still water of Phewa Lake at Pokhara, hills rising behind",
  },

  {
    slug: "everest-khumbu",
    name: "Everest & Khumbu",
    nameDeva: "सगरमाथा",
    province: "Koshi",
    terrain: "mountains",
    order: 3,
    kicker: "Sagarmatha, and the Sherpa valleys beneath it",
    summary:
      "Sagarmatha National Park holds the highest ground on earth and the Sherpa settlements that have lived alongside it for four centuries. The walk in from Lukla is a cultural route as much as a mountain one.",
    body: [
      "Everest is 8,848.86 m — the figure jointly confirmed by Nepal and China in December 2020, ending a long disagreement between competing surveys. It is visible from a surprising number of points along the Khumbu trail, and almost never looks like the highest thing in view, because Nuptse and Lhotse stand in front of it.",
      "The Khumbu is Sherpa country. Namche Bazaar at 3,440 m is the trading centre, built into a horseshoe of hillside, and its Saturday market still supplies the whole upper valley. Tengboche monastery at 3,867 m sits on a ridge with Ama Dablam directly behind it, which is the single most photographed composition in Nepal for good reason.",
      "Altitude is the governing constraint. Everest Base Camp is 5,364 m and Kala Patthar, the standard viewpoint, is 5,545 m. Getting there safely is a question of ascent rate rather than fitness, which is why every honest itinerary builds in acclimatisation days at Namche and Dingboche and why compressing the schedule is a bad trade.",
    ],
    coords: [86.925, 27.9881],
    elevationM: 5364,
    elevationRangeM: [2860, 5545],
    bestMonths: [3, 4, 5, 10, 11],
    experiences: ["trekking", "adventure", "photography"],
    highlights: [
      {
        title: "Namche Bazaar — 3,440 m",
        note: "The Khumbu's hub and the first acclimatisation stop. Two nights here is not optional.",
      },
      {
        title: "Tengboche Monastery — 3,867 m",
        note: "The largest gompa in the Khumbu, on a ridge facing Ama Dablam.",
      },
      {
        title: "Kala Patthar — 5,545 m",
        note: "The viewpoint that actually shows Everest's summit pyramid clear of Nuptse.",
      },
      {
        title: "Everest Base Camp — 5,364 m",
        note: "A moraine camp at the foot of the Khumbu Icefall. Occupied by expeditions in spring.",
      },
    ],
    facts: [
      { label: "Everest", value: "8,848.86 m" },
      { label: "Lukla airstrip", value: "2,860 m" },
      { label: "Namche Bazaar", value: "3,440 m" },
      { label: "Park inscribed", value: "1979" },
    ],
    factsNote:
      "Everest's height was revised to 8,848.86 m by joint Nepali–Chinese survey in 2020. Older sources give 8,848 m or 8,850 m.",
    permits: [
      "Sagarmatha National Park entry permit",
      "Khumbu Pasang Lhamu Rural Municipality permit",
    ],
    unesco: "Sagarmatha National Park — inscribed 1979",
    gettingThere:
      "Most routes fly Kathmandu or Ramechhap to Lukla, then walk. Flights are weather-dependent and delays are normal, not exceptional — build spare days around them.",
    image: "/images/destinations/everest-khumbu.webp",
    imageAlt:
      "The Everest massif seen from the air, the summit pyramid standing clear above Nuptse and the Khumbu valley",
  },

  {
    slug: "annapurna",
    name: "Annapurna",
    nameDeva: "अन्नपूर्ण",
    province: "Gandaki",
    terrain: "mountains",
    order: 4,
    kicker: "A circuit from subtropical valley to high desert",
    summary:
      "The Annapurna Conservation Area is Nepal's largest protected area and its most varied walk. A single route crosses from rice terraces and rhododendron forest to the arid trans-Himalaya, over a 5,416 m pass.",
    body: [
      "What distinguishes the Annapurna region is range rather than altitude. The circuit begins in subtropical farmland, climbs through rhododendron and oak, crosses Thorong La at 5,416 m, and drops into the Kali Gandaki — a valley so deep, running between Annapurna I and Dhaulagiri, that it is routinely described as the deepest gorge on earth.",
      "North of the pass the landscape changes completely. The Himalaya blocks the monsoon, so Mustang and Manang are dry, high and Tibetan in architecture and religion. Walking over Thorong La is the most legible climate transition available to anyone on foot in Nepal.",
      "Shorter options share the same terrain. The Ghorepani–Poon Hill loop reaches 3,210 m in a few days and delivers the Annapurna and Dhaulagiri skyline without any high-altitude risk, which makes it the sensible first Himalayan trek.",
    ],
    coords: [83.8203, 28.5961],
    elevationM: 4130,
    elevationRangeM: [790, 5416],
    bestMonths: [3, 4, 5, 10, 11, 12],
    experiences: ["trekking", "adventure", "culture", "photography"],
    highlights: [
      {
        title: "Thorong La — 5,416 m",
        note: "The circuit's high point, crossed east to west before dawn to stay ahead of the afternoon wind.",
      },
      {
        title: "Annapurna Base Camp — 4,130 m",
        note: "A glacial amphitheatre ringed by peaks on every side. The approach through the Modi Khola gorge is the drama.",
      },
      {
        title: "Poon Hill — 3,210 m",
        note: "Reachable in three days from Pokhara. Annapurna South, Machhapuchhre and Dhaulagiri at once.",
      },
      {
        title: "Muktinath — 3,760 m",
        note: "Sacred to both Hindus and Buddhists, with 108 water spouts and a natural gas flame burning in the shrine.",
      },
    ],
    facts: [
      { label: "Annapurna I", value: "8,091 m" },
      { label: "Thorong La", value: "5,416 m" },
      { label: "Conservation area", value: "7,629 km²" },
      { label: "Established", value: "1992" },
    ],
    permits: ["Annapurna Conservation Area Permit (ACAP)", "TIMS card"],
    gettingThere:
      "Almost all routes start from Pokhara — road to Nayapul, Besisahar or Jomsom depending on the trek.",
    image: "/images/destinations/annapurna.webp",
    imageAlt:
      "A line of trekkers on the snow approach to Annapurna Base Camp, snow faces of the sanctuary rising ahead",
  },

  {
    slug: "upper-mustang",
    name: "Upper Mustang",
    nameDeva: "मुस्ताङ",
    province: "Gandaki",
    terrain: "mountains",
    order: 5,
    kicker: "The walled city of Lo Manthang, beyond the rain",
    summary:
      "A restricted trans-Himalayan region closed to outsiders until 1992. Tibetan in language, architecture and religion, and dry enough to walk through the monsoon when the rest of Nepal is unwalkable.",
    body: [
      "Mustang lies in the rain shadow north of the main Himalayan chain. The monsoon does not reach it, which produces an eroded ochre landscape of cliffs and cave complexes that has far more in common with the Tibetan plateau than with the rest of Nepal.",
      "Lo Manthang, at 3,840 m, was the capital of the Kingdom of Lo and remains a walled settlement of whitewashed houses around three principal gompas, some with fifteenth-century murals. The area was closed to foreigners until 1992 and is still a restricted zone with a permit quota.",
      "Because it stays dry, Upper Mustang is one of the few Nepali regions worth trekking between June and August, when the Annapurnas and Khumbu are under cloud.",
    ],
    coords: [83.9578, 29.1833],
    elevationM: 3840,
    elevationRangeM: [2700, 4200],
    bestMonths: [4, 5, 6, 7, 8, 9, 10],
    experiences: ["trekking", "culture", "photography", "pilgrimage"],
    highlights: [
      {
        title: "Lo Manthang — 3,840 m",
        note: "Walled capital of the former Kingdom of Lo, with three major gompas inside the walls.",
      },
      {
        title: "Sky caves",
        note: "Thousands of man-made caves cut into cliff faces, some of them thousands of years old.",
      },
      {
        title: "Kali Gandaki gorge",
        note: "The route follows the river between two eight-thousanders, on the old salt-trading road to Tibet.",
      },
      {
        title: "Tiji festival",
        note: "A three-day masked ritual at Lo Manthang, usually in May. Dates are set by the lunar calendar.",
      },
    ],
    facts: [
      { label: "Lo Manthang", value: "3,840 m" },
      { label: "Opened to visitors", value: "1992" },
      { label: "Status", value: "Restricted area" },
      { label: "Walkable in monsoon", value: "Yes — rain shadow" },
    ],
    permits: [
      "Upper Mustang Restricted Area Permit — minimum group size and fee set by the Department of Immigration",
      "Annapurna Conservation Area Permit (ACAP)",
    ],
    factsNote:
      "Restricted-area permit fees and minimum group sizes are set by the Department of Immigration and change. Confirm current requirements before booking.",
    gettingThere:
      "Fly Pokhara to Jomsom, then walk or drive north. The road now reaches Lo Manthang but the walking route remains the reason to go.",
    image: "/images/destinations/upper-mustang.webp",
    imageAlt:
      "Chortens and whitewashed walls beneath fluted ochre cliffs in Upper Mustang, snow peaks behind",
  },

  {
    slug: "langtang",
    name: "Langtang",
    nameDeva: "लाङटाङ",
    province: "Bagmati",
    terrain: "mountains",
    order: 6,
    kicker: "The Himalaya closest to Kathmandu",
    summary:
      "A glacial valley reached without a flight — the nearest high mountains to the capital. Devastated by the 2015 earthquake and rebuilt by its own community, which is a substantial part of why people walk there now.",
    body: [
      "Langtang is the practical answer for anyone with limited time. The trailhead is a day's drive from Kathmandu with no domestic flight involved, and the valley reaches genuine high-mountain terrain — Kyanjin Gompa at 3,870 m, with Langtang Lirung at 7,227 m directly above.",
      "The 2015 earthquake triggered an avalanche that buried Langtang village entirely. The valley has been rebuilt by returning families, and the lodges along the route are largely community-run. Trekking here now is a direct economic contribution to that recovery, which is stated plainly rather than as a marketing line.",
      "Above Kyanjin, day walks reach Tserko Ri at 4,984 m and the Langshisha Kharka moraine, both of which give high-altitude views without committing to a pass crossing.",
    ],
    coords: [85.5636, 28.2114],
    elevationM: 3870,
    elevationRangeM: [1470, 4984],
    bestMonths: [3, 4, 5, 10, 11, 12],
    experiences: ["trekking", "culture", "photography"],
    highlights: [
      {
        title: "Kyanjin Gompa — 3,870 m",
        note: "The valley's head settlement, with a small monastery and a community cheese factory dating to a 1950s Swiss project.",
      },
      {
        title: "Tserko Ri — 4,984 m",
        note: "A long day walk from Kyanjin for a full circle of the Langtang Himal.",
      },
      {
        title: "Langtang village",
        note: "Rebuilt on a new site after the 2015 avalanche. A memorial marks the original.",
      },
      {
        title: "No flight required",
        note: "Road access from Kathmandu to Syabrubesi, which removes the single biggest source of trek delay.",
      },
    ],
    facts: [
      { label: "Kyanjin Gompa", value: "3,870 m" },
      { label: "Langtang Lirung", value: "7,227 m" },
      { label: "Trailhead from Kathmandu", value: "≈ 7 hrs by road" },
      { label: "Park established", value: "1976" },
    ],
    permits: ["Langtang National Park entry permit", "TIMS card"],
    gettingThere: "Road from Kathmandu to Syabrubesi, roughly seven hours. No domestic flight.",
    image: "/images/destinations/langtang.webp",
    imageAlt:
      "A walker crossing a prayer-flagged suspension bridge in the Langtang valley, glaciated peaks at its head",
  },

  {
    slug: "chitwan",
    name: "Chitwan",
    nameDeva: "चितवन",
    province: "Bagmati / Narayani",
    terrain: "wilderness",
    order: 7,
    kicker: "Sal forest, grassland, and the greater one-horned rhinoceros",
    summary:
      "Nepal's first national park, on the subtropical floodplain of the Terai. Elephant grass, sal forest and river systems supporting rhino, gaur, gharial and a small population of Bengal tigers.",
    body: [
      "Chitwan was a royal hunting reserve before it became Nepal's first national park in 1973, and a UNESCO World Heritage Site in 1984. Its 950-odd square kilometres of sal forest, riverine grassland and oxbow lakes make it the most reliable large-mammal habitat in the country.",
      "The greater one-horned rhinoceros is the animal people come for, and Chitwan's population is one of conservation's clearer successes — recovered from around a hundred animals in the mid-twentieth century. Tigers are present and rarely seen; anyone promising you a tiger is selling something.",
      "The park is also a birding site of real standing, with several hundred recorded species, and the Rapti and Narayani rivers hold both gharial and mugger crocodile. Walking safaris with a licensed naturalist are permitted in some sectors and are a different experience entirely from a vehicle.",
    ],
    coords: [84.4977, 27.5798],
    elevationM: 150,
    elevationRangeM: [100, 815],
    bestMonths: [10, 11, 12, 1, 2, 3],
    experiences: ["wildlife", "photography", "leisure", "culture"],
    highlights: [
      {
        title: "One-horned rhinoceros",
        note: "Most often seen at dawn in riverine grassland and around the oxbow lakes.",
      },
      {
        title: "Canoe on the Rapti",
        note: "A dugout drift at first light — the best chance of gharial, and of birds along the bank.",
      },
      {
        title: "Tharu villages",
        note: "The Terai's indigenous people, whose stick-dance and lattice-and-mud architecture are distinct from hill Nepal.",
      },
      {
        title: "Guided walking safari",
        note: "On foot with a licensed naturalist. The Terai is a different place at ground level.",
      },
    ],
    facts: [
      { label: "Established", value: "1973 — Nepal's first" },
      { label: "Area", value: "952 km²" },
      { label: "Recorded bird species", value: "500+" },
      { label: "Elevation", value: "100 – 815 m" },
    ],
    unesco: "Chitwan National Park — inscribed 1984",
    permits: ["Chitwan National Park entry permit — issued daily"],
    gettingThere:
      "Roughly five hours by road from Kathmandu or Pokhara, or a short flight to Bharatpur.",
    image: "/images/destinations/chitwan.webp",
    imageAlt:
      "An elephant crossing a river channel through mist on the Chitwan floodplain, grassland on both banks",
  },

  {
    slug: "lumbini",
    name: "Lumbini",
    nameDeva: "लुम्बिनी",
    province: "Lumbini",
    terrain: "terai",
    order: 8,
    kicker: "The birthplace of the Buddha",
    summary:
      "Where Siddhartha Gautama was born in 623 BCE, marked by the Maya Devi Temple and the Ashokan pillar of 249 BCE. A quiet archaeological park on the Terai plain, with monasteries built by Buddhist nations around it.",
    body: [
      "Lumbini's authority rests on an inscription. The sandstone pillar erected by Emperor Ashoka in 249 BCE records his visit to the birthplace of the Buddha, and it still stands beside the Maya Devi Temple, which encloses the marker stone and the excavated foundations beneath.",
      "The wider site was laid out to a master plan drawn by the Japanese architect Kenzo Tange in the late 1970s: a three-kilometre axis with a monastic zone on either side, where Buddhist countries have each built a monastery in their own tradition. Walking the axis is a straightforward way to see how differently one religion builds across Asia.",
      "It is a working pilgrimage site and a quiet one. Most visitors give it half a day; it repays a full one, particularly in the early morning before the coaches arrive.",
    ],
    coords: [83.2756, 27.4692],
    elevationM: 150,
    bestMonths: [10, 11, 12, 1, 2, 3],
    experiences: ["pilgrimage", "culture", "photography"],
    highlights: [
      {
        title: "Maya Devi Temple",
        note: "Encloses the marker stone and the excavated brick foundations identifying the birth site.",
      },
      {
        title: "The Ashokan pillar",
        note: "249 BCE. The inscription is the earliest documentary evidence for the location.",
      },
      {
        title: "The monastic zone",
        note: "Monasteries built by Thailand, Myanmar, Germany, China, Korea and others along Tange's axis.",
      },
      {
        title: "The Bodhi tree and pond",
        note: "The pond where Maya Devi is said to have bathed before the birth.",
      },
    ],
    facts: [
      { label: "Ashokan pillar", value: "249 BCE" },
      { label: "UNESCO inscription", value: "1997" },
      { label: "Master plan", value: "Kenzo Tange, 1978" },
      { label: "Elevation", value: "≈ 150 m" },
    ],
    unesco: "Lumbini, the Birthplace of the Lord Buddha — inscribed 1997",
    gettingThere:
      "Fly to Bhairahawa (Gautam Buddha International Airport), 22 km away, or drive from Pokhara or Chitwan.",
    image: "/images/destinations/lumbini.webp",
    imageAlt:
      "The Maya Devi Temple and Ashokan pillar at Lumbini, reflected in the sacred pond at dawn",
  },
];

export const destinationBySlug = (slug: string) => destinations.find((d) => d.slug === slug);

export const destinationsByTerrain = (t: Terrain) => destinations.filter((d) => d.terrain === t);

/** The narrative order used by the homepage journey and the map story. */
export const journeyOrder = [...destinations].sort((a, b) => a.order - b.order);

export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

/** "October – December, February – April" from a list of month numbers. */
export function formatSeason(months: number[]): string {
  if (months.length === 0) return "—";
  const sorted = [...months].sort((a, b) => a - b);
  const runs: number[][] = [];
  for (const m of sorted) {
    const last = runs[runs.length - 1];
    if (last && m === last[last.length - 1] + 1) last.push(m);
    else runs.push([m]);
  }
  // Wrap a December→January run so winter seasons read as one span.
  if (runs.length > 1) {
    const first = runs[0];
    const last = runs[runs.length - 1];
    if (first[0] === 1 && last[last.length - 1] === 12) {
      runs[runs.length - 1] = [...last, ...first];
      runs.shift();
    }
  }
  return runs
    .map((r) =>
      r.length === 1
        ? MONTHS[r[0] - 1]
        : `${MONTHS[r[0] - 1]} – ${MONTHS[r[r.length - 1] - 1]}`,
    )
    .join(", ");
}
