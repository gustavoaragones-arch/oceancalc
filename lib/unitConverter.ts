/**
 * Unit conversion: convert(value, fromUnit, toUnit).
 * Units use underscores in config (e.g. nautical_miles); display names can be separate.
 */

export type LengthUnit =
  | "nautical_miles"
  | "kilometers"
  | "miles"
  | "meters"
  | "feet"
  | "fathoms";

export type SpeedUnit =
  | "knots"
  | "mph"
  | "km_h"
  | "m_s";

export type UnitKey = LengthUnit | SpeedUnit | string;

// Base: meters for length, knots for speed
const LENGTH_TO_METERS: Record<string, number> = {
  nautical_miles: 1852,
  nm: 1852,
  kilometers: 1000,
  km: 1000,
  miles: 1609.344,
  meters: 1,
  m: 1,
  feet: 0.3048,
  ft: 0.3048,
  fathoms: 1.8288,
  fathoms_ft: 6 * 0.3048,
};

const SPEED_TO_KNOTS: Record<string, number> = {
  knots: 1,
  kn: 1,
  mph: 1 / 1.15078,
  km_h: 1 / 1.852,
  kmh: 1 / 1.852,
  m_s: 1 / 0.514444,
  ms: 1 / 0.514444,
};

/** Normalize unit key for lookup (e.g. "km/h" -> "km_h") */
function normalizeKey(unit: string): string {
  return unit.replace(/\s+/g, "_").replace("/", "_").toLowerCase();
}

function getLengthFactor(unit: string): number {
  const k = normalizeKey(unit);
  const v = LENGTH_TO_METERS[k];
  if (v !== undefined) return v;
  if (k === "fathoms" || k === "fathom") return 1.8288;
  return LENGTH_TO_METERS[unit] ?? NaN;
}

function getSpeedFactor(unit: string): number {
  const k = normalizeKey(unit);
  const v = SPEED_TO_KNOTS[k];
  if (v !== undefined) return v;
  return SPEED_TO_KNOTS[unit] ?? NaN;
}

/**
 * Convert length from one unit to another.
 * Supported: nautical_miles, nm, kilometers, km, miles, meters, m, feet, ft, fathoms.
 */
export function convertLength(value: number, fromUnit: string, toUnit: string): number {
  const from = getLengthFactor(fromUnit);
  const to = getLengthFactor(toUnit);
  if (!Number.isFinite(from) || !Number.isFinite(to)) return NaN;
  return (value * from) / to;
}

/**
 * Convert speed from one unit to another.
 * Supported: knots, kn, mph, km_h, km/h, m_s, m/s.
 */
export function convertSpeed(value: number, fromUnit: string, toUnit: string): number {
  const from = getSpeedFactor(fromUnit);
  const to = getSpeedFactor(toUnit);
  if (!Number.isFinite(from) || !Number.isFinite(to)) return NaN;
  return (value * from) / to;
}

/**
 * Generic convert: detects unit type by checking known keys. Use for engine when unit is from config.
 */
export function convert(value: number, fromUnit: string, toUnit: string): number {
  const fromNorm = normalizeKey(fromUnit);
  const toNorm = normalizeKey(toUnit);
  if (fromNorm === toNorm) return value;
  if (LENGTH_TO_METERS[fromNorm] !== undefined || LENGTH_TO_METERS[fromUnit] !== undefined) {
    return convertLength(value, fromUnit, toUnit);
  }
  if (SPEED_TO_KNOTS[fromNorm] !== undefined || SPEED_TO_KNOTS[fromUnit] !== undefined) {
    return convertSpeed(value, fromUnit, toUnit);
  }
  return NaN;
}

/** List of length unit keys for dropdowns */
export const LENGTH_UNITS: string[] = [
  "nautical_miles",
  "kilometers",
  "miles",
  "meters",
  "feet",
  "fathoms",
];

/** List of speed unit keys for dropdowns */
export const SPEED_UNITS: string[] = ["knots", "mph", "km_h", "m_s"];

/** Human-readable label for unit key */
export function unitLabel(unit: string): string {
  const labels: Record<string, string> = {
    nautical_miles: "Nautical miles",
    nm: "nm",
    kilometers: "Kilometers",
    km: "km",
    miles: "Miles",
    meters: "Meters",
    feet: "Feet",
    fathoms: "Fathoms",
    knots: "Knots",
    mph: "mph",
    km_h: "km/h",
    m_s: "m/s",
    degrees: "°",
    ratio: "",
  };
  return labels[normalizeKey(unit)] ?? unit.replace(/_/g, " ");
}
