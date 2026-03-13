"use client";

import { useState, useCallback, useMemo } from "react";
import { parseFormula, DEFAULT_CUSTOM_FUNCTIONS } from "@/lib/formulaParser";
import { convert } from "@/lib/unitConverter";
import { validateInput, type ValidationRule } from "@/lib/validation";
import { InputField, type InputConfig } from "./InputField";
import { OutputField, type OutputConfig } from "./OutputField";
import { FormulaRenderer } from "./FormulaRenderer";
import { CalculatorCard } from "../calculators/CalculatorCard";

export interface EngineInputConfig extends InputConfig {
  name: string;
  label: string;
  type: "number";
  unit: string;
  units?: string[];
  default?: number;
  min?: number;
  max?: number;
  step?: string;
}

export interface EngineOutputConfig extends OutputConfig {
  name: string;
  label: string;
  formula: string;
  unit?: string;
  format?: "number" | "hours" | "decimal";
  decimals?: number;
}

export interface CalculatorEngineConfig {
  inputs: EngineInputConfig[];
  outputs: EngineOutputConfig[];
  formulaDisplay?: string;
}

interface CalculatorEngineProps {
  config: CalculatorEngineConfig;
  title?: string;
}

function getInitialValues(inputs: EngineInputConfig[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const i of inputs) {
    out[i.name] = String(i.default ?? (i.min ?? 0));
  }
  return out;
}

function getInitialUnits(inputs: EngineInputConfig[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const i of inputs) {
    out[i.name] = i.unit;
  }
  return out;
}

export function CalculatorEngine({ config, title = "Calculator" }: CalculatorEngineProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    getInitialValues(config.inputs)
  );
  const [units, setUnits] = useState<Record<string, string>>(() =>
    getInitialUnits(config.inputs)
  );

  const setInput = useCallback((name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const setUnit = useCallback((name: string, unit: string) => {
    setUnits((prev) => ({ ...prev, [name]: unit }));
  }, []);

  const variables = useMemo(() => {
    const vars: Record<string, number> = {};
    const noConvertUnits = ["degrees", "ratio"];
    for (const input of config.inputs) {
      const raw = values[input.name] ?? "";
      const num = parseFloat(raw);
      if (!Number.isFinite(num)) {
        vars[input.name] = NaN;
        continue;
      }
      const fromUnit = units[input.name] ?? input.unit;
      const toCanonical = input.unit;
      if (fromUnit === toCanonical || noConvertUnits.includes(toCanonical)) {
        vars[input.name] = num;
      } else {
        const converted = convert(num, fromUnit, toCanonical);
        vars[input.name] = Number.isFinite(converted) ? converted : num;
      }
    }
    return vars;
  }, [config.inputs, values, units]);

  const validation: Record<string, { valid: boolean; message?: string; value?: number }> = useMemo(() => {
    const out: Record<string, { valid: boolean; message?: string; value?: number }> = {};
    for (const input of config.inputs) {
      const raw = values[input.name] ?? "";
      const rules: ValidationRule = {};
      if (input.min !== undefined) rules.min = input.min;
      if (input.max !== undefined) rules.max = input.max;
      const result = validateInput(raw, rules);
      out[input.name] = result;
    }
    return out;
  }, [config.inputs, values]);

  const outputValues = useMemo(() => {
    const out: Record<string, number> = {};
    const allValid = config.inputs.every((i) => {
      const v = validation[i.name];
      return v?.valid && Number.isFinite(variables[i.name]);
    });
    if (!allValid) return out;
    for (const output of config.outputs) {
      try {
        const val = parseFormula(
          output.formula,
          variables,
          DEFAULT_CUSTOM_FUNCTIONS
        );
        out[output.name] = val;
      } catch {
        out[output.name] = NaN;
      }
    }
    return out;
  }, [config.inputs, config.outputs, variables, validation]);

  return (
    <CalculatorCard title={title}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {config.inputs.map((input) => (
            <InputField
              key={input.name}
              config={input}
              value={values[input.name] ?? ""}
              unit={units[input.name]}
              validation={validation[input.name]}
              onValueChange={(v) => setInput(input.name, v)}
              onUnitChange={input.units ? (u) => setUnit(input.name, u) : undefined}
            />
          ))}
        </div>

        {config.outputs.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Result
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {config.outputs.map((output) => (
                <OutputField
                  key={output.name}
                  config={output}
                  value={outputValues[output.name] ?? NaN}
                />
              ))}
            </div>
          </div>
        )}

        {config.formulaDisplay && (
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Formula
            </h3>
            <FormulaRenderer formula={config.formulaDisplay} />
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
