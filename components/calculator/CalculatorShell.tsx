"use client";

import { useMemo, useState, useCallback } from "react";
import type { CalculatorEntry, SimpleRegistryInput } from "@/lib/types";
import { calculatorMap } from "@/lib/calculators";
import {
  distanceToNmi,
  speedToKnots,
  nmiToDistanceUnit,
  knotsToSpeedUnit,
} from "@/lib/calculators/units";
import { formatNumber } from "@/lib/calculators/precision";
import { validatePositive, validateNonNegative } from "@/lib/calculators/validators";
import { InputField } from "./InputField";
import { ResultDisplay } from "./ResultDisplay";
import { UnitSelector } from "./UnitSelector";
import { ValidationMessage } from "./ValidationMessage";
import { FormulaBlock } from "./FormulaBlock";

interface CalculatorShellProps {
  calculator: Pick<CalculatorEntry, "simpleRegistry">;
}

function buildInitialValues(
  reg: NonNullable<CalculatorEntry["simpleRegistry"]>
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const input of reg.inputs) {
    const d = input.default ?? 0;
    out[input.name] = String(d);
  }
  return out;
}

function buildInitialUnits(
  reg: NonNullable<CalculatorEntry["simpleRegistry"]>
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const input of reg.inputs) {
    const list = input.units?.length ? input.units : input.unit ? [input.unit] : [];
    out[input.name] = list[0] ?? input.unit ?? "nmi";
  }
  return out;
}

function validateField(
  n: number,
  input: SimpleRegistryInput
): string | null {
  if (input.validation === "positive") {
    const e = validatePositive(n);
    if (e) return e;
  } else if (input.validation === "nonNegative") {
    const e = validateNonNegative(n);
    if (e) return e;
  }
  if (input.min !== undefined && n < input.min) {
    return `${input.label} must be at least ${input.min}.`;
  }
  if (input.max !== undefined && n > input.max) {
    return `${input.label} must be at most ${input.max}.`;
  }
  return null;
}

function toCanonical(
  value: number,
  selectedUnit: string,
  input: SimpleRegistryInput
): number {
  const canonical = input.canonical?.toLowerCase();
  if (!canonical) return value;
  if (canonical === "nmi" || canonical === "nm") {
    return distanceToNmi(value, selectedUnit);
  }
  if (canonical === "knots" || canonical === "knot") {
    return speedToKnots(value, selectedUnit);
  }
  return value;
}

