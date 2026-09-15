"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion, isHandheld } from "@/lib/animations/motion";
import { heroChannel } from "@/lib/animations/scrollState";
import { DhakaField, DhakaLozenge } from "@/components/common/Dhaka";
import { PrayerFlags, Sun } from "./DrawnSky";

const Stage = dynamic(() => import("@/components/three/Stage"), { ssr: false });
const EverestTerrain = dynamic(() => import("@/components/three/EverestTerrain"), { ssr: false });

/**
 * THE OPENING
 *
 * Three movements over a single sticky frame:
 *   1. the promise on warm paper, under a sun and a line of prayer flags, with
 *      Everest itself lying along the foot of the page where the logo draws
 *      its range
 *   2. the drawing steps back and the camera flies the ridge it was describing
 *   3. the frame hands over to the first chapter
 *
 * All three are one scroll timeline. The mountain is the real survey from the
 * first paint: the logo's range and the photographed one are the same shape,
 * and the opening says so by showing it rather than dissolving between them.
 */
export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDListElement>(null);
  const promise = useRef<HTMLDivElement>(null);
  const sky = useRef<HTMLDivElement>(null);
  const flags = useRef<HTMLDivElement>(null);
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
      // Hold the opening frame. Everything is legible, nothing moves — and
      // the opening is now the composed one, so there is nothing to set.
      ch.progress = 0;
      ch.active = true;
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

      // The drawing clears and the camera takes over. Written straight to the
      // DOM — no component state is involved.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        })
        // Sun and flags belong to the opening frame, not to the flight: once
        // the camera starts moving they are two static drawings pinned over a
        // moving landscape, so they leave together and early.
        .to([sky.current, flags.current], { opacity: 0, ease: "none", duration: 0.2 }, 0.05)
        // The plate caption steps back once the country itself is on the page.
        .to(plate.current, { opacity: 0, y: -24, ease: "none", duration: 0.18 }, 0.1)
        // The promise is present from the first frame and simply rises with
        // the scroll, rather than appearing from nothing halfway down.
        .to(promise.current, { y: -60, ease: "none", duration: 0.8 }, 0)
        // The supporting line has said its piece by the time the camera moves,
        // and it is the element least able to hold contrast against snow. It
        // leaves first; the headline can carry the frame alone.
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
        {/* ── The cloth ──
            A dhaka field across the sky, held low enough to be felt rather
            than seen, and faded out before it reaches the snow — the weave
            belongs to the paper, and running it over the survey would put a
            printed pattern on a photographed mountain. */}
        <DhakaField opacity={0.032} unit={3} cells={32} fade="bottom" />

        {/* ── Dawn, underneath ──
            The sun is drawn first and nothing lifts it above the rock, which
            is how the logo composes it: gold behind the range, never a disc
            floating beside the wordmark. ── */}
        <div ref={sky} className="pointer-events-none absolute inset-0">
          <Sun />
        </div>

        {/* ── The survey ──
            Everest itself, laid along the foot of the frame where the logo
            draws its mountains. Present from the first paint. ── */}
        <div className="absolute inset-0">
          <Stage
            className="absolute inset-0"
            still={still}
            dprMax={low ? 1.4 : 1.75}
            fov={low ? 52 : 42}
          >
            <ambientLight intensity={0.85} />
            <EverestTerrain low={low} still={still} />
          </Stage>
        </div>

        {/* ── The foot of the plate, dissolved into the page ──
            The terrain shader already fades the tile's own edges into paper,
            so the survey reads as a plate torn from an atlas rather than a
            slab. The frame's bottom edge is the one cut it cannot see, and it
            is also where the caption sits: navy marginalia over a lit snowfield
            is unreadable at any weight. This gives it ground. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[15vh] bg-gradient-to-t from-paper via-paper/55 to-transparent"
        />

        {/* ── Prayer flags, strung over everything ── */}
        <div ref={flags} className="pointer-events-none absolute inset-0">
          <PrayerFlags />
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
            Two blocks: the plate caption at the head, and the promise with its
            cue at the foot.

            The logo used to head this frame and has been taken out — it
            carries a sun and a range of its own, and with the real mountain on
            the page underneath it, the opening was drawing the same thing
            twice. The wordmark still sits in the navigation, which is where a
            visitor looks for it.

            What heads the frame instead is the caption, which used to be set
            in the bottom corner: an atlas puts its plate title at the top, and
            down in the corner this was navy marginalia over a lit snowfield,
            which is the one place on the page it could not be read. */}
        <div className="pointer-events-none absolute inset-0 shell flex flex-col justify-between py-[max(1.25rem,3.5vh)]">
          {/* Marginalia, as an atlas sets it: the actual summit. */}
          <dl ref={plate} className="mt-[8vh] md:mt-[9vh]">
            <dt className="flex items-center gap-2">
              <DhakaLozenge size={10} fill="var(--color-gold)" />
              <span className="label-slim">Sagarmatha · Everest</span>
            </dt>
            <dd className="numeral mt-2 text-display-s text-ink">8,848.86 m</dd>
            <dd className="label-slim mt-1.5">27.9881° N · 86.9250° E</dd>
          </dl>

          {/* The foot of the frame, set as one block so the headline keeps its
              distance from the ridge rather than from the top of the page. */}
          <div>
            {/* The promise. Present from the first frame — an opening that
                shows a mountain and nothing else has told the visitor nothing. */}
            <div ref={promise} className="pb-[30vh] md:pb-[24vh]">
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

            {/* Set in ink: this band is snow now, not the navy rock the drawn
                range put here, and paper on snow is nothing at all. */}
            <div ref={cue}>
              <p className="label-slim !text-ink-soft">Scroll to begin</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
