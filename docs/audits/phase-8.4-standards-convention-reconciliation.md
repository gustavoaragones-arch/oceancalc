# Phase 8.4 — Maritime Standards & Convention Reconciliation

**Date:** 2026-08-24
**Basis:** `docs/audits/phase-8.0-maritime-accuracy-audit.md`, `docs/audits/phase-8.0-calculator-verification-matrix.md`, `docs/audits/phase-8.0-maritime-standards-register.md`, `docs/audits/phase-8.1-safety-calculation-corrections.md`, `docs/audits/phase-8.1-reaudit.md`, `docs/audits/phase-8.2-dead-code-cleanup.md`, `docs/audits/phase-8.3-content-accuracy-reconciliation.md` — all read in full before any change.

## Status

# PASS

Most of Workstreams A and B were already resolved by Phase 8.3 and required only verification (documented below as PASS, not re-fixed). Two genuine, previously-undetected terminology mismatches were found during the mandated Workstream C repository search and corrected: the AEO entity layer had `true-magnetic-heading-calculator` tagged with the "bearing" entity (it computes heading, not bearing-to-a-point) and `drift-set-distance-calculator` tagged with "bearing" despite computing no angle at all. One calculator description (`initial-bearing-calculator`) used "heading" as a loose synonym for "bearing," corrected for consistency. The `initial-bearing-calculator` also received the Workstream B ellipsoidal-approximation disclosure its sibling `great-circle-distance-calculator` already had.

---

## Baseline

- **Starting HEAD:** `3c98f268bb1993801fb849f907ed4f9f6e4dc10e` (unchanged throughout — nothing committed at any point in Phases 8.1–8.4)
- **Starting `npm test`:** 130 passed, 0 failed
- **Starting `npx tsc --noEmit`:** clean
- **Starting `npm run lint`:** clean
- **Starting `npm run build`:** compiled successfully, 45/45 tool routes, 308 static pages

---

## Workstream A — Measurement & Maritime Conventions

### Nautical Mile

Full repository sweep for `nautical mile`, `nautical miles`, `NM`, `minute of latitude`, `degree of latitude`, `60 nautical miles` (see command output retained in session; not reproduced here for length). Classification of every occurrence that makes a claim about the nm↔latitude relationship (occurrences that are just the plain unit name, e.g. "convert nautical miles," are omitted as not applicable):

| Location | Statement | Classification | Action |
|---|---|---|---|
| `data/calculators.json` `nautical-mile-converter.formulaDetail` | "A nautical mile is exactly 1,852 meters. One minute of latitude is approximately..." | PASS (fixed in Phase 8.3) | None |
| `data/calculators.json` `nautical-mile-converter.faq[0]` ("What is a nautical mile?") | "...is defined as exactly 1,852 meters...and is based on one minute of latitude" | PASS — "based on" is historical-basis framing, not an exact-identity claim | None |
| `data/calculators.json` `nautical-mile-converter.faq[2]` ("Why do sailors use nautical miles?") | "...one degree of latitude is approximately 60 nautical miles, with the exact length varying..." | PASS (fixed in Phase 8.3) | None |
| `data/calculators.json` `great-circle-distance-calculator.faq[2]` | "One nautical mile is approximately one minute of latitude (the exact length varies...)" | PASS (fixed in Phase 8.3) | None |
| `data/calculators-phase5.json` `latitude-degrees-to-nm-calculator.formula` | "One degree of latitude is approximately 60 nautical miles..." | PASS (fixed in Phase 8.3) | None |
| `data/calculators-phase5.json` `latitude-degrees-to-nm-calculator.formulaDisplay` | `"1° latitude = 60 nm (meridian arc)"` | REVIEW → PASS | Compact notation, uses site-wide "=" convention shared by every calculator's `formulaDisplay` (including already-approximate ones like distance-to-horizon's own formulaDisplay). The calculator's prose `formula` field already states the approximation explicitly (see Section 6 below). Changing the display-notation convention site-wide would be a much larger stylistic change than this phase's scope; not touched. |
| `data/calculators-phase5.json` `statute-nautical-mile-converter.formulaDetail` | "Nautical miles align with latitude minutes..." | PASS — "align with" is associative, not an equals-claim | None |
| `data/calculators-phase5.json` `statute-nautical-mile-converter.faq[0]` | "...nautical miles tied to latitude..." | PASS — "tied to" is associative | None |
| `data/entities.json` `"nautical mile"` | "...One minute of latitude is approximately one nautical mile..." | PASS (fixed in Phase 8.3) | None |
| `data/measurements.json` `"nautical-miles"` article + FAQ | "...are approximately one degree of latitude..." / "...is approximately one nautical mile..." | PASS (fixed in Phase 8.3) | None |
| `data/entities.json` `"nautical chart"` | "...often magnetic variation; distances are read with the latitude scale for nautical miles." | PASS — describes chart-reading practice (a legitimate navigational technique), not a precision claim | None |

