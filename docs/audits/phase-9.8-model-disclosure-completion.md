# Phase 9.8 — Model Disclosure Completion

**Date:** 2026-08-27
**Basis:** `docs/audits/phase-9.0-ux-information-hierarchy-audit.md`, `phase-9.0-ux-information-hierarchy-matrix.md`, `phase-9.4-contextual-information-hierarchy-model-disclosure.md`, `docs/audits/stage-9-final-ux-certification.md` — all read in full before this phase began. Repository HEAD at start: `fc0e5fc41f738dbc0dddb8f8c90fc6f537e2e80c` (confirmed via `git rev-parse HEAD`, matching origin/main; working tree contained only the pre-existing untracked `stage-9-final-ux-certification.md` from the prior audit turn — not an unrelated change).

## Status

# PHASE 9.8 — PASS

---

## Scope

This phase addresses only the remaining portion of Phase 9.0's H-5 finding, as reconciled by the Stage 9 final certification audit: four calculators (`wave-height-calculator`, `radar-horizon-calculator`, `initial-bearing-calculator`, `mercator-scale-factor-calculator`) whose load-bearing model-assumption disclosure was still positioned only in the buried "Formula" section, several sections below the result. It does not address M-9 (nautical-mile-converter) or the privacy-page accessibility finding — both remain explicitly open, reserved for later phases.

---

## Source Verification

Each calculator's slug, formula implementation, and existing disclosure were independently verified against `data/calculators.json` / `data/calculators-phase5.json` and `lib/formulaParser.ts` before any edit.

| Calculator | Slug | Formula implementation (`lib/formulaParser.ts`) | Mathematical model | Existing detailed disclosure (`formulaDetail`, unchanged) | Reason short disclosure is appropriate |
|---|---|---|---|---|---|
| Wave Height | `wave-height-calculator` | `0.024 * pow(windSpeed * 0.514444, 2)` — `0.514444` converts input knots to m/s before the empirical relationship is applied | Empirical SMB-style wind-wave relationship | "This simplified estimate assumes a fully developed sea in open water; actual wave height also depends on fetch, wind duration, water depth, and other sea-state conditions." | An empirical estimate whose accuracy depends on sea-state assumptions not visible to the user at the point of reading the result. |
| Radar Horizon | `radar-horizon-calculator` | `radar_horizon_nm(h_m)`: `h_ft = h_m / 0.3048; return 1.23 * sqrt(h_ft)` — confirmed 4/3-Earth-radius-calibrated coefficient (1.23) applied to a feet-converted height | Standard 4/3-Earth-radius atmospheric-refraction approximation | "This is an approximate radar-horizon calculation using a standard 4/3-Earth-radius atmospheric-refraction model; actual radar range can vary with atmospheric conditions, antenna height, and target characteristics." | An atmospheric-refraction approximation; actual radar range varies with real conditions the calculator cannot know. |
| Initial Bearing | `initial-bearing-calculator` | `initial_bearing_deg(lat1, lon1, lat2, lon2)`: standard spherical forward-azimuth trigonometry (`atan2` of spherical components), normalized to 0–360° | Spherical-Earth geometry | "Does not apply variation/deviation; output is true bearing. This calculation uses spherical-Earth geometry and is an approximation of the corresponding ellipsoidal geodesic bearing." | Same spherical-vs-ellipsoidal approximation class as Great Circle, but the output is a bearing, not a distance — confirmed the exact Great Circle sentence would misdescribe this calculator's output type. |
| Mercator Scale Factor | `mercator-scale-factor-calculator` | `mercator_scale_factor(lat_deg)`: `1 / cos(lat)` — the standard spherical secant-of-latitude scale factor | Spherical Mercator projection | "This calculation uses the spherical Mercator model and does not account for ellipsoidal geodesic corrections." | A projection-scale calculation, not a distance or bearing; confirmed the exact Great Circle sentence is categorically inapplicable. |

**No contradiction was found** between any calculator's actual implementation and the disclosure wording specified for this phase — all four proceeded to implementation without triggering a STOP condition.

---

## Authorized Disclosure Text

Used verbatim, exactly as supplied, no paraphrasing:

- **Wave Height:** "Model note: This calculator estimates significant wave height using an empirical wind-wave relationship; actual sea state can differ with fetch, duration, swell, and local conditions."
- **Radar Horizon:** "Model note: This calculator uses the standard 4/3-Earth-radius approximation for radar horizon; actual detection range can vary with atmospheric refraction, antenna height, terrain, and target height."
- **Initial Bearing:** "Model note: This calculator uses a spherical-Earth model to determine the initial bearing between the two coordinates; results are an approximation of navigation on the Earth's ellipsoid."
- **Mercator Scale Factor:** "Model note: This calculator uses the spherical Mercator projection model; scale factors for a reference ellipsoid differ slightly."
- **Great Circle (preserved, unchanged):** "This calculation uses a spherical-Earth model, so results are an approximation of real-world geographic distance."

