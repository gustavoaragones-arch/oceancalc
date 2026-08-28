# Stage 9 — Final UX & Information Hierarchy Certification

## Status

# STAGE 9 — NOT CERTIFIED

---

## Certification Scope

This audit reconciles the complete Phase 9.0 finding register (1 Critical, 5 High, 9 Medium, 4 Low, 4 Informational — 23 findings total) plus every finding discovered in Phases 9.1–9.7, against the actual current repository source and rendered output. It determines whether Stage 9 — UX & Information Hierarchy — can be certified as a whole. It does not re-open or re-litigate Phase 8 (Maritime Accuracy), which remains separately certified and is only re-verified here for regression.

---

## Baseline Repository

- **HEAD:** `fc0e5fc41f738dbc0dddb8f8c90fc6f537e2e80c` (confirmed via `git rev-parse HEAD`)
- **origin/main:** `fc0e5fc41f738dbc0dddb8f8c90fc6f537e2e80c` (confirmed via `git fetch` + `git rev-parse origin/main`)
- **Working tree:** clean at audit start (`git status --short`, no output)
- This matches the expected Phase 9.7 commit exactly.

---

## Phase History

| Phase | Scope | Status |
|---|---|---|
| 9.0 | UX & Information Hierarchy Audit (baseline) | NOT CERTIFIED (1 Critical, 5 High found) |
| 9.1 | C-1, H-3, H-1 remediation | PASS |
| 9.2 | H-2 remediation | PASS |
| 9.3 | H-4 remediation | PASS |
| 9.4 | H-5 remediation (great-circle-distance-calculator only) | PASS (self-scoped; explicitly not claimed as full H-5 resolution) |
| 9.5 | M-8 remediation (4 cluster authority pages) | PASS |
| Pre-9.6 | Ad placeholder UI cleanup | PASS |
| 9.6 | Responsive & Visual UX certification (found and fixed F-1, found F-2) | PASS (self-scoped; explicitly not claimed as Stage 9 certification) |
| 9.7 | F-2 remediation (found privacy-page finding) | PASS (self-scoped; explicitly not claimed as Stage 9 certification) |

Every individual phase passed **its own narrow scope**. None of them claimed overall Stage 9 certification — each explicitly said so in its own certification section. This audit is the first to evaluate the complete, reconciled register.

---

## Original Phase 9.0 Finding Reconciliation

