import Link from "next/link";
import clusters from "@/data/calculatorClusters.json";
import { generateMetadata as buildSeoMetadata } from "@/lib/seo";
import { ClusterCalculatorList } from "@/components/ClusterCalculatorList";

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
        Wind & Wave Calculators
      </h1>

      <p className="text-sm text-gray-600 dark:text-slate-400 mb-6 leading-relaxed">
        Wind and wave calculators for Beaufort force, wind chill, wave height, wave period, wavelength, apparent wind, and related marine conditions. Use these tools to evaluate common wind and wave relationships used in sailing and maritime operations.
      </p>

      <ClusterCalculatorList slugs={tools} />

      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-slate-100">
          Explore Related Calculator Categories
        </h2>
        <ul className="text-sm space-y-1 list-none p-0 m-0">
          <li>
            <Link
              href="/navigation-calculations/"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Navigation Calculations
            </Link>
          </li>
          <li>
            <Link
              href="/distance-measurement-calculators/"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Distance & Measurement Calculators
            </Link>
          </li>
          <li>
            <Link
              href="/sailing-performance-calculators/"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Sailing Performance Calculators
            </Link>
          </li>
        </ul>
      </section>

      <p className="mt-8 text-sm">
        <Link href="/tools/" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
          View All Maritime Calculators
        </Link>
      </p>
    </main>
  );
}
