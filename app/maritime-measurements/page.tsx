import Link from "next/link";
import { getMeasurementsArticles } from "@/lib/contentLoader";
import { generateMetadata as buildSeoMetadata } from "@/lib/seo";

export const metadata = buildSeoMetadata({
  title: "Maritime Measurements",
  description:
    "Nautical miles, fathoms, knots, and conversion tables for maritime and sailing.",
  path: "/maritime-measurements/",
});

export default function MaritimeMeasurementsHubPage() {
  const articles = getMeasurementsArticles();
  return (
    <div className="container-wide py-8">
      <header className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-3 text-balance">
          Maritime Measurements
        </h1>
        <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl leading-relaxed text-balance">
          Nautical units, conversions, and definitions: nautical miles, knots, fathoms, and more.
        </p>
      </header>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/maritime-measurements/${article.slug}/`}
              className="card block group h-full"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                {article.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-2 leading-relaxed">
                {article.description}
              </p>
              <span className="inline-block mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform duration-200">
                Read more →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
