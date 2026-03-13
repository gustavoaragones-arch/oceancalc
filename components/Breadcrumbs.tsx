import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-x-2 text-sm text-slate-600 dark:text-slate-400">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-x-2">
            {i > 0 && (
              <span aria-hidden className="text-slate-400 dark:text-slate-500">
                /
              </span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-900 dark:text-white font-medium">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://oceancalc.com";

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null;
  const listItems = items.map((item, i) => {
    const url = item.href
      ? item.href.startsWith("http")
        ? item.href
        : `${SITE_URL}${item.href}`
      : undefined;
    return {
      "@type": "ListItem" as const,
      position: i + 1,
      name: item.label,
      ...(url && { item: { "@type": "WebPage" as const, "@id": url } }),
    };
  });
  const schema = {
    "@context": "https://schema.org" as const,
    "@type": "BreadcrumbList" as const,
    itemListElement: listItems,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
