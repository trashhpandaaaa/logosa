"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion, isHandheld } from "@/lib/animations/motion";
import { heroChannel } from "@/lib/animations/scrollState";
import DrawnRange from "./DrawnRange";

const Stage = dynamic(() => import("@/components/three/Stage"), { ssr: false });
const EverestTerrain = dynamic(() => import("@/components/three/EverestTerrain"), { ssr: false });

/**
 * THE OPENING
 *
 * Four movements over a single sticky frame:
 *   1. the identity, alone on warm paper — logo, sun, prayer flags
 *   2. the illustration recedes as real terrain resolves out of the page
 *   3. the camera flies the ridge while the promise holds
 *   4. the frame hands over to the first chapter
 *
 * All four are one scroll timeline. The 3D never appears without the drawn
 * language arriving first, which is the whole point: the mountain is what the
 * logo has been describing all along.
 */
export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const identity = useRef<HTMLDivElement>(null);
  const promise = useRef<HTMLDivElement>(null);
  const drawn = useRef<HTMLDivElement>(null);
  const terrain = useRef<HTMLDivElement>(null);
  const support = useRef<HTMLParagraphElement>(null);
  const cue = useRef<HTMLDivElement>(null);
  const [still, setStill] = useState(false);
  const [low, setLow] = useState(false);

  useEffect(() => {
    registerGsap();
    const reduced = prefersReducedMotion();
    setStill(reduced);
    setLow(isHandheld());

    const ch = heroChannel();

    if (reduced) {
      // Hold a composed frame. Everything is legible, nothing moves.
      ch.progress = 0.5;
      ch.active = true;
      gsap.set(identity.current, { opacity: 0 });
      gsap.set(drawn.current, { opacity: 0 });
      gsap.set(terrain.current, { opacity: 1 });
      gsap.set(promise.current, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onToggle: (self) => {
          ch.active = self.isActive;
        },
        onUpdate: (self) => {
          ch.progress = self.progress;
        },
      });

      // The drawn range dissolves into the survey underneath it. This is the
      // hero's one real idea, so it gets the whole first third of the scroll
      // and nothing else competes with it. Written straight to the DOM — no
      // component state is involved.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        })
        // Illustration → landscape, as one crossfade over one window.
        .to(terrain.current, { opacity: 1, ease: "none", duration: 0.26 }, 0.04)
        .to(drawn.current, { opacity: 0, ease: "none", duration: 0.26 }, 0.04)
        // The identity steps back once the country itself is on the page.
        .to(identity.current, { opacity: 0, y: -30, ease: "none", duration: 0.18 }, 0.1)
        // The promise is present from the first frame and simply rises with
        // the scroll, rather than appearing from nothing halfway down.
        .to(promise.current, { y: -60, ease: "none", duration: 0.8 }, 0)
        // The supporting line has said its piece by the time the terrain
        // arrives, and it is the element least able to hold contrast against
        // snow. It leaves first; the headline can carry the frame alone.
        .to(support.current, { opacity: 0, ease: "none", duration: 0.1 }, 0.05)
        .to(promise.current, { opacity: 0, ease: "none", duration: 0.12 }, 0.84)
        .to(cue.current, { opacity: 0, ease: "none", duration: 0.08 }, 0.04);

      return () => st.kill();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      aria-label="Logosa — travel through Nepal"
      className="relative h-[380svh]"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-paper paper-grain">
        {/* ── The survey, underneath ──
            Ordered first and faded up from nothing. The drawn range sits on
            top of it and dissolves away, which is the only order that reads as
            one image resolving into another; the other way round the terrain's
            paper-coloured ghost hangs over the illustration and muddies both. */}
        <div ref={terrain} className="absolute inset-0 opacity-0">
          <Stage
            className="absolute inset-0"
            still={still}
            dprMax={low ? 1.4 : 1.75}
            fov={low ? 52 : 42}
          >
            <ambientLight intensity={0.85} />
            <EverestTerrain low={low} />
          </Stage>
        </div>

        {/* ── The drawn range: the logo's own mountains, extended across the
            page. This is what the real terrain dissolves out of. ── */}
        <div ref={drawn} className="pointer-events-none absolute inset-0">
          <DrawnRange />
        </div>

        {/* ── Column rules: the printed armature, visible and deliberate ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 shell hidden md:block"
        >
          <div className="grid-editorial h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-l border-rule-soft" />
            ))}
          </div>
        </div>

        {/* ── Type ──
            Three bands: identity at the head, the promise in the sky, the cue
            at the foot. The headline sits above the horizon rather than over
            the rock, so it never has to fight the illustration for contrast. */}
        <div className="pointer-events-none absolute inset-0 shell flex flex-col justify-between py-[max(1.25rem,3.5vh)]">
          {/* The identity. Deliberately modest — the logo already contains a
              sun and a range, and the page is about to draw both much larger.
              At hero scale it competed with its own composition. */}
          <div
            ref={identity}
            className="mt-[7vh] w-[min(17rem,44vw)] md:mt-[6vh] md:w-[min(21rem,26vw)]"
          >
            <Image
              src="/brand/logosa-logo.webp"
              alt="Logosa Tours and Travels Pvt. Ltd."
              width={900}
              height={751}
              priority
              sizes="(max-width: 768px) 44vw, 21rem"
              className="h-auto w-full"
            />
          </div>

          {/* The promise. Present from the first frame — an opening that shows
              a logo and nothing else has told the visitor nothing. */}
          <div ref={promise} className="pb-[8vh] md:pb-[6vh]">
            <div className="grid-editorial items-end">
              <div className="col-span-12 md:col-span-7">
                <p className="deva mb-4 text-[0.95rem] text-ink-faint">नेपाल यात्रा</p>
                <h1 className="text-display-l text-ink">
                  Travel through
                  <br />
                  Nepal.
                </h1>
              </div>
              <div className="col-span-12 mt-6 md:col-span-4 md:col-start-9 md:mt-0 md:pb-3">
                <p ref={support} className="max-w-[34ch] text-body-lg text-ink-soft">
                  Trekking, culture, wildlife and pilgrimage — arranged from
                  Kathmandu, walked at the pace the mountains set.
                </p>
              </div>
            </div>
          </div>

          {/* Set in paper: at the opening frame this band is navy rock, and
              the cue is gone by the time the terrain underneath it is not. */}
          <div ref={cue} className="flex items-end justify-between gap-6">
            <p className="label-slim !text-paper/75">Scroll to begin</p>
            {/* Marginalia, as an atlas sets it: the actual summit. */}
            <dl className="hidden text-right sm:block">
              <dt className="label-slim !text-paper/60">Sagarmatha · Everest</dt>
              <dd className="numeral text-title text-paper">8,848.86 m</dd>
              <dd className="label-slim mt-1 !text-paper/60">27.9881° N · 86.9250° E</dd>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
