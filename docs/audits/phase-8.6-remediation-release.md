# Phase 8.6 — Maritime Accuracy Remediation & Production Release

**Date:** 2026-08-24/25
**Basis:** `docs/audits/phase-8.5-final-maritime-accuracy-certification.md` (NOT CERTIFIED — blocker was production/repository sync, not a remaining repository defect), plus `docs/audits/phase-8.1-safety-calculation-corrections.md`, `phase-8.1-reaudit.md`, `phase-8.2-dead-code-cleanup.md`, `phase-8.3-content-accuracy-reconciliation.md`, `phase-8.4-standards-convention-reconciliation.md` — all read in full before any change.

## Starting State

```
git rev-parse HEAD        -> 3c98f268bb1993801fb849f907ed4f9f6e4dc10e
git status --short        -> 11 modified/deleted tracked files + 2 untracked paths (docs/, scripts/test-formula-engine.ts),
                              identical to the state at the end of Phase 8.5 — the accumulated, already-audited
                              Phase 8.1-8.4 corrections, uncommitted.
```

This accumulated work was **preserved, not discarded, reset, or stashed** — it is the corrected implementation this phase releases.

---

## F-1 Correction

**Finding (Phase 8.5):** `distance-to-horizon-calculator`'s "6 ft → ~5.4 km" example doesn't match its own live formula (`1.17×√6×1.852 = 5.3077 km`, rounds to ~5.3 km).

**Search performed:** `grep -rn "5.4 km|5.4km"` across the entire repository (`.json`/`.ts`/`.tsx`, excluding `node_modules`/`.next`/`out`). Found exactly two occurrences, both in `data/calculators.json`, both confirmed to belong to `distance-to-horizon-calculator` (identified by the co-located "6 ft"/"2.9 nm" context, not a blind text match):

- `examples[0]`: `"6 ft (cockpit): ~2.9 nm (~5.4 km)"` → `"6 ft (cockpit): ~2.9 nm (~5.3 km)"`
- `faq[0].answer`: `"...roughly 2.9 nautical miles (5.4 km) away..."` → `"...roughly 2.9 nautical miles (5.3 km) away..."`

Re-ran the search after the edit: **zero remaining occurrences of "5.4 km" anywhere in the repository.** No unrelated "5.4 km" text existed elsewhere to accidentally disturb. Formula, coefficient, and `formulaDisplay` were not touched.

**Status: FIXED.**

---

## F-2 Correction

**Finding (Phase 8.5):** Eight calculators in `lib/aeo.ts`'s `SLUG_TO_ENTITIES` table were associated with a glossary entity describing an unrelated physical quantity.

**Decision table** (documented before editing, per instruction):

| Calculator | Current entity | Actual concept | Correct existing entity? | Action |
|---|---|---|---|---|
| `cross-track-error-calculator` | "great circle" | cross-track error | No — no "cross-track error" entity exists; concept isn't reused elsewhere | **REMOVE mapping** |
| `boat-fuel-consumption-calculator` | "nautical mile" | fuel consumption/burn rate | No — no fitting entity exists; this puts it in the same (already-normal) unmapped category as the site's other simple unit-converter calculators (bar-psi, liters-gallons, pounds-kg, etc.) | **REMOVE mapping** |
| `anchor-shackle-rode-calculator` | "anchor scope" | anchor rode length expressed in shackles (defined via 15 fathoms) | **Yes** — the "fathom" entity exists, is technically authoritative, and the calculator's own content defines shackle length in fathoms ("1 shackle = 15 fathoms = 90 feet"); the fathom entity's own definition even mentions "anchor rode" | **REMAP to `["fathom"]`** |
| `anchor-rode-shackles-calculator` | "anchor scope" | anchor rode length expressed as shackles | Same as above | **REMAP to `["fathom"]`** |
| `mercator-scale-factor-calculator` | "great circle" | Mercator projection scale factor | No — no "Mercator" entity exists; not reused elsewhere | **REMOVE mapping** |
| `wave-length-from-period-calculator` | "significant wave height" | wavelength | No — wavelength is a distinct physical quantity from wave height; no fitting entity exists | **REMOVE mapping** |
| `sail-area-displacement-calculator` | "hull speed" | SA/D ratio | No — unrelated naval-architecture ratio; no fitting entity exists | **REMOVE mapping** |
| `capsize-screening-calculator` | "hull speed" | capsize screening factor | No — unrelated ratio; no fitting entity exists | **REMOVE mapping** |

