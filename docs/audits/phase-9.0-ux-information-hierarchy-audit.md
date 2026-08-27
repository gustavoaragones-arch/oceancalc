# Phase 9.0 — UX & Information Hierarchy Audit

## 1. Executive Summary

OceanCalc's underlying calculation engine is numerically certified (Phase 8). This audit asks a different question: can a real user actually use it well? The answer, independently derived from source inspection and live-page verification, is **not yet**.

The single most consequential finding is structural, not cosmetic: **`components/CalculatorLayout.tsx` renders several large content blocks — "Related Navigation Calculations," "When to Use This Calculation," and a generic "navigation planning" callout — unconditionally, identically, on all 45 calculator pages, regardless of what the calculator actually does.** This was verified live on `celsius-fahrenheit-converter` — a plain temperature-unit converter — which currently shows the user a "Related Navigation Calculations" block linking to bearing and cross-track-error tools, and a "When to Use This Calculation" list reading "Planning a navigation route between two points." A user converting °C to °F has no reason to see this, and its presence undermines confidence that the page was built for their actual task.

Compounding this, the site's root layout (`app/layout.tsx`) injects the *entire* 45-calculator index plus eight more hardcoded priority links on every single page — legal pages included — so a handful of calculators (Hull Speed, Rhumb Line Distance, Initial Bearing, Great Circle Distance) end up linked from five to seven different places on one page view, in five to seven different wordings, while the actual page-specific content (FAQ, examples, safety disclaimer) is pushed further down. The homepage independently duplicates its own "Most Used Maritime Calculators" heading with two different, partially-overlapping tool lists — confirmed live, including one mislabeled link ("Nautical Distance Calculator" for a page titled "Great Circle Distance Calculator" everywhere else).

None of this reflects a broken build, a numerical error, or a missing feature. It reflects **content and navigation blocks that were added incrementally (largely for SEO/AEO reach) without a governing information-hierarchy discipline**, so the primary task — enter numbers, get an answer, understand it — is technically always reachable, but is surrounded by a large volume of repetitive, sometimes irrelevant, occasionally broken (dead affiliate links) material.

**Certification status: NOT CERTIFIED.** One Critical finding and five High findings are documented below with exact evidence, exact location, and exact remediation. No code was changed to produce this report.

---

## 2. Audit Scope

Per the assignment, this audit covers: homepage, calculator index, the four calculator-cluster authority pages, all 45 calculator pages (individually, not collapsed), calculator input/output interfaces, result presentation, explanatory content, FAQ, related-calculator navigation, cluster/category navigation, "recently updated," "most used," AEO AnswerBlock/KeyTakeaways, MarineToolsBlock, AdPlaceholder positions, footer, header, trust copy, measurement/reference pages, knot pages, legal pages (for hierarchy relevance only), variant routes, mobile behavior (source-inferred), dark mode, accessibility structure, and cross-page IA.

The route inventory was built directly from the repository, not assumed:

- `app/page.tsx` — homepage
- `app/tools/page.tsx` — calculator index
- `app/tools/[slug]/page.tsx` + `app/tools/[slug]/[variant]/page.tsx` — 45 calculators × up to 5 variant IDs each (noindex)
- `app/navigation-calculations/`, `app/distance-measurement-calculators/`, `app/wind-wave-calculators/`, `app/sailing-performance-calculators/` — the 4 calculator-cluster authority pages
- `app/knots/`, `app/navigation/`, `app/wind-waves/`, `app/maritime-measurements/`, `app/sailing/` (each with an index + `[slug]` article route) — a **second**, separate topic-article cluster system
- `app/about/`, `app/contact/`, `app/editorial-policy/`, `app/privacy/`, `app/terms/`, `app/disclaimer/`, `app/cookies/`, `app/affiliate/` — legal/trust pages

This confirms a fact load-bearing for several findings below: **there are two distinct, independently-built "cluster" systems on this site** (`data/calculatorClusters.json` → the 4 authority pages, vs. topic-article JSON files → the 5 Header hubs), and they are not the same thing, despite overlapping names ("Navigation" appears in both).

---

## 3. Methodology

Per instruction, no finding in this report rests on "it builds," "Google indexed it," or "a previous phase approved it." Every finding below is one of:

- **SOURCE VERIFIED** — read directly from the current repository (JSX, CSS, data files); exact file/line cited.
- **RENDERED-TEXT VERIFIED** — confirmed against the live production site via `WebFetch`, which converts the actual rendered HTML to a text/markdown representation. This confirms heading order, presence/absence of text, and link destinations as actually served, but **is not a screenshot** — it does not confirm pixel layout, color, spacing, or exact visual weight.
- **INFERRED** — a conclusion about visual/responsive behavior drawn from CSS/Tailwind classes alone, with no rendered or visual confirmation. Always labeled as such.

**No browser automation or screenshot tool was available in this session** (checked: no Playwright/Puppeteer in `node_modules`, no Chrome DevTools MCP tool loaded). This is stated plainly per the instruction not to claim visual verification that didn't happen. Mobile-specific findings (Workstream H) are therefore INFERRED unless otherwise marked.

---

## 4. Page Inventory

