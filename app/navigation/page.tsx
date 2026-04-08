import Link from "next/link";
import { getNavigationArticles } from "@/lib/contentLoader";
import { SidebarNavigation } from "@/components/SidebarNavigation";
import { PriorityCalculatorsStrip } from "@/components/PriorityCalculatorsStrip";
import { generateMetadata as buildSeoMetadata } from "@/lib/seo";
import { getBuildLastModified } from "@/lib/indexing";

export const metadata = buildSeoMetadata({
  title: "Navigation Tools & Guides",
  description:
    "Learn maritime navigation, dead reckoning, and coastal piloting techniques.",
  path: "/navigation/",
  lastModified: getBuildLastModified(),
});

export default function NavigationHubPage() {
  const articles = getNavigationArticles();
  const sidebarLinks = articles.map((a) => ({ slug: a.slug, title: a.title }));
  return (
    <div className="container-wide py-8">
      <header className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-3 text-balance">
          Navigation Fundamentals
        </h1>
        <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl leading-relaxed text-balance">
          Coastal and offshore navigation: position, course, distance, and time. Use our tools for passage planning and piloting.
        </p>
      </header>

      <PriorityCalculatorsStrip />

      <div className="flex flex-col lg:flex-row lg:items-start gap-8">
        <ul className="flex-1 min-w-0 grid gap-6 sm:grid-cols-2 lg:grid-cols-2 list-none p-0 m-0">
          {articles.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/navigation/${article.slug}/`}
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

        <aside className="w-full sm:max-w-md lg:w-72 xl:w-80 shrink-0 lg:max-w-none">
          <SidebarNavigation
            title="In this section"
            links={sidebarLinks}
            basePath="navigation"
          />
        </aside>
      </div>
    </div>
  );
}
