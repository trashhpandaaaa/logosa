import type { Metadata } from "next";
import { destinationBySlug } from "@/data/destinations";
import { journeyBySlug } from "@/data/journeys";
import { company, confirmed, whatsappLink, telLink, mailtoLink, SITE_URL } from "@/data/company";
import PageHead from "@/components/common/PageHead";
import { DhakaBand } from "@/components/common/Dhaka";
import InquiryForm from "@/components/contact/InquiryForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell Logosa what you have in mind — a route, a season, a rough number of days — and we will reply with a written itinerary and quote.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage(props: PageProps<"/contact">) {
  const sp = await props.searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

  const journey = journeyBySlug(one(sp.journey) ?? "");
  const destination = destinationBySlug(one(sp.destination) ?? "");

  // Arriving from a journey or a destination page should carry the context
  // across, so nobody has to retype what they were just looking at.
  const prefill = journey
    ? `I'd like to ask about the ${journey.name} journey.`
    : destination
      ? `I'd like to ask about travelling in ${destination.name}.`
      : undefined;

  const wa = whatsappLink(prefill ?? "Hello Logosa — I have a question about a journey.");
  const tel = telLink();
  const mail = mailtoLink("Enquiry via logosa.com.np");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: company.legalName,
    url: SITE_URL,
    address: {
      "@type": "PostalAddress",
      addressLocality: company.address.city,
      addressCountry: "NP",
      ...(confirmed(company.address.street) ? { streetAddress: company.address.street } : {}),
    },
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
        kicker="Contact"
        deva="सम्पर्क"
        title={
          journey ? (
            <>Request the {journey.name}.</>
          ) : (
            <>Tell us roughly what you have in mind.</>
          )
        }
        standfirst="A route, a season, and a rough number of days is enough to start. We reply with a written itinerary and a quote — not an automated brochure."
        breadcrumb={[{ href: "/", label: "Logosa" }]}
      />

      <div className="shell pb-chapter">
        <div className="grid-editorial gap-y-14">
          <div className="col-span-12 lg:col-span-7">
            <InquiryForm
              journeySlug={journey?.slug}
              journeyName={journey?.name}
              destinationSlugs={destination ? [destination.slug] : journey?.destinations}
              prefillMessage={prefill}
            />
          </div>

          <aside className="col-span-12 lg:col-span-4 lg:col-start-9">
            <h2 className="label text-ink">Other ways to reach us</h2>

            {wa || tel || mail ? (
              <ul className="mt-5 space-y-4 border-t border-rule pt-5">
                {wa && (
                  <li>
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-rule text-body-lg text-ink"
                    >
                      WhatsApp
                    </a>
                    <p className="mt-1 text-small text-ink-faint">
                      Usually the fastest, and fine for a single question.
                    </p>
                  </li>
                )}
                {tel && (
                  <li>
                    <a href={tel} className="link-rule text-body-lg text-ink">
                      {company.phone}
                    </a>
                    <p className="mt-1 text-small text-ink-faint">
                      Nepal is UTC+5:45.
                      {confirmed(company.hours) ? ` ${company.hours}.` : ""}
                    </p>
                  </li>
                )}
                {mail && (
                  <li>
                    <a href={mail} className="link-rule break-words text-body-lg text-ink">
                      {company.email}
                    </a>
                  </li>
                )}
              </ul>
            ) : (
              /*
                No contact channel has been confirmed yet. Rather than printing
                a placeholder number somebody might try to call, the page says
                plainly that the form is the route in.
              */
              <p className="mt-5 max-w-[34ch] border-t border-rule pt-5 text-body text-ink-soft">
                The form is the way through to us at the moment. We read every
                enquiry and reply by email.
              </p>
            )}

            <div className="mt-10 border-t border-rule pt-5">
              <h2 className="label text-ink">Where we are</h2>
              <address className="mt-3 not-italic text-body text-ink-soft">
                {confirmed(company.address.street) && (
                  <>
                    {company.address.street}
                    <br />
                  </>
                )}
                {company.address.city}, {company.address.country}
              </address>
            </div>

            <div className="mt-10 border-t border-rule pt-5">
              <h2 className="label text-ink">What happens next</h2>
              <ol className="mt-3 space-y-3 text-body text-ink-soft">
                <li>
                  <span className="numeral text-label text-ink-faint">01</span>{" "}
                  We read it and come back with questions if the route needs
                  them.
                </li>
                <li>
                  <span className="numeral text-label text-ink-faint">02</span>{" "}
                  You get a day-by-day itinerary and a written quote listing
                  exactly what is and is not included.
                </li>
                <li>
                  <span className="numeral text-label text-ink-faint">03</span>{" "}
                  Nothing is booked until you have agreed both.
                </li>
              </ol>
            </div>
          </aside>
        </div>
      </div>

      <DhakaBand />
    </div>
  );
}
