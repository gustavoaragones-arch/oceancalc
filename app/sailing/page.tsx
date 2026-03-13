import Link from "next/link";
import { getSailingArticles } from "@/lib/contentLoader";

export const metadata = {
  title: "Tools for Sailors | OceanCalc",
  description:
    "Anchoring, passage planning, and onboard calculations for sailors and cruisers.",
  alternates: { canonical: "https://oceancalc.com/sailing/" },
  openGraph: {
    title: "Tools for Sailors | OceanCalc",
    description: "Anchoring, passage planning, and sailing calculators.",
    url: "https://oceancalc.com/sailing/",
  },
};

export default function SailingHubPage() {
  const articles = getSailingArticles();
  return (
    <div className="container-wide py-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Tools for Sailors
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          Practical tools for passage planning, anchoring, and day-to-day sailing.
        </p>
      </header>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/sailing/${article.slug}/`}
              className="card block hover:border-sky-500 dark:hover:border-sky-500 transition-colors group h-full"
            >
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {article.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                {article.description}
              </p>
              <span className="inline-block mt-3 text-sm font-medium text-sky-600 dark:text-sky-400">
                Read more →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
