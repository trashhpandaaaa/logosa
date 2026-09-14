"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { mapChapters, routeCoords } from "@/data/map-journey";
import {
  cameraAt,
  activeChapter,
  smoothPath,
  slicePath,
  lineFeature,
  type Coord,
} from "@/lib/mapbox/journey";
import { registerGsap, gsap, ScrollTrigger, prefersReducedMotion, isHandheld } from "@/lib/animations/motion";
import Atlas from "./Atlas";
import { pad2 } from "@/lib/utils";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

/**
 * THE MAP JOURNEY — level 4 of the motion system.
 *
 * Scroll drives one progress value. That value drives the camera, the length
 * of the route line, which marker is active, and which chapter of text is
 * showing. There is one source of truth and no second timeline to fall out of
 * step with it.
 *
 * Falls back to the drawn atlas — not to a broken map — when there is no
 * Mapbox token, when the visitor has asked for reduced motion, or when WebGL
 * is unavailable. The fallback tells the same story with the same data.
 */
export default function MapJourney() {
  const [mode, setMode] = useState<"pending" | "gl" | "atlas">("pending");

  useEffect(() => {
    if (!TOKEN || prefersReducedMotion()) {
      setMode("atlas");
      return;
    }
    // WebGL is checked before mapbox-gl is even fetched, so an unsupported
    // device never downloads 200 kB it cannot use.
    let ok = false;
    try {
      const c = document.createElement("canvas");
      ok = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      ok = false;
    }
    setMode(ok ? "gl" : "atlas");
  }, []);

  if (mode === "atlas") return <Atlas />;
  if (mode === "pending") {
    return (
      <section className="on-ink relative h-[70vh] min-h-[28rem]" aria-hidden>
        <div className="shell flex h-full items-center">
          <p className="label text-[color-mix(in_srgb,#F7F4EC_45%,transparent)]">Loading atlas…</p>
        </div>
      </section>
    );
  }
  return <GlJourney />;
}

