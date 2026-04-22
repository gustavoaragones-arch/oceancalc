import Link from "next/link";
import type { CalculatorEntry } from "@/lib/types";
import { getCalculatorsWithPriorityFirst } from "@/lib/priorityPages";
import { generateMetadata as buildSeoMetadata } from "@/lib/seo";
import { getBuildLastModified } from "@/lib/indexing";

export const metadata = buildSeoMetadata({
  title: "Maritime Calculators",
  description:
    "Free nautical calculators: nautical mile converter, knots speed, distance to horizon, sailing time, great circle distance, anchor scope, Beaufort scale, apparent wind, and more.",
  path: "/tools/",
  lastModified: getBuildLastModified(),
});

function ToolCardList({ tools }: { tools: CalculatorEntry[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
      {tools.map((tool) => (
        <li key={tool.slug}>
          <Link
            href={`/tools/${tool.slug}/`}
            className="card block group h-full"
          >
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

export default function ToolsHubPage() {
  const { popular, rest } = getCalculatorsWithPriorityFirst();
  return (
    <>
      <section className="max-w-5xl mx-auto px-4 mt-6">
        <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-slate-100">
          Maritime Calculators Index
        </h2>

        <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
          Browse all maritime calculation tools including navigation, distance, speed, and sailing performance formulas.
        </p>

        <div className="text-sm mb-4 space-x-4">
          <Link
            href="/navigation-calculations/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Navigation
          </Link>
          <Link
            href="/distance-measurement-calculators/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Distance
          </Link>
          <Link
            href="/wind-wave-calculators/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Wind &amp; Waves
          </Link>
          <Link
            href="/sailing-performance-calculators/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Sailing Performance
          </Link>
        </div>
      </section>

    <div className="container-wide py-8">
      <header className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-3 text-balance">
          Maritime Calculators
        </h1>
        <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl leading-relaxed text-balance">
          Free online tools for nautical and sailing calculations. Convert distances and speeds, plan passages, and reference wind and anchoring.
        </p>
      </header>

      {popular.length > 0 ? (
        <section className="mb-12" aria-labelledby="tools-popular-heading">
          <h2
            id="tools-popular-heading"
            className="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-6"
          >
            Popular calculators
          </h2>
          <ToolCardList tools={popular} />
        </section>
      ) : null}

      <section aria-labelledby="tools-all-heading">
        <h2
          id="tools-all-heading"
          className="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-6"
        >
          All maritime calculators
        </h2>
        <ToolCardList tools={rest} />
      </section>
    </div>
    </>
  );
}
