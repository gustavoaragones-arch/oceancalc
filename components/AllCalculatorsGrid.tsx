import Link from "next/link";
import { getCalculatorsWithPriorityFirst } from "@/lib/priorityPages";

/**
 * Universal crawl grid: lists every calculator from `data/calculators.json`
 * plus `data/calculators-phase5.json` when present (via `getCalculators`).
 * Priority tools render first under “Popular Calculators” (6.4.6).
 * Server-rendered plain `<a>` links — no lazy loading.
 */
export function AllCalculatorsGrid() {
  const { popular, rest } = getCalculatorsWithPriorityFirst();
  if (popular.length === 0 && rest.length === 0) return null;

  return (
    <section
      className="card"
      aria-labelledby="all-calculators-heading"
    >
      {popular.length > 0 ? (
        <>
          <h2
            id="popular-calculators-heading"
            className="heading-section"
          >
            Popular Calculators
          </h2>
          <ul
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0 m-0 mb-8"
            aria-labelledby="popular-calculators-heading"
          >
            {popular.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/tools/${tool.slug}/`}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium transition-colors duration-200"
                >
                  {tool.title}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <h2 id="all-calculators-heading" className="heading-section">
        All Maritime Calculators
      </h2>
      <ul
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0 m-0"
        aria-labelledby="all-calculators-heading"
      >
        {rest.map((tool) => (
          <li key={tool.slug}>
            <Link
              href={`/tools/${tool.slug}/`}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm transition-colors duration-200"
            >
              {tool.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
