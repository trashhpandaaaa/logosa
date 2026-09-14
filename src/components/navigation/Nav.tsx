"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/destinations", label: "Destinations" },
  { href: "/journeys", label: "Journeys" },
  { href: "/experiences", label: "Experiences" },
  { href: "/plan", label: "Plan a trip" },
  { href: "/stories", label: "Stories" },
  { href: "/about", label: "About" },
];

/**
 * Navigation sits transparent over the opening frame and takes on paper once
 * the page has moved. The emblem is used rather than the full lockup, because
 * at 40px the wordmark beneath it would be illegible — the complete logo is
 * shown at size in the hero and the footer.
 */
export default function Nav() {
  const [settled, setSettled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);

  // The homepage opens over a full-bleed frame; every other route starts
  // with content directly beneath the bar.
  const overlay = pathname === "/";

  useEffect(() => {
    const onScroll = () => setSettled(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // Menu open: trap focus loosely, lock the page, and close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    panel.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const onPaper = settled || !overlay;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,padding] duration-500",
          "border-b",
          onPaper
            ? "border-rule bg-paper/92 py-3 backdrop-blur-[2px]"
            : "border-transparent py-5",
        )}
      >
        <div className="shell flex items-center justify-between gap-6">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="Logosa Tours and Travels — home"
          >
            <Image
              src="/brand/logosa-mark.webp"
              alt=""
              width={260}
              height={188}
              className={cn(
                "w-auto transition-[height] duration-500",
                onPaper ? "h-9" : "h-11",
              )}
            />
            <span className="sr-only">Logosa Tours and Travels Pvt. Ltd.</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {LINKS.map((l) => {
              const active = pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "label link-rule text-ink transition-opacity",
                    active ? "opacity-100" : "opacity-70 hover:opacity-100",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link href="/contact" className="btn px-5 py-3">
              Enquire
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="label flex items-center gap-2.5 text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            Menu
            <span aria-hidden="true" className="flex w-5 flex-col gap-[3px]">
              <span className="h-px w-full bg-ink" />
              <span className="h-px w-full bg-ink" />
            </span>
          </button>
        </div>
      </header>

      {/* Full-screen navigation. Typography does the work; no dashboard. */}
      <div
        id="mobile-nav"
        ref={panel}
        hidden={!open}
        className="on-ink paper-grain fixed inset-0 z-[60] flex flex-col justify-between overflow-y-auto p-gutter"
      >
        <div className="flex items-center justify-between">
          <p className="label text-paper/70">Logosa</p>
          <button type="button" onClick={() => setOpen(false)} className="label text-paper">
            Close
          </button>
        </div>

        <nav aria-label="Primary" className="py-12">
          <ul className="space-y-1">
            {[...LINKS, { href: "/contact", label: "Contact" }].map((l, i) => (
              <li key={l.href} className="rule-t border-rule-invert">
                <Link
                  href={l.href}
                  className="flex items-baseline gap-5 py-4 text-display-s text-paper"
                >
                  <span className="numeral text-label text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="label-slim text-paper/60">Kathmandu, Nepal</p>
      </div>
    </>
  );
}
