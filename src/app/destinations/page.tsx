import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { destinations, formatSeason } from "@/data/destinations";
import { journeysForDestination } from "@/data/journeys";
import { metres, pad2 } from "@/lib/utils";
import PageHead from "@/components/common/PageHead";
import { DhakaBand } from "@/components/common/Dhaka";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "The eight regions of Nepal Logosa travels in — the Kathmandu Valley, Pokhara, the Khumbu, Annapurna, Upper Mustang, Langtang, Chitwan and Lumbini.",
  alternates: { canonical: "/destinations" },
};

/**
 * Not a grid of identical cards. Each destination is an editorial plate whose
 * image alternates side, so scrolling the index feels like turning pages
 * rather than scanning a table.
 */
export default function DestinationsIndex() {
  return (
    <div className="bg-paper paper-grain">
      <PageHead
        kicker="Destinations"
        deva="गन्तव्य"
        title="Eight regions, one country you cross on foot."
        standfirst="Nepal rises from 60 metres on the Terai to 8,848.86 at the summit of Everest across about 200 kilometres. These are the places that range passes through."
        breadcrumb={[{ href: "/", label: "Logosa" }]}
      />

      <div className="shell mt-[clamp(3rem,7vh,5rem)] pb-chapter">
        <ul>
          {destinations.map((d, i) => {
            const flip = i % 2 === 1;
            const count = journeysForDestination(d.slug).length;
            return (
              <li key={d.slug} className="border-t border-rule py-[clamp(2rem,5vh,4rem)]">
                <article className="grid-editorial items-center gap-y-8">
                  <div
                    className={
                      flip
                        ? "col-span-12 md:col-span-6 md:col-start-7 md:order-2"
                        : "col-span-12 md:col-span-6"
                    }
                  >
                    <Link href={`/destinations/${d.slug}`} className="group block">
                      <div className="figure-frame aspect-[5/3] w-full">
                        <Image
                          src={d.image}
                          alt={d.imageAlt}
                          width={1200}
                          height={720}
                          sizes="(max-width: 900px) 100vw, 45vw"
                          className="transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                        />
                      </div>
                    </Link>
                  </div>

                  <div
                    className={
                      flip
                        ? "col-span-12 md:col-span-5 md:col-start-1 md:order-1"
                        : "col-span-12 md:col-span-5 md:col-start-8"
                    }
                  >
                    <p className="label text-ink-faint">
                      <span className="numeral">{pad2(d.order)}</span> — {d.province}
                    </p>
                    <h2 className="mt-4 text-display-s text-ink">
                      <Link href={`/destinations/${d.slug}`} className="link-rule">
                        {d.name}
                      </Link>
                    </h2>
                    <p className="deva mt-1.5 text-small text-ink-faint">{d.nameDeva}</p>
                    <p className="read mt-5 max-w-[42ch] text-ink-soft">{d.summary}</p>

                    <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4 border-t border-rule pt-5">
                      <div>
                        <dt className="label-slim">Elevation</dt>
                        <dd className="numeral mt-1 text-body text-ink">
                          {d.elevationRangeM
                            ? `${d.elevationRangeM[0].toLocaleString("en-GB")}–${metres(d.elevationRangeM[1])}`
                            : metres(d.elevationM)}
                        </dd>
                      </div>
                      <div>
                        <dt className="label-slim">Best months</dt>
                        <dd className="mt-1 text-body text-ink">{formatSeason(d.bestMonths)}</dd>
                      </div>
                      {count > 0 && (
                        <div>
                          <dt className="label-slim">Journeys</dt>
                          <dd className="numeral mt-1 text-body text-ink">{count}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>

      <DhakaBand />
    </div>
  );
}
