/**
 * STORIES FROM THE ROAD
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  ⚠  EDITORIAL DRAFTS. These are researched, factually accurate pieces
 *     written to establish the journal's voice, structure and layout — not
 *     first-hand accounts, and not attributed to any named individual.
 *
 *     Logosa should read, amend and sign off each one before launch, or
 *     replace them with pieces written by their own guides. Set
 *     `status: "draft"` to withhold one from the production site.
 * ─────────────────────────────────────────────────────────────────────────
 */

export type Block =
  | { type: "text"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "figure"; image: string; alt: string; caption?: string; span?: "full" | "inset" }
  | { type: "facts"; title?: string; items: { label: string; value: string }[] }
  | { type: "note"; text: string };

export interface Story {
  slug: string;
  status: "draft" | "published";
  title: string;
  /** Sits above the title. A place, a season, a subject. */
  kicker: string;
  /** Deck — one sentence, used for cards and meta description. */
  standfirst: string;
  /** House byline. No invented authors. */
  byline: string;
  /** ISO date. */
  published: string;
  readingMinutes: number;
  /** Slugs from destinations.ts, for cross-linking. */
  destinations: string[];
  tags: string[];
  image: string;
  imageAlt: string;
  body: Block[];
}

export const stories: Story[] = [
  {
    slug: "walk-high-sleep-low",
    status: "published",
    title: "Walk high, sleep low",
    kicker: "Khumbu · On altitude",
    standfirst:
      "Why a fourteen-day walk to Everest Base Camp is fourteen days, and what happens to people who make it eleven.",
    byline: "Logosa",
    published: "2026-02-18",
    readingMinutes: 6,
    destinations: ["everest-khumbu"],
    tags: ["Trekking", "Altitude", "Preparation"],
    image: "/images/stories/walk-high-sleep-low.svg",
    imageAlt: "A trekker on the moraine below Lobuche with the Khumbu glacier and peaks beyond",
    body: [
      {
        type: "text",
        text: "The most common question asked about the Everest Base Camp trek is whether it can be done faster. It can. Whether it should be is a separate question, and the answer is governed by physiology rather than by ambition.",
      },
      {
        type: "text",
        text: "At sea level the air is about 21 per cent oxygen. At Everest Base Camp, 5,364 metres up, it is still 21 per cent oxygen — the proportion does not change. What changes is pressure. There is roughly half as much atmosphere pressing down, so each breath delivers around half the oxygen molecules it would at the coast. The body's response to that is a set of adaptations that take days, and cannot be hurried by wanting them.",
      },
      { type: "heading", text: "What acclimatisation actually is" },
      {
        type: "text",
        text: "Within hours of arriving at altitude, breathing rate rises and the kidneys begin excreting bicarbonate to offset the resulting change in blood chemistry. Over the following days the body increases red blood cell production and adjusts how tissue extracts oxygen from blood. These are real physical changes on a fixed timetable, and fitness does not accelerate them. A marathon runner and an unremarkable hill walker acclimatise at approximately the same rate. The runner simply arrives at each lodge less tired.",
      },
      {
        type: "text",
        text: "This is why the Khumbu itinerary is built around sleeping altitude rather than distance. Above about 3,000 metres, the conventional guidance is to raise the altitude you sleep at by no more than 300 to 500 metres a day, and to take a rest day every 900 to 1,000 metres of gain. A fourteen-day schedule fits inside that. An eleven-day schedule does not.",
      },
      {
        type: "facts",
        title: "The two days people cut",
        items: [
          { label: "Namche Bazaar", value: "3,440 m — day 5" },
          { label: "Dingboche", value: "4,410 m — day 8" },
          { label: "Typical gain removed", value: "≈ 2 days of adaptation" },
          { label: "Guidance for sleeping gain", value: "300 – 500 m per day" },
        ],
      },
      {
        type: "text",
        text: "Both acclimatisation days are active. At Namche you climb to the Everest View Hotel at 3,880 metres, spend an hour there, and walk back down to sleep at 3,440. At Dingboche you go up Nangkartshang ridge to somewhere around 5,080 metres, and sleep at 4,410. The principle is in the name: walk high, sleep low. The high excursion provides the stimulus. The low night provides the recovery in which adaptation happens.",
      },
      {
        type: "quote",
        text: "It is not a rest day. It is a working day whose work happens while you are asleep.",
      },
      { type: "heading", text: "The failure mode" },
      {
        type: "text",
        text: "Acute mountain sickness is common and usually mild: headache, poor appetite, disturbed sleep, a general sense of having a bad hangover without having earned one. It resolves with a day at the same altitude. The reason it is taken seriously is that it sits on a continuum with two conditions that are not mild — high altitude cerebral oedema and high altitude pulmonary oedema — both of which can develop within hours and both of which are life-threatening.",
      },
      {
        type: "text",
        text: "The symptoms worth acting on are a headache that does not respond to painkillers, vomiting, breathlessness at rest, a cough that produces frothy sputum, and any loss of coordination. The intervention that works for all of them is descent. Not tea, not a rest, not pressing on to the next lodge because the schedule says so. Descent.",
      },
      {
        type: "note",
        text: "This is general information, not medical advice. Speak to a travel medicine clinic before you fly, and to your guide on the trail. The Himalayan Rescue Association runs aid posts at Manang and Pheriche and gives a free altitude talk daily in season.",
      },
      { type: "heading", text: "What this means for planning" },
      {
        type: "text",
        text: "The practical consequence is that the calendar, not the legs, sets the length of a high trek. If you have eleven days, the honest options are Langtang, Poon Hill, or the Annapurna Sanctuary — all of which are excellent, none of which require you to sleep above 4,200 metres. What is not a real option is Everest Base Camp with the acclimatisation days removed.",
      },
      {
        type: "text",
        text: "There is a second reason to hold the schedule loosely at the end rather than the beginning. Lukla flights are weather-dependent, and delays of a day or more are routine in October. Spare days belong at the end of the trip, in Kathmandu, where losing one costs nothing. They do not belong in the middle of the ascent, where borrowing one costs a great deal.",
      },
    ],
  },

  {
    slug: "the-gorge-that-made-a-kingdom",
    status: "published",
    title: "The gorge that made a kingdom",
    kicker: "Mustang · Trade and geology",
    standfirst:
      "The Kali Gandaki cuts between two eight-thousanders and carries the wind, the salt road, and the reason Lo Manthang exists at all.",
    byline: "Logosa",
    published: "2026-03-09",
    readingMinutes: 7,
    destinations: ["upper-mustang", "annapurna"],
    tags: ["Mustang", "History", "Geology"],
    image: "/images/stories/kali-gandaki.svg",
    imageAlt: "The Kali Gandaki riverbed running between eroded cliffs beneath high snow peaks",
    body: [
      {
        type: "text",
        text: "Between Annapurna I at 8,091 metres and Dhaulagiri at 8,167 metres, the Kali Gandaki runs south at an elevation of around 2,500 metres. The two summits stand roughly 34 kilometres apart. The relief between the riverbed and the peaks either side is more than five and a half vertical kilometres, which is the basis for the frequent claim that this is the deepest gorge on earth.",
      },
      {
        type: "text",
        text: "The claim depends on how a gorge is defined, and geographers argue about it. What is not in dispute is the more interesting fact underneath: the river is older than the mountains it runs through. The Kali Gandaki was flowing north to south before the Himalaya finished rising, and it cut down through the range as the range came up, at roughly the rate the rock was lifted. It is an antecedent river — the mountains grew around it, and it held its line.",
      },
      { type: "heading", text: "Ammonites at 2,600 metres" },
      {
        type: "text",
        text: "The riverbed above Kagbeni is scattered with saligrams: black shale nodules containing fossil ammonites, marine molluscs that died between about 60 and 180 million years ago. They are found at 2,600 metres because the rock they are in was once the floor of the Tethys Ocean, which lay between the Indian and Eurasian plates before the collision that closed it and pushed the seabed into the sky.",
      },
      {
        type: "text",
        text: "In Hindu tradition a saligram is an aniconic form of Vishnu, and the stones are collected, worshipped and traded. It is a neat compression of the region's whole character: a piece of ocean floor, lifted five kilometres, venerated as a god, and sold by the roadside.",
      },
      {
        type: "facts",
        title: "The gorge, in figures",
        items: [
          { label: "Annapurna I", value: "8,091 m" },
          { label: "Dhaulagiri I", value: "8,167 m" },
          { label: "Riverbed between them", value: "≈ 2,500 m" },
          { label: "Distance apart", value: "≈ 34 km" },
        ],
      },
      { type: "heading", text: "The wind, and what it carried" },
      {
        type: "text",
        text: "Because the gorge is the lowest gap through a very high wall, air moves through it with reliable violence. Warm air rising off the plains draws up the valley from late morning, and by early afternoon the wind at Jomsom is strong enough to make walking south genuinely hard work. Nobody who has spent a day there describes it as a breeze. Trekking schedules in the Kali Gandaki are built around being finished by lunchtime, and flights out of Jomsom go early or not at all.",
      },
      {
        type: "text",
        text: "That same gap made the valley a trade route. Salt came south from the Tibetan plateau, where it was gathered from dry lake beds; grain went north from the Nepali middle hills, which could grow it and Tibet could not. The exchange ran on yak, sheep and goat caravans through Mustang for centuries, and the settlements along the route — Kagbeni, Marpha, Tukuche — were built by the families who taxed and provisioned it.",
      },
      {
        type: "quote",
        text: "Lo Manthang is not remote because it is high. It is high because that is where the money was.",
      },
      { type: "heading", text: "The kingdom of Lo" },
      {
        type: "text",
        text: "The Kingdom of Lo was founded in 1380 by Ame Pal, who built the walled settlement at Lo Manthang that still stands. Its position at 3,840 metres, north of the main Himalayan chain, put it in control of the salt road at exactly the point where the caravans had to pass. The three great gompas inside the walls — Jampa, Thubchen and Chodey — were built on the proceeds, and the fifteenth-century murals in Thubchen are the surviving evidence of how much of it there was.",
      },
      {
        type: "text",
        text: "The trade declined when India began producing cheap sea salt in the twentieth century, and the border closed after 1959. Lo became a quiet agricultural region and a restricted military zone, closed to foreigners entirely until 1992. Nepal formally ended the monarchy's recognition of the raja of Mustang in 2008.",
      },
      {
        type: "text",
        text: "A road now runs most of the way to Lo Manthang, and the walk is no longer the only way in. It remains the way to understand the place, because what the route makes legible — the wind, the dryness beginning precisely where the Himalaya stops the monsoon, the caravan villages spaced at a day's march — is not visible from a vehicle.",
      },
    ],
  },

  {
    slug: "how-to-read-a-newar-window",
    status: "published",
    title: "How to read a Newar window",
    kicker: "Kathmandu Valley · Craft",
    standfirst:
      "The valley's woodcarving is not decoration applied to buildings. It is a system, and once you can read it the three cities stop looking alike.",
    byline: "Logosa",
    published: "2026-04-02",
    readingMinutes: 5,
    destinations: ["kathmandu-valley"],
    tags: ["Kathmandu", "Architecture", "Craft"],
    image: "/images/stories/newar-window.svg",
    imageAlt: "A carved wooden lattice window in a Newar courtyard, deep-set in a brick facade",
    body: [
      {
        type: "text",
        text: "Most visitors to Kathmandu photograph the same three or four windows, and it is worth knowing why those particular ones. Newar window carving is not ornament distributed evenly across a facade. It is a hierarchy, and the position of a window tells you what it was for and who was behind it.",
      },
      { type: "heading", text: "The lattice, and why it is there" },
      {
        type: "text",
        text: "The commonest form is the sanjhya, a lattice screen of interlocking wooden members set into a deep brick reveal. It does four things at once: it admits air, it excludes sun, it allows the women of the household to see the street without being seen from it, and it is structurally independent of the wall, so it survives movement in the brickwork that a fixed frame would not.",
      },
      {
        type: "text",
        text: "The lattice density varies with the room behind it. Ground-floor openings onto the street are tight and small. The first floor, the living floor, opens up. The top floor — the kitchen and shrine, placed highest because it is ritually cleanest — is often the most open of all, which inverts the arrangement a European visitor expects.",
      },
      {
        type: "facts",
        title: "Where to look",
        items: [
          { label: "Bhaktapur", value: "The Peacock Window, Pujari Math" },
          { label: "Patan", value: "Kumbheshwar and the Patan Museum courtyards" },
          { label: "Kathmandu", value: "Itum Bahal, off the old bazaar route" },
          { label: "Best light", value: "Early morning, before the sun clears the eaves" },
        ],
      },
      { type: "heading", text: "The tympanum above the door" },
      {
        type: "text",
        text: "Above the principal doorway of a temple sits the torana — a carved semicircular or triangular tympanum, usually gilded copper repoussé over a wooden core. The torana identifies the deity inside. Learn four or five and you can walk into a courtyard and know what you are looking at before you reach the shrine.",
      },
      {
        type: "text",
        text: "The device at the top of most toranas is the chepu, a fierce face with no lower jaw, which in Newar practice guards the threshold. Below it, the central figure is the resident deity, flanked by attendants and, at the lower corners, by makaras — aquatic creatures from which garlands and foliage issue. The composition is fixed. The quality of the carving is not, and it varies enormously between one courtyard and the next.",
      },
      { type: "heading", text: "The struts" },
      {
        type: "text",
        text: "Under the eaves of a tiered temple, angled wooden struts carry the roof out beyond the wall. Each one is carved, and the carvings run to a programme rather than a whim: principal deities on the lowest tier, attendants and lesser figures above, with the base of each strut often occupied by a small erotic or grotesque panel.",
      },
      {
        type: "text",
        text: "Those base panels attract a great deal of speculative explanation from guides. The honest position is that no single interpretation is settled — proposals include apotropaic protection, tantric reference, and fertility symbolism — and anyone offering you one confident answer is telling you their favourite theory rather than the state of the scholarship.",
      },
      { type: "heading", text: "Why this matters after 2015" },
      {
        type: "text",
        text: "The April 2015 earthquake destroyed or badly damaged a substantial part of the valley's monument zones. Reconstruction has largely been carried out by Newar craftsmen using traditional joinery, and in several cases with timber and carved elements salvaged from the collapse itself.",
      },
      {
        type: "text",
        text: "The practical result is that in Patan and Bhaktapur you can currently stand in a square and watch a man cut a strut with a chisel for a building that will stand for another two hundred years. That is not a heritage demonstration. It is the same trade, in the same square, doing the same work, and it is worth going to see while the scaffolding is still up.",
      },
    ],
  },
];

export const storyBySlug = (slug: string) => stories.find((s) => s.slug === slug);

export const publishedStories = stories
  .filter((s) => s.status === "published")
  .sort((a, b) => (a.published < b.published ? 1 : -1));

export const storiesForDestination = (slug: string) =>
  publishedStories.filter((s) => s.destinations.includes(slug));

export function formatStoryDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
