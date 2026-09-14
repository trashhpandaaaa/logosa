"use client";

import { useEffect, useState } from "react";

type State =
  | { status: "loading" }
  | { status: "hidden" }
  | { status: "ready"; temperatureC: number; summary: string; source: string };

/**
 * Current conditions at the valley floor.
 *
 * Renders nothing at all if the reading is unavailable — a travel site that
 * shows a dash where a temperature should be is worse than one that shows
 * nothing, and inventing a number is not on the table.
 *
 * For anywhere with altitude, the reading is captioned rather than presented
 * as the weather "on the mountain", because those are not the same thing and
 * the difference is a safety matter, not a pedantic one.
 */
export default function Conditions({
  name,
  coords,
  highAltitude = false,
}: {
  name: string;
  coords: [number, number];
  highAltitude?: boolean;
}) {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/conditions?lat=${coords[1]}&lon=${coords[0]}`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((d) => {
        if (d?.available) {
          setState({
            status: "ready",
            temperatureC: d.temperatureC,
            summary: d.summary,
            source: d.source,
          });
        } else {
          setState({ status: "hidden" });
        }
      })
      .catch(() => setState({ status: "hidden" }));
    return () => controller.abort();
  }, [coords]);

  if (state.status === "hidden") return null;

  return (
    <div className="border-t border-rule pt-6">
      <h2 className="label text-ink">Conditions</h2>

      {state.status === "loading" ? (
        <p className="mt-3 text-body text-ink-faint" aria-live="polite">
          Checking…
        </p>
      ) : (
        <div className="mt-3">
          <p className="flex items-baseline gap-3">
            <span className="numeral text-display-s text-ink">
              {state.temperatureC}°
            </span>
            <span className="text-body text-ink-soft">{state.summary}</span>
          </p>
          <p className="label-slim mt-2">
            {name} · via {state.source}
          </p>
        </div>
      )}

      {highAltitude && (
        <p className="mt-4 text-small text-ink-faint">
          This is the reading at the valley floor. Conditions high on the route
          are different and change quickly — treat any forecast for the
          mountains as provisional and follow your guide.
        </p>
      )}
    </div>
  );
}
