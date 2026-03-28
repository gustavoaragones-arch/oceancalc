interface FormulaBlockProps {
  formulaText: string;
  explanation?: string;
}

export function FormulaBlock({ formulaText, explanation }: FormulaBlockProps) {
  return (
    <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-700 dark:text-slate-300 leading-relaxed transition-all duration-200">
      <p className="font-mono text-gray-900 dark:text-slate-100 font-medium">
        {formulaText}
      </p>
      {explanation ? (
        <p className="mt-2 text-gray-600 dark:text-slate-400">{explanation}</p>
      ) : null}
    </div>
  );
}
