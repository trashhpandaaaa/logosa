import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { company, confirmed, SITE_URL } from "@/data/company";
import { destinations } from "@/data/destinations";
import PageHead from "@/components/common/PageHead";
import { DhakaBand } from "@/components/common/Dhaka";
import EnquiryCta from "@/components/contact/EnquiryCta";
import { modelCredits } from "@/data/credits";

export const metadata: Metadata = {
  title: "About",
  description:
    "Logosa Tours and Travels is a travel agency based in Kathmandu, arranging trekking, culture, wildlife and pilgrimage journeys across Nepal.",
  alternates: { canonical: "/about" },
};

/**
 * The about page is where a travel company is most tempted to invent things:
 * founding years, traveller counts, awards, testimonials. There are none here,
 * because none have been supplied. What it states instead are the things that
 * are true by construction — how the journeys are put together, and how
 * pricing works.
 */
export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: company.legalName,
    alternateName: company.shortName,
    url: SITE_URL,
    slogan: company.tagline,
    areaServed: { "@type": "Country", name: "Nepal" },
    address: {
      "@type": "PostalAddress",
      addressLocality: company.address.city,
      addressCountry: "NP",
    },
    ...(confirmed(company.founded) ? { foundingDate: company.founded } : {}),
    ...(confirmed(company.phone) ? { telephone: company.phone } : {}),
    ...(confirmed(company.email) ? { email: company.email } : {}),
  };

  return (
    <div className="bg-paper paper-grain">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHead
        kicker="About"
        deva="हाम्रो बारेमा"
        title="A travel agency in Kathmandu."
        standfirst="Logosa arranges trekking, culture, wildlife and pilgrimage journeys across Nepal. The routes on this site are the ones we walk."
        breadcrumb={[{ href: "/", label: "Logosa" }]}
      />

      <section className="shell pb-chapter">
        <div className="grid-editorial gap-y-14">
          <div className="col-span-12 md:col-span-7">
            <div className="prose-logosa">
              <p className="dropcap">
                Nepal is a small country to describe and a slow one to cross. It
                runs about 800 kilometres from east to west and rises, in places
                over less than 150 horizontal kilometres, from subtropical
                floodplain at 60 metres to the highest ground on earth. Almost
                everything that makes it worth travelling in follows from that
                one fact.
              </p>
              <p>
                We build journeys around that geography rather than against it.
                That means itineraries with acclimatisation days that are not
                negotiable, spare days planned around mountain flights that are
                known to be unreliable, and an honest answer when a route will
                not fit the time available.
              </p>

              <h2>How we quote</h2>
              <p>
                There are no prices on this website. Nepal is quoted per group,
                and the number depends on how many of you there are, when you
                come, what standard of lodging you want, and which permits the
                route needs. A headline &ldquo;from&rdquo; price that applies to
                nobody&rsquo;s actual trip is worse than no price at all.
              </p>
              <p>
                Send us the shape of the trip and you get a day-by-day itinerary
                and a written quote listing exactly what is and is not included.
                Nothing is booked until you have agreed both.
              </p>

              <h2>On the ground</h2>
              <p>
                Porter welfare is a real issue in Nepal, and load limits,
                insurance and proper clothing at altitude are the operator&rsquo;s
                responsibility, not the traveller&rsquo;s. Ask us about our
                policy — ask any operator about theirs, and be wary of one that
                hesitates.
              </p>
              <p>
                Where a route passes through a community that runs its own
                lodges, we use them. In Langtang that is not a marketing line:
                the valley was rebuilt by the families who came back after 2015,
                and where the money goes is the difference.
              </p>
            </div>
          </div>

          <aside className="col-span-12 md:col-span-4 md:col-start-9">
            <div className="border-t border-rule pt-6">
              <h2 className="label text-ink">The company</h2>
              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="label-slim">Registered name</dt>
                  <dd className="mt-1 text-body text-ink">{company.legalName}</dd>
                </div>
                <div>
                  <dt className="label-slim">Based in</dt>
                  <dd className="mt-1 text-body text-ink">
                    {company.address.city}, {company.address.country}
                  </dd>
                </div>
                {confirmed(company.founded) && (
                  <div>
                    <dt className="label-slim">Founded</dt>
                    <dd className="mt-1 text-body text-ink">{company.founded}</dd>
                  </div>
                )}
                {confirmed(company.tourismLicenceNo) && (
                  <div>
                    <dt className="label-slim">Tourism licence</dt>
                    <dd className="numeral mt-1 text-body text-ink">
                      {company.tourismLicenceNo}
                    </dd>
                  </div>
                )}
                {confirmed(company.registrationNo) && (
                  <div>
                    <dt className="label-slim">Company registration</dt>
                    <dd className="numeral mt-1 text-body text-ink">
                      {company.registrationNo}
                    </dd>
                  </div>
                )}
                {company.memberships.length > 0 && (
                  <div>
                    <dt className="label-slim">Memberships</dt>
                    <dd className="mt-1 text-body text-ink">
                      {company.memberships.join(" · ")}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="mt-10 border-t border-rule pt-6">
              <h2 className="label text-ink">Where we travel</h2>
              <ul className="mt-4 space-y-2">
                {destinations.map((d) => (
                  <li key={d.slug}>
                    <Link
                      href={`/destinations/${d.slug}`}
                      className="link-rule text-body text-ink-soft"
                    >
                      {d.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 border-t border-rule pt-6">
              <h2 className="label text-ink">The identity</h2>
              <div className="mt-4 bg-paper-2 p-6">
                <Image
                  src="/brand/logosa-logo.webp"
                  alt="The Logosa mark: a Nepali pagoda and prayer flags above a Himalayan range, over still water, beneath a golden sun."
                  width={900}
                  height={751}
                  sizes="(max-width: 900px) 60vw, 20rem"
                  className="h-auto w-full"
                />
              </div>
              <p className="mt-4 text-small leading-relaxed text-ink-faint">
                A tiered pagoda and prayer flags above a snow range, over still
                water, beneath a golden sun. Everything on this site — the
                palette, the woven pattern, the way the mountains are drawn —
                is taken from it.
              </p>
            </div>

            {/* Licence condition, not a courtesy — see src/data/credits.ts */}
            <div className="mt-10 border-t border-rule pt-6">
              <h2 className="label text-ink">Credits</h2>
              <ul className="mt-4 space-y-3">
                {modelCredits.map((c) => (
                  <li key={c.file} className="text-small leading-relaxed text-ink-faint">
                    {c.usedFor}:{" "}
                    <a
                      href={c.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {c.title}
                    </a>{" "}
                    by{" "}
                    <a
                      href={c.authorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {c.author}
                    </a>
                    , licensed{" "}
                    <a
                      href={c.licenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {c.licence}
                    </a>
                    .
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <EnquiryCta subject="travelling in Nepal with Logosa" />
    </div>
  );
}
