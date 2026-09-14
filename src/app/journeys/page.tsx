import type { Metadata } from "next";
import Link from "next/link";
import { publishedJourneys, DIFFICULTY, formatDays } from "@/data/journeys";
import { formatSeason } from "@/data/destinations";
import { metres } from "@/lib/utils";
import PageHead from "@/components/common/PageHead";
import { DhakaBand } from "@/components/common/Dhaka";

export const metadata: Metadata = {
  title: "Journeys",
  description:
    "Trekking, touring, wildlife and pilgrimage routes across Nepal — Everest Base Camp, the Annapurna Circuit, Upper Mustang, Langtang, Chitwan and Lumbini.",
  alternates: { canonical: "/journeys" },
};

/**
 * A working index, set as a timetable rather than as cards: every row carries
 * the four figures that actually decide whether a route is possible for
 * someone — days, difficulty, high point and season.
 */
export default function JourneysIndex() {
  const treks = publishedJourneys.filter((j) => j.style === "Teahouse trek");
  const rest = publishedJourneys.filter((j) => j.style !== "Teahouse trek");

  return (
    <div className="bg-paper paper-grain">
      <PageHead
        kicker="Journeys"
        deva="यात्राहरू"
        title="Routes we walk, and what each one asks of you."
        standfirst="Every route below is described with its real high point, its real walking days and its real season. Prices are quoted per enquiry, because what a journey costs depends on the group, the dates and the standard of lodging you want."
        breadcrumb={[{ href: "/", label: "Logosa" }]}
      />

      <div className="shell py-chapter">
        <Group title="Teahouse treks" journeys={treks} />
        <div className="mt-[clamp(3rem,7vh,5rem)]">
          <Group title="Touring, wildlife and pilgrimage" journeys={rest} />
        </div>
      </div>

      <DhakaBand />
    </div>
  );
}

function Group({
  title,
  journeys,
}: {
  title: string;
  journeys: typeof publishedJourneys;
}) {
  if (journeys.length === 0) return null;

  return (
    <section>
      <h2 className="label text-ink-faint">{title}</h2>

      {/* Column headings, so the numbers below are actually readable as data */}
      <div className="mt-7 hidden grid-editorial border-b border-rule pb-3 md:grid">
        <span className="label-slim col-span-4">Route</span>
        <span className="label-slim col-span-2">Duration</span>
        <span className="label-slim col-span-2">Difficulty</span>
        <span className="label-slim col-span-2">High point</span>
        <span className="label-slim col-span-2 text-right">Season</span>
      </div>

      <ul className="border-t border-rule md:border-t-0">
        {journeys.map((j) => (
          <li key={j.slug} className="border-b border-rule">
            <Link
              href={`/journeys/${j.slug}`}
              className="group block py-6 transition-colors hover:bg-paper-2"
            >
              <div className="grid-editorial items-baseline gap-y-3">
                <div className="col-span-12 md:col-span-4">
                  <h3 className="text-title text-ink">
                    <span className="link-rule">{j.name}</span>
                  </h3>
                  <p className="mt-2 max-w-[46ch] text-body text-ink-soft md:hidden">
                    {j.summary}
                  </p>
                </div>

                <div className="col-span-6 md:col-span-2">
                  <span className="label-slim md:hidden">Duration</span>
                  <p className="numeral text-body text-ink">{formatDays(j.days)}</p>
                </div>

                <div className="col-span-6 md:col-span-2">
                  <span className="label-slim md:hidden">Difficulty</span>
                  <p className="text-body text-ink">{DIFFICULTY[j.difficulty].label}</p>
                </div>

                <div className="col-span-6 md:col-span-2">
                  <span className="label-slim md:hidden">High point</span>
                  <p className="numeral text-body text-ink">
                    {j.maxAltitudeM ? metres(j.maxAltitudeM) : "—"}
                  </p>
                </div>

                <div className="col-span-6 md:col-span-2 md:text-right">
                  <span className="label-slim md:hidden">Season</span>
                  <p className="text-body text-ink">{formatSeason(j.bestMonths)}</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
