# Phase 8.5 — Final Maritime Accuracy Certification Audit

**Date:** 2026-08-24
**Auditor posture:** Independent. Every material conclusion below was re-derived against the current repository and, where accessible, live production — not assumed from Phases 8.0–8.4's own conclusions.

## Certification Status

# NOT CERTIFIED

The **repository** (source code, as of the current working tree) is in materially good condition: the three original Critical defects are correctly fixed and independently re-verified in this audit, and only a small number of new Medium/Low findings were discovered beyond what Phases 8.0–8.4 caught. **However, live production (https://oceancalc.com) was checked directly in this audit and found to still be serving the pre-Phase-8.1 code and content** — including the original ~45%-understated radar horizon and ~4–6×-overstated wave height. Per the audit's own certification rule, an unresolved Critical finding blocks certification, and "OceanCalc's 45 live calculators" — the thing the certification question is actually about — means the deployed, public-facing site, not merely the local repository. This is a deployment/release gap, not a new coding defect, but it is the decisive fact for this certification decision.

---

## Audit Objective

Independently determine whether OceanCalc's 45 calculators — as actually experienced by a user of the live site — are technically reliable, internally consistent, mathematically correct within their stated models, and honest about units, assumptions, conventions, limitations, and examples. Previous audit reports were treated as evidence to understand what was previously tested, not as authority for any conclusion in this report.

---

## Repository Baseline

```
git rev-parse HEAD        -> 3c98f268bb1993801fb849f907ed4f9f6e4dc10e (unchanged throughout Phases 8.1-8.5)
git status --short        -> 11 modified/deleted tracked files + 2 untracked paths (docs/, scripts/test-formula-engine.ts),
                              identical to the end of Phase 8.4 — this audit added zero repository changes (confirmed by
                              re-running git status/diff --stat after the audit; see Git Discipline below)
node --version             -> v24.13.0
npm --version               -> 11.6.2
```

| Command | Result |
|---|---|
| `npm test` | **PASS** — 130 passed, 0 failed |
| `npx tsc --noEmit` | **PASS** — clean |
| `npm run lint` | **PASS** — "No ESLint warnings or errors" |
| `npm run build` (`rm -rf out .next` first) | **PASS** — 308/308 static pages, 45/45 tool routes |

Baseline matches the expected 130/308/45 figures exactly; no investigation required.

---

## Live Calculator Inventory

Derived directly from source, not from any prior report:

```python
d1 = json.load(open('data/calculators.json'))   # 13 records
d2 = json.load(open('data/calculators-phase5.json'))  # 32 records
# 45 total, 45 unique slugs, 0 duplicates
```

Cross-checked against the actual build output: `set(slugs in data files) == set(dirs in out/tools/)` — **exact match, 45 = 45, zero orphans either direction.** Every calculator is reachable via `app/tools/[slug]/page.tsx` → `CalculatorToolPage` → `getCalculatorBySlug()` → `data/calculators.json` + `data/calculators-phase5.json` (confirmed by source read of `lib/contentLoader.ts`, unchanged since Phase 8.0). The full 45-slug table is in the companion verification matrix below (Section "45-Calculator Verification Matrix").

---

## 45-Calculator Verification Matrix

Formula, units, validation, and model classification for all 45, condensed from full-record inspection (`data/calculators.json` + `data/calculators-phase5.json`, current content, re-read in full this session — not reused from any prior phase's cached notes):

| # | Slug | Formula (live) | Input→Output units | Validation | Model | Result |
|---|---|---|---|---|---|---|
| 1 | nautical-mile-converter | `d×1.852`/`×1.15078`/`×1852` | nm→km/mi/m | none required (exact conv.) | N/A | PASS |
| 2 | knots-speed-converter | `s×1.15078`/`×1.852`/`×0.514444` | kn→mph/kmh/ms | none required | N/A | PASS |
| 3 | knots-to-kmh | `kn×1.852` | kn→km/h | min 0 | N/A | PASS |
| 4 | distance-to-horizon-calculator | `1.17×√h_ft` | ft/m→nm,km | min 0.5 | curvature-tangent | PASS (calc.) / **see F-1 below for example defect** |
| 5 | sailing-time-calculator | `d/s` | nmi/knots→h | speed>0 enforced | N/A | PASS |
| 6 | great-circle-distance-calculator | haversine, R=3440.065nm | deg→nm,km | −90/90, −180/180 | spherical | PASS |
| 7 | anchor-scope-calculator | `depth×ratio` | ft/m→ft,m | ratio 3–10 | N/A | PASS |
| 8 | beaufort-scale-calculator | `beaufort()` cascading `≤` | kn/mph/kmh/ms→force | min 0 | N/A | PASS — 40-point boundary sweep, zero gaps |
| 9 | apparent-wind-calculator | law of cosines | kn,kn,deg→kn,deg | TWA 0–180 | N/A (vector) | PASS |
| 10 | wave-height-calculator | `0.024×(kn×0.514444)²` | kn→m,ft | min 0 | N/A | PASS |
| 11 | boat-fuel-consumption-calculator | `rate×time` | gal/h,h→gal | min 0.1 both | N/A | PASS (calc.) / **AEO mismatch, see F-2** |
| 12 | fathom-converter | `d×6`/`×1.8288` | fathom→ft,m | none required | N/A | PASS |
| 13 | wind-chill-calculator | NWS formula | °F,mph→°F | **max 50°F enforced** (Phase 8.3) | N/A | PASS |
| 14 | hull-speed-calculator | `1.34√LWL` | ft→kn | 6–400 ft | N/A (empirical) | PASS |
| 15 | initial-bearing-calculator | forward azimuth | deg→deg | −90/90,−180/180 | spherical | PASS |
| 16 | rhumb-distance-calculator | plane sailing | deg→nm | −90/90,−180/180 | planar+cos(lat) | PASS |
| 17 | statute-nautical-mile-converter | `sm×0.868976` | sm→nm | min 0 | N/A | PASS |
| 18 | celsius-fahrenheit-converter | `c×9/5+32` | °C→°F | none required | N/A | PASS |
| 19 | feet-meters-converter | `ft×0.3048` | ft→m | min 0 | N/A | PASS |
| 20 | latitude-degrees-to-nm-calculator | `deg×60` | deg→nm | min 0 | spherical approx. | PASS |
| 21 | vmg-calculator | `bsp×cos(θ)` | kn,deg→kn | 0–180 | N/A | PASS |
| 22 | fuel-range-nautical-calculator | `speed×(fuel/gph)` | kn,gal,gal/h→nm | min bounds present | N/A | PASS |
| 23 | anchor-shackle-rode-calculator | `shackles×90` | count→ft | min 0 | N/A | PASS (calc.) / **AEO mismatch, see F-2** |
| 24 | bar-psi-converter | `bar×14.5038` | bar→psi | min 0 | N/A | PASS |
| 25 | liters-us-gallons-converter | `L×0.264172` | L→USgal | min 0 | N/A | PASS |
| 26 | cable-nautical-mile-converter | `c×0.1` | cable→nm | min 0 | N/A | PASS |
| 27 | geographic-range-lights-calculator | `1.17(√eye+√light)` | ft,ft→nm | min 0 both | curvature-tangent | PASS |
| 28 | radar-horizon-calculator | `1.23√(h_m/0.3048)` | m→nm | min 0 | curvature-tangent+refraction | PASS (repo) / **CRITICAL — see F-0, still buggy on production** |
| 29 | drift-set-distance-calculator | `curr×hours` | kn,h→nm | min 0 both | N/A | PASS |
| 30 | sail-area-displacement-calculator | `sa/(disp/64)^(2/3)` | ft²,lb→ratio | min 1 both | N/A (empirical) | PASS (calc.) / **AEO mismatch, see F-2** |
| 31 | capsize-screening-calculator | `beam/(disp/64)^(1/3)` | ft,lb→ratio | min 1 both | N/A (empirical) | PASS (calc.) / **AEO mismatch, see F-2** |
| 32 | pounds-kilograms-converter | `lb×0.453592` | lb→kg | min 0 | N/A | PASS |
| 33 | kilowatts-horsepower-converter | `kw×1.34102` | kW→hp(mech.) | min 0 | N/A | PASS |
| 34 | meters-second-knots-converter | `ms/0.514444` | m/s→kn | min 0 | N/A | PASS |
| 35 | inches-mercury-millibar-converter | `inhg×33.8639` | inHg→mbar | min 0 | N/A | PASS |
| 36 | bilge-pump-time-calculator | `vol/gpm` | gal,GPM→min | min bounds present | N/A | PASS |
| 37 | wave-length-from-period-calculator | `gT²/2π` | s→m | min 0.1 | deep-water dispersion | PASS (calc.) / **AEO mismatch, see F-2** |
| 38 | longitude-minute-nautical-mile-calculator | `min×cos(lat)` | deg,min→nm | −90/90 | spherical | PASS |
| 39 | true-magnetic-heading-calculator | `mod360(mag+var)` | deg,deg→deg | mag 0–360 | N/A | PASS (repo) / **CRITICAL — see F-0, likely still buggy on production** |
| 40 | cross-track-error-calculator | `along×sin(err)` | nm,deg→nm | min 0 both | planar linearization | PASS (calc.) / **AEO mismatch, see F-2 (pre-existing, deferred in 8.4)** |
| 41 | speed-over-ground-calculator | law of cosines | kn,kn,deg→kn | θ 0–180 | N/A (vector) | PASS |
| 42 | mercator-scale-factor-calculator | `sec(φ)` | deg→ratio | −89/89 (avoids pole singularity) | spherical Mercator | PASS (calc.) / **AEO mismatch, see F-2** |
| 43 | anchor-rode-shackles-calculator | `ft/90` | ft→count | min 0 | N/A | PASS (calc.) / **AEO mismatch, see F-2** |
| 44 | square-feet-square-meters-converter | `sf×0.092903` | ft²→m² | min 0 | N/A | PASS |
| 45 | cubic-feet-liters-converter | `cf×28.3168` | ft³→L | min 0 | N/A | PASS |

**45/45 calculators audited. No calculator omitted.**

---

## Independent Numerical Verification

A fresh verification script (kept outside the repository, not committed) was written for this audit, computing an independently-derived expected value for every one of the 45 calculators' published examples/defaults, then comparing against the actual current repository implementation (`lib/formulaParser.ts`'s `DEFAULT_CUSTOM_FUNCTIONS` and the JSON formula strings, evaluated via the real `parseFormula()` — i.e., exactly what `CalculatorEngine.tsx` runs).

**Result: 173 passed, 1 failed**, out of 174 checks covering every calculator's example(s), plus a 40-point Beaufort boundary sweep and a 20-case true/magnetic-heading angle sweep (0°, 1°, 359°, 360°, negative variation, multiple full rotations, sign-convention checks).

The single failure is a genuine, newly-discovered content defect — see **Finding F-1** below. It is not a calculation-engine defect (the live `distance_horizon_km` formula itself computes correctly and consistently; only one of its three hand-written worked examples is wrong).

Representative spot checks (full 174-row output retained in session, condensed here):

| Calculator | Case | Independent expected | Repo actual | Diff | Verdict |
|---|---|---:|---:|---:|---|
| radar-horizon-calculator | 12 m, vs. fresh 4/3-Earth derivation (Rₑ=6,371,000 m) | 7.7097 nm | 7.7177 nm | 0.3% (coefficient-rounding, previously explained in Phase 8.1 re-audit, reconfirmed here) | PASS |
| wave-height-calculator | 10/20/30 kn | 0.64/2.54/5.72 m | 0.6352/2.5407/5.7165 m | rounding only | PASS |
| true-magnetic-heading-calculator | 20 boundary cases incl. 359°+1°, 0°−1°, ±720° | fresh `((x%360)+360)%360` | `mod360(mag+var)` | 0 in all 20 cases | PASS |
| great-circle-distance-calculator | NYC→London | 3007.68 nm / 5570.22 km | 3007.68 nm / 5570.22 km | 0 | PASS |
| hull-speed-calculator | 32 ft, cross-checked via Froude Fn=0.4 first-principles derivation (not the repo's own coefficient) | 7.604 kn | 7.580 kn (repo) | 0.3%, within rule-of-thumb tolerance | PASS |
| rhumb-distance-calculator | 40,−74→41,−73, vs. fresh independent Mercator-sailing (isometric-latitude) implementation | 75.3754 nm | 75.3763 nm | <0.01%, consistent with the disclosed plane-sailing approximation | PASS |
| distance-to-horizon-calculator | 6 ft example | nm: 2.866 (✓ matches "~2.9"); **km: 5.308 (does NOT match published "~5.4")** | — | 0.09 km / 1.7% | **FAIL — Finding F-1** |

---

## Unit Verification

Every calculator's input→formula→output unit chain was traced. All 45 are dimensionally consistent (no meters-fed-into-a-feet-calibrated-coefficient class of bug remains — that was Phase 8.1's radar-horizon fix, and it was independently re-verified above as correctly converting `h_m/0.3048` before applying the 1.23 coefficient). No new unit mismatch was found anywhere in the 45-calculator sweep. Full input/formula/output unit annotations are in the 45-Calculator Verification Matrix table above (third column).

---

## Precision Verification

Source-read of `components/calculator-engine/CalculatorEngine.tsx` and `OutputField.tsx` confirms: every output's `value` is computed once, at full floating-point precision, directly from the canonicalized input variables via `parseFormula()`; rounding (`Math.round(value × 10^dec) / 10^dec`) happens only in `OutputField.formatValue()`, purely for display. Multi-output calculators (e.g., wave-height's `_m` and `_ft` variants) each recompute independently from the original input, not by chaining off a previously-rounded sibling output — so no compounding rounding error exists anywhere in the 45 calculators. **No premature rounding found.**