| ID | Severity | Original Finding | Current Verification | Status | Certification Impact |
|---|---|---|---|---|---|
| C-1 | Critical | Hardcoded navigation-irrelevant content blocks on all 45 calculator pages | SOURCE VERIFIED: `grep` for the three removed block strings in `components/CalculatorLayout.tsx` returns zero matches | **RESOLVED** | None — Critical cleared |
| H-1 | High | Homepage duplicate "Most Used Maritime Calculators" heading, "Nautical Distance Calculator" mislabel | SOURCE VERIFIED: `app/page.tsx` contains zero literal heading text — sole heading comes from one `<MostUsedMaritimeCalculators />` invocation (line 116); "Nautical Distance Calculator" has zero repository-wide matches; "Great Circle Distance Calculator" confirmed as the correct title in `data/calculators.json` | **RESOLVED** | None |
| H-2 | High | Global 45-calculator index + 8 hardcoded links injected in root layout on every page | SOURCE VERIFIED: `AllCalculatorsGrid` absent from `app/layout.tsx`; Footer's "All Calculators" link present (`components/Footer.tsx` line 5) | **RESOLVED** | None |
| H-3 | High | `MarineToolsBlock`'s 3 dead `href="#"` affiliate links | SOURCE VERIFIED: `components/affiliate/` is empty (component file deleted); repository-wide `grep 'href="#"'` returns zero matches | **RESOLVED** | None |
| H-4 | High | `/navigation/` vs. `/navigation-calculations/` naming collision, no cross-links | SOURCE VERIFIED: `app/navigation/page.tsx` links to `/navigation-calculations/` ("Navigation Calculators"); `app/navigation-calculations/page.tsx` links to `/navigation/` ("Navigation Resources") — both directions confirmed present | **RESOLVED** | None |
| H-5 | High | Model-accuracy disclosures buried 5–6 sections below result, on great-circle-distance-calculator, initial-bearing-calculator, mercator-scale-factor-calculator, radar-horizon-calculator, "and any other calculator whose formulaDetail carries a model-assumption disclosure Phase 8 determined was load-bearing" (this explicitly includes wave-height-calculator per the Phase 9.0 matrix, row 10) | SOURCE VERIFIED: `components/CalculatorLayout.tsx` line 90 shows the near-result short-form disclosure is gated **only** on `calculator.slug === "great-circle-distance-calculator"`. The other 4 named/implied calculators (`initial-bearing-calculator`, `mercator-scale-factor-calculator`, `radar-horizon-calculator`, `wave-height-calculator`) still carry their `formulaDetail` text only in the page's "Formula" section — the same buried position H-5 originally flagged. Phase 9.4's own certification states: *"H-5 is resolved for `great-circle-distance-calculator`... [initial-bearing, mercator-scale-factor] are documented as open findings for a future, separately-scoped phase."* Phase 9.4 never triaged `wave-height-calculator` at all, and grouped `radar-horizon-calculator` only as "the exact given sentence doesn't apply here" — it did not evaluate whether radar-horizon's own accurate wording should move nearer the result. | **PARTIALLY RESOLVED — 1 of 5 calculators fixed; 2 explicitly deferred with documented reasoning (initial-bearing, mercator-scale-factor); 2 never explicitly triaged for the placement dimension (radar-horizon, wave-height)** | **BLOCKS full certification** — a High finding must be fully RESOLVED per the certification gate; this one is not. |
| M-1 | Medium | Duplicate "Formula" heading (once in `CalculatorEngine`'s own widget, once in `CalculatorLayout`'s page section) | SOURCE VERIFIED: `components/calculator-engine/CalculatorEngine.tsx` line 171 and `components/CalculatorLayout.tsx` line 146 both render "Formula" — unchanged. Applies to all 42 `engine`-type calculators (not the 3 `simpleRegistry`-only calculators). | **OPEN — not addressed by any Stage 9 phase** | Non-blocking: cosmetic heading duplication, does not mislead or break a task. Carried forward. |
| M-2 | Medium | Two structurally different related-calculators blocks (dynamic `RelatedCalculators` + hardcoded "Related Navigation Calculations") | SOURCE VERIFIED: the hardcoded block was deleted in 9.1 (part of the C-1 fix); only the dynamic `RelatedCalculators` remains | **RESOLVED** (as a byproduct of the C-1 fix) | None |
| M-3 | Medium | "Explore Related Calculation Categories" — 3 links, different anchor text, all `href="/tools/"` | SOURCE VERIFIED: `components/CalculatorLayout.tsx` lines 209–226 — confirmed 3 `<Link href="/tools/">` entries with different anchor text, unchanged | **OPEN — not addressed by any Stage 9 phase** | Non-blocking: all three destinations are factually correct (each genuinely leads to "browse calculators"); this is a copy-quality issue, not a misleading-content or broken-functionality issue. Carried forward. |
| M-4 | Medium | Footer "Privacy Policy" appears twice (two different rows/styles) | SOURCE VERIFIED: `components/Footer.tsx` line 6 and line 42, unchanged | **OPEN — not addressed by any Stage 9 phase** | Non-blocking: both links go to the same correct destination; minor visual redundancy only. Carried forward. |
| M-5 | Medium | Inconsistent labeling of the same 7-tool priority set ("Most Used Maritime Calculators," "Popular calculators," "Popular Calculators") | SOURCE VERIFIED: all three label variants still present across `MostUsedMaritimeCalculators.tsx`, `PriorityCalculatorsStrip.tsx`, `CalculatorCategoryLinks.tsx`, `app/tools/page.tsx`, and the now-orphaned `AllCalculatorsGrid.tsx`, unchanged | **OPEN — not addressed by any Stage 9 phase** | Non-blocking: cosmetic label-consistency issue, does not affect comprehension of what the link does. Carried forward. |
| M-6 | Medium | `.card` utility's `hover:-translate-y-1` applied to non-clickable static sections | SOURCE VERIFIED: `app/globals.css` line 49, unchanged; `SidebarNavigation.tsx` remains the only component that explicitly overrides it | **OPEN — not addressed by any Stage 9 phase** | Non-blocking: a minor visual-affordance mismatch (implies clickability where none exists), does not trap or mislead users into a broken action. Carried forward. |
| M-7 | Medium | `ResultDisplay`'s caption is generic/calculator-agnostic, only used by 3 `simpleRegistry` calculators | SOURCE VERIFIED: `components/calculator/ResultDisplay.tsx` line 34, unchanged. Currently used only by `nautical-mile-converter`, `knots-to-kmh`, `sailing-time-calculator` — all three are navigation/passage-planning-adjacent, so the claim remains accurate for its current usage. | **VERIFIED NON-DEFECT (currently)** — flagged as fragile if `CalculatorShell` is ever reused for a non-navigation calculator, per Phase 9.0's own caveat | None — not currently a defect |
| M-8 | Medium | 4 cluster authority pages share the thinnest template on the site (naive slug-to-text labels, no cards, no descriptions) | RENDERED VERIFIED + SOURCE VERIFIED: `git log` confirms none of the 5 Phase 9.5 files (`app/navigation-calculations/page.tsx` and 3 siblings, `components/ClusterCalculatorList.tsx`) have changed since commit `88f9202`. Fresh recount of `data/calculatorClusters.json`: navigation=14, maritime-measurements=4, wind-waves=5, sailing-performance=10 — all match. Confirmed rendered correctly in this audit's own browser regression (Workstream C). | **RESOLVED** | None |
| M-9 | Medium | `nautical-mile-converter` has both `simpleRegistry` and `engine` configs; `CalculatorRenderer.tsx` picks `simpleRegistry` first, so the `engine`'s 3-output config (km/mi/m) is dead, while the page's `formula` text still describes all 3 conversions and the live widget shows only 1 | SOURCE VERIFIED (fresh, this audit): `data/calculators.json`'s `nautical-mile-converter` entry still has both `simpleRegistry` and `engine` keys (`engine.outputs` = 3 entries: kilometers, miles, meters); `components/CalculatorRenderer.tsx` lines 17–19 still check `simpleRegistry` before `engine`; `formula` field still reads "1 nautical mile = 1,852 m = 1.852 km. 1 nm ≈ 1.15078 statute miles ≈ 6,076 feet." `git log` confirms zero Stage 9 commits touched `CalculatorRenderer.tsx`, `data/calculators.json`, `CalculatorShell.tsx`, or `ResultDisplay.tsx`. | **OPEN — completely unaddressed by any Stage 9 phase; never explicitly deferred with reasoning by any phase either** | **BLOCKS full certification** — this is a genuine content/widget mismatch on one of the site's highest-traffic calculators (listed in "Most Used Maritime Calculators"); it does not qualify for a comfortable non-blocking deferral. |
| L-1 | Low | Static "Updated recently..." freshness line on every calculator page regardless of actual freshness | SOURCE VERIFIED: `components/CalculatorLayout.tsx` line 68, unchanged | **OPEN — not addressed** | Non-blocking (Low severity by original classification). Carried forward. |
| L-2 | Low | FAQ sections render fully expanded, no accordion | SOURCE VERIFIED (via `git log`): `components/FAQ.tsx` untouched since Phase 8 | **OPEN — not addressed** | Non-blocking (Low). Carried forward. |
| L-3 | Low | No visual affordance signaling live-update (no submit button) behavior | SOURCE VERIFIED (via `git log`): `CalculatorEngine.tsx`/`CalculatorShell.tsx` untouched since Phase 8 | **OPEN — not addressed** | Non-blocking (Low). Carried forward. |
| L-4 | Low | `EntityDefinition` region has `aria-label` but no visible heading | SOURCE VERIFIED: `components/CalculatorLayout.tsx` line 104, unchanged | **OPEN — not addressed** | Non-blocking (Low). Carried forward. |
| I-1 | Informational | `AdPlaceholder` positioned directly after result; flagged for awareness before ads activate | SOURCE VERIFIED: `AdPlaceholder.tsx` now unconditionally returns `null` (Pre-9.6 cleanup) — the dashed-border UI this note was about no longer exists in any form | **SUPERSEDED / RESOLVED** — the referenced UI element was removed entirely by a later phase, not merely repositioned | None |
| I-2 | Informational | Dark mode via `prefers-color-scheme` only, no manual toggle | SOURCE VERIFIED: unchanged | **VERIFIED NON-DEFECT** | None |
| I-3 | Informational | Two independent "cluster" data systems (`calculatorClusters.json` vs. topic-article JSON) | SOURCE VERIFIED: both `data/calculatorClusters.json` and `data/navigation.json` (representative topic file) still exist as distinct systems | **VERIFIED NON-DEFECT** | None |
| I-4 | Informational | Two different `InputField` components for the two calculator shells | SOURCE VERIFIED: `components/calculator/InputField.tsx` and `components/calculator-engine/InputField.tsx` both still exist | **VERIFIED NON-DEFECT** | None |

