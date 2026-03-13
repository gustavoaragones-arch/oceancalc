"use client";

import { useState } from "react";
import { CalculatorCard } from "./CalculatorCard";

export function SailingTimeCalculator() {
  const [distance, setDistance] = useState("60");
  const [speed, setSpeed] = useState("6");
  const [distanceUnit, setDistanceUnit] = useState<"nm" | "km">("nm");
  const [speedUnit, setSpeedUnit] = useState<"kn" | "mph" | "kmh">("kn");

  const d = parseFloat(distance);
  const s = parseFloat(speed);
  const valid = Number.isFinite(d) && d > 0 && Number.isFinite(s) && s > 0;

  let distNm = d;
  if (distanceUnit === "km") distNm = d / 1.852;

  let speedKn = s;
  if (speedUnit === "mph") speedKn = s / 1.15078;
  if (speedUnit === "kmh") speedKn = s / 1.852;

  const hours = valid ? distNm / speedKn : 0;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);

  return (
    <CalculatorCard title="Sailing Time Calculator">
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        Distance to cover and speed (boat speed or average speed).
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="distance" className="label">Distance</label>
          <div className="flex gap-2">
            <input
              id="distance"
              type="number"
              min="0.1"
              step="0.1"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="input-field"
            />
            <select
              value={distanceUnit}
              onChange={(e) => setDistanceUnit(e.target.value as "nm" | "km")}
              className="input-field w-auto min-w-[80px]"
            >
              <option value="nm">nm</option>
              <option value="km">km</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="speed" className="label">Speed</label>
          <div className="flex gap-2">
            <input
              id="speed"
              type="number"
              min="0.1"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              className="input-field"
            />
            <select
              value={speedUnit}
              onChange={(e) => setSpeedUnit(e.target.value as "kn" | "mph" | "kmh")}
              className="input-field w-auto min-w-[80px]"
            >
              <option value="kn">knots</option>
              <option value="mph">mph</option>
              <option value="kmh">km/h</option>
            </select>
          </div>
        </div>
      </div>
      {valid && (
        <div className="rounded-lg bg-slate-100 dark:bg-slate-700/50 p-4">
          <p className="font-medium">Estimated time</p>
          <p className="text-lg">
            {h > 0 && `${h} h `}{m} min
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {hours.toFixed(2)} hours
          </p>
        </div>
      )}
    </CalculatorCard>
  );
}
