import Link from "next/link";

export interface LearnMoreItem {
  slug: string;
  title: string;
  category: string;
}

interface LearnMoreProps {
  items: LearnMoreItem[];
  title?: string;
}

function categoryPath(category: string): string {
  return category === "maritime-measurements" ? "maritime-measurements" : category;
}

export function LearnMore({ items, title = "Learn More" }: LearnMoreProps) {
  if (items.length === 0) return null;
  return (
    <section className="card mt-8" aria-labelledby="learn-more-heading">
      <h2 id="learn-more-heading" className="heading-section">
        {title}
      </h2>
      <ul className="list-none p-0 m-0 space-y-2">
        {items.map(({ slug, title: articleTitle, category }) => (
          <li key={`${category}-${slug}`}>
            <Link
              href={`/${categoryPath(category)}/${slug}/`}
              className="text-sky-600 dark:text-sky-400 hover:underline"
            >
              {articleTitle} →
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
