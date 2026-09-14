import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  destinations,
  destinationBySlug,
  formatSeason,
} from "@/data/destinations";
import { journeysForDestination, formatDays, DIFFICULTY } from "@/data/journeys";
import { storiesForDestination } from "@/data/stories";
import { experienceById } from "@/data/experiences";
import { metres } from "@/lib/utils";
import { SITE_URL } from "@/data/company";
import { DhakaBand } from "@/components/common/Dhaka";
import Reveal from "@/components/common/Reveal";
import Conditions from "@/components/destinations/Conditions";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata(
  props: PageProps<"/destinations/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const d = destinationBySlug(slug);
  if (!d) return {};
  return {
    title: d.name,
    description: d.summary,
    alternates: { canonical: `/destinations/${d.slug}` },
    openGraph: {
      title: `${d.name} · Logosa`,
      description: d.summary,
      url: `${SITE_URL}/destinations/${d.slug}`,
      type: "article",
    },
  };
}

export default async function DestinationPage(props: PageProps<"/destinations/[slug]">) {
  const { slug } = await props.params;
  const d = destinationBySlug(slug);
  if (!d) notFound();

  const journeys = journeysForDestination(d.slug);
  const stories = storiesForDestination(d.slug);

  // Structured data lets a destination page surface as a place rather than as
  // an untyped article.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: d.name,
    description: d.summary,
    url: `${SITE_URL}/destinations/${d.slug}`,
    geo: {
      "@type": "GeoCoordinates",
      latitude: d.coords[1],
      longitude: d.coords[0],
      elevation: `${d.elevationM} m`,
    },
    address: {
      "@type": "PostalAddress",
      addressRegion: d.province,
      addressCountry: "NP",
    },
    ...(d.unesco ? { additionalProperty: { "@type": "PropertyValue", name: "UNESCO", value: d.unesco } } : {}),
  };

  return (
    <article className="bg-paper paper-grain">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Plate ── */}
      <header className="relative">
        <div className="figure-frame wash-ink relative h-[62svh] min-h-[26rem] w-full">
          <Image
            src={d.image}
            alt={d.imageAlt}
            width={2000}
            height={1200}
            priority
            sizes="100vw"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="shell relative -mt-[7rem] pb-[clamp(2rem,5vh,3.5rem)]">
          <div className="max-w-[54rem] bg-paper pr-6 pt-8">
            <p className="label text-ink-faint">
              {d.province} · Nepal
            </p>
            <h1 className="mt-4 text-display-l text-ink">{d.name}</h1>
            <p className="deva mt-3 text-lead text-ink-faint">{d.nameDeva}</p>
            <p className="mt-6 max-w-[40ch] text-lead text-ink-soft">{d.kicker}</p>
          </div>
        </div>
      </header>

      {/* ── Facts rail: an atlas margin, set as data ── */}
      <section aria-label="Key facts" className="shell">
        <dl className="grid-editorial border-y border-rule py-7">
          {d.facts.map((f) => (
            <div key={f.label} className="col-span-6 md:col-span-3 py-2">
              <dt className="label-slim">{f.label}</dt>
              <dd className="numeral mt-1.5 text-title text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
        {d.factsNote && (
          <p className="mt-4 max-w-[62ch] text-small text-ink-faint">{d.factsNote}</p>
        )}
      </section>

      {/* ── Body ── */}
      <section className="shell py-chapter">
        <div className="grid-editorial gap-y-14">
          <Reveal className="col-span-12 md:col-span-7">
            <div className="prose-logosa">
              {d.body.map((p, i) => (
                <p key={i} className={i === 0 ? "dropcap" : undefined}>
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          <aside className="col-span-12 md:col-span-4 md:col-start-9">
            <Conditions name={d.name} coords={d.coords} />

            <div className="mt-10 border-t border-rule pt-6">
              <h2 className="label text-ink">Season</h2>
              <p className="mt-3 text-body text-ink-soft">{formatSeason(d.bestMonths)}</p>
            </div>

            <div className="mt-8 border-t border-rule pt-6">
              <h2 className="label text-ink">Getting there</h2>
              <p className="mt-3 text-body text-ink-soft">{d.gettingThere}</p>
            </div>

            {d.permits && d.permits.length > 0 && (
              <div className="mt-8 border-t border-rule pt-6">
                <h2 className="label text-ink">Permits</h2>
                <ul className="mt-3 space-y-2 text-body text-ink-soft">
                  {d.permits.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <p className="mt-3 text-small text-ink-faint">
                  Fees are set by the issuing authority and change. Logosa
                  arranges permits for the journeys we operate.
                </p>
              </div>
            )}

            <div className="mt-8 border-t border-rule pt-6">
              <h2 className="label text-ink">Good for</h2>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {d.experiences.map((id) => (
                  <li key={id}>
                    <Link
                      href={`/experiences?focus=${id}`}
                      className="link-rule text-body text-ink-soft"
                    >
                      {experienceById(id).name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* ── Highlights ── */}
      <section className="shell pb-chapter">
        <h2 className="label text-ink-faint">What is actually there</h2>
        <ul className="mt-8 border-t border-rule">
          {d.highlights.map((h, i) => (
            <li key={h.title} className="border-b border-rule">
              <div className="grid-editorial items-baseline gap-y-2 py-6">
                <span className="numeral col-span-2 text-label text-ink-faint md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="col-span-10 text-title text-ink md:col-span-4">{h.title}</h3>
                <p className="col-span-12 text-body text-ink-soft md:col-span-7">{h.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Journeys here ── */}
      {journeys.length > 0 && (
        <section className="on-ink paper-grain relative">
          <DhakaBand ink="#F7F4EC" opacity={0.26} />
          <div className="shell py-chapter">
            <h2 className="text-display-s">Journeys through {d.name}</h2>
            <ul className="mt-10 border-t border-rule-invert">
              {journeys.map((j) => (
                <li key={j.slug} className="border-b border-rule-invert">
                  <Link
                    href={`/journeys/${j.slug}`}
                    className="grid-editorial items-baseline gap-y-2 py-6 transition-opacity hover:opacity-70"
                  >
                    <span className="col-span-12 text-title md:col-span-5">{j.name}</span>
                    <span className="label-slim col-span-6 !text-paper/60 md:col-span-2">
                      {formatDays(j.days)}
                    </span>
                    <span className="label-slim col-span-6 !text-paper/60 md:col-span-2">
                      {DIFFICULTY[j.difficulty].label}
                    </span>
                    <span className="label-slim col-span-12 !text-paper/60 md:col-span-3 md:text-right">
                      {j.maxAltitudeM ? `Max ${metres(j.maxAltitudeM)}` : j.style}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Related reading ── */}
      {stories.length > 0 && (
        <section className="shell py-chapter">
          <h2 className="label text-ink-faint">From the journal</h2>
          <ul className="mt-8 grid-editorial gap-y-8">
            {stories.map((s) => (
              <li key={s.slug} className="col-span-12 md:col-span-4">
                <Link href={`/stories/${s.slug}`} className="group block">
                  <div className="figure-frame aspect-[4/3]">
                    <Image
                      src={s.image}
                      alt={s.imageAlt}
                      width={800}
                      height={600}
                      sizes="(max-width: 900px) 100vw, 30vw"
                      className="transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="label-slim mt-4">{s.kicker}</p>
                  <h3 className="mt-2 text-title text-ink">{s.title}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Ask ── */}
      <section className="shell pb-chapter">
        <div className="border-t border-rule pt-10">
          <div className="grid-editorial items-end gap-y-6">
            <div className="col-span-12 md:col-span-7">
              <h2 className="text-display-s text-ink">
                Planning something in {d.name}?
              </h2>
              <p className="read mt-4 max-w-[44ch] text-ink-soft">
                Tell us roughly when and for how long, and we will come back
                with a route and a written quote.
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 md:col-start-9">
              <Link
                href={`/contact?destination=${d.slug}`}
                className="btn w-full"
              >
                Enquire about {d.name}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
