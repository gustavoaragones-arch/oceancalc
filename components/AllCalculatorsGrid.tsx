import Link from "next/link";
import { getCalculators } from "@/lib/contentLoader";

/**
 * Universal Tool Grid: site-wide grid of links to all calculators.
 * Placed on every knowledge (article) page to maximize crawl paths—
 * Googlebot can reach every tool page in 1 click from any article.
 */
export function AllCalculatorsGrid() {
  const tools = getCalculators();
  if (tools.length === 0) return null;

  return (
    <section
      className="card mt-8"
      aria-labelledby="all-calculators-heading"
    >
      <h2 id="all-calculators-heading" className="heading-section">
        Maritime Calculators
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 list-none p-0 m-0">
        {tools.map((tool) => (
          <li key={tool.slug}>
            <Link
              href={`/tools/${tool.slug}/`}
              className="text-sky-600 dark:text-sky-400 hover:underline text-sm"
            >
              {tool.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
