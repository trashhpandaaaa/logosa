/**
 * TRIP CHECKLIST
 *
 * Adapts to the journey: a Chitwan safari and an Everest trek share their
 * paperwork and almost nothing else. Items declare which kinds of trip they
 * apply to, and the UI filters accordingly rather than showing one generic
 * list with half of it irrelevant.
 *
 * State lives in the visitor's own browser. No account, no server, nothing
 * collected — a checklist is not a reason to ask someone for an email address.
 */

export type TripKind = "any" | "trek" | "high-altitude" | "safari" | "city";

export interface ChecklistItem {
  id: string;
  label: string;
  /** Shown small, beneath. Only where it earns its place. */
  note?: string;
  appliesTo: TripKind[];
}

export interface ChecklistCategory {
  id: string;
  title: string;
  kicker: string;
  items: ChecklistItem[];
}

export const checklist: ChecklistCategory[] = [
  {
    id: "documents",
    title: "Documents",
    kicker: "The things that stop a trip before it starts",
    items: [
      { id: "passport", label: "Passport valid six months beyond arrival", appliesTo: ["any"] },
      { id: "visa", label: "Visa arranged, or eligibility for visa on arrival confirmed", appliesTo: ["any"] },
      { id: "photos", label: "Four passport photographs", note: "Visa, SIM card and permits each want one.", appliesTo: ["any"] },
      { id: "passport-copies", label: "Photocopies and a digital copy of your passport", appliesTo: ["any"] },
      { id: "insurance", label: "Travel insurance covering your maximum altitude", note: "Many standard policies exclude trekking above 3,000 or 4,000 m. Read the altitude clause, not the summary.", appliesTo: ["trek", "high-altitude"] },
      { id: "heli-evac", label: "Insurance that explicitly covers helicopter evacuation", note: "The single most important line in the policy for any high trek.", appliesTo: ["high-altitude"] },
      { id: "permits", label: "Permit paperwork submitted", note: "Restricted areas need working days, not hours.", appliesTo: ["trek", "high-altitude"] },
      { id: "emergency-contacts", label: "Emergency contacts written down, not only in your phone", appliesTo: ["any"] },
    ],
  },
  {
    id: "packing",
    title: "Packing",
    kicker: "Layers, boots, and the things people forget",
    items: [
      { id: "boots", label: "Broken-in walking boots", note: "New boots on day one of a fourteen-day trek is the classic error.", appliesTo: ["trek", "high-altitude"] },
      { id: "layers", label: "Base, mid and insulated layers", note: "Nepal's temperature swing across a single trekking day is large in every season.", appliesTo: ["trek", "high-altitude"] },
      { id: "shell", label: "Waterproof shell, jacket and trousers", appliesTo: ["trek", "high-altitude"] },
      { id: "sleeping-bag", label: "Sleeping bag rated well below freezing", note: "Rentable in Kathmandu or Namche if you would rather not carry one from home.", appliesTo: ["high-altitude"] },
      { id: "sun", label: "High-factor sun cream, lip balm and category 3–4 sunglasses", note: "UV at 5,000 m is severe, and snow doubles it.", appliesTo: ["high-altitude"] },
      { id: "hat-gloves", label: "Warm hat and gloves", appliesTo: ["high-altitude"] },
      { id: "daypack", label: "Daypack with a rain cover", appliesTo: ["trek", "high-altitude", "safari"] },
      { id: "neutral-clothing", label: "Muted clothing for wildlife viewing", note: "Greens and browns. Bright colours are visible a long way across grassland.", appliesTo: ["safari"] },
      { id: "modest-clothing", label: "Clothing that covers shoulders and knees", note: "For temples and monasteries, which is most of what you will be visiting.", appliesTo: ["city", "any"] },
      { id: "water-treatment", label: "Filter bottle or purification tablets", note: "Refilling rather than buying bottled water is the single biggest thing a visitor can do about plastic on the trails.", appliesTo: ["any"] },
    ],
  },
  {
    id: "electronics",
    title: "Electronics",
    kicker: "Power is scarce and cold kills batteries",
    items: [
      { id: "adapter", label: "Plug adapter — Nepal uses types C, D and M at 230 V", appliesTo: ["any"] },
      { id: "power-bank", label: "Power bank", note: "Teahouses charge by the hour above the road head, and supply is not guaranteed.", appliesTo: ["trek", "high-altitude"] },
      { id: "headtorch", label: "Headtorch with spare batteries", note: "Pre-dawn starts are normal, and so are power cuts.", appliesTo: ["trek", "high-altitude"] },
      { id: "battery-cold", label: "Spare camera batteries, carried warm", note: "Cold flattens lithium cells fast. Sleep with them in the bag.", appliesTo: ["high-altitude"] },
      { id: "offline-maps", label: "Offline maps downloaded", appliesTo: ["any"] },
      { id: "binoculars", label: "Binoculars", note: "The difference between seeing a bird and identifying one.", appliesTo: ["safari"] },
    ],
  },
  {
    id: "money",
    title: "Money",
    kicker: "Cash, and where it stops working",
    items: [
      { id: "cash", label: "Nepali rupees drawn before leaving the road head", note: "No reliable ATMs above Namche, Jomsom or Chhomrong.", appliesTo: ["trek", "high-altitude"] },
      { id: "small-notes", label: "Small denominations", note: "Change for a 1,000-rupee note is often genuinely unavailable in a village.", appliesTo: ["any"] },
      { id: "bank-notified", label: "Bank told you are travelling", appliesTo: ["any"] },
      { id: "emergency-cash", label: "Emergency cash kept separately", appliesTo: ["any"] },
    ],
  },
  {
    id: "preparation",
    title: "Preparation",
    kicker: "The weeks before you fly",
    items: [
      { id: "clinic", label: "Travel clinic appointment", note: "For vaccinations, and for advice on altitude medication against your own history.", appliesTo: ["any"] },
      { id: "fitness", label: "Hill walking with a loaded pack", note: "Consecutive days matter more than single long ones. Six hours, four days running, is the test.", appliesTo: ["trek", "high-altitude"] },
      { id: "altitude-reading", label: "Read up on altitude illness", note: "Know the symptoms before you are the one with them.", appliesTo: ["high-altitude"] },
      { id: "dentist", label: "Dental check", note: "Unglamorous, and a genuinely bad problem to develop two days from a road.", appliesTo: ["high-altitude"] },
      { id: "spare-days", label: "Spare days built in around mountain flights", appliesTo: ["high-altitude"] },
      { id: "itinerary-shared", label: "Itinerary left with someone at home", appliesTo: ["any"] },
    ],
  },
  {
    id: "travel",
    title: "On the day",
    kicker: "Small things, easily missed",
    items: [
      { id: "carry-on-essentials", label: "Boots and one warm layer in hand luggage", note: "Checked bags do go missing, and a trek can start without your duffel but not without your boots.", appliesTo: ["trek", "high-altitude"] },
      { id: "weight-limit", label: "Domestic flight baggage limits checked", note: "Mountain flights have much lower limits than international ones.", appliesTo: ["trek", "high-altitude"] },
      { id: "arrival-transfer", label: "Arrival transfer confirmed", appliesTo: ["any"] },
      { id: "first-night", label: "First night's accommodation booked", note: "Whatever else is flexible, land with a bed arranged.", appliesTo: ["any"] },
    ],
  },
];

/** Which checklist kinds a journey needs, from its own data. */
export function kindsForJourney(opts: {
  style: string;
  maxAltitudeM?: number;
}): TripKind[] {
  const kinds: TripKind[] = ["any"];
  if (opts.style === "Teahouse trek") kinds.push("trek");
  if ((opts.maxAltitudeM ?? 0) >= 3500) kinds.push("high-altitude");
  if (opts.style === "Wildlife safari") kinds.push("safari");
  if (opts.style === "Guided tour" || opts.style === "Pilgrimage" || opts.style === "Multi-region")
    kinds.push("city");
  return kinds;
}

export function filterChecklist(kinds: TripKind[]): ChecklistCategory[] {
  return checklist
    .map((c) => ({ ...c, items: c.items.filter((i) => i.appliesTo.some((k) => kinds.includes(k))) }))
    .filter((c) => c.items.length > 0);
}
