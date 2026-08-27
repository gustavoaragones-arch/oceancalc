# Phase 9.1 — Critical UX Remediation

**Date:** 2026-08-25
**Basis:** `docs/audits/phase-9.0-ux-information-hierarchy-audit.md`, `docs/audits/phase-9.0-ux-information-hierarchy-matrix.md` — both read in full before any change. This phase addresses exactly three findings from that audit: C-1, H-3, H-1. No other finding was addressed.

## Status

# PASS

---

## Findings Addressed

### C-1 — Calculator-irrelevant hardcoded content on all 45 calculator pages

**Original problem:** `components/CalculatorLayout.tsx` unconditionally rendered three navigation-specific blocks on every calculator page regardless of the calculator's actual category — confirmed live in Phase 9.0 on `celsius-fahrenheit-converter` (a temperature converter), which showed users a "Related Navigation Calculations" block linking to bearing/cross-track-error tools and a "When to Use This Calculation" list about route planning.

**Exact change made** (`components/CalculatorLayout.tsx`):
1. Removed the generic blue callout section: `"Use this calculation together with proper navigation tools to improve route accuracy and on-water decision making."` (previously between the ad placeholder and `AnswerBlock`).
2. Removed the hardcoded "Related Navigation Calculations" section — a static `<h2>` plus 6 hardcoded links to hull-speed, rhumb-distance, initial-bearing, distance-to-horizon, cross-track-error, and speed-over-ground calculators (previously between the FAQ and the mid-content ad placeholder).
3. Removed the hardcoded "When to Use This Calculation" section — a static `<h2>` plus 4 fixed bullet points about navigation route planning (previously between "Explore Related Calculation Categories" and `CalculatorCategoryLinks`).

No replacement content was added for any of the three. No conditional (`if category === "navigation"`) logic was introduced.

**Affected routes:** all 45 `/tools/[slug]/` pages and their variant routes (single shared component).

**Why this resolves the finding:** the three removed blocks were the entire source of the C-1 defect — static content asserting every calculator is about navigation. Removing them (rather than conditionally gating them) eliminates the defect for all 45 calculators uniformly, including the 21 non-navigation calculators (converters, wind/wave, sailing-performance) where the content was flatly wrong. The already-existing dynamic content — `RelatedCalculators` (cluster-aware related links), `generated.useCases` ("Practical use cases," calculator-specific via `contentGenerator.ts`), `CalculatorCategoryLinks` ("Explore more," category-aware) — already served the legitimate versions of what these static blocks were attempting, and all three remain fully intact and unmodified.

**What was intentionally NOT changed:**
- The "Explore Related Calculation Categories" section (3 links all pointing to `/tools/` — Phase 9.0 finding M-3) sits directly adjacent to the removed blocks but was left completely untouched, since it is a separate, not-yet-approved finding.
- The static freshness line ("Updated recently with improved calculation accuracy and expanded examples.") and the bottom trust paragraph ("These calculations are based on standard maritime navigation formulas...") share the same category of flaw but were not named in the Phase 9.1 scope and were left untouched.
- `RelatedCalculators`, `AnswerBlock`, `KeyTakeaways`, `EntityDefinition`, generated `Overview`/`How to use`/`Formula`/`Practical use cases`/`Tips`/`Practical examples`, `FAQ`, `CalculatorCategoryLinks`, `LearnMore`, `CalculatorDisclaimer`, and all `AdPlaceholder` instances remain exactly as they were.

---

### H-3 — Dead MarineToolsBlock affiliate links

**Original problem:** `components/affiliate/MarineToolsBlock.tsx` rendered three product recommendations ("Marine Navigation Parallel Ruler," "Handheld GPS Navigator," "Nautical Chart Plotter Kit"), all three using `href="#"` — dead links styled as genuine clickable recommendations, present on all 45 calculator pages inside the high-visibility "Overview" section.

