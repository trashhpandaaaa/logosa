# Before this site goes live

Everything below is a real blocker or a decision Logosa has to make. Nothing on
the site invents a fact about the company, so the gaps are visible rather than
papered over — an unsupplied phone number renders as nothing at all, not as a
plausible-looking placeholder somebody might try to call.

---

## 1. Licensing — one blocker

**`public/3d assets/stone_garuda_-_free_low-res_version.glb` is NOT used, and must not be.**

It is licensed **CC BY-NC 4.0**. The *NonCommercial* term forbids use on a
commercial travel agency's website. Building it into the site would put Logosa
in breach. To use it, either licence it directly from the author
([Dystopia on Sketchfab](https://sketchfab.com/Dystopia)) or replace it with a
commercially licensed Garuda.

The two models that **are** used are **CC BY 4.0**, which permits commercial use
**but requires visible attribution**:

| Model | Author | Used for |
|---|---|---|
| Mount Everest 3D Model | alitural | The opening sequence |
| Kala Bhairava w/ 2 LOD — Nepal Heritage | Dystopia | The Craft chapter |

Attribution is rendered in the footer, on `/about`, and in the caption beneath
the Kala Bhairava. **Removing it breaks the licence.** It lives in
`src/data/credits.ts`.

---

## 2. Company details — currently hidden from the public site

Fill in `src/data/company.ts`. Every field set to `TO_CONFIRM` is **hidden at
runtime** rather than rendered, so the site is honest but incomplete until these
are supplied:

- `phone`, `whatsapp`, `email` — without these there is no contact route but the form
- `address.street`
- `registrationNo`, `tourismLicenceNo`, `panNo`
- `memberships` — NATTA, TAAN, NMA, etc. **Only list real ones.**
- `founded`, `hours`
- `social` — Facebook, Instagram, TripAdvisor, YouTube

Also set `NEXT_PUBLIC_SITE_URL` to the real domain (see `.env.example`),
otherwise canonical URLs, the sitemap and Open Graph tags point at a guess.

---

## 3. Enquiries currently go nowhere

`POST /api/inquiry` formats a clean summary and returns
`{ ok: true, delivered: false, reason: "not-configured" }`. It does **not**
silently pretend to deliver, and the form tells the visitor so and offers
WhatsApp/email instead.

To make it deliver, set **one** of these in `.env`:

- `INQUIRY_WEBHOOK_URL` — posts JSON (Zapier, Make, a Google Sheet endpoint, a CRM)
- `RESEND_API_KEY` + `INQUIRY_TO_EMAIL` — sends email via Resend

Until then, **enquiries are lost.** This is the single most important item here.

---

## 4. Photography — everything is a placeholder

All destination and story images are **generated illustrations**, not
photographs. They are art-directed and on-brand, but they are placeholders. See
`public/images/PLACEHOLDERS.md`.

To replace: drop a real photo at the same path with the same name (`.webp` or
`.avif` preferred) and update `image` / `imageAlt` in `src/data/destinations.ts`
and `src/data/stories.ts`. Alt text must describe the *actual* photograph.

Once real photos are in, you can drop `dangerouslyAllowSVG` from
`next.config.ts` — it exists only because the placeholders are SVG.

---

## 5. Content that needs Logosa's sign-off

**Journeys** (`src/data/journeys.ts`) — ten real, established Nepali routes with
accurate elevations, walking times and permits. They ship `status: "published"`
because each is an accurate description of a real route — **not** because Logosa
has confirmed they operate it. Set `status: "draft"` on anything you do not run
and it disappears from the production site.

- Every journey has `price: null`. The site says "quoted per group" and asks for
  an enquiry. If you want prices shown, the type must change deliberately.
- `included` / `excluded` are **empty on purpose** — those are commercial
  promises nobody has agreed. The page asks travellers to request them in
  writing instead.

**Stories** (`src/data/stories.ts`) — three researched, factually accurate
editorial drafts, attributed to "Logosa", not to an invented author. Read,
amend and sign off each one, or replace with pieces by your own guides.

**Travel guide** (`src/data/travel-info.ts`) — every entry has a `lastVerified`
date, currently `null`, and the page says in the open that unverified items
should be checked against the linked source. Verify each against the Department
of Immigration / Nepal Tourism Board and set the date.

---

## 6. What the site deliberately does not have

No testimonials, no star ratings, no traveller counts, no awards, no "trusted by
X" logos, no fake live availability. None were supplied, so none were invented.
The review component is not built because building an empty one invites filling
it with fiction. When you have real reviews, connect them then.

---

## 7. Optional: the Mapbox journey

Without a token the map section renders the **drawn atlas** — real Natural Earth
boundary geometry, true coordinates, the same scroll narrative. It is a
designed fallback, not a broken state, and it is genuinely good.

To enable the 3D terrain map, set `NEXT_PUBLIC_MAPBOX_TOKEN`. Restrict the token
to your domain in the Mapbox dashboard — it ships to the browser.

---

## Commands

```bash
npm run dev          # development
npm run build        # production build
npm start            # serve the build

node scripts/prepare-brand.mjs    # re-derive logo assets from logo.jpeg
node scripts/build-textures.mjs   # regenerate the Dhaka pattern SVGs
node scripts/build-models.mjs     # re-compress the GLB models
node scripts/shoot.mjs / --at 0,0.2,0.4   # screenshot pages for review
```

## Where things live

```
src/data/        all content and copy — edit here, not in components
src/lib/         dhaka pattern, terrain generator, mapbox, motion
src/components/  UI, grouped by section
public/models/   compressed GLB (source in "public/3d assets/")
public/textures/ generated Dhaka pattern
public/brand/    logo derivatives — regenerate, never hand-edit
```

The logo is the source of the whole design system. `logo.jpeg` is the master;
everything in `public/brand/` is derived from it by script and is safe to
delete and rebuild. The artwork itself is never recoloured or redrawn — where
it needs to sit on a dark surface it is placed on a paper plate instead.
