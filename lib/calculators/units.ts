/**
 * Normalize user-facing unit keys for distance (canonical: nautical miles) and speed (canonical: knots).
 */

export type DistanceUnit = "nmi" | "km" | "mi";
export type SpeedUnit = "knots" | "kmh" | "mph";

const DISTANCE_ALIASES: Record<string, DistanceUnit> = {
  nmi: "nmi",
  nm: "nmi",
  nautical_miles: "nmi",
  nautical_mile: "nmi",
  km: "km",
  kilometer: "km",
  kilometers: "km",
  mi: "mi",
  mile: "mi",
  miles: "mi",
  statute_miles: "mi",
};

const SPEED_ALIASES: Record<string, SpeedUnit> = {
  knots: "knots",
  knot: "knots",
  kn: "knots",
  kmh: "kmh",
  km_h: "kmh",
  "km/h": "kmh",
  mph: "mph",
};

export function normalizeDistanceUnit(u: string): DistanceUnit | null {
  const k = u.toLowerCase().replace(/\s+/g, "_");
  return DISTANCE_ALIASES[k] ?? null;
}

export function normalizeSpeedUnit(u: string): SpeedUnit | null {
  const k = u.toLowerCase().replace(/\s+/g, "_").replace("/", "_");
  return SPEED_ALIASES[k] ?? null;
}

/** Convert distance to nautical miles. */
export function distanceToNmi(value: number, from: string): number {
  const u = normalizeDistanceUnit(from);
  if (!u) return value;
  switch (u) {
    case "nmi":
      return value;
    case "km":
      return value / 1.852;
    case "mi":
      return value / 1.15078;
    default:
      return value;
  }
}

/** Convert speed to knots. */
export function speedToKnots(value: number, from: string): number {
  const u = normalizeSpeedUnit(from);
  if (!u) return value;
  switch (u) {
    case "knots":
      return value;
    case "kmh":
      return value / 1.852;
    case "mph":
      return value / 1.15078;
    default:
      return value;
  }
}

/** Convert nautical miles to another distance unit for display. */
export function nmiToDistanceUnit(nmi: number, to: string): number {
  const u = normalizeDistanceUnit(to);
  if (!u) return nmi;
  switch (u) {
    case "nmi":
      return nmi;
    case "km":
      return nmi * 1.852;
    case "mi":
      return nmi * 1.15078;
    default:
      return nmi;
  }
}

/** Convert knots to another speed unit for display. */
export function knotsToSpeedUnit(kn: number, to: string): number {
  const u = normalizeSpeedUnit(to);
  if (!u) return kn;
  switch (u) {
    case "knots":
      return kn;
    case "kmh":
      return kn * 1.852;
    case "mph":
      return kn * 1.15078;
    default:
      return kn;
  }
}

export function unitLabel(unit: string): string {
  const d = normalizeDistanceUnit(unit);
  if (d === "nmi") return "NM";
  if (d === "km") return "km";
  if (d === "mi") return "mi";
  const s = normalizeSpeedUnit(unit);
  if (s === "knots") return "knots";
  if (s === "kmh") return "km/h";
  if (s === "mph") return "mph";
  return unit;
}
