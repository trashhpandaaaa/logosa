import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  stories,
  storyBySlug,
  publishedStories,
  formatStoryDate,
  type Block,
} from "@/data/stories";
import { destinationBySlug } from "@/data/destinations";
import { SITE_URL, company } from "@/data/company";
import { DhakaLozenge } from "@/components/common/Dhaka";
import EnquiryCta from "@/components/contact/EnquiryCta";

export function generateStaticParams() {
  return stories.filter((s) => s.status === "published").map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(
  props: PageProps<"/stories/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const s = storyBySlug(slug);
  if (!s) return {};
  return {
    title: s.title,
    description: s.standfirst,
    alternates: { canonical: `/stories/${s.slug}` },
    openGraph: {
      type: "article",
      title: `${s.title} · Logosa`,
      description: s.standfirst,
      url: `${SITE_URL}/stories/${s.slug}`,
      publishedTime: s.published,
    },
  };
}

/**
 * The long-form renderer. Blocks are typed in the data, so an article's
 * structure — where a figure goes full bleed, where facts break the column —
 * is content rather than markup, and the layout stays consistent across pieces.
 */
function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="col-span-12 mx-auto mt-[clamp(2.5rem,6vh,4rem)] w-full max-w-[38rem] text-display-s text-ink md:col-span-8 md:col-start-3">
          {block.text}
        </h2>
      );

    case "text":
      return (
        <p className="prose-logosa col-span-12 mx-auto w-full max-w-[38rem] md:col-span-8 md:col-start-3">
          {block.text}
        </p>
      );

    case "quote":
      return (
        <figure className="col-span-12 mx-auto my-[clamp(2rem,5vh,3rem)] w-full max-w-[44rem] md:col-span-10 md:col-start-2">
          <blockquote className="border-l-2 border-gold pl-6 font-[family-name:var(--font-display)] text-display-s leading-[1.15] text-ink">
            {block.text}
          </blockquote>
          {block.attribution && (
            <figcaption className="label-slim mt-4 pl-6">{block.attribution}</figcaption>
          )}
        </figure>
      );

    case "figure":
      return (
        <figure
          className={
            block.span === "full"
              ? "col-span-12 my-[clamp(2rem,5vh,3.5rem)]"
              : "col-span-12 my-[clamp(2rem,5vh,3.5rem)] md:col-span-10 md:col-start-2"
          }
        >
          <div className="figure-frame aspect-[16/9]">
            <Image
              src={block.image}
              alt={block.alt}
              width={1800}
              height={1013}
              sizes="(max-width: 900px) 100vw, 80vw"
            />
          </div>
          {block.caption && (
            <figcaption className="label-slim mt-3">{block.caption}</figcaption>
          )}
        </figure>
      );

    case "facts":
      return (
        <aside className="col-span-12 my-[clamp(2rem,5vh,3rem)] md:col-span-8 md:col-start-3">
          <div className="border-y border-rule py-7">
            {block.title && <h2 className="label mb-5 text-gold-deep">{block.title}</h2>}
            <dl className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
              {block.items.map((it) => (
                <div key={it.label}>
                  <dt className="label-slim">{it.label}</dt>
                  <dd className="numeral mt-1.5 text-title text-ink">{it.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      );

    case "note":
      return (
        <aside className="col-span-12 my-[clamp(1.5rem,4vh,2.5rem)] md:col-span-8 md:col-start-3">
          <div className="flex gap-4 bg-paper-2 p-6">
            <DhakaLozenge className="mt-1 shrink-0" size={16} />
            <p className="text-small leading-relaxed text-ink-soft">{block.text}</p>
          </div>
        </aside>
      );
  }
}

export default async function StoryPage(props: PageProps<"/stories/[slug]">) {
  const { slug } = await props.params;
  const s = storyBySlug(slug);
  if (!s || s.status !== "published") notFound();

  const related = publishedStories.filter((o) => o.slug !== s.slug).slice(0, 2);
  const places = s.destinations.map(destinationBySlug).filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: s.title,
    description: s.standfirst,
    datePublished: s.published,
    author: { "@type": "Organization", name: company.legalName },
    publisher: { "@type": "Organization", name: company.legalName },
    mainEntityOfPage: `${SITE_URL}/stories/${s.slug}`,
    image: `${SITE_URL}${s.image}`,
    keywords: s.tags.join(", "),
  };

  return (
    <article className="bg-paper paper-grain">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="shell pt-[calc(4.5rem+var(--spacing-chapter))]">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="label-slim link-rule">
                Logosa
              </Link>
            </li>
            <li aria-hidden className="text-ink-faint">
              /
            </li>
            <li>
              <Link href="/stories" className="label-slim link-rule">
                Stories
              </Link>
            </li>
          </ol>
        </nav>

        <div className="mx-auto w-full max-w-[46rem]">
          <p className="label text-gold-deep">{s.kicker}</p>
          <h1 className="mt-5 text-display-l text-ink">{s.title}</h1>
          <p className="read mt-7 text-lead text-ink-soft">{s.standfirst}</p>
          <p className="label-slim mt-8 border-t border-rule pt-5">
            {s.byline} · {formatStoryDate(s.published)} · {s.readingMinutes} min read
          </p>
        </div>
      </header>

      <div className="shell mt-[clamp(2.5rem,6vh,4rem)]">
        <div className="figure-frame aspect-[16/9] w-full">
          <Image
            src={s.image}
            alt={s.imageAlt}
            width={2000}
            height={1125}
            priority
            sizes="100vw"
          />
        </div>
      </div>

      <div className="shell py-chapter">
        <div className="grid-editorial">
          {s.body.map((b, i) => (
            <BlockView key={i} block={b} />
          ))}
        </div>

        {places.length > 0 && (
          <div className="mx-auto mt-[clamp(3rem,7vh,4.5rem)] w-full max-w-[38rem] border-t border-rule pt-6">
            <h2 className="label text-ink-faint">Places in this piece</h2>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {places.map((p) => (
                <li key={p!.slug}>
                  <Link
                    href={`/destinations/${p!.slug}`}
                    className="link-rule text-body-lg text-ink"
                  >
                    {p!.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {related.length > 0 && (
        <section className="shell pb-chapter">
          <h2 className="label text-ink-faint">Read next</h2>
          <ul className="mt-8 grid-editorial gap-y-10">
            {related.map((r) => (
              <li key={r.slug} className="col-span-12 md:col-span-6">
                <Link href={`/stories/${r.slug}`} className="group block border-t border-rule pt-6">
                  <p className="label text-gold-deep">{r.kicker}</p>
                  <h3 className="mt-3 text-title text-ink">{r.title}</h3>
                  <p className="read mt-3 max-w-[42ch] text-ink-soft">{r.standfirst}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <EnquiryCta
        heading="Somewhere in here you would like to walk?"
        note="Tell us roughly when, and for how long. We will come back with a route and a written quote for your group."
        subject={s.title}
      />
    </article>
  );
}
