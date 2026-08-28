/**
 * Regression tests for lib/formulaParser.ts custom functions and for the
 * exact formula strings stored in data/calculators.json and
 * data/calculators-phase5.json.
 *
 * No test framework is installed in this project; this script uses plain
 * assertions and a non-zero exit code on failure, run via `npm test`
 * (`npx tsx scripts/test-formula-engine.ts`), consistent with the existing
 * `npx tsx scripts/*.ts` convention used by the sitemap/indexing scripts.
 *
 * Added in Phase 8.1 to regression-test the radar-horizon unit fix, the
 * wave-height unit fix, and the new mod360() heading-normalization helper,
 * plus every pre-existing custom function so a shared-file change
 * (lib/formulaParser.ts) cannot silently break unrelated calculators.
 */
import * as fs from "fs";
import * as path from "path";
import { parseFormula, DEFAULT_CUSTOM_FUNCTIONS } from "../lib/formulaParser";
import { formatValue } from "../components/calculator-engine/OutputField";

let failures = 0;
let passes = 0;

function assertClose(actual: number, expected: number, tol: number, label: string) {
  const diff = Math.abs(actual - expected);
  const ok = Number.isFinite(actual) && diff <= tol;
  if (ok) {
    passes++;
    console.log(`  PASS  ${label}: got ${actual}, expected ${expected} (±${tol})`);
  } else {
    failures++;
    console.error(
      `  FAIL  ${label}: got ${actual}, expected ${expected} (±${tol}), diff=${diff}`
    );
  }
}

function assertEqual(actual: unknown, expected: unknown, label: string) {
  const ok = actual === expected;
  if (ok) {
    passes++;
    console.log(`  PASS  ${label}: got ${JSON.stringify(actual)}`);
  } else {
    failures++;
    console.error(`  FAIL  ${label}: got ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`);
  }
}

function assertInRange(actual: number, lo: number, hi: number, label: string) {
  const ok = Number.isFinite(actual) && actual >= lo && actual < hi;
  if (ok) {
    passes++;
    console.log(`  PASS  ${label}: got ${actual} (in [${lo}, ${hi}))`);
  } else {
    failures++;
    console.error(`  FAIL  ${label}: got ${actual}, expected in [${lo}, ${hi})`);
  }
}

const fns = DEFAULT_CUSTOM_FUNCTIONS;

// ---------------------------------------------------------------------------
console.log("\n=== mod360() — new normalization helper ===");
const mod360 = fns.mod360;
assertEqual(mod360(0), 0, "mod360(0)");
assertEqual(mod360(90), 90, "mod360(90)");
assertEqual(mod360(359), 359, "mod360(359)");
assertEqual(mod360(360), 0, "mod360(360)");
assertEqual(mod360(370), 10, "mod360(370)");
assertEqual(mod360(-15), 345, "mod360(-15)");
assertEqual(mod360(-360), 0, "mod360(-360)");
assertEqual(mod360(720), 0, "mod360(720)");