---

## Implementation

**Exact file changed:** `components/CalculatorLayout.tsx` only (1 file, 15 insertions, 2 deletions).

An explicit `MODEL_NOTES: Record<string, string>` slug-to-text mapping was added (5 entries: the 4 new calculators plus the preserved Great Circle entry). The existing conditional at the result-adjacent location:

```jsx
{calculator.slug === "great-circle-distance-calculator" ? (
  <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
    This calculation uses a spherical-Earth model, so results are an approximation of real-world geographic distance.
  </p>
) : null}
```

was replaced with a lookup against that map:

```jsx
{MODEL_NOTES[calculator.slug] ? (
  <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
    {MODEL_NOTES[calculator.slug]}
  </p>
) : null}
```

This is the smallest change that satisfies exact-slug-matching, exact wording, and zero leakage to unrelated calculators: the same `<p>` element, same className, same position (`{children}` → model note → `<AdPlaceholder>`) is reused; only the text-selection logic changed from a single string-equality check to a 5-entry explicit map lookup. No generic data-driven abstraction spanning all 45 calculators was introduced — the map contains only the 5 explicitly authorized slugs, nothing more.

No other file was touched.

---

## Placement Verification

Rendered order confirmed via byte-offset inspection of the built static HTML (`out/tools/radar-horizon-calculator/index.html`, representative):

| Marker | Byte offset |
|---|---:|
| Model note | 10,492 |
| AnswerBlock heading | 10,904 |
| Formula heading | 15,302 |

Order confirmed: **calculator/result → model note → AdPlaceholder (renders nothing) → AnswerBlock → KeyTakeaways → … → Formula**, exactly as required. This same relative order (model note appearing before the Formula heading in document order) was independently confirmed via DOM `compareDocumentPosition` for all 5 affected calculators, at both tested viewports (10/10 checks passed).

`AnswerBlock` presence was independently confirmed via its `id="aeo-answer-heading"` marker — present exactly once on all 5 affected pages (`grep -c`, confirmed 1 each). `Formula` section (`id="formula-heading"`) and `KeyTakeaways` were confirmed present and unmoved on all 5 pages via the same rendered-DOM check.

---

## Negative Controls

Rendered and checked for leakage on 4 unaffected calculators, at both viewports (8 checks total):

| Route | Desktop leaked count | Mobile leaked count |
|---|---:|---:|
| `/tools/nautical-mile-converter/` | 0 | 0 |
| `/tools/celsius-fahrenheit-converter/` | 0 | 0 |
| `/tools/rhumb-distance-calculator/` | 0 | 0 |
| `/tools/cross-track-error-calculator/` | 0 | 0 |

Zero leakage confirmed — no unrelated calculator received a model note.

---

## Great Circle Regression

- **Wording:** unchanged — confirmed identical string, preserved verbatim in the `MODEL_NOTES` map.
- **Placement:** unchanged — same conditional location, same className, same position relative to `{children}` and `<AdPlaceholder>`.
- **Occurrence count:** exactly 1 real DOM occurrence, confirmed via tag-scoped `grep -o '<p[^>]*>...</p>'` on the built HTML (raw-text count showed 2, which is the known, previously-documented Next.js RSC hydration-payload duplication artifact, not a real second occurrence — the same pattern verified and explained in Phases 9.1, 9.2, and 9.4).
- **No duplicate short disclosure:** confirmed — only one `<p>` matching the Great Circle text exists in the DOM.
- **Existing detailed disclosure:** confirmed still present, unchanged, in the Formula section ("A great circle is any circle on Earth's surface whose center is the planet's center...").

---

## Accessibility

- **Tool/configuration:** axe-core, `runOnly: ['wcag2a', 'wcag2aa']`.
- **Routes:** all 5 affected calculators (`wave-height-calculator`, `radar-horizon-calculator`, `initial-bearing-calculator`, `mercator-scale-factor-calculator`, `great-circle-distance-calculator`) plus homepage (`/`).
- **Viewports:** 1440×900, 390×844 (12 scans total).
- **Result:** **0 violations on every route, at both viewports.** No contrast, heading-hierarchy, landmark, duplicate-ID, or link issues were introduced by the new model-note paragraphs.
- The known privacy-page `link-in-text-block` finding was not scanned or touched in this phase — explicitly out of scope, as instructed.

