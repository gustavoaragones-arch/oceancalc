import Link from "next/link";
import { getPriorityCalculators } from "@/lib/priorityPages";

/**
 * Homepage “Most Used Maritime Calculators” (6.4.6) — same priority set as global grid.
 */
export function MostUsedMaritimeCalculators() {
  const tools = getPriorityCalculators();
  if (tools.length === 0) return null;

  return (
    <section
      className="mt-14 sm:mt-16"
      aria-labelledby="most-used-calculators-heading"
    >
      <h2
        id="most-used-calculators-heading"
        className="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-6"
      >
        Most Used Maritime Calculators
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 list-none p-0 m-0">
        {tools.map((tool) => (
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
        — the full index appears above the site footer on every page.
      </p>
    </section>
  );
}
