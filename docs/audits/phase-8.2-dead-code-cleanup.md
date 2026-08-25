# Phase 8.2 — Dead-Code & Formula-Landmine Cleanup

**Date:** 2026-08-24
**Starting commit:** `3c98f268bb1993801fb849f907ed4f9f6e4dc10e` (working tree already carried the Phase 8.1 fixes, confirmed unmodified by this phase — see Git Discipline below)
**Basis:** `docs/audits/phase-8.0-maritime-accuracy-audit.md`, `docs/audits/phase-8.0-calculator-verification-matrix.md`, `docs/audits/phase-8.0-maritime-standards-register.md`, `docs/audits/phase-8.1-safety-calculation-corrections.md`, `docs/audits/phase-8.1-reaudit.md` — all read in full before any change, none modified by this phase.

## Status

# PASS

---

## Beaufort Component

**Reachability was not assumed — it was re-proven from scratch in this phase**, independent of the Phase 8.0/8.1 documents:

1. Repository-wide search for every reference to `BeaufortScale` (any import path, string-based dynamic import, or `require()`) across all `.ts`/`.tsx`/`.js`/`.jsx`/`.json`/`.mjs` files outside `node_modules`/`.next`/`out`: exactly one importer found — `components/CalculatorRenderer.tsx`.
2. Every usage of `<CalculatorRenderer>`/`CalculatorRenderer` import across the repo: exactly one — `components/CalculatorToolPage.tsx`.
3. Every usage of `CalculatorToolPage` across the repo: exactly two Next.js route files — `app/tools/[slug]/page.tsx` and `app/tools/[slug]/[variant]/page.tsx` — both of which resolve their `CalculatorEntry` exclusively via `getCalculatorBySlug()` in `lib/contentLoader.ts`, which itself loads only from `data/calculators.json` and `data/calculators-phase5.json` (no other data source, no fixtures, no MDX, no storybook file exists in this repo).
4. Every calculator record across both JSON data files with `"type": "beaufort"` (the only type value that could route to the switch case that rendered the component): exactly one — `data/calculators.json:318`, slug `beaufort-scale-calculator`. That single record has an `engine` field (confirmed by direct read: `"has engine": true`), and `components/CalculatorRenderer.tsx`'s `if (calculator.engine) { return <CalculatorEngine .../> }` branch executes and returns **before** the `switch (calculator.type)` block is ever reached.
5. `app/tools/page.tsx` (the tools index/listing page) was checked separately since it also imports `CalculatorEntry` — confirmed it only renders link cards, never invokes `CalculatorRenderer`.

**Conclusion: definitively unreachable in production.** No code path, route, test file, or dynamic import can ever render this component as the repository stood at the start of this phase.

**Action taken: deleted.** `components/calculators/BeaufortScale.tsx` was removed rather than repaired, per the phase's stated preference for a single authoritative implementation. This is the correct outcome specifically because the component's own logic was independently re-confirmed defective (see Boundary Verification below reproduces the underlying bug class it had) — repairing an implementation that would still be a second, redundant copy of logic already correctly implemented in `lib/formulaParser.ts` would not remove the future-regression risk the phase is meant to eliminate; only removing the duplicate does.

**Coupled changes required to keep the build valid** (not scope creep — deleting a file that is still imported elsewhere would break compilation):
- `components/CalculatorRenderer.tsx`: removed the now-dangling `import { BeaufortScaleCalculator } from "./calculators/BeaufortScale";` and the `case "beaufort": return <BeaufortScaleCalculator />;` switch branch. No other line in this file was touched — the `if (calculator.engine)` short-circuit, the `unit-converter` branch, and the four other switch cases (`distance-horizon`, `great-circle`, `anchor-scope`, `apparent-wind`) are byte-identical to before this phase.
- `scripts/test-formula-engine.ts`: updated one comment that referenced the file by path (it would otherwise have described a file that no longer exists); no test logic was changed by this edit, only the comment text.

**Safety property gained by the deletion:** if a future change ever removed the `engine` field from `beaufort-scale-calculator`'s JSON record (an unrelated, hypothetical future edit — not something this phase touches), the calculator would now fall through to `CalculatorRenderer`'s `default` case and render a visible "Calculator type not configured" message, rather than silently reviving the deleted component's boundary-gap bug. The failure mode changed from *silent reintroduction of an incorrect result* to *loud, visible non-functionality* — strictly safer.

---

## Live Beaufort Path

**Authoritative implementation:** `lib/formulaParser.ts`, function `beaufort(kn: number)` — a cascading `if (kn <= X) return force; ...` chain, registered in `DEFAULT_CUSTOM_FUNCTIONS`, invoked by the JSON formula string `"beaufort(windSpeed)"` in `data/calculators.json`'s `beaufort-scale-calculator.engine.outputs[0].formula`, executed at runtime by `components/calculator-engine/CalculatorEngine.tsx` via `parseFormula()`.

