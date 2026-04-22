import Link from "next/link";
import clusters from "@/data/calculatorClusters.json";
import { generateMetadata as buildSeoMetadata } from "@/lib/seo";

export const metadata = buildSeoMetadata({
  title: "Distance and Measurement Calculators",
  description:
    "Distance and measurement: nautical miles, knots, fathoms, and chart-ready conversions for maritime navigation.",
  path: "/distance-measurement-calculators/",
});

export default function Page() {
  const tools = clusters["maritime-measurements"] ?? [];

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-slate-100">
        Distance and Measurement Calculators
      </h1>

      <p className="text-sm text-gray-600 dark:text-slate-400 mb-6 leading-relaxed">
        Distance and measurement tools convert and calculate nautical units such as nautical miles, knots, and fathoms.
        These calculations are essential for accurate maritime navigation and chart interpretation.
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
