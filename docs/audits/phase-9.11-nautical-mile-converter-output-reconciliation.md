# Phase 9.11 — Nautical Mile Converter Output Reconciliation

**Date:** 2026-08-27
**Basis:** `docs/audits/phase-9.0-ux-information-hierarchy-audit.md`, `phase-9.0-ux-information-hierarchy-matrix.md`, `docs/audits/stage-9-final-ux-certification.md`, `docs/audits/phase-9.8-model-disclosure-completion.md`, `docs/audits/phase-9.9-nautical-mile-converter-output-reconciliation.md`, `docs/audits/phase-9.10-shared-output-formatting-remediation.md` — all read in full before this phase began. Repository HEAD at start: `fc0e5fc41f738dbc0dddb8f8c90fc6f537e2e80c` (confirmed via `git rev-parse HEAD`, matching origin/main). Pre-existing working tree confirmed intact and preserved throughout: `components/CalculatorLayout.tsx` (Phase 9.8), `components/calculator-engine/OutputField.tsx` and `scripts/test-formula-engine.ts` (Phase 9.10), plus the untracked Phase 9.8/9.9/9.10/Stage-9 audit documents — none discarded or modified.

## Status

# PHASE 9.11 — PASS

---

## M-9 Background

Original Phase 9.0 finding: `nautical-mile-converter` has both a `simpleRegistry` and an `engine` configuration. `CalculatorRenderer.tsx` gives `simpleRegistry` precedence, so the live widget rendered via `CalculatorShell` and showed exactly one output (nm→km), while the page's own content (`formula`, `engine.formulaDisplay`) described three conversions (km, miles, m). Phase 9.9 attempted the direct fix — removing the conflicting `simpleRegistry` entry so the `engine`'s three outputs would render — but reverted it after discovering that the "Meters" output (the only `decimals: 0` output among the three) displayed a numerically wrong, truncated value for every non-trivial input (e.g. 10 nm → displayed "1852" instead of the correct 18,520). That defect was traced to a shared bug in `components/calculator-engine/OutputField.tsx`, unrelated to `nautical-mile-converter`'s formulas, and Phase 9.9 could not safely resolve M-9 until that shared defect was fixed.

## Phase 9.10 Dependency

Phase 9.10 traced the shared defect to `OutputField.tsx`'s `formatValue()`: its trailing-zero-stripping regex (`.replace(/\.?0+$/, "")`), correct and intended for `decimals > 0` outputs, was applied unconditionally — for `decimals: 0`, `toFixed(0)` produces a bare integer string with no decimal point, so the regex incorrectly stripped trailing zero *digits* directly from the integer. Phase 9.10 fixed this with a single conditional (`dec > 0 ? fixed.replace(...) : fixed`), independently verified against 5 other already-live calculators, and certified with 141 passing regression tests. This phase begins by re-confirming that fix is present and unmodified before touching `nautical-mile-converter`.

---

## Pre-Fix Rendering Path

```
/tools/nautical-mile-converter/
  → CalculatorToolPage
  → getCalculatorBySlug("nautical-mile-converter")
  → CalculatorRenderer
  → calculator.simpleRegistry is truthy → CalculatorShell
  → formulaKey "nauticalMilesToKm" → nm * 1.852
  → ONE output: "Kilometers"
```

The `engine` configuration (3 outputs) existed in the same data record but was unreachable — shadowed by the `simpleRegistry` branch's precedence in `CalculatorRenderer.tsx`.

---

## Engine Configuration

Re-verified fresh against the current `data/calculators.json` record before any edit (Workstream A), confirmed unchanged from Phase 9.9/9.10's prior inspection:

| Output | Label | Formula | Decimals |
|---|---|---|---:|
| `kilometers` | Kilometers | `distance * 1.852` | 4 |
| `miles` | Miles | `distance * 1.15078` | 4 |
| `meters` | Meters | `distance * 1852` | 0 |

Input: `distance` (label "Distance," default unit `nautical_miles`, selectable among nautical_miles/kilometers/miles/meters/feet, default value 1). `engine.formulaDisplay`: "1 NM = 1.852 km = 1852 m ≈ 1.15078 miles" — matches the three outputs exactly. These are exactly the three authorized conversions specified for this phase; no discrepancy was found, so no STOP condition was triggered at this step.

