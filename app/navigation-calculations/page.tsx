import Link from "next/link";
import clusters from "@/data/calculatorClusters.json";
import { generateMetadata as buildSeoMetadata } from "@/lib/seo";

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
        Navigation calculations include bearing, distance, and route computation methods used in maritime navigation.
        These tools help determine direction, position, and optimal paths across the Earth’s surface.
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