function GlJourney() {
  const rootRef = useRef<HTMLDivElement>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("mapbox-gl").Map | null>(null);
  const markersRef = useRef<import("mapbox-gl").Marker[]>([]);
  const progressRef = useRef(0);
  const readyRef = useRef(false);
  const [active, setActive] = useState(0);
  const [interacted, setInteracted] = useState(false);

  // Smoothed path, computed once — the camera and the drawn line share it.
  const pathRef = useRef<Coord[]>(smoothPath(routeCoords, 28));

  useEffect(() => {
    let cancelled = false;
    let cleanupScroll: (() => void) | undefined;

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      const { logosaMapStyle, SKY_LAYER } = await import("@/lib/mapbox/style");
      await import("mapbox-gl/dist/mapbox-gl.css");
      if (cancelled || !holderRef.current) return;

      mapboxgl.accessToken = TOKEN!;
      const handheld = isHandheld();
      const first = mapChapters[0];

      const map = new mapboxgl.Map({
        container: holderRef.current,
        style: logosaMapStyle(),
        center: first.center,
        zoom: first.zoom,
        pitch: first.pitch,
        bearing: first.bearing,
        // Scroll belongs to the page. Zooming with the wheel over a
        // full-height map is the classic way to trap someone mid-article.
        scrollZoom: false,
        attributionControl: true,
        cooperativeGestures: handheld,
        antialias: !handheld,
        maxPitch: handheld ? 55 : 80,
        // The atlas is a portrait of Nepal, not a world map.
        maxBounds: [
          [77.5, 24.5],
          [90.5, 32.5],
        ],
      });
      mapRef.current = map;

      map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), "bottom-right");

      map.on("load", () => {
        if (cancelled) return;

        // 3D terrain is the expensive part; handhelds get the same style flat.
        if (!handheld) {
          map.setTerrain({ source: "dem", exaggeration: 1.35 });
          map.addLayer(SKY_LAYER as never);
        } else {
          map.setTerrain(null);
        }

        // Route: a shadow beneath and a gold line over it, so it stays legible
        // against both snow and forest.
        map.addSource("route", { type: "geojson", data: lineFeature([pathRef.current[0]]) });
        map.addLayer({
          id: "route-shadow",
          type: "line",
          source: "route",
          layout: { "line-cap": "round", "line-join": "round" },
          paint: { "line-color": "#00212F", "line-width": 5, "line-opacity": 0.28, "line-blur": 2 },
        });
        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          layout: { "line-cap": "round", "line-join": "round" },
          paint: { "line-color": "#FDB614", "line-width": 2.2 },
        });

        // Markers in the identity's own language: a woven lozenge, not a pin.
        mapChapters.forEach((c, i) => {
          if (!c.slug) return;
          const el = document.createElement("div");
          el.className = "logosa-marker";
          el.setAttribute("data-index", String(i));
          el.innerHTML = `
            <span class="logosa-marker__ring"></span>
            <span class="logosa-marker__label">${c.name}</span>`;
          const m = new mapboxgl.Marker({ element: el, anchor: "center" })
            .setLngLat(c.center)
            .addTo(map);
          markersRef.current.push(m);
        });

        readyRef.current = true;
        apply(progressRef.current);
      });

      // Manual interaction is allowed, but the narrative is not surrendered:
      // the next scroll frame returns the camera to the story position.
      map.on("dragstart", () => setInteracted(true));
      map.on("rotatestart", () => setInteracted(true));

      const apply = (p: number) => {
        if (!readyRef.current) return;
        const cam = cameraAt(mapChapters, p);
        map.jumpTo(cam);

        const src = map.getSource("route") as import("mapbox-gl").GeoJSONSource | undefined;
        if (src) {
          // The line starts drawing once the camera leaves the opening
          // wide-view chapter, and completes as it reaches the last.
          const n = mapChapters.length - 1;
          const routeProgress = Math.max(0, (p * n - 1) / (n - 1));
          src.setData(lineFeature(slicePath(pathRef.current, routeProgress)) as never);
        }

        const idx = activeChapter(mapChapters, p);
        for (const m of markersRef.current) {
          const el = m.getElement();
          el.classList.toggle("is-active", Number(el.dataset.index) === idx);
        }
        setActive((prev) => (prev === idx ? prev : idx));
      };

      registerGsap();
      const st = ScrollTrigger.create({
        trigger: rootRef.current!,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          if (self.progress > 0.02) setInteracted(false);
          apply(self.progress);
        },
      });
      cleanupScroll = () => st.kill();
    })();

    return () => {
      cancelled = true;
      cleanupScroll?.();
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  const chapter = mapChapters[active];

  return (
    <section
      ref={rootRef}
      aria-labelledby="map-title"
      className="relative"
      style={{ height: `${mapChapters.length * 85}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-paper-3">
        <div ref={holderRef} className="absolute inset-0" />

        {/* Chapter card. Bottom-left on desktop, a bottom sheet on handhelds. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-[var(--spacing-gutter)] md:inset-y-0 md:right-auto md:flex md:w-[min(30rem,42vw)] md:items-center">
          <div className="pointer-events-auto w-full bg-[color-mix(in_srgb,#00212F_92%,transparent)] p-6 text-paper backdrop-blur-[3px] md:p-8">
            <div className="flex items-baseline gap-3">
              <span className="numeral text-small text-gold">{pad2(active + 1)}</span>
              <span className="label text-[color-mix(in_srgb,#F7F4EC_60%,transparent)]">
                of {pad2(mapChapters.length)}
              </span>
              <span className="numeral ml-auto text-small tabular-nums text-gold">
                {chapter.kicker}
              </span>
            </div>

            <h2
              id="map-title"
              className="mt-4 font-[family-name:var(--font-display)] text-display-s leading-[1.05] text-paper"
            >
              {chapter.name}
            </h2>
            <p className="mt-3 text-body leading-relaxed text-[color-mix(in_srgb,#F7F4EC_78%,transparent)]">
              {chapter.note}
            </p>

            {chapter.slug && (
              <Link
                href={`/destinations/${chapter.slug}`}
                className="link-rule mt-5 inline-block text-paper"
              >
                <span className="label">Open {chapter.name}</span>
              </Link>
            )}

            {/* Progress through the traverse */}
            <ol className="mt-6 flex items-center gap-1.5" aria-hidden>
              {mapChapters.map((c, i) => (
                <li
                  key={c.id}
                  className={`h-px flex-1 transition-colors duration-500 ${
                    i <= active ? "bg-gold" : "bg-[color-mix(in_srgb,#F7F4EC_22%,transparent)]"
                  }`}
                />
              ))}
            </ol>
          </div>
        </div>

        {interacted && (
          <p className="pointer-events-none absolute left-1/2 top-6 z-10 -translate-x-1/2 bg-paper px-3 py-2 text-micro text-ink">
            Keep scrolling to rejoin the route
          </p>
        )}
      </div>

      {/* The map is a presentation of data that also exists as text. Screen
          readers and search engines get the itinerary, not an empty canvas. */}
      <ol className="sr-only">
        {mapChapters.map((c) => (
          <li key={c.id}>
            <h3>{c.name}</h3>
            <p>{c.note}</p>
            {c.slug && <Link href={`/destinations/${c.slug}`}>More about {c.name}</Link>}
          </li>
        ))}
      </ol>

      <style>{`
        .logosa-marker {
          position: relative;
          display: grid;
          place-items: center;
          width: 14px; height: 14px;
          cursor: default;
        }
        .logosa-marker__ring {
          width: 9px; height: 9px;
          background: #F7F4EC;
          border: 1.5px solid #003047;
          transform: rotate(45deg);
          transition: background .5s var(--ease-out-expo), transform .5s var(--ease-out-expo);
        }
        .logosa-marker.is-active .logosa-marker__ring {
          background: #FDB614;
          transform: rotate(45deg) scale(1.5);
        }
        .logosa-marker__label {
          position: absolute;
          left: 16px;
          white-space: nowrap;
          font-family: var(--font-sans);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: #003047;
          background: color-mix(in srgb, #F7F4EC 82%, transparent);
          padding: 2px 5px;
          opacity: 0;
          transition: opacity .5s var(--ease-out-expo);
        }
        .logosa-marker.is-active .logosa-marker__label { opacity: 1; }
      `}</style>
    </section>
  );
}
