"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { experiences, type ExperienceId } from "@/data/experiences";
import { publishedJourneys, DIFFICULTY, formatDays, type Journey, type Difficulty } from "@/data/journeys";
import { destinationBySlug, formatSeason, MONTHS } from "@/data/destinations";
import InquiryForm from "@/components/contact/InquiryForm";
import ExperienceGlyph from "@/components/experiences/ExperienceGlyph";
import { metres, pad2 } from "@/lib/utils";

/**
 * PLAN A JOURNEY
 *
 * Composes an itinerary out of routes Logosa actually runs. It will never
 * invent a package: if nothing in the catalogue fits the days available, it
 * says so and suggests changing the constraint, which is the honest outcome
 * and the useful one.
 *
 * Budget is collected because it genuinely shapes a trip — but it is passed
 * through to the enquiry, never used to display a price. The site does not
 * hold prices, so it does not quote.
 */

const PACE: { id: string; label: string; note: string; cap: Difficulty }[] = [
  { id: "gentle", label: "Gentle", note: "Day walks at most. Comfortable nights, low altitude.", cap: "easy" },
  { id: "active", label: "Active", note: "Several hours on foot most days, up to about 4,000 m.", cap: "moderate" },
  { id: "committed", label: "Committed", note: "Sustained days above 4,000 m. Altitude is the limit.", cap: "demanding" },
  { id: "serious", label: "Serious", note: "High passes, pre-dawn starts, real altitude.", cap: "strenuous" },
];

const RANK: Record<Difficulty, number> = { easy: 0, moderate: 1, demanding: 2, strenuous: 3 };

const BUDGETS = [
  { id: "unsure", label: "Not sure yet" },
  { id: "modest", label: "Keep it simple" },
  { id: "middle", label: "Comfortable" },
  { id: "high", label: "The best available" },
];

interface Plan {
  primary?: Journey;
  secondary?: Journey;
  spareDays: number;
  usedDays: number;
}

