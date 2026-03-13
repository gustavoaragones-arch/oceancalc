import Link from "next/link";
import { getCalculators } from "@/lib/contentLoader";

export const metadata = {
  title: "Maritime Calculators | OceanCalc",
  description:
    "Free nautical calculators: nautical mile converter, knots speed, distance to horizon, sailing time, great circle distance, anchor scope, Beaufort scale, apparent wind, and more.",
  alternates: { canonical: "https://oceancalc.com/tools/" },
  openGraph: {
    title: "Maritime Calculators | OceanCalc",
    description:
      "Free nautical calculators for sailors and mariners. Convert units, plan passages, and calculate anchor scope, wind, and distance.",
    url: "https://oceancalc.com/tools/",
  },
};

export default function ToolsHubPage() {
  const calculators = getCalculators();
  return (
    <div className="container-wide py-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Maritime Calculators
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          Free online tools for nautical and sailing calculations. Convert distances and speeds, plan passages, and reference wind and anchoring.
        </p>
      </header>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0">
        {calculators.map((tool) => (
          <li key={tool.slug}>
            <Link
              href={`/tools/${tool.slug}/`}
              className="card block hover:border-sky-500 dark:hover:border-sky-500 transition-colors group h-full"
            >
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {tool.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                {tool.description}
              </p>
              <span className="inline-block mt-3 text-sm font-medium text-sky-600 dark:text-sky-400">
                Use calculator →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
