import Link from "next/link";
import { getCalculators } from "@/lib/contentLoader";

/** Diverse slugs for homepage crawl hub (must exist in merged calculator list). */
const FEATURED_SLUGS = [
  "nautical-mile-converter",
  "knots-speed-converter",
  "distance-to-horizon-calculator",
  "great-circle-distance-calculator",
  "anchor-scope-calculator",
  "sailing-time-calculator",
  "beaufort-scale-calculator",
  "apparent-wind-calculator",
] as const;

/**
 * Homepage-only featured links; full index lives in `AllCalculatorsGrid` (root layout).
 */
export function FeaturedCalculators() {
  const all = getCalculators();
  const bySlug = new Map(all.map((c) => [c.slug, c]));
  const featured = FEATURED_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (c): c is NonNullable<typeof c> => c != null
  );
  if (featured.length === 0) return null;

  return (
    <section
      className="mt-14 sm:mt-16"
      aria-labelledby="featured-calculators-heading"
    >
      <h2
        id="featured-calculators-heading"
        className="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-6"
      >
        Featured calculators
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 list-none p-0 m-0">
        {featured.map((tool) => (
          <li key={tool.slug}>
            <Link
              href={`/tools/${tool.slug}/`}
              className="card block h-full group"
            >
              <span className="text-base font-medium text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {tool.title}
              </span>
              <span className="block mt-2 text-sm text-gray-600 dark:text-slate-400 leading-snug line-clamp-2">
                {tool.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-gray-600 dark:text-slate-400">
        <Link
          href="/tools/"
          className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
        >
          Browse all maritime calculators
        </Link>{" "}
        — the full list appears above the site footer on every page.
      </p>
    </section>
  );
}
