# Phase 9.3 — Navigation Architecture Reconciliation

**Date:** 2026-08-25
**Basis:** `docs/audits/phase-9.0-ux-information-hierarchy-audit.md`, `docs/audits/phase-9.0-ux-information-hierarchy-matrix.md`, `docs/audits/phase-9.1-critical-ux-remediation.md`, `docs/audits/phase-9.2-global-navigation-remediation.md` — all read in full before any change. This phase addresses exactly one finding: H-4. C-1, H-1, H-2, H-3 were not reopened.

## Status

# PASS

## H-4 Finding

Phase 9.0 identified that `/navigation/` and `/navigation-calculations/` occupy overlapping conceptual territory — both are labeled "Navigation" across various entry points (Header nav says "Navigation" → `/navigation/`; homepage `ClusterHub` and `/tools/` both say "Navigation" → `/navigation-calculations/`) — with **no existing link between the two pages in either direction**. A user landing on one had no way to discover the other existed, despite both being reachable from the site's primary navigation surfaces.

---

## Pre-Remediation Architecture

A full architectural trace was performed before any edit, per Workstream A.

| | `/navigation/` | `/navigation-calculations/` |
|---|---|---|
| **Source file** | `app/navigation/page.tsx` | `app/navigation-calculations/page.tsx` |
| **Page title (metadata)** | "Navigation Tools & Guides" | "Navigation Calculations" |
| **H1** | "Navigation Fundamentals" | "Navigation Calculations" |
| **Intro copy** | "Coastal and offshore navigation: position, course, distance, and time. Use our tools for passage planning and piloting." | "Navigation calculations include bearing, distance, and route computation methods used in maritime navigation. These tools help determine direction, position, and optimal paths across the Earth's surface." |
| **Primary user intent** | Learn navigation concepts via long-form articles | Find and use a navigation calculator directly |
| **Major content** | Card grid of navigation articles (from `getNavigationArticles()` / `data/navigation.json`, currently 2 articles: "Dead Reckoning Explained," "Distance to Horizon Explained") + a sidebar ("In this section") | Bare two-column list of the 14 calculators in `calculatorClusters.json`'s `navigation` array |
| **Calculator relationship** | `<PriorityCalculatorsStrip />` — 7 site-wide priority calculators (not navigation-specific) | Direct list of all 14 navigation-cluster calculators (topically exhaustive for the cluster) |
| **Educational/reference links** | Yes — its entire content is educational articles | None |
| **Breadcrumbs** | None | None |
| **Structured data / schema** | None | None |
| **Canonical URL** | `/navigation/` (self, via `buildSeoMetadata`) | `/navigation-calculations/` (self, via `buildSeoMetadata`) — independent, no conflict |
| **Redirects** | None | None |
| **Sitemap inclusion** | Yes (`app/sitemap.ts` line 34) | Yes (`app/sitemap.ts` line 64) |
| **Inbound links (user-facing, repository-wide search)** | `components/Header.tsx` (global nav, "Navigation"); `app/page.tsx` homepage `SECTIONS` card ("Navigation Fundamentals"); `components/CalculatorCategoryLinks.tsx` (for `category: "navigation"` calculators, "navigation articles" in the "Explore more" section) | `app/tools/page.tsx` (quick-links row, "Navigation"); `components/ClusterHub.tsx` (homepage, "Navigation Calculations") |
| **Outbound links (pre-remediation)** | To its own articles; to 7 priority calculators via `PriorityCalculatorsStrip` | To its 14 navigation-cluster calculators |
| **Cross-link to the other page** | **None** | **None** |

**WHAT IS THIS PAGE FOR? / WHO IS IT FOR? / WHAT SHOULD A USER DO HERE?** — answered per-page in the table above; in short, `/navigation/` is an educational-article hub, `/navigation-calculations/` is a calculator-discovery hub. These are demonstrably different content types serving different (if adjacent) intents, not two competing versions of the same page.

---

## Architectural Decision

The evidence supports a genuine two-layer hierarchy, not duplication:

**"Navigation is the broader information/resource layer; Navigation Calculators is the calculator-focused authority layer."**

