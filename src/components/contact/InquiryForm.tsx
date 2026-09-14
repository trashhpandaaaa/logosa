"use client";

import { useState } from "react";
import { whatsappLink, mailtoLink, telLink, company, confirmed } from "@/data/company";

type State =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "sent"; reference: string }
  | { status: "error"; message: string; errors?: Record<string, string> };

/**
 * The enquiry form.
 *
 * Six fields, two of them required. Every extra question costs replies, and
 * Logosa can ask anything else in the conversation that follows.
 *
 * When the site has no delivery channel configured the form says so and offers
 * WhatsApp and email instead — it never reports success for a message that
 * went nowhere.
 */
export default function InquiryForm({
  journeySlug,
  journeyName,
  destinationSlugs,
  experiences,
  prefillMessage,
  compact,
}: {
  journeySlug?: string;
  journeyName?: string;
  destinationSlugs?: string[];
  experiences?: string[];
  prefillMessage?: string;
  compact?: boolean;
}) {
  const [state, setState] = useState<State>({ status: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState({ status: "sending" });

    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      travellers: Number(fd.get("travellers")) || undefined,
      startDate: String(fd.get("startDate") || ""),
      duration: String(fd.get("duration") || ""),
      message: String(fd.get("message") || ""),
      website: String(fd.get("website") || ""),
      journeySlug,
      destinationSlugs,
      experiences,
    };

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) setState({ status: "sent", reference: data.reference });
      else
        setState({
          status: "error",
          message: data.error || "Please check the highlighted fields.",
          errors: data.errors,
        });
    } catch {
      setState({
        status: "error",
        message: "Your connection dropped before we could send that.",
      });
    }
  }

  const wa = whatsappLink(
    journeyName
      ? `Hello Logosa — I would like to ask about the ${journeyName} journey.`
      : "Hello Logosa — I have a question about travelling in Nepal.",
  );
  const mail = mailtoLink(journeyName ? `Enquiry — ${journeyName}` : "Enquiry");
  const tel = telLink();

  if (state.status === "sent") {
    return (
      <div className="border border-ink p-8">
        <p className="label text-gold-deep">Enquiry received</p>
        <h3 className="mt-4 font-[family-name:var(--font-display)] text-display-s leading-tight">
          Thank you — we have it.
        </h3>
        <p className="mt-4 max-w-lg text-body leading-relaxed text-ink-soft">
          Your reference is <span className="numeral text-ink">{state.reference}</span>. A person
          will read this and reply, usually within one working day. Nepal is UTC+5:45, so allow for
          the time difference.
        </p>
        {wa && (
          <p className="mt-5 text-small text-ink-soft">
            If it is urgent,{" "}
            <a href={wa} target="_blank" rel="noopener noreferrer" className="link-rule text-ink">
              message us on WhatsApp
            </a>
            .
          </p>
        )}
      </div>
    );
  }

  const err = state.status === "error" ? state.errors : undefined;
  const fieldCls = (k: string) => `field ${err?.[k] ? "field-invalid" : ""}`;

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className={`grid gap-x-8 gap-y-6 ${compact ? "" : "md:grid-cols-2"}`}>
        <Field label="Your name" required error={err?.name}>
          <input name="name" required autoComplete="name" className={fieldCls("name")} />
        </Field>

        <Field label="Email" required error={err?.email}>
          <input
            name="email"
            type="email"
            required
            inputMode="email"
            autoComplete="email"
            className={fieldCls("email")}
          />
        </Field>

        <Field label="Phone or WhatsApp" hint="Optional">
          <input name="phone" type="tel" autoComplete="tel" className="field" />
        </Field>

        <Field label="Travellers" hint="Including you">
          <input
            name="travellers"
            type="number"
            min={1}
            max={40}
            inputMode="numeric"
            defaultValue={2}
            className="field"
          />
        </Field>

        <Field label="Preferred start" hint="Approximate is fine">
          <input name="startDate" type="month" className="field" />
        </Field>

        <Field label="Time available" hint="e.g. about two weeks">
          <input name="duration" className="field" />
        </Field>

        <div className={compact ? "" : "md:col-span-2"}>
          <Field label="Anything we should know" hint="Optional">
            <textarea
              name="message"
              rows={4}
              defaultValue={prefillMessage}
              className="field resize-y"
              placeholder="Fitness, altitude experience, dietary needs, what you are hoping for…"
            />
          </Field>
        </div>
      </div>

      {/* Honeypot */}
      <div aria-hidden className="absolute h-0 w-0 overflow-hidden">
        <label>
          Do not fill this in
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {journeyName && (
        <p className="mt-8 flex flex-wrap items-baseline gap-x-3 rule-t pt-5 text-small text-ink-soft">
          <span className="label-slim">Enquiring about</span>
          <span className="text-ink">{journeyName}</span>
        </p>
      )}

      {state.status === "error" && (
        <p role="alert" className="mt-6 border-l-2 border-[var(--color-terracotta)] pl-4 text-small leading-relaxed text-ink">
          {state.message}
          {(wa || mail || tel) && (
            <>
              {" "}
              You can reach us directly
              {wa && (
                <>
                  {" "}
                  on{" "}
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="link-rule">
                    WhatsApp
                  </a>
                </>
              )}
              {mail && (
                <>
                  {" "}
                  or by{" "}
                  <a href={mail} className="link-rule">
                    email
                  </a>
                </>
              )}
              .
            </>
          )}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button type="submit" className="btn" disabled={state.status === "sending"}>
          {state.status === "sending" ? "Sending…" : "Send enquiry"}
        </button>
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className="link-rule">
            <span className="label">Or WhatsApp us</span>
          </a>
        )}
      </div>

      <p className="mt-5 max-w-lg text-micro leading-relaxed text-ink-faint">
        We use what you send here to answer your enquiry and nothing else. No mailing list, no
        third parties.
        {!confirmed(company.email) && process.env.NODE_ENV !== "production" && (
          <>
            {" "}
            <span className="text-terracotta">
              Dev note: set INQUIRY_WEBHOOK_URL or RESEND_API_KEY + INQUIRY_TO + INQUIRY_FROM, and
              fill in company.ts, before launch.
            </span>
          </>
        )}
      </p>
    </form>
  );
}

function Field({
  label,
  hint,
  required,
  error,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3">
        <span className="label-slim text-ink">
          {label}
          {required && <span className="ml-1 text-gold-deep">*</span>}
        </span>
        {hint && <span className="text-micro text-ink-faint">{hint}</span>}
      </span>
      <span className="mt-1.5 block">{children}</span>
      {error && <span className="mt-1.5 block text-micro text-terracotta">{error}</span>}
    </label>
  );
}
