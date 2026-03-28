import Link from "next/link";
import {
  getRelatedCalculatorSlugsInCluster,
  getCalculatorBySlug,
} from "@/lib/contentLoader";

interface RelatedCalculatorsProps {
  currentSlug: string;
}

/**
 * Other calculators in the same cluster (circular ring). Server-rendered links.
 */
export function RelatedCalculators({ currentSlug }: RelatedCalculatorsProps) {
  const { slugs } = getRelatedCalculatorSlugsInCluster(currentSlug, 4);
  if (slugs.length === 0) return null;

  const tools = slugs
    .map((slug) => {
      const calc = getCalculatorBySlug(slug);
      return calc ? { slug: calc.slug, title: calc.title } : null;
    })
    .filter((t): t is { slug: string; title: string } => t !== null);

  if (tools.length === 0) return null;

  return (
    <section
      className="card mt-8"
      aria-labelledby="related-calculators-heading"
    >
      <h2 id="related-calculators-heading" className="heading-section">
        Related Maritime Calculators
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 list-none p-0 m-0">
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
