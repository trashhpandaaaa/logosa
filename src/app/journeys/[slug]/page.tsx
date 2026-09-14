import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  journeys,
  journeyBySlug,
  DIFFICULTY,
  formatDays,
  dayLabel,
} from "@/data/journeys";
import { destinationBySlug, formatSeason } from "@/data/destinations";
import { trekById, ALTITUDE_GUIDANCE } from "@/data/treks";
import { experienceById } from "@/data/experiences";
import { metres } from "@/lib/utils";
import { SITE_URL } from "@/data/company";
import { DhakaBand } from "@/components/common/Dhaka";
import TrekPanel from "@/components/trekking/TrekPanel";
import TripChecklist from "@/components/trekking/TripChecklist";
import EnquiryCta from "@/components/contact/EnquiryCta";

export function generateStaticParams() {
  return journeys.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata(
  props: PageProps<"/journeys/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const j = journeyBySlug(slug);
  if (!j) return {};
  return {
    title: j.name,
    description: j.summary,
    alternates: { canonical: `/journeys/${j.slug}` },
    openGraph: {
      title: `${j.name} · Logosa`,
      description: j.summary,
      url: `${SITE_URL}/journeys/${j.slug}`,
      type: "article",
    },
  };
}

export default async function JourneyPage(props: PageProps<"/journeys/[slug]">) {
  const { slug } = await props.params;
  const j = journeyBySlug(slug);
  if (!j) notFound();

  const trek = j.trekId ? trekById(j.trekId) : undefined;
  const places = j.destinations.map(destinationBySlug).filter(Boolean);
  const difficulty = DIFFICULTY[j.difficulty];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: j.name,
    description: j.summary,
    url: `${SITE_URL}/journeys/${j.slug}`,
    touristType: j.experiences.map((e) => experienceById(e).name),
    itinerary: {
      "@type": "ItemList",
      numberOfItems: j.itinerary.length,
      itemListElement: j.itinerary.map((d, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: d.title,
        description: d.note,
      })),
    },
    provider: { "@type": "TravelAgency", name: "Logosa Tours and Travels Pvt. Ltd." },
    // No `offers` block: an offer without a price is worse than no offer, and
    // Logosa has not supplied prices.
  };

  return (
    <article className="bg-paper paper-grain">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Head ── */}
      <header className="shell pt-[calc(var(--spacing-chapter)+4rem)]">
        <p className="label text-ink-faint">
          {j.style} · {places.map((p) => p!.name).join(" · ")}
        </p>
        <div className="mt-5 grid-editorial items-end gap-y-8">
          <div className="col-span-12 md:col-span-7">
            <h1 className="text-display-l text-ink">{j.name}</h1>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9">
            <p className="read text-ink-soft">{j.summary}</p>
          </div>
        </div>
      </header>

      {/* ── The four figures that decide whether this is possible for you ── */}
      <section aria-label="At a glance" className="shell mt-[clamp(2.5rem,6vh,4rem)]">
        <dl className="grid-editorial border-y border-rule py-7">
          <div className="col-span-6 py-2 md:col-span-2">
            <dt className="label-slim">Duration</dt>
            <dd className="numeral mt-1.5 text-title text-ink">{formatDays(j.days)}</dd>
          </div>
          <div className="col-span-6 py-2 md:col-span-2">
            <dt className="label-slim">Difficulty</dt>
            <dd className="mt-1.5 text-title text-ink">{difficulty.label}</dd>
          </div>
          <div className="col-span-6 py-2 md:col-span-2">
            <dt className="label-slim">High point</dt>
            <dd className="numeral mt-1.5 text-title text-ink">
              {j.maxAltitudeM ? metres(j.maxAltitudeM) : "—"}
            </dd>
          </div>
          <div className="col-span-6 py-2 md:col-span-2">
            <dt className="label-slim">Season</dt>
            <dd className="mt-1.5 text-title text-ink">{formatSeason(j.bestMonths)}</dd>
          </div>
          <div className="col-span-12 py-2 md:col-span-4">
            <dt className="label-slim">Starts / ends</dt>
            <dd className="mt-1.5 text-body text-ink">
              {j.startPoint}
              {j.endPoint !== j.startPoint && <> → {j.endPoint}</>}
            </dd>
          </div>
        </dl>
        <p className="mt-4 max-w-[64ch] text-small text-ink-faint">
          <strong className="text-ink">{difficulty.label}:</strong> {difficulty.note}
        </p>
      </section>

      {/* ── Plate + body ── */}
      <section className="shell py-chapter">
        <div className="grid-editorial gap-y-14">
          <div className="col-span-12 md:col-span-7">
            <div className="figure-frame aspect-[16/10]">
              <Image
                src={j.image}
                alt={j.imageAlt}
                width={1600}
                height={1000}
                priority
                sizes="(max-width: 900px) 100vw, 58vw"
              />
            </div>
            <div className="prose-logosa mt-10">
              {j.body.map((p, i) => (
                <p key={i} className={i === 0 ? "dropcap" : undefined}>
                  {p}
                </p>
              ))}
            </div>
          </div>

          <aside className="col-span-12 md:col-span-4 md:col-start-9">
            <div className="border-t border-rule pt-6">
              <h2 className="label text-ink">Accommodation</h2>
              <p className="mt-3 text-body text-ink-soft">{j.accommodation}</p>
            </div>

            {j.permits.length > 0 && (
              <div className="mt-8 border-t border-rule pt-6">
                <h2 className="label text-ink">Permits</h2>
                <ul className="mt-3 space-y-2 text-body text-ink-soft">
                  {j.permits.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <p className="mt-3 text-small text-ink-faint">
                  We arrange these for journeys we operate. Fees are set by the
                  issuing authority.
                </p>
              </div>
            )}

            <div className="mt-8 border-t border-rule pt-6">
              <h2 className="label text-ink">Good for</h2>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {j.experiences.map((id) => (
                  <li key={id}>
                    <Link href={`/experiences?focus=${id}`} className="link-rule text-body text-ink-soft">
                      {experienceById(id).name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/*
              Price and inclusions are deliberately not stated anywhere on this
              page. Rather than print a hollow "from £X" the page says plainly
              what governs the number and routes the visitor to a written quote.
            */}
            <div className="mt-8 border-t border-rule pt-6">
              <h2 className="label text-ink">Price</h2>
              <p className="mt-3 text-body text-ink-soft">
                Quoted per enquiry. What a journey costs depends on group size,
                dates, and the standard of lodging — so we send a written quote
                with the inclusions listed in full rather than a headline figure
                that changes.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* ── Elevation + route ── */}
      {trek && (
        <section className="relative bg-paper-2">
          <div className="shell py-chapter">
            <h2 className="text-display-s text-ink">The route, in section</h2>
            <div className="mt-10">
              <TrekPanel trek={trek} />
            </div>

            <div className="mt-[clamp(3rem,7vh,5rem)] grid-editorial gap-y-10">
              <div className="col-span-12 md:col-span-6">
                <h3 className="label text-ink">Preparation</h3>
                <ul className="mt-5 space-y-4">
                  {trek.preparation.map((p) => (
                    <li key={p} className="border-t border-rule pt-4 text-body text-ink-soft">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-12 md:col-span-5 md:col-start-8">
                <h3 className="label text-ink">{ALTITUDE_GUIDANCE.heading}</h3>
                <div className="mt-5 space-y-4">
                  {ALTITUDE_GUIDANCE.body.map((p) => (
                    <p key={p} className="text-body text-ink-soft">
                      {p}
                    </p>
                  ))}
                </div>
                <ul className="mt-6 space-y-3 border-t border-rule pt-5">
                  {ALTITUDE_GUIDANCE.sources.map((s) => (
                    <li key={s.label}>
                      <p className="text-body text-ink">{s.label}</p>
                      <p className="text-small text-ink-faint">{s.note}</p>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-small text-ink-faint">
                  {ALTITUDE_GUIDANCE.disclaimer}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Itinerary ── */}
      <section className="shell py-chapter">
        <h2 className="text-display-s text-ink">Day by day</h2>
        <ol className="mt-10 border-t border-rule">
          {j.itinerary.map((d) => (
            <li key={String(d.day)} className="border-b border-rule">
              <div className="grid-editorial items-baseline gap-y-3 py-6">
                <p className="numeral col-span-3 label text-ink-faint md:col-span-1">
                  {dayLabel(d.day)}
                </p>
                <div className="col-span-9 md:col-span-4">
                  <h3 className="text-title text-ink">{d.title}</h3>
                  {d.acclimatisation && (
                    <p className="label mt-2 inline-block bg-gold px-2 py-1 text-ink">
                      Acclimatisation
                    </p>
                  )}
                </div>
                <p className="col-span-12 text-body text-ink-soft md:col-span-5">{d.note}</p>
                <dl className="col-span-12 flex gap-6 md:col-span-2 md:flex-col md:gap-2 md:text-right">
                  {d.elevationM !== undefined && (
                    <div>
                      <dt className="label-slim inline md:block">Sleep </dt>
                      <dd className="numeral inline text-body text-ink md:block">
                        {metres(d.elevationM)}
                      </dd>
                    </div>
                  )}
                  {d.walkHours && (
                    <div>
                      <dt className="label-slim inline md:block">Walk </dt>
                      <dd className="inline text-body text-ink md:block">{d.walkHours}</dd>
                    </div>
                  )}
                  {d.transfer && (
                    <div>
                      <dt className="label-slim inline md:block">Transfer </dt>
                      <dd className="inline text-body text-ink md:block">{d.transfer}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Checklist ── */}
      <section className="relative bg-paper-2">
        <DhakaBand />
        <div className="shell py-chapter">
          <TripChecklist style={j.style} maxAltitudeM={j.maxAltitudeM} journeyName={j.name} />
        </div>
      </section>

      {/* ── Enquire ── */}
      <EnquiryCta
        subject={j.name}
        heading={`Walk the ${j.name}.`}
        note="Send us your dates, group size and how much time you have, and we will come back with a route, a day-by-day plan and a written quote with the inclusions listed in full."
      />
    </article>
  );
}
