# Phase 9.0 — UX & Information Hierarchy Matrix

Companion to `docs/audits/phase-9.0-ux-information-hierarchy-audit.md`. Finding IDs (C-1, H-1…H-5, M-1…M-9, L-1…L-4, I-1…I-4) refer to that document's registers.

**Shared risk pattern, applies to all 45 calculator rows below unless a row explicitly overrides it:**
- **Main UX risk:** C-1 (irrelevant hardcoded navigation content) + H-2 (global index redundancy) + H-3 (dead affiliate links)
- **Mobile risk:** INFERRED only — `CalculatorEngine` 2-input-per-row layout at 640px for calculators with 2+ inputs; single-column, low risk for 1-input calculators
- **Accessibility risk:** H-3's dead-link keyboard-focus issue (shared); otherwise correctly labeled forms/live-region result (no calculator-specific defect found)
- **Monetization risk:** low today (`ADS_ENABLED=false`); MarineToolsBlock dead links (H-3) is the only live monetization-adjacent defect
- **AEO interaction:** "Entity present" = at least one `EntityDefinition` renders (source: `lib/aeo.ts` `SLUG_TO_ENTITIES`); "None" = no AEO entity block, which is correct/expected for calculators with no natural glossary term, not a defect

---

## Non-Calculator Pages

| Page | Primary user intent | Primary action | Primary information | Secondary information | Main navigation | Result/answer hierarchy | Main UX risk | Mobile risk | A11y risk | Monetization risk | AEO interaction | Overall status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Homepage (`/`) | Understand what the site offers, find a calculator | Click "Explore Calculators" or a category card | Hero + 6 category cards | Most-used/recently-updated lists, cluster grid | Header + hero CTA + category grid + global footer index | N/A (no result page) | H-1 (duplicate "Most Used" heading, mislabeled link) | INFERRED — hero and card grid are simple, low risk | No defect found | Low | None on this page | **Needs work** |
| Calculator index (`/tools/`) | Browse/find a specific calculator | Click a calculator card | Popular + All calculator card grid | Category quick-links row | Header + 4 category links + card grid | N/A | None found beyond site-wide H-2 pattern | INFERRED — standard card grid, low risk | No defect found | Low | None | **Good** |
| `/navigation-calculations/` (cluster authority) | Find a navigation calculator quickly | Click a text link | Bare link list | One paragraph intro | Minimal — no breadcrumb, no sidebar | N/A | M-8 (thinnest template on site, naive slug-to-text labels), H-4 (name collision with `/navigation/`) | INFERRED — simple two-column list, low structural risk but low content quality | No breadcrumb nav landmark | Low | None | **Needs work** |
| `/distance-measurement-calculators/`, `/wind-wave-calculators/`, `/sailing-performance-calculators/` (3 more cluster authority pages) | Same as above | Same as above | Same as above | Same as above | Same as above | N/A | M-8 (same thin template) | Same as above | Same as above | Low | None | **Needs work** |
| `/navigation/`, `/wind-waves/`, `/maritime-measurements/`, `/sailing/`, `/knots/` (5 topic hubs) | Learn a maritime topic in depth | Click an article/knot card | Card grid + sidebar (articles) or card grid (knots) | Priority-calculators strip | Header + sidebar + card grid | N/A | H-4 (naming collision, `/navigation/` specifically) | INFERRED — card grid + sidebar reflow, moderate confidence of reasonable stacking at `lg` breakpoint | No defect found | Low | None | **Good** except `/navigation/` (**Needs work**, H-4) |
| Topic article pages (`/navigation/[slug]/`, etc.) | Read a specific explainer | Read, then click a related tool | Article body | Related tools, same-category articles | `ArticleLayout` (not separately audited in depth this pass — out of primary calculator scope) | N/A | Not deeply audited this pass | INFERRED | Not deeply audited | Low | Not deeply audited | **Not fully audited** |
| Variant pages (`/tools/[slug]/[variant]/`) | Same as parent calculator, arrived via a specific SEO angle | Same as parent | Same calculator, different intro paragraph | Same as parent page | Same as parent page | Same as parent | Same as parent calculator's risks; noindex so lower stakes | Same as parent | Same as parent | Same as parent | Same as parent | Inherits parent's status |
| Legal/trust pages (`/privacy/`, `/terms/`, `/disclaimer/`, `/cookies/`, `/affiliate/`, `/about/`, `/contact/`, `/editorial-policy/`) | Read policy/company info | Read | Policy text | N/A | Footer only | N/A | H-2 (global index still injects below these pages too, arguably more out-of-place here than on calculator pages) | INFERRED, low risk (plain text pages) | Not deeply audited | Low | None | **Not fully audited**, H-2 applies |

---

## All 45 Calculator Pages

