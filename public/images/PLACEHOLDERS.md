# Placeholder imagery

Every file listed here is a **generated illustration**, not a photograph and
not stock. They are drawn by `src/lib/scene.ts` in the Logosa palette so the
site is complete and coherent before a photographer is commissioned.

## Replacing them

Drop a real image into the same folder and point the `image` field in the
corresponding data file at it. Nothing else needs to change — the layout,
cropping and alt text already exist.

| Placeholder | Replace with | Subject the photograph should show |
| --- | --- | --- |
| `/images/stories/walk-high-sleep-low.svg` | `walk-high-sleep-low.webp` | A trekker on the moraine below Lobuche with the Khumbu glacier and peaks beyond |
| `/images/stories/kali-gandaki.svg` | `kali-gandaki.webp` | The Kali Gandaki riverbed running between eroded cliffs beneath high snow peaks |
| `/images/stories/newar-window.svg` | `newar-window.webp` | A carved wooden lattice window in a Newar courtyard, deep-set in a brick facade |

## Already replaced

These carry real photography and are no longer generated. Re-pointing the data
file back at an `.svg` path brings the plate back on the next run.

| File | Subject |
| --- | --- |
| `/images/destinations/kathmandu-valley.webp` | The gilded spire and painted eyes of Swayambhunath stupa above the valley, strung with prayer flags |
| `/images/destinations/pokhara.webp` | Painted wooden boats moored on the still water of Phewa Lake at Pokhara, hills rising behind |
| `/images/destinations/everest-khumbu.webp` | The Everest massif seen from the air, the summit pyramid standing clear above Nuptse and the Khumbu valley |
| `/images/destinations/annapurna.webp` | A line of trekkers on the snow approach to Annapurna Base Camp, snow faces of the sanctuary rising ahead |
| `/images/destinations/upper-mustang.webp` | Chortens and whitewashed walls beneath fluted ochre cliffs in Upper Mustang, snow peaks behind |
| `/images/destinations/langtang.webp` | A walker crossing a prayer-flagged suspension bridge in the Langtang valley, glaciated peaks at its head |
| `/images/destinations/chitwan.webp` | An elephant crossing a river channel through mist on the Chitwan floodplain, grassland on both banks |
| `/images/destinations/lumbini.webp` | The Maya Devi Temple and Ashokan pillar at Lumbini, reflected in the sacred pond at dawn |

## Specification for real photography

- **Format** — WebP or AVIF, sRGB. Supply the original alongside.
- **Size** — 2400px on the long edge is enough; the site never serves larger.
- **Aspect** — destinations are cropped to 4:5, 3:2 and 16:9 in different
  places, so leave headroom. Do not supply a tightly cropped subject.
- **Direction** — the identity reads as dawn light: low sun, long shadows,
  cool ranges against warm ground. Midday photographs will not sit next to the
  illustration language.
- **Rights** — Logosa must hold the licence for commercial use. Note the
  photographer's credit in the data file where attribution is required.

Regenerate the placeholders at any time with `npm run build:images`.
