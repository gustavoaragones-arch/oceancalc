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
      className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4"
      aria-label={`${title} navigation`}
    >
      <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
        {title}
      </h2>
      <ul className="list-none p-0 m-0 space-y-1">
        {links.map(({ slug, title: linkTitle }) => (
          <li key={slug}>
            <Link
              href={`/${basePath}/${slug}/`}
              className={`block py-1.5 px-2 rounded text-sm transition-colors ${
                slug === currentSlug
                  ? "font-medium text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20"
                  : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50"
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
