"use client";

import { useState, useCallback } from "react";
import { CalculatorCard } from "./CalculatorCard";

export type UnitPair = {
  from: string;
  to: string;
  factor: number; // 1 from = factor to
};

interface UnitConverterProps {
  title: string;
  pairs: UnitPair[];
  defaultFrom: string;
  defaultTo: string;
  fromLabel?: string;
  toLabel?: string;
}

export function UnitConverter({
  title,
  pairs,
  defaultFrom,
  defaultTo,
  fromLabel = "From",
  toLabel = "To",
}: UnitConverterProps) {
  const [fromUnit, setFromUnit] = useState(defaultFrom);
  const [toUnit, setToUnit] = useState(defaultTo);
  const [fromValue, setFromValue] = useState<string>("1");
  const [toValue, setToValue] = useState<string>("");

  const convert = useCallback(
    (val: number, from: string, to: string): number => {
      if (from === to) return val;
      const fromToBase = pairs.find((p) => p.from === from);
      const toFromBase = pairs.find((p) => p.to === to);
      if (fromToBase && toFromBase) {
        const base = val * fromToBase.factor;
        return base / toFromBase.factor;
      }
      const reverse = pairs.find((p) => p.from === to && p.to === from);
      if (reverse) return val / reverse.factor;
      const fwd = pairs.find((p) => p.from === from && p.to === to);
      if (fwd) return val * fwd.factor;
      return val;
    },
    [pairs]
  );

  const handleFromChange = (value: string) => {
    setFromValue(value);
    const num = parseFloat(value);
    if (Number.isFinite(num)) {
      setToValue(convert(num, fromUnit, toUnit).toFixed(6).replace(/\.?0+$/, ""));
    } else {
      setToValue("");
    }
  };

  const handleToChange = (value: string) => {
    setToValue(value);
    const num = parseFloat(value);
    if (Number.isFinite(num)) {
      setFromValue(convert(num, toUnit, fromUnit).toFixed(6).replace(/\.?0+$/, ""));
    } else {
      setFromValue("");
    }
  };

  const handleFromUnitChange = (unit: string) => {
    setFromUnit(unit);
    const num = parseFloat(fromValue);
    if (Number.isFinite(num)) {
      setToValue(convert(num, unit, toUnit).toFixed(6).replace(/\.?0+$/, ""));
    }
  };

  const handleToUnitChange = (unit: string) => {
    setToUnit(unit);
    const num = parseFloat(fromValue);
    if (Number.isFinite(num)) {
      setToValue(convert(num, fromUnit, unit).toFixed(6).replace(/\.?0+$/, ""));
    }
  };

  const units = Array.from(new Set(pairs.flatMap((p) => [p.from, p.to])));

  return (
    <CalculatorCard title={title}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="from-value" className="label">
            {fromLabel}
          </label>
          <div className="flex gap-2">
            <input
              id="from-value"
              type="number"
              inputMode="decimal"
              value={fromValue}
              onChange={(e) => handleFromChange(e.target.value)}
              className="input-field"
              aria-label={`Value in ${fromUnit}`}
            />
            <select
              value={fromUnit}
              onChange={(e) => handleFromUnitChange(e.target.value)}
              className="input-field w-auto min-w-[100px]"
              aria-label="From unit"
            >
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="to-value" className="label">
            {toLabel}
          </label>
          <div className="flex gap-2">
            <input
              id="to-value"
              type="number"
              inputMode="decimal"
              value={toValue}
              onChange={(e) => handleToChange(e.target.value)}
              className="input-field"
              aria-label={`Value in ${toUnit}`}
              readOnly={false}
            />
            <select
              value={toUnit}
              onChange={(e) => handleToUnitChange(e.target.value)}
              className="input-field w-auto min-w-[100px]"
              aria-label="To unit"
            >
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
}