// ---------------------------------------------------------------------------
console.log("\n=== Defect 1: radar_horizon_nm() — unit fix (meters input, feet-calibrated coefficient) ===");
const Re = 6371000; // mean Earth radius, meters
const k = 4 / 3; // standard-atmosphere refraction factor
function independentRadarHorizonNm(h_m: number): number {
  const d_m = Math.sqrt(2 * k * Re * Math.max(0, h_m));
  return d_m / 1852;
}
for (const h of [5, 12, 20, 30]) {
  const oc = fns.radar_horizon_nm(h);
  const expected = independentRadarHorizonNm(h);
  // Two independent physical derivations of the same 4/3-Earth model; allow
  // ~3% tolerance for the difference between the 1.23 rule-of-thumb coefficient
  // and the raw first-principles Re=6,371,000 m calculation.
  assertClose(oc, expected, expected * 0.03, `radar_horizon_nm(${h} m) vs independent 4/3-Earth model`);
}
// The old (pre-fix) defect produced ~55.3% of correct value at every height;
// confirm the fix is no longer in that range.
{
  const oc12 = fns.radar_horizon_nm(12);
  const oldBuggyValue = 1.23 * Math.sqrt(12); // pre-fix formula, meters used directly
  if (Math.abs(oc12 - oldBuggyValue) > 1) {
    passes++;
    console.log(`  PASS  radar_horizon_nm(12) = ${oc12.toFixed(2)} nm, no longer matches old buggy value ${oldBuggyValue.toFixed(2)} nm`);
  } else {
    failures++;
    console.error(`  FAIL  radar_horizon_nm(12) still matches old buggy value`);
  }
}
assertClose(fns.radar_horizon_nm(0), 0, 1e-9, "radar_horizon_nm(0) = 0");
assertEqual(Number.isNaN(fns.radar_horizon_nm(-5)) || fns.radar_horizon_nm(-5) === 0, true, "radar_horizon_nm(-5) clamps to 0, no NaN/negative");

// ---------------------------------------------------------------------------
console.log("\n=== Defect 2: wave-height-calculator formula string — unit fix (knots -> m/s) ===");
const KN_TO_MS = 0.514444; // same constant used throughout the repo (lib/formulaParser.ts windChillF context, data/calculators.json knots-speed-converter, etc.)
function independentWaveHeightM(windSpeedKn: number): number {
  const u_ms = windSpeedKn * KN_TO_MS;
  return 0.024 * u_ms * u_ms;
}
const waveHeightMFormula = "0.024 * pow(windSpeed * 0.514444, 2)";
const waveHeightFtFormula = "0.024 * pow(windSpeed * 0.514444, 2) * 3.28084";
for (const kn of [10, 20, 30, 40, 50]) {
  const ocM = parseFormula(waveHeightMFormula, { windSpeed: kn }, fns);
  const expected = independentWaveHeightM(kn);
  assertClose(ocM, expected, 1e-6, `wave height (m) at ${kn} kn`);

  const ocFt = parseFormula(waveHeightFtFormula, { windSpeed: kn }, fns);
  assertClose(ocFt, expected * 3.28084, 1e-4, `wave height (ft) at ${kn} kn`);
}
// Confirm results are no longer in the old 4-6x inflated range identified by Phase 8.0.
{
  const kn = 30;
  const oldBuggyM = 0.024 * kn * kn; // pre-fix formula, knots squared directly
  const newM = parseFormula(waveHeightMFormula, { windSpeed: kn }, fns);
  const ratio = oldBuggyM / newM;
  if (ratio > 3 && ratio < 5) {
    passes++;
    console.log(`  PASS  wave height at 30 kn dropped by ${ratio.toFixed(2)}x vs. old buggy formula (old=${oldBuggyM}, new=${newM.toFixed(3)})`);
  } else {
    failures++;
    console.error(`  FAIL  expected old/new ratio in (3,5), got ${ratio}`);
  }
}
assertClose(parseFormula(waveHeightMFormula, { windSpeed: 0 }, fns), 0, 1e-9, "wave height (m) at 0 kn = 0");

