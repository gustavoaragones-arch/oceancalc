# Phase 9.6 — Responsive & Visual UX Certification

**Date:** 2026-08-27
**Basis:** `docs/audits/phase-9.0-ux-information-hierarchy-audit.md`, `phase-9.0-ux-information-hierarchy-matrix.md`, `phase-9.1-critical-ux-remediation.md`, `phase-9.2-global-navigation-remediation.md`, `phase-9.3-navigation-architecture-remediation.md`, `phase-9.4-contextual-information-hierarchy-model-disclosure.md`, `phase-9.5-calculator-cluster-authority-ux.md`, `phase-9-pre-9.6-ad-placeholder-cleanup.md` — all read in full before this audit began. Repository HEAD at audit start: `c4f3ed50131619acbd0185549d958340c24887aa` (confirmed via `git rev-parse HEAD`, matching the expected pre-9.6 baseline).

## Status

# PASS

---

## Objective

Determine, using actual rendered browser evidence rather than source/CSS inference, whether OceanCalc's real production application provides a professional, responsive, readable, usable experience across desktop, tablet, and mobile — closing the evidence gap Phase 9.0 explicitly flagged ("visual/mobile conclusions were inferred... because browser/screenshot verification was unavailable"). Audit first; remediate only objectively verified High/Critical defects with the smallest possible change.

---

## Methodology

- **Browser tool:** Playwright 1.62.1, driving the system-installed Google Chrome (`channel: 'chrome'`) in headless mode — no bundled-Chromium install was available for this machine's OS (`Error: Playwright does not support chromium on mac12`), so the real, currently-installed Chrome browser was used instead via CDP. This is genuine rendered-browser verification, not source inference.
- **Target:** the live production site, `https://oceancalc.com` (confirmed reachable, HTTP 200, and confirmed to reflect the current committed HEAD by spot-checking Phase 9.5 content — `Explore Related Calculator Categories` and `Wind &amp; Wave Calculators` both present on `/navigation-calculations/`). Testing the live production app is the strongest available evidence of "what a real user sees," including genuine Google Auto Ads behavior.
- **Ad-network requests** (`googlesyndication`, `doubleclick`, `google-analytics`, `googletagmanager`, `adsbygoogle`) were blocked during the bulk automated pass only — these third-party requests were found to prevent Playwright's `networkidle` wait from ever resolving (ads/analytics keep polling indefinitely), which is a testing-tool artifact, not a site defect. All bulk pass/fail measurements use `waitUntil: 'load'` plus a fixed settle delay instead. A **separate, unblocked** pass (see "AdSense Separation" below) was run specifically to observe real Google Auto Ads behavior.
- **Viewports tested (all 8 required, exact dimensions):** Desktop 1440×900, 1280×800; Tablet 1024×1366, 768×1024; Mobile 430×932, 390×844, 375×812, 320×800.
- **Automated checks per route/viewport:** `document.documentElement.scrollWidth` vs. `clientWidth` (horizontal overflow), first `<h1>`/`<header>`/`<footer>`/first calculator form-or-card bounding boxes (information-hierarchy/scroll-depth measurement), and — where overflow was detected — enumeration of the specific overflowing elements. 144 total route×viewport combinations were captured with zero script errors.
- **Full-page screenshots** captured for every route at 3 representative viewports (desktop-1440×900, tablet-768×1024, mobile-390×844) plus all 8 viewports for 3 deep-dive routes (`/`, `/tools/great-circle-distance-calculator/`, `/tools/nautical-mile-converter/`) — 69 screenshots total, stored outside the repository (session scratchpad, not committed; see Evidence Limitations).
- **Targeted element screenshots** for the header (7 widths) and for a 4-input calculator's form (`great-circle-distance-calculator`, 5 widths spanning the `sm:` 640px breakpoint) to directly inspect Phase 9.0's inferred mobile-cramping risk.
- **Automated accessibility scan:** axe-core 4.x (`wcag2a`, `wcag2aa` rule sets) injected and run against 5 representative pages × 2 viewports (desktop-1440×900, mobile-390×844) = 10 scans.
- **Touch/interaction tests:** mobile-viewport (390×844, `hasTouch: true`, `isMobile: true`) test of (a) locating a mobile nav toggle, (b) a complete calculator interaction on `nautical-mile-converter` (tap input, type a value, confirm the live result updates, re-check overflow before/after), (c) tapping a cluster sibling-navigation link and confirming real navigation occurred.
- **Remediation verification:** after the one fix described below, the full local production build (`out/`) was served locally (`python3 -m http.server`) and the complete 18-route × 8-viewport automated check (144 combinations) was re-run against the fixed local build to confirm the defect was resolved everywhere with no new regressions, before any conclusion was drawn.

