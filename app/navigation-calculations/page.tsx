import Link from "next/link";
import clusters from "@/data/calculatorClusters.json";
import { generateMetadata as buildSeoMetadata } from "@/lib/seo";
import { ClusterCalculatorList } from "@/components/ClusterCalculatorList";

export const metadata = buildSeoMetadata({
  title: "Navigation Calculations",
  description:
    "Navigation calculations: bearing, distance, and route computation for maritime navigation across the Earth’s surface.",
  path: "/navigation-calculations/",
});

export default function Page() {
  const tools = clusters.navigation ?? [];

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-slate-100">
        Navigation Calculations
      </h1>

      <p className="text-sm text-gray-600 dark:text-slate-400 mb-6 leading-relaxed">
        Navigation calculators for course, bearing, distance, position, and related marine navigation calculations. Use these tools to work with common navigation measurements and planning relationships.
      </p>

      <p className="text-sm text-gray-600 dark:text-slate-400 mb-6">
        Looking for navigation guides and articles instead?{" "}
        <Link
          href="/navigation/"
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          Navigation Resources
        </Link>
      </p>

      <ClusterCalculatorList slugs={tools} />

      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-slate-100">
          Explore Related Calculator Categories
        </h2>
        <ul className="text-sm space-y-1 list-none p-0 m-0">
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
              href="/wind-wave-calculators/"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Wind & Wave Calculators
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
