import type { MetadataRoute } from "next";
import { getAllCalculators } from "@/lib/contentLoader";
import { toolVariants } from "@/lib/toolVariants";
import { getContentSitemapSlice } from "@/lib/indexing";

/**
 * Static export: sitemap is generated at build/deploy (`out/sitemap.xml`).
 * Live updates when calculators or content JSON change—rebuild to refresh.
 */
export const dynamic = "force-static";

/** Production canonical; override with NEXT_PUBLIC_SITE_URL for staging sitemaps. */
const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://oceancalc.com"
).replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const changeFrequency = "weekly" as const;

  const corePages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/tools/`,
      lastModified: new Date(),
      changeFrequency,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/navigation/`,
      lastModified: new Date(),
      changeFrequency,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/knots/`,
      lastModified: new Date(),
      changeFrequency,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/wind-waves/`,
      lastModified: new Date(),
      changeFrequency,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/sailing/`,
      lastModified: new Date(),
      changeFrequency,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/maritime-measurements/`,
      lastModified: new Date(),
      changeFrequency,
      priority: 0.8,
    },
  ];

  const calculators = getAllCalculators();
  const calculatorPages = calculators.flatMap((calc) => {
    const mainPage: MetadataRoute.Sitemap[number] = {
      url: `${BASE_URL}/tools/${calc.slug}/`,
      lastModified: new Date(),
      changeFrequency,
      priority: 0.9,
    };
    const variantPages = toolVariants.map((variant) => ({
      url: `${BASE_URL}/tools/${calc.slug}/${variant}/`,
      lastModified: new Date(),
      changeFrequency,
      priority: 0.7,
    }));
    return [mainPage, ...variantPages];
  });

  return [
    ...corePages,
    ...calculatorPages,
    ...getContentSitemapSlice(BASE_URL),
  ];
}
