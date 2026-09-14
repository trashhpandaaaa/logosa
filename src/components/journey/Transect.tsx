import Link from "next/link";
import { destinations } from "@/data/destinations";
import { metres } from "@/lib/utils";
import Reveal from "@/components/common/Reveal";

/**
 * THE TRANSECT — Nepal drawn as a vertical scale.
 *
 * Nepal's defining fact is that it runs from 60 m to 8,848.86 m inside 200
 * kilometres, and no photograph conveys that. So the destinations are plotted
 * against a *linear* altitude axis, which is the honest way to draw it: the
 * Terai sits almost on the floor and Everest is off at the top of the frame,
 * because that is the actual relationship. Compressing the axis to make every
 * label comfortable would flatter the layout and lie about the country.
 *
 * It doubles as navigation — every rule is a link to its destination.
 */

const CEILING = 9000; // metres of drawn axis
const EVEREST = 8848.86;

export default function Transect() {
  const ordered = [...destinations].sort((a, b) => a.elevationM - b.elevationM);
  const gridlines = [0, 2000, 4000, 6000, 8000];

  return (
    <section
      aria-labelledby="transect-title"
      className="on-ink paper-grain relative overflow-hidden"
    >
      <div className="shell relative z-[2] py-[var(--spacing-chapter)]">
        <div className="grid-editorial items-end gap-y-8">
          <div className="col-span-6 lg:col-span-5">
            <p className="label text-gold">Travel through Nepal</p>
            <h2
              id="transect-title"
              className="mt-5 font-[family-name:var(--font-display)] text-display-m leading-[1.02] text-paper"
            >
              A country measured <span className="italic">upward</span>.
            </h2>
          </div>
          <div className="col-span-6 lg:col-span-5 lg:col-start-8">
            <p className="text-body-lg leading-relaxed text-[color-mix(in_srgb,#F7F4EC_76%,transparent)]">
              Nepal is about 200 kilometres deep from the Indian border to the Tibetan plateau. In
              that distance the ground rises from subtropical floodplain to the highest point on
              earth. Every journey here is really a decision about altitude.
            </p>
          </div>
        </div>

        {/* The scale */}
        <Reveal variant="rise" className="mt-16 md:mt-20">
          <div className="relative">
            {/* Reference altitudes */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[clamp(20rem,42vh,30rem)]"
            >
              {gridlines.map((g) => (
                <div
                  key={g}
                  className="absolute inset-x-0 flex items-center gap-3"
                  style={{ bottom: `${(g / CEILING) * 100}%` }}
                >
                  <span className="numeral shrink-0 text-micro tabular-nums text-[color-mix(in_srgb,#F7F4EC_38%,transparent)]">
                    {g === 0 ? "0 m" : `${g.toLocaleString("en-GB")}`}
                  </span>
                  <span className="h-px flex-1 bg-[color-mix(in_srgb,#F7F4EC_11%,transparent)]" />
                </div>
              ))}

              {/* Everest, as the ceiling the whole country is measured against */}
              <div
                className="absolute inset-x-0 flex items-center gap-3"
                style={{ bottom: `${(EVEREST / CEILING) * 100}%` }}
              >
                <span className="numeral shrink-0 text-micro tabular-nums text-gold">8,848.86</span>
                <span className="h-px flex-1 bg-[color-mix(in_srgb,#FDB614_45%,transparent)]" />
                <span className="label shrink-0 text-gold">Sagarmatha</span>
              </div>
            </div>

            {/* Destinations */}
            <ol className="relative flex h-[clamp(20rem,42vh,30rem)] items-end gap-[2px] pl-14 md:gap-1">
              {ordered.map((d) => {
                const pct = (d.elevationM / CEILING) * 100;
                return (
                  <li key={d.slug} className="group relative flex-1">
                    <Link
                      href={`/destinations/${d.slug}`}
                      className="block focus-visible:outline-offset-8"
                    >
                      {/* The rule that carries the altitude */}
                      <span
                        aria-hidden
                        className="block w-px bg-[color-mix(in_srgb,#F7F4EC_34%,transparent)] transition-colors duration-500 group-hover:bg-gold"
                        style={{ height: `max(2px, ${pct}%)` }}
                      />
                      <span
                        aria-hidden
                        className="absolute left-0 block h-[7px] w-[7px] -translate-x-[3px] rotate-45 bg-paper transition-colors duration-500 group-hover:bg-gold"
                        style={{ bottom: `calc(max(2px, ${pct}%) - 3px)` }}
                      />

                      {/* Label, set on its side so eight fit without collision */}
                      <span
                        className="absolute bottom-0 left-0 origin-bottom-left translate-x-[13px] whitespace-nowrap"
                        style={{ writingMode: "vertical-rl" }}
                      >
                        <span className="label text-[color-mix(in_srgb,#F7F4EC_82%,transparent)] transition-colors duration-500 group-hover:text-gold">
                          {d.name}
                        </span>
                        <span className="numeral ml-2 text-micro tabular-nums text-[color-mix(in_srgb,#F7F4EC_46%,transparent)]">
                          {metres(d.elevationM)}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        </Reveal>

        <p className="mt-10 max-w-2xl text-small leading-relaxed text-[color-mix(in_srgb,#F7F4EC_52%,transparent)]">
          Elevations are the commonly published figure for each destination&rsquo;s main settlement
          or viewpoint. Chitwan and Lumbini sit on the Terai plain; Everest Base Camp is 5,364 m and
          the summit above it is 8,848.86 m, the figure jointly confirmed by Nepal and China in
          2020.
        </p>
      </div>
    </section>
  );
}
