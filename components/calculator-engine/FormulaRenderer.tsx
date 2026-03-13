/**
 * Renders formula text for display (e.g. "Distance = Speed × Time").
 * Uses Unicode symbols for a clean look without heavy math libs.
 */

interface FormulaRendererProps {
  formula: string;
  className?: string;
}

const REPLACEMENTS: Array<[RegExp | string, string]> = [
  ["*", "×"],
  ["/", "÷"],
  [/\*\*/g, "^"],
  ["sqrt", "√"],
  ["(", "("],
  [")", ")"],
];

export function FormulaRenderer({ formula, className = "" }: FormulaRendererProps) {
  let display = formula;
  for (const [from, to] of REPLACEMENTS) {
    display = typeof from === "string" ? display.split(from).join(to) : display.replace(from, to);
  }
  return (
    <code
      className={`block font-mono text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded px-3 py-2 overflow-x-auto ${className}`}
      aria-label={`Formula: ${formula}`}
    >
      {display}
    </code>
  );
}