This is not an assumption imposed on the content — it is what the actual repository content demonstrates: `/navigation/` renders long-form educational articles with a sidebar and only a generic (non-navigation-specific) taste of calculators via `PriorityCalculatorsStrip`; `/navigation-calculations/` renders nothing but the complete, topically-exhaustive list of the 14 calculators actually assigned to the `navigation` cluster in `data/calculatorClusters.json`. Neither page's content overlaps with the other's; neither is redundant. Both URLs, both pages, and both pieces of content were preserved unchanged — only the missing cross-links were added.

---

## Exact Changes

| File | Change |
|---|---|
| `app/navigation/page.tsx` | Added one paragraph containing one contextual link, placed immediately after `<PriorityCalculatorsStrip />` and before the articles grid: link text **"Navigation Calculators"**, destination `/navigation-calculations/`. 10 lines added, 0 removed. |
| `app/navigation-calculations/page.tsx` | Added one paragraph containing one contextual link, placed immediately after the existing intro paragraph and before the calculator list: link text **"Navigation Resources"**, destination `/navigation/`. 10 lines added, 0 removed. |

No other file was modified in this phase. `Link` was already imported in both files (used by their existing content), so no import changes were required.

---

## Link Relationship

```
/navigation/                → "Navigation Calculators" → /navigation-calculations/
/navigation-calculations/   → "Navigation Resources"    → /navigation/
```

Both labels are the exact labels specified in the brief. Neither page contains more than one new contextual relationship link in each direction (verified programmatically — see Static Output Verification below). Both links use standard Next.js `<Link>` elements (real `<a href>` in the rendered output), descriptive text, no `href="#"`, no JavaScript-driven navigation — satisfying Workstream K's accessibility requirement without introducing any new interactive component.

---

## M-8

# DEFERRED

M-8 concerns all four calculator-cluster authority pages (`/navigation-calculations/`, `/distance-measurement-calculators/`, `/wind-wave-calculators/`, `/sailing-performance-calculators/`) sharing the same minimal template: naive `.replaceAll("-", " ")` slug-to-label rendering (no title-casing), no card styling, no per-link description, no sibling-cluster navigation. This was re-inspected in this phase (Workstream J) and confirmed still accurate: all four pages use the identical template, each pulls a distinct, non-overlapping `calculatorClusters.json` key, and each has a clear, differentiated title — they are **not** duplicates of one another, and none of the four is more or less legitimate than the others.

This is a content/presentation-quality issue affecting all four cluster pages uniformly — it is not specific to the `/navigation/` vs. `/navigation-calculations/` relationship, and fixing it would require touching all four sibling page files identically, which is outside a targeted H-4 fix. Per the explicit instruction not to use H-4 as an excuse to redesign the cluster system, M-8 is deferred to a future, separately-scoped content/presentation phase covering all four cluster pages together. The one change this phase *did* make to `/navigation-calculations/` (the single "Navigation Resources" link) was mechanically required by H-4 specifically and is documented as such — it is not an M-8 fix and was not extended to the other three cluster pages, which have no equivalent naming-collision problem to resolve.

---

## SEO Boundary

- **Canonical URLs:** not changed.
- **Sitemap:** not changed — both routes were already present in `app/sitemap.ts` and remain so, unmodified.
- **Metadata:** not changed — both pages' `buildSeoMetadata()` calls (title, description, path) are unmodified.
- **Robots:** not changed.
- **Redirects:** not changed — none existed before, none were added.

No SEO improvement is claimed. This phase added two internal cross-links for information-hierarchy clarity; no SEO measurement was performed and none is asserted.

---

## Regression Verification

| Command | Result |
|---|---|
| `npm test` | **PASS** — 130 passed, 0 failed |
| `npx tsc --noEmit` | **PASS** — clean |
| `npm run lint` | **PASS** — "No ESLint warnings or errors" |
| `npm run build` (from-scratch, `rm -rf out .next` first) | **PASS** — compiled successfully |
| Static pages generated | **308/308** |
| Calculator routes generated | **45/45** |

