import Link from "next/link";
import type { Journey } from "@/data/journeys";
import { DIFFICULTY, formatDays } from "@/data/journeys";
import { formatSeason } from "@/data/destinations";
import { metres, pad2 } from "@/lib/utils";
import Reveal from "@/components/common/Reveal";

/**
 * The journeys, set as a printed index rather than a grid of cards.
 *
 * A traveller comparing routes wants to scan duration, difficulty and altitude
 * across the whole list — which a card grid actively prevents, because every
 * value sits in a different place on the page. Rows on a shared baseline let
 * the eye run down one column. It is also the layout least like every other
 * travel site, which is a secondary benefit rather than the reason.
 */
export default function JourneyIndex({
  journeys,
  title,
  kicker,
  intro,
  moreHref,
}: {
  journeys: Journey[];
  title: string;
  kicker: string;
  intro?: string;
  moreHref?: string;
}) {
  return (
    <section aria-labelledby="jindex-title" className="paper-grain relative bg-paper-2">
      <div className="shell relative z-[2] py-[var(--spacing-chapter)]">
        <div className="grid-editorial items-end gap-y-6 rule-b pb-8">
          <div className="col-span-6 lg:col-span-6">
            <p className="label text-gold-deep">{kicker}</p>
            <h2
              id="jindex-title"
              className="mt-4 font-[family-name:var(--font-display)] text-display-m leading-[1.02]"
            >
              {title}
            </h2>
          </div>
          {intro && (
            <div className="col-span-6 lg:col-span-4 lg:col-start-9">
              <p className="text-body leading-relaxed text-ink-soft">{intro}</p>
            </div>
          )}
        </div>

        {/* Column heads — the key to the index */}
        <div
          aria-hidden
          className="mt-6 hidden grid-cols-[2.5rem_minmax(0,1fr)_7rem_9rem_7rem_6rem] items-center gap-4 pb-3 lg:grid"
        >
          {["", "Journey", "Days", "Difficulty", "Highest", "Season"].map((h, i) => (
            <span key={i} className="label-slim">
              {h}
            </span>
          ))}
        </div>

        <Reveal variant="rise" stagger={0.045} as="ol" className="rule-t">
          {journeys.map((j, i) => (
            <li key={j.slug} className="rule-b">
              <Link
                href={`/journeys/${j.slug}`}
                className="group grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-2 py-6 transition-colors duration-500 hover:bg-paper-3 lg:grid-cols-[2.5rem_minmax(0,1fr)_7rem_9rem_7rem_6rem] lg:items-center"
              >
                <span className="numeral text-small text-ink-faint">{pad2(i + 1)}</span>

                <span className="min-w-0">
                  <span className="block font-[family-name:var(--font-display)] text-title leading-tight text-ink transition-colors duration-500 group-hover:text-gold-deep">
                    {j.name}
                  </span>
                  <span className="mt-1.5 block text-small leading-snug text-ink-faint">
                    {j.style} · {j.startPoint} to {j.endPoint}
                  </span>
                </span>

                {/* On narrow screens the data folds under the name as a strip */}
                <span className="col-start-2 flex flex-wrap gap-x-6 gap-y-1 lg:hidden">
                  <Datum label="Days" value={formatDays(j.days)} />
                  <Datum label="Difficulty" value={DIFFICULTY[j.difficulty].label} />
                  {j.maxAltitudeM && <Datum label="Highest" value={metres(j.maxAltitudeM)} />}
                </span>

                <span className="numeral hidden text-body text-ink lg:block">{j.days}</span>
                <span className="hidden text-small text-ink-soft lg:block">
                  {DIFFICULTY[j.difficulty].label}
                </span>
                <span className="numeral hidden text-small tabular-nums text-ink-soft lg:block">
                  {j.maxAltitudeM ? metres(j.maxAltitudeM) : "—"}
                </span>
                <span className="hidden text-small text-ink-faint lg:block">
                  {formatSeason(j.bestMonths)}
                </span>
              </Link>
            </li>
          ))}
        </Reveal>

        {moreHref && (
          <Link href={moreHref} className="btn btn-ghost mt-10">
            Every journey
          </Link>
        )}
      </div>
    </section>
  );
}

function Datum({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="label-slim">{label}</span>
      <span className="numeral text-small text-ink">{value}</span>
    </span>
  );
}
