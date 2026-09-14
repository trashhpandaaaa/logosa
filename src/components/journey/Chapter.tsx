import Link from "next/link";
import type { Destination } from "@/data/destinations";
import { formatSeason } from "@/data/destinations";
import { metres, pad2 } from "@/lib/utils";
import Reveal from "@/components/common/Reveal";
import { DhakaLozenge } from "@/components/common/Dhaka";

const TERRAIN_LABEL: Record<Destination["terrain"], string> = {
  city: "The city",
  hills: "The hills",
  mountains: "The mountains",
  wilderness: "The wilderness",
  terai: "The Terai",
};

/**
 * A chapter of the journey.
 *
 * Three compositions, alternating — image bleeding left, image bleeding right,
 * and a full-width plate with the type set into it. The point is that the eye
 * has to re-find the text on each chapter, which is what makes a page feel
 * like a magazine rather than a feed. All three are built from the same grid
 * and the same six pieces of information, so the variation is compositional,
 * not decorative.
 */
export default function Chapter({
  destination: d,
  index,
}: {
  destination: Destination;
  index: number;
}) {
  const variant = index % 3;
  const facts = [
    { label: "Elevation", value: metres(d.elevationM) },
    { label: "Province", value: d.province },
    { label: "Best months", value: formatSeason(d.bestMonths) },
  ];

  const Meta = (
    <div className="flex items-baseline gap-4">
      <span className="numeral text-small text-ink-faint">{pad2(index + 1)}</span>
      <span className="label text-gold-deep">{TERRAIN_LABEL[d.terrain]}</span>
      <span className="deva text-small text-ink-faint">{d.nameDeva}</span>
    </div>
  );

  const Title = (
    <h3 className="mt-5 font-[family-name:var(--font-display)] text-display-m leading-[1.02] text-ink">
      {d.name}
    </h3>
  );

  const Body = (
    <>
      <p className="mt-4 max-w-md text-lead italic leading-snug text-ink-soft">{d.kicker}</p>
      <p className="mt-6 max-w-lg text-body leading-relaxed text-ink-soft">{d.summary}</p>
    </>
  );

  const Facts = (
    <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
      {facts.map((f) => (
        <div key={f.label}>
          <dt className="label-slim">{f.label}</dt>
          <dd className="numeral mt-1.5 text-title text-ink">{f.value}</dd>
        </div>
      ))}
    </dl>
  );

  const Cta = (
    <Link
      href={`/destinations/${d.slug}`}
      className="link-rule mt-9 inline-flex items-center gap-3 text-ink"
    >
      <DhakaLozenge size={11} fill="var(--color-gold)" />
      <span className="label">Explore {d.name}</span>
    </Link>
  );

  const Plate = (
    <figure className="figure-frame h-full">
      {/* The plates are SVG and already sized; a plain img keeps them
          resolution-independent and avoids a raster round-trip. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={d.image}
        alt={d.imageAlt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    </figure>
  );

  // ── Variant C: full-bleed plate with the chapter set into its lower edge.
  if (variant === 2) {
    return (
      <article className="relative">
        <div className="relative h-[68vh] min-h-[26rem] w-full">
          <div className="wash-ink absolute inset-0">{Plate}</div>
          <div className="absolute inset-x-0 bottom-0 pb-10 md:pb-14">
            <div className="shell">
              <Reveal variant="rise" className="max-w-2xl">
                <div className="flex items-baseline gap-4">
                  <span className="numeral text-small text-[color-mix(in_srgb,#F7F4EC_62%,transparent)]">
                    {pad2(index + 1)}
                  </span>
                  <span className="label text-gold">{TERRAIN_LABEL[d.terrain]}</span>
                  <span className="deva text-small text-[color-mix(in_srgb,#F7F4EC_62%,transparent)]">
                    {d.nameDeva}
                  </span>
                </div>
                <h3 className="mt-4 font-[family-name:var(--font-display)] text-display-m leading-[1.02] text-paper">
                  {d.name}
                </h3>
                <p className="mt-4 max-w-lg text-lead italic leading-snug text-[color-mix(in_srgb,#F7F4EC_86%,transparent)]">
                  {d.kicker}
                </p>
                <Link
                  href={`/destinations/${d.slug}`}
                  className="link-rule mt-7 inline-flex items-center gap-3 text-paper"
                >
                  <DhakaLozenge size={11} fill="var(--color-gold)" />
                  <span className="label">Explore {d.name}</span>
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // ── Variants A and B: the plate bleeds off one edge, the text holds the grid.
  const imageLeft = variant === 0;

  return (
    <article className="shell py-[var(--spacing-chapter)]">
      <div className="grid-editorial items-center gap-y-10">
        <div
          className={
            imageLeft
              ? "col-span-6 lg:col-span-6 lg:col-start-1"
              : "col-span-6 lg:col-span-6 lg:col-start-7 lg:row-start-1"
          }
        >
          <Reveal variant="rise">
            <div className="aspect-[5/4] w-full lg:aspect-[4/5]">{Plate}</div>
          </Reveal>
        </div>

        <div
          className={
            imageLeft
              ? "col-span-6 lg:col-span-5 lg:col-start-8"
              : "col-span-6 lg:col-span-5 lg:col-start-1 lg:row-start-1"
          }
        >
          <Reveal variant="rise" stagger={0.06}>
            <div>{Meta}</div>
            <div>{Title}</div>
            <div>{Body}</div>
            <div>{Facts}</div>
            <div>{Cta}</div>
          </Reveal>
        </div>
      </div>
    </article>
  );
}
