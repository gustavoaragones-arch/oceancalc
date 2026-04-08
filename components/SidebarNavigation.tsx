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
      className="card hover:!translate-y-0"
      aria-label={`${title} navigation`}
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4 pb-2 border-b border-gray-200 dark:border-slate-700 tracking-tight">
        {title}
      </h2>
      <ul className="list-none p-0 m-0 space-y-2">
        {links.map(({ slug, title: linkTitle }) => (
          <li key={slug}>
            <Link
              href={`/${basePath}/${slug}/`}
              className={`block rounded-lg py-2 px-1 -mx-1 text-sm leading-snug transition-colors duration-200 ${
                slug === currentSlug
                  ? "font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/25 px-2"
                  : "text-gray-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
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
