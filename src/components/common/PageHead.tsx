import Link from "next/link";
import { DhakaBand } from "@/components/common/Dhaka";

/**
 * The masthead every inner page opens with. One structure — eyebrow, title,
 * standfirst, optional figures — so that arriving anywhere on the site feels
 * like turning to a new section of the same publication.
 */
export default function PageHead({
  kicker,
  title,
  deva,
  standfirst,
  figures,
  breadcrumb,
  children,
}: {
  kicker: string;
  title: React.ReactNode;
  deva?: string;
  standfirst?: string;
  figures?: { label: string; value: string }[];
  breadcrumb?: { href: string; label: string }[];
  children?: React.ReactNode;
}) {
  return (
    <header className="paper-grain relative bg-paper pt-[calc(4.5rem+var(--spacing-chapter))]">
      <div className="shell relative z-[2]">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2">
              {breadcrumb.map((b, i) => (
                <li key={b.href} className="flex items-center gap-2">
                  {i > 0 && (
                    <span aria-hidden className="text-ink-faint">
                      /
                    </span>
                  )}
                  <Link href={b.href} className="label-slim link-rule">
                    {b.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="grid-editorial items-end gap-y-8 pb-10">
          <div className="col-span-6 lg:col-span-7">
            <div className="flex items-baseline gap-4">
              <p className="label text-gold-deep">{kicker}</p>
              {deva && <p className="deva text-small text-ink-faint">{deva}</p>}
            </div>
            <h1 className="mt-5 font-[family-name:var(--font-display)] text-display-l leading-[0.98]">
              {title}
            </h1>
          </div>

          {standfirst && (
            <div className="col-span-6 lg:col-span-4 lg:col-start-9">
              <p className="read text-ink-soft">{standfirst}</p>
            </div>
          )}
        </div>

        {figures && figures.length > 0 && (
          <dl className="grid grid-cols-2 rule-t md:grid-cols-4">
            {figures.map((f) => (
              <div key={f.label} className="border-b border-[var(--color-rule)] py-5 md:border-b-0 md:border-r md:pr-6 md:last:border-r-0">
                <dt className="label-slim">{f.label}</dt>
                <dd className="numeral mt-2 text-title text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {children}
      </div>

      <DhakaBand className="mt-14" opacity={0.22} />
    </header>
  );
}
