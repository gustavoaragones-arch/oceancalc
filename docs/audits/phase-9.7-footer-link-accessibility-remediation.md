# Phase 9.7 — Footer Link Accessibility Remediation

**Date:** 2026-08-27
**Basis:** `docs/audits/phase-9.6-responsive-visual-ux-certification.md` (authoritative source for the F-2 finding), plus `phase-9.0-ux-information-hierarchy-audit.md`, `phase-9.1-critical-ux-remediation.md`, `phase-9.2-global-navigation-remediation.md`, `phase-9.3-navigation-architecture-remediation.md`, `phase-9.4-contextual-information-hierarchy-model-disclosure.md`, `phase-9.5-calculator-cluster-authority-ux.md`, `phase-9-pre-9.6-ad-placeholder-cleanup.md` — all read in full before this phase began. Repository HEAD at start: `51496121c6142174f44257ab6d0d5a9e2b1e1cc3` (confirmed via `git rev-parse HEAD`, matching the expected Phase 9.6 commit; working tree confirmed clean via `git status --short`).

## Status

# PASS

---

## Finding Remediated

**F-2 — Medium** (Phase 9.6): Footer credit-line link distinguishable from surrounding text only by color.

---

## Original Condition

**Exact element** (`components/Footer.tsx`, lines 50–57, pre-fix):

```jsx
<a
  href={organization.url}
  target="_blank"
  rel="noopener noreferrer"
  className="text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 underline-offset-2 hover:underline transition-colors"
>
  {organization.name}
</a>
```

