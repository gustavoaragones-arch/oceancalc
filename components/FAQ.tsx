import type { FAQSchema } from "@/lib/schema";

interface FAQProps {
  items: Array<{ question: string; answer: string }>;
  schema?: FAQSchema;
}

export function FAQ({ items }: FAQProps) {
  return (
    <section className="card mt-8" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="heading-section">
        Frequently Asked Questions
      </h2>
      <ul className="space-y-4 list-none p-0 m-0">
        {items.map(({ question, answer }, i) => (
          <li key={i} className="border-b border-slate-200 dark:border-slate-700 pb-4 last:border-0">
            <h3 className="font-medium text-slate-800 dark:text-slate-100 mb-1">
              {question}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{answer}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
