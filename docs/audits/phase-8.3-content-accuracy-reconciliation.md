# Phase 8.3 — Content Accuracy Reconciliation

**Date:** 2026-08-24
**Basis:** `docs/audits/phase-8.0-maritime-accuracy-audit.md`, `docs/audits/phase-8.0-calculator-verification-matrix.md`, `docs/audits/phase-8.0-maritime-standards-register.md`, `docs/audits/phase-8.1-safety-calculation-corrections.md`, `docs/audits/phase-8.1-reaudit.md`, `docs/audits/phase-8.2-dead-code-cleanup.md` — all read in full before any change.

## Status

# PASS

All findings named in the phase brief (A–I) were resolved. Two additional stale examples not named in the brief, but directly contradicting their own live formulas, were discovered during the mandated broader search (Section 19/20) and corrected under the same rigor (independent calculation before any wording change): `apparent-wind-calculator`'s AWA example and `wind-chill-calculator`'s two feels-like examples.

---

## Corrections

| Calculator | Field | Old text | New text | Reason | Formula verified? |
|---|---|---|---|---|---|
| `radar-horizon-calculator` | `engine.formulaDisplay` | `"d (nm) ≈ 1.23 × √(h), h in meters (approximate)"` | `"Approximate radar horizon: d (nm) ≈ 1.23 × √(h / 0.3048), where h is antenna height in meters."` | Finding A — old text described the pre-fix (buggy) relationship; the live formula (post Phase 8.1) divides by 0.3048 before the coefficient | Yes — matches `lib/formulaParser.ts`'s current `radar_horizon_nm` body exactly |
| `radar-horizon-calculator` | `examples[0]` | `"12 m scanner → ~4.3 nm to sea surface (rough)"` | `"12 m scanner → ~7.7 nm to the sea surface."` | Finding A/5 — old value was the pre-fix (buggy) output | Yes — `radar_horizon_nm(12) = 7.7177` → 7.7 at engine's `decimals:1` |
| `radar-horizon-calculator` | `formulaDetail` (new field) | *(did not exist)* | `"This is an approximate radar-horizon calculation using a standard 4/3-Earth-radius atmospheric-refraction model; actual radar range can vary with atmospheric conditions, antenna height, and target characteristics."` | Finding 6 — scope/assumption disclosure | N/A (disclosure text, not a formula claim) |
| `wave-height-calculator` | `engine.formulaDisplay` | `"Simplified: H ≈ 0.024 × wind_speed_kn² (open water, fetch-limited)"` | `"Simplified SMB-style estimate: H ≈ 0.024 × U², where U is wind speed in m/s."` | Finding B/7 — old text described the pre-fix (knots-squared) relationship; live formula (post Phase 8.1) converts to m/s first | Yes — matches the current `waveHeight_m`/`waveHeight_ft` formula strings |
| `wave-height-calculator` | `formulaDetail` | `"This uses a simplified empirical relationship. Real wave height varies with fetch (distance over water), wind duration, and water depth."` | `"This simplified estimate assumes a fully developed sea in open water; actual wave height also depends on fetch, wind duration, water depth, and other sea-state conditions."` | Finding 8 — replaced rather than duplicated alongside, since the new sentence is a strict superset covering the same fetch/duration/depth caveats plus the missing "fully developed sea" assumption | N/A (disclosure text) |
| `wave-height-calculator` | `examples` | `["20 kn wind → ~9.6 m waves (open ocean)", "10 kn → ~2.4 m", "30 kn → ~21.6 m (storm)"]` | `["10 kn wind → ~0.64 m significant wave height", "20 kn wind → ~2.54 m significant wave height", "30 kn wind → ~5.72 m significant wave height"]` | Finding 9 — old values were the pre-fix (units-error) outputs | Yes — see Formula/Example Verification table below |
| `wave-height-calculator` | `outputs[0].label`, `outputs[1].label` | `"Approx. wave height (m)"` / `"(ft)"` | `"Approx. significant wave height (m)"` / `"(ft)"` | Finding 10 — terminology precision; the output is specifically significant wave height, not maximum/individual/guaranteed/forecast height | N/A (label text) |
| `distance-to-horizon-calculator` | `formula` | `"...In metric: horizon (km) ≈ 3.57 × √(height in meters)..."` | `"...In metric: horizon (km) ≈ 3.92 × √(height in meters)..."` | Finding C — independently derived the live coefficient (3.9248, computed from the actual meters→feet→1.17×√ft→×1.852 code path) before writing this; 3.57 did not match | Yes — see Formula/Example Verification table |
| `distance-to-horizon-calculator` | `faq[1].answer` | `"...In metric: horizon in km ≈ 3.57 × √(height in meters)..."` | `"...In metric: horizon in km ≈ 3.92 × √(height in meters)..."` | Same as above (second occurrence of the identical stale claim) | Yes |
| `nautical-mile-converter` | `formulaDetail` | `"The nautical mile is defined as one minute of latitude (1/60 of a degree). So 60 nautical miles = 1° of latitude."` | `"A nautical mile is exactly 1,852 meters. One minute of latitude is approximately one nautical mile, but its exact length varies slightly with latitude on the reference ellipsoid."` | Finding D — presented an approximation as an exact definition | N/A (definitional text) |
| `nautical-mile-converter` | `faq[2].answer` ("Why do sailors use nautical miles?") | `"Nautical miles align with latitude: one degree of latitude equals 60 nautical miles. This makes chart work and dead reckoning simpler, since distance and position use the same angular measure."` | `"Nautical miles align with latitude: one degree of latitude is approximately 60 nautical miles, with the exact length varying slightly by latitude on the reference ellipsoid. This makes chart work and dead reckoning simpler, since distance and position use closely related angular measures."` | Finding D — minimal syntactic adaptation of the exact given wording so the FAQ still answers its own question (the phase brief permits adaptation where the existing structure requires it) | N/A |
| `great-circle-distance-calculator` | `formulaDetail` | `"A great circle is any circle on Earth's surface whose center is the planet's center. The shortest route between two points lies along the unique great circle that passes through both."` | *(same)* + `" OceanCalc uses a spherical Earth model for this calculation, so results are an approximation of the corresponding ellipsoidal geodesic distance."` | Finding E — appended (not replaced) since the existing sentence serves a different, still-accurate purpose | N/A (disclosure text) |
| `great-circle-distance-calculator` | `examples[0]` | `"New York to London: ~3,076 nm (~5,697 km)"` | `"New York to London: ~3,007.7 nm (~5,570.2 km)"` | Finding F — recalculated from the live formula with the calculator's own default coordinates; old value did not match either the great-circle or the rhumb-line result for the same points | Yes — see table below |
| `great-circle-distance-calculator` | `faq[2].answer` ("Why use nautical miles for great circle?") | `"One nautical mile equals one minute of latitude, so great circle distance in nm relates directly to angular distance. For example, 60 nm is 1° of arc along a great circle."` | `"One nautical mile is approximately one minute of latitude (the exact length varies slightly with latitude on the reference ellipsoid), so great circle distance in nm relates closely to angular distance. For example, 60 nm is approximately 1° of arc along a great circle."` | Finding D (search-all-occurrences requirement) — same exact-identity overstatement found in a second calculator's FAQ | N/A |
| `mercator-scale-factor-calculator` | `formulaDetail` (new field) | *(did not exist)* | `"This calculation uses the spherical Mercator model and does not account for ellipsoidal geodesic corrections."` | Finding E — spherical-model disclosure | N/A |
| `latitude-degrees-to-nm-calculator` | `formula` | `"One degree of latitude equals 60 nautical miles by definition (one minute = one nm)."` | `"One degree of latitude is approximately 60 nautical miles (one minute ≈ one nm); the exact length varies slightly with latitude on the reference ellipsoid."` | Finding D — adapted (not the verbatim entities.json sentence) so the text still describes what this specific calculator computes (`deg × 60`), per the phase brief's syntactic-adaptation allowance | N/A |
| `wind-chill-calculator` | `engine.inputs[0]` (`tempF`) | `{ ..., "default": 35 }` (no `max`, no validation) | `{ ..., "default": 35, "max": 50, "message": "Wind chill is intended for air temperatures at or below 50°F." }` | Finding G — enforced the documented ≤50°F validity bound using the existing `ValidationRule.max`/`.message` mechanism (extended, not replaced) | N/A (validation, not formula) — formula itself unmodified |
| `wind-chill-calculator` | `examples` | `["35°F, 15 mph → ~24°F feels like", "20°F, 25 mph → ~2°F feels like"]` | `["35°F, 15 mph → ~25°F feels like", "20°F, 25 mph → ~3°F feels like"]` | **New finding, not in brief A–I** — discovered during the Section 19/20 broader search; independently recomputed the NWS formula and found both published examples were each 1°F off from the live `windChillF()` output | Yes — see table below |
| `geographic-range-lights-calculator` | `examples[0]` | `"9 ft eye, 80 ft light → ~15 nm combined geometric range"` | `"9 ft eye, 80 ft light → ~14.0 nm combined geometric range"` | Finding H — recalculated from the live `geographic_range_nm()` formula | Yes — see table below |
| `cable-nautical-mile-converter` | `formulaDetail` (new field) | *(did not exist)* | `"A cable is commonly treated as 0.1 nautical mile (185.2 m) in modern maritime usage, but historical and national conventions can differ."` | Finding I | N/A |
| `anchor-shackle-rode-calculator` | `formulaDetail` (new field) | *(did not exist)* | `"Shackle length varies by maritime convention; verify the convention used for the vessel, chart, or reference material."` | Finding I | N/A |
| `anchor-rode-shackles-calculator` | `formulaDetail` (new field) | *(did not exist)* | `"Shackle length varies by maritime convention; verify the convention used for the vessel, chart, or reference material."` | Finding I (same convention ambiguity applies to both shackle-related calculators) | N/A |
| `apparent-wind-calculator` | `examples[0]` | `"6 kn boat, 10 kn true wind, 90° TWA → ~11.7 kn apparent, ~32° AWA"` | `"6 kn boat, 10 kn true wind, 90° TWA → ~11.7 kn apparent, ~59° AWA"` | **New finding, not in brief A–I** — discovered during the Section 19/20 broader search; `apparentWindAngleDeg(6,10,90)` was never covered by the prior regression suite, so this drift between the published example and the live formula went undetected through Phases 8.0–8.2 | Yes — see table below |
| `data/entities.json` | `"nautical mile".definition` | `"A nautical mile is a unit of distance equal to exactly 1,852 meters, tied to one minute of latitude and used worldwide in maritime and aviation navigation."` | `"A nautical mile is exactly 1,852 meters. One minute of latitude is approximately one nautical mile, but its exact length varies slightly with latitude on the reference ellipsoid. It is used worldwide in maritime and aviation navigation."` | Finding D — canonical AEO/entity definition, adapted to retain the accurate "used worldwide..." clause rather than dropping it | N/A |
| `data/measurements.json` | `"nautical-miles".content` | `"...So 60 nautical miles equal one degree of latitude. This makes chart work simple: distance on the chart (using the latitude scale) matches distance in the real world..."` | `"...So 60 nautical miles are approximately one degree of latitude. This makes chart work simple: distance on the chart (using the latitude scale) closely matches distance in the real world..."` | Finding D — the article's first sentence already hedged correctly ("or approximately one minute of latitude"); only the unhedged second-sentence consequence was fixed | N/A |
| `data/measurements.json` | `"nautical-miles".faq[0].answer` | `"...One minute of latitude equals one nautical mile..."` | `"...One minute of latitude is approximately one nautical mile..."` | Finding D | N/A |