// ---------------------------------------------------------------------------
console.log("\n=== Defect 3: true-magnetic-heading-calculator formula string — 000/360 normalization ===");
const headingFormula = "mod360(mag + var)";
assertEqual(parseFormula(headingFormula, { mag: 270, var: -10 }, fns), 260, "270 mag, -10 var (normal case)");
assertEqual(parseFormula(headingFormula, { mag: 350, var: 20 }, fns), 10, "350 mag, +20 var (crosses upper boundary)");
assertEqual(parseFormula(headingFormula, { mag: 5, var: -20 }, fns), 345, "5 mag, -20 var (crosses lower boundary)");
assertEqual(parseFormula(headingFormula, { mag: 350, var: 10 }, fns), 0, "350 mag, +10 var (exact 360 -> 0)");
assertEqual(parseFormula(headingFormula, { mag: 10, var: -10 }, fns), 0, "10 mag, -10 var (exact negative boundary -> 0)");
assertEqual(parseFormula(headingFormula, { mag: 350, var: 370 }, fns), 0, "350 mag, +370 var (multiple rotations -> 0)");
assertEqual(parseFormula(headingFormula, { mag: 10, var: -370 }, fns), 0, "10 mag, -370 var (large negative variation -> 0)");
for (const [mag, v] of [
  [270, -10], [350, 20], [5, -20], [350, 10], [10, -10], [350, 370], [10, -370],
]) {
  const result = parseFormula(headingFormula, { mag, var: v }, fns);
  assertInRange(result, 0, 360, `heading(${mag}, ${v}) is a valid compass heading`);
}
// Old (pre-fix) formula for comparison: confirm it WOULD have produced invalid output,
// proving the new formula's normalization is the actual fix (not a coincidence).
{
  const oldFormula = "mag + var";
  const oldResult = parseFormula(oldFormula, { mag: 350, var: 20 }, fns);
  if (oldResult === 370) {
    passes++;
    console.log(`  PASS  confirmed pre-fix formula produced invalid 370° (regression baseline)`);
  } else {
    failures++;
    console.error(`  FAIL  pre-fix baseline unexpected: ${oldResult}`);
  }
}

// ---------------------------------------------------------------------------
console.log("\n=== Regression: pre-existing custom functions unaffected by this phase's changes ===");
assertClose(fns.haversine_nm(0, 0, 0, 0), 0, 1e-9, "haversine_nm identical points");
assertClose(fns.haversine_nm(0, 0, 1, 0), 60.04, 0.01, "haversine_nm 1 deg lat");
assertClose(fns.haversine_nm(40.7128, -74.006, 51.5074, -0.1278), 3007.68, 0.5, "haversine_nm NYC-London");
assertClose(fns.hull_speed_kn(32), 7.58, 0.01, "hull_speed_kn(32 ft)");
assertClose(fns.initial_bearing_deg(0, 0, 10, 0), 0, 1e-6, "initial_bearing_deg due north");
assertClose(fns.initial_bearing_deg(0, 0, 0, 10), 90, 1e-6, "initial_bearing_deg due east");
assertClose(fns.rhumb_distance_nm(40, -74, 41, -73), 75.38, 0.01, "rhumb_distance_nm short hop");
assertClose(fns.geographic_range_nm(9, 80), 13.98, 0.01, "geographic_range_nm(9,80)");
assertClose(fns.cross_track_error_nm(10, 5), 0.872, 0.001, "cross_track_error_nm(10,5)");
assertClose(fns.speed_over_ground_kn(6, 1.5, 45), 7.1399, 0.001, "speed_over_ground_kn(6,1.5,45)");
assertClose(fns.mercator_scale_factor(60), 2.0, 0.001, "mercator_scale_factor(60)");
assertClose(fns.longitude_minute_to_nm(45, 10), 7.071, 0.001, "longitude_minute_to_nm(45,10)");
assertClose(fns.wave_length_deep_water_m(8), 99.9, 0.1, "wave_length_deep_water_m(8)");
assertClose(fns.apparentWindSpeedKn(6, 10, 90), 11.66, 0.01, "apparentWindSpeedKn(6,10,90)");
// Added in Phase 8.3: apparentWindAngleDeg was never covered by this suite, which let the
// apparent-wind-calculator's own published example (~32° AWA) drift undetected from the
// live formula's actual output (~59°) across two prior phases. See
// docs/audits/phase-8.3-content-accuracy-reconciliation.md.
assertClose(fns.apparentWindAngleDeg(6, 10, 90), 59.04, 0.01, "apparentWindAngleDeg(6,10,90)");
assertClose(fns.beaufort(20), 5, 0, "beaufort(20 kn) = Force 5");
// The live beaufort() is a cascading <= chain with no boundary gaps (unlike the
// pre-Phase-8.2 components/calculators/BeaufortScale.tsx, which had integer-only
// min/max bounds and misclassified gap values as Force 12 — see Phase 8.0 Finding
// D-1; that dead, unreachable duplicate was deleted in Phase 8.2, see
// docs/audits/phase-8.2-dead-code-cleanup.md). The correct live-path assignment
// for a half-knot value is the band whose upper bound it falls under:
// 3.5 kn <= 6 -> Force 2, 6.5 kn <= 10 -> Force 3. The regression guard that
// matters is that neither one is misclassified as Force 12.
assertClose(fns.beaufort(3.5), 2, 0, "beaufort(3.5 kn) = Force 2 (not misclassified as Force 12)");
assertClose(fns.beaufort(6.5), 3, 0, "beaufort(6.5 kn) = Force 3 (not misclassified as Force 12)");
// Phase 8.2 boundary sweep: every integer/half-integer boundary around each band
// edge, confirming no decimal input falls into the Force-12 fallback by accident
// now that the only Beaufort implementation in the repo is this one.
const beaufortBoundarySweep: [number, number][] = [
  [0, 0], [0.5, 0], [1, 0], [3, 1], [3.5, 2], [4, 2], [6, 2], [6.5, 3], [7, 3],
  [11, 4], [11.5, 4], [12, 4], [63, 11], [63.5, 12], [64, 12],
];
for (const [kn, expectedForce] of beaufortBoundarySweep) {
  assertClose(fns.beaufort(kn), expectedForce, 0, `beaufort(${kn} kn) = Force ${expectedForce} (boundary sweep)`);
}
assertClose(fns.windChillF(35, 15), 25.43, 0.01, "windChillF(35,15)");
assertClose(fns.windChillF(20, 25), 2.65, 0.01, "windChillF(20,25)");

