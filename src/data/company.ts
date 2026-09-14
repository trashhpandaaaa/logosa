/**
 * COMPANY — the single source of truth for everything Logosa asserts about
 * itself. Nothing in this file may be guessed.
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  ⚠  BEFORE LAUNCH: replace every value marked TO_CONFIRM.
 *     Fields left as TO_CONFIRM are hidden from the public site at runtime
 *     rather than rendered as placeholder text, so an unfinished field can
 *     never be mistaken for a real one by a visitor.
 * ─────────────────────────────────────────────────────────────────────────
 */

/** Sentinel for a fact Logosa has not yet supplied. Never renders publicly. */
export const TO_CONFIRM = "__TO_CONFIRM__" as const;

export type Confirmable<T> = T | typeof TO_CONFIRM;

/** True when a value is real and safe to publish. */
export function confirmed<T>(v: Confirmable<T>): v is T {
  return v !== TO_CONFIRM && v !== undefined && v !== null && v !== "";
}

export interface CompanyProfile {
  legalName: string;
  shortName: string;
  tagline: string;
  /** Registration / tourism licence numbers. Displayed in the footer if set. */
  registrationNo: Confirmable<string>;
  tourismLicenceNo: Confirmable<string>;
  panNo: Confirmable<string>;
  /** Membership bodies (NATTA, TAAN, NMA…). Only list confirmed memberships. */
  memberships: string[];
  founded: Confirmable<string>;
  address: {
    street: Confirmable<string>;
    city: string;
    country: string;
  };
  phone: Confirmable<string>;
  /** Digits only, with country code, for wa.me links. */
  whatsapp: Confirmable<string>;
  email: Confirmable<string>;
  social: {
    facebook: Confirmable<string>;
    instagram: Confirmable<string>;
    tripadvisor: Confirmable<string>;
    youtube: Confirmable<string>;
  };
  /** Office hours, Nepal time. */
  hours: Confirmable<string>;
}

export const company: CompanyProfile = {
  legalName: "Logosa Tours and Travels Pvt. Ltd.",
  shortName: "Logosa",
  tagline: "Travel through Nepal.",

  registrationNo: TO_CONFIRM,
  tourismLicenceNo: TO_CONFIRM,
  panNo: TO_CONFIRM,
  memberships: [], // e.g. ["NATTA", "TAAN", "Nepal Mountaineering Association"]
  founded: TO_CONFIRM,

  address: {
    street: TO_CONFIRM,
    city: "Kathmandu",
    country: "Nepal",
  },

  phone: TO_CONFIRM,
  whatsapp: TO_CONFIRM,
  email: TO_CONFIRM,

  social: {
    facebook: TO_CONFIRM,
    instagram: TO_CONFIRM,
    tripadvisor: TO_CONFIRM,
    youtube: TO_CONFIRM,
  },

  hours: TO_CONFIRM,
};

/** Canonical site origin — used for metadata, sitemap and structured data. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://logosa.com.np";

/** wa.me deep link, or null when WhatsApp has not been confirmed. */
export function whatsappLink(message?: string): string | null {
  if (!confirmed(company.whatsapp)) return null;
  const digits = company.whatsapp.replace(/\D/g, "");
  const q = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${q}`;
}

export function telLink(): string | null {
  if (!confirmed(company.phone)) return null;
  return `tel:${company.phone.replace(/[^\d+]/g, "")}`;
}

export function mailtoLink(subject?: string, body?: string): string | null {
  if (!confirmed(company.email)) return null;
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const q = params.toString();
  return `mailto:${company.email}${q ? `?${q}` : ""}`;
}
