# Phase 9.4 — Contextual Information Hierarchy & Model Disclosure

**Date:** 2026-08-25
**Basis:** `docs/audits/phase-9.0-ux-information-hierarchy-audit.md`, `docs/audits/phase-9.0-ux-information-hierarchy-matrix.md`, `docs/audits/phase-9.1-critical-ux-remediation.md`, `docs/audits/phase-9.2-global-navigation-remediation.md`, `docs/audits/phase-9.3-navigation-architecture-remediation.md` — all read in full before any change. This phase addresses exactly one finding: H-5.

## Status

# PASS

## Finding Addressed

H-5

---

## Original Problem

Phase 9.0 found that `great-circle-distance-calculator`'s spherical-Earth model disclosure — the sentence explaining that results are an approximation of the ellipsoidal geodesic distance — sat inside the "Formula" section, which Phase 9.0's live rendering check placed 5–6 major headings below the calculator's result. Re-confirmed by direct inspection of the pre-remediation `components/CalculatorLayout.tsx`: between `{children}` (the calculator widget and its result) and the "Formula" section (line 135 onward, pre-change) sat, in order, an ad placeholder, `AnswerBlock`, entity definitions, `RelatedCalculators`, "Overview," and "How to use" — meaning a user could compute a distance, read the number, and leave the page without ever encountering the one sentence explaining that the number is a spherical approximation, not an ellipsoidal-precision distance.

---

## Pre-Remediation Architecture

```
calculator widget (CalculatorEngine, includes its own internal "Result" and compact "Formula" blocks)
  ↓
ad placeholder ("after calculation result")
  ↓
AnswerBlock (AEO Q&A)
  ↓
entity definitions (if mapped)
  ↓
RelatedCalculators
  ↓
"Overview" section (generated intro + KeyTakeaways)
  ↓
"How to use" section
  ↓
"Formula" section  ←  detailed spherical-Earth disclosure lived here, buried
  ↓
"Practical use cases" → "Tips" → "Practical examples" → FAQ → ...
```

This ordering is confirmed by direct source read of `components/CalculatorLayout.tsx` prior to this phase's edit, and independently re-confirmed by inspecting the generated static HTML's byte offsets for `great-circle-distance-calculator` before the fix (Result heading, then ~7,000+ bytes of intervening markup, then the Formula section containing the disclosure).

---

## Model Audit

Every calculator plausibly using a spherical-Earth model was inspected directly against its actual formula implementation (`lib/formulaParser.ts`) before any decision was made, per instruction not to assume the Phase 8 list is exhaustive or to blindly apply the exact Great Circle sentence elsewhere.

