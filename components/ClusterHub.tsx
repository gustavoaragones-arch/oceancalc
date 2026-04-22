import Link from "next/link";
import clusters from "@/data/calculatorClusters.json";

type ClusterMap = Record<string, string[]>;

const data = clusters as ClusterMap;

function slugToLabel(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\s+calculator\s*$/i, "")
    .trim();
}

/**
 * Phase 6.8 — Topical authority: expose `calculatorClusters.json` on the homepage.
 */
export default function ClusterHub() {
  const nav = data.navigation ?? [];
  const measurements = data["maritime-measurements"] ?? [];
  const windWaves = data["wind-waves"] ?? [];
  const sailing = data["sailing-performance"] ?? [];

  return (
    <section className="max-w-5xl mx-auto px-4 mt-12">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-slate-100">
        Navigation Calculation Categories
      </h2>

      <p className="text-sm text-gray-600 dark:text-slate-400 mb-4 leading-relaxed">
        These calculation groups reflect core maritime navigation domains, including distance computation, bearing calculation, vessel performance, and environmental analysis.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Link
            href="/navigation-calculations/"
            className="font-medium mb-2 inline-block text-gray-900 dark:text-slate-100 hover:underline"
          >
            Navigation Calculations
          </Link>
          <ul className="text-sm space-y-1 list-none p-0 m-0 text-gray-700 dark:text-slate-300 mt-2">
            {nav.slice(0, 6).map((slug) => (
              <li key={slug}>
                <Link
                  href={`/tools/${slug}/`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {slugToLabel(slug)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Link
            href="/distance-measurement-calculators/"
            className="font-medium mb-2 inline-block text-gray-900 dark:text-slate-100 hover:underline"
          >
            Distance &amp; Measurement
          </Link>
          <ul className="text-sm space-y-1 list-none p-0 m-0 text-gray-700 dark:text-slate-300 mt-2">
            {measurements.slice(0, 6).map((slug) => (
              <li key={slug}>
                <Link
                  href={`/tools/${slug}/`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {slugToLabel(slug)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Link
            href="/wind-wave-calculators/"
            className="font-medium mb-2 inline-block text-gray-900 dark:text-slate-100 hover:underline"
          >
            Wind &amp; Wave Analysis
          </Link>
          <ul className="text-sm space-y-1 list-none p-0 m-0 text-gray-700 dark:text-slate-300 mt-2">
            {windWaves.slice(0, 6).map((slug) => (
              <li key={slug}>
                <Link
                  href={`/tools/${slug}/`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {slugToLabel(slug)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Link
            href="/sailing-performance-calculators/"
            className="font-medium mb-2 inline-block text-gray-900 dark:text-slate-100 hover:underline"
          >
            Sailing Performance
          </Link>
          <ul className="text-sm space-y-1 list-none p-0 m-0 text-gray-700 dark:text-slate-300 mt-2">
            {sailing.slice(0, 6).map((slug) => (
              <li key={slug}>
                <Link
                  href={`/tools/${slug}/`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {slugToLabel(slug)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
