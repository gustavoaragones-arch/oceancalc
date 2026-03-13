import Link from "next/link";
import {
  getRelatedCalculatorSlugsInCluster,
  getCalculatorBySlug,
} from "@/lib/contentLoader";

interface RelatedCalculatorsProps {
  currentSlug: string;
}

/**
 * Shows other calculators in the same cluster (circular ring).
 * Rendered on every tool page below the calculator UI and above FAQ
 * for dense internal linking and crawl discovery.
 */
export function RelatedCalculators({ currentSlug }: RelatedCalculatorsProps) {
  const { slugs, clusterLabel } = getRelatedCalculatorSlugsInCluster(
    currentSlug,
    3
  );
  if (slugs.length === 0 || !clusterLabel) return null;

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
        Related {clusterLabel} Calculators
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
