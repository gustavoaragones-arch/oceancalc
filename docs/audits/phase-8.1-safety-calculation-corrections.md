# Phase 8.1 — Safety-Critical Calculation Corrections & Reverification

**Date:** 2026-08-24
**Starting commit:** `3c98f268bb1993801fb849f907ed4f9f6e4dc10e` (branch `main`, working tree clean except the three untracked Phase 8.0 audit documents)
**Basis:** `docs/audits/phase-8.0-maritime-accuracy-audit.md` (unmodified in this phase), `docs/audits/phase-8.0-calculator-verification-matrix.md` (unmodified), `docs/audits/phase-8.0-maritime-standards-register.md` (unmodified).

## Executive Status

# FIXED — READY FOR RE-AUDIT

All three live defects identified by Phase 8.0 (radar horizon, wave height, true/magnetic heading wraparound) were independently reproduced, corrected, and independently reverified against physical/mathematical models that do not depend on OceanCalc's own code. A new regression test suite (113 assertions) passes, along with `tsc --noEmit`, `next lint`, and a full production build (`next build`, 308 static pages generated, all 45 tool routes present). No file outside the scope of these three defects was modified.

---

## Radar Horizon

**Original defect:** `lib/formulaParser.ts`, function `radar_horizon_nm(h_m)`, wired to the live UI via `data/calculators-phase5.json` slug `radar-horizon-calculator` (input `h_m`, canonical unit "meters").

**Original formula:** `1.23 × √h_m` — applying a coefficient calibrated for height in **feet** directly to a height value in **meters**, with no conversion.

**Independent pre-fix reproduction (this phase, before touching code):**

| Height | Old OceanCalc output | Independent 4/3-Earth-radius expected (`d = √(2·(4/3)·6,371,000·h) / 1852`) | Old relative error |
|---|---:|---:|---:|
| 5 m | 2.7504 nm | 4.9766 nm | −44.7% |
| 12 m | 4.2608 nm | 7.7097 nm | −44.7% |
| 20 m | 5.5007 nm | 9.9532 nm | −44.7% |
| 30 m | 6.7370 nm | 12.1901 nm | −44.7% |

This confirms the Phase 8.0 finding (≈55.3% of correct value, i.e. ≈44.7% understatement) independently, before any code change.

**Corrected implementation** (`lib/formulaParser.ts`):

```ts
/**
 * Radar horizon (nm) from antenna height in METERS, 4/3-Earth-radius standard-refraction approximation.
 * The 1.23 coefficient is calibrated for height in feet (standard radar-horizon references, e.g. d(nm) ≈ 1.22-1.23 × √h_ft);
 * the meters input is converted to feet before applying it so the coefficient's unit assumption is respected.
 */
function radar_horizon_nm(h_m: number): number {
  const h_ft = Math.max(0, h_m) / 0.3048;
  return 1.23 * Math.sqrt(h_ft);
}
```

This is Option A from the implementation brief: the input is explicitly converted from meters to feet (`h_ft = h_m / 0.3048`, the exact international-foot conversion already used identically elsewhere in this file) before the existing, source-verified 1.23 feet-calibrated coefficient is applied. The unit relationship is now unambiguous from the code itself — no unexplained bare coefficient is applied to a meters value.

**Authoritative physical model:** 4/3-Earth-radius standard-atmosphere refraction model (`d = √(2·k·Rₑ·h)`, k=4/3), the same model documented in Phase 8.0's standards register (Furuno "Radar Horizon" technical note; Wikipedia "Radar horizon"; independently re-derived from first principles).

**Before/after/independent comparison:**

| Height | Old (buggy) | New (fixed) | Independent expected (4/3-Earth, Rₑ=6,371,000 m) | New relative error |
|---|---:|---:|---:|---:|
| 5 m | 2.7504 nm | 4.9818 nm | 4.9766 nm | +0.10% |
| 12 m | 4.2608 nm | 7.7177 nm | 7.7097 nm | +0.10% |
| 20 m | 5.5007 nm | 9.9635 nm | 9.9532 nm | +0.10% |
| 30 m | 6.7370 nm | 12.2028 nm | 12.1901 nm | +0.10% |

The residual +0.10% is attributable to the difference between the 1.23 rule-of-thumb coefficient (rounded, as published in radar-horizon references) and a raw first-principles calculation using Rₑ=6,371,000 m exactly — i.e., constant-rounding precision, not a units or formula error. This matches the "confirm the discrepancy is attributable only to rounding/constant precision" requirement.

