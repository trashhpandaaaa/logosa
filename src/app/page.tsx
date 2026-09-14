import Hero from "@/components/hero/Hero";
import CraftChapter from "@/components/journey/CraftChapter";
import Chapter from "@/components/journey/Chapter";
import Transect from "@/components/journey/Transect";
import MapJourney from "@/components/map/MapJourney";
import ExperienceTeaser from "@/components/experiences/ExperienceTeaser";
import JourneyIndex from "@/components/packages/JourneyIndex";
import StoryRail from "@/components/journal/StoryRail";
import EnquiryCta from "@/components/contact/EnquiryCta";
import { DhakaBand } from "@/components/common/Dhaka";
import { journeyOrder } from "@/data/destinations";
import { publishedJourneys } from "@/data/journeys";
import { publishedStories } from "@/data/stories";
import { SITE_URL, company } from "@/data/company";

/**
 * THE JOURNEY
 *
 * The homepage is one continuous movement, in the order the brief sets out:
 *
 *   illustration → craft → the country in section → the map →
 *   the chapters, region by region → what kind of traveller you are →
 *   the routes themselves → longer reading → enquire
 *
 * Each chapter changes surface — paper, ink, paper — so the page reads as a
 * publication with sections rather than as a scroll of stacked blocks.
 */
export default function Home() {
  // The first four regions carry the narrative; the rest are reachable from
  // the index. A homepage that lists everything has decided nothing.
  const chapters = journeyOrder.slice(0, 4);
  const featured = publishedJourneys.slice(0, 5);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: company.legalName,
    alternateName: company.shortName,
    url: SITE_URL,
    slogan: company.tagline,
    areaServed: { "@type": "Country", name: "Nepal" },
    address: {
      "@type": "PostalAddress",
      addressLocality: company.address.city,
      addressCountry: "NP",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero />
      <CraftChapter />

      {/* The country as a cross-section: 60 m to 8,848.86 m */}
      <Transect />

      {/* Level 4 of the motion system — scroll flies the map */}
      <MapJourney />

      {/* Region by region */}
      <section aria-label="The journey, region by region" className="relative bg-paper paper-grain">
        <DhakaBand />
        {chapters.map((d, i) => (
          <Chapter key={d.slug} destination={d} index={i} />
        ))}
      </section>

      <ExperienceTeaser />

      <JourneyIndex
        journeys={featured}
        kicker="Journeys"
        title="The routes we walk."
        intro="Every one of these is a real, established route, described with real elevations and real walking times. What none of them carries is a price — Nepal is quoted per group, and we would rather send you a number that applies to your trip."
        moreHref="/journeys"
      />

      <StoryRail stories={publishedStories.slice(0, 3)} />

      <EnquiryCta />
    </>
  );
}
