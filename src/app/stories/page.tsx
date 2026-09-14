import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { publishedStories, formatStoryDate } from "@/data/stories";
import PageHead from "@/components/common/PageHead";
import { DhakaBand } from "@/components/common/Dhaka";

export const metadata: Metadata = {
  title: "Stories from the road",
  description:
    "Longer reading on Nepal from Logosa — altitude and acclimatisation, the Kali Gandaki and the salt road, and how to read Newar woodcarving.",
  alternates: { canonical: "/stories" },
};

export default function StoriesIndex() {
  const [lead, ...rest] = publishedStories;

  return (
    <div className="bg-paper paper-grain">
      <PageHead
        kicker="Stories from the road"
        deva="कथा"
        title="Longer reading."
        standfirst="Pieces that go further than an itinerary will: why a fourteen-day trek is fourteen days, what the Kali Gandaki carried, and how to read a carved window."
        breadcrumb={[{ href: "/", label: "Logosa" }]}
      />

      {lead && (
        <section className="shell pb-[clamp(3rem,7vh,5rem)]">
          <article className="grid-editorial items-center gap-y-8 border-t border-rule pt-[clamp(2rem,5vh,3.5rem)]">
            <div className="col-span-12 md:col-span-7">
              <Link href={`/stories/${lead.slug}`} className="group block">
                <div className="figure-frame aspect-[16/10]">
                  <Image
                    src={lead.image}
                    alt={lead.imageAlt}
                    width={1600}
                    height={1000}
                    priority
                    sizes="(max-width: 900px) 100vw, 58vw"
                    className="transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  />
                </div>
              </Link>
            </div>
            <div className="col-span-12 md:col-span-4 md:col-start-9">
              <p className="label text-gold-deep">{lead.kicker}</p>
              <h2 className="mt-4 text-display-s text-ink">
                <Link href={`/stories/${lead.slug}`} className="link-rule">
                  {lead.title}
                </Link>
              </h2>
              <p className="read mt-5 text-ink-soft">{lead.standfirst}</p>
              <p className="label-slim mt-6">
                {formatStoryDate(lead.published)} · {lead.readingMinutes} min read
              </p>
            </div>
          </article>
        </section>
      )}

      {rest.length > 0 && (
        <section className="shell pb-chapter">
          <ul className="grid-editorial gap-y-14">
            {rest.map((s) => (
              <li key={s.slug} className="col-span-12 md:col-span-6">
                <article className="border-t border-rule pt-8">
                  <Link href={`/stories/${s.slug}`} className="group block">
                    <div className="figure-frame aspect-[3/2]">
                      <Image
                        src={s.image}
                        alt={s.imageAlt}
                        width={1000}
                        height={667}
                        sizes="(max-width: 900px) 100vw, 45vw"
                        className="transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                      />
                    </div>
                    <p className="label mt-6 text-gold-deep">{s.kicker}</p>
                    <h2 className="mt-3 text-title text-ink">{s.title}</h2>
                  </Link>
                  <p className="read mt-4 max-w-[44ch] text-ink-soft">{s.standfirst}</p>
                  <p className="label-slim mt-5">
                    {formatStoryDate(s.published)} · {s.readingMinutes} min read
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </section>
      )}

      <DhakaBand />
    </div>
  );
}
