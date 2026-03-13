import type { KnotEntry } from "@/lib/types";
import { FAQ } from "./FAQ";

interface KnotTutorialProps {
  knot: KnotEntry;
}

export function KnotTutorial({ knot }: KnotTutorialProps) {
  return (
    <article className="container-narrow py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {knot.name}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Difficulty: {knot.difficulty}
        </p>
      </header>

      <section
        className="card mb-8"
        aria-labelledby="diagram-heading"
      >
        <h2 id="diagram-heading" className="heading-section">
          Diagram
        </h2>
        <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm">
          Diagram placeholder — illustration for {knot.name} can be added here
        </div>
      </section>

      <section
        className="card mb-8"
        aria-labelledby="uses-heading"
      >
        <h2 id="uses-heading" className="heading-section">
          Use Cases
        </h2>
        <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
          {knot.uses.map((use, i) => (
            <li key={i}>{use}</li>
          ))}
        </ul>
      </section>

      <section
        className="card mb-8"
        aria-labelledby="steps-heading"
      >
        <h2 id="steps-heading" className="heading-section">
          How to Tie
        </h2>
        <ol className="list-decimal pl-6 space-y-3 text-slate-700 dark:text-slate-300">
          {knot.steps.map((step, i) => (
            <li key={i} className="pl-1">
              {step}
            </li>
          ))}
        </ol>
      </section>

      {knot.faq.length > 0 && <FAQ items={knot.faq} />}
    </article>
  );
}