| Page type | Route pattern | Count | Notes |
|---|---|---:|---|
| Homepage | `/` | 1 | |
| Calculator index | `/tools/` | 1 | |
| Calculator pages | `/tools/[slug]/` | 45 | See full matrix, doc 2 |
| Calculator variant pages | `/tools/[slug]/[variant]/` | up to 5×45 = 225 | noindex; same `CalculatorLayout`, different intro paragraph |
| Calculator-cluster authority pages | `/navigation-calculations/`, `/distance-measurement-calculators/`, `/wind-wave-calculators/`, `/sailing-performance-calculators/` | 4 | Minimal template — see §12 |
| Topic hub pages | `/knots/`, `/navigation/`, `/wind-waves/`, `/maritime-measurements/`, `/sailing/` | 5 | Article index, different template (`SidebarNavigation`) |
| Topic article pages | `/knots/[slug]/`, `/navigation/[slug]/`, etc. | ~10 (2 per hub currently) | `ArticleLayout` |
| Legal/trust pages | `/about/`, `/contact/`, `/privacy/`, `/terms/`, `/disclaimer/`, `/cookies/`, `/affiliate/`, `/editorial-policy/` | 8 | |

---

## 5. UX Principles Used

1. A user should be able to identify the primary task and primary result without reading unrelated content.
2. Repeated content across a page should either be intentional reinforcement or should not exist — accidental duplication is a defect.
3. Every link should go somewhere distinct and meaningful; three links to the identical URL, styled as if offering three choices, is a defect regardless of anchor text quality.
4. Content that names a specific domain ("navigation," "route," "bearing") should only appear on pages about that domain.
5. Depth is valuable on a reference site; misplaced depth (the same explanatory apparatus attached to every calculator regardless of relevance) is not depth, it's noise.
6. A disclosure that Phase 8 determined was *necessary* for technical honesty is only doing its job if a user is likely to see it.
7. Visual affordances (hover-lift, underline, color) should match actual interactivity. A dead link is worse than no link.

---

## 6. Critical Findings

### C-1 — Hardcoded, calculator-irrelevant content blocks render on all 45 calculator pages regardless of category

