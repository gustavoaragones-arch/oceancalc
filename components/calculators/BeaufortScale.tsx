"use client";

import { useState } from "react";
import { CalculatorCard } from "./CalculatorCard";

// Beaufort scale: wind speed in knots to force
// Approximate: force 0 = 0-1, 1 = 1-3, 2 = 4-6, 3 = 7-10, 4 = 11-16, 5 = 17-21, 6 = 22-27, 7 = 28-33, 8 = 34-40, 9 = 41-47, 10 = 48-55, 11 = 56-63, 12 = 64+
const BEAUFORT: Array<{ force: number; minKn: number; maxKn: number; description: string; sea: string }> = [
  { force: 0, minKn: 0, maxKn: 1, description: "Calm", sea: "Sea like a mirror." },
  { force: 1, minKn: 1, maxKn: 3, description: "Light air", sea: "Ripples with appearance of scales." },
  { force: 2, minKn: 4, maxKn: 6, description: "Light breeze", sea: "Small wavelets, crests have glassy appearance." },
  { force: 3, minKn: 7, maxKn: 10, description: "Gentle breeze", sea: "Large wavelets, crests begin to break." },
  { force: 4, minKn: 11, maxKn: 16, description: "Moderate breeze", sea: "Small waves, fairly frequent white horses." },
  { force: 5, minKn: 17, maxKn: 21, description: "Fresh breeze", sea: "Moderate waves, many white horses." },
  { force: 6, minKn: 22, maxKn: 27, description: "Strong breeze", sea: "Large waves, extensive white foam." },
  { force: 7, minKn: 28, maxKn: 33, description: "High wind", sea: "Sea heaps up, white foam from breaking waves." },
  { force: 8, minKn: 34, maxKn: 40, description: "Gale", sea: "Moderately high waves, foam in well-marked streaks." },
  { force: 9, minKn: 41, maxKn: 47, description: "Strong gale", sea: "High waves, dense foam, visibility affected." },
  { force: 10, minKn: 48, maxKn: 55, description: "Storm", sea: "Very high waves, sea surface white." },
  { force: 11, minKn: 56, maxKn: 63, description: "Violent storm", sea: "Exceptionally high waves." },
  { force: 12, minKn: 64, maxKn: 999, description: "Hurricane", sea: "Air filled with foam and spray." },
];

function getBeaufort(kn: number) {
  const entry = BEAUFORT.find((b) => kn >= b.minKn && kn <= b.maxKn);
  return entry ?? (kn < 0 ? BEAUFORT[0] : BEAUFORT[12]);
}

export function BeaufortScaleCalculator() {
  const [speed, setSpeed] = useState("15");
  const [unit, setUnit] = useState<"kn" | "mph" | "kmh" | "ms">("kn");

  const raw = parseFloat(speed);
  let kn = raw;
  if (unit === "mph") kn = raw / 1.15078;
  if (unit === "kmh") kn = raw / 1.852;
  if (unit === "ms") kn = raw * 1.94384;

  const valid = Number.isFinite(kn) && kn >= 0;
  const beaufort = valid ? getBeaufort(kn) : null;

  return (
    <CalculatorCard title="Beaufort Scale Calculator">
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        Enter wind speed to get Beaufort force and sea state description.
      </p>
      <div className="flex flex-wrap gap-2 items-end mb-4">
        <div>
          <label htmlFor="wind-speed" className="label">Wind speed</label>
          <input
            id="wind-speed"
            type="number"
            min="0"
            step="0.5"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
            className="input-field max-w-[120px]"
          />
        </div>
        <div>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as "kn" | "mph" | "kmh" | "ms")}
            className="input-field w-auto min-w-[80px]"
          >
            <option value="kn">knots</option>
            <option value="mph">mph</option>
            <option value="kmh">km/h</option>
            <option value="ms">m/s</option>
          </select>
        </div>
      </div>
      {valid && beaufort && (
        <div className="rounded-lg bg-slate-100 dark:bg-slate-700/50 p-4 space-y-2">
          <p className="font-medium">Beaufort Force {beaufort.force}</p>
          <p>{beaufort.description}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">{beaufort.sea}</p>
          <p className="text-sm">
            Equivalent: {kn.toFixed(1)} kn · {(kn * 1.15078).toFixed(1)} mph · {(kn * 1.852).toFixed(1)} km/h
          </p>
        </div>
      )}
    </CalculatorCard>
  );
}
