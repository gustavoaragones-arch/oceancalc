# Phase 8.0 — Maritime Calculation Accuracy & Standards Audit
## Executive / Master Report

**Audit date:** 2026-08-24
**Repository state audited:** branch `main`, commit `3c98f26` ("Add favicon via app/icon.png"), working tree clean at audit start and end (verified via `git status --short`).
**Scope:** Formal technical accuracy audit of every calculator, unit conversion, maritime constant, geographic/navigation formula, and related explanatory/FAQ content in OceanCalc. This is an audit-and-evidence-gathering phase only — **no application source, calculator data, or content was modified.**

---

## 1. Audit Scope

Per the Phase 8.0 instructions, this audit evaluates whether OceanCalc's numerical results, formulas, constants, unit conversions, terminology, rounding, validation, and explanatory content are technically correct and consistent with recognized international maritime, navigation, measurement, mathematical, and scientific standards. SEO, AdSense, rankings, and AEO value were explicitly excluded from the accuracy verdict, per Rule 32.

All findings trace to specific files and, where applicable, line numbers or JSON slugs (Rule 35 / Section 36).

---

## 2. Repository Inventory

The following were inspected directly (not just page copy):

- **Data:** `data/calculators.json` (13 records), `data/calculators-phase5.json` (32 records), `data/entities.json`, `data/calculatorClusters.json`, `data/knots.json`, `data/navigation.json`, `data/wind-waves.json`, `data/measurements.json`, `data/sailing.json`, `data/contentTemplates.ts`, `data/topicClusters.json`, `data/contentGraph.json`.
- **Calculation logic:** `lib/formulaParser.ts` (the safe expression parser and its 16 custom navigation/maritime functions), `lib/unitConverter.ts`, `lib/calculators/{units,nautical,navigation,wind,precision,validators,types,index}.ts`, `lib/validation.ts`.
- **Content/AEO layer:** `lib/aeo.ts`, `lib/contentGenerator.ts`, `lib/contentLoader.ts`.
- **Rendering:** `components/CalculatorRenderer.tsx`, `components/CalculatorToolPage.tsx`, `components/CalculatorLayout.tsx`, `components/calculator-engine/{CalculatorEngine,InputField,OutputField,FormulaRenderer,UnitSelector}.tsx`, and every file in `components/calculators/*.tsx` (`DistanceToHorizon`, `GreatCircleDistance`, `BeaufortScale`, `ApparentWind`, `AnchorScope`, `UnitConverter`, `CalculatorCard`).

**Total calculators found: 45** (see the companion Calculator Verification Matrix for the full slug-by-slug inventory — every one was individually audited, none collapsed).

