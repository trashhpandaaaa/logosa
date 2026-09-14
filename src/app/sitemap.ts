import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/company";
import { destinations } from "@/data/destinations";
import { journeys } from "@/data/journeys";
import { stories } from "@/data/stories";

/**
 * Only routes that actually render are listed. Draft journeys and unpublished
 * stories are excluded, because a sitemap that advertises a 404 is worse than
 * one that is short.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const fixed: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/destinations`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/journeys`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/experiences`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/plan`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/stories`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/travel-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
  ];

  const destinationPages: MetadataRoute.Sitemap = destinations.map((d) => ({
    url: `${SITE_URL}/destinations/${d.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const journeyPages: MetadataRoute.Sitemap = journeys
    .filter((j) => j.status === "published")
    .map((j) => ({
      url: `${SITE_URL}/journeys/${j.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    }));

  const storyPages: MetadataRoute.Sitemap = stories
    .filter((s) => s.status === "published")
    .map((s) => ({
      url: `${SITE_URL}/stories/${s.slug}`,
      lastModified: new Date(s.published),
      changeFrequency: "yearly",
      priority: 0.6,
    }));

  return [...fixed, ...destinationPages, ...journeyPages, ...storyPages];
}
