import type { ReactNode } from "react";
import type { CalculatorEntry } from "@/lib/types";
import type { GeneratedToolContent } from "@/lib/contentGenerator";
import { FAQ } from "./FAQ";
import { CalculatorDisclaimer } from "./CalculatorDisclaimer";
import { Breadcrumbs, BreadcrumbSchema } from "./Breadcrumbs";
import { LearnMore } from "./LearnMore";
import { AuthorPublisher } from "./AuthorPublisher";
import { RelatedCalculators } from "./RelatedCalculators";
import { CalculatorCategoryLinks } from "./CalculatorCategoryLinks";
import LastUpdated from "./LastUpdated";

export interface LearnMoreItem {
  slug: string;
  title: string;
  category: string;
}

interface CalculatorLayoutProps {
  calculator: CalculatorEntry;
  children: ReactNode;
  breadcrumbItems?: Array<{ label: string; href?: string }>;
  learnMoreItems?: LearnMoreItem[];
  /** Variant or default page title */
  displayTitle?: string;
  variantIntro?: string | null;
  generated?: GeneratedToolContent | null;
  faqItems?: Array<{ question: string; answer: string }>;
}

export function CalculatorLayout({
  calculator,
  children,
  breadcrumbItems,
  learnMoreItems = [],
  displayTitle,
  variantIntro,
  generated,
  faqItems,
}: CalculatorLayoutProps) {
  const title = displayTitle ?? calculator.title;
  const faqs = faqItems ?? calculator.faq;

  return (
    <article className="container-narrow py-8">
      {breadcrumbItems && breadcrumbItems.length > 0 && (
        <>
          <BreadcrumbSchema items={breadcrumbItems} />
          <Breadcrumbs items={breadcrumbItems} />
        </>
      )}
      <header className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-3 text-balance">
          {title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-slate-400 leading-relaxed text-balance">
          {calculator.description}
        </p>
        <LastUpdated />
        <AuthorPublisher className="mt-2" />
      </header>

      {variantIntro ? (
        <section className="card mb-8" aria-labelledby="variant-intro-heading">
          <h2 id="variant-intro-heading" className="sr-only">
            Page focus
          </h2>
          <p className="text-gray-700 dark:text-slate-300 leading-relaxed text-sm">
            {variantIntro}
          </p>
        </section>
      ) : null}

      {children}

      <RelatedCalculators currentSlug={calculator.slug} />

      {generated ? (
        <section className="card mt-8" aria-labelledby="intro-heading">
          <h2 id="intro-heading" className="heading-section">
            Overview
          </h2>
          <p className="text-gray-700 dark:text-slate-300 leading-relaxed text-sm">
            {generated.intro}
          </p>
        </section>
      ) : null}

      {generated ? (
        <section className="card mt-8" aria-labelledby="howto-heading">
          <h2 id="howto-heading" className="heading-section">
            How to use
          </h2>
          <p className="text-gray-700 dark:text-slate-300 leading-relaxed text-sm">
            {generated.howTo}
          </p>
        </section>
      ) : null}

      <section
        className="card mt-8"
        aria-labelledby="formula-heading"
      >
        <h2 id="formula-heading" className="heading-section">
          Formula
        </h2>
        {generated ? (
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">
            {generated.formulaLine}
          </p>
        ) : null}
        <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
          {calculator.formula}
        </p>
        {calculator.formulaDetail && (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {calculator.formulaDetail}
          </p>
        )}
      </section>

      {generated ? (
        <section className="card mt-8" aria-labelledby="use-cases-heading">
          <h2 id="use-cases-heading" className="heading-section">
            Practical use cases
          </h2>
          <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
            {generated.useCases}
          </p>
        </section>
      ) : null}

      {generated && generated.tips.length > 0 ? (
        <section className="card mt-8" aria-labelledby="tips-heading">
          <h2 id="tips-heading" className="heading-section">
            Tips for accuracy
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
            {generated.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {calculator.examples && calculator.examples.length > 0 && (
        <section
          className="card mt-8"
          aria-labelledby="examples-heading"
        >
          <h2 id="examples-heading" className="heading-section">
            Practical examples
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
            {calculator.examples.map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
        </section>
      )}

      {faqs.length > 0 && <FAQ items={faqs} />}

      <CalculatorCategoryLinks category={calculator.category} />

      <LearnMore items={learnMoreItems} title="Learn More" />

      <CalculatorDisclaimer />
    </article>
  );
}