A significant structural finding emerged directly from this inventory step (Rule: "do not assume `data/calculators*.json` contains the complete calculation logic," and Section 2's instruction to inspect the actual rendering path): **five standalone `.tsx` components in `components/calculators/` are dead code.** `components/CalculatorRenderer.tsx:22` renders the generic `<CalculatorEngine>` whenever a calculator record has an `engine` field — before it ever reaches the `switch (calculator.type)` block that would otherwise route to `DistanceToHorizonCalculator`, `GreatCircleDistanceCalculator`, `AnchorScopeCalculator`, `BeaufortScaleCalculator`, or `ApparentWindCalculator`. All five corresponding JSON records (`distance-to-horizon-calculator`, `great-circle-distance-calculator`, `anchor-scope-calculator`, `beaufort-scale-calculator`, `apparent-wind-calculator`) have an `engine` field, so all five standalone components are unreachable in production. This was confirmed by a repository-wide `grep` for their imports (only `CalculatorRenderer.tsx` imports them) and by cross-referencing every relevant JSON record for the presence of `engine`. See Finding D-1.

---

## 3. Standards Hierarchy & Sources Consulted

The Tier 1–4 hierarchy specified in the audit brief was applied. Live sources consulted this session (Tier 1–3, with URLs, via WebSearch/WebFetch on 2026-08-24):

- International Hydrographic Organization 1929 Monaco resolution (nautical mile = 1,852 m exactly) — cross-referenced via NIST SP 811 (§ B.6).
- Bowditch, *American Practical Navigator* (geographic-range-of-a-light formula, 1.17×(√Ho+√Hl); rhumb-line/Mercator-sailing method as a comparison basis).
- Furuno "Radar Horizon" technical note and Wikipedia "Radar horizon" (4/3-Earth-radius refraction model), cross-checked against an independent first-principles derivation (`d = √(2·(4/3)·Rₑ·h)`).
- WMO Beaufort scale wind-speed bands (used to validate both the Beaufort calculator and, critically, as an independent cross-check on the wave-height calculator).

Constants treated as **established SI/legal definitions** (fixed by international agreement, not independently re-fetched this session because their values are unambiguous and non-controversial across every Tier 1–3 source known to the auditor — flagged explicitly rather than silently assumed, per Rule 1): international foot (0.3048 m exact, 1959 agreement), international nautical mile (1,852 m, already independently verified above), fathom (6 ft = 1.8288 m), avoirdupois pound (0.45359237 kg), US gallon (3.785411784 L), standard gravity (9.80665 m/s²).

The full source-by-source register, with the specific claim each source supports, is in `docs/audits/phase-8.0-maritime-standards-register.md`.

---

## 4. Calculator Inventory & Overall Accuracy Status

Full detail in `docs/audits/phase-8.0-calculator-verification-matrix.md`. Summary of the 45 individually audited calculators:

| Status | Count |
|---|---|
| PASS | 30 |
| PASS WITH DOCUMENTATION NOTE | 10 |
| CONDITIONAL | 1 |
| FAIL (live, customer-facing) | 3 |
| PASS (live) / FAIL (dead code, unreachable) | 1 |
| UNVERIFIED | 0 |

No claim in this audit was left UNVERIFIED — every formula traced to a source (Tier 1–4) or was independently re-derived from first principles and/or independently reproduced in Node.js outside the application code, per Rule 29.

---

## 5. Critical Findings

These are live, customer-facing defects that produce materially wrong numeric output.

### C-1 — *(superseded — see Finding D-1)* Beaufort scale boundary gaps are dead code, not live
Initially identified as critical, then downgraded after confirming the defective implementation (`components/calculators/BeaufortScale.tsx:8-27`) is unreachable in production. Retained here only to document the investigation; the substantive finding is filed as D-1 below.

### C-2 — Radar horizon calculator understates radar horizon by ≈45%
**File:** `lib/formulaParser.ts:116-118` (`radar_horizon_nm`), wired to the live UI via `data/calculators-phase5.json`, slug `radar-horizon-calculator` (input `h_m`, unit "meters").
**Issue:** The formula `1.23 × √h` uses a coefficient (1.23) that authoritative sources (Furuno; Wikipedia "Radar horizon"; independently re-derived from `d=√(2·(4/3)·Rₑ·h)`) calibrate for **height in feet**. OceanCalc's input field is canonicalized to **meters**, and the meters value is passed directly into the feet-calibrated formula with no unit conversion.
**Quantified impact:** Independently reproduced in Node.js across four test heights (5, 12, 20, 30 m): OceanCalc's output is a constant **55.3%** of the physically correct value at every height (e.g., a 12 m antenna: tool says 4.26 nm, correct value ≈7.71 nm). The error is systematic, not a rounding artifact.
**Why it matters:** Radar horizon informs collision-avoidance and detection-range planning — a 45% understatement is navigation-safety relevant, not cosmetic.

### C-3 — True/magnetic heading calculator produces invalid headings when crossing 000°/360°
**File:** `data/calculators-phase5.json`, slug `true-magnetic-heading-calculator`, `engine.outputs[0].formula = "mag + var"`.
**Issue:** The formula has no modulo/normalization step. `lib/formulaParser.ts`'s expression parser does not expose a modulo or conditional function to formula authors, so this class of defect cannot be patched within the current JSON-formula system without adding a new custom function.
**Quantified impact:** Reproduced directly: 350° magnetic with +20° (easterly) variation returns **370°** (should normalize to 10°); 5° magnetic with −20° (westerly) variation returns **−15°** (should normalize to 345°).
**Why it matters:** A heading of "370°" or "−15°" is not a valid compass reading; a user near the 000°/360° boundary gets an obviously-wrong number rather than a correct one. The underlying sign convention (East-positive/West-negative) is correct and properly disclosed — this is purely a missing-normalization defect.

### C-4 — Wave-height calculator overestimates significant wave height by roughly 4–6×
**File:** `data/calculators.json`, slug `wave-height-calculator`, `engine.outputs[0].formula = "0.024 * windSpeed * windSpeed"`; `windSpeed` is canonicalized to **knots** by `components/calculator-engine/CalculatorEngine.tsx`.
**Issue:** The coefficient 0.024 matches the well-known Sverdrup-Munk-Bretschneider (SMB) fully-developed-sea approximation `Hs(m) ≈ 0.024·U²`, which every published form of this relation calibrates for **U in m/s** — not knots. No conversion from knots to m/s occurs before the formula is applied.
**Quantified impact:** Cross-checked against the WMO Beaufort/sea-state table (an independent Tier 1 reference, not derived from OceanCalc's own formula): 20 kn → tool gives 9.6 m vs. WMO's probable ≈2 m (≈5× high); 30 kn → tool gives 21.6 m vs. WMO's probable ≈4 m (≈5.4× high); 50 kn → tool gives 60 m vs. WMO's probable ≈9 m (≈6.7× high). Re-running the same formula with wind speed correctly expressed in m/s (20 kn = 10.29 m/s → 0.024×10.29² = 2.54 m) lands almost exactly on the WMO figure, strongly confirming the units-calibration diagnosis.
**Why it matters:** This is not a minor rounding issue — it is an order-of-magnitude-adjacent error that would materially mislead anyone using the tool for weather-routing or heavy-weather planning. It is also internally inconsistent with OceanCalc's own Beaufort-scale sea-state descriptions (e.g., the Beaufort content's Force 7 description implies moderate/large waves, not the ≈21.6 m the wave-height calculator would predict for the same wind speed) — a direct cross-calculator inconsistency (Section 28 of the audit brief).

### D-1 — Beaufort scale boundary-gap bug exists, but is dead code (not customer-facing)
**File:** `components/calculators/BeaufortScale.tsx:8-27`.
**Issue:** `BEAUFORT.find(b => kn >= b.minKn && kn <= b.maxKn)` uses integer-only `minKn`/`maxKn` bounds per band (e.g., force 1: 1–3 kn, force 2: 4–6 kn). Any non-integer input falling in a gap between bands (e.g., 3.5, 6.5, 10.5 kn — directly reachable via the component's own `step="0.5"` input) matches no band and falls through to the `?? BEAUFORT[12]` fallback, misreporting the input as **Force 12 Hurricane**.
**Quantified impact:** Independently reproduced in Node.js: all 11 tested half-knot boundary values (3.5 through 63.5) return Force 12.
**Reachability:** Confirmed via static trace that this component is **not rendered by any live route.** `components/CalculatorRenderer.tsx:22` renders `<CalculatorEngine>` whenever `calculator.engine` is present; `data/calculators.json`'s `beaufort-scale-calculator` record has an `engine` field, so the `switch (calculator.type) { case "beaufort": ... }` branch that would render this component is unreachable. The live path (`lib/formulaParser.ts:34-48` `beaufort()`, a cascading `<=` chain with no gaps) was independently tested at the same boundary values and found correct.
**Why it's still worth fixing:** dormant, incorrect code is a landmine — a future refactor that changes `CalculatorRenderer`'s branch order, or that removes the `engine` field thinking the component is the "real" implementation, would silently reintroduce a safety-relevant misclassification. Recommend deleting the five dead components (see Section 11) rather than leaving them to bit-rot.

---

## 6. Material Findings

Defects or inaccuracies that are real but do not rise to safety-critical, or that are confined to disclosed-approximation territory with an undisclosed edge.

- **M-1 — Distance-to-horizon calculator's metric formula text doesn't match its own computed output.** `data/calculators.json`, slug `distance-to-horizon-calculator`: the `formula` and `faq[1].answer` fields state "horizon (km) ≈ 3.57 × √(height in meters)," but the calculator's actual code path (`components/calculator-engine/CalculatorEngine.tsx`, converting to canonical feet, then `1.17×√ft`, then ×1.852 for km) computes a relationship closer to **3.92 × √m** — a ≈9–10% gap between the published metric formula text and the tool's real output. Confirmed by direct computation at h=1, 1.83, and 9.14 m.
- **M-2 — "Nautical mile = 1 minute of latitude" is stated as an exact identity in several places** (`data/entities.json` "nautical mile"; `data/calculators.json` `nautical-mile-converter.formulaDetail`; `data/calculators-phase5.json` `latitude-degrees-to-nm-calculator.formula`; `data/navigation.json`). The modern, legally exact definition of the nautical mile is a fixed 1,852 m (IHO 1929); 1′ of latitude arc on the real ellipsoidal Earth varies from ≈1,842.9 m (equator) to ≈1,861.7 m (poles). The site's own spherical Earth-radius constant used elsewhere (R=3,440.065 nm in the great-circle calculator) implies 1′ of latitude ≈1.00073 nm on its own internal model — not exactly 1.000 nm. This is a widely used simplification in general-audience navigation writing, but as currently worded it overstates precision and is not perfectly self-consistent with the site's own great-circle constant.
- **M-3 — Great-circle and Mercator-scale calculators use a spherical Earth model without disclosing it.** `lib/formulaParser.ts` (`haversine_nm`, `mercator_scale_factor`) and their JSON-driven UI content do not state that a spherical (not WGS84 ellipsoidal) model is in use. The resulting error is typically <0.5% for great-circle distance versus an ellipsoidal calculation — an acceptable approximation for a general planning tool — but Section 8 of the audit brief specifically requires the model to be explicitly identified, and it currently is not.
- **M-4 — Great-circle calculator's own published example doesn't match its own formula.** `data/calculators.json`, `great-circle-distance-calculator.examples[0]`: "New York to London: ~3,076 nm (~5,697 km)." Independently reproducing the tool's exact haversine formula with the tool's own default coordinates (40.7128,−74.0060 → 51.5074,−0.1278) yields **3,007.68 nm / 5,570.2 km** — a 2.27% / 68 nm discrepancy. The published figure also doesn't match the rhumb-line distance for the same points (3,140.58 nm), ruling out a great-circle/rhumb-line mix-up as the explanation; it appears to simply be a stale or miscalculated example value.
- **M-5 — Wind-chill calculator's upper temperature bound is documented but not enforced.** `data/calculators.json`, `wind-chill-calculator`: content correctly states the NWS formula "only applies when temp ≤ 50°F," but the engine input config has no `max` validation rule, so the formula is silently applied outside its officially valid range for any input above 50°F.
- **M-6 — Geographic-range-of-lights example is off by ≈7%.** `data/calculators-phase5.json`, `geographic-range-lights-calculator.examples[0]`: "9 ft eye, 80 ft light → ~15 nm." Recomputing the tool's own formula gives 1.17×(√9+√80) = 1.17×(3+8.944) ≈ 13.98 nm — the published example rounds up by roughly 1 nm (≈7%) more than the formula actually produces.
- **M-7 — "Cable" unit has no single international definition, but OceanCalc presents one value without qualification.** `data/calculators-phase5.json`, `cable-nautical-mile-converter` and, by extension, `anchor-shackle-rode-calculator`/`anchor-rode-shackles-calculator` (shackle-length convention). The cable is variously 608 ft (UK Admiralty, historical), 720 ft (US Navy "shot"), or 1/10 international nm = 185.2 m (a modern simplification, which is what OceanCalc uses). This is a defensible convention but is presented as if it were the only one.

---

## 7. Documentation-Only Findings (Correctly-Disclosed Approximations)

Included for completeness because Rule 33 requires distinguishing genuinely well-handled cases from defects — these are examples of the audit finding the content team got it right:

- **Hull speed** (`hull-speed-calculator`): explicitly and correctly disclosed as a rule of thumb, not a hard limit, in its own FAQ. Independently confirmed the 1.34 coefficient corresponds to Froude number ≈0.4 via first-principles derivation.
- **Rhumb-line distance** (`rhumb-distance-calculator`): explicitly self-discloses "mid-latitude plane approximation, not exact Mercator sailing" and recommends great-circle tools for ocean legs. Independent comparison against a true Mercator-sailing (isometric-latitude) implementation showed the divergence is small (0.0–0.4% across four test legs, worst case at 70–75°N) — a properly scoped and disclosed approximation.
- **Cross-track error** (`cross-track-error-calculator`): explicitly disclosed as a "small-angle linearized estimate for quick mental checks," not the full spherical XTE formula.
- **Capsize screening formula** (`capsize-screening-calculator`): explicitly disclosed as "not a substitute for stability letters, STIX, or naval architecture review."
- **VMG calculator** (`vmg-calculator`): its own content correctly scopes it as geometric velocity-made-good toward a waypoint, not a true-wind polar-performance VMG — avoiding a common ambiguity the audit brief specifically warned about (Section 15).

---

## 8. Unverified Items

None. Every substantive formula or constant in the repository was either traced to a Tier 1–3 source located during this audit, or independently re-derived from first principles and cross-checked numerically. Where a convention has multiple defensible historical variants (cable length, shackle length), this is documented as such (Findings M-7, and the shackle-convention notes on calculators #23/#43 in the matrix) rather than marked UNVERIFIED, because the specific convention OceanCalc uses is internally consistent and traceable — the finding is a disclosure gap, not an unverifiable claim.

---

## 9. Cross-Calculator Inconsistencies

1. **Wave height vs. Beaufort sea-state description** (Finding C-4): the wave-height calculator's output for a given wind speed is 4–6× larger than the sea-state heights implied by OceanCalc's own Beaufort-scale content for the same wind speed.
2. **"1′ latitude = 1 nm" (asserted as exact) vs. the great-circle calculator's own R=3,440.065 nm constant** (Finding M-2): these two internally-used facts are not perfectly consistent with each other on the site's own spherical model.
3. **Distance-to-horizon's stated metric formula (3.57×√m) vs. its own computed output (≈3.92×√m)** (Finding M-1): a self-contradiction within a single calculator's content, not between two different calculators, but functionally the same category of defect Section 28 asks to be caught.
4. No inconsistency was found in the mph↔knot conversion factor (1.15078), the nautical-mile-to-km factor (1.852), or the foot/fathom/pound/gallon constants — all were checked for use across every file that references them and found identical everywhere.

---

## 10. Navigation-Safety Findings

Per Section 31, the calculators whose output could reasonably influence real-world navigation decisions were specifically assessed for whether their assumptions/limitations are adequately communicated:

| Calculator | Adequately communicates limitations? |
|---|---|
| Great-circle distance | Partially — spherical-Earth model not disclosed (M-3), but error is small and the calculator is not the kind of tool likely to be used for precision offshore routing without a chartplotter cross-check |
| Rhumb-line distance | **Yes** — explicitly discloses its approximation and recommends alternatives |
| Initial bearing | Yes — explicitly notes bearing changes along a great-circle arc, only gives the starting heading |
| True/magnetic heading | Partially — sign convention is well disclosed; the 000°/360° wraparound defect (C-3) is not disclosed because it is not known to the content authors as a defect |
| Radar horizon | **No** — the ≈45% understatement (C-2) is undisclosed and the content presents the figure as a usable planning number |
| Geographic range of lights | Yes, with a minor (≈7%) example inaccuracy (M-6) |
| Wave height | **No** — the 4–6× overestimate (C-4) is undisclosed; content only generically notes "actual height depends on fetch, duration, and depth," which does not describe or bound the magnitude of error found |
| Cross-track error | Yes — explicitly scoped as an estimate |
| Speed over ground | Yes — correctly scoped to SOG magnitude only |

---

## 11. Recommended Corrective Phases

Not implemented in this phase, per Rule 2/36. Recommended prioritization for a future corrective phase:

1. **Phase 8.1 (safety-relevant fixes):** correct the radar-horizon unit mismatch (C-2), correct the wave-height units mismatch (C-4), add modulo normalization to the true/magnetic heading calculator (C-3) — likely requires adding a `mod360()` custom function to `lib/formulaParser.ts`'s `DEFAULT_CUSTOM_FUNCTIONS`.
2. **Phase 8.2 (dead code cleanup):** either delete the five unreachable `components/calculators/*.tsx` components (D-1) or fix `components/CalculatorRenderer.tsx`'s routing precedence and re-verify each one before re-enabling; if deleted, the Beaufort gap bug (D-1) is moot.
3. **Phase 8.3 (content corrections):** fix the great-circle example figure (M-4), the distance-to-horizon metric-formula text (M-1), the geographic-range example (M-6), add the wind-chill upper-bound validation (M-5), and soften the "nautical mile = 1′ latitude" and "spherical model" disclosures (M-2, M-3) to be precise about approximation vs. exact definition.
4. **Phase 8.4 (disclosure additions):** disclose the cable/shackle historical-convention ambiguity (M-7).

---

## 12. Repository Changes

Confirmed via `git status --short` before and after this audit: **no production application files were modified.** The only files created are the three audit documents in `docs/audits/`:

- `docs/audits/phase-8.0-maritime-accuracy-audit.md` (this file)
- `docs/audits/phase-8.0-calculator-verification-matrix.md`
- `docs/audits/phase-8.0-maritime-standards-register.md`

No `.ts`, `.tsx`, `.js`, `.json`, CSS, metadata, sitemap, routing, or deployment configuration file was edited, formatted, or otherwise touched.

---

## 13. Final Certification Recommendation

Three live, customer-facing calculators (radar horizon, wave height, true/magnetic heading at the 000°/360° boundary) produce materially or categorically wrong output, one of which (wave height) is off by a factor of 4–6× and directly contradicts the site's own Beaufort-scale content. Per Rule ("Do not use CERTIFIED unless every material calculator has passed"), certification cannot be granted as-is.

# NOT CERTIFIED

Recertification should be sought after Phase 8.1 (the three live FAIL items) is completed and independently re-verified; Phases 8.2–8.4 address code hygiene and disclosure quality but are not blocking for a re-audit of numerical correctness specifically.
