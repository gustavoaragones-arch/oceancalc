import Link from "next/link";
import { getPriorityCalculators } from "@/lib/priorityPages";

/**
 * Compact priority-tool links for category / tools hub pages (6.4.6).
 */
export function PriorityCalculatorsStrip() {
  const tools = getPriorityCalculators();
  if (tools.length === 0) return null;

  return (
    <section
      className="card mb-10"
      aria-labelledby="priority-calculators-strip-heading"
    >
      <h2
        id="priority-calculators-strip-heading"
        className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3"
      >
        Popular calculators
      </h2>
      <ul className="flex flex-wrap gap-x-4 gap-y-2 list-none p-0 m-0">
        {tools.map((tool) => (
          <li key={tool.slug}>
            <Link
              href={`/tools/${tool.slug}/`}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              {tool.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
