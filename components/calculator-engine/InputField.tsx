"use client";

import type { ValidationResult } from "@/lib/validation";
import { UnitSelector } from "./UnitSelector";

export interface InputConfig {
  name: string;
  label: string;
  type: "number";
  unit?: string;
  default?: number;
  min?: number;
  max?: number;
  step?: string;
  units?: string[];
}

interface InputFieldProps {
  config: InputConfig;
  value: string;
  unit?: string;
  validation?: ValidationResult;
  onValueChange: (value: string) => void;
  onUnitChange?: (unit: string) => void;
}

export function InputField({
  config,
  value,
  unit,
  validation,
  onValueChange,
  onUnitChange,
}: InputFieldProps) {
  const hasError = validation && !validation.valid && value.trim() !== "";
  const id = `input-${config.name}`;

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="label">
        {config.label}
      </label>
      <div className="flex gap-2 flex-wrap">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          min={config.min}
          max={config.max}
          step={config.step ?? "any"}
          className={`input-field flex-1 min-w-[100px] ${hasError ? "border-red-500 dark:border-red-500" : ""}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
        />
        {config.units && config.units.length > 0 && onUnitChange && unit && (
          <UnitSelector
            value={unit}
            options={config.units}
            onChange={onUnitChange}
            aria-label={`Unit for ${config.label}`}
          />
        )}
      </div>
      {hasError && validation?.message && (
        <p id={`${id}-error`} className="text-sm text-red-600 dark:text-red-400" role="alert">
          {validation.message}
        </p>
      )}
    </div>
  );
}
