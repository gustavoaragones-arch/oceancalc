import Link from "next/link";
import clusters from "@/data/calculatorClusters.json";
import { generateMetadata as buildSeoMetadata } from "@/lib/seo";

export const metadata = buildSeoMetadata({
  title: "Wind and Wave Calculators",
  description:
    "Wind and wave tools for sea state, wave behavior, and environmental forces affecting vessels and sailing performance.",
  path: "/wind-wave-calculators/",
});

export default function Page() {
  const tools = clusters["wind-waves"] ?? [];

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-slate-100">
        Wind and Wave Calculators
      </h1>

      <p className="text-sm text-gray-600 dark:text-slate-400 mb-6 leading-relaxed">
        Wind and wave calculations estimate sea conditions, wave behavior, and environmental forces affecting vessels.
        These tools support safe navigation and sailing performance analysis.
      </p>

      <ul className="grid md:grid-cols-2 gap-2 text-sm list-none p-0 m-0 text-gray-700 dark:text-slate-300">
        {tools.map((slug) => (
          <li key={slug}>
            <Link
              href={`/tools/${slug}/`}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {slug.replaceAll("-", " ")}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