---

## Evidence Limitations

- No bundled Playwright Chromium could be installed on this machine's OS version; the system's installed Google Chrome was used via Playwright's `channel: 'chrome'` instead. This is real rendered-browser evidence, not a degraded fallback, but it is Chrome/Chromium-family only — no WebKit/Firefox-engine rendering was verified in this phase.
- Live Google Auto Ads creative could not be observed filled during testing — every `<ins class="adsbygoogle">` slot encountered had `data-ad-status="unfilled"` (see AdSense Separation below). This does not affect the OceanCalc UI findings, but it means no "filled ad creative" visual was verified.
- Screenshots and raw JSON evidence (144-record dataset, axe-core results, interaction-test results, header/form crops) are stored in the session scratchpad directory, not the repository, per instruction not to commit large binary screenshot collections and because the repository has no existing screenshot/audit-asset convention. This document records the exact commands, counts, and measured values that constitute the evidence; the images themselves are not committed.
- Full 8-viewport screenshots were captured for 3 deep-dive routes only; the remaining 15 routes were screenshotted at 3 representative viewports (one per desktop/tablet/mobile bucket). All 18 routes were still measured programmatically (overflow, header/nav position) at all 8 viewports — the screenshot subset is a visual-evidence sampling decision, not a measurement gap.

---

## Route Coverage

**18 routes tested** (13 required + 5 additional, programmatically selected to cover all 5 calculator categories not already hit by the required set):

| # | Route | Type |
|---|---|---|
| 1 | `/` | Homepage |
| 2 | `/tools/` | Calculator index |
| 3 | `/tools/great-circle-distance-calculator/` | Calculator — navigation, 4-input |
| 4 | `/tools/wave-height-calculator/` | Calculator — wind-waves |
| 5 | `/tools/nautical-mile-converter/` | Calculator — maritime-measurements, conversion |
| 6 | `/tools/true-magnetic-heading-calculator/` | Calculator — navigation |
| 7 | `/navigation/` | Topic hub |
| 8 | `/navigation-calculations/` | Cluster authority page |
| 9 | `/distance-measurement-calculators/` | Cluster authority page |
| 10 | `/wind-wave-calculators/` | Cluster authority page |
| 11 | `/sailing-performance-calculators/` | Cluster authority page |
| 12 | `/about/` | Legal/trust |
| 13 | `/privacy/` | Legal/trust |
| 14 | `/tools/distance-to-horizon-calculator/` | Calculator — navigation (additional) |
| 15 | `/tools/knots-speed-converter/` | Calculator — maritime-measurements (additional) |
| 16 | `/tools/beaufort-scale-calculator/` | Calculator — wind-waves (additional) |
| 17 | `/tools/anchor-scope-calculator/` | Calculator — sailing-performance (additional) |
| 18 | `/tools/statute-nautical-mile-converter/` | Calculator — conversions (additional) |

**9 calculator routes sampled total**, covering all 5 calculator categories in `data/calculatorClusters.json` (navigation ×3, maritime-measurements ×2, wind-waves ×2, sailing-performance ×1, conversions ×1), including a short single-input converter, a 4-input geographic calculator, and a calculator with a longer generated-content section (`great-circle-distance-calculator`, ~6,700px document height).

