import type { ArticleEntry } from "@/lib/types";
import { FAQ } from "./FAQ";
import { RelatedTools } from "./RelatedTools";
import { TopicExplorer } from "./TopicExplorer";
import { Breadcrumbs, BreadcrumbSchema } from "./Breadcrumbs";
import { AuthorPublisher } from "./AuthorPublisher";

export interface RelatedTool {
  slug: string;
  title: string;
}

export interface TopicLink {
  slug: string;
  title: string;
  category: string;
}

interface ArticleLayoutProps {
  article: ArticleEntry;
  relatedTools: RelatedTool[];
  category: string;
  sameCategoryArticles?: TopicLink[];
  lastUpdated?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  navigation: "Navigation",
  "wind-waves": "Wind & Waves",
  "maritime-measurements": "Maritime Measurements",
  sailing: "Sailing",
};

export function ArticleLayout({
  article,
  relatedTools,
  category,
  sameCategoryArticles = [],
  lastUpdated,
}: ArticleLayoutProps) {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: CATEGORY_LABELS[category] ?? category, href: `/${category}/` },
    { label: article.title },
  ];

  return (
    <article className="container-narrow py-8">
      <BreadcrumbSchema items={breadcrumbs} />
      <Breadcrumbs items={breadcrumbs} />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {article.title}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {article.description}
        </p>
        <AuthorPublisher lastUpdated={lastUpdated} className="mt-2" />
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
          {article.content}
        </p>
      </div>

      <RelatedTools tools={relatedTools} title="Related Tools" />

      {sameCategoryArticles.length > 0 && (
        <TopicExplorer
          topicLabel={CATEGORY_LABELS[category] ?? category}
          links={sameCategoryArticles}
          currentSlug={article.slug}
        />
      )}

      {article.faq.length > 0 && <FAQ items={article.faq} />}
    </article>
  );
}