**Tally:** 1 Critical (resolved), 5 High (4 resolved, 1 partially resolved — blocking), 9 Medium (2 resolved, 1 verified non-defect, 6 open — 1 blocking [M-9], 5 non-blocking carried forward), 4 Low (all open, non-blocking by original severity), 4 Informational (1 superseded, 3 verified non-defect).

---

## Phase 9.1–9.7 Verification

| Phase | Original Finding | Remediation | Current Verification | Status |
|---|---|---|---|---|
| 9.1 | C-1, H-3, H-1 | Deleted 3 hardcoded content blocks; deleted `MarineToolsBlock`; deleted homepage duplicate section | Re-confirmed this audit via fresh `grep`/source read — all three remain resolved | **Holds** |
| 9.2 | H-2 | Removed `AllCalculatorsGrid` + 2 hardcoded rows from root layout; added Footer "All Calculators" link | Re-confirmed this audit — `app/layout.tsx` has no `AllCalculatorsGrid`; Footer link present | **Holds** |
| 9.3 | H-4 | Added bidirectional cross-links between `/navigation/` and `/navigation-calculations/` | Re-confirmed this audit — both links present, correct labels, correct destinations | **Holds** |
| 9.4 | H-5 (great-circle only) | Added near-result short-form disclosure, gated by slug | Re-confirmed this audit — conditional intact in `CalculatorLayout.tsx`; RENDERED VERIFIED in this audit's browser regression that no overflow/regression exists | **Holds for great-circle specifically; remainder of H-5 remains open (see reconciliation table above)** |
| 9.5 | M-8 | Rebuilt all 4 cluster authority pages with exact H1s, exact intro copy, canonical titles, sibling navigation, "View All Maritime Calculators" | Re-confirmed this audit — `git log` shows no changes since certified commit; fresh cluster-count recount matches exactly | **Holds** |
| Pre-9.6 | Visible OceanCalc ad placeholder UI | `AdPlaceholder.tsx` changed to unconditionally return `null` | Re-confirmed this audit — RENDERED VERIFIED, zero "Ad slot" text on any of the 4 routes tested in this audit's browser regression, both viewports | **Holds** |
| 9.6 | F-1 (header nav overlap), F-2 (found, deferred) | `h-16` → `min-h-16` on Header's inner flex row | Re-confirmed this audit — RENDERED VERIFIED, `headerHeight` grows correctly on mobile (113px @ 390px), zero nav links above viewport or below header box, zero overflow, on all 4 routes tested | **Holds** |
| 9.7 | F-2 (footer credit-link color-only distinction) | `hover:underline` → `underline` on the one affected link | Re-confirmed this audit — RENDERED VERIFIED, `creditLinkUnderline: "underline"` on all 4 routes/2 viewports tested; AUTOMATED VERIFIED via axe-core, zero `link-in-text-block` violations on `/`, `/tools/nautical-mile-converter/`, `/navigation-calculations/` (down from 1 each pre-fix) | **Holds** |

