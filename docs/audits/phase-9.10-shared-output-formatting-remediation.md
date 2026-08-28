# Phase 9.10 — Shared Output Formatting Audit & Remediation

**Date:** 2026-08-27
**Basis:** `docs/audits/phase-9.0-ux-information-hierarchy-audit.md`, `phase-9.0-ux-information-hierarchy-matrix.md`, `docs/audits/stage-9-final-ux-certification.md`, `docs/audits/phase-9.8-model-disclosure-completion.md`, `docs/audits/phase-9.9-nautical-mile-converter-output-reconciliation.md` — all read in full before this phase began. Repository HEAD at start: `fc0e5fc41f738dbc0dddb8f8c90fc6f537e2e80c` (confirmed via `git rev-parse HEAD`, matching origin/main). Pre-existing working tree confirmed intact and preserved: `components/CalculatorLayout.tsx` (Phase 9.8), plus the three untracked Phase 9.8/9.9/Stage-9 audit documents — none discarded or modified.

## Status

# PHASE 9.10 — PASS

---

## Discovery

Phase 9.9 attempted the preferred fix for M-9 (making `nautical-mile-converter`'s existing `engine` configuration authoritative by removing its conflicting `simpleRegistry` entry). That attempt was reverted after rendered-browser testing revealed the engine's "Meters" output (`decimals: 0`) displayed a wrong, truncated value for every input except the coincidental default (1 nm → 1852 m, correct only because 1852 has no trailing zero). A repository-wide scan performed during Phase 9.9 found 5 other, already-live calculators sharing the same `decimals: 0` risk, independent of M-9. This phase exists to audit and fix that shared defect — and explicitly not to touch `nautical-mile-converter`.

---

## Root Cause

Full source trace of `components/calculator-engine/OutputField.tsx`'s `formatValue()`, per Workstream A/C:

```js
const dec = config.decimals ?? 2;          // line 22
...
const rounded = Math.round(value * Math.pow(10, dec)) / Math.pow(10, dec);
return rounded.toFixed(dec).replace(/\.?0+$/, "");   // pre-fix line 30
```

Answering the required trace questions directly:

1. **What does `decimals` mean?** The number of fractional digits to round and display the output to.
2. **What happens when `decimals = 0`?** Line 22 uses `??` (nullish coalescing), which correctly preserves an explicit `0` — `dec` is correctly set to `0`, not silently defaulted to `2`. **The bug is not here.**
3. **Is `decimals = 0` treated as valid/falsy/omitted?** It is correctly treated as a valid, explicit `0` at the decimals-resolution step. The defect is downstream, in formatting.
4. **Is the bug caused by `||` vs `??`?** **No** — confirmed by direct inspection; line 22 already used `??`. The actual defect is the unconditional `.replace(/\.?0+$/, "")` call on the pre-fix line 30.
5. **Does the defect affect all zero-decimal outputs?** Yes — any `decimals: 0` output whose rounded value ends in one or more `0` digits. `toFixed(0)` produces a bare integer string with no decimal point, so the regex's optional `\.?` matches zero characters and the `0+` group strips trailing zero *digits* directly from the integer (e.g. "18520" → "1852", "450" → "45", and in the worst case "0" → "" — an empty string).
6. **Are `decimals > 0` outputs unaffected?** Confirmed unaffected — for `dec > 0`, `toFixed(dec)` always produces a literal `.` before the fractional digits, so the same regex correctly strips only genuine trailing fractional zeros (its original, intended purpose — e.g. "20.00" → "20", "180.50" → "180.5"). This is desired, pre-existing "clean number" formatting behavior and was preserved unchanged by this phase's fix.
7. **Are outputs without a `decimals` property affected?** No — `config.decimals ?? 2` gives them `dec = 2` (a `dec > 0` case), which is unaffected.
8. **Do `simpleRegistry` outputs use the same formatter?** **No.** `CalculatorShell.tsx` (the `simpleRegistry` renderer) uses a completely separate code path — `formatNumber()` from `lib/calculators/precision.ts` (`Number(value.toFixed(decimals))`, no string-stripping regex at all) combined with `toLocaleString()`. `simpleRegistry`-rendered calculators (`nautical-mile-converter`, `knots-to-kmh`, `sailing-time-calculator`) are **not** affected by this defect.
9. **Could non-numeric outputs be affected?** The `format: "hours"` branch (lines 23–27) returns early with its own string construction (`"${h} h ${m} min"`), never reaching the buggy regex line. Only the default numeric-formatting path is affected.

**Confirmed root cause:** the trailing-zero-stripping regex, correct and intentional for `decimals > 0`, was applied unconditionally, incorrectly corrupting whole-number output for `decimals = 0`.

**Repository-wide call-site check:** `grep -rn "<OutputField\|OutputField("` across the entire repository returns exactly one call site (`components/calculator-engine/CalculatorEngine.tsx` line 158) — `OutputField` has no other consumer, confirming the fix's blast radius is fully bounded to `engine`-type calculators' outputs.

---

## Complete Impact Analysis

Full repository-wide scan of every `engine.outputs` entry in both `data/calculators.json` and `data/calculators-phase5.json` for `decimals: 0` (all 45 calculators covered, not a sample):

| Slug | Affected output | Formula | Default inputs | Default computed value | Live/reachable? | Defect visible by default? |
|---|---|---|---|---|---|---|
| `nautical-mile-converter` | `meters` | `distance * 1852` | distance=1 | 1852 | **No — shadowed by `simpleRegistry`, not rendered** | N/A (dead code; M-9, out of scope) |
| `anchor-scope-calculator` | `rode_ft` | `depth * scopeRatio` | depth=10, scopeRatio=5 | 50 | **Yes, live** | **Yes — displayed "5" instead of "50" by default, pre-fix** |
| `beaufort-scale-calculator` | `force` | `beaufort(windSpeed)` | windSpeed=15 | 4 | Yes, live | No (4 has no trailing zero) — but affected for any input yielding force 0 or 10 |
| `apparent-wind-calculator` | `apparentAngle` | `apparentWindAngleDeg(...)` | boatSpeed=6, trueWindSpeed=10, trueWindAngle=90 | 59.04 → rounds to 59 | Yes, live | No by default — affected for any input combination rounding to a multiple of 10 |
| `wind-chill-calculator` | `windChill` | `windChillF(tempF, windMph)` | tempF=35, windMph=15 | 25.43 → rounds to 25 | Yes, live | No by default — affected for any input combination rounding to a multiple of 10 |
| `anchor-shackle-rode-calculator` | `ft` | `shackles * 90` | shackles=5 | 450 | **Yes, live** | **Yes — displayed "45" instead of "450" by default, pre-fix** |

No other calculator, among all 45, has an `engine.outputs` entry with `decimals: 0`. This is the complete, exhaustive affected-scope inventory — not limited to the 5 initially flagged by Phase 9.9 (all 5 were confirmed correct and complete; no additional calculator was found).

**Two calculators (`anchor-scope-calculator`, `anchor-shackle-rode-calculator`) were displaying an incorrect value to every visitor, with zero interaction required, before this fix** — the highest-severity instances of this defect.

---

## Pre-Fix Examples

| Input | Decimals | Expected | Actual (pre-fix) |
|---|---:|---:|---:|
| `anchor-scope-calculator` default (depth=10, scope=5) | 0 | 50 | 5 |
| `anchor-shackle-rode-calculator` default (shackles=5) | 0 | 450 | 45 |
| `nautical-mile-converter` engine output, 10 nm (during Phase 9.9's reverted test) | 0 | 18520 | 1852 |
| `nautical-mile-converter` engine output, 100 nm (during Phase 9.9's reverted test) | 0 | 185200 | 1852 |
| `nautical-mile-converter` engine output, 2.5 nm (during Phase 9.9's reverted test) | 0 | 4630 | 463 |

---

## Remediation

**Exact minimal change**, `components/calculator-engine/OutputField.tsx`:

```diff
-  const rounded = Math.round(value * Math.pow(10, dec)) / Math.pow(10, dec);
-  return rounded.toFixed(dec).replace(/\.?0+$/, "");
+  const rounded = Math.round(value * Math.pow(10, dec)) / Math.pow(10, dec);
+  const fixed = rounded.toFixed(dec);
+  return dec > 0 ? fixed.replace(/\.?0+$/, "") : fixed;
```

One conditional expression. For `dec > 0`, the exact same `.replace()` call runs, byte-for-byte identical to before — zero behavior change for any currently-live `decimals > 0` or omitted-decimals output. For `dec === 0`, the plain `toFixed(0)` integer string is returned as-is, with no stripping — the only case that changes, and only in the direction of correctness.

`formatValue` was also changed from an unexported to an **exported** function (`function formatValue` → `export function formatValue`) — a zero-behavior-change visibility edit, made solely so this fix could be covered by a permanent, real regression test (see Tests below) rather than only by manual/browser verification. No other change was made to `OutputField.tsx`.

No per-calculator workaround was added. No second formatter was created. No calculator data file was modified to compensate for this bug.

---

## Numerical / Formatting Verification

Verified in isolation (pure-function tests, both ad hoc and as permanent regression assertions — see Tests below) and confirmed via rendered-browser output:

| Case | Value | Decimals | Expected | Actual (post-fix) |
|---|---:|---:|---:|---:|
| decimals = 0 | 18520 | 0 | 18520 | **18520** |
| decimals = 0 | 1852 | 0 | 1852 | **1852** |
| decimals = 0 | 50 | 0 | 50 | **50** |
| decimals = 0 | 450 | 0 | 450 | **450** |
| decimals = 0, zero value | 0 | 0 | 0 (not empty string) | **0** |
| decimals = 0, edge case | 10 | 0 | 10 (not 1) | **10** |
| decimals = 1 | 5.7165 | 1 | 5.7 | **5.7** |
| decimals = 2 | 5.7165 | 2 | 5.72 | **5.72** |
| decimals = 2, whole number | 20 | 2 | 20 (clean, no ".00") | **20** |
| decimals = 2, single trailing zero | 180.50 | 2 | 180.5 | **180.5** |
| decimals omitted | 1.852 | (defaults to 2) | 1.85 | **1.85** |

All cases match exactly. The omitted-decimals default (2dp rounding, with clean-whole-number stripping) is the pre-existing, unchanged project behavior — not a newly invented default.

---

## Affected Calculator Verification

Rendered via Playwright against the local production build, both required viewports (1440×900, 390×844) — identical results at both:

| Calculator | Output | Input | Expected | Actual | Status |
|---|---|---|---:|---:|---|
| `anchor-scope-calculator` | Rode length (ft) — decimals=0 | depth=10, scope=5 (default) | 50 | **50** | Fixed |
| `anchor-scope-calculator` | Rode length (m) — decimals=2 | depth=10, scope=5 (default) | 15.2 | 15.2 | Unaffected (was already correct) |
| `beaufort-scale-calculator` | Beaufort force — decimals=0 | windSpeed=15 (default) | 4 | 4 | Correct (unaffected by default, protected for edge inputs) |
| `apparent-wind-calculator` | Apparent wind angle — decimals=0 | boatSpeed=6, trueWindSpeed=10, trueWindAngle=90 (default) | 59 | 59 | Correct |
| `apparent-wind-calculator` | Apparent wind speed — decimals>0 | same | 11.7 | 11.7 | Unaffected |
| `wind-chill-calculator` | Feels like (°F) — decimals=0 | tempF=35, windMph=15 (default) | 25 | 25 | Correct |
| `anchor-shackle-rode-calculator` | Rode (ft) — decimals=0 | shackles=5 (default) | 450 | **450** | Fixed |

All 5 initially-flagged calculators independently re-rendered and numerically verified correct, at both required viewports.

---

## Negative Controls

Rendered at both viewports, zero horizontal overflow, unaffected by this change (representative across navigation, distance, wind/wave-adjacent, and conversion categories):

`great-circle-distance-calculator`, `wave-height-calculator`, `radar-horizon-calculator`, `initial-bearing-calculator`, `mercator-scale-factor-calculator`, `rhumb-distance-calculator`, `cross-track-error-calculator` — all 7 confirmed `overflow: false` at both 1440×900 and 390×844 (14/14 checks clean). None of these use `decimals: 0` outputs, so none were expected to change, and none did.

---

## Nautical Mile Converter Protection

**Explicitly confirmed:** `data/calculators.json`'s `nautical-mile-converter` entry is byte-identical to the Phase 9.8 baseline — `git diff --stat -- data/calculators.json` shows **no changes**. `simpleRegistry` remains present (repository-wide count of `"simpleRegistry"` occurrences: 3, matching the pre-existing total for `nautical-mile-converter`, `knots-to-kmh`, `sailing-time-calculator` — unchanged). Rendered verification at both viewports confirms the original one-output UI is unchanged: input "Nautical Miles" → single output "Kilometers" = 1.8520 km (default), identical to every prior phase's observation. **M-9 remains fully open**, exactly as required.

---

## Browser Verification

- **Browser:** Playwright 1.62.1 driving the system-installed Google Chrome (`channel: 'chrome'`).
- **Target:** current local production build (`out/`, fresh `rm -rf out .next && npm run build`), served locally.
- **Viewports:** 1440×900, 390×844.
- **Routes tested:** 5 affected calculators + 8 negative-control/representative calculators + `nautical-mile-converter` + homepage = 15 distinct routes, each at both viewports (30 combinations).
- **Result:** all outputs correct, all labels and units unchanged, zero horizontal overflow, zero layout regression, at every combination tested.

---

## Accessibility

Axe-core (`wcag2a`/`wcag2aa`), 3 routes × 2 viewports (6 scans): `anchor-scope-calculator`, `nautical-mile-converter`, homepage. **0 violations on every route, at both viewports.** The known privacy-page `link-in-text-block` finding was not scanned or touched, per instruction, remaining explicitly out of scope.

---

## Responsive

Zero horizontal overflow across all 15 tested routes × 2 viewports (30 combinations) — affected calculators, negative controls, and `nautical-mile-converter` alike. No layout break, no unexpected wrapping, observed anywhere.

---

## Phase 8 Protection

`lib/formulaParser.ts` — not modified (`git diff --stat`, no output). `data/calculators.json`, `data/calculators-phase5.json` — not modified. All Phase 8-certified numerical outputs independently re-verified byte-identical via `npm test`: radar horizon (`nm = 7.717706403199351`), wave height (`waveHeight_m = 2.5406652397056004`), true/magnetic heading (`true = 280`), Beaufort (full 18-point boundary sweep, all passing), great circle (`distance_nm = 3007.6795421033207`), wind chill (`windChill = 25.43151479664407`), apparent wind (`apparentSpeed = 11.661903789690601`, `apparentAngle = 59.036243467926475`) — all unchanged. This fix touches only how a number already computed by `formulaParser.ts` is *displayed*; it never touches the computation itself.

## Phase 9.1–9.9 Protection

`git diff --stat` confirms the complete diff is exactly 3 files: `components/CalculatorLayout.tsx` (Phase 9.8, pre-existing, unmodified by this phase), `components/calculator-engine/OutputField.tsx` (this phase's fix), `scripts/test-formula-engine.ts` (this phase's new tests). Explicitly re-verified via targeted `git diff --stat` that none of the following changed: `app/page.tsx` (9.1), `components/affiliate/` (9.1, remains deleted), `app/layout.tsx` (9.2), `components/Footer.tsx` (9.2/9.7), `app/navigation/page.tsx`/`app/navigation-calculations/page.tsx` (9.3), the 4 cluster pages + `ClusterCalculatorList.tsx` (9.5), `components/ads/AdPlaceholder.tsx` (pre-9.6), `components/Header.tsx` (9.6), `components/CalculatorRenderer.tsx` (untouched — global precedence logic unchanged), `data/calculators.json`'s `nautical-mile-converter` record (Phase 9.9's revert holds). All confirmed unchanged.

## AdSense Protection

`lib/ads.ts`, `app/layout.tsx`, `components/ads/AdPlaceholder.tsx` — confirmed unmodified. This phase has no advertising scope.

---

## Tests

| Command | Result |
|---|---|
| `npm test` | **PASS — 141/141** (130 pre-existing certified assertions, unchanged, plus 11 new) |
| `npx tsc --noEmit` | **PASS** — clean |
| `npm run lint` | **PASS** — "No ESLint warnings or errors" |

**Test count increased by exactly 11**, added to `scripts/test-formula-engine.ts`:
- Purpose: permanent regression coverage for `OutputField.formatValue()`'s zero-decimals display defect, since the existing suite only tests `formulaParser.ts` formula evaluation and had no coverage of display-formatting logic (which is why this defect was never caught before).
- Exact behavior covered: `decimals=0` preserving full integer magnitude (18520, 1852, 50, 450), the zero-value edge case (0 → "0", not empty string), the value=10 edge case (→ "10", not "1"), `decimals=1`/`decimals=2` correct rounding (unchanged), whole-number cleanup at `decimals>0` (unchanged), single-trailing-fractional-zero stripping at `decimals>0` (unchanged), and omitted-decimals default behavior (unchanged).
- No existing certified test was removed or altered — all 130 original assertions pass with identical expected values.

## Build

| Metric | Result |
|---|---|
| `npm run build` (from-scratch) | **PASS** — compiled successfully |
| Static pages generated | **308/308** |
| Calculator routes generated | **45/45** |

---

## Files Changed

```
 components/CalculatorLayout.tsx              | 17 +++++++++++++--   (Phase 9.8, pre-existing, carried forward unmodified)
 components/calculator-engine/OutputField.tsx |  5 +++--              (this phase — the fix)
 scripts/test-formula-engine.ts               | 31 ++++++++++++++++++++++++++++  (this phase — new regression tests)
 3 files changed, 49 insertions(+), 4 deletions(-)
```

Plus this new documentation file: `docs/audits/phase-9.10-shared-output-formatting-remediation.md`.

`data/calculators.json` was **not** modified — `nautical-mile-converter` remains exactly as Phase 9.8 left it.

---

## Production Verification

Production verification deferred until release. This phase's changes are uncommitted and unpushed, per instruction; the current production deployment (`oceancalc.com`) still exhibits the pre-fix behavior for `anchor-scope-calculator` and `anchor-shackle-rode-calculator` (and would exhibit it for the other 3 calculators under qualifying inputs) until this fix is committed, pushed, and deployed. No claim of a fixed production site is made.

---

## Remaining Stage 9 Blockers

- **M-9** — `nautical-mile-converter`'s dead `engine` configuration and formula-text/widget-output mismatch. **Confirmed still open** by this phase (explicitly not touched, protection independently re-verified above). A future phase attempting M-9 again can now safely activate the engine config, since the shared display defect that previously blocked that attempt is fixed.
- **Privacy-page inline links** (`app/privacy/page.tsx` — "Cookies," `contact@oceancalc.com`) — confirmed still open, not addressed, out of scope for this phase.
- Stage 9 overall remains **NOT CERTIFIED** pending resolution of the above two items (per the Stage 9 final certification audit's gate).

---

## Certification Decision

# PHASE 9.10 — PASS

The shared `OutputField.tsx` zero-decimals formatting defect was traced to its exact root cause (a trailing-zero-stripping regex applied unconditionally, including to `decimals: 0` outputs where `toFixed(0)` produces no decimal point to protect the integer boundary), confirmed via first-principles test cases, and corrected with a single minimal conditional — no formula, calculation, or calculator-data change of any kind. A complete, exhaustive impact analysis across all 45 calculators found exactly 6 affected `decimals: 0` outputs (the 5 previously identified plus `nautical-mile-converter`'s dead config), 2 of which were live, default-visible, currently-shipped defects, now fixed and independently numerically verified via rendered-browser testing at both required viewports. All negative controls, `nautical-mile-converter`'s M-9-protected state, Phase 8's certified numerical outputs, and Phase 9.1–9.9's prior remediations all remain confirmed intact. 11 new permanent regression tests were added; all 141 tests, TypeScript, lint, and a full 308/308-page build pass. This certifies only the shared-formatting fix addressed here — it does not resolve M-9 or the privacy-page finding, and does not constitute Stage 9 certification.