---

## Static Output Verification

All ten required checks performed against the built output:

| # | Check | Result |
|---|---|---|
| 1 | `out/navigation/index.html` exists | ✓ |
| 2 | `out/navigation-calculations/index.html` exists | ✓ |
| 3 | `/navigation/` contains a contextual link to `/navigation-calculations/` | ✓ — `<a href="/navigation-calculations/">Navigation Calculators</a>` |
| 4 | `/navigation-calculations/` contains a contextual link to `/navigation/` | ✓ — `<a href="/navigation/">Navigation Resources</a>` |
| 5 | No duplicate relationship links | ✓ — exactly 1 new contextual link per direction; a second `href="/navigation/"` match on `/navigation-calculations/` is the pre-existing, unmodified global `Header` nav item ("Navigation"), present on every page site-wide, not a new duplicate |
| 6 | Calculator cluster links remain intact | ✓ — all 14 `navigation`-cluster calculators (from `data/calculatorClusters.json`) confirmed linked from `/navigation-calculations/`, zero missing |
| 7 | Homepage's existing "Navigation Calculations" `ClusterHub` link intact | ✓ — unchanged, still points to `/navigation-calculations/` |
| 8 | `/tools/` still uses the existing navigation-calculator architecture | ✓ — its quick-links row still links to `/navigation-calculations/`, unchanged |
| 9 | No global calculator index has returned | ✓ — zero occurrences of the `AllCalculatorsGrid` headings anywhere in `out/` (Phase 9.2's fix confirmed still holding) |
| 10 | No unrelated calculator links introduced | ✓ — `/navigation/` still shows exactly 7 calculator links (from the unmodified `PriorityCalculatorsStrip`), same as before this phase |

---

## Repository-Wide Link Audit

User-facing inbound links only (sitemap/canonical references excluded per instruction):

**`/navigation/`:**
- `components/Header.tsx` — global site navigation ("Navigation")
- `app/page.tsx` — homepage `SECTIONS` card ("Navigation Fundamentals")
- `components/CalculatorCategoryLinks.tsx` — "Explore more" section on every `category: "navigation"` calculator page ("navigation articles")
- `app/navigation-calculations/page.tsx` — **new**, this phase ("Navigation Resources")

**`/navigation-calculations/`:**
- `app/tools/page.tsx` — quick-links row ("Navigation")
- `components/ClusterHub.tsx` — homepage cluster grid ("Navigation Calculations")
- `app/navigation/page.tsx` — **new**, this phase ("Navigation Calculators")

**Sitemap references** (not counted as user-facing navigation): both routes listed in `app/sitemap.ts`, unmodified.

**Canonical references** (not counted as user-facing navigation): each page's own self-referential canonical via `buildSeoMetadata`, unmodified.

**Structured-data references:** none on either page.

No unrelated or duplicate inbound link was found or introduced.

---

## Scope Verification

Confirmed via `git diff` (full line-by-line review): only `app/navigation/page.tsx` and `app/navigation-calculations/page.tsx` were touched in this phase, 20 total lines added, 0 removed, 0 modified elsewhere. No calculator formula, calculation engine, calculator data, AEO entity mapping, AdSense configuration, or `ADS_ENABLED` was touched. The global-calculator-navigation fix from Phase 9.2 and the C-1/H-1/H-3 fixes from Phase 9.1 remain exactly as those phases left them — confirmed unchanged by this phase's diff and reconfirmed in the Static Output Verification above (check #9).

---

## Certification

# PHASE 9.3 — PASS

H-4 is resolved: the two pages are confirmed, from actual repository evidence, to represent a genuine two-layer information architecture (educational resources vs. calculator authority) rather than duplication or ambiguity, and each now provides a single, clearly-labeled, contextual path to the other. All regression and static-output checks pass. This certifies only H-4 remediation (and the explicitly-documented DEFERRED status of M-8, which was evaluated but intentionally not remediated in this phase). It does not constitute overall UX certification. H-5 and the remaining Medium/Low/Informational findings from Phase 9.0 remain open for future phases.