export function CalculatorShell({ calculator }: CalculatorShellProps) {
  const reg = calculator.simpleRegistry;
  const [values, setValues] = useState<Record<string, string>>(() =>
    reg ? buildInitialValues(reg) : {}
  );
  const [units, setUnits] = useState<Record<string, string>>(() =>
    reg ? buildInitialUnits(reg) : {}
  );

  const setField = useCallback((name: string, raw: string) => {
    setValues((prev) => ({ ...prev, [name]: raw }));
  }, []);

  const setUnit = useCallback(
    (name: string, newUnit: string, input: SimpleRegistryInput) => {
      const oldUnit = units[name] ?? input.unit ?? "nmi";
      const raw = values[name];
      const n = Number.parseFloat(raw ?? "");
      if (!Number.isNaN(n) && oldUnit !== newUnit && input.canonical) {
        const canonical = input.canonical.toLowerCase();
        if (canonical === "nmi" || canonical === "nm") {
          const nmi = distanceToNmi(n, oldUnit);
          const converted = nmiToDistanceUnit(nmi, newUnit);
          setValues((prev) => ({
            ...prev,
            [name]: String(formatNumber(converted, 6)),
          }));
        } else if (canonical === "knots" || canonical === "knot") {
          const kn = speedToKnots(n, oldUnit);
          const converted = knotsToSpeedUnit(kn, newUnit);
          setValues((prev) => ({
            ...prev,
            [name]: String(formatNumber(converted, 6)),
          }));
        }
      }
      setUnits((prev) => ({ ...prev, [name]: newUnit }));
    },
    [units, values]
  );

  const { display, displayUnit, error, fieldErrors, showFormula } = useMemo(() => {
    if (!reg) {
      return {
        display: "—",
        displayUnit: undefined as string | undefined,
        error: "Calculator is not configured." as string | null,
        fieldErrors: {} as Record<string, string | null>,
        showFormula: false,
      };
    }
    const fn = calculatorMap[reg.formulaKey];
    if (!fn) {
      return {
        display: "—",
        displayUnit: undefined,
        error: `Unknown formula: ${reg.formulaKey}`,
        fieldErrors: {},
        showFormula: false,
      };
    }

    const fieldErrors: Record<string, string | null> = {};
    const numeric: Record<string, number> = {};
    let hasEmpty = false;

    for (const input of reg.inputs) {
      const raw = values[input.name];
      if (raw === undefined || raw.trim() === "") {
        hasEmpty = true;
        fieldErrors[input.name] = null;
        continue;
      }
      const n = Number.parseFloat(raw);
      if (Number.isNaN(n)) {
        fieldErrors[input.name] = "Enter a valid number.";
        return {
          display: "—",
          displayUnit: undefined,
          error: null,
          fieldErrors,
          showFormula: Boolean(reg.formulaText),
        };
      }
      const u = units[input.name] ?? input.unit ?? "nmi";
      const err = validateField(n, input);
      if (err) {
        fieldErrors[input.name] = err;
        return {
          display: "—",
          displayUnit: undefined,
          error: null,
          fieldErrors,
          showFormula: Boolean(reg.formulaText),
        };
      }
      numeric[input.name] = toCanonical(n, u, input);
    }

    if (hasEmpty) {
      return {
        display: "—",
        displayUnit: undefined,
        error: null,
        fieldErrors,
        showFormula: Boolean(reg.formulaText),
      };
    }

    try {
      const result = fn(numeric);
      if (Number.isNaN(result)) {
        return {
          display: "—",
          displayUnit: undefined,
          error: "Speed must be greater than zero for time calculations.",
          fieldErrors,
          showFormula: Boolean(reg.formulaText),
        };
      }
      if (!Number.isFinite(result)) {
        return {
          display: "—",
          displayUnit: undefined,
          error: "Result is not a finite number.",
          fieldErrors,
          showFormula: Boolean(reg.formulaText),
        };
      }
      const decimals = reg.output?.decimals ?? reg.decimals ?? 2;
      const rounded = formatNumber(result, decimals);
      const formatted = rounded.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      const outUnit = reg.output?.unit;
      return {
        display: formatted,
        displayUnit: outUnit,
        error: null,
        fieldErrors,
        showFormula: Boolean(reg.formulaText),
      };
    } catch {
      return {
        display: "—",
        displayUnit: undefined,
        error: "Could not compute result.",
        fieldErrors,
        showFormula: Boolean(reg.formulaText),
      };
    }
  }, [reg, values, units]);

  if (!reg) return null;

  const resultLabel =
    reg.resultLabel ??
    (reg.output?.unit ? `Result (${reg.output.unit})` : "Result");

  return (
    <div className="card">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-end">
        <div className="space-y-5">
          {reg.inputs.map((input) => {
            const unitList =
              input.units?.length && input.units.length > 0
                ? input.units
                : input.unit
                  ? [input.unit]
                  : [];
            const showSelector = unitList.length > 1;
            return (
              <div key={input.name} className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                  <div className="flex-1 min-w-0">
                    <InputField
                      id={`calc-${input.name}`}
                      label={input.label}
                      value={values[input.name] ?? ""}
                      onChange={(v) => setField(input.name, v)}
                      min={input.min}
                      step={input.step}
                    />
                  </div>
                  {showSelector ? (
                    <UnitSelector
                      id={`unit-${input.name}`}
                      value={units[input.name] ?? unitList[0]}
                      units={unitList}
                      onChange={(u) => setUnit(input.name, u, input)}
                    />
                  ) : null}
                </div>
                <ValidationMessage message={fieldErrors[input.name] ?? null} />
              </div>
            );
          })}
        </div>
        <ResultDisplay
          label={resultLabel}
          value={display}
          unit={displayUnit}
          error={error}
        />
      </div>
      {showFormula && reg.formulaText ? (
        <FormulaBlock
          formulaText={reg.formulaText}
          explanation={reg.formulaExplanation}
        />
      ) : null}
    </div>
  );
}
