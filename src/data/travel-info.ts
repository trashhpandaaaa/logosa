/**
 * TRAVEL INFORMATION
 *
 * Official requirements — visas, fees, permits — change without notice, and a
 * travel site that states them as settled fact ages into a liability. So every
 * entry here carries a `source` (the authority that actually sets the rule)
 * and a `lastVerified` date. The UI renders the date and links the source, and
 * where `lastVerified` is null it says plainly that the item is unverified.
 *
 * Amounts are omitted on purpose. Structure — that a visa on arrival exists,
 * that a permit is required — is stable. Numbers are not.
 */

export interface InfoSource {
  label: string;
  url: string;
}

export interface InfoItem {
  id: string;
  question: string;
  /** One paragraph per element. Structural facts only. */
  answer: string[];
  source?: InfoSource;
  /** ISO date the entry was last checked against the source. Null = never. */
  lastVerified: string | null;
}

export interface InfoSection {
  id: string;
  title: string;
  kicker: string;
  items: InfoItem[];
}

export const travelInfo: InfoSection[] = [
  {
    id: "arriving",
    title: "Arriving",
    kicker: "Visas, entry and the flight in",
    items: [
      {
        id: "visa",
        question: "Do I need a visa?",
        answer: [
          "Most nationalities can obtain a tourist visa on arrival at Tribhuvan International Airport in Kathmandu and at the main land borders. Visas are issued for 15, 30 or 90 days, and can be extended in Kathmandu or Pokhara.",
          "A small number of nationalities are not eligible for visa on arrival and must apply in advance at a Nepali diplomatic mission. Check your own passport against the current list before booking.",
          "Bring a passport valid for at least six months and a passport photograph. Fees are payable in major currencies at the airport.",
        ],
        source: {
          label: "Department of Immigration, Nepal",
          url: "https://www.immigration.gov.np/",
        },
        lastVerified: null,
      },
      {
        id: "flights",
        question: "How do I get here?",
        answer: [
          "Tribhuvan International Airport (KTM) in Kathmandu is Nepal's principal international gateway. Gautam Buddha International Airport at Bhairahawa, near Lumbini, and Pokhara International also handle some international traffic.",
          "There are no direct long-haul flights from Europe or the Americas. Most routings connect through Delhi, Doha, Dubai, Istanbul, Bangkok, Kuala Lumpur or Singapore.",
        ],
        lastVerified: null,
      },
      {
        id: "domestic-flights",
        question: "How reliable are domestic mountain flights?",
        answer: [
          "Flights to mountain airstrips — Lukla above all — are weather-dependent and cancellations are ordinary rather than exceptional, particularly in October and during the spring.",
          "Build spare days into any itinerary that depends on one. Booking an international connection for the evening of your return flight from the mountains is the most common planning mistake made in Nepal.",
          "In peak season Lukla flights often operate from Ramechhap (Manthali) rather than Kathmandu, which adds a four-to-five hour pre-dawn drive. Confirm the departure airport close to the date.",
        ],
        lastVerified: null,
      },
    ],
  },

  {
    id: "money",
    title: "Money",
    kicker: "Currency, cards and what to carry",
    items: [
      {
        id: "currency",
        question: "What currency is used?",
        answer: [
          "The Nepali rupee (NPR, रू). The Indian rupee is pegged to it and widely recognised in the Terai, but Indian notes above ₹100 are not legal tender in Nepal.",
          "ATMs are common in Kathmandu, Pokhara and larger towns and typically dispense up to a fixed per-transaction limit with a withdrawal fee. Cards are accepted in city hotels and larger restaurants, rarely elsewhere.",
        ],
        source: { label: "Nepal Rastra Bank", url: "https://www.nrb.org.np/" },
        lastVerified: null,
      },
      {
        id: "cash-on-trek",
        question: "Can I use cards on a trek?",
        answer: [
          "Assume not. There are no reliable ATMs above Namche Bazaar in the Khumbu, or above Jomsom and Chhomrong in the Annapurna region, and card payment on the trails is unreliable where it exists at all.",
          "Draw enough Nepali rupees in cash before you start walking, and carry it in small denominations. Prices rise with altitude on every route, because everything above the road head is carried up on someone's back.",
        ],
        lastVerified: null,
      },
    ],
  },

  {
    id: "permits",
    title: "Permits",
    kicker: "What you need, and who issues it",
    items: [
      {
        id: "trekking-permits",
        question: "What permits does trekking require?",
        answer: [
          "Most trekking regions require a national park or conservation area entry permit — Sagarmatha, Annapurna (ACAP), Langtang — and many routes additionally require a TIMS card, issued through registered agencies and the Nepal Tourism Board.",
          "Restricted areas including Upper Mustang, Manaslu, Dolpo and Kanchenjunga require a separate restricted-area permit, must be arranged in advance through a registered agency, and are subject to minimum group sizes.",
          "Some rural municipalities levy their own local permit in addition to the national one — the Khumbu is the most commonly encountered example.",
        ],
        source: { label: "Nepal Tourism Board", url: "https://ntb.gov.np/" },
        lastVerified: null,
      },
      {
        id: "who-arranges",
        question: "Who arranges permits?",
        answer: [
          "Logosa arranges the permits for any journey we operate. Restricted-area permits in particular cannot be issued to independent trekkers and must go through a registered agency.",
          "Bring passport copies and spare passport photographs. Permit paperwork for restricted areas needs working days, not hours — factor it into your arrival schedule.",
        ],
        lastVerified: null,
      },
    ],
  },

  {
    id: "when",
    title: "When to come",
    kicker: "Four seasons, and what each one is good for",
    items: [
      {
        id: "seasons",
        question: "What is the best time of year?",
        answer: [
          "Autumn, from late September to early December, is the clearest and busiest trekking season. Stable weather, sharp mountain views, cold nights at altitude.",
          "Spring, from March to May, is the second season: warmer, hazier, and the time rhododendron flowers through the middle hills. It is also the Everest expedition season, which makes the Khumbu busier.",
          "The monsoon, roughly June to September, brings cloud, rain and leeches to most of the country. It is the right time for the rain-shadow regions — Upper Mustang and Dolpo — which stay dry.",
          "Winter, December to February, is cold at altitude and some high passes close, but the low and middle hills are clear and quiet, and Chitwan and Lumbini are at their best.",
        ],
        lastVerified: null,
      },
      {
        id: "festivals",
        question: "What about festivals?",
        answer: [
          "Dashain and Tihar, the two largest Hindu festivals, fall in autumn and follow the lunar calendar, so dates shift each year. Both are worth planning around: much of the country closes, transport fills, and the atmosphere in the valley is unlike any other time.",
          "Indra Jatra in Kathmandu, Tiji in Lo Manthang, and Mani Rimdu at Tengboche are all set by lunar or local calendars. If you want to see one, confirm the dates before booking flights.",
        ],
        lastVerified: null,
      },
    ],
  },

  {
    id: "conduct",
    title: "On the ground",
    kicker: "Connectivity, transport and how to behave well",
    items: [
      {
        id: "connectivity",
        question: "Will I have phone signal?",
        answer: [
          "Local SIM cards from Ncell or Nepal Telecom are inexpensive and sold on arrival with a passport copy and a photograph. Coverage is good in the cities and along main roads.",
          "On the trails, coverage is patchy and altitude-dependent. Teahouses on the popular routes sell wi-fi access by the day; speed and reliability vary and neither should be relied on.",
        ],
        lastVerified: null,
      },
      {
        id: "etiquette",
        question: "What should I know about local custom?",
        answer: [
          "Walk clockwise around stupas, mani walls and chortens — keep them on your right. This holds across the Buddhist regions and costs nothing to observe.",
          "Ask before photographing people, and particularly before photographing inside temples or during ritual. Some shrines are closed to non-Hindus; the restriction is meant, not decorative.",
          "Cover shoulders and knees at religious sites. Remove shoes where others have. Accept and pass things with the right hand.",
          "Public displays of affection are uncommon outside the tourist districts of the cities.",
        ],
        lastVerified: null,
      },
      {
        id: "responsible",
        question: "How do I travel well here?",
        answer: [
          "Refill rather than buy bottled water. Plastic bottles are a significant problem on the trekking routes, and both filtration and purification tablets work perfectly well.",
          "Porter welfare is a real issue in Nepal. Load limits, insurance, and adequate clothing and shelter at altitude are the responsibility of the operator, and any operator you use should be able to tell you their policy without hesitating.",
          "Spending in locally owned lodges and buying locally made goods keeps more of the money in the valley you are walking through.",
        ],
        lastVerified: null,
      },
    ],
  },
];

export const infoSectionById = (id: string) => travelInfo.find((s) => s.id === id);

/** Every item, flattened — used by search and the sitemap. */
export const allInfoItems = travelInfo.flatMap((s) =>
  s.items.map((i) => ({ ...i, sectionId: s.id, sectionTitle: s.title })),
);