---

## Responsive

- **Browser:** Playwright 1.62.1 driving the system-installed Google Chrome (`channel: 'chrome'`) — same tool/method as Phases 9.6/9.7.
- **Target:** current local production build (`out/`, fresh `rm -rf out .next && npm run build`), served locally.
- **Viewports:** 1440×900, 390×844.
- **Routes:** the 5 affected calculators + 4 negative-control calculators (9 routes × 2 viewports = 18 combinations for overflow; 5 × 2 = 10 for placement/wording).
- **Result:** **zero horizontal overflow** on any of the 18 combinations checked; no unexpected wrapping or layout break observed in any rendered check.

---

## Numerical Protection

`npm test` — **130/130 passed**, identical to baseline. Explicitly re-verified the 5 relevant certified/test values, all unchanged:

| Calculator | Test value | Result |
|---|---|---|
| Radar Horizon (`h=12m`) | `nm = 7.717706403199351` | Unchanged |
| Wave Height | `waveHeight_m = 2.5406652397056004`, `waveHeight_ft = 8.335516145035722` | Unchanged |
| Initial Bearing | `brg = 51.215522458071916` | Unchanged |
| Mercator Scale Factor | `k = 1.9999999999999996` | Unchanged |
| Great Circle | `distance_nm = 3007.6795421033207`, `distance_km = 5570.22251197535` | Unchanged |

No formula, calculation engine, or calculator data file was modified.

---

## Phase 8 Protection

`git diff --stat -- lib/formulaParser.ts data/calculators.json data/calculators-phase5.json` — **empty, confirmed untouched.**

---

## Phase 9.1–9.7 Protection

`git diff --stat` confirms the complete diff is exactly one file: `components/CalculatorLayout.tsx`. Explicitly re-verified via targeted `git diff --stat` that none of the following changed: `app/page.tsx` (9.1), `components/affiliate/` (9.1, remains deleted), `app/layout.tsx` (9.2), `components/Footer.tsx` (9.2/9.7), `app/navigation/page.tsx` / `app/navigation-calculations/page.tsx` (9.3), the 4 cluster pages + `ClusterCalculatorList.tsx` (9.5), `components/ads/AdPlaceholder.tsx` (pre-9.6), `components/Header.tsx` (9.6). All confirmed unchanged.

## AdSense Protection

`lib/ads.ts`, `app/layout.tsx`, `components/ads/AdPlaceholder.tsx` — confirmed unmodified (`git diff --stat`, no output). This phase has no advertising scope.

---

## Tests

| Command | Result |
|---|---|
| `npm test` | **PASS** — 130/130 |
| `npx tsc --noEmit` | **PASS** — clean |
| `npm run lint` | **PASS** — "No ESLint warnings or errors" |
| `npm run build` (from-scratch, `rm -rf out .next` first) | **PASS** — compiled successfully |
| Static pages generated | **308/308** |
| Calculator routes generated | **45/45** |

---

## Files Changed

```
 components/CalculatorLayout.tsx | 17 +++++++++++++++--
 1 file changed, 15 insertions(+), 2 deletions(-)
```

Plus this new documentation file: `docs/audits/phase-9.8-model-disclosure-completion.md`.

No other file was modified.

---

## Remaining Findings

**Not addressed by this phase, remain open for later phases:**
- **M-9** — `nautical-mile-converter`'s dead `engine` output configuration and formula-text/widget-output mismatch. Not fixed. Reserved for a dedicated reconciliation phase.
- **Privacy-page inline links** (`app/privacy/page.tsx` — "Cookies," `contact@oceancalc.com`) — `link-in-text-block` accessibility finding. Not fixed. Reserved for a dedicated phase using the already-proven Phase 9.7 pattern.

This phase does not claim these are resolved, and does not claim overall Stage 9 certification.

---

## Certification Decision

# PHASE 9.8 — PASS

All four disclosures were implemented using the exact authorized wording, in the exact required result-adjacent position, gated by exact slug matching, with zero leakage to unrelated calculators and zero disturbance to the existing Great Circle disclosure, AnswerBlock, KeyTakeaways, or Formula section. All numerical outputs remain byte-identical (130/130 tests). All regression, accessibility, and responsive checks pass. Phase 8 and Phase 9.1–9.7 protections all hold, confirmed via a single-file diff. This certifies only the H-5 model-disclosure completion addressed here — it does not resolve M-9 or the privacy-page finding, and does not constitute Stage 9 certification.
