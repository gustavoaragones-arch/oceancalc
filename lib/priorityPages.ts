import type { CalculatorEntry } from "./types";
import { getCalculators } from "./contentLoader";

/**
 * Phase 6.4.6 — Spec slug list (verbatim). Entries that differ from live
 * `calculator.slug` values are resolved via `PRIORITY_SLUG_CANONICAL`.
 */
export const PRIORITY_CALCULATOR_SLUGS = [
  "nautical-mile-converter",
  "knots-to-kmh",
  "hull-speed-calculator",
  "bearing-calculator",
  "great-circle-distance",
  "fuel-consumption-calculator",
  "vmg-calculator",
] as const;

export type PriorityCalculatorSlugSpec = (typeof PRIORITY_CALCULATOR_SLUGS)[number];

/** Map spec id → actual calculator slug in JSON. */
export const PRIORITY_SLUG_CANONICAL: Record<
  PriorityCalculatorSlugSpec,
  string
> = {
  "nautical-mile-converter": "nautical-mile-converter",
  "knots-to-kmh": "knots-to-kmh",
  "hull-speed-calculator": "hull-speed-calculator",
  "bearing-calculator": "initial-bearing-calculator",
  "great-circle-distance": "great-circle-distance-calculator",
  "fuel-consumption-calculator": "boat-fuel-consumption-calculator",
  "vmg-calculator": "vmg-calculator",
};

export function getPriorityCalculators(): CalculatorEntry[] {
  const all = getCalculators();
  const bySlug = new Map(all.map((c) => [c.slug, c]));
  return PRIORITY_CALCULATOR_SLUGS.map((spec) =>
    bySlug.get(PRIORITY_SLUG_CANONICAL[spec])
  ).filter((c): c is CalculatorEntry => c != null);
}

/** Priority tools first, then remaining calculators (no duplicate slugs). */
export function getCalculatorsWithPriorityFirst(): {
  popular: CalculatorEntry[];
  rest: CalculatorEntry[];
} {
  const popular = getPriorityCalculators();
  const prioritySet = new Set(popular.map((c) => c.slug));
  const rest = getCalculators().filter((c) => !prioritySet.has(c.slug));
  return { popular, rest };
}
