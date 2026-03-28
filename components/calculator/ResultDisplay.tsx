"use client";

interface ResultDisplayProps {
  label: string;
  value: string;
  unit?: string;
  error?: string | null;
}

export function ResultDisplay({ label, value, unit, error }: ResultDisplayProps) {
  return (
    <div
      className="result-box"
      role="region"
      aria-live="polite"
      aria-label="Calculation result"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-slate-400">
        {label}
      </p>
      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-normal">{error}</p>
      ) : (
        <p className="text-2xl font-semibold tabular-nums text-gray-900 dark:text-white mt-2">
          <span>{value}</span>
          {unit ? (
            <span className="text-lg font-medium text-gray-600 dark:text-slate-400 ml-2">
              {unit}
            </span>
          ) : null}
        </p>
      )}
    </div>
  );
}
