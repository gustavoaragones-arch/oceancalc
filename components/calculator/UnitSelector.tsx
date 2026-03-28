"use client";

import { unitLabel } from "@/lib/calculators/units";

interface UnitSelectorProps {
  id: string;
  value: string;
  units: string[];
  onChange: (unit: string) => void;
  disabled?: boolean;
}

export function UnitSelector({
  id,
  value,
  units,
  onChange,
  disabled,
}: UnitSelectorProps) {
  if (units.length <= 1) return null;
  return (
    <div className="min-w-[7rem]">
      <label htmlFor={id} className="sr-only">
        Unit
      </label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="input-field w-full text-sm py-2"
      >
        {units.map((u) => (
          <option key={u} value={u}>
            {unitLabel(u)}
          </option>
        ))}
      </select>
    </div>
  );
}
