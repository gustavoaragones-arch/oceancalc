"use client";

import { useState } from "react";
import { CalculatorCard } from "./CalculatorCard";

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

// Haversine formula for great circle distance
function greatCircleNm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3440.065; // Earth radius in nautical miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function GreatCircleDistanceCalculator() {
  const [lat1, setLat1] = useState("40.7128");
  const [lon1, setLon1] = useState("-74.0060");
  const [lat2, setLat2] = useState("51.5074");
  const [lon2, setLon2] = useState("-0.1278");

  const la1 = parseFloat(lat1);
  const lo1 = parseFloat(lon1);
  const la2 = parseFloat(lat2);
  const lo2 = parseFloat(lon2);
  const valid =
    Number.isFinite(la1) &&
    Number.isFinite(lo1) &&
    Number.isFinite(la2) &&
    Number.isFinite(lo2) &&
    Math.abs(la1) <= 90 &&
    Math.abs(la2) <= 90;

  const distNm = valid ? greatCircleNm(la1, lo1, la2, lo2) : 0;
  const distKm = distNm * 1.852;

  return (
    <CalculatorCard title="Great Circle Distance">
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        Enter coordinates in decimal degrees (e.g. 40.71, -74.01).
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Point A</h3>
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              placeholder="Latitude"
              min="-90"
              max="90"
              step="any"
              value={lat1}
              onChange={(e) => setLat1(e.target.value)}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Longitude"
              min="-180"
              max="180"
              step="any"
              value={lon1}
              onChange={(e) => setLon1(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Point B</h3>
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              placeholder="Latitude"
              min="-90"
              max="90"
              step="any"
              value={lat2}
              onChange={(e) => setLat2(e.target.value)}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Longitude"
              min="-180"
              max="180"
              step="any"
              value={lon2}
              onChange={(e) => setLon2(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>
      {valid && (
        <div className="rounded-lg bg-slate-100 dark:bg-slate-700/50 p-4">
          <p className="font-medium">Great circle distance</p>
          <p className="text-lg">{distNm.toFixed(1)} nautical miles</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">{distKm.toFixed(1)} km</p>
        </div>
      )}
    </CalculatorCard>
  );
}