**Exact change made:**
- Deleted `components/affiliate/MarineToolsBlock.tsx` in its entirety.
- Removed its import and `<MarineToolsBlock />` usage from `components/CalculatorLayout.tsx`.

**Rationale for full deletion rather than partial edit:** per the brief's explicit preference ("prefer deleting the component if it has no legitimate remaining purpose"), removing only the three dead links would have left a heading ("Recommended Marine Navigation Tools"), an intro sentence referring to "these tools," and a closing caption ("These are optional tools...") all referring to a now-empty list — a nonsensical shell with no legitimate remaining content. No fabricated URLs, affiliate tracking links, or placeholder destinations were created, per instruction. No new affiliate system was introduced.

**Affected routes:** all 45 `/tools/[slug]/` pages and their variant routes.

**Why this resolves the finding:** zero dead links remain in the live interface. `grep -rn 'href="#"'` across the entire repository source returns no matches, and the built output contains no occurrence of the three product-recommendation strings.

**What was intentionally NOT changed:** no other affiliate/legal infrastructure was touched — `/affiliate/` (the affiliate disclosure page), footer links, and `lib/ads.ts` remain untouched. `ADS_ENABLED` remains exactly `false`.

---

### H-1 — Duplicate homepage "Most Used Maritime Calculators" heading

**Original problem:** `app/page.tsx` contained two sections both titled "Most Used Maritime Calculators" — a hardcoded 4-card section immediately after the hero, and the dynamic `<MostUsedMaritimeCalculators />` component further down. The two lists partially overlapped but were not identical, and the hardcoded section mislabeled a link as "Nautical Distance Calculator" for the page titled "Great Circle Distance Calculator" everywhere else on the site.

**Exact change made** (`app/page.tsx`): deleted the entire hardcoded first section (heading + 4 manually-written cards), leaving `<MostUsedMaritimeCalculators />` as the sole "Most Used Maritime Calculators" section on the page. `components/MostUsedMaritimeCalculators.tsx`'s internal implementation was not modified — it did not need to be, since it already rendered correctly on its own.

**Affected routes:** `/` (homepage) only.

**Why this resolves the finding:** the homepage now has exactly one occurrence of the heading, sourced from the single dynamic component, which uses the calculator's actual `title` field — eliminating both the duplication and the "Nautical Distance Calculator" mislabel simultaneously (that label existed only in the deleted hardcoded block; the dynamic component correctly says "Great Circle Distance Calculator").

**What was intentionally NOT changed:** the heading wording ("Most Used Maritime Calculators") was preserved exactly, per instruction. `MostUsedMaritimeCalculators.tsx` itself, the tool list it generates (`getPriorityCalculators()`), the hero section, the 6-card `SECTIONS` nav grid, "Recently Updated Calculators," and `ClusterHub` were all left untouched.

---

## Regression Verification

| Command | Result |
|---|---|
| `npm test` | **PASS** — 130 passed, 0 failed (identical to pre-change baseline — confirms no calculation formula was touched) |
| `npx tsc --noEmit` | **PASS** — clean (confirms no dangling import after `MarineToolsBlock` deletion) |
| `npm run lint` | **PASS** — "No ESLint warnings or errors" |
| `npm run build` (from-scratch, `rm -rf out .next` first) | **PASS** — compiled successfully |
| Static pages generated | **308/308** |
| Calculator routes generated | **45/45** (`out/tools/` directory count) |

---

## Content Verification

Inspected the generated static HTML for all 7 routes specified, plus a repository-wide and build-output-wide search:

| Route | "Related Navigation Calculations" | Old blue callout | "When to Use This Calculation" | Dead affiliate links | Practical use cases | Key takeaways | Explore more | FAQ | AnswerBlock | RelatedCalculators |
|---|---|---|---|---|---|---|---|---|---|---|
| `/tools/celsius-fahrenheit-converter/` | absent | absent | absent | absent | present | present | present | present | present | present |
| `/tools/nautical-mile-converter/` | absent | absent | absent | absent | present | present | present | present | present | present |
| `/tools/great-circle-distance-calculator/` | absent | absent | absent | absent | present | present | present | present | present | present |
| `/tools/wave-height-calculator/` | absent | absent | absent | absent | present | present | present | present | present | present |
| `/tools/hull-speed-calculator/` | absent | absent | absent | absent | present | present | present | present | present | present |
| `/tools/beaufort-scale-calculator/` | absent | absent | absent | absent | present | present | present | present | present | present |
| `/tools/sailing-time-calculator/` | absent | absent | absent | absent | present | present | present | present | present | present |

**H-3 verification:** `grep -rn 'href="#"'` across the complete repository source (excluding `node_modules`/`.next`/`out`) returned **zero matches**. `grep -rl` for the three product-recommendation strings across the entire built `out/` directory returned **zero files**.

**H-1 verification:** the built homepage (`out/index.html`) contains exactly **one** `<h2>` element with the text "Most Used Maritime Calculators" (confirmed via `grep -o '<h2[^>]*>Most Used Maritime Calculators</h2>'`, count = 1). A second raw-text occurrence exists in the page's embedded Next.js RSC hydration payload (a serialized JSON tree used for client-side hydration, not a second visible heading) — this is normal Next.js App Router build output, not a defect, and was verified as such by inspecting the surrounding context of both matches. "Nautical Distance Calculator" does not appear anywhere on the homepage (count = 0). "Great Circle Distance Calculator" appears once, as the correct canonical name.

Calculator functionality, result rendering, `AnswerBlock`, `KeyTakeaways`, and `CalculatorCategoryLinks` were all confirmed present and unchanged in behavior across all 7 inspected routes.

---

## Scope Verification

**Files modified:**
- `app/page.tsx` (56 lines removed, 0 added)
- `components/CalculatorLayout.tsx` (83 lines removed, 0 added)

**Files deleted:**
- `components/affiliate/MarineToolsBlock.tsx`

**Total diff:** 3 files changed, 0 insertions, 176 deletions — purely subtractive, reviewed line-by-line via `git diff` before this report was written. Every changed line traces directly to C-1, H-3, H-1, or the mechanically-required import/usage cleanup from H-3's deletion. No unrelated line was found; nothing required reverting.

Explicitly confirmed:
- **No calculator formula changed** — `npm test`'s 130 assertions (which include a full parse-and-evaluate pass over every calculator formula) produced identical results before and after.
- **No calculation engine changed** — `lib/formulaParser.ts`, `lib/calculators/`, `components/calculator-engine/`, `components/calculator/` were not touched.
- **No SEO metadata changed** — `lib/seo.ts`, `generateMetadata` calls, and all `metadata` exports were not touched.
- **No sitemap changed** — `app/sitemap.ts`, `scripts/generate-sitemap.ts` were not touched.
- **No AdSense configuration changed** — `lib/ads.ts`, `components/ads/AdSenseScript.tsx`, `app/layout.tsx`'s AdSense script tag were not touched.
- **`ADS_ENABLED` remains `false`** — confirmed unchanged in `lib/ads.ts`.
- **No AEO mappings changed** — `lib/aeo.ts`, `data/entities.json` were not touched.
- **No H-2, H-4, H-5, or any Medium/Low/Informational finding was addressed** — the global calculator index (`AllCalculatorsGrid` in `app/layout.tsx`), the `/navigation/` vs. `/navigation-calculations/` naming collision, the model-disclosure placement, and all other Phase 9.0 findings remain exactly as documented, untouched, for a future phase.

---

## Certification

# PHASE 9.1 — PASS

All three findings (C-1, H-3, H-1) are resolved, independently verified against both source and built output, and all regression checks pass. This certifies only the remediation of C-1, H-3, and H-1 — it does not constitute UX certification for the project as a whole. Findings H-2, H-4, H-5, and the full Medium/Low/Informational register from Phase 9.0 remain open and unaddressed, as scoped.
