# Phase 9.2 — Global Navigation & Information Architecture Remediation

**Date:** 2026-08-25
**Basis:** `docs/audits/phase-9.0-ux-information-hierarchy-audit.md`, `docs/audits/phase-9.0-ux-information-hierarchy-matrix.md`, `docs/audits/phase-9.1-critical-ux-remediation.md` — all read in full before any change. This phase addresses exactly one finding: H-2.

## Status

# PASS

## Finding Addressed

H-2

---

## Original Problem

`app/layout.tsx` (the root layout, rendered around every route in the application) unconditionally injected, between `{children}` and `<Footer />`:

1. **`<AllCalculatorsGrid />`** — the complete 45-calculator index, rendered as two sections: "Popular Calculators" (7 links) and "All Maritime Calculators" (the remaining 38 links).
2. **A hardcoded 4-link row** — Hull Speed, Rhumb Line Distance, Great Circle Distance, Initial Bearing.
3. **A second hardcoded 4-link row** — Navigation, Distance, Wind & Waves, Sailing (linking to the 4 calculator-cluster authority pages).

Because this rendered on *every* route — all 45 calculator pages, all cluster pages, the homepage, and all 8 legal/trust pages — the same handful of priority calculators ended up linked from five or more places on a single calculator page view (`CalculatorCategoryLinks`'s "Popular calculators" mention, `RelatedCalculators`, the global "Popular Calculators" section, the global "All Maritime Calculators" section, and the global hardcoded 4-link row), diluting the page's actual contextual navigation and adding 45+ irrelevant links beneath pages — like `/privacy/` or `/terms/` — that have no relationship to calculator content at all.

---

## Exact Changes

### `app/layout.tsx`
- Removed the `AllCalculatorsGrid` import and its `<div><AllCalculatorsGrid /></div>` usage.
- Removed both hardcoded 4-link rows (8 links total) in their entirety.
- Removed the now-unused `Link` import (`next/link`) — after the above removals, no other element in this file used it.
- **Preserved, unchanged:** `Header`, `main`, `Footer`, `OrganizationSchema`, `WebsiteSchema`, the AdSense `<script>` tag, all `metadata` exports, and both generic trust-copy `<p>` paragraphs ("OceanCalc is a precision-focused..." and "OceanCalc publishes maritime navigation calculators..."). These two paragraphs contain no links and are not part of the H-2 link-repetition problem — they were not named in the approved removal list (A/B) and were left untouched, consistent with the instruction not to address unrelated findings.

### `components/Footer.tsx`
- Confirmed, before editing, that no existing footer link pointed to `/tools/` (`footerLinks` contained only Privacy Policy, Terms, Disclaimer, Cookies, Affiliate Disclosure; the second row contained About, Contact, Editorial Policy, Privacy Policy again).
- Added exactly one entry to the existing `footerLinks` array: `{ href: "/tools/", label: "All Calculators" }`, using the array's existing shared styling (`hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200`) — no new component, no new styling, no new list.

### `components/AllCalculatorsGrid.tsx`
- **Not modified, not deleted.** Confirmed via repository-wide search that after this change it has zero remaining usages anywhere in the codebase — this is the expected, explicitly-authorized outcome ("the component remains valid as a reusable component and may continue to be used by `/tools/` or another intentional index page"). It was not wired into `/tools/` or anywhere else in this phase, since doing so was not part of the approved scope.

### `app/tools/page.tsx`
- **Not modified.** This page has always had its own independent calculator-listing implementation (a local `ToolCardList` function using `getCalculatorsWithPriorityFirst()`), entirely separate from `AllCalculatorsGrid`. It was never affected by the root-layout injection and required no change.

---

## Information Architecture Decision

**`/tools/` is the canonical comprehensive calculator index.** It retains its full H1, introductory copy, category quick-links, "Popular calculators" section, and "All maritime calculators" section — confirmed unchanged and unreduced (all 45 calculators still linked from it, verified programmatically).

**Calculator pages use contextual navigation rather than a global 45-item index.** `RelatedCalculators` (cluster-aware related links) and `CalculatorCategoryLinks` (category-aware "Explore more" section) remain fully intact on every calculator page and now stand as the page's actual navigation, no longer competing with a redundant global copy of the same information.

**Global discoverability is now exactly one intentional link** — "All Calculators" in the footer — rather than the full 45-entry index repeated on every page.

---

## SEO Boundary

No sitemap, metadata, canonical, robots, or URL architecture was changed. No URL was removed. No calculator page was removed. No calculator was orphaned — all 45 remain reachable from `/tools/`, and every calculator page retains its contextual `RelatedCalculators`/`CalculatorCategoryLinks` navigation. This phase reduces the number of *sitewide-repeated* internal links to calculator pages; per Phase 9.0's own acknowledgment, this carries a general SEO-adjacent tradeoff (fewer total internal link instances site-wide), which is noted here factually and is not claimed as an SEO improvement or degradation — no SEO measurement was performed, and none is claimed.

---

## Regression Verification

| Command | Result |
|---|---|
| `npm test` | **PASS** — 130 passed, 0 failed (identical to baseline — no formula touched) |
| `npx tsc --noEmit` | **PASS** — clean (confirms no dangling import from the `AllCalculatorsGrid`/`Link` removals) |
| `npm run lint` | **PASS** — "No ESLint warnings or errors" |
| `npm run build` (from-scratch, `rm -rf out .next` first) | **PASS** — compiled successfully |
| Static pages generated | **308/308** |
| Calculator routes generated | **45/45** |

---

## Content Verification

Inspected the generated static HTML for all six specified routes, plus repository-wide searches across the full `out/` build output:

| Check | Result |
|---|---|
| `<h2>Popular Calculators</h2>` / `<h2>All Maritime Calculators</h2>` (the `AllCalculatorsGrid` headings) anywhere in `out/` | **0 files** — confirmed removed everywhere |
| Exact removed priority-link anchor text (`>Rhumb Line<`, `>Bearing<`) anywhere in `out/` | **0 files** |
| `/index.html` (homepage) — no duplicate/new full calculator index introduced | Confirmed — homepage retains only its existing intentional sections (hero, category cards, `MostUsedMaritimeCalculators`, "Recently Updated," `ClusterHub`); no `AllCalculatorsGrid`-derived content present |
| `/tools/index.html` — full calculator index intact | Confirmed — "Popular calculators" and "All maritime calculators" (its own headings, distinct from and unaffected by the removed global component) both present; all 45 calculator slugs linked (programmatically verified, 45/45, zero orphaned) |
| `/tools/celsius-fahrenheit-converter/index.html`, `/tools/great-circle-distance-calculator/index.html` — no globally-injected full index | Confirmed absent; `CalculatorCategoryLinks` and `RelatedCalculators` both present and intact |
| `/privacy/index.html`, `/about/index.html` — no globally-injected full index | Confirmed absent; both pages now render only their own content plus `Header`/`Footer`/the two trust paragraphs — no calculator-related content bleeding in |
| "All Calculators" footer link present | Confirmed present on all six inspected routes (footer is global via `Header`/`Footer`, rendered by every page) |
| `href="/navigation-calculations/"` occurrences across all of `out/` | Exactly **2 files** (`out/index.html` via `ClusterHub`, `out/tools/index.html` via its own category quick-links) — both pre-existing, page-specific, and unrelated to the removed global row; confirms the link is no longer globally repeated |

Two additional checks were run to rule out false positives before concluding: "Wind & Waves" text still appears on every page — verified via context inspection to originate from `Header.tsx`'s main site navigation (unchanged, legitimate, and not part of this finding), not a remnant of the removed block.

---

## Scope Verification

**Files modified:** `app/layout.tsx`, `components/Footer.tsx` (this phase). `app/page.tsx`, `components/CalculatorLayout.tsx` (modified in Phase 9.1, carried forward unchanged in this phase). `components/affiliate/MarineToolsBlock.tsx` (deleted in Phase 9.1, carried forward).

**This phase's diff** (`app/layout.tsx` + `components/Footer.tsx` only): 2 files changed, 1 insertion, 57 deletions. Reviewed line-by-line via `git diff` before this report was written — every changed line is either a direct removal of the `AllCalculatorsGrid`/hardcoded-link content, the mechanically-required unused-import cleanup, or the one authorized footer-link addition. No unrelated line was found; nothing required reverting.

Explicitly confirmed:
- **No formulas changed.**
- **No calculation engine changed** — `lib/formulaParser.ts`, `lib/calculators/`, `components/calculator-engine/`, `components/calculator/` untouched.
- **No calculator data changed** — `data/calculators.json`, `data/calculators-phase5.json` untouched.
- **No AEO mappings changed** — `lib/aeo.ts`, `data/entities.json` untouched.
- **No AdSense configuration changed** — `lib/ads.ts` untouched; the AdSense `<script>` tag in `app/layout.tsx`'s `<head>` is untouched.
- **`ADS_ENABLED` remains `false`** — confirmed unchanged.
- **H-4 untouched** — the `/navigation/` vs. `/navigation-calculations/` naming collision was not addressed; both pages and all their existing cross-references are unchanged.
- **H-5 untouched** — model-disclosure placement was not addressed.
- **Other Phase 9 findings untouched** — M-1 through M-9, L-1 through L-4, I-1 through I-4 were not addressed. The one exception explicitly authorized by the brief (a "tiny mechanical cleanup... unavoidable because of the exact H-2 change") was the removal of the now-unused `Link` import in `app/layout.tsx`, which is not itself a Phase 9.0 finding but a direct, unavoidable consequence of this phase's approved edit.

---

## Certification

# PHASE 9.2 — PASS

H-2 is fully resolved: `AllCalculatorsGrid` and both hardcoded link rows no longer render from the root layout on any route; `/tools/` remains the complete, unreduced, canonical calculator index (45/45 calculators linked, zero orphaned); calculator pages retain their contextual `RelatedCalculators`/`CalculatorCategoryLinks` navigation; legal/trust pages no longer have an unrelated 45-calculator index injected beneath their content; global discoverability is preserved via exactly one new footer link. All regression checks pass. This certifies only the remediation of H-2 — it does not constitute overall UX certification. Findings H-4, H-5, and the full Medium/Low/Informational register from Phase 9.0 remain open for future phases.
