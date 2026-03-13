import type { ReactNode } from "react";

interface CalculatorCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function CalculatorCard({ title, children, className = "" }: CalculatorCardProps) {
  return (
    <section
      className={`card ${className}`}
      aria-labelledby="calculator-heading"
    >
      <h2 id="calculator-heading" className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
        {title}
      </h2>
      {children}
    </section>
  );
}
