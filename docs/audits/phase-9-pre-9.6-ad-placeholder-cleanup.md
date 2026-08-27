# Phase 9 Pre-9.6 Ad Placeholder Cleanup

**Date:** 2026-08-26
**Status:** PASS

## Why the visible placeholders were a UX defect

OceanCalc previously rendered its own dashed-border boxes with text such as "Ad slot — after
calculation result" directly on production calculator pages, regardless of whether any real
advertising was configured. These were OceanCalc's own presentational components, not Google
AdSense UI. With Google Auto Ads now being configured separately, leaving these boxes visible
would make the page appear to contain broken or empty advertising inventory to real users and to
AdSense's preview/crawl tooling.

## Where they originated

Repository inspection (performed before any change) found:

- `lib/ads.ts` — exports `ADSENSE_CLIENT_ID` (the real AdSense publisher ID) and `ADS_ENABLED =
  false`.
- `components/ads/AdPlaceholder.tsx` — the component responsible for the visible boxes. Its logic
  was inverted from sane semantics: when `ADS_ENABLED` was `false` (the current, correct value for
  "no manual ads live"), it rendered the visible dashed placeholder `<div>` with the `label` text.
  When `ADS_ENABLED` was `true`, it rendered `null`. In other words, a *disabled* ad system was the
  one producing visible UI, and there was no actual ad content in either branch — no
  `<ins class="adsbygoogle">` unit existed anywhere in this component.
- `components/CalculatorLayout.tsx` — three call sites, unchanged by this task:
  - `<AdPlaceholder label="Ad slot — after calculation result" />`
  - `<AdPlaceholder label="Ad slot — mid content" />`
  - `<AdPlaceholder label="Ad slot — bottom of page" />`
- `app/layout.tsx` — loads the real, live Google AdSense/Auto Ads script
  (`pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=...`) unconditionally in
  `<head>`, plus a `google-adsense-account` meta tag for crawler verification. This is the actual
  Google integration and is entirely independent of `AdPlaceholder`.
- `components/ads/AdSenseScript.tsx` — a `next/script` wrapper around the same AdSense script URL.
  Confirmed via repo-wide search to have zero import/call sites anywhere in the codebase; it is
  dead code, unrelated to the visible placeholder defect, and was left untouched (out of scope —
  removing unused dead code was not requested and risked scope creep).
- No existing manual-ad component or `<ins class="adsbygoogle">` implementation was found anywhere
  in the repository.

## What was changed

`components/ads/AdPlaceholder.tsx` was rewritten to unconditionally render `null` in all cases. The
visible dashed-box JSX and the `ADS_ENABLED` conditional were removed. The `label` prop is still
accepted (so the three existing call sites in `CalculatorLayout.tsx` remain valid, unmodified, and
still self-document *where* a future manual ad unit would go), but it is no longer rendered
anywhere.

This is the only file changed. `CalculatorLayout.tsx` did not need to be touched — its three
`<AdPlaceholder label="..." />` call sites now simply resolve to nothing in the rendered page, with
no layout gap or empty container left behind, since the component returns `null` directly rather
than an empty wrapper element.

## What was intentionally NOT changed

- `lib/ads.ts` — `ADS_ENABLED` and `ADSENSE_CLIENT_ID` are untouched. `ADS_ENABLED` remains defined
  as the flag a future, deliberate manual-ad implementation would gate on.
- `components/CalculatorLayout.tsx` — the three call sites and their `label` values are untouched,
  preserving the structural markers for where manual ads could later be reintroduced.
- `components/ads/AdSenseScript.tsx` — left as-is (unused, out of scope).
- `app/layout.tsx` — the live Google AdSense/Auto Ads script tag and `google-adsense-account` meta
  tag are untouched.
- No `<ins class="adsbygoogle">` or any other real ad unit was added.
- No new placeholder, "Advertisement" label, or reserved-whitespace element was introduced in place
  of the removed boxes.
- Calculator formulas, calculator data, headings, copy, structured data, canonical URLs, metadata,
  internal-link architecture, sitemap generation, and robots directives were not touched.

## Relationship between the placeholder system and Google Auto Ads

`AdPlaceholder` and Google Auto Ads are, and always were, independent systems. Auto Ads is loaded
globally via the static `<script>` tag in `app/layout.tsx` and places ads automatically wherever
Google's algorithm decides, without needing any manual insertion point in the page markup.
`AdPlaceholder` was a separate, purely presentational marker for a *manual* ad unit that was never
actually implemented. Removing its visible UI has no effect on Auto Ads.

## Confirmation: no Google AdSense account settings were changed

`lib/ads.ts` (`ADSENSE_CLIENT_ID`, `ADS_ENABLED`) and `app/layout.tsx` (the AdSense script tag and
`google-adsense-account` meta tag) are byte-identical to their pre-task state (`git diff` shows no
changes to either file). No publisher ID, script URL, or Auto Ads configuration was modified.

## Validation results

- `npm test` — 130/130 passed.
- `npx tsc --noEmit` — clean, no errors.
- `npm run lint` — clean, no warnings or errors.
- `rm -rf out .next && npm run build` — succeeded, all static pages generated without error.
- `grep -rl "Ad slot" out/` — 0 matches (built output).
- `grep -rl "after calculation result|mid content|bottom of page" out/` — 0 matches (built output).
- `grep -rl "border-dashed border-gray-300" out/` — 0 matches (dashed-box markup fully absent).
- Source-level `grep -rn "Ad slot"` — 3 matches, all in `components/CalculatorLayout.tsx` as
  `label` prop values passed to a component that renders nothing; these are retained call-site
  documentation, not user-visible output.
- Spot-checked `out/tools/nautical-mile-converter/index.html` — calculator H1 and widget render
  correctly; no placeholder box present.

## Confirmation: Phase 8 and Phase 9.1–9.5 functionality unaltered

- `lib/formulaParser.ts`, `data/calculators.json`, `data/calculators-phase5.json`,
  `data/calculatorClusters.json` — no changes (`git status --short` on these paths is empty).
- `components/CalculatorLayout.tsx` — no changes at all (the ad-rendering fix required editing
  only `AdPlaceholder.tsx`).
- SEO/schema files (`lib/seo.ts`, `components/schema/*`) — untouched.
- `app/navigation-calculations/page.tsx`, `app/distance-measurement-calculators/page.tsx`,
  `app/wind-wave-calculators/page.tsx`, `app/sailing-performance-calculators/page.tsx`,
  `components/ClusterCalculatorList.tsx` (Phase 9.5) — untouched.

## Diff scope

```
 M components/ads/AdPlaceholder.tsx
 1 file changed, 8 insertions(+), 13 deletions(-)
```

This task removes OceanCalc's own placeholder UI only. It makes no claim about, and performs no
validation of, Google AdSense/Auto Ads behavior itself.
