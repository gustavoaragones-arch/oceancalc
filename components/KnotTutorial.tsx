import type { KnotEntry } from "@/lib/types";
import Link from "next/link";
import { FAQ } from "./FAQ";
import { AllCalculatorsGrid } from "./AllCalculatorsGrid";

interface KnotTutorialProps {
  knot: KnotEntry;
}

export function KnotTutorial({ knot }: KnotTutorialProps) {
  return (
    <article className="container-narrow py-8">
      <header className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-3 text-balance">
          {knot.name}
        </h1>
        <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
          Difficulty: {knot.difficulty}
        </p>
      </header>

      <section className="card mb-8" aria-labelledby="knot-context-heading">
        <h2 id="knot-context-heading" className="sr-only">
          Related planning tools
        </h2>
        <p className="text-gray-700 dark:text-slate-300 leading-relaxed text-sm">
          Line handling on deck often goes together with speed and ground tackle:
          convert{" "}
          <Link
            href="/tools/knots-speed-converter/"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            speed in knots
          </Link>{" "}
          for deck briefings, and plan{" "}
          <Link
            href="/tools/anchor-scope-calculator/"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            anchor scope
          </Link>{" "}
          when setting the hook.
        </p>
      </section>

      <section
        className="card mb-8"
        aria-labelledby="diagram-heading"
      >
        <h2 id="diagram-heading" className="heading-section">
          Diagram
        </h2>
        <div className="aspect-video bg-gray-100 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-600 flex items-center justify-center text-gray-500 dark:text-slate-400 text-sm">
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
        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-slate-300 leading-relaxed">
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
        <ol className="list-decimal pl-6 space-y-3 text-gray-700 dark:text-slate-300 leading-relaxed">
          {knot.steps.map((step, i) => (
            <li key={i} className="pl-1">
              {step}
            </li>
          ))}
        </ol>
      </section>

      <AllCalculatorsGrid />

      {knot.faq.length > 0 && <FAQ items={knot.faq} />}
    </article>
  );
}
