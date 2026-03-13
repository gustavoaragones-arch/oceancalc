"use client";

import { unitLabel } from "@/lib/unitConverter";

interface UnitSelectorProps {
  value: string;
  options: string[];
  onChange: (unit: string) => void;
  id?: string;
  "aria-label"?: string;
  className?: string;
}

export function UnitSelector({
  value,
  options,
  onChange,
  id,
  "aria-label": ariaLabel,
  className = "",
}: UnitSelectorProps) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`input-field min-w-[100px] ${className}`}
      aria-label={ariaLabel ?? "Unit"}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {unitLabel(opt)}
        </option>
      ))}
    </select>
  );
}