**Validation edge cases:** `radar_horizon_nm(0) = 0` (no NaN/negative); negative height clamps to 0 via the existing `Math.max(0, h_m)` guard (unchanged behavior, not part of this defect).

**Final status:** **FIXED.** Verified independently against a first-principles physical model, not against OceanCalc's own prior output.

---

## Wave Height

**Original defect:** `data/calculators.json`, slug `wave-height-calculator`, `engine.outputs[0].formula` and `engine.outputs[1].formula`.

**Original formulas:**
- `waveHeight_m`: `"0.024 * windSpeed * windSpeed"`
- `waveHeight_ft`: `"0.024 * windSpeed * windSpeed * 3.28084"`

`windSpeed` is canonicalized to **knots** by `components/calculator-engine/CalculatorEngine.tsx` (confirmed by tracing the engine's unit-conversion logic — the input's canonical `unit` is `"knots"`, so mph/km_h selections are converted to knots before the formula ever runs). The 0.024 coefficient corresponds to the published Sverdrup-Munk-Bretschneider (SMB) fully-developed-sea approximation `Hs(m) ≈ 0.024·U²`, calibrated for **U in m/s**.

**Independent pre-fix reproduction (this phase):**

| Wind speed (kn) | Old OceanCalc output (m) | Independent `0.024·(kn·0.514444)²` |
|---:|---:|---:|
| 10 | 2.4000 | 0.6352 |
| 20 | 9.6000 | 2.5407 |
| 30 | 21.6000 | 5.7165 |
| 40 | 38.4000 | 10.1627 |
| 50 | 60.0000 | 15.8792 |

Old-to-independent-expected ratio is a near-constant ≈3.78× (matches `(1/0.514444)² = 3.7793`, exactly the square of the missing knot→m/s conversion — confirming the units-calibration diagnosis dimensionally, not just numerically).

**Corrected implementation** (`data/calculators.json`, `wave-height-calculator.engine.outputs`):

```json
{ "name": "waveHeight_m",  "formula": "0.024 * pow(windSpeed * 0.514444, 2)" }
{ "name": "waveHeight_ft", "formula": "0.024 * pow(windSpeed * 0.514444, 2) * 3.28084" }
```

