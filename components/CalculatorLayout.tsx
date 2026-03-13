import type { ReactNode } from "react";
import type { CalculatorEntry } from "@/lib/types";
import { FAQ } from "./FAQ";
import { CalculatorDisclaimer } from "./CalculatorDisclaimer";
import { Breadcrumbs, BreadcrumbSchema } from "./Breadcrumbs";
import { LearnMore } from "./LearnMore";
import { AuthorPublisher } from "./AuthorPublisher";

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
  lastUpdated?: string;
}

export function CalculatorLayout({
  calculator,
  children,
  breadcrumbItems,
  learnMoreItems = [],
  lastUpdated,
}: CalculatorLayoutProps) {
  return (
    <article className="container-narrow py-8">
      {breadcrumbItems && breadcrumbItems.length > 0 && (
        <>
          <BreadcrumbSchema items={breadcrumbItems} />
          <Breadcrumbs items={breadcrumbItems} />
        </>
      )}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {calculator.title}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {calculator.description}
        </p>
        <AuthorPublisher lastUpdated={lastUpdated} className="mt-2" />
      </header>

      {children}

      <section
        className="card mt-8"
        aria-labelledby="formula-heading"
      >
        <h2 id="formula-heading" className="heading-section">
          Formula
        </h2>
        <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
          {calculator.formula}
        </p>
        {calculator.formulaDetail && (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {calculator.formulaDetail}
          </p>
        )}
      </section>

      {calculator.examples && calculator.examples.length > 0 && (
        <section
          className="card mt-8"
          aria-labelledby="examples-heading"
        >
          <h2 id="examples-heading" className="heading-section">
            Examples
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
            {calculator.examples.map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
        </section>
      )}

      {calculator.faq.length > 0 && (
        <FAQ items={calculator.faq} />
      )}

      <LearnMore items={learnMoreItems} title="Learn More" />

      <CalculatorDisclaimer />
    </article>
  );
}
