# Phase 8.7 — Production Certification Re-Verification

**Date:** 2026-08-25
**Basis:** `docs/audits/phase-8.5-final-maritime-accuracy-certification.md` (NOT CERTIFIED — blocker was production/repository desynchronization), `docs/audits/phase-8.6-remediation-release.md` (RELEASED — READY FOR PHASE 8.7). Full history (`phase-8.0` through `phase-8.4`) read in prior sessions and not re-summarized here; every claim below is independently re-verified against the current repository and live production, not assumed from those reports.

**Scope discipline:** this phase performs verification only. No source file was modified. `git status --short` was empty and `git rev-parse HEAD` returned `f68dab7049bd3ce0a08efff6ef4652d5df42542c` — unchanged — both before and after this audit.

---

## Certification Status

# CERTIFIED

Production-repository synchronization was checked **first, as the blocking gate**, per explicit instruction — and passed, conclusively, via content fingerprints spanning every corrective commit from Phase 8.1 through Phase 8.6's final commit. With that gate cleared, the full verification proceeded: all 45 routes are live, every previously Critical/Medium finding (F-0, F-1, F-2) is confirmed resolved in production, no stale pre-8.1/8.3/8.6 content remains anywhere across all 45 routes, regression checks pass locally, and no new defect was found. No source modification was required or made.

---

## Gate 0 — Production/Repository Synchronization (checked first, before any other verification)

**Method:** Direct content fingerprinting against `https://oceancalc.com`, using strings/function-bodies known to be unique to specific commits across the corrective history — not filename or build-hash comparison (Next.js chunk hashes are not deterministic across separate build invocations even for identical source, confirmed this session: a fresh local build produced a differently-named/hashed chunk, `77-05a879691696bb7a.js`, for the same `mod360`/`radar_horizon_nm` logic that production serves as `365-d70530b4bd5a487c.js` — so hash equality is not a valid sync signal here; byte-level function-body content is).

| Fingerprint | Origin commit | Production result |
|---|---|---|
| `radar_horizon_nm:function(e){return 1.23*Math.sqrt(Math.max(0,e)/.3048)}` (shipped JS, byte-for-byte) | Phase 8.1 | ✓ present, exact match |
| `mod360:e=>(e%360+360)%360` (shipped JS, byte-for-byte) | Phase 8.1 | ✓ present, exact match (re-confirmed this session) |
| Great-circle example "3,007.7 nm" | Phase 8.3 | ✓ present |
| "Magnetic variation is the angular difference..." entity text on `true-magnetic-heading-calculator` | Phase 8.4 | ✓ present |
| Distance-to-horizon "~5.3 km" (F-1) | Phase 8.6, most recent commit | ✓ present |
| Fathom entity text on `anchor-shackle-rode-calculator` (F-2) | Phase 8.6, most recent commit | ✓ present |

