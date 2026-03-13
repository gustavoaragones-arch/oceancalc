"use client";

import { unitLabel } from "@/lib/unitConverter";

export interface OutputConfig {
  name: string;
  label: string;
  formula: string;
  unit?: string;
  format?: "number" | "hours" | "decimal";
  decimals?: number;
}

interface OutputFieldProps {
  config: OutputConfig;
  value: number;
  displayUnit?: string;
}

function formatValue(value: number, config: OutputConfig): string {
  if (!Number.isFinite(value)) return "—";
  const dec = config.decimals ?? 2;
  if (config.format === "hours") {
    const h = Math.floor(value);
    const m = Math.round((value - h) * 60);
    if (h > 0) return `${h} h ${m} min`;
    return `${m} min`;
  }
  const rounded = Math.round(value * Math.pow(10, dec)) / Math.pow(10, dec);
  return rounded.toFixed(dec).replace(/\.?0+$/, "");
}

export function OutputField({ config, value, displayUnit }: OutputFieldProps) {
  const formatted = formatValue(value, config);
  const unit = displayUnit ?? config.unit;
  return (
    <div className="rounded-lg bg-slate-100 dark:bg-slate-700/50 p-4">
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-0.5">
        {config.label}
      </p>
      <p className="text-lg font-semibold text-slate-900 dark:text-white">
        {formatted}
        {unit && (
          <span className="ml-1 text-base font-normal text-slate-600 dark:text-slate-400">
            {" "}{unitLabel(unit)}
          </span>
        )}
      </p>
    </div>
  );
}
