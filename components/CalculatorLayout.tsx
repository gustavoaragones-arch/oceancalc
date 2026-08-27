import type { ReactNode } from "react";
import Link from "next/link";
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
import AnswerBlock from "./ai/AnswerBlock";
import KeyTakeaways from "./ai/KeyTakeaways";
import EntityDefinition from "./ai/EntityDefinition";
import AdPlaceholder from "@/components/ads/AdPlaceholder";
import {
  getAeoAnswerBlock,
  getAeoKeyTakeaways,
  getEntitiesForCalculator,
} from "@/lib/aeo";

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
  const entityAnchors = getEntitiesForCalculator(calculator).slice(0, 2);

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
        <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">
          Updated recently with improved calculation accuracy and expanded examples.
        </p>
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

      {calculator.slug === "great-circle-distance-calculator" ? (
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
          This calculation uses a spherical-Earth model, so results are an approximation of real-world geographic distance.
        </p>
      ) : null}

      <AdPlaceholder label="Ad slot — after calculation result" />

      <AnswerBlock {...getAeoAnswerBlock(calculator)} />

      {entityAnchors.length > 0 ? (
        <div
          className="mt-6 space-y-4"
          role="region"
          aria-label="Key maritime definitions"
        >
          {entityAnchors.map((e) => (
            <EntityDefinition
              key={e.term}
              term={e.term}
              definition={e.definition}
            />
          ))}
        </div>
      ) : null}

      <RelatedCalculators currentSlug={calculator.slug} />

      {generated ? (
        <section className="card mt-8" aria-labelledby="intro-heading">
          <h2 id="intro-heading" className="heading-section">
            Overview
          </h2>
          <p className="text-gray-700 dark:text-slate-300 leading-relaxed text-sm max-w-prose">
            {generated.intro}
          </p>
          <KeyTakeaways items={getAeoKeyTakeaways(calculator, generated)} />
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

      <AdPlaceholder label="Ad slot — mid content" />

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-slate-100">
          Explore Related Calculation Categories
        </h2>

        <ul className="text-sm space-y-1 list-none p-0 m-0 text-gray-700 dark:text-slate-300">
          <li>
            <Link href="/tools/" className="text-blue-600 dark:text-blue-400 hover:underline">
              Browse all maritime calculators and navigation tools
            </Link>
          </li>
          <li>
            <Link href="/tools/" className="text-blue-600 dark:text-blue-400 hover:underline">
              Explore distance, bearing, and route calculation tools
            </Link>
          </li>
          <li>
            <Link href="/tools/" className="text-blue-600 dark:text-blue-400 hover:underline">
              View sailing performance and wind analysis calculators
            </Link>
          </li>
        </ul>
      </section>

      <CalculatorCategoryLinks category={calculator.category} />

      <p className="text-xs text-gray-500 mt-8">
        These calculations are based on standard maritime navigation formulas used in seamanship, chart navigation, and marine route planning.
      </p>

      <LearnMore items={learnMoreItems} title="Learn More" />

      <CalculatorDisclaimer />

      <AdPlaceholder label="Ad slot — bottom of page" />
    </article>
  );
}