| # | Slug | Category | Inputs | Outputs | Primary user intent | Result hierarchy | Model disclosure (H-5 applies?) | AEO entity | Calculator-specific risk beyond shared pattern | Overall status |
|---|---|---:|---:|---:|---|---|---|---|---|---|
| 1 | nautical-mile-converter | maritime-measurements | 1 | **1 (Shell)** | Convert nm to another unit | Result clear, single value | No | Yes | **M-9** — "Formula" text describes 3 conversions (km/mi/m), widget shows only 1 (`simpleRegistry` shadows `engine`) | **Needs work** |
| 2 | knots-speed-converter | maritime-measurements | 1 | 3 | Convert knots to mph/km-h/m-s simultaneously | 3 values shown at once, reasonably clear | No | Yes | None beyond shared | Fair |
| 3 | knots-to-kmh | maritime-measurements | 1 | 1 | Convert knots to km/h | Clear | No | Yes | None beyond shared | Fair |
| 4 | distance-to-horizon-calculator | navigation | 1 | 2 | Find horizon distance from height of eye | Clear, nm+km shown | No | Yes | C-1 content is at least topically relevant here (unlike converters) | Fair |
| 5 | sailing-time-calculator | sailing | 2 | 1 | Estimate passage time | Clear | No | Yes | None beyond shared | Fair |
| 6 | great-circle-distance-calculator | navigation | 4 | 2 | Shortest-path distance between 2 points | Clear, but see H-5 | **Yes — H-5 applies** | Yes | H-5 (spherical-model disclosure buried) | **Needs work** |
| 7 | anchor-scope-calculator | sailing | 2 | 2 | Rode length to pay out | Clear | No | Yes | C-1 content irrelevant (this is a seamanship calc, not "navigation route planning") | **Needs work** |
| 8 | beaufort-scale-calculator | wind-waves | 1 | 1 | Wind speed → Beaufort force | Clear | No | Yes | C-1 content irrelevant (wind reference, not route navigation) | **Needs work** |
| 9 | apparent-wind-calculator | wind-waves | 3 | 2 | Apparent wind speed/angle from true wind + boat speed | Clear, 2 values | No | Yes | 3-input row — INFERRED mobile cramping risk highest among wind-waves calcs; C-1 irrelevant | **Needs work** |
| 10 | wave-height-calculator | wind-waves | 1 | 2 | Estimate wave height from wind | Clear | **Yes — H-5-class disclosure** ("fully developed sea" assumption) | Yes | Model-assumption disclosure also buried per H-5 logic; C-1 irrelevant | **Needs work** |
| 11 | boat-fuel-consumption-calculator | sailing | 2 | 1 | Estimate fuel needed | Clear | No | **None** (correct — no natural glossary term) | C-1 irrelevant | **Needs work** |
| 12 | fathom-converter | maritime-measurements | 1 | 2 | Convert fathoms | Clear | No | Yes | C-1 irrelevant (pure unit conversion) | **Needs work** |
| 13 | wind-chill-calculator | wind-waves | 2 | 1 | Apparent temperature from wind+temp | Clear; `max=50°F` validation correctly enforced (Phase 8.3) and visible | No | None | C-1 irrelevant | **Needs work** |
| 14 | hull-speed-calculator | sailing-performance | 1 | 1 | Theoretical hull speed | Clear | No (properly scoped as rule-of-thumb in its own FAQ, per Phase 8) | Yes | C-1 irrelevant (performance calc, not route navigation) | **Needs work** |
| 15 | initial-bearing-calculator | navigation | 4 | 1 | Bearing between 2 points | Clear | **Yes — H-5 applies** | Yes | H-5; 4-input row, INFERRED mobile risk | **Needs work** |
| 16 | rhumb-distance-calculator | navigation | 4 | 1 | Rhumb-line distance | Clear | Disclosed via `formula` field (plane-sailing approximation), well-worded per Phase 8 | Yes | 4-input row, INFERRED mobile risk; disclosure less buried than great-circle since it's in the `formula` field rendered earlier — lower H-5 severity here | Fair |
| 17 | statute-nautical-mile-converter | conversions | 1 | 1 | Convert statute miles to nm | Clear | No | Yes | C-1 irrelevant | **Needs work** |
| 18 | celsius-fahrenheit-converter | conversions | 1 | 1 | Convert °C to °F | Clear | No | **None** | C-1 irrelevant — **directly confirmed live** (this is the calculator used as primary evidence for C-1) | **Needs work** |
| 19 | feet-meters-converter | conversions | 1 | 1 | Convert feet to meters | Clear | No | None | C-1 irrelevant | **Needs work** |
| 20 | latitude-degrees-to-nm-calculator | navigation | 1 | 1 | Convert lat degrees to nm | Clear | Approximation correctly disclosed in `formula` field (Phase 8.3/8.4) | Yes | None beyond shared | Fair |
| 21 | vmg-calculator | sailing-performance | 2 | 1 | Velocity made good | Clear | No | Yes | C-1 irrelevant | **Needs work** |
| 22 | fuel-range-nautical-calculator | sailing-performance | 3 | 1 | Range from fuel/speed/consumption | Clear | No | Yes | C-1 irrelevant; 3-input row | **Needs work** |
| 23 | anchor-shackle-rode-calculator | sailing-performance | 1 | 1 | Shackles → feet of rode | Clear | No | Yes (post-8.6: "fathom") | C-1 irrelevant | **Needs work** |
| 24 | bar-psi-converter | conversions | 1 | 1 | Convert bar to psi | Clear | No | None | C-1 irrelevant | **Needs work** |
| 25 | liters-us-gallons-converter | conversions | 1 | 1 | Convert liters to US gal | Clear | No | None | C-1 irrelevant | **Needs work** |
| 26 | cable-nautical-mile-converter | conversions | 1 | 1 | Convert cables to nm | Clear | Convention correctly disclosed (Phase 8.3) | Yes | C-1 irrelevant (though topically closer to navigation than most converters) | **Needs work** |
| 27 | geographic-range-lights-calculator | navigation | 2 | 1 | Visible range of a light | Clear | No | Yes | None beyond shared | Fair |
| 28 | radar-horizon-calculator | navigation | 1 | 1 | Radar horizon from antenna height | Clear | **Yes — H-5-class** (4/3-Earth-radius model disclosed in `formulaDetail`) | Yes | H-5 logic applies | **Needs work** |
| 29 | drift-set-distance-calculator | navigation | 2 | 1 | Current drift distance | Clear | No | Yes | None beyond shared | Fair |
| 30 | sail-area-displacement-calculator | sailing-performance | 2 | 1 | SA/D ratio | Clear | No | None | C-1 irrelevant | **Needs work** |
| 31 | capsize-screening-calculator | sailing-performance | 2 | 1 | Capsize screening factor | Clear; own FAQ correctly scopes it as "not certification" | No | None | C-1 irrelevant | **Needs work** |
| 32 | pounds-kilograms-converter | conversions | 1 | 1 | Convert lb to kg | Clear | No | None | C-1 irrelevant | **Needs work** |
| 33 | kilowatts-horsepower-converter | conversions | 1 | 1 | Convert kW to hp | Clear | No | None | C-1 irrelevant | **Needs work** |
| 34 | meters-second-knots-converter | conversions | 1 | 1 | Convert m/s to knots | Clear | No | Yes | C-1 irrelevant | **Needs work** |
| 35 | inches-mercury-millibar-converter | conversions | 1 | 1 | Convert inHg to mbar | Clear | No | None | C-1 irrelevant | **Needs work** |
| 36 | bilge-pump-time-calculator | sailing-performance | 2 | 1 | Pump-out time | Clear | No | None | C-1 irrelevant | **Needs work** |
| 37 | wave-length-from-period-calculator | wind-waves | 1 | 1 | Wavelength from period | Clear | Deep-water assumption disclosed in `formula` field | None | C-1 irrelevant | **Needs work** |
| 38 | longitude-minute-nautical-mile-calculator | navigation | 2 | 1 | nm per minute of longitude | Clear | Scaling assumption correctly scoped | Yes | None beyond shared | Fair |
| 39 | true-magnetic-heading-calculator | navigation | 2 | 1 | Magnetic → true heading | Clear | Sign convention correctly disclosed | Yes (post-8.4: "heading"/"magnetic variation") | None beyond shared | Fair |
| 40 | cross-track-error-calculator | navigation | 2 | 1 | XTE from distance + bearing error | Clear; can show negative value beyond 180° error (F-5 from Phase 8.5, mathematically correct, not relabeled here) | Small-angle approximation correctly disclosed | **None** (post-8.6 removal — was incorrectly "great circle") | None beyond shared | Fair |
| 41 | speed-over-ground-calculator | navigation | 3 | 1 | SOG from STW+current | Clear | No | Yes | 3-input row, INFERRED mobile risk | Fair |
| 42 | mercator-scale-factor-calculator | navigation | 1 | 1 | Mercator scale factor at a latitude | Clear | **Yes — H-5-class** (spherical Mercator model disclosed) | **None** (post-8.6 removal — was incorrectly "great circle") | H-5 logic applies | **Needs work** |
| 43 | anchor-rode-shackles-calculator | sailing-performance | 1 | 1 | Feet → shackles | Clear | No | Yes (post-8.6: "fathom") | C-1 irrelevant | **Needs work** |
| 44 | square-feet-square-meters-converter | conversions | 1 | 1 | Convert ft² to m² | Clear | No | None | C-1 irrelevant | **Needs work** |
| 45 | cubic-feet-liters-converter | conversions | 1 | 1 | Convert ft³ to L | Clear | No | None | C-1 irrelevant | **Needs work** |

**Tally:** 45/45 calculators individually assessed. 31 rated "Needs work" (dominated by C-1's irrelevant-content pattern, most acute on the 21 non-navigation/non-sailing calculators where the mismatch is starkest, plus every calculator carrying an H-5-class disclosure). 14 rated "Fair" (calculators in the `navigation` category where the shared hardcoded content is at least topically adjacent, and which don't carry a buried model disclosure). **None rated "Good"** — every calculator inherits at least the shared H-2/H-3 site-wide pattern.
