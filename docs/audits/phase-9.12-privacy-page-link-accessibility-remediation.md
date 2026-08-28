# Phase 9.12 — Privacy Page Link Accessibility Remediation

**Date:** 2026-08-27
**Basis:** `docs/audits/phase-9.0-ux-information-hierarchy-audit.md`, `phase-9.0-ux-information-hierarchy-matrix.md`, `docs/audits/stage-9-final-ux-certification.md`, `docs/audits/phase-9.7-footer-link-accessibility-remediation.md`, `docs/audits/phase-9.8-model-disclosure-completion.md`, `docs/audits/phase-9.9-nautical-mile-converter-output-reconciliation.md`, `docs/audits/phase-9.10-shared-output-formatting-remediation.md`, `docs/audits/phase-9.11-nautical-mile-converter-output-reconciliation.md` — all read in full before this phase began. Repository HEAD at start: `fc0e5fc41f738dbc0dddb8f8c90fc6f537e2e80c` (confirmed via `git rev-parse HEAD`, matching origin/main). Pre-existing working tree confirmed intact and preserved throughout: `components/CalculatorLayout.tsx` (Phase 9.8), `components/calculator-engine/OutputField.tsx` and part of `scripts/test-formula-engine.ts` (Phase 9.10), `data/calculators.json` and the remainder of `scripts/test-formula-engine.ts` (Phase 9.11), plus all untracked Phase 9.8/9.9/9.10/9.11/Stage-9 audit documents — none discarded or modified.

## Status

# PHASE 9.12 — PASS

---

## Remaining Stage 9 Finding

Phase 9.7's finding, discovered while remediating F-2 (the Footer credit-line link), stated exactly: `app/privacy/page.tsx` contains two links embedded in body text — "Cookies" (`/cookies/`) and `contact@oceancalc.com` (`mailto:`) — styled `hover:underline` only, triggering the same `link-in-text-block` axe rule as F-2 did. This was confirmed still open by the Stage 9 final certification audit and left untouched through Phases 9.8–9.11 as explicitly out of scope for each.

---

## Pre-Fix Verification

- **Route:** `/privacy/`
- **Browser:** Playwright 1.62.1 driving the system-installed Google Chrome (`channel: 'chrome'`).
- **Viewports:** 1440×900, 390×844.
- **Axe configuration:** `runOnly: ['wcag2a', 'wcag2aa']`.
- **Exact violation reproduced:** `link-in-text-block`, impact `serious`, identical at both viewports.
- **Exact offending nodes** (axe target selectors, both confirmed):
  - `.text-blue-600.dark\:text-blue-400[href$="cookies/"]` — `<a class="text-blue-600 dark:text-blue-400 hover:underline" href="/cookies/">Cookies</a>`
  - `a[href="mailto:contact@oceancalc.com"]` — `<a href="mailto:contact@oceancalc.com" class="text-blue-600 dark:text-blue-400 hover:underline">contact@oceancalc.com</a>`
- **Computed styles recorded before the fix:** both links — `color: rgb(37, 99, 235)` (blue-600); surrounding paragraph — `color: rgb(51, 65, 85)` (slate-700); both links — `text-decoration-line: none`. No other non-color distinguishing cue existed in either link's normal state.
- **Source location confirmed:** `app/privacy/page.tsx` lines 44–46 (Cookies link) and lines 62–67 (mailto link).

This is exactly Phase 9.7's original finding, unchanged in the current source — verified fresh, not assumed.

---

## Root Cause

Both links used the identical inline Tailwind className `"text-blue-600 dark:text-blue-400 hover:underline"` — a color change from the surrounding paragraph text plus an underline that appeared only on `:hover`. In the links' default (non-hover, non-focus) state, color was the only visual cue distinguishing them from plain body text, which fails WCAG 2.1's "use of color" / "link in text block" requirement. This className string was confirmed (via repository-wide search) to be a common, independently-repeated inline Tailwind pattern used across dozens of unrelated files — not a shared component or global CSS rule — so the two Privacy-page occurrences could be corrected without any risk to any other page's links.

---

## Remediation

**Exact minimal change**, `app/privacy/page.tsx`, two lines:

```diff
-          <Link href="/cookies/" className="text-blue-600 dark:text-blue-400 hover:underline">
+          <Link href="/cookies/" className="text-blue-600 dark:text-blue-400 underline">
             Cookies
           </Link>{" "}
...
           <a
             href="mailto:contact@oceancalc.com"
-            className="text-blue-600 dark:text-blue-400 hover:underline"
+            className="text-blue-600 dark:text-blue-400 underline"
           >
             contact@oceancalc.com
           </a>
```