| Calculator | Actual mathematical model | Output type | Disclosure required (per this phase's exact wording)? | Existing disclosure status | Action taken |
|---|---|---|---|---|---|
| `great-circle-distance-calculator` | Haversine — true spherical trigonometry (`haversine_nm`, R=3,440.065 nm) | **Distance** | **Yes** — the exact given sentence ("...approximation of real-world geographic distance") accurately describes this calculator's output | Detailed version existed, but buried (see above) | **Remediated this phase** — short version added immediately after the result |
| `initial-bearing-calculator` | Forward-azimuth spherical trigonometry (`initial_bearing_deg`) — same underlying spherical-trigonometric family as great-circle | **Bearing (angle)**, not distance | The exact given sentence is **not accurate** for this calculator — it explicitly says "geographic distance," which misdescribes a bearing/angle output | Has its own accurate disclosure (`formulaDetail`: "...spherical-Earth geometry and is an approximation of the corresponding ellipsoidal geodesic bearing"), architecturally in the same buried position as great-circle's was | **Documented, not remediated.** Applying the exact Great Circle sentence verbatim would be factually wrong for this calculator's output type; inventing new generalized wording was out of scope for this phase per instruction. This is flagged as a candidate for a future, similarly-scoped phase with calculator-specific wording, not silently fixed here. |
| `mercator-scale-factor-calculator` | Spherical Mercator projection (`mercator_scale_factor`, k=sec(φ)) | **Scale factor (dimensionless ratio)**, not distance | The exact given sentence is **categorically inapplicable** — this calculator does not compute a distance at all | Has its own accurate disclosure (`formulaDetail`: "...spherical Mercator model and does not account for ellipsoidal geodesic corrections"), same buried position | **Documented, not remediated.** No calculator-specific wording was authorized for this phase; the exact given sentence would misdescribe the output entirely if applied. |
| `rhumb-distance-calculator` | Mid-latitude plane sailing (`rhumb_distance_nm`: `Δlat×60`, `Δlon×60×cos(mean lat)`) — **confirmed, not spherical great-circle trigonometry** (no `haversine`/`atan2` spherical calls in the implementation) | Distance | **No** — re-verified this phase against the live implementation; Phase 8's finding that this calculator does not use spherical great-circle geometry was not reversed, since fresh inspection of the current source confirms it | Already has its own, different, accurate disclosure (plane-sailing approximation) | **No action** — correctly excluded |
| `cross-track-error-calculator` | Planar small-angle linearization (`cross_track_error_nm`: `along × sin(error)`) — **confirmed, no lat/lon inputs, no spherical trigonometry at all** | Distance | **No** — re-verified this phase | Already has its own accurate disclosure ("small-angle linearized...for quick mental checks") | **No action** — correctly excluded |
| `distance-to-horizon-calculator`, `radar-horizon-calculator`, `geographic-range-lights-calculator` | Curvature-tangent-line formulas (`1.17×√h`, `1.23×√(h/0.3048)`, `1.17×(√eye+√light)`) — a different category from lat/lon-to-lat/lon geodesic trigonometry; each already carries its own refraction/atmospheric-assumption disclosure | Distance (horizon range) | **No** — these do not compute a distance *between two given coordinates* the way great-circle/initial-bearing/rhumb do; the exact given sentence's framing ("real-world geographic distance" between an implied pair of points) does not match what these calculators do | Each already has its own accurate, model-appropriate disclosure | **No action** — out of category, and each already discloses correctly |
| `hull-speed-calculator` (inspected as one of the six required representative-check routes) | Empirical Froude-number-based formula, no Earth-geometry involved | N/A | **No** — not a geographic calculator at all | N/A | **No action** — not applicable |

**Conclusion of the audit:** exactly one calculator both (a) uses true spherical great-circle trigonometry and (b) outputs a distance, matching the exact wording this phase was authorized to deploy: `great-circle-distance-calculator`. `initial-bearing-calculator` and `mercator-scale-factor-calculator` share the same underlying spherical-model *architecture problem* (their own accurate disclosures are similarly buried), but remediating them would require calculator-specific wording this phase was not authorized to invent, so they are documented here as open findings for a future phase rather than fixed with inaccurate copy.

---

## Exact Remediation

**Sentence (verbatim, unmodified):**
> "This calculation uses a spherical-Earth model, so results are an approximation of real-world geographic distance."

**File changed:** `components/CalculatorLayout.tsx` only.

**Placement:** immediately after `{children}` (the calculator widget, which includes its own internal Result block and compact Formula display) and immediately before `<AdPlaceholder label="Ad slot — after calculation result" />`. Rendered conditionally, gated on `calculator.slug === "great-circle-distance-calculator"` — a plain inline JSX conditional, not a new component, prop, data field, or abstraction, per the instruction not to introduce new abstraction machinery for one sentence.

**Why this placement, not inside `ResultDisplay` or `CalculatorEngine`:** `ResultDisplay.tsx` is shared by 3 unrelated calculators (`nautical-mile-converter`, `knots-to-kmh`, `sailing-time-calculator` via `CalculatorShell`) and was explicitly excluded from receiving this sentence. `great-circle-distance-calculator` itself renders via `CalculatorEngine.tsx` (the `engine`-type shell), which was explicitly off-limits ("do not modify the calculator engine"). `CalculatorLayout.tsx` is the only component that (a) receives the `calculator` object needed to gate the conditional by slug, and (b) sits directly adjacent to `{children}` in the page composition — making it the correct, minimal-blast-radius location without touching any shared rendering internals.

---

## Information Hierarchy

Resulting order, confirmed against the generated static HTML (byte-offset verified, not source-inferred):

```
calculator widget (incl. result)
  ↓
"This calculation uses a spherical-Earth model, so results are an
 approximation of real-world geographic distance."        ← NEW, short
  ↓
ad placeholder
  ↓
AnswerBlock → entity definitions → RelatedCalculators → Overview → How to use
  ↓
"Formula" section — detailed explanation (unchanged, still present)
  ↓
Practical use cases → Tips → Examples → FAQ → related content
```

---

## Duplication Check

The existing detailed `formulaDetail` text in `data/calculators.json` — "A great circle is any circle on Earth's surface whose center is the planet's center. The shortest route between two points lies along the unique great circle that passes through both. OceanCalc uses a spherical Earth model for this calculation, so results are an approximation of the corresponding ellipsoidal geodesic distance." — was **not modified, not removed, not duplicated**. It remains exactly where it was, in the "Formula" section, for readers who want the fuller explanation (which additionally covers what a great circle *is*, not just the approximation caveat). The two sentences are related but not identical in wording or scope — confirmed via direct text comparison — so no redundant copy was introduced; this is the intended two-tier hierarchy (short-at-result, detailed-later), not accidental duplication.

---

## Accessibility

The new sentence is ordinary semantic `<p>` text, using the exact same class pattern already used for the existing `formulaDetail` paragraph elsewhere on the same page (`text-sm text-slate-600 dark:text-slate-400`). No `aria-label`, no visually-hidden text, no `role="alert"`, no `role="warning"`, no new heading was introduced — the statement is informational, not an error, and is announced to assistive technology exactly as any other paragraph would be. Heading hierarchy (H1 → H2 sections) is unchanged; the new paragraph does not introduce or require a heading.

---

## AEO Boundary

`components/ai/AnswerBlock.tsx`, `components/ai/KeyTakeaways.tsx`, `components/ai/EntityDefinition.tsx`, `lib/aeo.ts`, and `data/entities.json` were not touched. The new sentence is plain page content, not part of any AEO structure, and was not duplicated into one.

---

## SEO Boundary

Not changed: sitemap (`app/sitemap.ts`), metadata (`lib/seo.ts`, per-calculator `buildSeoMetadata` calls), canonical URLs, robots configuration, structured data (`components/schema/*`), or any URL path. No SEO claim is made for this change.

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

## Numerical Protection

Independently re-verified (not merely assumed from an unmodified diff) that Phase 8's certified formulas are unchanged:

| Calculation | Result |
|---|---|
| Radar horizon, 12 m | 7.7177 nm (matches certified ~7.7 nm) |
| Wave height, 10/20/30 kn | 0.64 / 2.54 / 5.72 m (matches certified values exactly) |
| Great circle, NYC–London | 3007.7 nm (matches certified value exactly) |
| Heading normalization, `mod360(370)` | 10 (matches certified behavior) |

`lib/formulaParser.ts` was not touched in this phase (confirmed via `git diff` — the only changed file is `components/CalculatorLayout.tsx`).

---

## Phase 9 Protection

Re-verified against the current source (not assumed):
- **Phase 9.1:** no "Related Navigation Calculations" or "When to Use This Calculation" text in `CalculatorLayout.tsx`; `components/affiliate/MarineToolsBlock.tsx` remains deleted; no "Nautical Distance Calculator" mislabel on the homepage.
- **Phase 9.2:** no `AllCalculatorsGrid` reference in `app/layout.tsx`; Footer's "All Calculators" → `/tools/` link intact.
- **Phase 9.3:** `/navigation/`'s "Navigation Calculators" link and `/navigation-calculations/`'s "Navigation Resources" link both intact, unchanged.

---

## Static Output Verification

**Great Circle page** (`out/tools/great-circle-distance-calculator/index.html`), byte-offset order confirmed:

| Marker | Byte offset |
|---|---:|
| Result heading | 11,804 |
| **New short disclosure** | **12,994** |
| Ad placeholder | 13,255 |
| AnswerBlock heading | 13,431 |
| Overview heading | 16,501 |
| Formula section heading | 18,711 |
| Existing detailed disclosure | 19,405 |

Order is exactly as required: result → short disclosure → everything else → detailed disclosure, unchanged in position.

**Representative-page isolation check** (exact-string occurrence count of the new sentence):

| Route | Occurrences |
|---|---:|
| `great-circle-distance-calculator` | 1 |
| `initial-bearing-calculator` | 0 |
| `mercator-scale-factor-calculator` | 0 |
| `rhumb-distance-calculator` | 0 |
| `cross-track-error-calculator` | 0 |
| `hull-speed-calculator` | 0 |

No unrelated calculator received the disclosure; `rhumb-distance-calculator` and `cross-track-error-calculator` specifically confirmed clean (no false spherical-great-circle disclosure), consistent with Phase 8's original, unreversed finding that neither uses spherical great-circle geometry.

---

## Scope

**Files modified:** `components/CalculatorLayout.tsx` only (6 lines added, 0 removed, 0 files touched elsewhere). Confirmed via `git diff --stat`.

No calculator formula, calculation engine, calculator data (`data/calculators.json`/`data/calculators-phase5.json`), AEO mapping, AdSense configuration, `ADS_ENABLED`, sitemap, metadata, canonical URL, robots configuration, or structured data was changed. No Phase 9.1, 9.2, or 9.3 work was undone.

---

## Certification

# PHASE 9.4 — PASS

H-5 is resolved for `great-circle-distance-calculator`: the spherical-Earth model disclosure now appears immediately after the result, verified at the byte-offset level in the generated production-like output, not merely inferred from source order. The exact required sentence was used unmodified, placed via the smallest possible change (a single conditional paragraph in one file), with no new abstraction, no ARIA misuse, no AEO or SEO impact, and no duplication of the existing detailed explanation. The model audit additionally identified two calculators (`initial-bearing-calculator`, `mercator-scale-factor-calculator`) with the same underlying architectural pattern but different output types that make the exact given sentence inapplicable; these are documented as open findings for a future, separately-scoped phase rather than remediated with invented wording here. All regression, numerical-protection, and Phase 9.1–9.3 protection checks pass. This certifies only H-5 remediation for the calculator addressed — it does not constitute overall Stage 9 certification. M-8 and the remaining Medium/Low/Informational findings from Phase 9.0 remain open.