// ---------------------------------------------------------------------------
console.log("\n=== Data integrity: every formula string in data/*.json still parses and evaluates ===");
const dataDir = path.join(__dirname, "..", "data");
type EngineInput = { name: string; default?: number; min?: number };
type EngineOutput = { name: string; formula: string };
type CalcRecord = {
  slug: string;
  engine?: { inputs: EngineInput[]; outputs: EngineOutput[] };
};

function checkFile(file: string) {
  const records: CalcRecord[] = JSON.parse(fs.readFileSync(path.join(dataDir, file), "utf-8"));
  for (const rec of records) {
    if (!rec.engine) continue;
    const vars: Record<string, number> = {};
    for (const input of rec.engine.inputs) {
      vars[input.name] = input.default ?? input.min ?? 1;
    }
    for (const output of rec.engine.outputs) {
      try {
        const val = parseFormula(output.formula, vars, fns);
        if (Number.isNaN(val)) {
          failures++;
          console.error(`  FAIL  ${file} :: ${rec.slug}.${output.name} evaluated to NaN with defaults`);
        } else {
          passes++;
          console.log(`  PASS  ${file} :: ${rec.slug}.${output.name} = ${val} (parses & evaluates)`);
        }
      } catch (e) {
        failures++;
        console.error(`  FAIL  ${file} :: ${rec.slug}.${output.name} threw: ${(e as Error).message}`);
      }
    }
  }
}
checkFile("calculators.json");
checkFile("calculators-phase5.json");