export default function TripPlanner() {
  const params = useSearchParams();

  const [days, setDays] = useState(14);
  const [pace, setPace] = useState("active");
  const [interests, setInterests] = useState<ExperienceId[]>([]);
  const [travellers, setTravellers] = useState(2);
  const [month, setMonth] = useState<number>(10);
  const [budget, setBudget] = useState("unsure");

  useEffect(() => {
    const raw = params.get("interests");
    if (!raw) return;
    const valid = raw
      .split(",")
      .filter((p) => experiences.some((e) => e.id === p)) as ExperienceId[];
    if (valid.length) setInterests(valid);
  }, [params]);

  const cap = PACE.find((p) => p.id === pace)!.cap;

  const plan: Plan = useMemo(() => {
    const score = (j: Journey) =>
      interests.length === 0 ? 1 : j.experiences.filter((e) => interests.includes(e)).length;

    const eligible = publishedJourneys
      .filter((j) => RANK[j.difficulty] <= RANK[cap])
      .filter((j) => (interests.length === 0 ? true : score(j) > 0))
      // Seasonality is advice here, not a filter — travelling out of season is
      // a legitimate choice, and ranking beats hiding.
      .map((j) => ({ j, s: score(j) * 10 + (j.bestMonths.includes(month) ? 5 : 0) }))
      .sort((a, b) => b.s - a.s || b.j.days - a.j.days)
      .map((x) => x.j);

    // Two days of slack: arrival, and the delay a mountain flight will cause.
    const usable = Math.max(0, days - 2);

    const primary = eligible.find((j) => j.days <= usable);
    if (!primary) return { spareDays: days, usedDays: 0 };

    const left = usable - primary.days;
    const secondary =
      left >= 3
        ? eligible.find(
            (j) =>
              j.slug !== primary.slug &&
              j.days <= left &&
              // Something genuinely different from the primary.
              j.style !== primary.style,
          )
        : undefined;

    const usedDays = primary.days + (secondary?.days ?? 0);
    return { primary, secondary, spareDays: days - usedDays, usedDays };
  }, [days, cap, interests, month]);

  const chosen = [plan.primary, plan.secondary].filter(Boolean) as Journey[];
  const places = Array.from(new Set(chosen.flatMap((j) => j.destinations)))
    .map(destinationBySlug)
    .filter(Boolean);

  const enquiryMessage = chosen.length
    ? [
        `Suggested by the planner:`,
        ...chosen.map((j) => `  · ${j.name} — ${formatDays(j.days)}`),
        ``,
        `About ${days} days total, ${travellers} traveller${travellers === 1 ? "" : "s"}, around ${MONTHS[month - 1]}.`,
        `Pace: ${PACE.find((p) => p.id === pace)!.label}.`,
        interests.length
          ? `Interested in: ${interests.map((i) => experiences.find((e) => e.id === i)!.name).join(", ")}.`
          : ``,
        budget !== "unsure" ? `Budget: ${BUDGETS.find((b) => b.id === budget)!.label}.` : ``,
      ]
        .filter(Boolean)
        .join("\n")
    : undefined;

  return (
    <>
      {/* The controls */}
      <section aria-labelledby="plan-form" className="paper-grain relative bg-paper">
        <div className="shell py-[var(--spacing-chapter)]">
          <h2 id="plan-form" className="sr-only">
            Your trip
          </h2>

          <div className="grid-editorial gap-y-12">
            <div className="col-span-6 lg:col-span-5">
              {/* Days */}
              <div className="rule-b pb-8">
                <div className="flex items-baseline justify-between gap-4">
                  <label htmlFor="days" className="label text-ink">
                    How long do you have?
                  </label>
                  <output htmlFor="days" className="numeral text-display-s leading-none text-ink">
                    {days}
                    <span className="ml-1.5 text-small text-ink-faint">days</span>
                  </output>
                </div>
                <input
                  id="days"
                  type="range"
                  min={3}
                  max={28}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="mt-5 w-full accent-[#003047]"
                />
                <div className="mt-2 flex justify-between text-micro text-ink-faint">
                  <span>3</span>
                  <span>28</span>
                </div>
              </div>

              {/* Month */}
              <div className="rule-b py-8">
                <label htmlFor="month" className="label text-ink">
                  Roughly when?
                </label>
                <div className="mt-4 flex flex-wrap gap-1">
                  {MONTHS.map((m, i) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMonth(i + 1)}
                      aria-pressed={month === i + 1}
                      className={`label-slim border px-2.5 py-2 transition-colors duration-300 ${
                        month === i + 1
                          ? "border-ink bg-ink text-paper"
                          : "border-[var(--color-rule)] text-ink-soft hover:border-ink hover:text-ink"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pace */}
              <fieldset className="rule-b py-8">
                <legend className="label text-ink">How hard do you want to work?</legend>
                <div className="mt-4">
                  {PACE.map((p) => (
                    <label
                      key={p.id}
                      className="flex cursor-pointer items-start gap-3.5 rule-b py-3.5 last:border-b-0"
                    >
                      <input
                        type="radio"
                        name="pace"
                        value={p.id}
                        checked={pace === p.id}
                        onChange={() => setPace(p.id)}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden
                        className={`mt-1 block h-3.5 w-3.5 shrink-0 rotate-45 border transition-colors duration-300 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-ink ${
                          pace === p.id ? "border-gold bg-gold" : "border-ink-faint"
                        }`}
                      />
                      <span>
                        <span className="block text-body text-ink">{p.label}</span>
                        <span className="mt-0.5 block text-small leading-snug text-ink-faint">
                          {p.note}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Travellers + budget */}
              <div className="grid grid-cols-2 gap-8 py-8">
                <div>
                  <label htmlFor="travellers" className="label text-ink">
                    Travellers
                  </label>
                  <input
                    id="travellers"
                    type="number"
                    min={1}
                    max={40}
                    value={travellers}
                    onChange={(e) => setTravellers(Math.max(1, Number(e.target.value) || 1))}
                    className="field mt-3"
                  />
                </div>
                <div>
                  <label htmlFor="budget" className="label text-ink">
                    Budget
                  </label>
                  <select
                    id="budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="field mt-3"
                  >
                    {BUDGETS.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-micro leading-relaxed text-ink-faint">
                    Passed to us with your enquiry so we can shape the trip. We quote in writing;
                    the site does not show prices.
                  </p>
                </div>
              </div>
            </div>

            {/* Interests */}
            <div className="col-span-6 lg:col-span-6 lg:col-start-7">
              <p className="label text-ink">What are you travelling for?</p>
              <ul className="mt-4 grid grid-cols-2 border-l border-t border-[var(--color-rule)]">
                {experiences.map((e) => {
                  const on = interests.includes(e.id);
                  return (
                    <li key={e.id} className="border-b border-r border-[var(--color-rule)]">
                      <button
                        type="button"
                        onClick={() =>
                          setInterests((p) =>
                            p.includes(e.id) ? p.filter((x) => x !== e.id) : [...p, e.id],
                          )
                        }
                        aria-pressed={on}
                        className={`flex h-full w-full items-center gap-3 p-4 text-left transition-colors duration-400 ${
                          on ? "bg-ink text-paper" : "text-ink hover:bg-paper-2"
                        }`}
                      >
                        <ExperienceGlyph experience={e} size={22} />
                        <span className="label-slim text-current">{e.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-6 text-small leading-relaxed text-ink-faint">
                Leave these blank to see everything. The planner treats your month as a preference,
                not a filter — travelling out of season is sometimes exactly the right call, and we
                would rather tell you than hide the option.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The suggestion */}
      <section aria-labelledby="plan-result" className="on-ink paper-grain relative">
        <div className="shell py-[var(--spacing-chapter)]">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <p className="label text-gold">Suggested</p>
            <p className="label-slim text-[color-mix(in_srgb,#F7F4EC_55%,transparent)]" aria-live="polite">
              {chosen.length
                ? `${plan.usedDays} of your ${days} days`
                : "No route in the catalogue fits yet"}
            </p>
          </div>

          {chosen.length === 0 ? (
            <div className="mt-6 max-w-2xl">
              <h2
                id="plan-result"
                className="font-[family-name:var(--font-display)] text-display-m leading-[1.03] text-paper"
              >
                Nothing we run fits that yet.
              </h2>
              <p className="mt-6 text-body-lg leading-relaxed text-[color-mix(in_srgb,#F7F4EC_78%,transparent)]">
                That is a real answer rather than a shrug. With {days} days at a{" "}
                {PACE.find((p) => p.id === pace)!.label.toLowerCase()} pace
                {interests.length > 0 ? " and those interests" : ""}, no route in our catalogue is a
                sensible fit — usually it means the days are short for the pace. Try more days, a
                gentler pace, or fewer interests. Or tell us what you had in mind and we will say
                whether it can be arranged.
              </p>
              <Link href="/contact" className="btn mt-8">
                Describe it to us instead
              </Link>
            </div>
          ) : (
            <>
              <h2
                id="plan-result"
                className="mt-6 max-w-3xl font-[family-name:var(--font-display)] text-display-m leading-[1.03] text-paper"
              >
                {chosen.map((j) => j.name).join(", then ")}
              </h2>

              <ol className="mt-12">
                {chosen.map((j, i) => (
                  <li
                    key={j.slug}
                    className="grid items-baseline gap-x-8 gap-y-3 border-t border-[color-mix(in_srgb,#F7F4EC_18%,transparent)] py-8 md:grid-cols-[3rem_minmax(0,1fr)_9rem_8rem]"
                  >
                    <span className="numeral text-small text-gold">{pad2(i + 1)}</span>
                    <div>
                      <h3 className="font-[family-name:var(--font-display)] text-display-s leading-tight text-paper">
                        <Link href={`/journeys/${j.slug}`} className="link-rule">
                          {j.name}
                        </Link>
                      </h3>
                      <p className="mt-2 max-w-xl text-body leading-relaxed text-[color-mix(in_srgb,#F7F4EC_74%,transparent)]">
                        {j.summary}
                      </p>
                      {!j.bestMonths.includes(month) && (
                        <p className="mt-3 text-small text-gold">
                          Note — {MONTHS[month - 1]} is outside this route&rsquo;s usual season
                          ({formatSeason(j.bestMonths)}). Ask us what that actually means on the
                          ground.
                        </p>
                      )}
                    </div>
                    <span className="numeral text-body text-paper">{formatDays(j.days)}</span>
                    <span className="label-slim text-[color-mix(in_srgb,#F7F4EC_60%,transparent)]">
                      {DIFFICULTY[j.difficulty].label}
                      {j.maxAltitudeM ? ` · ${metres(j.maxAltitudeM)}` : ""}
                    </span>
                  </li>
                ))}

                {plan.spareDays > 0 && (
                  <li className="grid items-baseline gap-x-8 border-t border-[color-mix(in_srgb,#F7F4EC_18%,transparent)] py-8 md:grid-cols-[3rem_minmax(0,1fr)_9rem_8rem]">
                    <span className="numeral text-small text-[color-mix(in_srgb,#F7F4EC_45%,transparent)]">
                      +
                    </span>
                    <div>
                      <h3 className="font-[family-name:var(--font-display)] text-display-s leading-tight text-[color-mix(in_srgb,#F7F4EC_70%,transparent)]">
                        {plan.spareDays} spare {plan.spareDays === 1 ? "day" : "days"}
                      </h3>
                      <p className="mt-2 max-w-xl text-body leading-relaxed text-[color-mix(in_srgb,#F7F4EC_60%,transparent)]">
                        Keep these at the end, in Kathmandu. Mountain flights are weather-dependent
                        and delays are ordinary — spare days at the end cost nothing, spare days
                        borrowed from the middle of an ascent cost a great deal.
                      </p>
                    </div>
                    <span className="numeral text-body text-[color-mix(in_srgb,#F7F4EC_70%,transparent)]">
                      {formatDays(plan.spareDays)}
                    </span>
                    <span />
                  </li>
                )}
              </ol>

              {places.length > 0 && (
                <div className="mt-12 border-t border-[color-mix(in_srgb,#F7F4EC_18%,transparent)] pt-8">
                  <p className="label text-gold">You would see</p>
                  <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                    {places.map((p) => (
                      <li key={p!.slug}>
                        <Link
                          href={`/destinations/${p!.slug}`}
                          className="link-rule text-title text-paper"
                        >
                          {p!.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Request it */}
      {chosen.length > 0 && (
        <section id="request" className="paper-grain relative bg-paper-2 scroll-mt-24">
          <div className="shell py-[var(--spacing-chapter)]">
            <div className="grid-editorial gap-y-10">
              <div className="col-span-6 lg:col-span-4">
                <p className="label text-gold-deep">Request this journey</p>
                <h2 className="mt-4 font-[family-name:var(--font-display)] text-display-m leading-[1.03]">
                  Send it to Logosa.
                </h2>
                <p className="mt-5 text-body leading-relaxed text-ink-soft">
                  Your choices go with the enquiry, so nothing needs repeating. We reply with a
                  day-by-day itinerary adjusted for your group and a written price.
                </p>
              </div>
              <div className="col-span-6 lg:col-span-7 lg:col-start-6">
                <InquiryForm
                  journeySlug={plan.primary?.slug}
                  journeyName={chosen.map((j) => j.name).join(" + ")}
                  destinationSlugs={places.map((p) => p!.slug)}
                  experiences={interests}
                  prefillMessage={enquiryMessage}
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