`hover:underline` → `underline` on both links — the exact same transformation already proven correct and safe in Phase 9.7 for the Footer credit-line link. The underline is now present in the default (non-hover) state; existing color (`text-blue-600 dark:text-blue-400`) is unchanged, so the underline remains present on hover and on focus as well (it was never removed, only made unconditional). No other attribute, wording, or destination was touched.

---

## Content Protection

- **Link wording:** confirmed unchanged — "Cookies" and "contact@oceancalc.com," verbatim, exactly as before.
- **Destinations:** confirmed unchanged — `href="/cookies/"` and `href="mailto:contact@oceancalc.com"`, verbatim.
- **Privacy/legal content:** confirmed unchanged — every paragraph, heading, and sentence in `app/privacy/page.tsx` is byte-identical to before except the two className strings (`git diff` shows exactly 2 changed lines, 0 added/removed lines of prose). No privacy statement, cookie language, data-sharing language, or contact language was altered.

---

## Accessibility Verification

Axe-core (`wcag2a`/`wcag2aa`), `/privacy/`, both required viewports, post-fix:

| Viewport | Violations |
|---|---|
| 1440×900 | **0** |
| 390×844 | **0** |

Down from 1 violation (2 nodes) pre-fix to 0 post-fix, at both viewports — the exact two previously-offending nodes were individually confirmed no longer present in the violation list (not merely a count decrease). No other `link-in-text-block` violation, and no violation of any other rule, appeared anywhere on the page. Direct computed-style re-check confirms `text-decoration-line: underline` on both links, at both viewports.

**Accessibility negative controls** (Workstream J): homepage, `/tools/nautical-mile-converter/`, `/navigation-calculations/` — **0 violations on all 3 routes, at both viewports** (6/6 scans clean). No unrelated page was affected.

---

## Keyboard Verification