**No new entity was created.** Per the explicit instruction ("Do not invent glossary entities merely to fill slots" / "CORRECT ENTITY > NO ENTITY > INCORRECT ENTITY"), six of the eight mismatches were resolved by removing the mapping entirely (these calculators now behave like the many other simple calculators in the system that already have no `SLUG_TO_ENTITIES` entry — `getEntitiesForCalculator()` gracefully returns `[]` for unmapped slugs, confirmed by source read of `lib/aeo.ts`, unchanged logic). Two were resolved by pointing to a genuinely-fitting, already-existing entity ("fathom").

**Secondary reference search (Section 8):** searched the full repository for all eight calculator slugs. Found additional occurrences in `data/calculatorClusters.json`, `lib/freshness.ts`, `data/topicClusters.json`, `data/contentGraph.json`, `lib/priorityPages.ts`, and `components/CalculatorLayout.tsx` — all confirmed to be legitimate, unrelated uses (internal-link hrefs, freshness "recently updated" signal lists, content-cluster groupings, priority-page slug aliases), **not** duplicate entity-to-concept mappings. None were touched, per the instruction to leave legitimate unrelated textual uses alone. `lib/aeo.ts` was the only entity-mapping location.

**AEO content safety verification:** after the fix, `getEntitiesForCalculator()` was traced for all eight corrected calculators (via the built static output, see "Generated Output Verification" below) — no page now shows an unrelated glossary definition; `anchor-shackle-rode-calculator`/`anchor-rode-shackles-calculator` now correctly show the fathom definition; the other six show no entity block at all, which is normal and matches the many already-unmapped calculators elsewhere in the site. No AEO rendering logic, KeyTakeaways generation, or entity-lookup architecture was modified — only the data table.

**Status: FIXED.**

---

## Phase 8.1 Correction Preservation

Directly re-inspected all three, confirmed byte-identical to their Phase 8.1-corrected state, **not modified in this phase**:

```ts
// lib/formulaParser.ts
function radar_horizon_nm(h_m: number): number {
  const h_ft = Math.max(0, h_m) / 0.3048;
  return 1.23 * Math.sqrt(h_ft);
}
```
```
// data/calculators.json
"formula": "0.024 * pow(windSpeed * 0.514444, 2)"   (waveHeight_m)
"formula": "0.024 * pow(windSpeed * 0.514444, 2) * 3.28084"   (waveHeight_ft)
```
```
// data/calculators-phase5.json
"formula": "mod360(mag + var)"
// lib/formulaParser.ts
mod360: (deg) => ((deg % 360) + 360) % 360,
```

All three confirmed present and unmodified before any F-1/F-2 edit was made, and reconfirmed after.

---

## Tests

Targeted regression checks (independently computed, not just re-running the existing suite):

| Check | Expected | Actual |
|---|---:|---:|
| Distance-to-horizon, 6 ft | ~5.3 km | 5.3077 km ✓ |
| Radar horizon, 12 m | ~7.7 nm | 7.72 nm ✓ |
| Wave height, 10/20/30 kn | 0.64/2.54/5.72 m | 0.64/2.54/5.72 m ✓ |
| Heading, 350°+20° | 10° | 10° ✓ |
| Heading, 5°−20° | 345° | 345° ✓ |

Full suite:

| Command | Result |
|---|---|
| `npm test` | **PASS** — 130 passed, 0 failed (unchanged from baseline — confirms no formula was altered, only content/data-mapping) |
| `npx tsc --noEmit` | **PASS** — clean |
| `npm run lint` | **PASS** — "No ESLint warnings or errors" |

No test was altered to force a pass.

---

## Build

```
rm -rf out .next
npm run build
```

Result: compiled successfully, **308/308 static pages**, **45/45 calculator routes** — matches the expected baseline exactly.

---

## Generated Output Verification

Directly inspected the generated static HTML (not source alone):

| Check | Result |
|---|---|
| `out/tools/radar-horizon-calculator/index.html` contains `"h / 0.3048"` and `"~7.7 nm"` | ✓ present |
| `out/tools/wave-height-calculator/index.html` contains `"U is wind speed in m/s"` and `"0.64 m significant wave height"` | ✓ present |
| `out/tools/great-circle-distance-calculator/index.html` contains `"3,007.7 nm"` | ✓ present |
| `out/tools/distance-to-horizon-calculator/index.html` contains `"5.3 km"` | ✓ present |
| `out/tools/distance-to-horizon-calculator/index.html` contains `"5.4 km"` | ✓ **absent** (correctly removed) |
| `out/tools/anchor-shackle-rode-calculator/index.html` contains the fathom entity definition ("traditionally used for depth soundings and anchor rode") | ✓ present |
| `out/tools/anchor-shackle-rode-calculator/index.html` contains the old anchor-scope entity definition ("ratio of deployed rode length to vertical depth") | ✓ **absent** (correctly removed) |
| `out/tools/cross-track-error-calculator/index.html` contains the great-circle entity definition ("shortest path between two points on a sphere") | ✓ **absent** (correctly removed) |
| `out/tools/wave-length-from-period-calculator/index.html` contains the significant-wave-height entity definition ("average height of the highest one-third") | ✓ **absent** (correctly removed) |

All checks passed on the first build; no rebuild was required.

---

## AdSense / ads.txt Verification

```
out/ads.txt:
google.com, pub-3974004697476579, DIRECT, f08c47fec0942fa0
```

Matches exactly. Not modified in this phase.

---

## Files Changed

Beyond the already-accumulated Phase 8.1–8.4 changes (preserved, listed in prior phase reports):

| File | Change |
|---|---|
| `data/calculators.json` | F-1: two "5.4 km" → "5.3 km" corrections |
| `lib/aeo.ts` | F-2: 8 entity-mapping corrections (2 remapped to "fathom", 6 removed) |
| `docs/audits/phase-8.6-remediation-release.md` | New — this document |

No SEO, AEO architecture, AdSense, UI, sitemap, dead-code, or calculator-formula file was touched.

---

## Git Commit

Reviewed `git diff` in full before staging — confirmed it contains only: F-1, F-2, the already-audited Phase 8.1–8.4 accumulated corrections (`lib/formulaParser.ts`, `data/calculators-phase5.json`, `components/CalculatorRenderer.tsx`, `components/calculators/BeaufortScale.tsx` deletion, `components/calculator-engine/CalculatorEngine.tsx`, `components/calculator-engine/InputField.tsx`, `data/entities.json`, `data/measurements.json`, `package.json`), the regression test script (`scripts/test-formula-engine.ts`), and the full `docs/audits/` phase history. Nothing unrelated included.

[Commit SHA and confirmation recorded below, in the Final Response section, after the commit is created.]

---

## Production Deployment

Per explicit confirmation: Cloudflare Pages is connected to this GitHub repository and auto-deploys on push to `origin/main`. No `wrangler` CLI invocation was available or required from this environment (wrangler is unauthenticated here, and no Pages project reference exists in the repo — consistent with a dashboard-managed, Git-integration-based deployment rather than a CLI-driven one).

Deployment is triggered by the push recorded below; production verification follows.

---

## Production Verification

[Recorded after the push, once Cloudflare's build has had time to complete — see Final Response section.]

---

## Final Release Status

[Recorded after production verification — see Final Response section.]
