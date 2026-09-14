"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { registerGsap, gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/animations/motion";

/**
 * Lenis drives scrolling; GSAP's ticker drives Lenis. Running one clock rather
 * than two is what keeps scroll-scrubbed timelines locked to the scrollbar
 * instead of drifting a frame behind it.
 *
 * Disabled entirely under prefers-reduced-motion — smoothing is itself motion,
 * and hijacking scroll is exactly what that setting asks you not to do.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    registerGsap();
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      // Native scrolling on touch: smoothing fights the platform's own
      // momentum and the result feels worse than doing nothing.
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  // Route changes must land at the top with triggers re-measured, or a long
  // page navigated from halfway down renders with stale start/end positions.
  useEffect(() => {
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return <>{children}</>;
}