No regression was found in any of Phases 9.1–9.7's remediated behavior.

---

## Responsive Certification

**Current application changes since the Phase 9.6 certification:** confirmed via `git diff --stat 5149612 HEAD` — exactly one application file (`components/Footer.tsx`, 1 line) plus the Phase 9.7 documentation file. No other file changed. Given this, a full repeat of Phase 9.6's 144-combination sweep was not necessary; a targeted rendered regression was performed instead, per this phase's explicit instruction.

- **Browser:** Playwright 1.62.1 driving the system-installed Google Chrome (`channel: 'chrome'`) — same tool/method as Phase 9.6.
- **Viewports:** 1440×900, 390×844.
- **Routes:** `/`, `/tools/nautical-mile-converter/`, `/navigation-calculations/`, `/privacy/`.
- **Target:** current local production build (`out/`, from a fresh `rm -rf out .next && npm run build`), served locally — not production, to test the exact current committed state directly.

**Results (8 route×viewport combinations):**

| Route | Viewport | Overflow | Header height | Nav above viewport | Nav below header | "Ad slot" text | Footer credit link underline |
|---|---|---|---:|---|---|---|---|
| `/` | 1440×900 | No | 65px | No | No | Absent | underline |
| `/tools/nautical-mile-converter/` | 1440×900 | No | 65px | No | No | Absent | underline |
| `/navigation-calculations/` | 1440×900 | No | 65px | No | No | Absent | underline |
| `/privacy/` | 1440×900 | No | 65px | No | No | Absent | underline |
| `/` | 390×844 | No | 113px | No | No | Absent | underline |
| `/tools/nautical-mile-converter/` | 390×844 | No | 113px | No | No | Absent | underline |
| `/navigation-calculations/` | 390×844 | No | 113px | No | No | Absent | underline |
| `/privacy/` | 390×844 | No | 113px | No | No | Absent | underline |

**Conclusion:** the Phase 9.6 certification remains fully valid. The header fix, the AdPlaceholder cleanup, and the new Footer fix are all confirmed intact and regression-free on the current committed state, on both a desktop and a mobile viewport, across all 4 tested route types (homepage, calculator, cluster authority, legal page).

---

## Accessibility Certification

