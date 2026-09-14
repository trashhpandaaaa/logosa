import Link from "next/link";
import { experiences } from "@/data/experiences";
import ExperienceGlyph from "./ExperienceGlyph";
import { DhakaField } from "@/components/common/Dhaka";

/**
 * The way into the experience finder. Eight entries on a hairline grid — the
 * question asked plainly, and each answer a link that arrives at the finder
 * with that choice already made.
 */
export default function ExperienceTeaser() {
  return (
    <section aria-labelledby="exp-title" className="on-ink paper-grain relative overflow-hidden">
      <DhakaField ink="#F7F4EC" opacity={0.045} unit={4} />

      <div className="shell relative z-[2] py-[var(--spacing-chapter)]">
        <div className="grid-editorial items-end gap-y-6">
          <div className="col-span-6 lg:col-span-7">
            <p className="label text-gold">The question</p>
            <h2
              id="exp-title"
              className="mt-4 max-w-2xl font-[family-name:var(--font-display)] text-display-m leading-[1.02] text-paper"
            >
              What kind of journey are you looking for?
            </h2>
          </div>
          <div className="col-span-6 lg:col-span-4 lg:col-start-9">
            <p className="text-body leading-relaxed text-[color-mix(in_srgb,#F7F4EC_74%,transparent)]">
              Choose as many as apply. We will show you the destinations and routes that actually
              match — not everything we run.
            </p>
          </div>
        </div>

        <ul className="mt-14 grid grid-cols-2 border-l border-t border-[color-mix(in_srgb,#F7F4EC_16%,transparent)] md:grid-cols-4">
          {experiences.map((e) => (
            <li key={e.id} className="border-b border-r border-[color-mix(in_srgb,#F7F4EC_16%,transparent)]">
              <Link
                href={`/experiences?pick=${e.id}`}
                className="group flex h-full flex-col gap-4 p-6 transition-colors duration-500 hover:bg-[color-mix(in_srgb,#FDB614_10%,transparent)] md:p-7"
              >
                <span className="text-paper transition-colors duration-500 group-hover:text-gold">
                  <ExperienceGlyph experience={e} size={32} />
                </span>
                <span className="mt-auto">
                  <span className="block font-[family-name:var(--font-display)] text-title leading-tight text-paper">
                    {e.name}
                  </span>
                  <span className="mt-2 block text-small leading-snug text-[color-mix(in_srgb,#F7F4EC_58%,transparent)]">
                    {e.note}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/experiences" className="btn">
            Open the finder
          </Link>
          <Link href="/plan" className="btn btn-ghost">
            Or plan a whole trip
          </Link>
        </div>
      </div>
    </section>
  );
}
