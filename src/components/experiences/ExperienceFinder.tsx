"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { experiences, type ExperienceId } from "@/data/experiences";
import { destinations, formatSeason } from "@/data/destinations";
import { publishedJourneys, DIFFICULTY, formatDays } from "@/data/journeys";
import ExperienceGlyph from "./ExperienceGlyph";
import { metres, pad2 } from "@/lib/utils";

/**
 * The finder.
 *
 * Choose any number of interests; results are ranked by how many of them a
 * place or route actually matches, and the count is shown. Nothing is hidden
 * behind a "submit" — the results are already there, and change as you choose,
 * which is the difference between a tool and a questionnaire.
 */
export default function ExperienceFinder() {
  const params = useSearchParams();
  const [picked, setPicked] = useState<ExperienceId[]>([]);

  // Arriving from a link that already made a choice — /experiences?pick=trekking
  useEffect(() => {
    const pick = params.getAll("pick").flatMap((p) => p.split(","));
    const valid = pick.filter((p) =>
      experiences.some((e) => e.id === p),
    ) as ExperienceId[];
    if (valid.length) setPicked(valid);
  }, [params]);

  const toggle = (id: ExperienceId) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const score = <T extends { experiences: ExperienceId[] }>(item: T) =>
    picked.length === 0 ? 0 : item.experiences.filter((e) => picked.includes(e)).length;

  const matchedPlaces = useMemo(() => {
    if (picked.length === 0) return destinations;
    return destinations
      .map((d) => ({ d, n: score(d) }))
      .filter((x) => x.n > 0)
      .sort((a, b) => b.n - a.n || a.d.order - b.d.order)
      .map((x) => x.d);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked]);

  const matchedRoutes = useMemo(() => {
    if (picked.length === 0) return publishedJourneys;
    return publishedJourneys
      .map((j) => ({ j, n: score(j) }))
      .filter((x) => x.n > 0)
      .sort((a, b) => b.n - a.n || a.j.days - b.j.days)
      .map((x) => x.j);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked]);

  // "trekking and food and local life" — read back so the choice feels heard.
  const sentence =
    picked.length === 0
      ? "Everything we run."
      : picked
          .map((id) => experiences.find((e) => e.id === id)!.phrase)
          .reduce((acc, cur, i, arr) =>
            i === 0 ? cur : i === arr.length - 1 ? `${acc} and ${cur}` : `${acc}, ${cur}`,
          );

  return (
    <>
      {/* The question */}
      <section aria-labelledby="finder" className="on-ink paper-grain relative">
        <div className="shell py-[var(--spacing-chapter)]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2
              id="finder"
              className="max-w-2xl font-[family-name:var(--font-display)] text-display-m leading-[1.02] text-paper"
            >
              What kind of journey are you looking for?
            </h2>
            {picked.length > 0 && (
              <button
                type="button"
                onClick={() => setPicked([])}
                className="label-slim link-rule text-[color-mix(in_srgb,#F7F4EC_70%,transparent)]"
              >
                Clear all
              </button>
            )}
          </div>

          <ul
            className="mt-12 grid grid-cols-2 border-l border-t border-[color-mix(in_srgb,#F7F4EC_16%,transparent)] md:grid-cols-4"
            role="group"
            aria-label="Interests"
          >
            {experiences.map((e) => {
              const on = picked.includes(e.id);
              return (
                <li
                  key={e.id}
                  className="border-b border-r border-[color-mix(in_srgb,#F7F4EC_16%,transparent)]"
                >
                  <button
                    type="button"
                    onClick={() => toggle(e.id)}
                    aria-pressed={on}
                    className={`group flex h-full w-full flex-col gap-4 p-6 text-left transition-colors duration-500 md:p-7 ${
                      on
                        ? "bg-gold text-ink"
                        : "text-paper hover:bg-[color-mix(in_srgb,#FDB614_10%,transparent)]"
                    }`}
                  >
                    <span className={on ? "text-ink" : "text-paper"}>
                      <ExperienceGlyph experience={e} size={32} />
                    </span>
                    <span className="mt-auto">
                      <span className="block font-[family-name:var(--font-display)] text-title leading-tight">
                        {e.name}
                      </span>
                      <span
                        className={`mt-2 block text-small leading-snug ${
                          on ? "text-[color-mix(in_srgb,#003047_72%,transparent)]" : "text-[color-mix(in_srgb,#F7F4EC_58%,transparent)]"
                        }`}
                      >
                        {e.note}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <p
            className="mt-10 max-w-3xl font-[family-name:var(--font-display)] text-display-s leading-[1.1] text-paper"
            aria-live="polite"
          >
            <span className="text-[color-mix(in_srgb,#F7F4EC_50%,transparent)]">
              {picked.length === 0 ? "Showing " : "You want "}
            </span>
            <span className="italic text-gold">{sentence}</span>
          </p>
        </div>
      </section>

      {/* Results */}
      <section aria-labelledby="results" className="paper-grain relative bg-paper">
        <div className="shell py-[var(--spacing-chapter)]">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 rule-b pb-5">
            <h2 id="results" className="font-[family-name:var(--font-display)] text-display-s">
              Where that takes you
            </h2>
            <p className="numeral text-small text-ink-faint" aria-live="polite">
              {matchedPlaces.length} destinations · {matchedRoutes.length} journeys
            </p>
          </div>

          {matchedPlaces.length === 0 ? (
            <p className="mt-10 max-w-lg text-body-lg leading-relaxed text-ink-soft">
              Nothing in our current catalogue matches that combination. That is a real answer
              rather than a shrug — tell us what you are after and we will say whether it can be
              arranged.
            </p>
          ) : (
            <>
              <ol className="mt-10 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
                {matchedPlaces.map((d) => (
                  <li key={d.slug}>
                    <Link href={`/destinations/${d.slug}`} className="group block">
                      <div className="figure-frame aspect-[4/3] w-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={d.image}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
                        />
                      </div>
                      <div className="mt-4 flex items-baseline gap-3">
                        <span className="numeral text-small text-ink-faint">{pad2(d.order)}</span>
                        <h3 className="font-[family-name:var(--font-display)] text-title text-ink transition-colors duration-500 group-hover:text-gold-deep">
                          {d.name}
                        </h3>
                      </div>
                      <p className="mt-2 text-small leading-snug text-ink-soft">{d.kicker}</p>
                      <p className="label-slim mt-3">
                        {metres(d.elevationM)} · {formatSeason(d.bestMonths)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ol>

              <h3 className="mt-[var(--spacing-chapter)] font-[family-name:var(--font-display)] text-display-s rule-b pb-5">
                Journeys that fit
              </h3>
              <ol className="mt-2">
                {matchedRoutes.map((j) => (
                  <li key={j.slug} className="rule-b">
                    <Link
                      href={`/journeys/${j.slug}`}
                      className="group grid items-baseline gap-x-6 gap-y-1 py-5 md:grid-cols-[minmax(0,1fr)_7rem_9rem_7rem]"
                    >
                      <span className="font-[family-name:var(--font-display)] text-title text-ink transition-colors duration-500 group-hover:text-gold-deep">
                        {j.name}
                      </span>
                      <span className="numeral text-small text-ink-soft">{formatDays(j.days)}</span>
                      <span className="label-slim">{DIFFICULTY[j.difficulty].label}</span>
                      <span className="numeral text-small tabular-nums text-ink-faint">
                        {j.maxAltitudeM ? metres(j.maxAltitudeM) : "—"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>

              <Link
                href={`/plan${picked.length ? `?interests=${picked.join(",")}` : ""}`}
                className="btn mt-12"
              >
                Turn this into an itinerary
              </Link>
            </>
          )}
        </div>
      </section>
    </>
  );
}