This function was **not modified** in this phase, per the explicit instruction not to touch it absent proof it is itself defective — and no such proof exists; the boundary sweep below reconfirms it is correct.

There is now exactly one Beaufort calculation implementation in the entire repository.

---

## Boundary Verification

All 15 required test points, run against the live `lib/formulaParser.ts` `beaufort()` function:

| Wind speed (kn) | Beaufort force | Falls in accidental default/Force-12 fallback? |
|---:|---:|---|
| 0 | 0 | No |
| 0.5 | 0 | No |
| 1 | 0 | No |
| 3 | 1 | No |
| 3.5 | 2 | No |
| 4 | 2 | No |
| 6 | 2 | No |
| 6.5 | 3 | No |
| 7 | 3 | No |
| 11 | 4 | No |
| 11.5 | 4 | No |
| 12 | 4 | No |
| 63 | 11 | No |
| 63.5 | **12** | No — this is the *correct* Force 12 (wind >63 kn genuinely is Hurricane force), not a fallback artifact |
| 64 | 12 | No — correct |

Every decimal input maps to a continuous, correctly-ordered band with no gap. This was added as a permanent 15-case regression sweep in `scripts/test-formula-engine.ts` (`beaufortBoundarySweep`), so any future change to `beaufort()`'s band logic that reintroduces a gap will fail `npm test` immediately.

**Confirmed: the live formula parser remains the sole and authoritative Beaufort calculation path**, and it correctly handles every boundary case the phase requires, including the exact decimal values (3.5, 6.5, 11.5, 63.5 kn) that broke the now-deleted component.

---

## Duplicate Implementation Search

Repository-wide search performed for each calculation type listed in the phase brief, looking for any implementation outside `lib/formulaParser.ts`:

| Calculation | Duplicate found outside `lib/formulaParser.ts`? | Status |
|---|---|---|
| Beaufort | Yes — `components/calculators/BeaufortScale.tsx` | **Confirmed dead** → deleted this phase |
| Radar horizon | No | Confirmed live (single source: `lib/formulaParser.ts`) |
| Wave height | No | Confirmed live |
| True/magnetic heading | No | Confirmed live |
| Great-circle distance | Yes — `components/calculators/GreatCircleDistance.tsx` | **Confirmed dead** (same reachability pattern: `great-circle-distance-calculator` has an `engine` field) — **not deleted**, out of this phase's scope, reported only |
| Rhumb distance | No (only content/nav/AEO-entity text references to "rhumb" in `app/layout.tsx`, `app/page.tsx`, `components/CalculatorLayout.tsx`, `lib/aeo.ts`, `lib/freshness.ts` — checked individually, none contain calculation logic) | Confirmed live |
| Hull speed | No | Confirmed live |
| Wind chill | No | Confirmed live |
| Apparent wind | Yes — `components/calculators/ApparentWind.tsx` | **Confirmed dead** (same pattern: `apparent-wind-calculator` has an `engine` field) — **not deleted**, out of scope, reported only |
| VMG | No | Confirmed live |
| Cross-track error | No | Confirmed live |
| Speed over ground | No | Confirmed live |
| Mercator scale | No (only content/AEO-entity text references in `lib/aeo.ts`, `lib/freshness.ts`, checked and confirmed non-computational) | Confirmed live |
| Geographic range | No | Confirmed live |
| Wavelength | No | Confirmed live |

