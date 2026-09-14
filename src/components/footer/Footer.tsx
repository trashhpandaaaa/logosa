import Link from "next/link";
import Image from "next/image";
import { company, confirmed, whatsappLink, telLink, mailtoLink } from "@/data/company";
import { modelCredits } from "@/data/credits";
import { DhakaBand } from "@/components/common/Dhaka";

/**
 * The footer carries three things a real agency's site must: how to reach a
 * human, the registration details that make the company checkable, and the
 * attribution its licensed assets require.
 *
 * Every contact detail is gated on `confirmed()`. An unsupplied phone number
 * renders as nothing at all — never as a plausible-looking placeholder that a
 * visitor might try to call.
 */
export default function Footer() {
  const wa = whatsappLink("Hello Logosa — I have a question about a journey.");
  const tel = telLink();
  const mail = mailtoLink("Enquiry via logosa.com.np");

  const hasContact = Boolean(wa || tel || mail);

  return (
    <footer className="on-ink paper-grain relative">
      <DhakaBand ink="#F7F4EC" opacity={0.26} />

      <div className="shell py-[clamp(3.5rem,8vh,6rem)]">
        <div className="grid-editorial gap-y-12">
          <div className="col-span-12 md:col-span-4">
            {/*
              The wordmark is deep blue, so the logo needs a light ground to
              stay legible. It gets a paper plate rather than being inverted or
              recoloured — the artwork is never altered, only placed.
            */}
            <div className="inline-block bg-paper p-5">
              <Image
                src="/brand/logosa-logo.webp"
                alt="Logosa Tours and Travels Pvt. Ltd."
                width={900}
                height={751}
                sizes="(max-width: 768px) 52vw, 15rem"
                className="h-auto w-[min(15rem,52vw)]"
              />
            </div>
            <p className="mt-6 max-w-[32ch] text-body text-paper/70">
              A travel agency in Kathmandu arranging trekking, culture, wildlife
              and pilgrimage journeys across Nepal.
            </p>
          </div>

          <nav aria-label="Footer" className="col-span-6 md:col-span-2 md:col-start-6">
            <h2 className="label mb-5 text-gold">Travel</h2>
            <ul className="space-y-2.5 text-body text-paper/80">
              <li><Link href="/destinations" className="link-rule">Destinations</Link></li>
              <li><Link href="/journeys" className="link-rule">Journeys</Link></li>
              <li><Link href="/experiences" className="link-rule">Experiences</Link></li>
              <li><Link href="/plan" className="link-rule">Plan a trip</Link></li>
            </ul>
          </nav>

          <nav aria-label="More" className="col-span-6 md:col-span-2">
            <h2 className="label mb-5 text-gold">More</h2>
            <ul className="space-y-2.5 text-body text-paper/80">
              <li><Link href="/stories" className="link-rule">Stories</Link></li>
              <li><Link href="/travel-guide" className="link-rule">Travel guide</Link></li>
              <li><Link href="/about" className="link-rule">About</Link></li>
              <li><Link href="/contact" className="link-rule">Contact</Link></li>
            </ul>
          </nav>

          <div className="col-span-12 md:col-span-3">
            <h2 className="label mb-5 text-gold">Reach us</h2>
            {hasContact ? (
              <ul className="space-y-2.5 text-body text-paper/80">
                {tel && <li><a href={tel} className="link-rule">{company.phone}</a></li>}
                {mail && <li><a href={mail} className="link-rule">{company.email}</a></li>}
                {wa && (
                  <li>
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="link-rule">
                      WhatsApp
                    </a>
                  </li>
                )}
              </ul>
            ) : (
              <p className="max-w-[30ch] text-body text-paper/70">
                <Link href="/contact" className="link-rule">
                  Send an enquiry
                </Link>{" "}
                and we will reply by email.
              </p>
            )}

            <address className="mt-5 not-italic text-body text-paper/60">
              {confirmed(company.address.street) && (
                <>
                  {company.address.street}
                  <br />
                </>
              )}
              {company.address.city}, {company.address.country}
            </address>
          </div>
        </div>

        {/* Registration details — shown only where Logosa has supplied them. */}
        <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-rule-invert pt-6">
          <p className="label-slim text-paper/55">
            © {new Date().getFullYear()} {company.legalName}
          </p>
          {confirmed(company.tourismLicenceNo) && (
            <p className="label-slim text-paper/55">
              Tourism licence {company.tourismLicenceNo}
            </p>
          )}
          {confirmed(company.registrationNo) && (
            <p className="label-slim text-paper/55">
              Reg. {company.registrationNo}
            </p>
          )}
          {company.memberships.length > 0 && (
            <p className="label-slim text-paper/55">
              Member: {company.memberships.join(" · ")}
            </p>
          )}
        </div>

        {/*
          Required by the CC BY licence on the 3D models. This is a licence
          condition, not a courtesy — see src/data/credits.ts before editing.
        */}
        <div className="mt-6 border-t border-rule-invert pt-6">
          <h2 className="label-slim mb-3 text-paper/45">Credits</h2>
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {modelCredits.map((c) => (
              <li key={c.file} className="text-[0.72rem] leading-relaxed text-paper/45">
                {c.usedFor}:{" "}
                <a href={c.source} target="_blank" rel="noopener noreferrer" className="underline">
                  {c.title}
                </a>{" "}
                by{" "}
                <a href={c.authorUrl} target="_blank" rel="noopener noreferrer" className="underline">
                  {c.author}
                </a>{" "}
                ·{" "}
                <a href={c.licenceUrl} target="_blank" rel="noopener noreferrer" className="underline">
                  {c.licence}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