**Not changed, and why (to document the discrimination applied, per "do not replace valid simplified navigation explanations where the approximation is explicitly identified as approximate"):**
- `data/calculators.json` `nautical-mile-converter.faq[0].answer` ("...is defined as exactly 1,852 meters...and is based on one minute of latitude...") — already correctly separates the exact definition (1,852 m) from the historical basis ("based on," not "equals"). No false-identity claim present.
- `data/calculators-phase5.json` `great-circle-distance-calculator.examples[1]` and `[2]` (equator/60°N longitude facts) and `latitude-degrees-to-nm-calculator.examples`/`formulaDisplay` — these describe the calculators' own arithmetic under the spherical model they actually implement, not an external geodetic claim; already appropriately hedged with "≈" where relevant, and not named in Finding F's scope (which named only the NYC/London example specifically).
- `data/calculators-phase5.json` `wave-length-from-period-calculator.examples[0]` ("8 s period → ~100 m wavelength (approx.)") — live value is 99.9 m; already labeled "(approx.)" and the 0.1% rounding is immaterial. Confirmed via the mechanical verification pass (see below); not a genuine mismatch.

---

## Formula/Example Verification

Every changed numeric example was independently calculated from the live formula (via a script importing `lib/formulaParser.ts`'s actual, unmodified functions — not a fresh reimplementation, since the goal here is to confirm the *published example* matches what the *deployed calculator* computes) before being written into the content files.

| Calculator | Input | Independent expected | Displayed example | Difference |
|---|---:|---:|---:|---:|
| `radar-horizon-calculator` | 12 m | 7.7177 nm → 7.7 (decimals:1) | ~7.7 nm | 0 (rounding only) |
| `wave-height-calculator` | 10 kn | 0.6352 m → 0.64 (decimals:2) | ~0.64 m | 0 |
| `wave-height-calculator` | 20 kn | 2.5407 m → 2.54 | ~2.54 m | 0 |
| `wave-height-calculator` | 30 kn | 5.7165 m → 5.72 | ~5.72 m | 0 |
| `distance-to-horizon-calculator` | coefficient (km = C·√m) | C = 3.9248 → 3.92 (2dp, matching the display's existing precision style) | ≈3.92 × √m | 0 (rounding only) |
| `great-circle-distance-calculator` | (40.7128,−74.0060)→(51.5074,−0.1278) | 3007.6795 nm → 3007.7 (decimals:1); 5570.2225 km → 5570.2 | ~3,007.7 nm (~5,570.2 km) | 0 (rounding only) |
| `geographic-range-lights-calculator` | eye=9 ft, light=80 ft | 13.9748 nm → 14.0 (decimals:1) | ~14.0 nm | 0 (rounding only) |
| `wind-chill-calculator` | 35°F, 15 mph | 25.4315°F → 25 (decimals:0) | ~25°F | 0 (rounding only) |
| `wind-chill-calculator` | 20°F, 25 mph | 2.6461°F → 3 (decimals:0) | ~3°F | 0 (rounding only) |
| `apparent-wind-calculator` | Vb=6, Vt=10, TWA=90° | apparentWindAngleDeg = 59.0362° → 59 (decimals:0) | ~59° AWA | 0 (rounding only) |

Every difference is explained by display rounding to the calculator's own configured `decimals` value — none required further investigation.

**Mechanical cross-check of all other unchanged numeric examples** (run to confirm nothing else was silently broken or already-wrong): a script computed the live value for every other example with a clear numeric claim across both data files — hull speed (32 ft, 40 ft), initial bearing (NYC→London), VMG (6 kn @ 30°), speed over ground (6, 1.5, 45°), cross-track error (10 nm, 5°), Mercator scale factor (60°, 45°), longitude-minute (10′ @ 45°), rhumb distance (40,−74→41,−73), and every straightforward unit-conversion example (nautical mile, knots, fathom, statute mile, bar/psi, liters/gallons, pounds/kg, kW/hp, m/s/knots, inHg/mbar, sq ft/sq m, cubic ft/liters, anchor scope, sailing time, boat fuel) — all matched their published examples exactly (within display rounding). Only the two new findings above (wind chill and apparent wind) and the findings named in the phase brief required a change.

---

## Standards/Convention Corrections

- **Nautical mile / minute of latitude:** every public-facing statement presenting the relationship as an exact identity (`data/calculators.json` nautical-mile-converter and great-circle-distance-calculator, `data/calculators-phase5.json` latitude-degrees-to-nm-calculator, `data/entities.json`, `data/measurements.json`) was corrected to state the exact modern definition (1,852 m) separately from the approximate, ellipsoid-varying relationship to latitude. Statements that were already appropriately hedged (`"based on"`, `"or approximately"`, `"≈"`) were left untouched.
- **Great-circle / spherical Earth model:** `great-circle-distance-calculator.formulaDetail` now discloses the spherical-model assumption. The underlying `haversine_nm()` formula was not modified.
- **Mercator scale:** `mercator-scale-factor-calculator` now has a `formulaDetail` disclosing the spherical Mercator model. The underlying `mercator_scale_factor()` formula was not modified.
- **Cable:** `cable-nautical-mile-converter.formulaDetail` now discloses that the 0.1 nm/185.2 m convention is a modern usage, not a universal historical one. The calculator's own conversion (which uses the 0.1 nm convention) was not changed — Finding I explicitly forbids inventing a different "correct" convention.
- **Shackle:** both `anchor-shackle-rode-calculator` and `anchor-rode-shackles-calculator` now disclose that shackle length varies by convention, without asserting a single universal historical definition. Neither calculator's 15-fathom/90-ft arithmetic was changed.

---

## Wind Chill

**Validation was changed.** `data/calculators.json`'s `wind-chill-calculator.engine.inputs[0]` (`tempF`) gained `"max": 50` and `"message": "Wind chill is intended for air temperatures at or below 50°F."`. This uses the pre-existing `ValidationRule.max`/`.message` mechanism in `lib/validation.ts` (already used by other calculators' `min` rules) — no new validation architecture was invented. Two small, additive code changes were required to wire a per-input custom message through to the UI, since the engine previously only supported the generic default message:
- `components/calculator-engine/InputField.tsx`: added `message?: string` to the `InputConfig` interface.
- `components/calculator-engine/CalculatorEngine.tsx`: added one line, `if (input.message !== undefined) rules.message = input.message;`, to its existing validation `useMemo`.

**The formula itself (`windChillF()` in `lib/formulaParser.ts`) was not modified.** Confirmed via `git diff` — this file's only changes across Phases 8.1–8.3 remain the `mod360()`/`radar_horizon_nm()` edits from Phase 8.1; `windChillF` is byte-identical to its Phase 8.0-audited state.

**Why:** the documented validity bound (≤50°F) was previously unenforced, meaning the NWS formula could silently be applied outside its officially valid range. Enforcing it makes the calculator's public behavior honest about its own stated scope, per the phase's explicit instruction.

Independent verification, confirmed via the shipped static build (`out/tools/wind-chill-calculator/index.html`): the input element now renders with `max="50"`, and the custom message string is embedded in the page's serialized engine config, ready to display client-side when a user enters a temperature above 50°F.

---

## Scope

- **No SEO changes.** `lib/seo.ts`, `lib/seoBuilder.ts`, `app/sitemap.ts`, metadata, and canonical URL logic untouched — confirmed absent from `git diff`.
- **No AEO changes** beyond the one entity-definition text correction explicitly required by Finding D (`data/entities.json`); `lib/aeo.ts`'s logic, the slug-to-entity mapping, and every other entity definition are untouched.
- **No AdSense changes.** `components/ads/*`, `lib/ads.ts` untouched.
- **No calculator redesign.** No component was restructured; `CalculatorEngine.tsx`/`InputField.tsx` received only the two small, additive lines described above.
- **No unrelated content rewriting.** Every changed string is listed in the Corrections table above with a specific finding or independently-verified defect as its reason; no calculator introduction, tone, heading, or unrelated FAQ was touched.
- **No internal linking, calculator cluster, or homepage structure changes.** `data/calculatorClusters.json`, `lib/internalLinker.ts`, `app/layout.tsx`, `app/page.tsx` untouched — confirmed absent from `git diff`.
- The three Phase 8.1 numerical corrections (radar horizon, wave height, true/magnetic heading) and the Phase 8.2 dead-code removal are unmodified in this phase — confirmed by re-reading `lib/formulaParser.ts`'s `radar_horizon_nm`/`mod360`/`beaufort` and `components/CalculatorRenderer.tsx`, all identical to their post-8.2 state.

---

## Regression

Run from a clean state (`rm -rf out .next` before the build):

| Command | Result |
|---|---|
| `npm test` | **PASS** — 130 passed, 0 failed (128 prior + 2 new: `apparentWindAngleDeg`, `windChillF(20,25)`) |
| `npx tsc --noEmit` | **PASS** — no output, no errors |
| `npm run lint` (`next lint`) | **PASS** — "No ESLint warnings or errors" |
| `npm run build` (`next build`, from-scratch) | **PASS** — compiled successfully, 308/308 static pages, 45/45 tool routes present |

**Specifically verified affected calculators** (via direct inspection of the generated static HTML in `out/tools/`, confirming the corrected text actually shipped, not just changed in source): `radar-horizon-calculator` (formula/example text), `wave-height-calculator` ("significant wave height" terminology), `distance-to-horizon-calculator` (3.92 coefficient), `nautical-mile-converter` ("reference ellipsoid" wording), `great-circle-distance-calculator` ("spherical Earth model" disclosure + corrected example), `mercator-scale-factor-calculator` ("spherical Mercator model" disclosure), `wind-chill-calculator` (`max="50"` + custom message embedded), `geographic-range-lights-calculator` (14.0 nm example), `cable-nautical-mile-converter` and `anchor-shackle-rode-calculator`/`anchor-rode-shackles-calculator` (convention-disclosure text) — all confirmed present in the built output.

**45-calculator regression:** confirmed via `git diff` that only the calculators listed in the Corrections table above had any field changed; every other calculator's JSON record is byte-identical to its Phase 8.2 state.

---

## Remaining Phase 8 Findings

These were explicitly out of scope for Phase 8.3 (not named in Findings A–I, and Section 1 instructs not to broaden scope beyond what's listed) and remain open:

- **D-1 (Phase 8.0/8.2):** four dead-code duplicate calculator components (`GreatCircleDistance.tsx`, `AnchorScope.tsx`, `ApparentWind.tsx`, `DistanceToHorizon.tsx`) remain in the repository, unreachable but undeleted, per Phase 8.2's explicit scope decision. Not a content-accuracy matter.
- **M-3 residual:** the great-circle spherical-model disclosure was added to `formulaDetail`; the *initial-bearing-calculator* and other spherical-model-dependent calculators (e.g., cross-track-error's underlying geometry) do not carry an equivalent explicit disclosure. Not named in the Phase 8.3 brief; candidate for a future phase if the site's disclosure standard is extended beyond the specifically-named calculators.
- **Terminology cross-reference (noted in Phase 8.1 re-audit, Section 6 of the master report):** no dedicated content anywhere explicitly distinguishes heading vs. course vs. bearing as a standalone explainer; each calculator uses its own term correctly and consistently, but there's no cross-referencing glossary entry. Not named as a Phase 8.3 finding.
- **`data/calculators.json` `nautical-mile-converter.faq[0].answer`** ("...based on one minute of latitude...") was reviewed and deliberately left unchanged (see "Not changed, and why" above) — flagged here only so it's clear this was a considered decision, not an oversight.

No finding named in the Phase 8.0 audit as affecting the three Phase 8.1-corrected calculators (radar horizon, wave height, true/magnetic heading) remains open — all of their associated stale content (including the two newly-discovered items) is now resolved.
