"use client";

import { useMemo, useState, useCallback } from "react";
import type { CalculatorEntry } from "@/lib/types";
import { calculatorMap } from "@/lib/calculators";
import { InputField } from "./InputField";
import { ResultDisplay } from "./ResultDisplay";

interface CalculatorShellProps {
  calculator: Pick<CalculatorEntry, "simpleRegistry">;
}

function buildInitialValues(
  calculator: Pick<CalculatorEntry, "simpleRegistry">
): Record<string, string> {
  const reg = calculator.simpleRegistry;
  if (!reg) return {};
  const out: Record<string, string> = {};
  for (const input of reg.inputs) {
    const d = input.default ?? 0;
    out[input.name] = String(d);
  }
  return out;
}

export function CalculatorShell({ calculator }: CalculatorShellProps) {
  const reg = calculator.simpleRegistry;
  const [values, setValues] = useState<Record<string, string>>(() =>
    buildInitialValues(calculator)
  );

  const setField = useCallback((name: string, raw: string) => {
    setValues((prev) => ({ ...prev, [name]: raw }));
  }, []);

  const { display, error } = useMemo(() => {
    if (!reg) {
      return { display: "—", error: "Calculator is not configured." };
    }
    const fn = calculatorMap[reg.formulaKey];
    if (!fn) {
      return {
        display: "—",
        error: `Unknown formula: ${reg.formulaKey}`,
      };
    }

    const numeric: Record<string, number> = {};
    for (const input of reg.inputs) {
      const raw = values[input.name];
      if (raw === undefined || raw.trim() === "") {
        return { display: "—", error: null };
      }
      const n = Number.parseFloat(raw);
      if (Number.isNaN(n)) {
        return { display: "—", error: "Enter valid numbers." };
      }
      if (input.min !== undefined && n < input.min) {
        return {
          display: "—",
          error: `${input.label} must be at least ${input.min}.`,
        };
      }
      numeric[input.name] = n;
    }

    try {
      const result = fn(numeric);
      if (!Number.isFinite(result)) {
        return { display: "—", error: "Result is not a finite number." };
      }
      const decimals = reg.decimals ?? 2;
      return {
        display: result.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }),
        error: null,
      };
    } catch {
      return { display: "—", error: "Could not compute result." };
    }
  }, [reg, values]);

  if (!reg) return null;

  return (
    <div className="card">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
        <div className="space-y-4">
          {reg.inputs.map((input) => (
            <InputField
              key={input.name}
              id={`calc-${input.name}`}
              label={input.label}
              value={values[input.name] ?? ""}
              onChange={(v) => setField(input.name, v)}
              min={input.min}
              step={input.step}
            />
          ))}
        </div>
        <ResultDisplay label={reg.resultLabel} value={display} error={error} />
      </div>
    </div>
  );
}