The knot→m/s conversion constant `0.514444` is not a new/invented value — it is the exact constant already used identically throughout the repository (`lib/formulaParser.ts`'s use in speed conversions, `data/calculators.json`'s `knots-speed-converter.ms` output, `data/calculators-phase5.json`'s `meters-second-knots-converter`). `pow()` is an existing built-in of `lib/formulaParser.ts`'s expression parser (`MATH_FUNCTIONS.pow`); no new parser function was needed for this fix. No change was made to `lib/formulaParser.ts`, `lib/unitConverter.ts`, or `CalculatorEngine.tsx` for this defect — the fix is entirely within the JSON formula string, which is where the defect lived.

**Before/after/independent comparison:**

| Wind speed (kn) | Old (buggy, m) | New (fixed, m) | Independent expected | New relative error | Old/new ratio |
|---:|---:|---:|---:|---:|---:|
| 10 | 2.4000 | 0.6352 | 0.6352 | ~0% | 3.78× |
| 20 | 9.6000 | 2.5407 | 2.5407 | ~0% | 3.78× |
| 30 | 21.6000 | 5.7165 | 5.7165 | ~0% | 3.78× |
| 40 | 38.4000 | 10.1627 | 10.1627 | ~0% | 3.78× |
| 50 | 60.0000 | 15.8792 | 15.8792 | ~0% | 3.78× |

The corrected output is no longer in the 4–6× inflated range identified by Phase 8.0's WMO/sea-state cross-check (Phase 8.0's own WMO comparison found 20 kn/30 kn/50 kn ratios of ≈5×/5.4×/6.7× against WMO's *probable* wave height table; the fix here removes the ≈3.78× units-error component exactly, which is the objective of this phase — matching a units error, not re-deriving a new empirical model to match WMO exactly, per the explicit instruction not to substitute a different formula).

**Scope discipline:** No fetch-limitation, duration-limitation, depth-limitation, spectral, or wind-wave-growth model was added. The formula remains the same SMB-style `H = 0.024·U²` relationship; only the unit of `U` fed into it was corrected.

**Validation edge case:** `waveHeight_m` at 0 kn = 0 (unchanged, no regression).

**Content now stale (flagged, not touched — per Section 18 exception process):**
1. `data/calculators.json` `wave-height-calculator.engine.formulaDisplay`: `"Simplified: H ≈ 0.024 × wind_speed_kn² (open water, fetch-limited)"` — this text describes the **old, incorrect** knots-based relationship. It is now mathematically inconsistent with what the calculator computes. Left untouched per Section 18; flagged here for Phase 8.3.
2. `data/calculators.json` `wave-height-calculator.examples`: `["20 kn wind → ~9.6 m waves (open ocean)", "10 kn → ~2.4 m", "30 kn → ~21.6 m (storm)"]` — these are the **old (buggy) computed values**, now stale (correct values are ≈2.54 m, ≈0.64 m, ≈5.72 m respectively). Left untouched per Section 18 (same treatment as the great-circle NYC/London example in Phase 8.0); flagged here for Phase 8.3.

**Final status:** **FIXED** (unit conversion corrected; two content strings identified as now-stale and explicitly deferred to Phase 8.3, not silently rewritten).

---

## True/Magnetic Heading

**Original defect:** `data/calculators-phase5.json`, slug `true-magnetic-heading-calculator`, `engine.outputs[0].formula = "mag + var"`, no normalization.

**Sign convention:** East-positive / West-negative, `True = Magnetic + Variation`. Confirmed correct in Phase 8.0 and **unchanged** in this phase — only normalization was added.

**Independent pre-fix reproduction (this phase, `mag + var` with no modulo):**

| mag | var | Old (buggy) raw output | Valid heading (0≤x<360)? |
|---:|---:|---:|---|
| 270 | −10 | 260 | Yes (this case happened to already be valid) |
| 350 | +20 | 370 | **No** |
| 5 | −20 | −15 | **No** |
| 350 | +10 | 360 | **No** (360 is out of range; a valid heading is 0≤x<360) |
| 10 | −10 | 0 | Yes |
| 350 | +370 | 720 | **No** |
| 10 | −370 | −360 | **No** |

**Normalization mechanism added** (`lib/formulaParser.ts`, `MATH_FUNCTIONS`):

```ts
/** Normalize an angle in degrees to the range [0, 360). Handles negative inputs and multiple revolutions. */
mod360: (deg) => ((deg % 360) + 360) % 360,
```

This is the double-modulo form required to handle JavaScript's sign-preserving `%` operator correctly for negative inputs (a bare `deg % 360` would return `-15` for `mod360(-15)`, not `345`).

**Formula updated** (`data/calculators-phase5.json`):

```json
{ "name": "true", "formula": "mod360(mag + var)" }
```

No change to input units, the variation sign convention, labels, or calculator purpose — only the output expression gained a wrapping `mod360(...)`.

**Before/after/independent comparison (independent expected computed as `((mag+var) % 360 + 360) % 360` in a separate script, not by calling OceanCalc's own function):**

| mag | var | Old (buggy) | New (fixed) | Independent expected | Match |
|---:|---:|---:|---:|---:|---|
| 270 | −10 | 260 | 260 | 260 | ✓ (no regression on normal case) |
| 350 | +20 | 370 | 10 | 10 | ✓ |
| 5 | −20 | −15 | 345 | 345 | ✓ |
| 350 | +10 | 360 | 0 | 0 | ✓ |
| 10 | −10 | 0 | 0 | 0 | ✓ |
| 350 | +370 | 720 | 0 | 0 | ✓ |
| 10 | −370 | −360 | 0 | 0 | ✓ |

Every new output satisfies `0 ≤ heading < 360`, verified programmatically for all seven cases in the regression suite (`scripts/test-formula-engine.ts`).

**Note on input validation:** `var` (variation) has no `min`/`max` rule in `data/calculators-phase5.json`, so extreme test inputs like `+370` and `−370` are not blocked by the existing validation and do reach the formula — this is pre-existing, unchanged behavior, not something this phase altered. It happens to be what makes the "multiple rotations" test case exercisable end-to-end.

**Final status:** **FIXED.** Sign convention unchanged and reverified; wraparound defect eliminated for all tested boundary cases.

---

## Regression Testing

No test framework existed in this repository prior to this phase (`package.json` had no `test` script; no Jest/Vitest/Mocha dependency; no `*.test.*`/`*.spec.*` files found). Per Section 15's instruction to "find the project's existing testing architecture and integrate regression tests into the appropriate location," and given none existed, a minimal, dependency-free test script was added, consistent with the project's existing `npx tsx scripts/*.ts` convention (already used by `scripts/generate-sitemap.ts` and wired via `npm run sitemap`):

- **New file:** `scripts/test-formula-engine.ts` — imports the real `parseFormula` and `DEFAULT_CUSTOM_FUNCTIONS` from `lib/formulaParser.ts` (not a reimplementation) and runs 113 assertions covering: the new `mod360()` helper in isolation; the three corrected formulas against independent expected values; every pre-existing custom function in `lib/formulaParser.ts` (haversine, hull speed, initial bearing, rhumb distance, geographic range, cross-track error, speed over ground, Mercator scale, longitude-minute, wave period, apparent wind, Beaufort, wind chill) to guard against regressions from the shared-file edit; and a data-integrity pass that parses and evaluates every `engine.outputs[].formula` string in both `data/calculators.json` and `data/calculators-phase5.json` with each calculator's own default input values, catching any of the 45 calculators that might fail to parse or evaluate to `NaN`.
- **New `package.json` script:** `"test": "npx tsx scripts/test-formula-engine.ts"`.

### Commands run and results

| Command | Result |
|---|---|
| `npm test` (`npx tsx scripts/test-formula-engine.ts`) | **PASS** — 113 passed, 0 failed |
| `npx tsc --noEmit` | **PASS** — no output, no errors |
| `npm run lint` (`next lint`) | **PASS** — "No ESLint warnings or errors" |
| `npm run build` (`next build`, full production build) | **PASS** — compiled successfully, 308/308 static pages generated, all 45 `/tools/[slug]` routes present in `out/tools/` including the three corrected calculators, no build errors |

Two false failures were caught and corrected *within the test script itself* during this phase (not code regressions): the initial draft of `scripts/test-formula-engine.ts` had incorrect expected values for `speed_over_ground_kn`, `beaufort(3.5)`, `beaufort(6.5)`, and `windChillF(35,15)`, copied from imprecise rounding in earlier discussion rather than exact computation. These were independently recomputed via a standalone Node script, confirmed to match the *existing, unmodified* implementation exactly, and the test's expected values were corrected — the implementations themselves were never changed for these four cases. This is called out explicitly because Section 16 requires verifying "every existing custom function still behaves exactly as before," and the true baseline (not the test's initially-wrong assumption) is what's reported here.

---

## Scope Compliance

- **Phase 8.2 (dead-code cleanup) — NOT implemented.** `components/calculators/BeaufortScale.tsx` (the unreachable component with the boundary-gap bug identified in Phase 8.0 Finding D-1) was not touched, and remains dead code, exactly as instructed.
- **Phase 8.3 (content corrections) — NOT implemented.** The great-circle NYC/London example, the distance-to-horizon metric-formula text, the "nautical mile = 1′ latitude" wording, the geographic-range-of-lights example, the wind-chill upper-bound validation, and the cable/shackle convention disclosure were all left untouched. Two *newly* stale content strings surfaced by the wave-height fix (its `formulaDisplay` and `examples` fields) were identified and reported above rather than silently rewritten, per the Section 18 exception process.
- **Phase 8.4 (cable/shackle disclosure) — NOT implemented.**
- **No unrelated application code was modified.** No SEO metadata, schema, AdSense configuration, routing, slugs, calculator IDs, page structure, navigation, or unrelated formula/content was changed.

## Files Changed

| File | Change |
|---|---|
| `lib/formulaParser.ts` | Fixed `radar_horizon_nm()` unit handling (meters→feet conversion added); added `mod360()` to `MATH_FUNCTIONS` |
| `data/calculators.json` | Fixed `wave-height-calculator`'s two output formulas (knots→m/s conversion added via existing `0.514444` constant and existing `pow()` function) |
| `data/calculators-phase5.json` | Fixed `true-magnetic-heading-calculator`'s output formula (wrapped in `mod360(...)`) |
| `scripts/test-formula-engine.ts` | **New.** Regression test suite (113 assertions) |
| `package.json` | Added `"test"` script |
| `docs/audits/phase-8.1-safety-calculation-corrections.md` | **New.** This document |

No other files were modified. `docs/audits/phase-8.0-*.md` were read but not edited.

---

## Final Recommendation

The three live defects identified by Phase 8.0 have been corrected and independently reverified against physical/mathematical models external to OceanCalc's own code, not merely re-tested against the corrected code's own output. The full regression suite, type check, lint, and production build all pass. Two calculator-content strings (the wave-height `formulaDisplay` and `examples`) were newly rendered stale by the fix and are explicitly flagged for Phase 8.3 rather than corrected here.

This project is ready for **Phase 8.1 re-audit / recertification review** by an independent audit pass (not self-declared here). Certification status remains a decision for that independent re-audit, not for this implementation phase.
