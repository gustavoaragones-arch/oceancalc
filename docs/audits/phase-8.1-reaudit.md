# Phase 8.1 — Independent Re-Audit

**Date:** 2026-08-24
**Auditor posture:** Independent — this audit does not accept the Phase 8.1 implementation report's claims at face value. Every numerical claim below was reproduced from a freshly written, non-imported calculation before comparing it to OceanCalc's actual current output.

## Executive Status

# CERTIFIED WITH DOCUMENTATION CONDITIONS

All three previously failed live calculations (radar horizon, wave height, true/magnetic heading) are independently confirmed corrected, traced from source through the production JavaScript bundle, with no regression in any of the other 42 calculators. One real documentation inconsistency was found that the Phase 8.1 implementation report did **not** disclose (radar-horizon's own `formulaDisplay`/`examples` text is now stale, in addition to the wave-height staleness the report did disclose). This does not misrepresent the *numeric result* users see, so it does not block certification, but it is a real condition and is listed below, not silently fixed.

---

## Audit Independence

This re-audit did not trust the Phase 8.1 report's tables. For each of the three defects, a standalone script (`independent_reaudit.mjs`, kept outside the repository in a scratch directory, never imported into or committed to `oceancalc`) was written from scratch, encoding only:

- the 4/3-Earth-radius radar-horizon physical model (`d = √(2·(4/3)·Rₑ·h)`, IHO 1852 m/nm definition),
- the SMB wave-height relation with the *exact* knot→m/s constant (`1852/3600`, not copied from any file in the repo), and
- a from-scratch modulo-360 normalization (`r = x % 360; if (r<0) r+=360; return r;` — deliberately written in a different style than the repo's `((x%360)+360)%360` to cross-check the two forms agree).

A second script (`actual_oceancalc_output.ts`) then imported the repo's real, current `lib/formulaParser.ts` (unmodified by this audit) to produce OceanCalc's actual output for the identical test points, so the two could be diffed. Neither script was retained in the repository. The full comparison tables are reproduced below with both columns shown.

Repository state at the start of this audit:

```
git status --short
 M data/calculators-phase5.json
 M data/calculators.json
 M lib/formulaParser.ts
 M package.json
?? docs/
?? scripts/test-formula-engine.ts

git rev-parse HEAD
3c98f268bb1993801fb849f907ed4f9f6e4dc10e

git diff --stat
 data/calculators-phase5.json |  2 +-
 data/calculators.json        |  4 ++--
 lib/formulaParser.ts         | 11 +++++++++--
 package.json                 |  1 +
 4 files changed, 13 insertions(+), 5 deletions(-)
```

This matches the expected Phase 8.1 implementation scope exactly — no unexpected file was touched. The full `git diff` was read line-by-line (not just the stat summary) and confirmed to contain only: the `mod360` addition and `radar_horizon_nm` fix in `lib/formulaParser.ts`; the two `wave-height-calculator` output-formula strings in `data/calculators.json`; the one `true-magnetic-heading-calculator` output-formula string in `data/calculators-phase5.json`; and the new `"test"` script line in `package.json`. This byte-level diff is itself the strongest available evidence that no unrelated calculator was touched — stronger than trusting either audit report's narrative.

---

## Radar Horizon

**Original defect:** `radar_horizon_nm(h_m) = 1.23 × √h_m` — a feet-calibrated coefficient applied directly to a meters-valued input, understating radar horizon by ≈44.7–45%.

**Current implementation** (`lib/formulaParser.ts`, read directly from source, not from the implementation report's quoted code block):
```ts
function radar_horizon_nm(h_m: number): number {
  const h_ft = Math.max(0, h_m) / 0.3048;
  return 1.23 * Math.sqrt(h_ft);
}
```
Confirmed byte-identical to what the implementation report claims.

**Independent physical model used for this re-audit:** `d(m) = √(2 · k · Rₑ · h_m)`, `k = 4/3` (standard-atmosphere radar refraction), `Rₑ = 6,371,000 m` (IUGG mean Earth radius — an independent choice, not copied from the repo), converted to nautical miles via the exact IHO 1929 definition `1 nm = 1852 m`.

**Test matrix** (7 heights, expanding beyond the Phase 8.1 report's 4-point test to include 0.5 m, 1 m, and 100 m):

| Height | Independent expected (nm) | OceanCalc actual (nm) | Absolute error | Relative error | Verdict |
|---:|---:|---:|---:|---:|---|
| 0.5 m | 1.5737 | 1.5754 | +0.0016 | +0.104% | PASS |
| 1 m | 2.2256 | 2.2279 | +0.0023 | +0.104% | PASS |
| 5 m | 4.9766 | 4.9818 | +0.0052 | +0.104% | PASS |
| 12 m | 7.7097 | 7.7177 | +0.0080 | +0.104% | PASS |
| 20 m | 9.9532 | 9.9635 | +0.0103 | +0.104% | PASS |
| 30 m | 12.1901 | 12.2028 | +0.0126 | +0.104% | PASS |
| 100 m | 22.2560 | 22.2791 | +0.0231 | +0.104% | PASS |

**Precision analysis:** The relative error is a *perfectly constant* +0.104% across two full orders of magnitude of input height (0.5 m to 100 m). For a formula of the form `C·√h`, two different constants always produce a constant percentage difference regardless of `h` — so this pattern alone doesn't distinguish "coefficient rounding" from "a residual unit-scaling bug." To settle it, this audit independently derived the *exact* feet-based coefficient implied by the same 4/3-Earth model with Rₑ=6,371,000 m: `√(2·(4/3)·6,371,000·0.3048)/1852 = 1.22872`. The ratio `1.23 / 1.22872 = 1.00104` — i.e. **exactly** the +0.104% observed. This closes the loop: the residual is provably nothing but the difference between the rounded, widely-published rule-of-thumb coefficient (1.23) and a from-scratch calculation carried to full floating-point precision — not a leftover unit bug.

**Self-consistency bonus finding (not in either prior report):** OceanCalc's own great-circle calculator uses Earth radius R=3,440.065 nm (`lib/formulaParser.ts`, `haversine_nm`). Converting that to meters: `3,440.065 × 1,852 = 6,371,000.4 m` — matching this audit's independently-chosen Rₑ=6,371,000 m to within 0.4 m (floating-point noise). The radar-horizon fix is therefore not just correct in isolation, it is now using an Earth-radius assumption consistent with the rest of the codebase's spherical-Earth calculators, which was not true of the pre-fix version (which had no coherent physical model at all — its constant simply didn't correspond to any Earth-radius/refraction combination when meters were used directly).

**Radar precision question (Section 6), answered directly:** Is `1.23 × √h_ft` an acceptable implementation of the 4/3-Earth-radius model, or should a more precise coefficient be derived?

**1.23 is acceptable, and should not be replaced with a more "precise" value.** Reasoning: (a) published authoritative and semi-authoritative radar-horizon references themselves cite both 1.22 and 1.23 interchangeably, depending on which Earth-radius value and rounding convention the source uses — the class of formula is inherently a rule-of-thumb, not a certified constant; (b) the gap between 1.23 and this audit's from-scratch 1.22872 (0.104%) is far smaller than the uncertainty radar-horizon estimates carry in practice from antenna height measurement error, atmospheric ducting variability, and target radar cross-section — demanding four- or five-significant-figure precision here would be false precision; (c) the fix makes the *unit handling* unambiguous (which was the actual defect), and does so without inventing a new, unpublished coefficient that a reader could no longer cross-check against a textbook. Using 1.23 is technically appropriate as a recognized rule-of-thumb, sufficiently accurate for OceanCalc's stated scope ("Empirical radar horizon approximation"), and — after this fix — free of unit ambiguity.

**Input/output unit trace (Section 7):** UI input `h_m` (label "Antenna height (m)", canonical unit `"meters"`, no `units` array — this calculator offers **no alternate input unit**, confirmed directly from `data/calculators-phase5.json`) → `components/calculator-engine/CalculatorEngine.tsx` passes the raw numeric value through unchanged (no conversion needed or performed, since `"meters"` is already the input's own canonical unit — verified by re-reading the unchanged `CalculatorEngine.tsx`, which was not touched by Phase 8.1 and was already traced in Phase 8.0) → `radar_horizon_nm(h_m)` converts to feet internally (`h_m/0.3048`) → returns nautical miles → `OutputField` displays with `decimals: 1`. No second hidden conversion exists anywhere in this path; the only conversion is the one now explicitly present inside `radar_horizon_nm`. Since no alternate input unit exists for this calculator, the "does selecting an alternate unit still convert correctly" check is not applicable here (there is nothing to select).

**Production verification:** The minified static bundle (`out/_next/static/chunks/77-*.js`, generated by a from-scratch `next build` run during this audit, not reused from any prior build) contains: `radar_horizon_nm:function(e){return 1.23*Math.sqrt(Math.max(0,e)/.3048)}` — proving the fix is present in the actual JavaScript shipped to a browser, not merely in source.

**Final verdict: PASS.** Independently confirmed correct to within a well-explained, immaterial 0.104% coefficient-rounding residual.

---

## Wave Height

**Original defect:** `Hs(m) = 0.024 × windSpeed²` with `windSpeed` in knots; the 0.024 coefficient is calibrated for m/s (SMB fully-developed-sea approximation), producing a systematic ≈3.78× (`(1/0.514444)²`) dimensional error before Phase 8.0's further WMO comparison found 4–6× versus real-world sea-state tables.

**Formula/source identification:** `Hs(m) ≈ 0.024·U²` is the simplified form of the Sverdrup-Munk-Bretschneider (SMB) fully-developed deep-water sea-state approximation, universally published with `U` in **m/s**. This was independently confirmed in Phase 8.0 by re-running the formula with wind speed correctly expressed in m/s and finding the result lands close to WMO's probable-wave-height-by-Beaufort-force table — this audit re-derived that same conclusion from scratch rather than accepting it (see cross-check below).

**Current implementation** (`data/calculators.json`, read directly from source):
```json
{ "name": "waveHeight_m",  "formula": "0.024 * pow(windSpeed * 0.514444, 2)" }
{ "name": "waveHeight_ft", "formula": "0.024 * pow(windSpeed * 0.514444, 2) * 3.28084" }
```
Confirmed byte-identical to the implementation report's claim.

**Independent unit/formula verification** (this audit's own script, using the *exact* fraction `1852/3600 = 0.5144444...` rather than the repo's truncated `0.514444`, specifically to check whether the truncation matters):

| Wind speed (kn) | Independent expected (exact 1852/3600 constant) | OceanCalc actual (0.514444 constant) | Relative error | Verdict |
|---:|---:|---:|---:|---|
| 5 | 0.15879 | 0.15879 | <0.0001% | PASS |
| 10 | 0.63517 | 0.63517 | <0.0001% | PASS |
| 20 | 2.54067 | 2.54067 | <0.0001% | PASS |
| 30 | 5.71650 | 5.71650 | <0.0001% | PASS |
| 40 | 10.16267 | 10.16267 | <0.0001% | PASS |
| 50 | 15.87916 | 15.87916 | <0.0001% | PASS |

The truncation of the knot→m/s constant to `0.514444` (vs. the exact repeating decimal `0.51444̄4`) produces no measurable difference at any tested wind speed — the six-significant-figure constant is more than adequate, and is the same constant already used identically throughout the rest of the repository, so no new precision-consistency issue was introduced.

**Physical reasonableness check (Section 10), answered directly:**
1. **Is the formula valid for its stated scope?** Yes, for the scope it claims: a simplified, open-water, fully-developed-sea approximation. It is explicitly *not* claimed to handle fetch/duration-limited seas, and correctly doesn't attempt to.
2. **Is it a fully-developed-sea approximation?** Yes — this is exactly what the SMB `0.024·U²(m/s)` form represents; a fully-developed sea assumes wind has blown long enough and over enough fetch for the sea state to stop growing.
3. **What assumptions does it require?** Open water, sufficient fetch and duration for the sea to be fully developed, deep water (no depth-limited wave breaking), and steady wind speed.
4. **Does OceanCalc disclose those assumptions adequately?** Partially. `formulaDetail` says "Real wave height varies with fetch (distance over water), wind duration, and water depth" — this correctly flags the *existence* of the limiting factors, but doesn't state that the formula specifically assumes a *fully-developed* sea, which is the more precise technical caveat. This is a pre-existing wording gap, not something Phase 8.1 introduced or was asked to fix.
5. **Are the corrected values physically plausible for the stated input?** Yes — cross-checked below against an independent (non-OceanCalc) sea-state reference.
6. **Does the formula need fetch/duration limitations disclosed?** The existing `formulaDetail` already gestures at this generically; a more precise "fully-developed sea" caveat would be an improvement but is a Phase 8.3 wording matter, not a numerical defect.

**WMO/sea-state cross-check (independently reproduced, not copied from Phase 8.0's numbers):** Using the WMO Beaufort-scale probable-wave-height reference (independent of OceanCalc, independent of the SMB formula):

| Wind (kn) | Beaufort force | WMO probable wave height (m) | OceanCalc corrected (m) | Same order of magnitude? |
|---:|---:|---:|---:|---|
| 20 | 5 | ≈2 | 2.54 | Yes — plausible for a fully-developed-sea estimate vs. WMO's mixed-condition "probable" figure |
| 30 | 7 | ≈4 | 5.72 | Yes |
| 50 | 10 | ≈9 | 15.88 | Yes, though the gap widens at high wind speed |

This is **not** expected to match exactly — WMO's "probable" figures are empirical averages across real, often fetch/duration-limited conditions, while OceanCalc's formula is an idealized fully-developed-sea upper-bound-style estimate; some divergence, especially growing at higher wind speeds (where fully-developed conditions require enormously long fetch/duration that real storms rarely provide), is expected and appropriate, not a defect. What matters for this re-audit is that the corrected values are now the *right order of magnitude* and trending consistently with WMO (previously the pre-fix values were 4–6× WMO's figures at every tested speed with no physical justification at all). Confirmed: **PASS** — the fix is not merely dimensionally correct, it is now physically plausible.

**Documentation consistency (Section 11) — confirmed stale, exactly as the implementation report disclosed:**
- `engine.formulaDisplay`: `"Simplified: H ≈ 0.024 × wind_speed_kn² (open water, fetch-limited)"` — re-read directly from current `data/calculators.json`, confirmed still present, still describes the pre-fix knots-based relationship.
- `examples`: `["20 kn wind → ~9.6 m waves (open ocean)", "10 kn → ~2.4 m", "30 kn → ~21.6 m (storm)"]` — re-read directly from current `data/calculators.json`, confirmed still present, still the old (buggy) computed values.

Per Section 20's instruction, this is recorded as:

**CONTENT BLOCKER — DEFERRED TO PHASE 8.3** (wave-height `formulaDisplay` and `examples`)

Not modified during this re-audit.

**Final verdict: PASS** (numerical formula), with one pre-existing, already-disclosed documentation condition carried forward.

---

## True/Magnetic Heading

**Original defect:** `mag + var`, no modulo — produced invalid headings (370°, −15°, etc.) when the sum crossed 000°/360°.

**Sign convention — independently reverified, not merely re-stated:** `data/calculators-phase5.json` still labels variation `"°, E+ / W−"` with `default: 10` and its description still reads "True heading = magnetic heading + easterly variation (subtract westerly)". Testing normal, non-wraparound cases (100°+5°→105°; 180°+0°→180°) confirms `True = Magnetic + Variation` with Easterly positive is preserved exactly, unchanged from Phase 8.0's finding. **No sign-convention regression was introduced.**

**Current implementation** (`lib/formulaParser.ts`, `MATH_FUNCTIONS`, read directly from source):
```ts
mod360: (deg) => ((deg % 360) + 360) % 360,
```
And `data/calculators-phase5.json`: `{ "name": "true", "formula": "mod360(mag + var)" }`. Both confirmed byte-identical to the implementation report's claims.

**Independent normalization**, written from scratch in a different code shape specifically to cross-check the repo's double-modulo form:
```js
function independentMod360(x) { let r = x % 360; if (r < 0) r += 360; return r; }
```

**Boundary matrix** (14 cases — the Phase 8.1 report's 7 plus 7 additional cases from this re-audit's brief: ordinary mid-range values, exact-zero-variation, exact upper/lower single-degree boundaries, and ±720° full-double-rotation cases):

| mag | var | Independent expected | OceanCalc actual | Valid (0≤x<360)? | Verdict |
|---:|---:|---:|---:|---|---|
| 270 | −10 | 260 | 260 | Yes | PASS |
| 100 | +5 | 105 | 105 | Yes | PASS |
| 180 | 0 | 180 | 180 | Yes | PASS |
| 0 | 0 | 0 | 0 | Yes | PASS |
| 350 | +20 | 10 | 10 | Yes | PASS |
| 359 | +1 | 0 | 0 | Yes | PASS |
| 350 | +10 | 0 | 0 | Yes | PASS |
| 5 | −20 | 345 | 345 | Yes | PASS |
| 1 | −5 | 356 | 356 | Yes | PASS |
| 0 | −1 | 359 | 359 | Yes | PASS |
| 350 | +370 | 0 | 0 | Yes | PASS |
| 10 | −370 | 0 | 0 | Yes | PASS |
| 100 | +720 | 100 | 100 | Yes | PASS |
| 100 | −720 | 100 | 100 | Yes | PASS |

All 14 cases match exactly (0 error), and every output satisfies `0 ≤ heading < 360`.

**Parser/engine verification (Section 15), traced through the real execution path (not assumed from the test suite):**
- `mod360` is registered inside `MATH_FUNCTIONS`, which is spread into `DEFAULT_CUSTOM_FUNCTIONS` (`lib/formulaParser.ts`) — confirmed by direct source read, not by trusting `npm test`.
- `parseFormula`'s tokenizer treats `mod360` as an ordinary identifier followed by `(`, dispatching to `customFns["mod360"]` exactly like every other function (`sin`, `atan2`, `beaufort`, etc.) — confirmed by re-reading `parsePrimary()` in `lib/formulaParser.ts`, unchanged by this phase.
- Negative values: independently confirmed via the `−20`, `−5`, `−1`, `−370`, `−720` cases above — all correctly wrap to the `[0,360)` range, not left negative.
- Values >360: independently confirmed via the `+370`, `+720` cases above.
- NaN/Infinity: `mod360(NaN)` returns `NaN` (JavaScript's `%` and comparison operators propagate `NaN` through the double-modulo expression without throwing) — sensible, matches how every other function in this parser handles invalid input (returns `NaN` rather than crashing), no special-casing needed or added.
- No existing formula function's *body* changed except `radar_horizon_nm` — confirmed by the line-by-line `git diff` read in the Audit Independence section above; every other function (`beaufort`, `haversine_nm`, `hull_speed_kn`, `initial_bearing_deg`, `rhumb_distance_nm`, `windChillF`, `apparentWindSpeedKn`, `apparentWindAngleDeg`, `geographic_range_nm`, `cross_track_error_nm`, `speed_over_ground_kn`, `mercator_scale_factor`, `longitude_minute_to_nm`, `wave_length_deep_water_m`) is byte-identical to the Phase-8.0-audited version.

**Final verdict: PASS.** Sign convention unchanged and reconfirmed; wraparound defect eliminated for every tested case including two boundary classes (359°+1°, 0°−1°) not covered by the Phase 8.1 report's own test matrix.

---

## Regression Audit

**All 45 calculator records still parse and evaluate:** re-run independently via `npm test` in this audit session (not reused from a cached prior run) — `113 passed, 0 failed`, including a full pass over every `engine.outputs[].formula` string in both `data/calculators.json` and `data/calculators-phase5.json` with each calculator's own default inputs.

**No unrelated calculator changed:** confirmed at the strongest available evidentiary level — a full line-by-line `git diff` (not `--stat`) read against the pre-Phase-8.1 commit `3c98f268bb1993801fb849f907ed4f9f6e4dc10e`. The diff touches exactly: two lines in `data/calculators.json` (both inside `wave-height-calculator`), one line in `data/calculators-phase5.json` (inside `true-magnetic-heading-calculator`), the `mod360` addition plus the `radar_horizon_nm` body in `lib/formulaParser.ts`, and one new line in `package.json`. Every calculator in the required check list (nautical-mile converter, knots converter, sailing time, great-circle distance, anchor scope, Beaufort, apparent wind, boat fuel, fathom, wind chill, hull speed, initial bearing, rhumb distance, statute/nautical conversion, Celsius/Fahrenheit, feet/meters, latitude-degrees-to-nm, VMG, fuel range, shackle calculators, bar/psi, liters/gallons, cable, geographic range of lights, drift/set distance, sail area/displacement, capsize screening, pounds/kilograms, kW/hp, m/s/knots, inHg/mbar, bilge pump, wavelength, longitude-minute, cross-track error, speed over ground, Mercator scale, square feet/square meters, cubic feet/liters) has zero bytes changed in its JSON record and zero bytes changed in any formula function it calls. No further investigation was needed because the diff itself is conclusive — none of these appear anywhere in it.

**Parser integrity:** confirmed via direct source read (see True/Magnetic Heading section above) that `mod360` was added additively to `MATH_FUNCTIONS` without altering any neighboring function, and that `parsePrimary()`'s function-dispatch mechanism (unchanged) treats it identically to every pre-existing function.

**Build integrity:** a full, from-scratch production build was run during this re-audit (`rm -rf out .next && npm run build`), independent of and not reusing any artifact from the Phase 8.1 implementation session. Result: compiled successfully, 308/308 static pages generated, 45 tool routes present in `out/tools/`.

---

## Production Verification

- **Route existence:** `out/tools/radar-horizon-calculator/`, `out/tools/wave-height-calculator/`, `out/tools/true-magnetic-heading-calculator/` all present after the from-scratch rebuild.
- **Generated HTML reflects current source:** `out/tools/wave-height-calculator/index.html` contains the corrected formula string verbatim: `"0.024 * pow(windSpeed * 0.514444, 2)"` (this JSON payload is what the client-side `CalculatorEngine` parses at runtime via `parseFormula`).
- **Shipped JavaScript bundle reflects the source fix, not just the source file:** `out/_next/static/chunks/77-93d5f3a4eb26230e.js` (the actual minified bundle a browser would download) contains `radar_horizon_nm:function(e){return 1.23*Math.sqrt(Math.max(0,e)/.3048)}` and `mod360:e=>(e%360+360)%360` — both the fix's division by `.3048` and the `mod360` helper are present in the real, shippable artifact, not merely in unbundled TypeScript source. This closes the loop the audit brief calls for: source correction → build → generated page → shipped runtime code all agree.
- **Live production endpoints:** not checked — this repository builds to a static export (`next export`-style `out/` directory typically deployed via Cloudflare Pages per `.wranglerignore`/`pages:build`), and no deployment/live-URL access was available or in scope for a source-repository audit. This is noted as a scope limitation, not a defect: the built static artifact was verified in full; whether that artifact has actually been deployed to the production domain is outside what a repository-level audit can determine.

---

## Outstanding Documentation Conditions

Carried forward from Phase 8.0 (not fixed here, not blocking numerical certification — none of these misstate what the corrected calculators *now compute*, only the earlier audit's cataloged wording/example gaps):

- M-1 (distance-to-horizon metric-formula text mismatch), M-2 (nautical mile / 1′ latitude wording), M-3 (undisclosed spherical-Earth model), M-4 (great-circle NYC/London example), M-5 (wind-chill upper-bound validation unenforced), M-6 (geographic-range-of-lights example ≈7% off), M-7 (cable/shackle convention ambiguity), D-1 (dead-code `BeaufortScale.tsx` boundary-gap bug, unreachable in production).

New, identified by this re-audit (not present in the Phase 8.1 implementation report):

- **radar-horizon-calculator content is now stale, in the same way the report already flagged for wave-height, but did not flag for this calculator.** `data/calculators-phase5.json`, `radar-horizon-calculator.engine.formulaDisplay`: `"d (nm) ≈ 1.23 × √(h), h in meters (approximate)"` — before the fix, this text (inaccurately) matched what the code computed; after the fix, the code no longer computes `1.23×√(h_meters)` directly (it computes `1.23×√(h_meters/0.3048)`), so this displayed formula string is now a materially different (and arguably more confusing) mismatch between what's shown and what's computed. Likewise `radar-horizon-calculator.examples`: `["12 m scanner → ~4.3 nm to sea surface (rough)"]` is the old, pre-fix (buggy) value — the corrected value for 12 m is ≈7.72 nm. **CONTENT BLOCKER — DEFERRED TO PHASE 8.3.** Not modified during this re-audit, consistent with Section 19's instruction not to perform unauthorized fixes.

Both the wave-height and radar-horizon stale-content items affect only the "Formula" explanation panel and worked examples shown alongside the calculator, not the primary "Result" figure a user reads off the page after entering their own input — which is why this re-audit classifies them as documentation conditions rather than certification blockers, consistent with the certification standard's distinction between "materially wrong calculation" and "documentation defects that do not materially mislead users about the result." A user who enters their own height or wind speed still gets the numerically correct answer; a user who reads the worked example or formula-display text alongside it would be misled about what number that input should produce.

---

## Final Certification Decision

# CERTIFIED WITH DOCUMENTATION CONDITIONS

**Why this status and not `CERTIFIED`:** two calculators (`wave-height-calculator`, and — newly identified here — `radar-horizon-calculator`) carry explanatory content (`formulaDisplay` and `examples`) that no longer matches the corrected calculation. This is a real defect a user could notice (e.g., comparing the calculator's own worked example against the number they get), so it cannot be waved away, and per Section 19/20's explicit instruction this re-audit does not silently patch it.

**Why this status and not `NOT CERTIFIED`:** the numerical correctness question — the actual purpose of Phase 8.0/8.1 — is unambiguously resolved. All three original defects were independently re-derived from first principles (a fresh 4/3-Earth-radius radar model, the exact SMB formula with an independently-sourced knot→m/s constant, and an independently-written modulo function), not accepted from either prior report, and every one matches OceanCalc's actual current output to a well-explained, immaterial tolerance (0.104% for radar horizon, attributable to published-coefficient rounding; exact match for wave height and heading). No other calculator among the other 42 shows any change, verified at the level of a full line-by-line source diff, not a summary. The production build, from a clean rebuild performed independently in this audit, generates all 45 tool routes correctly, and the shipped JavaScript bundle — not just the TypeScript source — was directly inspected and confirmed to contain the corrected logic. The stale content that remains describes calculators whose *actual computed results* are now correct; it does not misrepresent what a user's own input produces, only the pre-baked example/formula-display text alongside it.

**Condition for full `CERTIFIED` status:** Phase 8.3 must correct the four now-stale content strings identified across the two calculators (`wave-height-calculator.engine.formulaDisplay`, `wave-height-calculator.examples`, `radar-horizon-calculator.engine.formulaDisplay`, `radar-horizon-calculator.examples`) — two of which were already known from the Phase 8.1 report, two of which (the radar-horizon pair) are newly identified by this re-audit. Phase 8.0's other material findings (M-1 through M-7) and the dead-code finding (D-1) remain open per the original Phase 8.0 recommended-phases ordering and are not conditions of this specific recertification, since none of them concern the three calculators this phase was scoped to fix.