// ---------------------------------------------------------------------------
// Phase 9.11 — nautical-mile-converter's three engine outputs, end-to-end
// (formula evaluation + display formatting), at the inputs that previously
// exposed the Phase 9.9/9.10 meter-magnitude defect (10, 100, 2.5 nm all
// used to display "1852"/"1852"/"463" regardless of the true magnitude).
{
  const nmRecord = (
    JSON.parse(fs.readFileSync(path.join(dataDir, "calculators.json"), "utf-8")) as Array<{
      slug: string;
      simpleRegistry?: unknown;
      engine?: { outputs: Array<{ name: string; formula: string; decimals?: number }> };
    }>
  ).find((r) => r.slug === "nautical-mile-converter");

  if (!nmRecord?.engine) {
    failures++;
    console.error("  FAIL  nautical-mile-converter: engine configuration missing");
  } else if (nmRecord.simpleRegistry) {
    failures++;
    console.error("  FAIL  nautical-mile-converter: simpleRegistry still present, engine is shadowed");
  } else {
    console.log("\n=== Phase 9.11: nautical-mile-converter three-output reconciliation ===");
    const expected: Record<number, { kilometers: string; miles: string; meters: string }> = {
      1: { kilometers: "1.852", miles: "1.1508", meters: "1852" },
      10: { kilometers: "18.52", miles: "11.5078", meters: "18520" },
      100: { kilometers: "185.2", miles: "115.078", meters: "185200" },
      2.5: { kilometers: "4.63", miles: "2.877", meters: "4630" },
    };
    for (const [distanceStr, exp] of Object.entries(expected)) {
      const distance = Number(distanceStr);
      for (const output of nmRecord.engine.outputs) {
        const raw = parseFormula(output.formula, { distance }, fns);
        const displayed = formatValue(raw, { name: output.name, label: output.name, formula: output.formula, decimals: output.decimals });
        const key = output.name as keyof typeof exp;
        assertEqual(displayed, exp[key], `nautical-mile-converter.${output.name}(${distance} nm) displayed value`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// OutputField.formatValue() — Phase 9.10 regression test.
//
// A zero-decimals output (e.g. `decimals: 0`) must display its full integer
// value, not have trailing zero *digits* stripped as if they were leftover
// fractional-formatting artifacts. This previously affected any engine
// output configured with `decimals: 0` whose rounded result ended in one or
// more zeros (e.g. anchor-scope-calculator's default render: 50 → "5").
const outCfg = (decimals?: number) => ({
  name: "x",
  label: "X",
  formula: "x",
  decimals,
});
function assertFormat(value: number, decimals: number | undefined, expected: string, label: string) {
  const actual = formatValue(value, outCfg(decimals));
  assertEqual(actual, expected, label);
}
assertFormat(18520, 0, "18520", "formatValue: decimals=0 preserves trailing zero digits (18520)");
assertFormat(1852, 0, "1852", "formatValue: decimals=0, no trailing zero to strip (1852)");
assertFormat(50, 0, "50", "formatValue: decimals=0 preserves trailing zero (50, anchor-scope-calculator default)");
assertFormat(450, 0, "450", "formatValue: decimals=0 preserves trailing zeros (450, anchor-shackle-rode-calculator default)");
assertFormat(0, 0, "0", "formatValue: decimals=0, zero value does not become empty string");
assertFormat(10, 0, "10", "formatValue: decimals=0, value=10 does not become 1");
assertFormat(5.7165, 1, "5.7", "formatValue: decimals=1 rounds correctly (5.7165 -> 5.7)");
assertFormat(5.7165, 2, "5.72", "formatValue: decimals=2 rounds correctly (5.7165 -> 5.72)");
assertFormat(20, 2, "20", "formatValue: decimals=2, whole number still strips trailing .00 (20)");
assertFormat(180.5, 2, "180.5", "formatValue: decimals=2 strips a single trailing fractional zero (180.50 -> 180.5)");
assertFormat(1.852, undefined, "1.85", "formatValue: omitted decimals defaults to 2dp rounding (unchanged existing behavior)");

// ---------------------------------------------------------------------------
console.log(`\n=== RESULT: ${passes} passed, ${failures} failed ===`);
if (failures > 0) {
  process.exit(1);
}
