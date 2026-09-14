import { NextResponse } from "next/server";

/**
 * Current conditions for a destination.
 *
 * Backed by Open-Meteo, which is free, keyless and does not require
 * registration — so the site ships with real observations rather than a
 * decorative widget full of invented numbers.
 *
 * To move to a different provider, replace `fetchConditions` below. The
 * response shape is what the UI depends on; nothing else needs to change.
 * Setting CONDITIONS_DISABLED=1 turns the feature off cleanly and the UI
 * hides itself rather than showing an error.
 */

export const revalidate = 1800; // half an hour is plenty for a headline temp

/** WMO weather interpretation codes → plain English. */
const WMO: Record<number, string> = {
  0: "Clear",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Freezing fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  56: "Freezing drizzle",
  57: "Freezing drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Freezing rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Light showers",
  81: "Showers",
  82: "Heavy showers",
  85: "Snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with hail",
};

export async function GET(request: Request) {
  if (process.env.CONDITIONS_DISABLED === "1") {
    return NextResponse.json({ available: false, reason: "disabled" }, { status: 200 });
  }

  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));

  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return NextResponse.json({ available: false, reason: "bad-coordinates" }, { status: 400 });
  }

  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}` +
      `&longitude=${lon.toFixed(4)}&current=temperature_2m,weather_code&timezone=Asia%2FKathmandu`;

    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) throw new Error(`upstream ${res.status}`);

    const data = await res.json();
    const temp = data?.current?.temperature_2m;
    const code = data?.current?.weather_code;

    if (typeof temp !== "number") throw new Error("no reading");

    return NextResponse.json({
      available: true,
      temperatureC: Math.round(temp),
      summary: WMO[code] ?? "—",
      observedAt: data?.current?.time ?? null,
      source: "Open-Meteo",
    });
  } catch {
    // A weather failure must never break a destination page, and it must never
    // fall back to a plausible-looking guess.
    return NextResponse.json({ available: false, reason: "unavailable" }, { status: 200 });
  }
}
