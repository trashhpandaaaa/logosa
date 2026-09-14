"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/animations/motion";

type Variant = "rise" | "wipe" | "rule";

/**
 * Level 2 of the motion system: section entrances.
 *
 * Three variants, deliberately few. `rise` for blocks of text, `wipe` for
 * display headings, `rule` for the hairlines that draw the editorial grid.
 * Anything that wants a fourth kind of entrance probably wants less motion.
 *
 * Elements start hidden via CSS (`.will-reveal`) so there is no flash before
 * hydration, and are unconditionally shown when motion is reduced.
 */
export default function Reveal({
  children,
  variant = "rise",
  delay = 0,
  stagger = 0.08,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  variant?: Variant;
  delay?: number;
  stagger?: number;
  className?: string;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    registerGsap();

    // Direct children animate individually when there is more than one, so a
    // stack of paragraphs arrives in sequence rather than as a single slab.
    const targets = el.children.length > 1 ? Array.from(el.children) : [el];

    if (prefersReducedMotion()) {
      gsap.set(targets, { clearProps: "all", opacity: 1 });
      el.classList.remove("will-reveal");
      return;
    }

    const from =
      variant === "wipe"
        ? { opacity: 0, yPercent: 18, clipPath: "inset(0 0 100% 0)" }
        : variant === "rule"
          ? { opacity: 1, scaleX: 0, transformOrigin: "left center" }
          : { opacity: 0, y: 26 };

    const to =
      variant === "wipe"
        ? { opacity: 1, yPercent: 0, clipPath: "inset(0 0 -10% 0)" }
        : variant === "rule"
          ? { scaleX: 1 }
          : { opacity: 1, y: 0 };

    el.classList.remove("will-reveal");
    const ctx = gsap.context(() => {
      gsap.fromTo(targets, from, {
        ...to,
        duration: variant === "rule" ? 1.1 : 0.95,
        ease: variant === "rule" ? "power2.inOut" : "power3.out",
        delay,
        stagger: targets.length > 1 ? stagger : 0,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [variant, delay, stagger]);

  // A polymorphic `as` prop erases prop inference, so the element type is
  // narrowed here rather than leaving every consumer to fight `never`.
  const Component = Tag as React.ComponentType<{
    ref?: React.Ref<HTMLElement>;
    className?: string;
    children?: React.ReactNode;
  }>;

  return (
    <Component ref={ref} className={className ? `will-reveal ${className}` : "will-reveal"}>
      {children}
    </Component>
  );
}

/** Refreshes ScrollTrigger once fonts have settled, so starts are measured
 *  against the final layout rather than the fallback metrics. */
export function useScrollRefreshOnFonts() {
  useEffect(() => {
    if (!document.fonts) return;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
    };
  }, []);
}
