import Link from "next/link";

export interface RelatedToolItem {
  slug: string;
  title: string;
}

interface RelatedToolsProps {
  tools: RelatedToolItem[];
  title?: string;
}

export function RelatedTools({ tools, title = "Related Tools" }: RelatedToolsProps) {
  if (tools.length === 0) return null;
  return (
    <section className="card mt-8" aria-labelledby="related-tools-heading">
      <h2 id="related-tools-heading" className="heading-section">
        {title}
      </h2>
      <ul className="list-none p-0 m-0 space-y-2">
        {tools.map(({ slug, title: toolTitle }) => (
          <li key={slug}>
            <Link
              href={`/tools/${slug}/`}
              className="text-sky-600 dark:text-sky-400 hover:underline"
            >
              {toolTitle} →
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
