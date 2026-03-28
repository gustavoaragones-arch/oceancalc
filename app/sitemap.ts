import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllCalculators } from "@/lib/contentLoader";
import { toolVariants } from "@/lib/toolVariants";
import { getBuildLastModified, getContentSitemapSlice } from "@/lib/indexing";

/** Required for `output: "export"` — sitemap is emitted as static XML at build time. */
export const dynamic = "force-static";

/**
 * Dynamic sitemap: core hubs + every calculator + every variant path.
 * Base URL follows `NEXT_PUBLIC_SITE_URL` / `config/site.ts` (default https://oceancalc.com).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = getBuildLastModified();
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const changeFrequency = "weekly" as const;

  const corePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency,
      priority: 1,
    },
    {
      url: `${baseUrl}/tools/`,
      lastModified,
      changeFrequency,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/navigation/`,
      lastModified,
      changeFrequency,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/knots/`,
      lastModified,
      changeFrequency,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/wind-waves/`,
      lastModified,
      changeFrequency,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/sailing/`,
      lastModified,
      changeFrequency,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/maritime-measurements/`,
      lastModified,
      changeFrequency,
      priority: 0.85,
    },
  ];

  const calculators = getAllCalculators();
  const toolUrls = calculators.flatMap((calc) => {
    const main: MetadataRoute.Sitemap[number] = {
      url: `${baseUrl}/tools/${calc.slug}/`,
      lastModified,
      changeFrequency,
      priority: 0.9,
    };
    const variants = toolVariants.map((variant) => ({
      url: `${baseUrl}/tools/${calc.slug}/${variant}/`,
      lastModified,
      changeFrequency,
      priority: 0.7,
    }));
    return [main, ...variants];
  });

  return [...corePages, ...toolUrls, ...getContentSitemapSlice(lastModified)];
}
