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
| `/images/destinations/kathmandu-valley.svg` | `kathmandu-valley.webp` | Tiered Newar pagoda temples rising above the rooftops of the Kathmandu valley, with hills beyond |
| `/images/destinations/pokhara.svg` | `pokhara.webp` | The Annapurna range reflected in the still surface of Phewa Lake at Pokhara in early morning light |
| `/images/destinations/everest-khumbu.svg` | `everest-khumbu.webp` | The Everest massif above the Khumbu valley, with prayer flags on a ridge in the foreground |
| `/images/destinations/annapurna.svg` | `annapurna.webp` | The Annapurna massif seen across terraced foothills, snow faces lit by low morning sun |
| `/images/destinations/upper-mustang.svg` | `upper-mustang.webp` | Eroded ochre cliffs and a whitewashed Tibetan settlement on the high desert plateau of Upper Mustang |
| `/images/destinations/langtang.svg` | `langtang.webp` | The Langtang valley with glaciated peaks at its head and stone-walled fields on the valley floor |
| `/images/destinations/chitwan.svg` | `chitwan.webp` | Elephant grass and sal forest on the Chitwan floodplain with river channels catching the light |
| `/images/destinations/lumbini.svg` | `lumbini.webp` | The Maya Devi Temple and Ashokan pillar at Lumbini, reflected in the sacred pond at dawn |
| `/images/stories/walk-high-sleep-low.svg` | `walk-high-sleep-low.webp` | A trekker on the moraine below Lobuche with the Khumbu glacier and peaks beyond |
| `/images/stories/kali-gandaki.svg` | `kali-gandaki.webp` | The Kali Gandaki riverbed running between eroded cliffs beneath high snow peaks |
| `/images/stories/newar-window.svg` | `newar-window.webp` | A carved wooden lattice window in a Newar courtyard, deep-set in a brick facade |

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
