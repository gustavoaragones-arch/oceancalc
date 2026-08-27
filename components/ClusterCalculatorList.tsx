import Link from "next/link";
import { getCalculatorBySlug } from "@/lib/contentLoader";

interface ClusterCalculatorListProps {
  slugs: string[];
}

/**
 * Renders the calculator selection for a cluster authority page: canonical
 * title, existing description, and a "Use calculator" link — using the same
 * card convention already established by app/tools/page.tsx's ToolCardList.
 * Slugs are resolved against the canonical calculator data so labels always
 * match each calculator's real title rather than a slug-derived guess.
 */
export function ClusterCalculatorList({ slugs }: ClusterCalculatorListProps) {
  const tools = slugs
    .map((slug) => getCalculatorBySlug(slug))
    .filter((tool): tool is NonNullable<typeof tool> => tool !== null);

  if (tools.length === 0) return null;

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
      {tools.map((tool) => (
        <li key={tool.slug}>
          <Link href={`/tools/${tool.slug}/`} className="card block group h-full">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
              {tool.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-2 leading-relaxed">
              {tool.description}
            </p>
            <span className="inline-block mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform duration-200">
              Use calculator →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