**Incidentally discovered while tracing `components/calculators/`** (not in the phase's explicit search list, but found while enumerating the directory that contained the Beaufort duplicate): `components/calculators/DistanceToHorizon.tsx` and `components/calculators/AnchorScope.tsx` are **also confirmed dead** by the identical reachability pattern (`distance-to-horizon-calculator` and `anchor-scope-calculator` both have `engine` fields). These, together with `GreatCircleDistance.tsx` and `ApparentWind.tsx` above, are the same five dead components Phase 8.0 originally catalogued as Finding D-1 — this phase independently re-derived the same conclusion for all five rather than assuming the prior finding.

**No uncertain cases.** Every duplicate found was traced to a definitive reachable/unreachable determination using the same static-trace method applied to Beaufort; none required guessing.

**Not deleted in this phase (explicitly out of scope per the phase brief's "Phase 8.2 is primarily the Beaufort dead-code cleanup" / "Do NOT refactor all of them"):** `GreatCircleDistance.tsx`, `AnchorScope.tsx`, `ApparentWind.tsx`, `DistanceToHorizon.tsx`. Each was individually checked for whether *its own logic* (independent of reachability) matches the live `lib/formulaParser.ts` implementation it duplicates, as a courtesy check, not a fix:
- `GreatCircleDistance.tsx`: identical haversine formula and Earth-radius constant (R=3440.065 nm) to the live `haversine_nm()` — no defect.
- `AnchorScope.tsx`: straightforward `depth × ratio` arithmetic, matches the live engine-driven version — no defect.
- `ApparentWind.tsx`: identical law-of-cosines formula to the live `apparentWindSpeedKn`/`apparentWindAngleDeg` — no defect.
- `DistanceToHorizon.tsx`: correctly converts meters to feet before applying the 1.17 coefficient (unlike the radar-horizon bug this program fixed in Phase 8.1) — no defect.

None of these four carry an active numerical bug the way the Beaufort component did; they are landmines only in the structural sense (dead, duplicate, could be reactivated by a future refactor), not in the sense of currently containing a wrong formula. This distinction is why Beaufort was the priority for this phase and the other four were correctly left for a future decision rather than being swept up automatically.

---

## Regression

Run independently in this phase, from a clean state (`rm -rf out .next` before the build):

| Command | Result |
|---|---|
| `npm test` | **PASS** — 128 passed, 0 failed (113 pre-existing + 15 new Beaufort boundary-sweep assertions) |
| `npx tsc --noEmit` | **PASS** — no output, no errors |
| `npm run lint` (`next lint`) | **PASS** — "No ESLint warnings or errors" |
| `npm run build` (`next build`, from-scratch) | **PASS** — compiled successfully, 308/308 static pages, 45/45 tool routes present in `out/tools/`, including `beaufort-scale-calculator` |

**Dangling-import check:** `tsc --noEmit` passing after the deletion is direct proof no remaining file references the removed module — TypeScript would fail to resolve the import otherwise. Additionally, the shipped production bundle (`out/_next/static/chunks/*.js`) was searched for any trace of the deleted component's distinctive strings ("Sea like a mirror", "Force 12", "BeaufortScaleCalculator") — none found, confirming clean removal from the actual shippable artifact, not merely from source. The live `beaufort-scale-calculator` page's generated HTML was separately confirmed to still embed the correct, unchanged formula string `"beaufort(windSpeed)"`, proving the calculator itself continues to render and compute via the sole remaining (live, correct) implementation.

---

## Scope

- **No Phase 8.3 content work performed.** The stale `wave-height-calculator` and `radar-horizon-calculator` `formulaDisplay`/`examples` strings identified in `docs/audits/phase-8.1-reaudit.md` remain untouched.
- **No Phase 8.4 work performed.** Cable/shackle convention disclosure not addressed.
- **No numerical redesign.** `lib/formulaParser.ts`'s `beaufort()` function, and every other custom function it exports, is byte-identical to its state at the end of Phase 8.1 — confirmed by `git diff` (see below), which shows only the `mod360`/`radar_horizon_nm` changes from Phase 8.1, still present and untouched by this phase.
- **No SEO/AEO changes.** `lib/aeo.ts`, `lib/seo.ts`, `lib/seoBuilder.ts`, `data/entities.json`, and all AEO slug-to-entity mappings are untouched.
- **No AdSense changes.** `components/ads/*`, `lib/ads.ts` untouched.
- The three Phase 8.1 corrections (radar horizon, wave height, true/magnetic heading) were **not modified** in this phase — confirmed by direct re-read of `lib/formulaParser.ts`'s `radar_horizon_nm`/`mod360` and `data/calculators.json`/`data/calculators-phase5.json`'s wave-height/heading formula strings, all identical to their Phase 8.1 post-fix state.

---

## Git Discipline

```
Before:
git status --short
 M data/calculators-phase5.json
 M data/calculators.json
 M lib/formulaParser.ts
 M package.json
?? docs/
?? scripts/test-formula-engine.ts

git rev-parse HEAD
3c98f268bb1993801fb849f907ed4f9f6e4dc10e
```

```
After:
git status --short
 M components/CalculatorRenderer.tsx
 D components/calculators/BeaufortScale.tsx
 M data/calculators-phase5.json
 M data/calculators.json
 M lib/formulaParser.ts
 M package.json
?? docs/
?? scripts/test-formula-engine.ts

git diff --stat
 components/CalculatorRenderer.tsx        |  3 --
 components/calculators/BeaufortScale.tsx | 85 --------------------------------
 data/calculators-phase5.json             |  2 +-
 data/calculators.json                    |  4 +-
 lib/formulaParser.ts                     | 11 ++++-
 package.json                             |  1 +
 6 files changed, 13 insertions(+), 93 deletions(-)
```

The Phase 8.1 changes (`data/calculators-phase5.json`, `data/calculators.json`, `lib/formulaParser.ts`, `package.json`) are still present, untouched, and identical to their post-Phase-8.1 state — only two new entries appear in this phase's diff: the deletion of `components/calculators/BeaufortScale.tsx` and the corresponding 4-line trim in `components/CalculatorRenderer.tsx`. Nothing was committed or pushed.
