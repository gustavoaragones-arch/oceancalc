import type { ReactNode } from "react";

interface ToolPageLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  formula?: ReactNode;
  diagram?: ReactNode;
  examples?: ReactNode;
}

export function ToolPageLayout({
  title,
  description,
  children,
  formula,
  diagram,
  examples,
}: ToolPageLayoutProps) {
  return (
    <article className="container-narrow py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {title}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          {description}
        </p>
      </header>

      {children}

      {formula && (
        <section className="card mt-8" aria-labelledby="formula-heading">
          <h2 id="formula-heading" className="heading-section">
            Formula
          </h2>
          {formula}
        </section>
      )}

      {diagram && (
        <section className="card mt-8" aria-labelledby="diagram-heading">
          <h2 id="diagram-heading" className="heading-section">
            How It Works
          </h2>
          {diagram}
        </section>
      )}

      {examples && (
        <section className="card mt-8" aria-labelledby="examples-heading">
          <h2 id="examples-heading" className="heading-section">
            Examples
          </h2>
          {examples}
        </section>
      )}
    </article>
  );
}
