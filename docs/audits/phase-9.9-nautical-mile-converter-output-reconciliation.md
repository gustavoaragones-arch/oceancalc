# Phase 9.9 — Nautical Mile Converter Output Reconciliation

**Date:** 2026-08-27
**Basis:** `docs/audits/phase-9.0-ux-information-hierarchy-audit.md`, `phase-9.0-ux-information-hierarchy-matrix.md`, `docs/audits/stage-9-final-ux-certification.md`, `docs/audits/phase-9.8-model-disclosure-completion.md` — all read in full before this phase began. Repository HEAD at start: `fc0e5fc41f738dbc0dddb8f8c90fc6f537e2e80c` (confirmed via `git rev-parse HEAD`, matching origin/main). Pre-existing working tree confirmed intact: `components/CalculatorLayout.tsx` (Phase 9.8's modification, untracked-but-present), `docs/audits/phase-9.8-model-disclosure-completion.md`, `docs/audits/stage-9-final-ux-certification.md` — none discarded or modified by this phase.

## Status

# PHASE 9.9 — NOT CERTIFIED

---

## M-9 Finding

Original Phase 9.0 finding, quoted accurately: *"`nautical-mile-converter` is the one calculator with both a `simpleRegistry` and an `engine` config. `CalculatorRenderer.tsx`'s branch order checks `simpleRegistry` first, so the live widget renders via `CalculatorShell` and shows exactly **one** output (nm→km). The page's own 'Formula' section and `formulaDisplay` text ('1 NM = 1.852 km = 1852 m ≈ 1.15078 miles') describe three conversions (km, miles, m); a user reading that text and then looking at the widget sees only one of the three values the text describes. The `engine` config's mi/m outputs are defined in data but never rendered — dead configuration."*

---

## Pre-Fix Rendering Trace

Independently re-traced from route to formula, per Workstream A, before any edit:

1. **Route:** `/tools/nautical-mile-converter/` → `app/tools/[slug]/page.tsx` → `CalculatorToolPage` (`components/CalculatorToolPage.tsx`) → `getCalculatorBySlug("nautical-mile-converter")` (`lib/contentLoader.ts`).
2. **Data source:** the record exists **only** in `data/calculators.json` (not in `data/calculators-phase5.json`), and contains **both** a `simpleRegistry` block and a complete `engine` block simultaneously.
3. **Renderer:** `CalculatorToolPage` renders `<CalculatorRenderer calculator={calculator} />` (`components/CalculatorRenderer.tsx`).
4. **Precedence:** `CalculatorRenderer.tsx` lines 17–19: `if (calculator.simpleRegistry) return <CalculatorShell calculator={calculator} />;` — checked **before** the `engine` branch (lines 21–28). Since `nautical-mile-converter` has both, `simpleRegistry` wins.
5. **`simpleRegistry` (active today):** 1 input ("Nautical Miles," unit `nmi`), formula key `nauticalMilesToKm` → `lib/calculators/nautical.ts`'s `nauticalMilesToKm(inputs) = inputs.value * 1.852`, 1 output ("Kilometers," 4 decimals).
6. **`engine` (currently dead/unreachable):** 1 input ("Distance," default unit `nautical_miles`, selectable among nautical_miles/kilometers/miles/meters/feet), 3 outputs: `kilometers` (`distance * 1.852`, 4 decimals), `miles` (`distance * 1.15078`, 4 decimals), `meters` (`distance * 1852`, **0 decimals**). `formulaDisplay`: "1 NM = 1.852 km = 1852 m ≈ 1.15078 miles."
7. **Content configuration says:** `formula` field: "1 nautical mile = 1,852 m = 1.852 km. 1 nm ≈ 1.15078 statute miles ≈ 6,076 feet." `engine.formulaDisplay` (rendered in the page's "Formula" section per `generated.formulaLine`/`calculator.formula` in `CalculatorLayout.tsx`): "1 NM = 1.852 km = 1852 m ≈ 1.15078 miles" — **exactly 3 conversions: km, m, miles.**
8. **Numerical formulas per conversion:** `kilometers = distance × 1.852`, `miles = distance × 1.15078`, `meters = distance × 1852` — all three independently confirmed correct against the authoritative "1 nautical mile = 1,852 meters" convention (1852 m exactly; 1.852 km exactly; 1.15078 statute miles is the standard rounded nm→statute-mile constant, consistent with the site's own `formula`/`formulaDetail`/`examples` text elsewhere).
9. **Already represented elsewhere:** yes — the `engine.outputs` array already contains exactly the 3 declared conversions (kilometers, miles, meters), matching `engine.formulaDisplay` word-for-word.
10. **Would enabling the engine expose all three correctly without changing formulas?** — **No.** Rendered-browser testing (see Root Cause below) demonstrated that enabling the engine path exposes a **pre-existing, previously-latent display bug** in the shared `OutputField.tsx` component that corrupts the "Meters" output (the only 0-decimal output among the three) whenever its computed value ends in one or more zero digits — which is common, since `meters = distance × 1852` ends in zero for any input that is a multiple of 10, 100, 1000, or any value producing a multiple-of-10 result after rounding.

---

## Root Cause

The declared 3 conversions and the actual 1-output widget diverge because of the `simpleRegistry`-before-`engine` precedence in `CalculatorRenderer.tsx` (confirmed, matches Phase 9.0's diagnosis exactly). The **preferred fix** — removing the conflicting `simpleRegistry` block from `nautical-mile-converter`'s data record so the already-correct `engine` config becomes authoritative — was implemented and tested (see Attempted Remediation below). That testing revealed the engine path is **not actually safe to activate as-is**: a second, independent, previously-undiscovered defect exists in `components/calculator-engine/OutputField.tsx`'s `formatValue()` function:

```js
const rounded = Math.round(value * Math.pow(10, dec)) / Math.pow(10, dec);
return rounded.toFixed(dec).replace(/\.?0+$/, "");
```

For any output with `decimals: 0` (as `meters` has here), `toFixed(0)` produces a plain integer string with **no decimal point**. The trailing-zero-stripping regex `/\.?0+$/` (intended to trim trailing fractional zeros, e.g. "20.00" → "20") has an optional leading `\.?` that matches zero characters when no decimal point is present — so it proceeds to strip trailing zero **digits directly from the integer itself**. Confirmed via live browser interaction on the (since-reverted) engine-enabled build:

| Input (nm) | Correct meters value | Displayed value (bug) |
|---:|---:|---:|
| 1 | 1852 | 1852 (correct by coincidence — no trailing zero to strip) |
| 10 | 18520 | **1852** (last zero stripped) |
| 100 | 185200 | **1852** (both trailing zeros stripped) |
| 2.5 | 4630 | **463** (trailing zero stripped) |

This is not a formula error (`distance * 1852` is mathematically correct and unchanged) and not a `formulaParser.ts` error — it is a display-formatting defect in a **shared** component (`OutputField.tsx`), used by every `engine`-type calculator on the site, not specific to `nautical-mile-converter`.

**Critically, this bug is not hypothetical or specific to this reconciliation attempt.** A repository-wide scan for every `engine` output with `decimals: 0` found **5 other calculators that are already live and reachable today** (not shadowed by any `simpleRegistry`), each carrying the identical latent risk:

| Slug | Affected output | Formula |
|---|---|---|
| `anchor-scope-calculator` | `rode_ft` | `depth * scopeRatio` |
| `beaufort-scale-calculator` | `force` | `beaufort(windSpeed)` |
| `apparent-wind-calculator` | `apparentAngle` | `apparentWindAngleDeg(...)` |
| `wind-chill-calculator` | `windChill` | `windChillF(...)` |
| `anchor-shackle-rode-calculator` | `ft` | `shackles * 90` |

Any of these will silently display a truncated/wrong value whenever its rounded result happens to end in one or more zero digits (e.g., `anchor-shackle-rode-calculator`'s `shackles * 90` produces a multiple of 90, which is a multiple of 10 for even `shackles` counts — e.g. 2 shackles → 180 ft, which this bug would truncate to display "18").

---

## Attempted Remediation (implemented, tested, then reverted)

**Change made and tested:** removed the `simpleRegistry` block from `nautical-mile-converter`'s entry in `data/calculators.json` (19 lines), leaving `engine` as the sole config — the exact "preferred implementation" specified for this phase. `CalculatorRenderer.tsx`'s global precedence logic was **not** touched; the engine branch was reached purely because the conflicting `simpleRegistry` key no longer existed for this one calculator.

**Result of testing this change:** `npm test` (130/130), `tsc`, and `lint` all passed (the regression suite does not exercise `OutputField.tsx`'s rendering logic, only `formulaParser.ts` string-formula evaluation, so it could not have caught this defect). A full production build succeeded (308/308 pages, 45/45 routes). Rendered-browser testing via Playwright (Chrome, 1440×900 and 390×844) confirmed the calculator now correctly exposed all three output labels (Kilometers, Miles, Meters) and correctly recomputed Kilometers and Miles on every input change — but **incorrectly** displayed a truncated Meters value for every non-trivial input, as documented above.

**Action taken:** the `data/calculators.json` change was **reverted** (`git checkout -- data/calculators.json`) rather than shipped, because shipping it would replace one defect (a missing conversion) with a different, arguably worse defect (an actively wrong displayed number). This satisfies the phase's explicit instruction: *"If the existing engine configuration is incomplete or incorrect, STOP before inventing a new architecture. First report exactly what is missing."* The engine configuration's **numerical formulas** are correct and complete; what is missing/incorrect is the **shared display-formatting logic** that renders one of its three outputs, which is outside this phase's single-calculator scope and outside the set of files this phase was authorized to modify (`OutputField.tsx` was not on the read/inspect list, and fixing it would affect 5 other already-live calculators — exactly the "another calculator would be affected" condition that triggers a mandatory STOP).

**Post-revert verification:** `npm test` (130/130), `tsc --noEmit` (clean), `lint` (clean), and a fresh build (308/308 pages, 45/45 routes) all re-confirmed after reverting; the built `/tools/nautical-mile-converter/` page confirmed unchanged from the Phase 9.8 baseline (single "Nautical Miles" input/output, via `simpleRegistry`, exactly as before this phase began).

---

## Numerical Verification

Performed during the attempted-remediation testing phase (before revert), using the live rendered widget:

| Input (nm) | Conversion | Expected | Actual (Kilometers/Miles) | Actual (Meters) | Difference |
|---:|---|---:|---:|---:|---|
| 1 | Kilometers | 1.852 | 1.852 | — | 0 |
| 1 | Miles | 1.15078 | 1.1508 (rounded to 4 dp) | — | 0 |
| 1 | Meters | 1852 | — | 1852 | 0 (correct by coincidence) |
| 10 | Kilometers | 18.52 | 18.52 | — | 0 |
| 10 | Miles | 11.5078 | 11.5078 | — | 0 |
| 10 | Meters | 18520 | — | **1852** | **−16,668 (WRONG)** |
| 100 | Kilometers | 185.2 | 185.2 | — | 0 |
| 100 | Miles | 115.078 | 115.078 | — | 0 |
| 100 | Meters | 185200 | — | **1852** | **−183,348 (WRONG)** |
| 2.5 | Kilometers | 4.63 | 4.63 | — | 0 |
| 2.5 | Miles | 2.877 (rounded) | 2.877 | — | 0 |
| 2.5 | Meters | 4630 | — | **463** | **−4,167 (WRONG)** |

Kilometers and Miles are numerically correct at every tested input (1, 10, 100, and the fractional 2.5). Meters is wrong at every input except the coincidental case (nm = 1) where the result contains no trailing zero. This table is the direct evidence for the NOT CERTIFIED decision below — this phase does not certify a change that would ship a wrong number.

---

## Browser Verification

- **Browser:** Playwright 1.62.1 driving the system-installed Google Chrome (`channel: 'chrome'`) — same tool/method as Phases 9.6–9.8.
- **Viewports:** 1440×900, 390×844.
- **Route:** `/tools/nautical-mile-converter/` (local production build, served locally).
- **Interaction:** typed 1 (default), 10, 100, 2.5 into the Distance input; read all three output values after each change.
- **Overflow:** none — `scrollWidth === clientWidth` at both viewports, before and after interaction, before and after the revert.
- **Accessibility (engine-enabled build, before revert):** axe-core (`wcag2a`/`wcag2aa`) — 0 violations at both viewports.
- **Result:** confirmed the numerical defect above is real, reproducible, and consistent across both viewports (not a viewport-specific rendering issue).

---

## Content Consistency

**Not evaluated as "fixed," because the underlying rendering-path change was reverted.** In the current (unchanged) state, the pre-existing Phase 9.0 inconsistency remains exactly as documented: the page's `formula`/`formulaDisplay` text describes 3 conversions; the live widget (via `simpleRegistry`) shows only 1 (Kilometers). No copy was rewritten in this phase — per instruction, if copy needed to change, this phase was required to STOP and report rather than rewrite it; that scenario did not need to be reached, because the blocking issue was a rendering-path defect, not a copy mismatch.

---

## Negative Controls

Verified via `git diff --stat` and `git status --short` (not via rendered testing, since the change was reverted before any other calculator could be affected): `statute-nautical-mile-converter`, `knots-speed-converter`, `celsius-fahrenheit-converter`, `knots-to-kmh` (no `fathom-meter-converter` slug exists in the repository — `fathom-converter` is the closest match and was likewise unaffected), and `great-circle-distance-calculator` (representative unrelated navigation calculator) — none of these records were touched by the attempted change or its revert. `git diff --stat` confirms the complete diff is limited to `components/CalculatorLayout.tsx` (Phase 9.8, pre-existing, unrelated to this phase) with zero changes to `data/calculators.json` or any other calculator-affecting file.

---

## Accessibility

Axe-core (`wcag2a`/`wcag2aa`) was run against the engine-enabled build (before revert) on `/tools/nautical-mile-converter/` at 1440×900 and 390×844: **0 violations at both viewports.** The accessibility dimension of the attempted fix was clean — the blocking issue was purely the numerical-display defect, not accessibility. The known privacy-page finding was not scanned or touched, per instruction, remaining explicitly out of scope.

---

## Phase 8 Protection

`lib/formulaParser.ts` — **not modified.** `data/calculators.json` was modified and then fully reverted (`git diff --stat -- data/calculators.json` shows no changes at the end of this phase). `data/calculators-phase5.json` — not modified. `npm test` — 130/130, unchanged before, during, and after this phase's work. No new permanent test was added (none was needed, since the defect found is a rendering/formatting issue outside `formulaParser.ts`'s scope, not a formula-correctness issue the existing suite is designed to catch).

## Phase 9.1–9.8 Protection

Confirmed via `git status --short`/`git diff --stat` at the end of this phase: the working tree contains exactly the same state it had at the start — `components/CalculatorLayout.tsx` (Phase 9.8's modification, intact, unmodified by this phase) plus the two untracked prior audit documents (`phase-9.8-model-disclosure-completion.md`, `stage-9-final-ux-certification.md`), neither deleted nor altered. All of 9.1 (C-1/H-1/H-3), 9.2 (global nav cleanup, `/tools/`, Footer link), 9.3 (Navigation cross-links), 9.4 (Great Circle disclosure), 9.5 (4 cluster pages, 14/4/5/10 membership), 9.6 (Header fix), 9.7 (Footer accessibility fix), and 9.8 (4 model disclosures, Great Circle disclosure unchanged) remain exactly as those phases left them — none were in this phase's diff at any point.

## AdSense Protection

`lib/ads.ts`, `app/layout.tsx`, `components/ads/AdPlaceholder.tsx` — confirmed unmodified throughout. This phase never touched advertising-related files.

---

## Tests

| Command | Result |
|---|---|
| `npm test` | **PASS** — 130/130 (unchanged throughout: before attempted fix, during, and after revert) |
| `npx tsc --noEmit` | **PASS** — clean |
| `npm run lint` | **PASS** — "No ESLint warnings or errors" |

## Build

| Metric | Result |
|---|---|
| `npm run build` (from-scratch) | **PASS** — compiled successfully |
| Static pages generated | **308/308** |
| Calculator routes generated | **45/45** |

Both the attempted-fix state and the final (reverted) state built successfully with identical page/route counts.

---

## Files Changed

**At the end of this phase, relative to the Phase 9.8 baseline: none.** `data/calculators.json` was edited and then reverted to its exact pre-phase content (`git diff --stat -- data/calculators.json` — empty). The only files present in the working tree are the pre-existing Phase 9.8 artifacts (`components/CalculatorLayout.tsx`, and the two untracked audit documents), none of which this phase modified.

This phase's only lasting output is this new documentation file: `docs/audits/phase-9.9-nautical-mile-converter-output-reconciliation.md`.

---

## Remaining Stage 9 Findings

- **M-9 remains OPEN, unresolved.** The rendering-path fix that would resolve it was implemented and tested, but revealed a blocking, higher-severity, shared-infrastructure defect (`OutputField.tsx`'s zero-decimals formatting bug) that must be fixed **first**, in its own separately-scoped phase, before `nautical-mile-converter`'s `simpleRegistry` can be safely removed.
- **New finding, discovered this phase — recommend adding to the register:** `OutputField.tsx`'s `formatValue()` incorrectly strips trailing zero digits from any `decimals: 0` output whose rounded value ends in one or more zeros (root cause: `.replace(/\.?0+$/, "")` applied to a `toFixed(0)` string that has no decimal point). This is **not** limited to `nautical-mile-converter` — it currently affects 5 already-live calculators (`anchor-scope-calculator`, `beaufort-scale-calculator`, `apparent-wind-calculator`, `wind-chill-calculator`, `anchor-shackle-rode-calculator`), any of which will silently display a wrong value whenever its result happens to end in a zero digit. This was not fixed in this phase (out of scope, shared file, would affect unrelated calculators — a mandatory STOP condition), but is flagged here as a real, currently-live numerical-display defect that should be prioritized ahead of, or alongside, a future M-9 remediation attempt.
- **Privacy-page inline links (`app/privacy/page.tsx`)** — confirmed still open, not addressed, not claimed as resolved. Remains out of scope for this phase, as instructed.
- **Stage 9 overall remains NOT CERTIFIED** — this phase does not change that determination; if anything, it adds one new, real, currently-live defect to the register that a future Stage 9 re-audit must reconcile.

---

## Certification Decision

# PHASE 9.9 — NOT CERTIFIED

The preferred, minimal, single-calculator remediation was correctly identified, implemented, and rigorously tested — exactly as this phase's instructions required. That testing is what surfaced the blocking issue: activating the existing `engine` configuration does not safely resolve M-9, because a distinct, previously-latent, shared-component display bug in `OutputField.tsx` would ship an actively wrong "Meters" value to users (verified numerically at 3 non-trivial inputs). Per the phase's explicit STOP conditions ("an unrelated calculator would be affected," "the implementation requires modifying CalculatorEngine [architecture]"), this phase halted, reverted the exploratory change, and reports the finding rather than improvising a fix to shared infrastructure or inventing new copy to route around the defect. `data/calculators.json` is unchanged from the Phase 9.8 baseline; M-9 remains open. A new, separately-scoped phase to fix `OutputField.tsx`'s zero-decimals formatting defect (affecting 5 already-live calculators, independent of M-9) is recommended before any future attempt to complete this reconciliation.