1. **Route:** all 45 `/tools/[slug]/` pages (and their variants).
2. **File/component:** `components/CalculatorLayout.tsx`, lines 91–97 (generic blue callout), lines 207–267 ("Related Navigation Calculations"), lines 295–306 ("When to Use This Calculation").
3. **Element:** three unconditional JSX blocks with zero relation to `calculator.category` or `calculator.slug` — no conditional rendering logic of any kind gates them.
4. **Problem:** These blocks assume every calculator is about navigation/route-planning. This is false for at least 12 "conversions"-category calculators (`celsius-fahrenheit-converter`, `bar-psi-converter`, `pounds-kilograms-converter`, `kilowatts-horsepower-converter`, `liters-us-gallons-converter`, `inches-mercury-millibar-converter`, `square-feet-square-meters-converter`, `cubic-feet-liters-converter`, `feet-meters-converter`, `meters-second-knots-converter`, `statute-nautical-mile-converter`, `cable-nautical-mile-converter`) plus every wind/wave and sailing-performance calculator, none of which are about navigating a route.
5. **Affected user:** any user of a non-navigation calculator (roughly 25 of 45, more than half the catalog) — confirmed live on `celsius-fahrenheit-converter`.
6. **Severity: CRITICAL.** This is not a cosmetic issue — it materially misrepresents what the page is for, at scale, on the majority of the product's pages, and actively damages the credibility the numerical-accuracy work in Phase 8 was meant to build.
7. **Affects:** comprehension, trust, cognitive load (adds ~3 irrelevant sections' worth of scroll on every affected page).
8. **Evidence — RENDERED-TEXT VERIFIED:** `WebFetch` of `https://oceancalc.com/tools/celsius-fahrenheit-converter/` confirms headings "Related Navigation Calculations" (linking to hull-speed, rhumb-distance, initial-bearing, distance-to-horizon, cross-track-error, speed-over-ground calculators) and "When to Use This Calculation" both present on a temperature-conversion page.
9. **Exact remediation:** Replace the three hardcoded blocks with data-driven equivalents, or remove them:
   - The "Related Navigation Calculations" block (6 hardcoded links) should be deleted outright — `RelatedCalculators` (dynamic, cluster-based, already present earlier on the page) already serves this purpose correctly.
   - The generic blue callout ("Use this calculation together with proper navigation tools...") should either be removed or replaced with `calculator`-specific copy (e.g., drawn from `calculator.formulaDetail` or omitted where no such copy exists).
   - "When to Use This Calculation" should be removed, or converted into a `calculator`-specific field in the data files (e.g., a `useCases` list already exists via `contentGenerator.ts`'s `generated.useCases` — that field is navigation-agnostic and already renders earlier on the page under "Practical use cases," making this block fully redundant as well as wrong).
10. **Scope:** Global (single component change fixes all 45 pages). **Regression risk: low** — this is a content-removal/redirect-to-existing-dynamic-data change, not a logic change; no calculation, routing, or data-file edit is required.

---

## 7. High Findings

### H-1 — Homepage duplicates the "Most Used Maritime Calculators" heading with two different, inconsistent tool lists

1. **Route:** `/` (homepage).
2. **File/component:** `app/page.tsx` lines 91–145 (hardcoded first instance) and `components/MostUsedMaritimeCalculators.tsx` (second instance, rendered at `app/page.tsx` line 172).
3. **Element:** Two `<h2>` elements with the literal identical text "Most Used Maritime Calculators."
4. **Problem:** First instance is 4 manually-written cards (Hull Speed, Rhumb Line Distance, Initial Bearing, and a card linking to `great-circle-distance-calculator` but labeled **"Nautical Distance Calculator"** — that page's actual title, H1, and every other reference to it on the site call it "Great Circle Distance Calculator"). Second instance is a dynamic 7-tool list from `getPriorityCalculators()` with the correct titles. A user scrolling the homepage sees the same heading twice with different, only-partially-overlapping content, and one of the two names for the same tool disagrees with the tool's actual name.
5. **Affected user:** every homepage visitor — the highest-traffic page on the site.
6. **Severity: HIGH.**
7. **Affects:** comprehension, trust, navigation predictability.
8. **Evidence — RENDERED-TEXT VERIFIED:** `WebFetch` of `https://oceancalc.com/` confirms both headings present, and confirms "Nautical Distance Calculator" as the first instance's fourth card label.
9. **Exact remediation:** Delete the hardcoded first "Most Used Maritime Calculators" section (`app/page.tsx` lines 91–145) entirely. The dynamic `<MostUsedMaritimeCalculators />` component already covers this need correctly, with accurate titles, further down the page. If a "most used" section is wanted immediately after the hero (a defensible IA choice), move the *existing dynamic component* up rather than keeping a second, hand-written, drifting copy.
10. **Scope:** Page-specific (homepage only). **Regression risk: low** — deleting a static block; the dynamic component that remains is already correct.

### H-2 — The full 45-calculator index plus 8 more hardcoded links render on every page of the site, compounding per-page link redundancy

1. **Route:** every route on the site, including all 45 calculator pages, all cluster pages, and all legal pages.
2. **File/component:** `app/layout.tsx` lines 65–125 — `<AllCalculatorsGrid />` (full 45-entry index) plus two rows of 4 hardcoded links each (Hull Speed/Rhumb Line/Great Circle/Bearing; Navigation/Distance/Wind & Waves/Sailing), rendered inside the root layout between `<main>` and `<Footer />`.
3. **Element:** Global, unconditional content injection at the layout level — not a per-page decision.
4. **Problem:** On a single calculator page, the same small set of "priority" calculators (Hull Speed, Rhumb Line Distance, Initial Bearing, Great Circle Distance in particular) end up linked from: (a) `CalculatorCategoryLinks`'s "Popular calculators:" inline list, (b) `AllCalculatorsGrid`'s "Popular Calculators" section (root layout), (c) `AllCalculatorsGrid`'s "All Maritime Calculators" full list (root layout), (d) the root layout's separate 4-link "Hull Speed / Rhumb Line / Great Circle / Bearing" row, (e) the hardcoded "Related Navigation Calculations" block (see C-1) which also includes Hull Speed and Rhumb Line. That is up to **five separate presentations of overlapping content on one page**, each with different anchor text ("Hull Speed" vs. "Hull Speed Calculator" vs. "Calculate maximum hull speed based on waterline length"). Meanwhile the page-specific FAQ, examples, and safety disclaimer are pushed further down by all of this.
5. **Affected user:** every visitor to every page; most acute for calculator pages, where it competes directly with task-relevant content.
6. **Severity: HIGH.**
7. **Affects:** navigation clarity, cognitive load, task completion (the actual page content is diluted by volume).
8. **Evidence — SOURCE VERIFIED:** `app/layout.tsx` shows the block is outside any per-route conditional; it renders for every `{children}`. RENDERED-TEXT VERIFIED via the `celsius-fahrenheit-converter` heading list (§ finding C-1 evidence), which shows both "Popular Calculators" and "All Maritime Calculators" as the final two headings on the page, following the calculator's own "Explore more"/"Popular calculators" section.
9. **Exact remediation:** Remove `<AllCalculatorsGrid />` and the two hardcoded link rows from `app/layout.tsx`. The `/tools/` index page already serves the "browse everything" need; every calculator page already has `RelatedCalculators`, `CalculatorCategoryLinks`, and (post C-1 fix) no longer has the redundant hardcoded block. If a global "browse all calculators" link is wanted on every page, a single link in the footer (already present as a footer link elsewhere is more appropriate than reproducing the entire index) is sufficient.
10. **Scope:** Global (one file, `app/layout.tsx`). **Regression risk: low-medium** — this does reduce internal link count site-wide, which has SEO-adjacent implications; Phase 9 is explicitly UX-only and does not evaluate SEO impact, so this tradeoff should be explicitly acknowledged to the site owner before implementation, not decided unilaterally in a future remediation phase.

### H-3 — MarineToolsBlock's three affiliate links are all dead (`href="#"`), positioned prominently on every page

1. **Route:** all 45 calculator pages (rendered inside the "Overview" section, immediately after "Key takeaways").
2. **File/component:** `components/affiliate/MarineToolsBlock.tsx`, lines 14, 20, 26.
3. **Element:** `<a href="#">Marine Navigation Parallel Ruler...</a>`, `<a href="#">Handheld GPS Navigator...</a>`, `<a href="#">Nautical Chart Plotter Kit...</a>` — three blue, underlined-on-hover links styled identically to real navigation, all pointing nowhere.
4. **Problem:** A user who clicks any of these (reasonably, since they're styled as links inside a "Recommended" list) gets no result — the link is a bare fragment identifier, so the page does not navigate. On a site whose whole premise is precision and reliability, a dead interactive element positioned inside the primary content flow (not in a footer or low-priority zone) actively erodes trust.
5. **Affected user:** any user who engages with the "Recommended Marine Navigation Tools" block — confirmed reachable on every calculator page, positioned high (immediately after KeyTakeaways, before "How to use").
6. **Severity: HIGH** (a broken interactive element in primary content flow, present on every page in the catalog).
7. **Affects:** trust, task completion (for anyone trying to follow the recommendation), accessibility (a link with no real destination and `href="#"` is also a known screen-reader/keyboard-trap anti-pattern — activating it moves focus to the top of the document with no other effect).
8. **Evidence — RENDERED-TEXT VERIFIED:** confirmed on production (`celsius-fahrenheit-converter`) that all three links resolve to `#`.
9. **Exact remediation:** Either (a) wire real affiliate destinations before this block ships to any more pages, or (b) remove the block until real links exist. Do not leave placeholder `href="#"` content live in primary content flow.
10. **Scope:** Global (one component). **Regression risk: low.**

### H-4 — Three overlapping "navigation"-named destinations create IA ambiguity

1. **Route:** `/navigation/` (Header topic-article hub), `/navigation-calculations/` (calculator-cluster authority page), plus the calculator-category routing that points `category: "navigation"` calculators back to `/navigation/` via `CalculatorCategoryLinks`.
2. **File/component:** `components/Header.tsx` (nav label "Navigation" → `/navigation/`), `app/navigation-calculations/page.tsx` (page titled "Navigation Calculations"), `components/ClusterHub.tsx` line 26–41 (homepage section titled "Navigation Calculations" linking to `/navigation-calculations/`), `components/CalculatorCategoryLinks.tsx` line 5 (category "navigation" → `/navigation/`, labeled "navigation articles").
3. **Element:** Two structurally different pages (`/navigation/` = long-form articles on dead reckoning and distance-to-horizon; `/navigation-calculations/` = a bare list of calculator links) share nearly identical labels ("Navigation" / "Navigation Fundamentals" / "Navigation Calculations" / "Navigation Calculation Categories") across four different components.
4. **Problem:** A user who clicks "Navigation" in the header lands on an article hub; a user who clicks "Navigation Calculations" from the homepage's `ClusterHub` lands on a completely different, much thinner page (bare `<ul>` of links, no cards, no description beyond one paragraph — see § finding M-8) that they would reasonably expect to be the same destination. There is no cross-link between these two "Navigation" pages telling the user the other one exists.
5. **Affected user:** any user trying to browse navigation-related content who encounters both entry points (homepage + header) and expects them to converge.
6. **Severity: HIGH** (this is a structural IA problem affecting discoverability across the whole navigation-content vertical, not a single page).
7. **Affects:** navigation, "where am I" comprehension.
8. **Evidence — SOURCE VERIFIED:** confirmed via direct comparison of `app/navigation/page.tsx` (full card grid + sidebar, `SidebarNavigation`, priority-calculators strip) against `app/navigation-calculations/page.tsx` (bare two-column text-link list, no cards, no sidebar, minimal styling — the thinnest page template on the site).
9. **Exact remediation:** Either merge `/navigation-calculations/` into `/navigation/` as a "Calculators" section on the existing richer page, or rename one of the two to remove the naming collision (e.g., `/navigation-calculations/` → keep as a calculator-only listing but title it distinctly, such as "Navigation Calculator Tools," and add a one-line cross-link from each page to the other, e.g., "Looking for navigation articles instead? Visit Navigation Fundamentals.").
10. **Scope:** Cross-page (affects Header, homepage `ClusterHub`, `CalculatorCategoryLinks`, and the `/navigation-calculations/` page template itself). **Regression risk: medium** — touches multiple components; should be scoped as its own remediation item rather than folded into C-1's fix.

### H-5 — Model-accuracy disclosures (certified as necessary in Phase 8) are buried 5–6 sections below the result

1. **Route:** `/tools/great-circle-distance-calculator/`, `/tools/initial-bearing-calculator/`, `/tools/mercator-scale-factor-calculator/`, `/tools/radar-horizon-calculator/`, and any other calculator whose `formulaDetail` carries a model-assumption disclosure Phase 8 determined was load-bearing.
2. **File/component:** `components/CalculatorLayout.tsx` — the "Formula" section (where `calculator.formulaDetail` renders) is positioned after Breadcrumbs, H1, description, `LastUpdated`, `AuthorPublisher`, the calculator widget itself, the ad placeholder, the generic blue callout, `AnswerBlock`, `EntityDefinition`(s), `RelatedCalculators`, "Overview," and "Key takeaways" — roughly 9–10 sections before the disclosure appears.
3. **Element:** `calculator.formulaDetail` text, e.g. "OceanCalc uses a spherical Earth model for this calculation, so results are an approximation of the corresponding ellipsoidal geodesic distance."
4. **Problem:** Phase 8 (a separate, already-certified audit track) determined this exact sentence was necessary for the site to be technically honest about its model. A disclosure only does its job if users encounter it. Verified live: on `great-circle-distance-calculator`, 5–6 major headings separate the numeric result from this text.
5. **Affected user:** any user who computes a result and does not scroll deep into the page — very plausibly the majority, since the task (get a distance) is already complete after the first screen or two.
6. **Severity: HIGH** (this is specifically the kind of "disclaimer placed where users are unlikely to see it" failure mode the audit brief calls out under Trust/Confidence UX).
7. **Affects:** trust, comprehension of result limitations — this is a UX-placement finding distinct from Phase 8's textual-accuracy finding; the text itself is correct, only its position is a problem.
8. **Evidence — RENDERED-TEXT VERIFIED:** `WebFetch` of the live page confirms both the heading count and the exact quoted text at that position.
9. **Exact remediation:** Move a short-form version of the model disclosure to immediately adjacent to the result (e.g., inside or directly below `ResultDisplay`/`OutputField`, as a single small caption line), while leaving the full explanatory paragraph in its current "Formula" section for readers who want depth. Do not remove the detailed version — add a short-form pointer near the result.
10. **Scope:** Calculator-specific field addition (a new short-caption field, populated only for calculators whose `formulaDetail` currently carries a model-assumption disclosure) plus a small template change to `CalculatorEngine`/`CalculatorShell` to render it. **Regression risk: low** — additive, does not change any existing content or calculation.

---

## 8. Medium Findings

| ID | Finding | File(s) | Evidence |
|---|---|---|---|
| M-1 | "Formula" appears as a heading twice per `engine`-type calculator page — once inside the calculator widget's own compact display (`CalculatorEngine.tsx`, `<h3>Formula</h3>`), once again in `CalculatorLayout.tsx`'s full "Formula" section. | `components/calculator-engine/CalculatorEngine.tsx`, `components/CalculatorLayout.tsx` L143-163 | RENDERED-TEXT VERIFIED on `celsius-fahrenheit-converter` (headings #3 and #10 both "Formula") |
| M-2 | Two structurally different "related calculators" blocks coexist per calculator page: `RelatedCalculators` ("Related Maritime Calculators," dynamic, cluster-based, mid-page) and the hardcoded "Related Navigation Calculations" (6 fixed links, near bottom — see C-1). Even after C-1's fix removes the hardcoded block, the *naming* similarity between "Related Maritime Calculators" and any future addition should be guarded against. | `components/RelatedCalculators.tsx`, `components/CalculatorLayout.tsx` | SOURCE VERIFIED |
| M-3 | "Explore Related Calculation Categories" section: 3 list items with different anchor text, all three `href="/tools/"` — identical destination presented as if offering 3 distinct choices. | `components/CalculatorLayout.tsx` L271-293 | SOURCE VERIFIED |
| M-4 | Footer shows "Privacy Policy" as a link in two separate rows (`footerLinks` array + the second hardcoded row), same destination (`/privacy/`), different visual treatment. | `components/Footer.tsx` L4-10, L28-43 | SOURCE VERIFIED |
| M-5 | The same 7-tool "priority" set is presented under three different heading conventions across the site: "Most Used Maritime Calculators" (homepage, twice), "Popular calculators" (lowercase c — `PriorityCalculatorsStrip`, `/tools/`, inline mention in `CalculatorCategoryLinks`), "Popular Calculators" (capital C — `AllCalculatorsGrid`). | `components/MostUsedMaritimeCalculators.tsx`, `components/PriorityCalculatorsStrip.tsx`, `components/AllCalculatorsGrid.tsx`, `app/tools/page.tsx` | SOURCE VERIFIED |
| M-6 | The shared `.card` utility applies `hover:-translate-y-1` (an interactivity/clickability signal) to purely static, non-clickable sections (Formula, Tips, Practical examples, Overview, etc.) throughout every calculator page. `components/SidebarNavigation.tsx` explicitly overrides this (`hover:!translate-y-0`), evidencing the project's own implementers recognized the mismatch in at least one place; it is not addressed anywhere else. | `app/globals.css` L46-50, `components/SidebarNavigation.tsx` L24 | SOURCE VERIFIED |
| M-7 | `ResultDisplay.tsx`'s caption ("This result can be used for navigation planning, route optimization, or sailing performance analysis.") is generic and calculator-agnostic. Currently only used by 3 calculators via `CalculatorShell` (`nautical-mile-converter`, `knots-to-kmh`, `sailing-time-calculator`), for which the claim happens to be roughly true, but the pattern is fragile — it would be wrong if `CalculatorShell` were ever reused for a non-navigation calculator. | `components/calculator/ResultDisplay.tsx` L33-35 | SOURCE VERIFIED |
| M-8 | `/navigation-calculations/` (and its 3 sibling cluster-authority pages) is the thinnest page template on the site: a raw `<ul>` of slug-derived link text (e.g. a slug like `initial-bearing-calculator` is shown as "initial bearing calculator" via naive `.replaceAll("-", " ")` — no title-casing, no card styling, no description per link), inconsistent with every other index-style page on the site (`/tools/`, `/navigation/`, `/knots/`, homepage), which all use card grids with real calculator titles and descriptions. | `app/navigation-calculations/page.tsx` L26-37 (and the 3 sibling files, same pattern) | SOURCE VERIFIED |
| M-9 | `nautical-mile-converter` is the one calculator with both a `simpleRegistry` and an `engine` config. `CalculatorRenderer.tsx`'s branch order checks `simpleRegistry` first, so the live widget renders via `CalculatorShell` and shows exactly **one** output (nm→km). The page's own "Formula" section and `formulaDisplay` text ("1 NM = 1.852 km = 1852 m ≈ 1.15078 miles") describe three conversions (km, miles, m); a user reading that text and then looking at the widget sees only one of the three values the text describes. The `engine` config's mi/m outputs are defined in data but never rendered — dead configuration, the same underlying pattern as Phase 8's dead-component finding, here affecting output completeness rather than formula correctness. | `components/CalculatorRenderer.tsx` L17-19 (simpleRegistry branch precedes engine branch), `data/calculators.json` `nautical-mile-converter` (both `simpleRegistry` and `engine` present) | SOURCE VERIFIED |

---

## 9. Low Findings

| ID | Finding | File(s) |
|---|---|---|
| L-1 | Static freshness line "Updated recently with improved calculation accuracy and expanded examples." renders on every calculator page regardless of whether that specific calculator was actually recently touched — an unqualified blanket claim sitting directly below the H1. | `components/CalculatorLayout.tsx` L68-70 |
| L-2 | FAQ sections render fully expanded with no accordion/collapse; calculators with template-merged FAQs commonly show 3–5 Q&A pairs in full, adding scroll length. Not necessarily wrong for a reference platform, but worth measuring against actual FAQ length per calculator before deciding it's fine everywhere. | `components/FAQ.tsx` |
| L-3 | No visual/textual cue tells users that calculator results update live as they type (no submit button exists anywhere in `CalculatorEngine.tsx` or `CalculatorShell.tsx`). This is arguably better UX than a submit-button pattern once discovered, but a first-time user has no affordance signaling "just start typing, the answer appears automatically." | `components/calculator-engine/CalculatorEngine.tsx`, `components/calculator/CalculatorShell.tsx` |
| L-4 | The "Key maritime definitions" region (`EntityDefinition` block(s)) has no visible heading — only an `aria-label`, so sighted users see unlabeled boxes while screen-reader users hear an announced region name. Minor inconsistency, not task-blocking. | `components/CalculatorLayout.tsx` L101-115 |

---

## 10. Informational Findings

| ID | Observation |
|---|---|
| I-1 | `AdPlaceholder` (dashed-border, low-visual-weight, `ADS_ENABLED=false`) is positioned directly after the calculator result on every page. This is not currently disruptive (it's a subtle placeholder), but flagged for awareness: when ads activate, the *first* thing after a user's result will be an ad unit, before any interpretation or explanatory content. Not a defect today; a placement decision to revisit before enabling ads. |
| I-2 | Dark mode is implemented via `prefers-color-scheme` media query only (no manual toggle). This is a reasonable, low-risk choice — not a defect. |
| I-3 | Two independent "cluster" data systems exist (`calculatorClusters.json` for the 4 authority pages vs. per-topic article JSON files for the 5 Header hubs). Maintaining calculators and long-form articles as separate content types is a defensible architectural choice (Workstream M "good difference") — the problem is specifically the naming collision between them (see H-4), not the dual-system architecture itself. |
| I-4 | Two different `InputField` components exist (`components/calculator/InputField.tsx` for `CalculatorShell`, `components/calculator-engine/InputField.tsx` for `CalculatorEngine`) with different capabilities (unit-selector support differs). This is an appropriate difference given the two shells serve genuinely different data shapes (`simpleRegistry` vs. `engine` config) — not flagged as a defect. |

---

## 11. Homepage Audit

**First-glance comprehension:** the hero (H1 + subtitle + single "Explore Calculators" CTA) is clear and uncluttered — SOURCE VERIFIED, no competing CTA in the hero itself. This part of the homepage is sound.

Below the hero, the page becomes list-heavy fast: a hardcoded "Most Used" section (H-1), a 6-card category nav grid, the *second* "Most Used" section (H-1), "Recently Updated Calculators," `ClusterHub`'s "Navigation Calculation Categories" (4 more sub-lists — see H-4/M-8 on its `/navigation-calculations/` destination quality), and then the global `AllCalculatorsGrid` from the root layout (H-2). By the time a first-time visitor reaches the bottom of the homepage, they have been shown "browse calculators" in at least five different presentations. The hero's single clear CTA is good; everything below it competes with itself rather than with the user's actual next decision.

## 12. Calculator Index Audit

`/tools/` (`app/tools/page.tsx`) is the cleanest large index page on the site: one clear H1, one intro paragraph, a 4-link category row, "Popular calculators," then "All maritime calculators" — SOURCE VERIFIED, no duplicate headings, no dead links found in this file. This page is functioning as intended and is not a source of findings beyond the site-wide H-2/M-5 patterns that also touch it.

## 13. Cluster Authority Audit

All 4 calculator-cluster authority pages (`/navigation-calculations/`, `/distance-measurement-calculators/`, `/wind-wave-calculators/`, `/sailing-performance-calculators/`) share the identical minimal template documented in M-8: a bare `<ul>` of naively-slugified link text, no cards, no per-link description, no sidebar, inconsistent with every other listing page on the site. These pages are reachable from the homepage `ClusterHub` and from the global root-layout link row, so they receive real traffic despite being the weakest-built page type in the inventory.

## 14. 45-Calculator UX Audit

See **`docs/audits/phase-9.0-ux-information-hierarchy-matrix.md`** for the complete, individual, non-collapsed 45-row matrix. Summary of what varies vs. what's shared:

- **Shared across all 45** (because all 45 route through exactly two components, `CalculatorShell` for 3 calculators with `simpleRegistry`, `CalculatorEngine` for the other 42, both wrapped by the same `CalculatorLayout`): the C-1 irrelevant-content blocks, the H-2 link-redundancy pattern, the H-3 dead affiliate links, the M-1 duplicate "Formula" heading (engine-type only), the L-1 blanket freshness claim, the L-3 no-submit-button pattern.
- **What varies per calculator**: input count (1 for most converters, up to 4 for `great-circle-distance-calculator`/`initial-bearing-calculator`/`rhumb-distance-calculator`), whether a model-assumption disclosure exists and is therefore subject to H-5, whether the calculator has an AEO entity mapping (26 of 45 do, post-Phase-8.6; 19 render no `EntityDefinition` block at all — this is correct/expected, not a defect), output count (most have 1, a handful have 2: `nautical-mile-converter`, `knots-speed-converter`, `distance-to-horizon-calculator`, `great-circle-distance-calculator`, `anchor-scope-calculator`, `fathom-converter`, `apparent-wind-calculator`, `wave-height-calculator`).

## 15. Navigation Audit

Covered in depth under H-2, H-4, M-3, M-5, M-8. Summary answers to the required orientation questions:

- **"Where am I?"** — generally answerable via breadcrumbs + H1 (SOURCE VERIFIED, present on every calculator page). Weaker on the 4 cluster-authority pages, which have no breadcrumb trail at all (`app/navigation-calculations/page.tsx` and siblings render no `<Breadcrumbs>` component).
- **"What related tool should I use?"** — answerable, but via too many competing lists with inconsistent labeling (H-2, M-5).
- **"What category does this belong to?"** — answerable via `CalculatorCategoryLinks`'s "Explore more" section, which is well-built (dynamic, category-aware) — the one clearly good navigation component found in this audit.
- **"Where can I go next?"** — over-answered; the problem is too many options presented with too little differentiation, not too few.

**Exact label corrections required** (per Workstream G instruction to specify exact current/recommended wording):

| Current | Recommended | Reason |
|---|---|---|
| "Nautical Distance Calculator" (homepage, first "Most Used" card) | "Great Circle Distance Calculator" | Matches the actual page title/H1/every other reference on the site (H-1) |
| "Navigation Calculation Categories" (`ClusterHub` H2) | "Calculator Categories" or "Browse Calculators by Type" | The section covers Distance, Wind & Wave, and Sailing Performance in addition to Navigation — calling the whole thing "Navigation..." misdescribes 3 of its 4 subsections (H-4) |
| "Popular calculators" / "Popular Calculators" (inconsistent capitalization across `PriorityCalculatorsStrip`, `/tools/`, `AllCalculatorsGrid`) vs. "Most Used Maritime Calculators" (homepage) | Pick one label and one capitalization convention; apply everywhere the same 7-tool set appears | Same content, three different labels currently (M-5) |

## 16. Information Hierarchy Audit

The intended hierarchy (H1 → purpose → task → result → interpretation → explanation → formula → practical use → examples → tips → FAQ → related → category nav → monetization) is **broadly followed in the first half of every calculator page** and **breaks down in the second half**, where the C-1 irrelevant blocks, the duplicate related-calculators sections (M-2), the triple-duplicate-link block (M-3), and the global index injection (H-2) all compete for the same "what do I do next" moment without a clear order of priority among them. The single most important interpretation content — model-assumption disclosures — is the *worst*-positioned content on the page (H-5), which inverts the intended hierarchy for the calculators that carry one.

## 17. Mobile Audit

**All findings in this section are INFERRED from CSS/Tailwind classes only — no visual/browser verification was available or performed.**

- `CalculatorEngine`'s input grid (`grid grid-cols-1 sm:grid-cols-2`, `components/calculator-engine/CalculatorEngine.tsx`) switches to 2 columns at the `sm` breakpoint (640px). For 3–4-input calculators (`great-circle-distance-calculator`, `initial-bearing-calculator`, `rhumb-distance-calculator`, `apparent-wind-calculator`), this means a phone in landscape or a small tablet (640–1023px) shows labeled numeric inputs with unit selectors two-per-row. INFERRED risk of label/input cramping at the narrow end of that range; not verified visually.
- `Header`'s nav (`flex ... flex-wrap justify-end`, `components/Header.tsx`) has no dedicated mobile/hamburger treatment — 7 nav items wrap via flexbox on narrow screens. INFERRED: functional but likely produces 2–3 visually uneven wrapped lines beneath the logo on a ~375px viewport; not verified visually.
- `CalculatorShell`'s input/result grid (`grid-cols-1 lg:grid-cols-2`) stays single-column until 1024px — lower risk than `CalculatorEngine`'s pattern.
- No `<table>` elements were found in any calculator-facing component, so horizontal-scroll-table risk (a common mobile failure mode) does not apply here.

This section should be re-verified with actual browser/device testing before being treated as complete; it is explicitly flagged as inference-only.

## 18. Accessibility Audit

Focused on task-relevant issues only, not a generic WCAG sweep, per instruction.

- **Form labels:** correctly associated via `htmlFor`/`id` in both `InputField` implementations — SOURCE VERIFIED, no issue.
- **Result announcements:** `ResultDisplay` uses `role="region" aria-live="polite" aria-label="Calculation result"` — correct pattern for a live-updating numeric result. No issue.
- **Focus visibility:** `.input-field` has an explicit `focus:ring-2` state — no issue.
- **Dead link accessibility failure:** the three `href="#"` links in `MarineToolsBlock` (H-3) are a real accessibility defect, not just a broken-link defect — activating a bare-fragment link via keyboard sends focus to the top of the document with no other effect, which is disorienting for keyboard/screen-reader users specifically.
- **Unlabeled region:** the "Key maritime definitions" wrapper has an `aria-label` but no visible heading (L-4) — minor, not task-blocking.
- **Heading hierarchy:** broadly sequential (H1 → H2 sections → H3 sub-items) with one soft spot: the duplicate "Formula" H3-inside-widget / H2-in-page-body pattern (M-1) could read confusingly in a screen-reader's heading-navigation list (two "Formula" entries with no differentiation).
- **No task-blocking accessibility defect was found** beyond the dead-link issue already captured as H-3.

## 19. Trust/Confidence Audit

Covered in depth by H-5. Additional observation: the bottom-of-page `CalculatorDisclaimer` ("Results are estimates for educational purposes only and should not be used for real navigation decisions.") is accurate, appropriately worded, and appropriately humble — the problem is exclusively **placement** (very bottom of a very long page), not content. No instance was found of the UI *overstating* certainty in result copy itself — `ResultDisplay`/`OutputField` render plain numbers with units, no unwarranted "accurate" or "precise" language attached to individual results. This is a genuine strength worth preserving in any remediation: don't add more disclaimers, relocate the ones that already exist and are correctly worded.

## 20. Monetization UX Audit

`AdPlaceholder` positions (after result, mid-content, bottom of page) are not currently disruptive — `ADS_ENABLED=false` renders only a subtle dashed-border placeholder (SOURCE VERIFIED, `components/ads/AdPlaceholder.tsx`). The "after calculation result" position is worth flagging for the future (I-1) but is not a present defect. `MarineToolsBlock`'s dead-link defect (H-3) is a content-integrity problem, not a positioning problem — its placement (inside "Overview," high on the page) is not inherently wrong for a legitimate affiliate block; it is only a problem because the links don't work. No recommendation to add monetization placements is made, per instruction.

## 21. AEO/Human UX Audit

The AEO layer (`AnswerBlock`, `KeyTakeaways`, `EntityDefinition`) is, on its own, reasonably restrained: one `AnswerBlock` per page, up to 2 `EntityDefinition`s, a short `KeyTakeaways` bullet list. None of these, individually, read as machine-generated filler — SOURCE VERIFIED against several calculators' actual entity text (e.g., `true-magnetic-heading-calculator`'s "Heading"/"Magnetic variation" entities, `radar-horizon-calculator`'s "nautical chart" entity). The AEO layer is **not** the primary source of this audit's findings — the C-1/H-2 problems are non-AEO hardcoded navigation content, not AI-oriented content. One legitimate AEO-adjacent finding: the M-1 duplicate "Formula" heading arises partly because `generated.formulaLine` (AEO/SEO-oriented templated text) and `calculator.formula`/`calculator.formulaDetail` (the "real" formula content) both render in the same section with no visual distinction between the templated sentence and the calculator-specific one — a reader cannot tell which is which.

## 22. Consistency Audit

Per Workstream M, the following are judged **appropriate** differences, not defects: input-count variation across calculators, `CalculatorShell` vs. `CalculatorEngine` having different `InputField` components (I-4), the two-cluster-system architecture in principle (I-3), FAQ length varying by calculator, and the presence/absence of `EntityDefinition` blocks depending on whether an AEO mapping exists.

The following are judged **bad** (implementation-drift) differences: the homepage's duplicate "Most Used" heading with drifted content (H-1), the label inconsistency across the 7-tool priority set (M-5), and the naming collision between the two cluster systems (H-4) — none of these reflect an intentional design decision; they read as independent additions that were never reconciled against each other.

## 23. Remediation Priorities

1. **C-1** — remove/replace the three hardcoded navigation-irrelevant blocks in `CalculatorLayout.tsx`. Highest priority: affects the majority of calculators, actively misleading.
2. **H-3** — fix or remove the dead `MarineToolsBlock` links. Second priority: a broken interactive element live on every page is a fast, low-risk fix.
3. **H-1** — delete the homepage's duplicate hardcoded "Most Used" section. Fast, low-risk, high-visibility (homepage) fix.
4. **H-2** — remove the root-layout global index injection. Requires an explicit decision from the site owner given the SEO-adjacent tradeoff noted in the finding.
5. **H-5** — add a short-form model-disclosure caption near the result for the calculators that need it. Additive, low-risk, but requires new copy to be written per affected calculator.
6. **H-4 / M-8** — reconcile the two "Navigation" destinations and rebuild the 4 cluster-authority pages to match the site's other index templates. Larger scope; treat as its own remediation phase.
7. **Medium findings (M-2 through M-8)** — bundle into the same remediation pass as C-1/H-2 where the fix is already touching the same files.
8. **Low/Informational findings** — address opportunistically; none are urgent.

## 24. Complete Finding Register

See §6–9 above for the full register with all 10 required fields per finding (route, file, current implementation, problem, affected user, severity, evidence, remediation, scope, regression risk). Total: 1 Critical, 5 High, 9 Medium, 4 Low, 4 Informational.

## 25. Certification Decision

# NOT CERTIFIED

One unresolved Critical finding (C-1) and five unresolved High findings (H-1 through H-5) exist. Per the certification rule, this alone is decisive regardless of the site's other strengths (clean hero, correct form semantics, accurate disclaimer wording, restrained AEO layer, functioning calculator index). No fixes were applied during this audit, per instruction. A remediation phase should address C-1 and H-3 first (fast, high-impact, low-risk), then H-1, then bring H-2, H-4/M-8, and H-5 to the site owner as explicit, separately-scoped decisions given their cross-cutting or SEO-adjacent tradeoffs.
