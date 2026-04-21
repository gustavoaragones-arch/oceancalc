/**
 * Phase 6.7 — Crawl acceleration: “recently updated” cluster for homepage / freshness signals.
 * Slugs must match `calculators.json` / `calculators-phase5.json` (see notes inline).
 */
export const RECENTLY_UPDATED_TOOLS = [
  "hull-speed-calculator",
  "rhumb-distance-calculator",
  "initial-bearing-calculator",
  "great-circle-distance-calculator",
  "cross-track-error-calculator",
  "speed-over-ground-calculator",
  "radar-horizon-calculator",
  /** Spec said `geographic-range-calculator`; live slug: */
  "geographic-range-lights-calculator",
  "mercator-scale-factor-calculator",
  /** Spec said `wave-length-calculator`; live slug: */
  "wave-length-from-period-calculator",
] as const;

export type RecentlyUpdatedToolSlug = (typeof RECENTLY_UPDATED_TOOLS)[number];

/** Homepage link copy (descriptive anchors). */
export const RECENTLY_UPDATED_LABELS: Record<string, string> = {
  "hull-speed-calculator":
    "Updated hull speed calculation tool with refined formula handling",
  "rhumb-distance-calculator":
    "Improved rhumb line navigation distance computation",
  "initial-bearing-calculator":
    "Updated bearing calculation accuracy for navigation",
  "great-circle-distance-calculator":
    "Refined great-circle distance computation",
  "cross-track-error-calculator":
    "Enhanced deviation measurement tool for route tracking",
  "speed-over-ground-calculator":
    "Improved speed over ground calculations with vector inputs",
  "radar-horizon-calculator": "Updated radar horizon estimation formulas",
  "geographic-range-lights-calculator":
    "Improved visibility range calculations",
  "mercator-scale-factor-calculator":
    "Refined Mercator scale factor reference for chart work",
  "wave-length-from-period-calculator":
    "Updated deep-water wavelength estimate from wave period",
};