**Viewport coverage:** all 8 required viewports × all 18 routes = **144 combinations**, 0 script errors, 0 skipped.

---

## Responsive Matrix

Full per-route, per-viewport horizontal-overflow result (the definitive `scrollWidth` vs. `clientWidth` check, all 144 combinations, production, pre-fix):

**Horizontal overflow: 0 of 144 combinations.** No route, at any of the 8 required viewports (320px through 1440px), produced `document.documentElement.scrollWidth > clientWidth`. This directly contradicts the plausible-but-unverified risk Phase 9.0 could not check; it is now RENDERED VERIFIED clean.

Per-route hierarchy/scroll-depth measurements (mobile 390×844 vs. desktop 1440×900; "calc_top" = first `<form>` or `.card` element's vertical offset from page top):

| Route | H1 top (mobile) | Primary content top (mobile) | Primary content top (desktop) | Within first mobile screen (844px)? |
|---|---:|---:|---:|---|
| `/` | 129px | 541px (first category card) | 544px | Yes |
| `/tools/` | 297px | 562px (first calculator card) | 452px | Yes |
| `/tools/great-circle-distance-calculator/` | 161px | 518px (input form) | 372px | Yes |
| `/tools/wave-height-calculator/` | 141px | 469px (input form) | 372px | Yes |
| `/tools/nautical-mile-converter/` | 141px | 469px (input form) | 372px | Yes |
| `/tools/true-magnetic-heading-calculator/` | 141px | 440px (input form) | 342px | Yes |
| `/navigation/` | 97px | 317px | 256px | Yes |
| `/navigation-calculations/` | 105px | 332px (calculator cards) | 267px | Yes |
| `/distance-measurement-calculators/` | 105px | 323px | 223px | Yes |
| `/wind-wave-calculators/` | 105px | 291px | 223px | Yes |
| `/sailing-performance-calculators/` | 105px | 291px | 223px | Yes |
| `/about/` | 113px | n/a (no form/card) | n/a | n/a |
| `/privacy/` | 113px | n/a (no form/card) | n/a | n/a |
| `/tools/distance-to-horizon-calculator/` | 141px | 469px | 372px | Yes |
| `/tools/knots-speed-converter/` | 141px | 498px | 372px | Yes |
| `/tools/beaufort-scale-calculator/` | 141px | 469px | 372px | Yes |
| `/tools/anchor-scope-calculator/` | 141px | 469px | 372px | Yes |
| `/tools/statute-nautical-mile-converter/` | 161px | 500px | 390px | Yes |

Every calculator's input form begins well within the first mobile screen (all under 541px on an 844px-tall viewport); every H1 begins under 300px from the top. Per criterion #3 (Hero/top-of-page), the primary task is reachable without excessive scrolling on every tested route, at every tested breakpoint — RENDERED VERIFIED, not inferred.

**Navigation/header (this is where the one Critical finding was found — see below):** header height, nav-link position, and overlap-with-content were measured precisely at all 8 widths on the homepage and cross-checked on 2 additional routes; results and remediation are documented under Findings/F-1.

**Multi-input calculator cramping** (Phase 9.0's inferred risk, `great-circle-distance-calculator`'s 4-input `grid grid-cols-1 sm:grid-cols-2` layout, screenshotted at the exact `sm:` breakpoint and below — 768px, 640px, 430px, 375px, 320px): clean at every width. At 640px (the 2-column threshold), labels and inputs have full-width fields with clear spacing, no overlap, no truncation. At 320px (1-column), each input is full-width and readable. **This specific Phase 9.0 "inferred risk" is now RENDERED VERIFIED as not a defect.**

**Formula code block** (`components/calculator-engine/FormulaRenderer.tsx`): renders inside a `<code>` element with `overflow-x-auto` — a long formula string scrolls locally within its own bounded box rather than the page, which is the correct, accessible pattern for this content and is not counted as a defect (confirmed this does not contribute to any of the 0 document-level overflow results).

---

## Findings

### F-1 — Header navigation overlaps and partially hides itself on mobile and tablet viewports

- **ID:** F-1
- **Severity:** CRITICAL
- **Route(s):** global (every route — `Header` renders on all pages via `app/layout.tsx`); directly confirmed on `/`, `/tools/great-circle-distance-calculator/`, `/navigation-calculations/`.
- **Viewport(s):** severe at 430×932, 390×844, 375×812, 320×800 (all 4 required mobile viewports); a milder version present at 768×1024 (tablet); not present at 1024×1366, 1280×800, 1440×900.
- **Evidence type:** RENDERED VERIFIED (screenshot + precise `getBoundingClientRect()` measurement of every nav link, before and after remediation).
- **Root cause:** `components/Header.tsx` line 17 — the header's inner flex row used a **fixed** height utility, `h-16` (64px), while its `<nav>` (`components/Header.tsx` line 28) uses `flex-wrap` for its 7 nav items (`Home`, `Calculators`, `Knots`, `Navigation`, `Wind & Waves`, `Measurements`, `Sailing`). At any width where the 7 items don't fit on one line, they wrap onto additional rows — but the parent container does not grow to accommodate them (fixed height, not minimum height), so `items-center` vertically centers the now-taller wrapped content around the fixed 64px box, pushing rows both above and below its visible bounds.
- **Measured impact (production, before fix):**
  - At 430/390/375px: 3 of 7 links (`Home`, `Calculators`, `Knots`) rendered with `top: -24px` — entirely above `y=0`, i.e., above the top of the viewport and permanently unreachable (the page is already scrolled to the top; there is no way to scroll further up to reveal them). 2 more links (`Measurements`, `Sailing`) rendered with `bottom: 88px`, 23px below the header's own 65px-tall box — visually overlapping directly onto the hero section content beneath the header.
  - At 320px: worse — 4 wrapped rows. `Home`/`Calculators` at `top: -62px` to `bottom: -26px` (fully invisible). `Sailing` at `top: 90px`/`bottom: 126px` — 61px below the header's bottom edge, deep into the hero/H1 area.
  - At 768px (tablet): milder — only `Sailing` wraps to a second row, `bottom: 70px`, 5px below the header's 65px box. A minor overlap, not links-invisible.
  - Screenshot evidence (mobile 390px, before fix): only "Navigation" and "Wind & Waves" appear inside the header's visible band; "Measurements" and "Sailing" appear detached, floating over the light-blue hero background, directly above the H1 "Maritime Calculators & Navigation Tools."
- **User impact:** on every common phone width tested (which represents the majority of real-world mobile traffic), 2–3 of the site's 7 primary navigation destinations (`Home`, `Calculators`, `Knots`) are completely inaccessible by any means — not just visually awkward, but functionally unreachable via the header nav. The remaining wrapped items visually collide with the hero/page content, which reads as a broken layout on first paint of every page, on every mobile device, site-wide.
- **Recommendation:** change the header's fixed-height utility to a minimum-height utility, so the container grows to fit wrapped content instead of clipping/overlapping it.
- **Status:** **FIXED** this phase.

**Exact remediation:** `components/Header.tsx` line 17, `h-16` → `min-h-16` (Tailwind: `height: 4rem` → `min-height: 4rem`). One class-name change, one line, no new component, no new breakpoint, no new abstraction — uses the existing Tailwind utility scale exactly per the "prefer existing utility classes" remediation rule. `container-wide` (the only other class on that element) sets only `max-width`/`margin`/`padding`, confirmed via `app/globals.css`, so it contributes no conflicting height constraint. No other file in the repository references `h-16`, a hardcoded `64`px offset, or any `scroll-margin`/`scroll-mt` value tied to the header's height (repository-wide grep, zero other matches), so this change has no secondary dependency to break.

**Post-fix verification (local production build, `out/`, served locally, same 144-combination sweep re-run):**

| Width | Header height (post-fix) | Any link above viewport? | Any link overlapping content below header? | Horizontal overflow? |
|---:|---:|---|---|---|
| 1440 | 65px (unchanged) | No | No | No |
| 1280 | 65px (unchanged) | No | No | No |
| 1024 | 65px (unchanged) | No | No | No |
| 768 | 77px (grows to fit 2nd row) | No | No | No |
| 430 | 113px (grows to fit 3 rows) | No | No | No |
| 390 | 113px | No | No | No |
| 375 | 113px | No | No | No |
| 320 | 189px (grows to fit 4 rows) | No | No | No |

Desktop is byte-for-byte visually unchanged (screenshot-confirmed, single row, 65px, identical to pre-fix). All 7 nav links are now visible and fully within the header's own bounds at every width, with zero overlap onto page content and zero new horizontal overflow anywhere. The full 18-route × 8-viewport (144-combination) automated re-check against the fixed local build reports **0 issues** (0 overflow, 0 above-viewport links, 0 below-header-box links) across every route, not just the homepage.

---

### F-2 — Footer credit-line link is distinguishable only by color

- **ID:** F-2
- **Severity:** MEDIUM
- **Route(s):** global (`Footer` renders on every route).
- **Viewport(s):** identical at all 8 (not a responsive/breakpoint-driven issue — a static color-contrast/style issue).
- **Evidence type:** AUTOMATED VERIFIED (axe-core `link-in-text-block` rule, "serious" impact per axe's own severity scale; confirmed present in all 10 of 10 scans: 5 representative pages × 2 viewports).
- **Root cause:** `components/Footer.tsx` line 50–54 — the "Developed and operated by {org name}" credit link is styled `text-gray-600 ... hover:text-blue-600 ... hover:underline` — no underline, bold, or icon in its default (non-hover) state, only a subtle color shift from the surrounding `text-gray-500` paragraph text. A user who cannot perceive that color difference (or is scanning quickly) has no non-color cue that this word is a link, inside a sentence of otherwise-plain text.
- **User impact:** low-severity — this is a single, low-traffic credit link at the very bottom of every page (not a primary task element), but it is a genuine, repeatable WCAG 2.1 AA gap present site-wide.
- **Recommendation:** add a non-color distinguishing cue (e.g., a default-state underline) to this specific link.
- **Status:** **NOT FIXED.** Per the phase's explicit rule ("If there are MEDIUM defects: Do not automatically fix them... unless clearly required to resolve a High/Critical issue"), and because `Footer` architecture is on the protected-unless-required list and this finding is unrelated to F-1's fix, this is reported for separate authorization rather than remediated in this phase.

No other automated accessibility violations were found: axe-core's `wcag2a`/`wcag2aa` rule sets returned exactly one violation type (`link-in-text-block`, F-2 above) across all 10 scans, with 0 other violations on the homepage, `/tools/`, `great-circle-distance-calculator`, `nautical-mile-converter`, or `navigation-calculations` at either desktop or mobile viewport. Form labels, live-region result announcements, and focus-visible states were spot-checked manually against source (`InputField` `htmlFor`/`id` association, `ResultDisplay`'s `role="region" aria-live="polite"`, `.input-field`'s `focus:ring-2`) and found unchanged from Phase 9.0's prior confirmation — no new accessibility defect was introduced or found in these areas.

---

## Non-Findings Worth Recording (per instruction not to silently discard evidence)

- **Multi-input calculator layout at the `sm:` 2-column breakpoint** — Phase 9.0 flagged this as an *inferred* risk ("cramping at the narrow end of that range... not verified visually"). RENDERED VERIFIED this phase, at the exact breakpoint (640px) and below, on the site's most input-dense calculator: no cramping, clean spacing, fully readable. This Phase 9.0 risk is resolved as a non-issue.
- **No mobile hamburger/nav-toggle exists** — confirmed via direct DOM query (no `button`/`role="button"`/`aria-label*="menu"` inside `header`). This is not treated as a separate finding: the site's mobile nav pattern is "always-visible, wrapping" rather than "collapsed behind a toggle," and F-1's fix makes that always-visible pattern fully functional (no toggle is required for it to work correctly). Introducing a hamburger-menu component would be a larger architectural change than this phase's scope calls for, and was not needed once the wrapping-clip defect itself was fixed.
- **Calculator interaction is fully functional on mobile** — `nautical-mile-converter` at 390×844: typing "42" into the input correctly updated the live result from "1.852 km" (1 nm default) to "77.784 km" (42 × 1.852), with zero horizontal-overflow change before/after the interaction. RENDERED VERIFIED, real touch-emulated tap and type, not a source-code assumption.
- **Cluster sibling-navigation links are tappable and functional** — tapping the "Distance & Measurement Calculators" link on `/navigation-calculations/` (mobile viewport) correctly navigated to `/distance-measurement-calculators/`.
- **Legal-page text density** (`/privacy/`) is appropriately narrow-column and readable at 390px — no excessively long lines, adequate line-height, headings clearly distinguishable from body text.

---

## AdSense Separation

**OceanCalc UI:** confirmed, both by direct HTML search and by screenshot, that no "Ad slot — ..." placeholder text or dashed-border placeholder box exists anywhere in the current build or on production — the Phase 9 pre-9.6 ad-placeholder cleanup (`docs/audits/phase-9-pre-9.6-ad-placeholder-cleanup.md`) remains fully intact. `git diff --stat -- components/ads/AdPlaceholder.tsx lib/ads.ts` for this phase shows **no changes** to either file.

**Google Auto Ads (external, informational only):** a separate, unblocked check against production confirmed Google Auto Ads is actively present on the live site — `<ins class="adsbygoogle">` elements and Google ad iframes were observed on both the homepage and `great-circle-distance-calculator`. Specific observations:

- `great-circle-distance-calculator` (390×844): one ad slot reserved at `top: 929px`, `390×208px`, `data-ad-format="auto"`, `data-ad-status="unfilled"`.
- `great-circle-distance-calculator` (1440×900): one ad slot reserved at `top: 616px`, `654×280px`, same format/status.
- Homepage (both widths): one slot present but collapsed to `0×0` (`data-ad-status="unfilled"`).

Every observed slot reported `data-ad-status="unfilled"` — no actual ad creative rendered during this session's testing (Google's ad-serving decision, not something this repository controls). Where a slot did reserve space (the calculator page), it was positioned in normal document flow, contributed no horizontal overflow, and did not overlap any OceanCalc content. **This is external Google ad-serving behavior, not part of this phase's application remediation, and no AdSense/Auto Ads configuration, script, publisher ID, or `ads.txt` was inspected for correctness beyond confirming it renders without breaking layout.** No AdSense settings were changed. This section documents observed behavior only, per the phase's explicit instruction to separate the two systems rather than silently patch OceanCalc around Google's ad placement.

---

## Phase 8 Protection

`lib/formulaParser.ts`, `data/calculators.json`, `data/calculators-phase5.json` — confirmed unmodified (`git diff --stat`, no output). `npm test`'s 130-assertion suite (which includes a full parse-and-evaluate pass of every calculator formula, including the certified radar-horizon, wave-height, and heading-normalization corrections) passed 130/130, identical to the pre-phase baseline. No numerical logic was touched.

## Phase 9 Protection

Re-verified against current source and this phase's `git diff` (which touches exactly one file, `components/Header.tsx`):

- **9.1:** `components/affiliate/MarineToolsBlock.tsx` remains deleted; no "Related Navigation Calculations"/"When to Use This Calculation" text in `CalculatorLayout.tsx`; no duplicate homepage "Most Used" section. Untouched this phase.
- **9.2:** no `AllCalculatorsGrid` reference in `app/layout.tsx`; Footer's "All Calculators" link intact. Untouched this phase (Footer.tsx has zero diff).
- **9.3:** `/navigation/` ↔ `/navigation-calculations/` cross-links ("Navigation Calculators", "Navigation Resources") both confirmed present, unchanged.
- **9.4:** Great Circle's result-adjacent spherical-Earth disclosure confirmed present and unmoved on `/tools/great-circle-distance-calculator/`.
- **9.5:** all 4 cluster-authority pages retain their exact H1s, exact intro paragraphs, canonical calculator titles (via `ClusterCalculatorList`), sibling-navigation blocks, and "View All Maritime Calculators" links — confirmed both by screenshot (`/navigation-calculations/`) and unchanged `git diff --stat` on all 5 Phase 9.5 files.
- **Pre-9.6:** no visible `AdPlaceholder` UI — confirmed above under AdSense Separation.

---

## Regression

| Command | Result |
|---|---|
| `npm test` | **PASS** — 130 passed, 0 failed |
| `npx tsc --noEmit` | **PASS** — clean |
| `npm run lint` | **PASS** — "No ESLint warnings or errors" |
| `npm run build` (from-scratch, `rm -rf out .next` first) | **PASS** — compiled successfully |
| Static pages generated | **308/308** |
| Calculator routes generated | **45/45** (`out/tools/` — 46 directories = 45 calculators + the index page itself) |

**Browser verification (post-fix):** full local build served locally and re-tested across all 18 routes × 8 viewports (144 combinations) — 0 horizontal-overflow issues, 0 nav-link-above-viewport issues, 0 nav-link-overlapping-content issues. Desktop header screenshot-confirmed pixel-identical to pre-fix (65px, single row, no visual change at 1024px and above).

---

## Remediation

**One file changed:** `components/Header.tsx` — 1 line, 1 insertion, 1 deletion (`git diff --stat`).

```diff
-      <div className="container-wide flex items-center justify-between h-16">
+      <div className="container-wide flex items-center justify-between min-h-16">
```

**Why necessary:** this directly resolves F-1 (CRITICAL) — the only High/Critical finding this audit identified. Without it, the site's global primary navigation is functionally broken (3 of 7 links unreachable) on the majority of real-world mobile phone widths, on every page of the site.

**Why this specific change and no more:** it is the minimal, root-cause fix — a single Tailwind utility swap (fixed height → minimum height) using the existing utility scale, touching no other file, introducing no new component, breakpoint, or abstraction, and verified to leave desktop/tablet-1024+ rendering byte-for-byte unchanged.

No other file was changed. No CSS framework, component library, animation, image asset, or design system was introduced.

---

## Remaining Findings

- **F-2 (MEDIUM)** — Footer credit-line link distinguishable only by color (`components/Footer.tsx` line 54, axe-core `link-in-text-block`). Documented above; not fixed this phase; awaiting separate authorization, since it is unrelated to F-1 and Footer architecture is otherwise protected.
- No LOW or INFORMATIONAL responsive/visual findings were identified beyond the "Non-Findings Worth Recording" section above, which documents confirmed-clean areas rather than defects.
- This audit did not re-open or re-score any Phase 9.0 Medium/Low/Informational finding outside this phase's responsive/visual scope (M-1 through M-9 except M-8 [resolved in 9.5], L-1 through L-4, I-1 through I-4 remain exactly as Phase 9.0–9.5 left them, unaddressed by this phase).

---

## Certification Decision

# PHASE 9.6 — PASS

One Critical, rendered-verified, site-wide responsive defect (F-1: header navigation overlapping/hiding itself on mobile and tablet) was identified through actual browser rendering — closing the exact evidence gap Phase 9.0 flagged — and was remediated with the smallest possible change (one Tailwind utility swap, one file, one line), independently re-verified across all 18 routes and all 8 required viewports with zero remaining issues and zero regressions. One Medium accessibility finding (F-2) was identified, documented, and correctly left unfixed pending separate authorization per the phase's remediation-gate rules. All regression, Phase 8, and Phase 9.1–9.5 protections hold. This certifies only Phase 9.6's responsive/visual scope — it does not constitute overall Stage 9 certification; F-2 and the pre-existing Medium/Low/Informational register from Phase 9.0 remain open for future phases.
