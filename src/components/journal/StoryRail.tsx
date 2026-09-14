import Link from "next/link";
import type { Story } from "@/data/stories";
import { formatStoryDate } from "@/data/stories";
import Reveal from "@/components/common/Reveal";

/**
 * Stories from the road. The lead piece is set large with its plate; the rest
 * run as an index beneath it. A journal has a front page, not a row of equal
 * tiles.
 */
export default function StoryRail({ stories }: { stories: Story[] }) {
  if (stories.length === 0) return null;
  const [lead, ...rest] = stories;

  return (
    <section aria-labelledby="stories-title" className="paper-grain relative bg-paper">
      <div className="shell relative z-[2] py-[var(--spacing-chapter)]">
        <div className="grid-editorial items-end gap-y-6 rule-b pb-8">
          <div className="col-span-6 lg:col-span-6">
            <p className="label text-gold-deep">Stories from the road</p>
            <h2
              id="stories-title"
              className="mt-4 font-[family-name:var(--font-display)] text-display-m leading-[1.02]"
            >
              Written to be useful <span className="italic">before</span> you go.
            </h2>
          </div>
          <div className="col-span-6 lg:col-span-4 lg:col-start-9">
            <Link href="/stories" className="link-rule inline-block">
              <span className="label">The whole journal</span>
            </Link>
          </div>
        </div>

        <Reveal variant="rise" className="mt-12">
          <article className="grid-editorial items-center gap-y-8">
            <Link
              href={`/stories/${lead.slug}`}
              className="group col-span-6 lg:col-span-7 lg:col-start-1"
            >
              <div className="figure-frame aspect-[16/10] w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lead.image}
                  alt={lead.imageAlt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                />
              </div>
            </Link>

            <div className="col-span-6 lg:col-span-4 lg:col-start-9">
              <p className="label text-ink-faint">{lead.kicker}</p>
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-display-s leading-[1.06]">
                <Link href={`/stories/${lead.slug}`} className="link-rule">
                  {lead.title}
                </Link>
              </h3>
              <p className="read mt-4 text-ink-soft">{lead.standfirst}</p>
              <p className="label-slim mt-6">
                {formatStoryDate(lead.published)} · {lead.readingMinutes} min read
              </p>
            </div>
          </article>
        </Reveal>

        {rest.length > 0 && (
          <Reveal variant="rise" stagger={0.06} as="ol" className="mt-14 rule-t">
            {rest.map((s) => (
              <li key={s.slug} className="rule-b">
                <Link
                  href={`/stories/${s.slug}`}
                  className="group grid items-baseline gap-x-6 gap-y-2 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_9rem]"
                >
                  <span className="font-[family-name:var(--font-display)] text-title leading-tight text-ink transition-colors duration-500 group-hover:text-gold-deep">
                    {s.title}
                  </span>
                  <span className="text-small leading-snug text-ink-soft">{s.standfirst}</span>
                  <span className="label-slim md:text-right">
                    {s.readingMinutes} min · {s.kicker.split(" · ")[0]}
                  </span>
                </Link>
              </li>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}
