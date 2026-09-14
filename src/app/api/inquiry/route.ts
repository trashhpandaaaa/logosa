import { NextResponse } from "next/server";
import { journeyBySlug } from "@/data/journeys";
import { destinationBySlug } from "@/data/destinations";
import { company, confirmed } from "@/data/company";

/**
 * ENQUIRIES
 *
 * Delivery is pluggable, and configured entirely by environment:
 *
 *   RESEND_API_KEY + INQUIRY_TO   → emailed via Resend
 *   INQUIRY_WEBHOOK_URL           → POSTed as JSON (Zapier, Make, a CRM…)
 *   neither                       → recorded in the server log, and the
 *                                   response tells the client to fall back to
 *                                   a prefilled mailto/WhatsApp message
 *
 * The last case matters: until Logosa supplies a destination, the form must
 * not pretend an enquiry was delivered. It says so, and hands the visitor a
 * route that actually works.
 */

export const runtime = "nodejs";

interface Payload {
  name?: string;
  email?: string;
  phone?: string;
  travellers?: number;
  date?: string;
  message?: string;
  journey?: string;
  destination?: string;
  /** Free-text itinerary produced by the trip planner. */
  itinerary?: string;
  /** Honeypot — must be empty. */
  website?: string;
}

// Coarse in-memory throttle. Adequate for a single instance; if the site is
// ever run on more than one, move this to a shared store.
const hits = new Map<string, { n: number; until: number }>();
const LIMIT = 5;
const WINDOW = 10 * 60 * 1000;

function throttled(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.until) {
    hits.set(ip, { n: 1, until: now + WINDOW });
    return false;
  }
  rec.n += 1;
  return rec.n > LIMIT;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Trim, cap length, and strip control characters (newlines and tabs kept). */
const clean = (v: unknown, max: number): string =>
  typeof v === "string"
    ? v
        // eslint-disable-next-line no-control-regex
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
        .trim()
        .slice(0, max)
    : "";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (throttled(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many enquiries from this connection. Please try again shortly." },
      { status: 429 },
    );
  }

  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  // Bots fill every field they find. A human never sees this one.
  if (clean(body.website, 100)) {
    return NextResponse.json({ ok: true, delivered: true });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 60);
  const message = clean(body.message, 4000);
  const itinerary = clean(body.itinerary, 4000);
  const date = clean(body.date, 40);
  const travellers = Number.isFinite(Number(body.travellers))
    ? Math.min(40, Math.max(1, Math.round(Number(body.travellers))))
    : undefined;

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Please tell us your name.";
  if (!EMAIL.test(email)) errors.email = "Please give an email address we can reply to.";

  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  // Resolve references against real data, so staff never receive a slug that
  // does not correspond to anything.
  const journey = body.journey ? journeyBySlug(clean(body.journey, 80)) : undefined;
  const destination = body.destination
    ? destinationBySlug(clean(body.destination, 80))
    : undefined;

  const received = new Date();
  const summary = [
    "LOGOSA — WEBSITE ENQUIRY",
    "".padEnd(46, "="),
    `Received:    ${received.toISOString()}`,
    journey ? `Journey:     ${journey.name} (${journey.days} days, ${journey.difficulty})` : null,
    destination ? `Destination: ${destination.name}` : null,
    travellers ? `Travellers:  ${travellers}` : null,
    date ? `Preferred:   ${date}` : null,
    "",
    "CONTACT",
    "".padEnd(46, "-"),
    `Name:        ${name}`,
    `Email:       ${email}`,
    phone ? `Phone:       ${phone}` : null,
    message ? ["", "MESSAGE", "".padEnd(46, "-"), message].join("\n") : null,
    itinerary ? ["", "PLANNER OUTPUT", "".padEnd(46, "-"), itinerary].join("\n") : null,
  ]
    .filter(Boolean)
    .join("\n");

  const record = {
    receivedAt: received.toISOString(),
    name,
    email,
    phone: phone || null,
    travellers: travellers ?? null,
    date: date || null,
    journey: journey?.slug ?? null,
    journeyName: journey?.name ?? null,
    destination: destination?.slug ?? null,
    message: message || null,
    itinerary: itinerary || null,
    summary,
  };

  // ── Delivery ────────────────────────────────────────────────────────────
  const to = process.env.INQUIRY_TO || (confirmed(company.email) ? company.email : null);
  const subjectParts = [journey?.name, destination?.name].filter(Boolean).join(" · ");
  const subject = `Enquiry: ${subjectParts || "General"} — ${name}`;

  try {
    if (process.env.RESEND_API_KEY && to) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.INQUIRY_FROM || "Logosa Website <onboarding@resend.dev>",
          to: [to],
          reply_to: email,
          subject,
          text: summary,
        }),
      });
      if (!res.ok) throw new Error(`resend ${res.status}`);
      return NextResponse.json({ ok: true, delivered: true });
    }

    if (process.env.INQUIRY_WEBHOOK_URL) {
      const res = await fetch(process.env.INQUIRY_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      if (!res.ok) throw new Error(`webhook ${res.status}`);
      return NextResponse.json({ ok: true, delivered: true });
    }
  } catch (err) {
    console.error("[inquiry] delivery failed:", err);
    console.info("[inquiry] unsent enquiry follows:\n" + summary);
    return NextResponse.json(
      { ok: true, delivered: false, reason: "delivery-failed", summary },
      { status: 200 },
    );
  }

  // Nothing configured yet. Say so rather than showing a success message for
  // an enquiry that went nowhere.
  console.warn(
    "[inquiry] No delivery configured (set RESEND_API_KEY + INQUIRY_TO, or INQUIRY_WEBHOOK_URL).",
  );
  console.info("[inquiry] enquiry follows:\n" + summary);

  return NextResponse.json(
    { ok: true, delivered: false, reason: "not-configured", summary },
    { status: 200 },
  );
}