Real keyboard `Tab` traversal confirmed the in-content "Cookies" link is reachable via keyboard navigation (reached after the 7 Header nav links, in normal document order — confirmed distinct from the Footer's separate, unrelated standalone "Cookies" nav link, which was correctly left unmodified at `text-decoration-line: none`, exactly as before, since it was never part of this finding). Direct `.focus()` verification on both target links (the in-content Cookies link and the mailto link) confirmed:

- Both are genuinely focusable (`document.activeElement` matches).
- Both show `outline-style: auto` — the browser's native focus ring, not hidden, not overridden by the class change.
- Both retain `text-decoration-line: underline` while focused — the underline persists through the focus state, so focus is never the only cue either.
- No surrounding text shifted as a result of the change (underline does not affect layout/reflow).

---

## Visual Regression

Screenshot-confirmed (desktop and mobile) that both target links now display a clear, persistent underline, immediately distinguishable from surrounding body text at a glance — not merely by color. Page layout, paragraph wrapping, heading structure, and spacing are otherwise unchanged. Document height at each of the 8 tested viewports (see Responsive below) is consistent with normal reflow, not an unexpected layout shift.

**Negative controls:** homepage and `/tools/nautical-mile-converter/` were included in the accessibility negative-control scans above (0 violations, confirming no unintended global effect); no other visual element on either page was touched by this phase's diff.

---

## Responsive Verification

All 8 required viewports tested against `/privacy/`, post-fix:

| Viewport | Overflow | Document height |
|---|---|---:|
| 1440×900 | No | 1232px |
| 1280×800 | No | 1232px |
| 1024×1366 | No | 1366px |
| 768×1024 | No | 1260px |
| 430×932 | No | 1618px |
| 390×844 | No | 1674px |
| 375×812 | No | 1718px |
| 320×800 | No | 2009px |

**0 horizontal overflow at all 8 viewports.** Document height increases naturally as viewport width narrows (expected text reflow), with no anomalous jump attributable to the underline change.

---

## Global Styling Protection

Confirmed via repository-wide search: the literal className string `"text-blue-600 dark:text-blue-400 hover:underline"` is used independently, inline, in dozens of unrelated files (`app/tools/page.tsx`, `components/ClusterHub.tsx`, `components/CalculatorLayout.tsx`, `components/RelatedCalculators.tsx`, and many more) — confirming it is a repeated inline Tailwind utility convention, not a shared class definition or global CSS rule (`app/globals.css` contains zero matches for this pattern). `git diff` confirms exactly 2 lines changed, both inside `app/privacy/page.tsx`, both inside the two target `<Link>`/`<a>` elements — no other file, and no other link on any other page, was touched.

---

## Phase 8 Protection

`lib/formulaParser.ts`, `data/calculators-phase5.json` — confirmed unmodified (`git diff --stat`, no output). `data/calculators.json` shows a diff, but it is Phase 9.11's pre-existing, unmodified carried-forward change (the `nautical-mile-converter` `simpleRegistry` removal) — this phase did not touch it further. `npm test` — 153/153, unchanged.

## Phase 9.1–9.11 Protection

`git diff --stat` confirms the complete diff is exactly 5 files: `components/CalculatorLayout.tsx` (9.8), `components/calculator-engine/OutputField.tsx` (9.10), `data/calculators.json` (9.11), `scripts/test-formula-engine.ts` (9.10/9.11), and `app/privacy/page.tsx` (this phase, new). Explicitly re-verified via targeted `git diff --stat` that none of the following changed: `app/page.tsx` (9.1), `components/affiliate/` (9.1, remains deleted), `app/layout.tsx` (9.2), `components/Footer.tsx` (9.2/9.7 — its own credit-link underline fix remains intact and independently re-confirmed unmodified), `app/navigation/page.tsx`/`app/navigation-calculations/page.tsx` (9.3), the 4 cluster pages + `ClusterCalculatorList.tsx` (9.5), `components/ads/AdPlaceholder.tsx` (pre-9.6), `components/Header.tsx` (9.6), `components/CalculatorRenderer.tsx` (9.11 — global precedence unchanged), `components/CalculatorToolPage.tsx`. All confirmed unchanged.

## AdSense Protection

`lib/ads.ts`, `app/layout.tsx`, `components/ads/AdPlaceholder.tsx`, `public/ads.txt` — confirmed unmodified. No advertising work was performed.

## SEO Protection

Sitemap (`app/sitemap.ts`), metadata (`lib/seo.ts`, and `app/privacy/page.tsx`'s own `buildSeoMetadata()` call — unchanged), canonical logic, robots configuration, and URL structure — all confirmed unmodified. This was an accessibility-only styling change.

---

## Tests

| Command | Result |
|---|---|
| `npm test` | **PASS — 153/153** (unchanged from the Phase 9.11 baseline) |
| `npx tsc --noEmit` | **PASS** — clean |
| `npm run lint` | **PASS** — "No ESLint warnings or errors" |

No new automated test was added. This is a pure CSS-class/styling change to static JSX with no numerical, formula, or logic component — the existing `formulaParser.ts`/`OutputField.tsx` regression suites are not applicable, and a new test would only be duplicating what axe-core and the rendered-browser verification above already independently confirm.

---

## Build

| Metric | Result |
|---|---|
| `npm run build` (from-scratch) | **PASS** — compiled successfully |
| Static pages generated | **308/308** |
| Calculator routes generated | **45/45** |

`out/privacy/index.html` inspected directly (not source-only): confirmed the in-content "Cookies" link ships with `class="text-blue-600 dark:text-blue-400 underline"`, and the mailto link ships with the same corrected class — both distinct from the Footer's unrelated, unmodified standalone "Cookies" nav link (`class="hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"`, confirmed present and untouched in the same file).

---

## Production Status

**Production verification deferred until release.** This phase's change is uncommitted and unpushed, per instruction. The current production deployment (`oceancalc.com`) still exhibits the pre-fix `link-in-text-block` violation on `/privacy/` until this fix is committed, pushed, and deployed. No claim of a fixed production site is made.

---

## Files Changed

```
 app/privacy/page.tsx | 4 ++--
 1 file changed, 2 insertions(+), 2 deletions(-)
```

Plus this new documentation file: `docs/audits/phase-9.12-privacy-page-link-accessibility-remediation.md`.

No other application file was changed by this phase. (`components/CalculatorLayout.tsx`, `components/calculator-engine/OutputField.tsx`, `data/calculators.json`, and `scripts/test-formula-engine.ts` remain exactly as Phases 9.8/9.10/9.11 left them, carried forward unmodified.)

---

## Remaining Stage 9 Blockers

`None identified.`

Phase 9.12 resolves the final previously documented Stage 9 blocker. Overall Stage 9 certification is reserved for Phase 9.13.

---

## Certification Decision

# PHASE 9.12 — PASS

The exact two documented Privacy-page links now have a persistent, non-color-dependent underline, verified via computed style, real keyboard-focus interaction, and axe-core (0 violations at both required viewports, down from 1 violation/2 nodes, with the exact prior offending nodes individually confirmed gone). Link wording, destinations, and all privacy/legal content are byte-identical to before. No global CSS, Header, Footer, calculator, AdSense, or SEO file was touched, and no other page's links were affected — confirmed via a scoped 2-line diff and clean negative-control accessibility scans on 3 unrelated routes. All 8 required viewports show zero overflow. Phase 8 and Phase 9.1–9.11 protections all hold. Tests (153/153), TypeScript, lint, and a full 308/308-page build all pass.