All six fingerprints — spanning the oldest corrective commit (Phase 8.1) through the newest (Phase 8.6's F-1/F-2 commit) — are present on production. **Gate 0: PASS.** Verification proceeded.

**Limitation, stated plainly:** production does not expose git-commit or deployment-ID metadata via HTTP headers (checked: no `cf-pages-*`, `x-deployment-id`, `x-build`, `x-commit`, or similar header present). A literal `git rev-parse`-style SHA comparison against the live site is therefore not possible from outside Cloudflare's dashboard/API, which this environment has no credentials for. The content-fingerprint method above is the strongest available substitute — it verifies actual computational logic and content byte-for-byte, not just a claimed version label — but it is a proxy, not a direct SHA read. This is documented as a limitation, not glossed over.

---

## Verification of All Previously Critical/High/Medium Findings

| Finding (Phase 8.5) | Severity | Status this session | Evidence |
|---|---|---|---|
| F-0 — production not synchronized (radar horizon, wave height, and by inference heading, stale) | CRITICAL | **RESOLVED** | Gate 0 above, plus per-calculator checks below |
| F-1 — distance-to-horizon "~5.4 km" example | MEDIUM | **RESOLVED** | `curl` of production page: "~5.3 km" present, "~5.4 km" absent |
| F-2 — 8 incorrect AEO entity mappings | MEDIUM | **RESOLVED** | See "AEO Entity Verification" below |

No unresolved Critical, High, or Medium finding remains.

---

## Direct HTTP Checks + Shipped-Bundle Inspection

| Calculator | Check | Result |
|---|---|---|
| `radar-horizon-calculator` | Page: `formulaDisplay` shows `"h / 0.3048"`, example shows `"~7.7 nm"`; old `"h), h in meters"` (pre-fix) and `"~4.3 nm"` absent | **PASS** |
| `radar-horizon-calculator` | Shipped bundle (`365-d70530b4bd5a487c.js`): `radar_horizon_nm:function(e){return 1.23*Math.sqrt(Math.max(0,e)/.3048)}` | **PASS** |
| `wave-height-calculator` | Page: `"U is wind speed in m/s"`, all three corrected examples (0.64/2.54/5.72 m) present; old `"wind_speed_kn²"`/9.6/2.4/21.6 absent | **PASS** |
| `true-magnetic-heading-calculator` | Page: formula string `"mod360(mag + var)"` present in embedded data | **PASS** |
| `true-magnetic-heading-calculator` | Shipped bundle: `mod360:e=>(e%360+360)%360` present, byte-for-byte | **PASS** (a literal UI click-through isn't reachable via `curl` against a client-rendered React calculator; bundle-level verification proves the logic that runs for any input, which is stronger evidence than one sampled output) |
| `distance-to-horizon-calculator` | Page: "~5.3 km" present (both `examples` and `faq` occurrences), "~5.4 km" absent | **PASS** |
| `great-circle-distance-calculator` | Page: "3,007.7 nm" present, "3,076 nm" absent | **PASS** |
| `wind-chill-calculator` | Page: corrected examples "~25°F"/"~3°F" present; input element renders `max="50"`; embedded config contains the custom validation message | **PASS** |
| `apparent-wind-calculator` | Page: corrected "~59° AWA" example present, old "~32° AWA" absent | **PASS** |
| `geographic-range-lights-calculator` | Page: corrected "~14.0 nm" example present | **PASS** |
| `ads.txt` | `HTTP/2 200`, `content-type: text/plain; charset=utf-8`, body exactly `google.com, pub-3974004697476579, DIRECT, f08c47fec0942fa0` | **PASS** |

---

## Numerical Spot Checks Against Certified Values

All values below were independently established as correct in Phase 8.1/8.1-reaudit/8.5 (first-principles derivations, not merely OceanCalc's own output); this session re-confirms production serves exactly these figures:

| Calculator | Case | Certified value | Production shows |
|---|---|---:|---|
| radar-horizon-calculator | 12 m | 7.7 nm | ~7.7 nm ✓ |
| wave-height-calculator | 10 kn | 0.64 m | 0.64 m ✓ |
| wave-height-calculator | 20 kn | 2.54 m | 2.54 m ✓ |
| wave-height-calculator | 30 kn | 5.72 m | 5.72 m ✓ |
| distance-to-horizon-calculator | 6 ft | 5.31 km → "~5.3 km" | ~5.3 km ✓ |
| great-circle-distance-calculator | NYC→London | 3,007.7 nm / 5,570.2 km | 3,007.7 nm ✓ |
| apparent-wind-calculator | 6,10,90° | 59° AWA | ~59° AWA ✓ |
| geographic-range-lights-calculator | 9,80 ft | 14.0 nm | ~14.0 nm ✓ |
| wind-chill-calculator | 35°F,15mph / 20°F,25mph | 25°F / 3°F | ~25°F / ~3°F ✓ |
| true-magnetic-heading-calculator | mod360 logic (350°+20°→10°, 5°−20°→345°) | verified via shipped bundle, not a page example (no worked example crosses the 000°/360° boundary) | Bundle contains correct `mod360` — see above ✓ |

---

## 45 Calculator Routes — Live Confirmation

Every slug read directly from the current `data/calculators.json` + `data/calculators-phase5.json` (45 total, re-derived fresh this session, not reused from a prior list), each fetched individually against production:

**Result: 45/45 return HTTP 200.** No route missing, no route erroring.

---

## Stale Pre-8.1/8.3/8.6 Content — Repository-Wide Production Sweep

All 45 production routes were fetched and searched for ten distinct strings known to be stale from specific pre-fix states across the corrective history (`"~4.3 nm"`, `"9.6 m waves"`, `"21.6 m (storm)"`, `"3,076 nm"`, `"5,697 km"`, `"~5.4 km"`, `"~32° AWA"`, `"~24°F feels like"`, `"~2°F feels like"`, `"wind_speed_kn²"`).

**Result: zero occurrences found across all 45 routes.** No stale content remains anywhere in production.

---

## AEO Entity Verification (F-2)

- `anchor-shackle-rode-calculator` and `anchor-rode-shackles-calculator`: now show the fathom entity definition; the old, incorrect "anchor scope" ratio definition is confirmed absent from both.
- `cross-track-error-calculator`, `boat-fuel-consumption-calculator`, `mercator-scale-factor-calculator`, `wave-length-from-period-calculator`, `sail-area-displacement-calculator`, `capsize-screening-calculator`: all six confirmed to show no stray/incorrect entity block (the old "great circle," "nautical mile," "significant wave height," and "hull speed" definitions were each individually checked and found absent from their respective pages).

All eight F-2 corrections confirmed live and rendering correctly, with no misleading glossary content remaining on any of them.

---

## Regression Checks (Local Repository)

Run against the current, unmodified working tree (`git status --short` empty throughout):

| Command | Result |
|---|---|
| `rm -rf out .next && npm run build` | **PASS** — compiled successfully, 308/308 static pages, 45/45 tool routes |
| `npm test` | **PASS** — 130 passed, 0 failed |
| `npx tsc --noEmit` | **PASS** — clean |
| `npm run lint` | **PASS** — "No ESLint warnings or errors" |

---

## Source Modifications

**None.** This phase performed verification only. `git status --short` was empty before, during, and after this audit; `git rev-parse HEAD` remained `f68dab7049bd3ce0a08efff6ef4652d5df42542c` throughout. No genuine release regression was discovered that would have warranted an exception to the no-modification rule.

---

## Outstanding Non-Blocking Items (carried forward from Phase 8.5, LOW/INFORMATIONAL, explicitly not certification blockers per the established severity rubric)

- **F-3 (LOW):** four dead-code duplicate components (`GreatCircleDistance.tsx`, `AnchorScope.tsx`, `ApparentWind.tsx`, `DistanceToHorizon.tsx`) remain in the repository, unreachable but present — a deliberate Phase 8.2 scope decision, not revisited here.
- **F-4 (INFORMATIONAL):** `formulaDisplay`'s "=" notation convention for approximate relationships (e.g., `latitude-degrees-to-nm-calculator`) — independently re-assessed twice now (Phase 8.4, Phase 8.5) as non-misleading given accompanying hedged prose; not a defect.
- **F-5 (LOW):** `cross-track-error-calculator` can show a negative XTE for bearing errors beyond 180° — mathematically correct `sin()` behavior, not a computational defect; a possible future UX/validation refinement.

None of these affect any calculator's numeric correctness or materially mislead a user about a computed result. Per the certification rule ("Only CRITICAL/HIGH/MEDIUM findings should normally block certification"), they do not block certification and are not treated as conditions — they are simply documented, as required.

---

## Certification Decision

Every criterion required for this re-verification was explicitly checked and passed:

- ✅ Production-repository synchronization (Gate 0, checked first) — PASS
- ✅ All previously Critical/High/Medium findings (F-0, F-1, F-2) — all RESOLVED and confirmed live
- ✅ Direct HTTP checks plus shipped-bundle inspection for the three Phase 8.1 safety-critical corrections — PASS
- ✅ Representative numerical spot checks against certified values — PASS, all match
- ✅ All 45 calculator routes live — 45/45 HTTP 200
- ✅ Production commit correspondence — verified via comprehensive content fingerprinting (direct SHA read not exposed by the hosting platform; limitation documented, not concealed)
- ✅ `ads.txt` — PASS
- ✅ No stale pre-8.1/8.3/8.6 content remains — swept all 45 routes, zero found
- ✅ F-1 and F-2 confirmed live — PASS
- ✅ Regression checks (`npm test`, `tsc`, `lint`, `build`) — all PASS
- ✅ No source modifications made (none were needed — no genuine release regression was discovered)

No unresolved Critical, High, or Medium finding exists. Certification is granted.

# CERTIFIED

---

## Final Statement

OceanCalc's 45 live maritime calculators have been independently audited for numerical correctness, unit consistency, validation boundaries, mathematical-model disclosure, maritime conventions, terminology, published examples, and shipped-output consistency. No unresolved Critical, High, or certification-blocking Medium findings were identified within the audited scope.

This certification is specifically for the production deployment verified at the time of this audit (2026-08-25), corresponding to the repository state through commit `f68dab7049bd3ce0a08efff6ef4652d5df42542c`. It should be re-verified if a future deployment changes production content, per the same discipline this phase itself required of Phase 8.5's finding.
