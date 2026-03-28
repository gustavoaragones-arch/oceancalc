import Link from "next/link";

export interface SidebarLink {
  slug: string;
  title: string;
}

interface SidebarNavigationProps {
  title: string;
  links: SidebarLink[];
  basePath: string;
  currentSlug?: string;
}

export function SidebarNavigation({
  title,
  links,
  basePath,
  currentSlug,
}: SidebarNavigationProps) {
  if (links.length === 0) return null;
  return (
    <nav
      className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 p-4 shadow-sm transition-all duration-200"
      aria-label={`${title} navigation`}
    >
      <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3">
        {title}
      </h2>
      <ul className="list-none p-0 m-0 space-y-1">
        {links.map(({ slug, title: linkTitle }) => (
          <li key={slug}>
            <Link
              href={`/${basePath}/${slug}/`}
              className={`block py-1.5 px-2 rounded text-sm transition-colors ${
                slug === currentSlug
                  ? "font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors duration-200"
              }`}
            >
              {linkTitle}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
