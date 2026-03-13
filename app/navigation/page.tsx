import Link from "next/link";
import { getNavigationArticles } from "@/lib/contentLoader";
import { SidebarNavigation } from "@/components/SidebarNavigation";

export const metadata = {
  title: "Navigation Fundamentals | OceanCalc",
  description:
    "Piloting, dead reckoning, coastal navigation, and chart work for sailors and mariners.",
  alternates: { canonical: "https://oceancalc.com/navigation/" },
  openGraph: {
    title: "Navigation Fundamentals | OceanCalc",
    description: "Piloting, dead reckoning, and coastal navigation.",
    url: "https://oceancalc.com/navigation/",
  },
};

export default function NavigationHubPage() {
  const articles = getNavigationArticles();
  const sidebarLinks = articles.map((a) => ({ slug: a.slug, title: a.title }));
  return (
    <div className="container-wide py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-56 shrink-0 lg:order-2">
          <SidebarNavigation
            title="Navigation Fundamentals"
            links={sidebarLinks}
            basePath="navigation"
          />
        </aside>
        <div className="flex-1 min-w-0">
          <header className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Navigation Fundamentals
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Coastal and offshore navigation: position, course, distance, and time. Use our tools for passage planning and piloting.
            </p>
          </header>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0">
            {articles.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/navigation/${article.slug}/`}
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
      </div>
    </div>
  );
}