- **Exact text:** "Albor Digital LLC" (`organization.name`, from `config/siteOwner.ts`).
- **Exact href:** `https://albor.digital` (`organization.url`), opens in a new tab (`target="_blank"`, `rel="noopener noreferrer"`).
- **Surrounding text:** embedded inline inside a `<p>`: `Developed and operated by {link}. {year}` — a link inside a running sentence of body text, not a standalone nav-style link.
- **Why this was the only affected Footer link:** the other Footer links (`footerLinks` array — "All Calculators," "Privacy Policy," etc. — and the "About / Contact / Editorial Policy / Privacy Policy" row) are standalone link rows, not embedded inside a sentence of surrounding prose, so axe-core's `link-in-text-block` rule (which specifically targets links inside a block of text) does not apply to them. Only the credit-line link sits inside a text block.
- **Confirmed dependency on color alone:** computed-style inspection (`getComputedStyle`) of the pre-fix link showed `text-decoration-line: none` in the default state — the only difference from the surrounding paragraph was a subtle color shift (`rgb(75, 85, 99)` / gray-600 vs. the paragraph's `rgb(107, 114, 128)` / gray-500). No underline, bold, or icon existed in the non-hover state; `underline-offset-2` was already present in the className but had no visible effect since the paired `underline` utility was gated behind `hover:`.

---

## Remediation

**Exact change** (`components/Footer.tsx`, one line):

```diff
-            className="text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 underline-offset-2 hover:underline transition-colors"
+            className="text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 underline underline-offset-2 transition-colors"
```

`hover:underline` was changed to a persistent `underline` (keeping the already-present `underline-offset-2`), so the link is now underlined in its default state, not only on hover. `hover:text-blue-600 dark:hover:text-blue-400` and `transition-colors` were left exactly as they were — hover still changes the link's color, so hover behavior remains intact and additive rather than being the sole distinguishing cue. No new utility class was introduced; both `underline` and `underline-offset-2` were already part of Tailwind's utility set already in use on this exact element.

**Confirmed limited to the affected link only:** `git diff --stat` shows exactly one file changed, one line modified. No other Footer link's className was touched — the `footerLinks` array (line 22), the About/Contact/Editorial Policy/Privacy Policy row (lines 29–43), and every other visual property of the Footer are byte-identical to Phase 9.6.

---

## Rendered Verification

- **Browser:** Playwright 1.62.1 driving the system-installed Google Chrome (`channel: 'chrome'`), the same tool and method used in Phase 9.6.
- **Viewports:** 1440×900 (desktop), 390×844 (mobile).
- **Routes:** `/` (homepage) and `/tools/nautical-mile-converter/` (calculator page) — both render the global `Footer`.
- **Pre-fix (production, `https://oceancalc.com`):** computed style confirmed `text-decoration-line: none` on the credit link in its default state on all 4 route/viewport combinations; footer screenshot visually confirms the link is indistinguishable from surrounding text except for a barely-perceptible color shift.
- **Post-fix (local production build, `out/`, served locally via `python3 -m http.server` and re-tested against `localhost`):** computed style confirmed `text-decoration-line: underline` in the default state on all 4 route/viewport combinations. Footer screenshots (desktop and mobile) confirm "Albor Digital LLC" now renders with a persistent underline, clearly identifiable as a link, while every other Footer element (link rows, copyright line, spacing, layout) is visually unchanged from the Phase 9.6 baseline.

---

## Accessibility Verification

- **Tool/configuration:** axe-core (bundled `axe.min.js`), `runOnly: ['wcag2a', 'wcag2aa']` — identical configuration to Phase 9.6.
- **Routes scanned:** `/` (homepage), `/tools/nautical-mile-converter/` (calculator), `/navigation-calculations/` (cluster authority page), `/privacy/` (legal/informational page) — one of each required category, matching Phase 9.6's page selection plus the required legal page.
- **Viewports:** 1440×900, 390×844 — 8 scans total.

**Before (production, pre-fix):**

| Route | Desktop | Mobile |
|---|---|---|
| `/` | 1 violation (`link-in-text-block`) | 1 violation (`link-in-text-block`) |
| `/tools/nautical-mile-converter/` | 1 violation (`link-in-text-block`) | 1 violation (`link-in-text-block`) |
| `/navigation-calculations/` | 1 violation (`link-in-text-block`) | 1 violation (`link-in-text-block`) |
| `/privacy/` | 1 violation (`link-in-text-block`) | 1 violation (`link-in-text-block`) |

**After (local build, post-fix):**

| Route | Desktop | Mobile |
|---|---|---|
| `/` | **0 violations** | **0 violations** |
| `/tools/nautical-mile-converter/` | **0 violations** | **0 violations** |
| `/navigation-calculations/` | **0 violations** | **0 violations** |
| `/privacy/` | 1 violation (`link-in-text-block`) — **different element, see below** | 1 violation (`link-in-text-block`) — **different element, see below** |

**F-2 is confirmed resolved**: on `/`, `/tools/nautical-mile-converter/`, and `/navigation-calculations/` — all three of which render the Footer credit-line link — the `link-in-text-block` violation disappeared entirely (0 violations, down from 1).

**New-to-this-scan finding on `/privacy/` (not F-2, not caused by this remediation):** the remaining violation on `/privacy/` was inspected directly — its target elements are `<a href="/cookies/">Cookies</a>` and `<a href="mailto:contact@oceancalc.com">contact@oceancalc.com</a>`, both embedded inline in `/privacy/`'s own body paragraphs (`app/privacy/page.tsx`), styled with `hover:underline` only (the same class of defect as F-2, but a **completely separate file and pair of links**, never touched by this phase's diff). This is confirmed pre-existing and unrelated: `git diff --stat` for this phase shows only `components/Footer.tsx` changed; `app/privacy/page.tsx` was never part of Phase 9.6's F-2 finding or this phase's scope (Phase 9.6's accessibility scan did not include `/privacy/`, so this condition was never previously surfaced). Per instruction, **this was not fixed** — it is reported here, separately, as a new pre-existing finding, distinguishable with confidence from this remediation (different file, different links, zero overlap with the diff).

---

## Responsive Verification

All 8 required viewports tested against the fixed local build, on `/` and `/tools/nautical-mile-converter/` (16 combinations):

| Viewport | Footer height | Horizontal overflow? | Any footer link outside the footer box? |
|---|---:|---|---|
| 1440×900 | 223px | No | No |
| 1280×800 | 223px | No | No |
| 1024×1366 | 223px | No | No |
| 768×1024 | 223px | No | No |
| 430×932 | 273px | No | No |
| 390×844 | 273px | No | No |
| 375×812 | 273px | No | No |
| 320×800 | 360px | No | No |

Footer heights are identical to Phase 9.6's pre-existing measurements at every breakpoint (223px desktop/tablet, 273px phone, 360px at 320px) — the underline change added no new wrapping, no height change, and no overflow anywhere. 0 responsive regressions found across all 16 combinations.

---

## Regression

| Command | Result |
|---|---|
| `npm test` | **PASS** — 130 passed, 0 failed |
| `npx tsc --noEmit` | **PASS** — clean |
| `npm run lint` | **PASS** — "No ESLint warnings or errors" |
| `npm run build` (from-scratch, `rm -rf out .next` first) | **PASS** — compiled successfully |
| Static pages generated | **308/308** |
| Calculator routes generated | **45/45** |

---

## Phase 8 Protection

`lib/formulaParser.ts`, `data/calculators.json`, `data/calculators-phase5.json` — confirmed unmodified (`git diff --stat`, no output). No calculator numerical logic was touched. `npm test`'s 130-assertion suite (full parse-and-evaluate pass of every calculator formula) passed identically to baseline.

## Phase 9 Protection

Re-verified against this phase's `git diff` (exactly one file, `components/Footer.tsx`, one line):

- **9.1:** no reintroduction of removed content; `components/affiliate/MarineToolsBlock.tsx` remains deleted; homepage duplicate section remains removed.
- **9.2:** no `AllCalculatorsGrid` reference reintroduced in `app/layout.tsx` (untouched this phase); Footer's "All Calculators" link preserved, unchanged, confirmed present in all screenshots.
- **9.3:** `/navigation/` ↔ `/navigation-calculations/` cross-links untouched (neither file modified).
- **9.4:** Great Circle model disclosure untouched (`components/CalculatorLayout.tsx` not modified).
- **9.5:** all 4 cluster authority pages, `ClusterCalculatorList.tsx`, canonical titles, sibling navigation, and "View All Maritime Calculators" link — none of the 5 Phase 9.5 files appear in this phase's diff.
- **9.6:** `components/Header.tsx` not modified this phase — the responsive header fix from Phase 9.6 remains exactly as committed; the full 8-viewport responsive re-check above confirms no regression to responsive behavior anywhere in the tested pages.

## AdSense Boundary

`lib/ads.ts`, `app/layout.tsx`, `components/ads/AdPlaceholder.tsx` — confirmed unmodified (`git diff --stat`, no output). No AdSense publisher ID, script, or Auto Ads configuration was touched. This phase has no relationship to advertising.

---

## Files Changed

```
 M components/Footer.tsx | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Plus this new documentation file: `docs/audits/phase-9.7-footer-link-accessibility-remediation.md`.

No other file was modified.

---

## Remaining Findings

- **New (not F-2, not introduced by this phase):** `/privacy/` contains two links embedded in body text (`app/privacy/page.tsx`) — "Cookies" (`/cookies/`) and `contact@oceancalc.com` (`mailto:`) — styled `hover:underline` only, triggering the same `link-in-text-block` axe rule as F-2 did. This is a pre-existing condition on a page Phase 9.6's accessibility scan did not include, confirmed unrelated to and untouched by this phase's diff. **Not fixed. Reported for separate authorization, consistent with this phase's one-finding scope.**
- No other new accessibility violations were found on any of the 4 scanned routes at either viewport.
- No Low/Informational findings from Phase 9.0's original register were re-examined or altered by this phase.

---

## Certification Decision

# PHASE 9.7 — PASS

F-2 is fully resolved: the Footer credit-line link now has a persistent, non-color visual distinction (underline) from its surrounding text, verified via computed style, screenshot, and axe-core (0 `link-in-text-block` violations on all routes that render the fixed link, down from 1). No High or Critical issue was introduced. No regression occurred — application tests (130/130), TypeScript, lint, and build (308/308 pages, 45/45 routes) all pass; the full 8-viewport responsive re-check found 0 issues; Phase 8 and Phase 9.1–9.6 protections all hold, confirmed via an exactly one-file, one-line diff. One new, pre-existing, unrelated finding (two body-text links on `/privacy/` with the same class of defect) was discovered during the required legal-page accessibility scan and is explicitly not fixed, per this phase's one-finding scope — it is reported for separate authorization. This certifies only Phase 9.7's F-2 remediation; it does not constitute overall Stage 9 certification.
