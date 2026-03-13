"use client";

import { useState } from "react";
import { CalculatorCard } from "./CalculatorCard";

export function AnchorScopeCalculator() {
  const [depth, setDepth] = useState("10");
  const [scopeRatio, setScopeRatio] = useState("5");
  const [unit, setUnit] = useState<"ft" | "m">("ft");

  const d = parseFloat(depth);
  const ratio = parseFloat(scopeRatio);
  const valid = Number.isFinite(d) && d > 0 && Number.isFinite(ratio) && ratio >= 3 && ratio <= 10;

  let depthFt = d;
  if (unit === "m") depthFt = d * 3.28084;

  const rodeLengthFt = valid ? depthFt * ratio : 0;
  const rodeLengthM = rodeLengthFt / 3.28084;

  return (
    <CalculatorCard title="Anchor Scope Calculator">
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        Recommended scope is 5:1 to 7:1 for all-chain; 7:1 to 10:1 for rope/chain. Depth is water depth (not including freeboard).
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="depth" className="label">Water depth</label>
          <div className="flex gap-2">
            <input
              id="depth"
              type="number"
              min="1"
              step="0.5"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              className="input-field"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as "ft" | "m")}
              className="input-field w-auto min-w-[70px]"
            >
              <option value="ft">ft</option>
              <option value="m">m</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="scope" className="label">Scope ratio (e.g. 5:1)</label>
          <input
            id="scope"
            type="number"
            min="3"
            max="10"
            step="0.5"
            value={scopeRatio}
            onChange={(e) => setScopeRatio(e.target.value)}
            className="input-field"
          />
        </div>
      </div>
      {valid && (
        <div className="rounded-lg bg-slate-100 dark:bg-slate-700/50 p-4">
          <p className="font-medium">Rode length to pay out</p>
          <p className="text-lg">{rodeLengthFt.toFixed(0)} ft</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">{rodeLengthM.toFixed(1)} m</p>
        </div>
      )}
    </CalculatorCard>
  );
}
