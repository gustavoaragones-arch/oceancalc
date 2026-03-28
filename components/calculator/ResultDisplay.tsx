"use client";

interface ResultDisplayProps {
  label: string;
  value: string;
  error?: string | null;
}

export function ResultDisplay({ label, value, error }: ResultDisplayProps) {
  return (
    <div
      className="rounded-md border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 mt-4"
      role="region"
      aria-live="polite"
      aria-label="Calculation result"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      {error ? (
        <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">{error}</p>
      ) : (
        <p className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-white mt-1">
          {value}
        </p>
      )}
    </div>
  );
}