**Result: no further fix required.** Phase 8.3 already resolved every occurrence that presented the relationship as an exact identity; this phase's sweep independently re-confirmed that conclusion rather than assuming it.

### Latitude

`latitude-degrees-to-nm-calculator` (Section 6 of the brief): verified its calculation remains the simple `deg × 60` angular approximation (unchanged — confirmed no diff in this calculator's `engine.outputs[0].formula` across this phase). Its explanatory `formula` field (fixed in Phase 8.3) already reads: *"One degree of latitude is approximately 60 nautical miles (one minute ≈ one nm); the exact length varies slightly with latitude on the reference ellipsoid."* This satisfies the brief's required framing. **PASS**, no further change.

### Cable

`cable-nautical-mile-converter` verified against all five required fields:
- `formula`: "The cable (tenth of a nautical mile) is still seen in some charting and naval usage." — does not claim universality.
- `formulaDetail` (added Phase 8.3): "A cable is commonly treated as 0.1 nautical mile (185.2 m) in modern maritime usage, but historical and national conventions can differ." — explicitly flags this as one modern convention among several.
- `formulaDisplay`: "1 cable = 0.1 nm = 185.2 m" — compact notation, immediately followed on the page by the formulaDetail disclosure.
- `examples`: "10 cables = 1 nm" — pure arithmetic under the calculator's own stated convention, consistent.
- `faq`: empty — nothing to check.

All five are internally consistent and none present the 0.1 nm convention as universal. **PASS**, no change. The numerical convention (0.1 nm/cable) was not altered, per the brief's explicit instruction.

### Shackle

`anchor-shackle-rode-calculator` and `anchor-rode-shackles-calculator` both verified: formula, formulaDisplay, examples, and the Phase-8.3-added formulaDetail ("Shackle length varies by maritime convention; verify the convention used for the vessel, chart, or reference material.") all consistently refer to the same 15-fathom/90-ft arithmetic, and the disclosure correctly flags convention variability without asserting a false universal. **PASS** for both, no change. Numerical conventions unchanged.

---

## Workstream B — Mathematical Models

### Model Inventory

| Calculator | Mathematical model | Spherical assumption? | Existing disclosure? | Action |
|---|---|---|---|---|
| `great-circle-distance-calculator` | Haversine, spherical Earth, R=3,440.065 nm | Yes | Yes (Phase 8.3) | None — verified accurate |
| `initial-bearing-calculator` | Forward-azimuth spherical trigonometry (same mathematical basis as haversine) | Yes | Partial (said "on a sphere" but never framed as an approximation of the ellipsoidal answer) | **Added** disclosure sentence |
| `rhumb-distance-calculator` | Mid-latitude plane sailing (`Δlat×60`, `Δlon×60×cos φₘ`) — flat-plane arithmetic with a latitude correction, not full spherical trigonometry | No (not the same model class as haversine) | Yes, and more specific/accurate than the generic sentence would be ("mid-latitude plane approximation, not exact Mercator sailing") | None — existing disclosure is already correct for the actual model used |
| `cross-track-error-calculator` | `along × sin(error)` — planar small-angle linearization; no lat/lon inputs, no spherical trig at all | No | Yes ("small-angle linearized...for quick mental checks") | None — confirmed the model is genuinely not spherical, so the given spherical-geometry sentence would be **inaccurate** here and was correctly withheld per the brief's explicit instruction |
| `mercator-scale-factor-calculator` | `k = sec(φ)`, spherical Mercator | Yes | Yes (Phase 8.3) | None — verified accurate |
| `longitude-minute-nautical-mile-calculator` | `minutes × cos(lat)` — spherical relation, single trig term | Yes (simple case) | Content already correctly scopes what it computes without claiming ellipsoidal exactness ("east-west distance per minute shrinks by cos(φ)") | None — materiality low; doesn't overclaim precision |
| `distance-to-horizon-calculator` | `1.17 × √h_ft` — curvature-tangent-line formula (different category from lat/lon geodesic calculations) | Yes (Earth-curvature-derived coefficient) | Yes, explicit ("Assumes spherical Earth and normal atmospheric refraction") | None — verified accurate, unchanged |
| `radar-horizon-calculator` | `1.23 × √(h_m/0.3048)` — same curvature-tangent-line category, 4/3-Earth-radius refraction model | Yes | Yes (Phase 8.3) | None — verified accurate (see below) |
| `geographic-range-lights-calculator` | `1.17×(√eye+√light)` — same curvature-tangent-line category | Yes (implicit in the coefficient's derivation) | Atmospheric/light-intensity caveat present; no explicit Earth-model statement | None — the *material* caveat for this formula is atmospheric/refraction and light-power variability (already disclosed), not sphere-vs-ellipsoid, per the brief's "not automatic" instruction |
| `wave-length-from-period-calculator`, `wind-chill-calculator`, `hull-speed-calculator`, `vmg-calculator`, `speed-over-ground-calculator`, `apparent-wind-calculator`, Beaufort, all straightforward unit converters | No Earth-geometry involved | N/A | N/A | Not applicable to this workstream |

### Great Circle

Disclosure present, technically accurate (verified against the unchanged `haversine_nm()` formula), located in `formulaDetail` (rendered directly on the page via `CalculatorLayout.tsx`), and consistent with the formula. **PASS — not rewritten.**

### Mercator

Disclosure present and verified against the unchanged `mercator_scale_factor()` formula (`k = sec(φ)`, spherical). **PASS — not rewritten.** No redundant text added elsewhere.

### Initial Bearing

Confirmed `initial_bearing_deg()` uses the identical spherical forward-azimuth trigonometric model as `haversine_nm()` (both operate on the same spherical-Earth lat/lon geometry). The calculator's existing text already named "sphere" (`formula`: "...between two geographic points on a sphere"; `formulaDisplay`: "...via spherical trigonometry") but never explicitly framed this as an approximation of a more precise ellipsoidal answer — the same gap that existed on the great-circle calculator before Phase 8.3 added its disclosure. For consistency between two calculators sharing the identical mathematical model (Section 22's internal-consistency principle), added the exact required sentence to `formulaDetail`, appended after the existing (still-accurate, unrelated) variation/deviation note:

> "Does not apply variation/deviation; output is true bearing. This calculation uses spherical-Earth geometry and is an approximation of the corresponding ellipsoidal geodesic bearing."

Formula itself (`initial_bearing_deg()`) unmodified.

### Cross-Track Error

Verified the implementation does **not** use spherical great-circle geometry — `cross_track_error_nm(along_nm, error_deg) = along_nm × sin(error_deg)` takes only a distance and an angle, no coordinates, no spherical trig beyond a single `sin()`. Per the brief's explicit instruction ("If the implementation does not actually use spherical geometry, do not add this statement"), the spherical-geometry sentence was **correctly withheld**. Existing disclosure ("small-angle linearized cross-track estimate for quick mental checks") already accurately describes the actual (planar, linearized) model. **PASS — no change.**

### Other Models

- **Rhumb distance:** confirmed the model is mid-latitude plane sailing, a materially different approximation class than haversine/spherical trigonometry. Its existing, more specific disclosure was left untouched rather than diluted with a less-accurate generic sentence.
- **Longitude-minute:** spherical relation (`cos(lat)`), low materiality (content doesn't overclaim), left unchanged.
- **Geographic range of lights:** curvature-tangent-line formula; the material caveat is atmospheric/refraction, already disclosed; no sphere-vs-ellipsoid disclosure added (would not be the operative source of error for this formula's use case).

### Radar Horizon

Verified the disclosure ("...standard 4/3-Earth-radius atmospheric-refraction model; actual radar range can vary with atmospheric conditions, antenna height, and target characteristics.") remains technically accurate and unchanged. Independently re-confirmed via `git diff` and direct source read that the implementation is unchanged: height in meters is still converted to feet (`h_ft = h_m / 0.3048`) before applying the 1.23 feet-calibrated coefficient, with nautical-mile output. **PASS — not replaced, no numerical change.**

### Wave Height

Verified the disclosure ("...assumes a fully developed sea in open water; actual wave height also depends on fetch, wind duration, water depth, and other sea-state conditions.") accurately describes the SMB-style simplified model and does not overstate it as a forecast or introduce any new wave-generation model. Formula (`0.024 × pow(windSpeed × 0.514444, 2)`) unchanged. **PASS.**

---

## Workstream C — Navigation Terminology

Full repository sweep for `heading`, `course`, `bearing`, `true heading`, `magnetic heading`, `true bearing`, `magnetic bearing`, `variation`, `easterly variation`, `westerly variation` across `data/`, `components/`, `lib/`.

### Heading

`true-magnetic-heading-calculator` consistently and correctly uses "heading" throughout (`description`, input/output labels) — this calculator genuinely computes vessel heading (compass-referenced orientation), so "heading" is the correct term. **PASS.**

New entity `"heading"` added to `data/entities.json` using the exact required definition (this term had no prior entity), since the site now has multiple heading-related calculators and content that benefit from a canonical glossary definition.

### Course

`data/navigation.json`'s "Dead Reckoning Explained" article uses "course" consistently and correctly (course = intended direction of travel used in DR position estimation — "course steered," "course and speed") — matches the required Section 18 definition exactly in substance. **PASS, no change.**

New entity `"course"` added to `data/entities.json` using the exact required definition (no prior entity existed, and the term is used correctly elsewhere but had no canonical glossary definition to anchor it).

### Bearing

Existing `data/entities.json` `"bearing"` entity was **updated** — its prior wording ("A bearing is a direction expressed as an angle, usually clockwise from north (true or magnetic), used to describe courses and relative positions") was accurate but less precise than the required Section 18 wording, and specifically omitted the defining relationship (bearing is measured *to* a referenced object/position, which is what distinguishes it from heading). Replaced with the exact required definition: "Bearing is the direction from the observer or vessel to a referenced object or position, expressed as an angle from north."

Two genuine terminology mismatches found via the mandated repository search and corrected:

1. **`lib/aeo.ts` `SLUG_TO_ENTITIES["true-magnetic-heading-calculator"]`** was `["bearing"]` — meaning the AEO entity-definition block shown on the true/magnetic heading calculator's page displayed the *bearing* definition, even though this calculator computes heading (vessel orientation via variation), not bearing-to-a-point. This is precisely the "bearing used for vessel orientation" contradiction pattern the brief's Section 22 names as an example to search for. **Fixed:** changed to `["heading", "magnetic variation"]`.
2. **`lib/aeo.ts` `SLUG_TO_ENTITIES["drift-set-distance-calculator"]`** was `["bearing", "dead reckoning"]` — but this calculator's formula (`curr × hours`) computes only a drift *distance*; it has no angle/direction input or output at all, so "bearing" cannot be topically justified even loosely. **Fixed:** changed to `["dead reckoning"]`, which is the entity actually relevant to what this calculator computes (a dead-reckoning drift correction).
3. **`data/calculators-phase5.json` `initial-bearing-calculator.description`** read "...(great-circle start heading)" — using "heading" as a parenthetical synonym for what the calculator actually computes (a bearing to a destination point, not vessel-bow orientation). **Fixed:** changed to "...(the great-circle route's starting bearing)."

These are content/data-mapping corrections, not changes to the AEO engine's logic (`lib/aeo.ts`'s functions `getAeoAnswerBlock`, `getAeoKeyTakeaways`, `getEntityLeadForIntro`, and the entity-lookup mechanism itself are all unmodified) — consistent with the brief's instruction not to alter AEO architecture.

### Magnetic Variation

`true-magnetic-heading-calculator` verified: input label "Variation (°, E+ / W−)"; `formula` output is `mod360(mag + var)`, i.e., `True = Magnetic + Variation` with East positive — matches the required convention exactly and was **not changed** (Section 19 explicitly forbids modifying the formula or sign convention). Normalization (`mod360`, range `[0°, 360°)`) also verified unchanged.

New entity `"magnetic variation"` added to `data/entities.json` using the exact required definition, and linked to `true-magnetic-heading-calculator` via the `lib/aeo.ts` mapping fix above.

---

## Contradiction Audit

| Topic | Location A | Location B | Contradiction? | Action |
|---|---|---|---|---|
| Nautical mile ↔ minute of latitude | Every occurrence across `data/*.json` (see Workstream A table) | — | **No** — all now consistently hedged as approximate after Phase 8.3; re-verified this phase | None needed |
| Spherical vs. ellipsoidal Earth model | `great-circle-distance-calculator` (spherical, disclosed) | `initial-bearing-calculator` (spherical, previously undisclosed as an approximation) | **Yes** — same model, inconsistent disclosure | Fixed — added matching disclosure to initial-bearing |
| Heading used for a bearing-labeled entity | `lib/aeo.ts` mapped `true-magnetic-heading-calculator` → `"bearing"` entity | The calculator's own content correctly uses "heading" throughout | **Yes** | Fixed — remapped to `"heading"`/`"magnetic variation"` |
| Bearing entity applied to a calculator with no direction output | `lib/aeo.ts` mapped `drift-set-distance-calculator` → `"bearing"` entity | Calculator computes only a distance (`curr × hours`) | **Yes** | Fixed — removed `"bearing"` |
| "Heading" used loosely for a bearing calculation | `initial-bearing-calculator.description` said "great-circle start heading" | Calculator's title, output label, and `formula` field all correctly say "bearing" | **Yes** (minor) | Fixed — reworded to "starting bearing" |
| Cable presented as universal vs. convention-dependent | `cable-nautical-mile-converter.formula`/`formulaDisplay` (compact, states the 0.1 nm convention plainly) | `cable-nautical-mile-converter.formulaDetail` (explicitly flags convention variability) | **No** — the compact formula fields state OceanCalc's own selected convention (correct for what the calculator does); the formulaDetail correctly discloses that other conventions exist. These are complementary, not contradictory. | None needed |
| Great-circle entity applied to a non-great-circle calculator | `lib/aeo.ts` maps `cross-track-error-calculator` → `"great circle"` entity | `cross-track-error-calculator`'s actual formula uses planar small-angle linearization, not great-circle/haversine geometry | **Yes, but not fixed this phase** | **Deferred** — see Remaining Findings. This is a mathematical-model/entity-mapping mismatch, not a heading/course/bearing/variation terminology issue, so it falls outside this phase's three defined workstreams; recorded rather than silently fixed, per the brief's explicit scope-discipline instruction |

---

## Numerical Integrity

**No numerical calculation formula was changed during Phase 8.4.**

Every edit made in this phase was to: (a) explanatory/disclosure text in `formula`/`formulaDetail`/`description` fields, (b) the `data/entities.json` glossary, or (c) the `lib/aeo.ts` entity-mapping *data table* (which calculator links to which glossary entity — a content association, not a calculation). Confirmed via `git diff`: `lib/formulaParser.ts` has zero changes in this phase beyond what Phase 8.1 already established (the `mod360`/`radar_horizon_nm` edits, unchanged since); no `engine.outputs[].formula` string in either `data/calculators.json` or `data/calculators-phase5.json` was touched. `npm test`'s 130 assertions — which include a full parse-and-evaluate pass over every formula in both data files with each calculator's own default inputs — produced numerically identical results before and after this phase's edits.

---

## Regression

| Command | Result |
|---|---|
| `npm test` | **PASS** — 130 passed, 0 failed (identical to baseline) |
| `npx tsc --noEmit` | **PASS** — no output, no errors |
| `npm run lint` (`next lint`) | **PASS** — "No ESLint warnings or errors" |
| `npm run build` (`next build`, from-scratch, `rm -rf out .next` first) | **PASS** — compiled successfully, 308 static pages, 45/45 tool routes present |

Spot-checked the generated static output (`out/tools/*/index.html`) to confirm the new disclosure/entity text actually shipped: `initial-bearing-calculator` (ellipsoidal-approximation sentence and "starting bearing" wording both present), `true-magnetic-heading-calculator` (Heading and Magnetic variation entity definitions now render on the page in place of the prior Bearing entity block).

---

## Remaining Findings

- **`cross-track-error-calculator`'s `lib/aeo.ts` entity mapping (`["great circle"]`)** doesn't match its actual planar small-angle-linearization model. Identified during this phase's search but deliberately not fixed — it is a mathematical-model/entity-mapping question (Workstream B territory), not a heading/course/bearing/variation terminology question (Workstream C, which is where this phase's entity-mapping fixes were scoped and justified). Candidate for a future phase.
- **Four dead-code duplicate components** (`GreatCircleDistance.tsx`, `AnchorScope.tsx`, `ApparentWind.tsx`, `DistanceToHorizon.tsx`) remain in the repository, unreachable but undeleted, per the explicit instruction not to mix dead-code cleanup into this phase.
- **`latitude-degrees-to-nm-calculator`'s `formulaDisplay`** ("1° latitude = 60 nm") still uses bare "=" notation rather than "≈". This is consistent with the site-wide `formulaDisplay` convention (every calculator's compact formula-display string uses "=" regardless of whether the underlying relationship is exact or approximate) and was deliberately left alone rather than starting a site-wide notation-convention change outside this phase's scope. If a future phase decides to standardize `formulaDisplay` notation for approximate relationships, this would need to be revisited consistently across all calculators, not just this one.
- **No other genuine contradictions were found** in the Workstream A/B/C sweeps beyond those listed in the Contradiction Audit table above.

---

## Scope Confirmation

- **No SEO changes.** `app/sitemap.ts`, `lib/seo.ts`, `lib/seoBuilder.ts`, metadata, canonical URLs, page titles untouched — confirmed absent from `git diff`.
- **No AEO architecture changes.** `lib/aeo.ts`'s functions (`getAeoAnswerBlock`, `getAeoKeyTakeaways`, `getEntityLeadForIntro`, `getEntitiesForCalculator`, `loadEntities`, `definitionAfterEntity`, `entityDisplayName`) are byte-identical to before this phase; only the `SLUG_TO_ENTITIES` data table's two entries were changed, and `data/entities.json`'s definitions were extended/corrected — both are content, not engine logic.
- **No AdSense changes.** `components/ads/*`, `lib/ads.ts` untouched.
- **No calculator redesign.** No component structure, layout, input, button, or display logic changed beyond the two small validation-plumbing lines from Phase 8.3 (already present in the baseline for this phase, not touched again here).
- **No dead-code deletion.** The four remaining dead components identified in Phase 8.2 were explicitly left in place.
- **No numerical-engine changes.** Confirmed above under "Numerical Integrity" — no formula was changed, and none was independently proven necessary during this phase's investigation.