- **Tool/configuration:** axe-core, `runOnly: ['wcag2a', 'wcag2aa']` — identical to Phases 9.6/9.7.
- **Routes:** `/`, `/tools/nautical-mile-converter/`, `/navigation-calculations/`, `/privacy/`.
- **Viewports:** 1440×900, 390×844 (8 scans total).

| Route | Desktop violations | Mobile violations |
|---|---|---|
| `/` | 0 | 0 |
| `/tools/nautical-mile-converter/` | 0 | 0 |
| `/navigation-calculations/` | 0 | 0 |
| `/privacy/` | 1 (`link-in-text-block`, 2 nodes) | 1 (`link-in-text-block`, 2 nodes) |

**Footer credit-line link (Phase 9.7's F-2):** confirmed free of the original violation on all 4 routes (all of which render the global Footer) — 0 violations where previously 1 existed.

**Known privacy-page finding:** confirmed still present, unchanged, exactly as Phase 9.7 discovered it — the same 2 nodes (`<a href="/cookies/">Cookies</a>` and `<a href="mailto:contact@oceancalc.com">contact@oceancalc.com</a>` in `app/privacy/page.tsx`, both relying on color alone in their default state). Not fixed in this audit, per instruction. This is the same class of defect as F-2, using the identical remediation pattern already proven safe in Phase 9.7, but applying that fix was explicitly out of scope for an audit-only phase.

No new accessibility violations were found anywhere.

---

## Information Hierarchy Certification

Audited (rendered + source) for one clear primary purpose, appropriate heading hierarchy, calculator/result prominence, and appropriate subordination of explanatory content:

- **Homepage:** single clear hero (H1 + CTA), category grid, one "Most Used" section, cluster grid, footer — sound, matches Phase 9.0's own assessment that the hero itself was never a problem.
- **Tools index (`/tools/`):** one H1, one intro, category quick-links, "Popular calculators," "All maritime calculators" — unchanged, still the cleanest large index on the site (Phase 9.0's own assessment, re-confirmed still true since this page was never modified in Stage 9).
- **Representative calculator (`nautical-mile-converter`):** H1 → description → calculator widget (result-adjacent) → AnswerBlock → entity definitions → RelatedCalculators → Overview → How-to-use → Formula → practical content → FAQ → category links → disclaimer. The calculator remains visually and structurally the primary element; explanatory content correctly follows it. (M-9's content/widget mismatch is a correctness issue within this hierarchy, not a hierarchy-ordering issue — the ordering itself is sound.)
- **`/navigation/` (topic hub):** unchanged since Phase 9.3 — educational-article hub with correct H1, sidebar, priority-calculator strip, and now a cross-link to `/navigation-calculations/`.
- **`/navigation-calculations/` (cluster authority):** RENDERED VERIFIED this audit — exact H1 "Navigation Calculations," exact required intro paragraph, canonical-titled calculator cards, sibling-navigation section, "View All Maritime Calculators" link — functions correctly as a calculator authority hub, structurally distinct from and correctly cross-linked to `/navigation/`.
- **All 4 cluster authority pages:** confirmed structurally consistent with each other (same template, correctly parameterized per cluster) — no orphaned or under-built page among them.
- **`/privacy/`, `/about/`:** legal-page hierarchy is sound — plain H1, section headings, body text, no inappropriate calculator or navigation content injected (H-2's fix holds here specifically). The privacy-page inline-link finding is an accessibility/contrast issue, not a hierarchy defect.

No new hierarchy-level defect was found. The site's overall intended hierarchy (H1 → purpose → task → result → interpretation → explanation → related/category navigation) remains intact wherever it was previously certified, and is unchanged wherever it wasn't touched.

---

## Navigation Architecture Certification

- **Homepage → Tools → Cluster authority → Calculator → Related/category links:** confirmed intact and functional. `/tools/` remains the complete, canonical 45-calculator index (unchanged, unreduced). Each of the 4 cluster authority pages correctly links to its full, verified-complete cluster membership plus the 3 sibling clusters plus `/tools/`.
- **No orphaned cluster pages:** all 4 confirmed reachable from the homepage `ClusterHub` and `/tools/`'s quick-links row (unchanged architecture).
- **No dead navigation links:** zero `href="#"` anywhere in the repository (H-3, re-confirmed).
- **No redundant global calculator grid:** `AllCalculatorsGrid` remains correctly unused/orphaned (not wired into any route), exactly as Phase 9.2 explicitly authorized.
- **No contradictory labels:** `/navigation/` and `/navigation-calculations/` remain clearly distinguished with correct, bidirectional cross-links (H-4, re-confirmed). M-5's label-inconsistency finding (different words for the same "popular calculators" concept across components) is a genuine but non-blocking naming-consistency issue, not a contradiction that misleads navigation.
- **No navigation loops that obscure hierarchy:** the two-cluster-system architecture (calculator clusters vs. topic-article hubs) remains an intentional, correctly-cross-linked design (I-3), not a loop.

This is a UX/information-hierarchy assessment only — no sitemap, metadata, canonical, or robots configuration was inspected or modified.

---

## Cluster Authority Certification

All 4 cluster authority pages independently re-verified this audit:

| Cluster page | H1 | Intro copy | Calculator count (expected/actual) | Sibling nav | View All link |
|---|---|---|---:|---|---|
| `/navigation-calculations/` | "Navigation Calculations" | Exact required text (unchanged since 9.5) | 14/14 | 3 links, correct | Present |
| `/distance-measurement-calculators/` | "Distance & Measurement Calculators" | Exact required text | 4/4 | 3 links, correct | Present |
| `/wind-wave-calculators/` | "Wind & Wave Calculators" | Exact required text | 5/5 | 3 links, correct | Present |
| `/sailing-performance-calculators/` | "Sailing Performance Calculators" | Exact required text | 10/10 | 3 links, correct | Present |

Verified via `git log` (zero changes since the certified Phase 9.5 commit `88f9202`) and a fresh recount against `data/calculatorClusters.json`. Zero missing, zero extra, zero duplicate calculators across all 4 clusters. RENDERED VERIFIED for `/navigation-calculations/` in this audit's own browser regression (Workstream C).

---

## Calculator Matrix

All 45 calculators, current status. Every calculator inherited the site-wide C-1/H-2/H-3 patterns in Phase 9.0 — **all three are now globally resolved** and removed as a risk factor for every row below. The site-wide M-3 (triple `/tools/` link) and, for the 42 `engine`-type calculators, M-1 (duplicate "Formula" heading) remain open but non-blocking, as reconciled above, and are not repeated per-row. Only calculator-specific remaining conditions (H-5, M-9) are called out individually.

| # | Slug | Category | Render path | C-1/H-2/H-3 (global) | Calculator-specific open item | Overall status |
|---|---|---|---|---|---|---|
| 1 | nautical-mile-converter | maritime-measurements | simpleRegistry (CalculatorShell) | Resolved | **M-9 — OPEN** (engine's 3-output config dead; formula text describes 3 conversions, widget shows 1) | **Needs work** |
| 2 | knots-speed-converter | maritime-measurements | engine | Resolved | None | Good |
| 3 | knots-to-kmh | maritime-measurements | simpleRegistry (CalculatorShell) | Resolved | None | Good |
| 4 | distance-to-horizon-calculator | navigation | engine | Resolved | None | Good |
| 5 | sailing-time-calculator | sailing | simpleRegistry (CalculatorShell) | Resolved | None | Good |
| 6 | great-circle-distance-calculator | navigation | engine | Resolved | H-5 — **RESOLVED** (near-result short disclosure present) | Good |
| 7 | anchor-scope-calculator | sailing | engine | Resolved | None | Good |
| 8 | beaufort-scale-calculator | wind-waves | engine | Resolved | None | Good |
| 9 | apparent-wind-calculator | wind-waves | engine | Resolved | None | Good |
| 10 | wave-height-calculator | wind-waves | engine | Resolved | H-5-class — **OPEN** (fully-developed-sea disclosure still only in buried Formula section; never triaged by any phase) | **Needs work** |
| 11 | boat-fuel-consumption-calculator | sailing | engine | Resolved | None | Good |
| 12 | fathom-converter | maritime-measurements | engine | Resolved | None | Good |
| 13 | wind-chill-calculator | wind-waves | engine | Resolved | None | Good |
| 14 | hull-speed-calculator | sailing-performance | engine | Resolved | None | Good |
| 15 | initial-bearing-calculator | navigation | engine | Resolved | H-5 — **INTENTIONALLY DEFERRED** (Phase 9.4 explicitly evaluated and declined to reuse the great-circle sentence; documented as a future-phase candidate) | Fair (documented deferral) |
| 16 | rhumb-distance-calculator | navigation | engine | Resolved | None (Phase 9.4 confirmed not spherical great-circle geometry; disclosure correctly worded and less buried) | Good |
| 17 | statute-nautical-mile-converter | conversions | engine | Resolved | None | Good |
| 18 | celsius-fahrenheit-converter | conversions | engine | Resolved | None (the original primary evidence case for C-1, now confirmed clean) | Good |
| 19 | feet-meters-converter | conversions | engine | Resolved | None | Good |
| 20 | latitude-degrees-to-nm-calculator | navigation | engine | Resolved | None | Good |
| 21 | vmg-calculator | sailing-performance | engine | Resolved | None | Good |
| 22 | fuel-range-nautical-calculator | sailing-performance | engine | Resolved | None | Good |
| 23 | anchor-shackle-rode-calculator | sailing-performance | engine | Resolved | None | Good |
| 24 | bar-psi-converter | conversions | engine | Resolved | None | Good |
| 25 | liters-us-gallons-converter | conversions | engine | Resolved | None | Good |
| 26 | cable-nautical-mile-converter | conversions | engine | Resolved | None | Good |
| 27 | geographic-range-lights-calculator | navigation | engine | Resolved | None | Good |
| 28 | radar-horizon-calculator | navigation | engine | Resolved | H-5-class — **OPEN** (4/3-Earth-radius disclosure still only in buried Formula section; Phase 9.4 confirmed the wording is accurate and the exact great-circle sentence doesn't apply, but never assessed whether its own wording should move nearer the result) | **Needs work** |
| 29 | drift-set-distance-calculator | navigation | engine | Resolved | None | Good |
| 30 | sail-area-displacement-calculator | sailing-performance | engine | Resolved | None | Good |
| 31 | capsize-screening-calculator | sailing-performance | engine | Resolved | None | Good |
| 32 | pounds-kilograms-converter | conversions | engine | Resolved | None | Good |
| 33 | kilowatts-horsepower-converter | conversions | engine | Resolved | None | Good |
| 34 | meters-second-knots-converter | conversions | engine | Resolved | None | Good |
| 35 | inches-mercury-millibar-converter | conversions | engine | Resolved | None | Good |
| 36 | bilge-pump-time-calculator | sailing-performance | engine | Resolved | None | Good |
| 37 | wave-length-from-period-calculator | wind-waves | engine | Resolved | None (deep-water assumption disclosed in `formula` field, not buried the same way) | Good |
| 38 | longitude-minute-nautical-mile-calculator | navigation | engine | Resolved | None | Good |
| 39 | true-magnetic-heading-calculator | navigation | engine | Resolved | None | Good |
| 40 | cross-track-error-calculator | navigation | engine | Resolved | None (confirmed still correctly small-angle-planar, not mislabeled as great-circle geometry) | Good |
| 41 | speed-over-ground-calculator | navigation | engine | Resolved | None | Good |
| 42 | mercator-scale-factor-calculator | navigation | engine | Resolved | H-5 — **INTENTIONALLY DEFERRED** (Phase 9.4 explicitly evaluated and declined — output is a scale factor, not a distance; documented as a future-phase candidate) | Fair (documented deferral) |
| 43 | anchor-rode-shackles-calculator | sailing-performance | engine | Resolved | None | Good |
| 44 | square-feet-square-meters-converter | conversions | engine | Resolved | None | Good |
| 45 | cubic-feet-liters-converter | conversions | engine | Resolved | None | Good |

**Tally:** 45/45 calculators individually reconciled. 40 "Good" (C-1/H-2/H-3 resolved, no calculator-specific open item beyond the site-wide non-blocking M-1/M-3). 2 "Fair" (initial-bearing, mercator-scale-factor — H-5 explicitly deferred with documented reasoning, not silently dropped). 3 "Needs work" (nautical-mile-converter — M-9 open; wave-height-calculator, radar-horizon-calculator — H-5-class disclosure placement never explicitly triaged).

---

## AdSense Boundary

**OceanCalc UI:** confirmed clean in this audit's browser regression — zero "Ad slot" text, zero dashed-placeholder markup on any of the 4 tested routes at either viewport. `lib/ads.ts`, `app/layout.tsx`, and `components/ads/AdPlaceholder.tsx` were not inspected for changes beyond confirming (via `git diff --stat`) that none occurred since Phase 9.6 — they were not modified in this audit.

**Google Auto Ads:** not independently re-tested this audit (Phase 9.6 already documented this as external, informational-only behavior, unrelated to OceanCalc's own UX). No AdSense configuration was inspected, modified, or evaluated for correctness in this audit — that remains explicitly out of Stage 9's scope.

---

## Phase 8 Protection

`lib/formulaParser.ts`, `data/calculators.json`, `data/calculators-phase5.json` — `git log` confirms the most recent commit touching any of these three files is `71db77a Phase 8 maritime accuracy remediation and release`; **zero Stage 9 commits (9.0 through 9.7) have touched any of them.** `npm test`'s 130-assertion suite (full parse-and-evaluate pass of every calculator formula, including the certified radar-horizon, wave-height, true/magnetic-heading, and Beaufort corrections) passed 130/130 in this audit's regression run, identical to every prior phase's result. No numerical logic has been altered anywhere in Stage 9.

---

## Remaining Findings

Nothing has been silently dropped from the register. Full remaining-findings list, carried forward:

**Blocking (must be resolved, explicitly re-scoped, or formally re-classified by the site owner before Stage 9 can certify):**
- **H-5 remainder** — `wave-height-calculator` and `radar-horizon-calculator` never explicitly triaged for disclosure placement; `initial-bearing-calculator` and `mercator-scale-factor-calculator` explicitly deferred by Phase 9.4 but still genuinely open.
- **M-9** — `nautical-mile-converter`'s dead `engine` output config and formula-text/widget mismatch, unaddressed since Phase 9.0.
- **Privacy-page inline links** (`app/privacy/page.tsx` — "Cookies," `contact@oceancalc.com`) — same `link-in-text-block` defect as F-2, discovered in Phase 9.7, not yet fixed.

**Non-blocking, carried forward (Medium, explicitly reasoned as non-blocking in this audit):**
- M-1 — duplicate "Formula" heading (engine-type calculators).
- M-3 — "Explore Related Calculation Categories," 3 links all to `/tools/`.
- M-4 — Footer "Privacy Policy" link duplication.
- M-5 — inconsistent "Popular"/"Most Used" labeling.
- M-6 — `.card` hover-lift on non-clickable sections.
- M-7 — `ResultDisplay`'s generic caption (verified non-defect for current usage, flagged if `CalculatorShell` is reused).

**Non-blocking, carried forward (Low, by original severity):**
- L-1 — static freshness line.
- L-2 — FAQ has no accordion/collapse.
- L-3 — no visual live-update affordance.
- L-4 — `EntityDefinition` region has no visible heading.

**Resolved / non-defect / superseded (no further action):**
- I-1 (superseded — the referenced UI no longer exists), I-2, I-3, I-4 (all verified non-defect).

---

## Stage 9 Certification Decision

# STAGE 9 — NOT CERTIFIED

**Exact blocking findings:**

1. **H-5 (High, partial)** — 2 of 5 originally-implicated calculators (`radar-horizon-calculator`, `wave-height-calculator`) have never been explicitly evaluated for whether their existing, accurate model-assumption disclosure should be surfaced near the result; 2 more (`initial-bearing-calculator`, `mercator-scale-factor-calculator`) were explicitly and soundly deferred by Phase 9.4 but remain genuinely unresolved. A High finding must be fully RESOLVED to certify Stage 9; this one is not.
2. **M-9 (Medium, open, no deferral)** — `nautical-mile-converter`'s dead `engine` configuration and the resulting formula-text/widget-output mismatch has never been fixed or explicitly documented as non-blocking by any phase. Given its real content-accuracy impact on one of the site's highest-traffic calculators, this audit does not classify it as non-blocking.
3. **Privacy-page inline links (Medium, open)** — the same class of defect just proven fixable in Phase 9.7, using the identical remediation pattern, discovered but explicitly left unfixed per that phase's scope.

**Recommended remediation phases** (not implemented in this audit, per instruction):

- **A model-disclosure completion phase** (e.g., "Phase 9.8 — Model Disclosure Completion") to resolve the H-5 remainder: either add calculator-appropriate short-form disclosures near the result for `radar-horizon-calculator` and `wave-height-calculator` (using calculator-specific wording, not the great-circle sentence verbatim), and reach a final decision — fix or formally, deliberately defer with owner sign-off — for `initial-bearing-calculator` and `mercator-scale-factor-calculator`.
- **A nautical-mile-converter reconciliation phase** (e.g., "Phase 9.9 — Nautical Mile Converter Output Reconciliation") to resolve M-9: either make the `engine`'s 3-output configuration reachable (fixing the render-path precedence or removing the shadowing `simpleRegistry` config) so the widget matches the formula text, or edit the formula text to describe only the single conversion the widget actually shows. No calculation logic itself needs to change — Phase 8's certified values are unaffected either way.
- **A privacy-page link accessibility phase** (could be folded into either of the above, or run standalone, e.g., "Phase 9.10 — Privacy Page Link Accessibility") applying the exact same fix pattern already proven in Phase 9.7 (`hover:underline` → `underline`) to the "Cookies" and `contact@oceancalc.com` links in `app/privacy/page.tsx`.

Once these three items are resolved (or the two Mediums are formally, explicitly re-classified as non-blocking by the site owner with documented reasoning, and the H-5 remainder is fully resolved — a High finding has no such exception under the certification gate), Stage 9 should be re-audited for final certification. This audit does not claim overall Stage 9 certification, and no application code was modified to produce it.