**Content consistency pre-check:** `title`, `description`, `formulaDetail`, `examples`, and `faq` were all re-read and found consistent with the three-output behavior — no factual contradiction. The one minor wording note (the engine's output label is "Miles" while the `description`/`formula`/`examples` fields say "statute miles") is a pre-existing brevity choice already present before this phase, not a new or false contradiction — "Miles" is not factually wrong for a factor that is exactly the nm→statute-mile conversion. Per instruction, no content was rewritten.

---

## Root Cause

The engine configuration was shadowed purely by `CalculatorRenderer.tsx`'s branch order (`if (calculator.simpleRegistry) return <CalculatorShell />` checked before the `engine` branch), combined with the `nautical-mile-converter` record carrying both keys simultaneously. No formula was ever wrong; the correct three-output implementation existed in the data the entire time.

---

## Remediation

**Workstream B (verify Phase 9.10 fix first):** confirmed present in `components/calculator-engine/OutputField.tsx` — `const fixed = rounded.toFixed(dec); return dec > 0 ? fixed.replace(/\.?0+$/, "") : fixed;` — and `npm test` run before any edit in this phase confirmed the Phase 9.10 baseline: 141/141 passing.

**Workstream C (activate the engine):** the `simpleRegistry` block was **removed** from `nautical-mile-converter`'s entry in `data/calculators.json` (19 lines deleted) — the exact minimal, single-calculator change. `CalculatorRenderer.tsx` was **not modified**; its global precedence logic is byte-identical to before. No other file's rendering path was touched. The `engine` configuration, already complete and correct, became authoritative purely because the conflicting key no longer exists on this one record.

**Files changed by this phase:** `data/calculators.json` (the removal above) and `scripts/test-formula-engine.ts` (12 new permanent regression assertions, see Tests below). `components/CalculatorLayout.tsx` and `components/calculator-engine/OutputField.tsx` are Phase 9.8/9.10's pre-existing, unmodified carry-forward changes.

---

## Numerical Verification

Independent, fresh verification (Workstream D), computed outside the test suite before any build, then cross-checked against the permanent regression tests added this phase and against real rendered-browser interaction:

| Input | Output | Expected | Actual (computed) | Actual (rendered browser) | Status |
|---:|---|---:|---:|---:|---|
| 1 | Kilometers | 1.852 | 1.852 | 1.852 | Match |
| 1 | Miles | 1.15078 (4dp) | 1.1508 | 1.1508 | Match |
| 1 | Meters | 1852 | 1852 | 1852 | Match |
| 10 | Kilometers | 18.52 | 18.52 | 18.52 | Match |
| 10 | Miles | 11.5078 | 11.5078 | 11.5078 | Match |
| 10 | Meters | **18520** | **18520** | **18520** | **Match — previously 1852, now correct** |
| 100 | Kilometers | 185.2 | 185.2 | 185.2 | Match |
| 100 | Miles | 115.078 | 115.078 | 115.078 | Match |
| 100 | Meters | **185200** | **185200** | **185200** | **Match — previously 1852, now correct** |
| 2.5 | Kilometers | 4.63 | 4.63 | 4.63 | Match |
| 2.5 | Miles | 2.87695 (rounds to 2.877 at 4dp) | 2.877 | 2.877 | Match |
| 2.5 | Meters | **4630** | **4630** | **4630** | **Match — previously 463, now correct** |

All 12 combinations correct. The three previously-broken meter values (the exact regression that caused Phase 9.9 to fail) are now confirmed correct through three independent methods: hand computation, the permanent test suite, and live browser interaction.

---

## Browser Verification

- **Browser:** Playwright 1.62.1 driving the system-installed Google Chrome (`channel: 'chrome'`).
- **Viewports:** 1440×900, 390×844.
- **Route:** `/tools/nautical-mile-converter/`, local production build (fresh `rm -rf out .next && npm run build`), served locally.
- **Method:** real interaction — located the actual input field, cleared it, and typed each value (`1`, `10`, `100`, `2.5`) via `page.type()`, then read the live-updated result card's text after each entry. Not a static-HTML inspection.
- **Result:** at both viewports, all three outputs updated correctly for all four inputs, with values matching the table above exactly. Zero horizontal overflow at any point during interaction.

### Desktop (1440×900)
All four inputs produced the exact expected Kilometers/Miles/Meters values shown above; zero overflow.

### Mobile (390×844)
Identical results to desktop — all four inputs produced the exact expected values; zero overflow; screenshot-confirmed clean layout (input field, unit selector, and card all render without clipping or wrapping issues). No CSS change was required.

---

## Output Structure

Confirmed via live DOM inspection (not static HTML) at both viewports: **exactly 3** output boxes, labels `["Kilometers", "Miles", "Meters"]` — no duplicate, no missing, no extra conversion. Input labels: `["Distance"]` — exactly one input, correctly labeled (the engine's own label, not a leftover from the removed `simpleRegistry`). The shipped static HTML (`out/tools/nautical-mile-converter/index.html`) was independently checked via tag-scoped `grep`: exactly 1 real DOM occurrence of each of "Kilometers," "Miles," "Meters" (raw-text grep shows 2 each, the known, previously-documented Next.js RSC hydration-payload duplication artifact — not a real duplicate, consistent with every prior phase's identical finding). No obsolete single-output UI, no hidden conflicting `simpleRegistry` markup, and no duplicate calculator instance were found anywhere in the shipped page.

---

## Content Consistency

Confirmed consistent: title ("Nautical Mile Converter") matches; description's mention of "kilometers, and meters" (plus "statute miles") is now accurately reflected by the three live outputs; `formulaDisplay` ("1 NM = 1.852 km = 1852 m ≈ 1.15078 miles") now exactly matches what the widget shows; `formulaDetail` and FAQ answers ("One nautical mile equals 1.852 kilometers") are accurate and unchanged. No content rewrite was needed or performed — the interactive widget now agrees with content that was already correct.

---

## Negative Controls

Rendered at both viewports (12 checks): `statute-nautical-mile-converter`, `knots-speed-converter`, `celsius-fahrenheit-converter` (as instructed), plus `great-circle-distance-calculator` (navigation), `wave-height-calculator` (wind/wave), `hull-speed-calculator` (sailing-performance) for broader category coverage. **All 12 confirmed `overflow: false`, unaffected.** `knots-to-kmh` and `sailing-time-calculator` — the other two `simpleRegistry`-using calculators — were confirmed via `data/calculators.json` to still carry their `simpleRegistry` blocks unchanged (repository scan: exactly these two remain), proving this phase's single-record edit did not touch global precedence or any other calculator's data.

---

## Accessibility

Axe-core (`wcag2a`/`wcag2aa`), `/tools/nautical-mile-converter/`, both viewports: **0 violations at 1440×900 and 0 violations at 390×844.** All three outputs render with accessible labels (each output box's `<p>` label element, unchanged component structure from `OutputField.tsx`), no duplicate IDs, no form-label issues, no contrast/layout issue introduced by going from one output box to three. The known privacy-page finding was not scanned or touched, remaining explicitly out of scope.

---

## Responsive

At 390×844: three outputs render correctly, stacked, no horizontal overflow, no label/number clipping, units remain readable, input/result hierarchy is clear (screenshot-verified). At 1440×900: same, confirmed clean. No CSS change was required at either viewport — no STOP condition was triggered under Workstream N.

---

## Built Output

`out/tools/nautical-mile-converter/index.html` inspected directly (not source-only): H1 correct, exactly 1 real DOM occurrence of each of the three output labels (tag-scoped grep), input label is "Distance" (the engine's label — confirms the obsolete one-output `simpleRegistry` path is no longer responsible for this page), `formulaDisplay` text present and matching the three outputs.

---

## Full Route Regression

`npm run build` (from-scratch): **308/308 static pages**, **45/45 calculator routes** (`out/tools/` — 46 directories = 45 calculators + the index page itself). No route disappeared or changed count.

---

## Phase 8 Protection

`lib/formulaParser.ts` — not modified (`git diff --stat`, no output). `data/calculators-phase5.json` — not modified. All Phase 8-certified numerical outputs independently re-verified byte-identical via `npm test`: radar horizon (`7.717706403199351`), wave height (`2.5406652397056004`), true/magnetic heading (`280`), Beaufort (`4`), great circle (`3007.6795421033207`), wind chill (`25.43151479664407`), apparent wind (`11.661903789690601`/`59.036243467926475`) — all unchanged. `data/calculators.json` was modified, but only by removing `nautical-mile-converter`'s `simpleRegistry` block — no formula in any calculator's record was altered.

## Phase 9.1–9.10 Protection

`git diff --stat` confirms the complete diff is exactly 4 files: `components/CalculatorLayout.tsx` (Phase 9.8, unmodified carry-forward), `components/calculator-engine/OutputField.tsx` (Phase 9.10, unmodified carry-forward), `data/calculators.json` (this phase), `scripts/test-formula-engine.ts` (this phase, additive only). Explicitly re-verified via targeted `git diff --stat` that none of the following changed: `app/page.tsx` (9.1), `components/affiliate/` (9.1, remains deleted), `app/layout.tsx` (9.2), `components/Footer.tsx` (9.2/9.7), `app/navigation/page.tsx`/`app/navigation-calculations/page.tsx` (9.3), the 4 cluster pages + `ClusterCalculatorList.tsx` (9.5), `components/ads/AdPlaceholder.tsx` (pre-9.6), `components/Header.tsx` (9.6), `components/CalculatorRenderer.tsx` (global precedence, unchanged), `components/CalculatorToolPage.tsx` (unchanged). `knots-to-kmh` and `sailing-time-calculator` — the other two `simpleRegistry` calculators — confirmed unaffected. Phase 9.9's reverted attempt left no residue (this phase's diff is a clean, fresh, single edit).

## AdSense Protection

`lib/ads.ts`, `app/layout.tsx`, `components/ads/AdPlaceholder.tsx` — confirmed unmodified. No advertising work was performed.

---

## Tests

| Command | Result |
|---|---|
| `npm test` | **PASS — 153/153** (141 Phase 9.10 baseline, unchanged, plus 12 new) |
| `npx tsc --noEmit` | **PASS** — clean |
| `npm run lint` | **PASS** — "No ESLint warnings or errors" |

**Test count increased by exactly 12** (from 141 to 153), added to `scripts/test-formula-engine.ts`:
- Purpose: permanent end-to-end regression coverage for `nautical-mile-converter`'s three engine outputs, specifically re-asserting the exact meter-magnitude values that caused Phase 9.9's attempt to fail (10 nm → 18520 m, not 1852; 100 nm → 185200 m, not 1852; 2.5 nm → 4630 m, not 463), plus the two calm-input cases (1 nm) and the kilometers/miles outputs at all four inputs.
- Each assertion evaluates the actual formula string via `parseFormula` and formats it via the actual `formatValue` function — a true end-to-end check (formula + display), not a formula-only or format-only check.
- No existing test was removed or altered.

## Build

| Metric | Result |
|---|---|
| `npm run build` (from-scratch) | **PASS** — compiled successfully |
| Static pages generated | **308/308** |
| Calculator routes generated | **45/45** |

---

## Files Changed

```
 components/CalculatorLayout.tsx              | 17 ++++++-        (Phase 9.8, pre-existing, unmodified by this phase)
 components/calculator-engine/OutputField.tsx |  5 +-               (Phase 9.10, pre-existing, unmodified by this phase)
 data/calculators.json                        | 19 --------          (this phase — simpleRegistry removed)
 scripts/test-formula-engine.ts               | 71 ++++++++++++++++  (this phase — 12 new regression tests)
 4 files changed, 89 insertions(+), 23 deletions(-)
```

Plus this new documentation file: `docs/audits/phase-9.11-nautical-mile-converter-output-reconciliation.md`.

---

## Remaining Stage 9 Blockers

- **Privacy-page inline links** (`app/privacy/page.tsx` — "Cookies," `contact@oceancalc.com`) — `link-in-text-block` accessibility finding, confirmed still open, not addressed in this phase, out of scope.

**M-9 is resolved.** No other blocker from the Stage 9 final certification audit remains open as a result of this phase's work. This phase does not claim overall Stage 9 certification — that determination is reserved for a dedicated Stage 9 re-certification pass.

---

## Certification Decision

# PHASE 9.11 — PASS

`nautical-mile-converter` now renders exactly the three conversions its content and engine configuration have always declared — kilometers, miles, and meters — with numerically correct results verified independently through hand computation, a permanent automated test suite (12 new assertions, 153/153 total passing), and real rendered-browser interaction at both required viewports. The specific magnitude defect that blocked Phase 9.9 (10/100/2.5 nm all displaying "1852"/"1852"/"463" for Meters) is confirmed fixed and does not recur. The fix was the smallest possible change — removing one conflicting `simpleRegistry` block from one calculator's data record — with zero modification to `CalculatorRenderer.tsx`'s global precedence, zero modification to any formula, and zero effect on any other calculator (12 negative-control checks, all clean). Phase 8 and Phase 9.1–9.10 protections all hold. Accessibility, responsiveness, and the full 308/308-page build all pass. This certifies only M-9's resolution — it does not constitute Stage 9 certification; the privacy-page finding remains the sole documented open item.
