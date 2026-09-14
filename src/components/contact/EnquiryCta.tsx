import Link from "next/link";
import { company, confirmed, whatsappLink, telLink } from "@/data/company";
import { DhakaBand } from "@/components/common/Dhaka";

/**
 * The close. One clear action, one alternative, and the honest position on
 * pricing: Logosa quotes, the website does not. Saying so plainly is better
 * than a "from £X" that turns out not to apply to anybody's actual dates.
 */
export default function EnquiryCta({
  heading = "Tell us where you want to go.",
  note = "Send us the shape of the trip — dates, how long, what you want out of it — and we will come back with an itinerary and a price for your group. No deposit to ask a question.",
  subject,
}: {
  heading?: string;
  note?: string;
  subject?: string;
}) {
  const wa = whatsappLink(
    subject
      ? `Hello Logosa — I would like to ask about ${subject}.`
      : "Hello Logosa — I would like to ask about travelling in Nepal.",
  );
  const tel = telLink();

  return (
    <section aria-labelledby="cta-title" className="paper-grain relative bg-paper-3">
      <DhakaBand opacity={0.26} />
      <div className="shell relative z-[2] py-[var(--spacing-chapter)]">
        <div className="grid-editorial items-start gap-y-10">
          <div className="col-span-6 lg:col-span-6">
            <p className="label text-gold-deep">Enquire</p>
            <h2
              id="cta-title"
              className="mt-4 max-w-xl font-[family-name:var(--font-display)] text-display-m leading-[1.02]"
            >
              {heading}
            </h2>
            <p className="mt-6 max-w-lg text-body-lg leading-relaxed text-ink-soft">{note}</p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/contact" className="btn">
                Start an enquiry
              </Link>
              {wa && (
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  Message on WhatsApp
                </a>
              )}
            </div>
          </div>

          <dl className="col-span-6 lg:col-span-4 lg:col-start-9">
            <div className="rule-t py-5">
              <dt className="label-slim">Based in</dt>
              <dd className="mt-2 text-body text-ink">
                {company.address.city}, {company.address.country}
              </dd>
            </div>
            {tel && (
              <div className="rule-t py-5">
                <dt className="label-slim">Telephone</dt>
                <dd className="mt-2 text-body">
                  <a href={tel} className="link-rule text-ink">
                    {company.phone as string}
                  </a>
                </dd>
              </div>
            )}
            {confirmed(company.hours) && (
              <div className="rule-t py-5">
                <dt className="label-slim">Hours</dt>
                <dd className="mt-2 text-body text-ink">{company.hours}</dd>
              </div>
            )}
            <div className="rule-t rule-b py-5">
              <dt className="label-slim">On pricing</dt>
              <dd className="mt-2 text-small leading-relaxed text-ink-soft">
                Costs depend on group size, season, accommodation and the permits a route needs, so
                we quote rather than list. Ask and you will get a written breakdown.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
