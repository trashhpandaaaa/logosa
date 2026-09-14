"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ScrollTrigger, registerGsap, prefersReducedMotion, isHandheld } from "@/lib/animations/motion";
import { craftChannel } from "@/lib/animations/scrollState";
import { creditByFile } from "@/data/credits";
import { DhakaBand } from "@/components/common/Dhaka";

const Stage = dynamic(() => import("@/components/three/Stage"), { ssr: false });
const StoneFigure = dynamic(() => import("@/components/three/StoneFigure"), { ssr: false });

/**
 * CHAPTER 02 — CRAFT
 *
 * The movement between the identity and the country: before Nepal is a
 * landscape it is a workshop. A scanned seventeenth-century relief is set on
 * ink like an object in a case, with the text holding the left columns.
 */
export default function CraftChapter() {
  const root = useRef<HTMLDivElement>(null);
  const [still, setStill] = useState(false);
  const [low, setLow] = useState(false);
  const credit = creditByFile("/models/kala-bhairava.glb");

  useEffect(() => {
    registerGsap();
    const reduced = prefersReducedMotion();
    setStill(reduced);
    setLow(isHandheld());

    const ch = craftChannel();
    if (reduced) {
      ch.progress = 0.5;
      return;
    }

    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onToggle: (self) => {
        ch.active = self.isActive;
      },
      onUpdate: (self) => {
        ch.progress = self.progress;
      },
    });
    return () => st.kill();
  }, []);

  return (
    <section id="craft" ref={root} className="on-ink paper-grain relative overflow-hidden">
      <DhakaBand ink="#F7F4EC" opacity={0.26} />

      <div className="shell py-chapter">
        <div className="grid-editorial items-center gap-y-14">
          <div className="col-span-12 md:col-span-5">
            <p className="label text-gold">Chapter 02 — Craft</p>
            <p className="deva mt-3 text-body text-paper/55">काल भैरव</p>

            <h2 className="mt-7 text-display-m">
              Before it is a landscape,
              <br />
              it is a workshop.
            </h2>

            <div className="read mt-8 max-w-[46ch] space-y-5 text-paper/75">
              <p>
                This is Kala Bhairava — a fierce form of Shiva, carved in stone
                and standing in the open in Kathmandu&rsquo;s Durbar Square. The
                relief is generally dated to the reign of Pratap Malla in the
                seventeenth century.
              </p>
              <p>
                For much of its life it was not only an image. Oaths were sworn
                in front of it, because it was held that anyone who lied before
                Kala Bhairava would not survive the lie. For a period it stood,
                in effect, as a court.
              </p>
              <p>
                The Kathmandu Valley is full of objects like this: still in the
                street, still in use, still being repaired by people whose
                families have done the work for generations.
              </p>
            </div>

            <Link
              href="/destinations/kathmandu-valley"
              className="btn btn-ghost mt-10"
            >
              The Kathmandu Valley
            </Link>
          </div>

          <div className="col-span-12 md:col-span-6 md:col-start-7">
            <div className="relative aspect-[4/5] w-full md:aspect-[3/4]">
              {/* A hairline case, so the object reads as exhibited rather than
                  floating in the section. */}
              <div className="absolute inset-0 border border-rule-invert" />
              <Stage
                className="absolute inset-0"
                still={still}
                dprMax={low ? 1.4 : 1.75}
                fov={38}
              >
                <PerspectiveRig />
                <StoneFigure url={low ? "/models/kala-bhairava-low.glb" : "/models/kala-bhairava.glb"} />
              </Stage>
            </div>

            {credit && (
              <p className="mt-3 text-[0.72rem] leading-relaxed text-paper/40">
                3D scan:{" "}
                <a href={credit.source} target="_blank" rel="noopener noreferrer" className="underline">
                  {credit.title}
                </a>{" "}
                by{" "}
                <a href={credit.authorUrl} target="_blank" rel="noopener noreferrer" className="underline">
                  {credit.author}
                </a>{" "}
                ·{" "}
                <a href={credit.licenceUrl} target="_blank" rel="noopener noreferrer" className="underline">
                  {credit.licence}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * A two-light rig: a hard warm key from the upper left, matching the sun in
 * the identity, and a cold fill from behind so the silhouette separates from
 * the ink ground. The camera is the Stage's own — the figure is centred on the
 * origin, so no rig-specific camera is needed.
 */
function PerspectiveRig() {
  return (
    <>
      <ambientLight intensity={0.55} color="#9fc0d8" />
      <directionalLight position={[-3, 4.5, 3]} intensity={2.4} color="#fff3d6" />
      <directionalLight position={[2.5, 1.5, -3]} intensity={1.2} color="#5f8fb5" />
    </>
  );
}
