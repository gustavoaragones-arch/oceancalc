import Link from "next/link";

export interface TopicLink {
  slug: string;
  title: string;
  category: string;
}

interface TopicExplorerProps {
  topicLabel: string;
  links: TopicLink[];
  currentSlug?: string;
}

function categoryPath(category: string): string {
  return category === "maritime-measurements" ? "maritime-measurements" : category;
}

export function TopicExplorer({
  topicLabel,
  links,
  currentSlug,
}: TopicExplorerProps) {
  const filtered = links.filter((l) => l.slug !== currentSlug);
  if (filtered.length === 0) return null;
  return (
    <section className="card mt-8" aria-labelledby="topic-explorer-heading">
      <h2 id="topic-explorer-heading" className="heading-section">
        Explore {topicLabel}
      </h2>
      <ul className="list-none p-0 m-0 space-y-2">
        {filtered.map(({ slug, title, category }) => (
          <li key={`${category}-${slug}`}>
            <Link
              href={`/${categoryPath(category)}/${slug}/`}
              className="text-sky-600 dark:text-sky-400 hover:underline"
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
