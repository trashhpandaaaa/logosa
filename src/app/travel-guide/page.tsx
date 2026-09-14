import type { Metadata } from "next";
import { travelInfo } from "@/data/travel-info";
import { ALTITUDE_GUIDANCE } from "@/data/treks";
import { SITE_URL } from "@/data/company";
import PageHead from "@/components/common/PageHead";
import { DhakaBand } from "@/components/common/Dhaka";
import EnquiryCta from "@/components/contact/EnquiryCta";
import { pad2 } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Before you come",
  description:
    "Practical information for travelling in Nepal — visas, money, permits, seasons, connectivity and conduct. Every entry names the authority that sets the rule.",
  alternates: { canonical: "/travel-guide" },
};

function VerifiedNote({ lastVerified }: { lastVerified: string | null }) {
  /*
    Official requirements change without notice. Rather than presenting an
    unchecked entry as settled fact, the page states its own confidence — an
    unverified item says so, in the open.
  */
  if (!lastVerified) {
    return (
      <p className="label-slim mt-4 text-terracotta">
        Not independently verified — check the source before you travel
      </p>
    );
  }
  return (
    <p className="label-slim mt-4">
      Checked{" "}
      {new Date(lastVerified + "T00:00:00Z").toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })}
    </p>
  );
}

export default function TravelGuidePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: travelInfo.flatMap((section) =>
      section.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer.join(" ") },
      })),
    ),
  };

  return (
    <div className="bg-paper paper-grain">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHead
        kicker="Before you come"
        deva="यात्रा जानकारी"
        title="The practical part."
        standfirst="Visas, money, permits and seasons. Fees and requirements are set by Nepali authorities and change — so every entry names its source and says when it was last checked."
        breadcrumb={[{ href: "/", label: "Logosa" }]}
      />

      {/* Contents — a printed index, not a sticky sidebar */}
      <nav aria-label="Contents" className="shell pb-[clamp(2rem,5vh,3rem)]">
        <ol className="grid-editorial gap-y-3 border-y border-rule py-6">
          {travelInfo.map((s, i) => (
            <li key={s.id} className="col-span-6 md:col-span-2">
              <a href={`#${s.id}`} className="group block">
                <span className="numeral text-label text-ink-faint">{pad2(i + 1)}</span>
                <span className="mt-1 block text-body text-ink group-hover:text-gold-deep">
                  {s.title}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="shell pb-chapter">
        {travelInfo.map((section, si) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-28 border-t border-rule py-[clamp(2.5rem,6vh,4rem)]"
          >
            <div className="grid-editorial gap-y-10">
              <div className="col-span-12 md:col-span-3">
                <p className="label text-ink-faint">
                  <span className="numeral">{pad2(si + 1)}</span> — {section.kicker}
                </p>
                <h2 className="mt-4 text-display-s text-ink">{section.title}</h2>
              </div>

              <div className="col-span-12 md:col-span-8 md:col-start-5">
                <dl>
                  {section.items.map((item, ii) => (
                    <div
                      key={item.id}
                      className={ii > 0 ? "mt-10 border-t border-rule pt-10" : undefined}
                    >
                      <dt className="text-title text-ink">{item.question}</dt>
                      <dd className="prose-logosa mt-4">
                        {item.answer.map((p, i) => (
                          <p key={i}>{p}</p>
                        ))}

                        <div className="!mt-6 flex flex-wrap items-baseline gap-x-6">
                          {item.source && (
                            <a
                              href={item.source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="label-slim link-rule !text-ink"
                            >
                              Source: {item.source.label} ↗
                            </a>
                          )}
                          <VerifiedNote lastVerified={item.lastVerified} />
                        </div>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>
        ))}

        {/* Altitude sits apart: it is the one subject here where being wrong
            has consequences beyond inconvenience. */}
        <section id="altitude" className="scroll-mt-28 border-t border-rule py-[clamp(2.5rem,6vh,4rem)]">
          <div className="grid-editorial gap-y-10">
            <div className="col-span-12 md:col-span-3">
              <p className="label text-gold-deep">Safety</p>
              <h2 className="mt-4 text-display-s text-ink">{ALTITUDE_GUIDANCE.heading}</h2>
            </div>
            <div className="col-span-12 md:col-span-8 md:col-start-5">
              <div className="prose-logosa">
                {ALTITUDE_GUIDANCE.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <ul className="mt-8 border-t border-rule pt-6">
                {ALTITUDE_GUIDANCE.sources.map((s) => (
                  <li key={s.label} className="mt-4 first:mt-0">
                    <p className="text-body text-ink">{s.label}</p>
                    <p className="mt-1 text-small text-ink-faint">{s.note}</p>
                  </li>
                ))}
              </ul>

              <p className="mt-8 bg-paper-2 p-6 text-small leading-relaxed text-ink-soft">
                {ALTITUDE_GUIDANCE.disclaimer}
              </p>
            </div>
          </div>
        </section>
      </div>

      <EnquiryCta
        heading="Still not sure what you need?"
        note="Ask us. We arrange permits and paperwork for the journeys we run, and we would rather answer a question now than sort out a problem in Kathmandu."
        subject="travel requirements for Nepal"
      />
    </div>
  );
}
