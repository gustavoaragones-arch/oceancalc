import Link from "next/link";
import { getCalculators } from "@/lib/contentLoader";
import { generateMetadata as buildSeoMetadata } from "@/lib/seo";
import { getBuildLastModified } from "@/lib/indexing";

export const metadata = buildSeoMetadata({
  title: "Maritime Calculators",
  description:
    "Free nautical calculators: nautical mile converter, knots speed, distance to horizon, sailing time, great circle distance, anchor scope, Beaufort scale, apparent wind, and more.",
  path: "/tools/",
  lastModified: getBuildLastModified(),
});

export default function ToolsHubPage() {
  const calculators = getCalculators();
  return (
    <div className="container-wide py-8">
      <header className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-3 text-balance">
          Maritime Calculators
        </h1>
        <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl leading-relaxed text-balance">
          Free online tools for nautical and sailing calculations. Convert distances and speeds, plan passages, and reference wind and anchoring.
        </p>
      </header>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
        {calculators.map((tool) => (
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
    </div>
  );
}
