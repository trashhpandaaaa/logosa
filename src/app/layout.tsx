import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Archivo, Newsreader, Tiro_Devanagari_Hindi } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/common/SmoothScroll";
import Nav from "@/components/navigation/Nav";
import Footer from "@/components/footer/Footer";
import { SITE_URL, company } from "@/data/company";

/**
 * The type system is taken from the logo: a high-contrast Didone wordmark over
 * a letterspaced grotesque subline. Bodoni Moda carries the display voice,
 * Archivo the interface, Newsreader the long-form reading, and Tiro Devanagari
 * the Nepali annotation. Four families is a lot; each has one job and none of
 * them overlaps with another.
 */
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
  axes: ["opsz"],
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
  axes: ["opsz"],
  preload: false, // long-form only
});

const tiro = Tiro_Devanagari_Hindi({
  subsets: ["devanagari"],
  variable: "--font-tiro",
  weight: "400",
  display: "swap",
  preload: false, // annotation only
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Logosa — Travel through Nepal",
    template: "%s · Logosa",
  },
  description:
    "Trekking, culture, wildlife and pilgrimage journeys across Nepal, arranged by Logosa Tours and Travels — a registered travel agency based in Kathmandu.",
  applicationName: "Logosa",
  keywords: [
    "Nepal travel",
    "Nepal trekking",
    "Everest Base Camp trek",
    "Annapurna trek",
    "Kathmandu tours",
    "Chitwan safari",
    "Lumbini pilgrimage",
    "Upper Mustang",
    "Nepal travel agency",
  ],
  authors: [{ name: company.legalName }],
  openGraph: {
    type: "website",
    siteName: "Logosa Tours and Travels",
    locale: "en_GB",
    url: SITE_URL,
    title: "Logosa — Travel through Nepal",
    description:
      "Trekking, culture, wildlife and pilgrimage journeys across Nepal, arranged from Kathmandu.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Logosa — Travel through Nepal",
    description:
      "Trekking, culture, wildlife and pilgrimage journeys across Nepal, arranged from Kathmandu.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F4EC" },
    { media: "(prefers-color-scheme: dark)", color: "#00212F" },
  ],
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-GB"
      className={`${bodoni.variable} ${archivo.variable} ${newsreader.variable} ${tiro.variable}`}
    >
      <body>
        <a href="#main" className="sr-only">
          Skip to content
        </a>
        <SmoothScroll>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
