import Link from "next/link";
import { getCalculators } from "@/lib/contentLoader";

/**
 * Universal crawl grid: lists every calculator from `data/calculators.json`
 * plus `data/calculators-phase5.json` when present (via `getCalculators`).
 * Server-rendered plain `<a>` links — no lazy loading.
 */
export function AllCalculatorsGrid() {
  const tools = getCalculators();
  if (tools.length === 0) return null;

  return (
    <section
      className="card"
      aria-labelledby="all-calculators-heading"
    >
      <h2 id="all-calculators-heading" className="heading-section">
        All Maritime Calculators
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0 m-0">
        {tools.map((tool) => (
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