---

## Validation Verification

Reviewed every calculator's `min`/`max`/`message` rules against its stated mathematical/physical model:

- `wind-chill-calculator`: `max: 50`, custom message — enforces the documented NWS validity bound (Phase 8.3 fix, reconfirmed present and unchanged).
- `mercator-scale-factor-calculator`: `min: -89, max: 89` — correctly avoids the exact ±90° pole singularity in `sec(φ)`.
- `apparent-wind-calculator`, `vmg-calculator`, `speed-over-ground-calculator`: angle inputs correctly bounded to their physically meaningful 0–180° domain (angle *between* two vectors, not a full-circle bearing).
- `great-circle-distance-calculator`, `initial-bearing-calculator`, `rhumb-distance-calculator`, `longitude-minute-nautical-mile-calculator`: all latitude/longitude inputs correctly bounded to ±90°/±180°.
- `true-magnetic-heading-calculator`: `mag` bounded 0–360°; `var` deliberately unbounded (by design, to allow the mod360 wraparound to be exercised for any variation value — verified this doesn't produce invalid output for any tested case, including ±720°).
- No calculator was found accepting a mathematically undefined input (e.g., no division-by-zero paths reachable — `sailing-time-calculator`'s speed has a `positive` validation rule; `bilge-pump-time-calculator`'s `gpm` has `min: 0.01`; `boat-fuel-consumption-calculator`'s `hours`/`consumptionRate` have `min: 0.1`).

**No new validation defect found.**

---

## Angle & Direction Verification

`true-magnetic-heading-calculator` (the calculator this program's Phase 8.1 fix targeted) was independently re-tested at 20 boundary/edge cases in this audit (0°, 1°, 359°, 360°, −1° via negative variation, multiple-rotation cases up to ±720°, and explicit sign-convention checks for both East-positive and West-negative). **Every case produced a value in `[0°, 360°)` matching a freshly-written, independently-coded modulo function exactly.** Sign convention (`True = Magnetic + Variation`, East positive) reconfirmed unchanged. `initial-bearing-calculator` reconfirmed correct at the four cardinal directions (0°/90°/180°/270°) with proper 0–360° normalization built into `initial_bearing_deg()`'s own `%360` handling. `cross-track-error-calculator`'s `sin()`-based formula was swept across 0°–360° and confirmed to go negative beyond 180° — this is mathematically correct behavior for `sin()` and is not a defect (the calculator's `err` input has `min: 0` with no `max`, so a user entering, e.g., 270° would see a negative XTE value; this is an edge-case a future phase could consider bounding for UX clarity, but it is not a mathematical error — sin(270°) = −1 is correct).

---

## Maritime Convention Verification

Nautical mile, cable, shackle, fathom, knot, statute mile, and latitude-minute conventions were re-verified against the current repository content (full re-read this session, not from Phase 8.4's cached notes). All previously-corrected wording (Phases 8.3/8.4) is confirmed still present and consistent in the repository:
- Nautical mile: 1,852 m exact, latitude relationship consistently hedged as approximate across every occurrence found in this session's fresh sweep.
- Cable: 0.1 nm/185.2 m disclosed as a modern convention, not universal.
- Shackle: 15 fathoms/90 ft disclosed as convention-dependent.
- Fathom: 6 ft = 1.8288 m, exact, unqualified (correctly — this one is a fixed legal definition, not a convention needing a variability disclaimer).

No new maritime-convention defect found in the repository.

---

## Earth/Mathematical Model Verification

Independently reclassified all nine geographic calculators (see Formula/Model column of the 45-Calculator Matrix). Confirms Phase 8.4's classification was accurate: `great-circle-distance-calculator` and `initial-bearing-calculator` use true spherical trigonometry (both disclosed); `rhumb-distance-calculator` uses plane sailing with a latitude-cosine correction (disclosed, distinctly, and more precisely than a generic "spherical" label would be); `cross-track-error-calculator` uses a planar small-angle linearization with **no spherical trigonometry at all** (confirmed again this session — no lat/lon inputs, no `haversine`/`atan2` spherical calls); `mercator-scale-factor-calculator` uses the spherical Mercator model (disclosed); `distance-to-horizon-calculator`, `radar-horizon-calculator`, `geographic-range-lights-calculator` use curvature-tangent-line formulas (a related but distinct category from lat/lon geodesic calculations); `longitude-minute-nautical-mile-calculator` and `latitude-degrees-to-nm-calculator` use simple spherical angular scaling, correctly hedged in their own content without claiming ellipsoidal precision. **No calculator was found presenting a non-spherical model as spherical or vice versa; no new Earth-model disclosure gap found.**

---

## Example Verification

Full 45-calculator example verification is the "Independent Numerical Verification" table above and its underlying 174-check script. **One genuine, previously-undetected defect found** (Finding F-1, distance-to-horizon-calculator's "6 ft → ~5.4 km" example, actual value ≈5.31 km). Every other example across all 45 calculators is explainable by ordinary display rounding or an explicitly-labeled approximation.

---

## Formula-Display Verification

Compared every `engine.outputs[].formula` (the actual computation) against its `formulaDisplay` (the compact notation shown to users) and `formulaDetail` (the prose caveat) for all 45. No coefficient mismatch, missing conversion, missing normalization, or model-misdescription was found anywhere. The specific known case flagged for independent reassessment — `"1° latitude = 60 nm"` (`latitude-degrees-to-nm-calculator.formulaDisplay`) — was re-examined on its own merits, not carried forward from Phase 8.4's conclusion:

**Independent assessment:** This compact string uses `"="` for a relationship that is genuinely only approximate (varies with the reference ellipsoid). However: (a) it is immediately followed on the same page by the calculator's `formula` prose field, which explicitly states "One degree of latitude is **approximately** 60 nautical miles... the exact length varies slightly with latitude on the reference ellipsoid"; (b) every other `formulaDisplay` string across all 45 calculators uses the same bare `"="` compact-notation convention regardless of whether the underlying relationship is exact or approximate (e.g., `distance-to-horizon-calculator`'s own `formulaDisplay` says `"Distance (nm) = 1.17 × √(height in feet)"` despite being an approximation); this is a site-wide typographic convention for the "Formula" panel, not a claim of precision. **Conclusion: this is a compact display convention, not a technical ambiguity that could reasonably mislead a user who reads the surrounding text — classified INFORMATIONAL, not a defect, matching Phase 8.4's conclusion after independent re-derivation.**

---

## Content/Engine Consistency

Cross-checked title/description/formula/formulaDisplay/formulaDetail/examples/FAQ against the actual calculation for all 45. Two categories of inconsistency found, both already covered above: the distance-to-horizon km example (F-1) and the AEO entity-mapping pattern (F-2, below). No calculator was found calling its own output by the wrong physical-quantity name (e.g., no "bearing calculator calls its output heading" instance remains — that class of defect was corrected in Phase 8.4 and reconfirmed absent in this session's fresh read of every `description`/output `label` field).

---

## AEO Entity Verification

Full independent audit of `lib/aeo.ts`'s `SLUG_TO_ENTITIES` table (34 entries) against what each calculator actually computes, re-derived from scratch rather than assuming Phase 8.4's two fixes were exhaustive.

**Finding F-2 — a systemic pattern, not just the previously-known cross-track-error case:**

| Slug | Current entity mapping | Actual calculation | Assessment |
|---|---|---|---|
| `cross-track-error-calculator` | `["great circle"]` | Planar small-angle linearization, no great-circle geometry | **Mismatch** (previously identified in Phase 8.4, deferred) |
| `boat-fuel-consumption-calculator` | `["nautical mile"]` | `rate × time`, no distance/nm unit anywhere in this calculator | **Mismatch — newly found** |
| `anchor-shackle-rode-calculator` | `["anchor scope"]` | Unit conversion (shackles→feet), not a scope *ratio* | **Mismatch — newly found** |
| `anchor-rode-shackles-calculator` | `["anchor scope"]` | Unit conversion (feet→shackles), not a scope *ratio* | **Mismatch — newly found** |
| `mercator-scale-factor-calculator` | `["great circle"]` | Map-projection scale distortion (`sec φ`), unrelated to great-circle route distance | **Mismatch — newly found** |
| `wave-length-from-period-calculator` | `["significant wave height"]` | Wavelength (`gT²/2π`), a different physical quantity from wave height entirely | **Mismatch — newly found** |
| `sail-area-displacement-calculator` | `["hull speed"]` | SA/D ratio, unrelated naval-architecture ratio | **Mismatch — newly found** |
| `capsize-screening-calculator` | `["hull speed"]` | Capsize screening factor, unrelated ratio | **Mismatch — newly found** |

All other 26 entity-mapped calculators were checked and found topically correct or reasonably associated (e.g., `distance-to-horizon-calculator`/`geographic-range-lights-calculator`/`radar-horizon-calculator` → `"nautical chart"` is a loose but defensible association — no dedicated "horizon/visual range" entity exists, and the mapping doesn't misidentify what the calculator computes, unlike the eight above, which associate a calculator with an entity describing a *different, unrelated physical quantity*).

**Severity: MEDIUM.** This does not change any calculator's numeric output — it affects only the AEO glossary card shown alongside eight calculator pages, which currently display a definition for a concept the calculator doesn't compute. Given this is explicitly an AEO (answer-engine-optimization) content layer intended to help AI systems and readers correctly understand each calculator, eight incorrect associations out of 34 mapped calculators is a material accuracy gap in that layer, not a cosmetic one.

---

## Dead-Code Assessment

`GreatCircleDistance.tsx`, `AnchorScope.tsx`, `ApparentWind.tsx`, `DistanceToHorizon.tsx` reconfirmed present, unchanged since Phase 8.2 (confirmed via `git diff --stat -- components/calculators/` showing only the already-committed-to-history `BeaufortScale.tsx` deletion, nothing else touched). Reachability retested independently: `components/CalculatorRenderer.tsx` (current, re-read this session) still routes every calculator with an `engine` field to `<CalculatorEngine>` before reaching its `switch`, and all four corresponding JSON records still have `engine` fields — **confirmed definitively dead, unreachable, unchanged from Phase 8.2's finding.** Each was individually checked for internal formula correctness (in case a future accidental reactivation would matter): `GreatCircleDistance.tsx` uses the identical haversine/R constant as the live path; `ApparentWind.tsx` uses the identical law-of-cosines formula; `AnchorScope.tsx` is straightforward arithmetic matching the live version; `DistanceToHorizon.tsx` correctly converts meters to feet before applying its coefficient (no radar-horizon-style bug). **None contains an active numerical defect that would surface if accidentally reactivated** — this reduces, but does not eliminate, the certification risk their continued existence represents (a future refactor changing `CalculatorRenderer`'s branch order remains a landmine, independent of whether today's dead code happens to be bug-free).

---

## Shipped-Bundle Verification

A from-scratch build was run this session (`rm -rf out .next && npm run build`). Verified representative routes' generated static HTML/JS directly:
- `out/tools/radar-horizon-calculator/`, `wave-height-calculator/`, `true-magnetic-heading-calculator/`, `initial-bearing-calculator/`, `great-circle-distance-calculator/`, `cross-track-error-calculator/`, `cable-nautical-mile-converter/`, `anchor-shackle-rode-calculator/`, `wind-chill-calculator/`, `apparent-wind-calculator/` — **all 10 present**, and (via `npm test`'s data-integrity pass over every calculator's formula string, plus this session's fresh 174-point check) all reflect the corrected repository logic.
- The build output is **internally self-consistent with the repository source** — there is no discrepancy between "what the source says" and "what `next build` produces." The discrepancy that matters is one level up: between this local build and what is actually deployed.

---

## Production Verification

**Performed, not skipped — network access was available.** Fetched four live production URLs directly:

| URL | What repository/build says | What production actually shows | Match? |
|---|---|---|---|
| `https://oceancalc.com/tools/radar-horizon-calculator/` | `formulaDisplay`: "Approximate radar horizon: d (nm) ≈ 1.23 × √(h / 0.3048)..."; example "~7.7 nm" for 12 m | `formulaDisplay`: "d (nm) ≈ 1.23 × √(h), h in meters (approximate)"; example **"~4.3 nm"** for 12 m | **NO — production runs the pre-Phase-8.1 buggy formula and example** |
| `https://oceancalc.com/tools/wave-height-calculator/` | `formulaDisplay`: "Simplified SMB-style estimate: H ≈ 0.024 × U², where U is wind speed in m/s."; examples 0.64/2.54/5.72 m | `formulaDisplay`: "H ≈ 0.024 × wind_speed_kn²..."; examples **9.6/2.4/21.6 m** | **NO — production runs the pre-Phase-8.1 buggy formula and example** |
| `https://oceancalc.com/tools/true-magnetic-heading-calculator/` | `formula`: "mod360(mag + var)" | Example shown (270°−10°→260°) doesn't cross the 000°/360° boundary, so the wraparound bug can't be directly confirmed from this fetch alone; formula prose text matches pre- and post-fix versions identically (only the underlying JSON formula string differs, which isn't rendered as raw text on the page) | **Inconclusive from this single fetch, but see reasoning below** |
| `https://oceancalc.com/tools/great-circle-distance-calculator/` | Example: "New York to London: ~3,007.7 nm (~5,570.2 km)" | Example: **"New York to London: ~3,076 nm (~5,697 km)"** | **NO — production runs the pre-Phase-8.3 stale example** |
| `https://oceancalc.com/` | N/A | No deployment timestamp/version indicator visible; only a static "© 2026 OceanCalc" copyright line | Confirms no way to verify deployment recency from the site itself |

**Conclusion: production is not synchronized with the repository.** Two of the three original Critical defects (radar horizon, wave height) were directly confirmed still live and serving the original incorrect numbers to real users. The great-circle stale example (a Phase 8.3 fix) is also confirmed still live, which — combined with the fact that radar-horizon and wave-height's fixes are both from Phase 8.1, earlier than Phase 8.3's — strongly indicates **none of Phases 8.1 through 8.4's work has been deployed**, not just Phase 8.1's. This makes it near-certain (though not, from this single fetch, 100% directly confirmed) that the true/magnetic heading wraparound bug is also still live, since it was fixed in the same Phase 8.1 commit-equivalent as radar horizon and wave height, and there is no evidence of any partial/selective deployment.

This is not classified as `UNVERIFIED — ENVIRONMENT LIMITATION`. It was checked, directly, successfully, and the result is unambiguous.

---

## External Standards Used

Re-affirmed, not re-fetched in full this session (values are fixed international definitions unlikely to have changed since Phase 8.0's verification), except where a spot-check was warranted:

- IHO 1929 Monaco resolution / NIST SP 811 — nautical mile = 1,852 m exactly (Phase 8.0, re-affirmed).
- 1959 international yard-and-pound agreement — foot = 0.3048 m, pound = 0.45359237 kg, exactly (Phase 0, re-affirmed; used throughout this session's independent constant derivations, e.g. `SM_M`, `LB_KG`).
- Furuno "Radar Horizon" / first-principles 4/3-Earth-radius derivation — radar horizon coefficient basis (Phase 8.1, independently re-derived again this session from `Rₑ=6,371,000 m` with an identical 0.104%-class residual, confirming the repository's radar horizon fix without relying on the prior report's arithmetic).
- Sverdrup-Munk-Bretschneider fully-developed-sea approximation — wave-height coefficient basis (Phase 8.0/8.1, re-confirmed this session via the exact `1852/3600` knot→m/s fraction).
- Froude-number ≈0.4 basis for the 1.34 hull-speed coefficient — independently re-derived this session from `g`, exact foot conversion, and exact knot conversion (not reused from any prior script), landing within 0.3% of the repository's own output.

No external standard was fabricated or asserted without this session's own derivation or a specific citation to a Tier 1–3 source already on record from Phase 8.0.

---

## Findings Register

| ID | Calculator | Finding | Severity | Evidence | Certification impact |
|---|---|---|---|---|---|
| F-0 | radar-horizon-calculator, wave-height-calculator, (likely) true-magnetic-heading-calculator | **Live production (oceancalc.com) is not synchronized with the repository and still serves the pre-Phase-8.1 defects** — radar horizon understated ≈45% (confirmed: production shows "~4.3 nm" for 12 m vs. correct "~7.7 nm"), wave height overstated 4–6× (confirmed: production shows "9.6/2.4/21.6 m" vs. correct "0.64/2.54/5.72 m") | **CRITICAL** | Direct WebFetch of `https://oceancalc.com/tools/radar-horizon-calculator/` and `.../wave-height-calculator/`, compared against current repository/build content | **BLOCKS CERTIFICATION** |
| F-1 | distance-to-horizon-calculator | `examples[0]` and `faq[0].answer` both state "6 ft → ~5.4 km," but the calculator's own live formula (`1.17×√(6)×1.852`) computes 5.3077 km, which rounds to "~5.3 km" — a 0.09 km / 1.7% discrepancy, too large to be display rounding | MEDIUM | Independent computation in this session's verification script (1 of 174 checks failed); confirmed the wrong figure appears in two places in `data/calculators.json` | Non-blocking on its own (doesn't affect a user's own computed result), but documented as a condition |
| F-2 | 8 calculators: `cross-track-error-calculator`, `boat-fuel-consumption-calculator`, `anchor-shackle-rode-calculator`, `anchor-rode-shackles-calculator`, `mercator-scale-factor-calculator`, `wave-length-from-period-calculator`, `sail-area-displacement-calculator`, `capsize-screening-calculator` | `lib/aeo.ts`'s `SLUG_TO_ENTITIES` mapping associates each of these with a glossary entity describing an unrelated physical quantity (e.g., a wavelength calculator tagged with the "significant wave height" definition) | MEDIUM | Full independent cross-check of all 34 mapped entries against each calculator's actual formula, this session | Non-blocking (content-layer only, no numeric impact), documented as a condition |
| F-3 | (repository-wide) | Four dead-code duplicate components (`GreatCircleDistance.tsx`, `AnchorScope.tsx`, `ApparentWind.tsx`, `DistanceToHorizon.tsx`) remain, unreachable but present; reconfirmed bug-free but still a structural landmine | LOW | Static reachability re-trace this session; individual formula-correctness check of all four | Non-blocking, documented |
| F-4 | `latitude-degrees-to-nm-calculator` | `formulaDisplay` uses bare "=" for an approximate relationship ("1° latitude = 60 nm"), consistent with a site-wide compact-notation convention and immediately followed by correctly-hedged prose | INFORMATIONAL | Independent re-assessment against the site-wide `formulaDisplay` pattern across all 45 calculators | None |
| F-5 | `cross-track-error-calculator` | Beyond 180° bearing error, `along × sin(error)` produces a negative XTE (mathematically correct `sin()` behavior); the `err` input has no `max`, so this is reachable | LOW | Angle sweep 0°–360° performed this session | Non-blocking; noted as a possible future UX/validation refinement, not a mathematical defect |

---

## Previously Known Findings

Independently reassessed, not carried forward automatically:

- **`cross-track-error-calculator` → "great circle" AEO mapping** (deferred at the end of Phase 8.4): re-confirmed as a genuine mismatch this session, and found to be **one instance of a broader 8-calculator pattern (Finding F-2)**, not an isolated case as Phase 8.4's framing implied. Classification: MEDIUM (upgraded from an implicit LOW/deferred status once the fuller pattern was found).
- **Four dead-code components**: re-confirmed still present, still unreachable, still individually bug-free. Classification: LOW, unchanged from Phase 8.2's assessment. Not deleted in this audit (audits do not modify code).
- **`formulaDisplay` "=" convention for approximate relationships**: independently re-assessed from first principles in this audit (see "Formula-Display Verification" above) rather than assumed correct. Conclusion unchanged from Phase 8.4 (INFORMATIONAL, not a defect), but arrived at via fresh reasoning, not by trusting the prior conclusion.

---

## Certification Decision

**NOT CERTIFIED.**

The repository itself would likely support a **CERTIFIED WITH CONDITIONS** outcome on its own: the three original Critical defects are correctly fixed and independently re-verified in this session (radar horizon, wave height, heading normalization all pass fresh, from-scratch checks), no new Critical or High finding was discovered in the repository, and the two new Medium findings (F-1, F-2) are both content/glossary-layer issues that do not affect any calculator's numeric output for a user's own input.

**However, this audit's mandate is to certify OceanCalc's *live* calculators**, and Section 21's production-verification step — performed directly, not skipped — found that **the actual public website is still running the pre-Phase-8.1 code.** A user visiting oceancalc.com today and using the radar horizon or wave height calculators receives the original, materially incorrect results this entire Stage 8 program exists to fix. Per the audit's own rule ("Any unresolved Critical or High finding exists" → NOT CERTIFIED), and per the explicit final principle ("A false CERTIFIED result is worse than a NOT CERTIFIED result"), this is decisive: **certification cannot be granted while the corrected code has not reached the site being certified.**

---

## Limitations

- Production verification was performed via four targeted page fetches (`radar-horizon-calculator`, `wave-height-calculator`, `true-magnetic-heading-calculator`, `great-circle-distance-calculator`, plus the homepage) — not all 45 production routes were individually fetched. Given the consistent pattern across every fixed calculator that *was* checked, it is treated as near-certain (not merely possible) that no Phase 8.1–8.4 corrections have reached production, but this has not been verified page-by-page for the remaining 41 routes.
- The true/magnetic-heading wraparound bug's presence on production specifically was not directly confirmable from the one example fetched (which doesn't cross the 000°/360° boundary); its likely-still-buggy status is inferred from the deployment pattern, not independently confirmed the way radar horizon and wave height were.
- No access to deployment logs, CI/CD configuration, or hosting-provider state was available from this environment — the *cause* of the production/repository gap (never deployed vs. a failed/rolled-back deploy vs. a caching issue) could not be determined, only the *fact* of the gap itself.
- External standards were re-affirmed against Phase 8.0's citations rather than re-fetched from every original source in full this session, except where a first-principles re-derivation was performed as a substitute independent check (radar horizon, wave height, hull speed).

---

## Final Statement

Certification criteria were not met. The statement reserved for a CERTIFIED outcome is not used.

**Recommended next phase:** Deploy the current repository (which independently passes this audit's numerical checks) to production, then run a Phase 8.5 re-verification limited to Section 21 (Production Verification) across all 45 routes before certification can be reconsidered. Findings F-1 and F-2 (content/AEO corrections) can be addressed in a subsequent content-reconciliation phase and are not blocking in themselves, but should not be the reason certification is withheld a second time — the deployment gap is.
