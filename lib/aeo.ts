import * as fs from "fs";
import * as path from "path";
import type { CalculatorEntry } from "./types";

/** Minimal slice from `generateContent` for AEO takeaways (avoids import cycle). */
export interface AeoGeneratedSlice {
  intro: string;
  howTo: string;
}

export interface EntityRecord {
  definition: string;
  type: string;
}

export type EntitiesJson = Record<string, EntityRecord>;

let entitiesCache: EntitiesJson | null = null;

export function loadEntities(): EntitiesJson {
  if (!entitiesCache) {
    const p = path.join(process.cwd(), "data", "entities.json");
    entitiesCache = JSON.parse(fs.readFileSync(p, "utf-8")) as EntitiesJson;
  }
  return entitiesCache;
}

/** Map calculator slug → entity keys in entities.json (lowercase keys). */
const SLUG_TO_ENTITIES: Record<string, string[]> = {
  "nautical-mile-converter": ["nautical mile"],
  "knots-speed-converter": ["knot"],
  "knots-to-kmh": ["knot"],
  "great-circle-distance-calculator": ["great circle", "rhumb line"],
  "initial-bearing-calculator": ["bearing"],
  "distance-to-horizon-calculator": ["nautical chart"],
  "sailing-time-calculator": ["dead reckoning", "knot"],
  "anchor-scope-calculator": ["anchor scope"],
  "beaufort-scale-calculator": ["Beaufort scale"],
  "apparent-wind-calculator": ["apparent wind", "true wind"],
  "wave-height-calculator": ["significant wave height"],
  "fathom-converter": ["fathom"],
  "hull-speed-calculator": ["hull speed"],
  "vmg-calculator": ["VMG"],
  "boat-fuel-consumption-calculator": ["nautical mile"],
  "rhumb-distance-calculator": ["rhumb line"],
  "statute-nautical-mile-converter": ["nautical mile"],
  "latitude-degrees-to-nm-calculator": ["nautical mile"],
  "longitude-minute-nautical-mile-calculator": ["nautical mile"],
  "cable-nautical-mile-converter": ["nautical mile"],
  "fuel-range-nautical-calculator": ["nautical mile", "knot"],
  "anchor-shackle-rode-calculator": ["anchor scope"],
  "anchor-rode-shackles-calculator": ["anchor scope"],
  "geographic-range-lights-calculator": ["nautical chart"],
  "radar-horizon-calculator": ["nautical chart"],
  "drift-set-distance-calculator": ["bearing", "dead reckoning"],
  "true-magnetic-heading-calculator": ["bearing"],
  "cross-track-error-calculator": ["great circle"],
  "mercator-scale-factor-calculator": ["great circle"],
  "speed-over-ground-calculator": ["knot"],
  "meters-second-knots-converter": ["knot"],
  "wave-length-from-period-calculator": ["significant wave height"],
  "sail-area-displacement-calculator": ["hull speed"],
  "capsize-screening-calculator": ["hull speed"],
};

export interface EntityWithTerm extends EntityRecord {
  term: string;
}

export function getEntitiesForCalculator(calculator: CalculatorEntry): EntityWithTerm[] {
  const keys = SLUG_TO_ENTITIES[calculator.slug];
  if (!keys?.length) return [];
  const data = loadEntities();
  return keys
    .map((term) => {
      const rec = data[term];
      return rec ? { term, ...rec } : null;
    })
    .filter((e): e is EntityWithTerm => e != null);
}

function takeSentences(text: string, maxSentences: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (!t) return "";
  const parts = t.split(/(?<=[.!?])\s+/).filter(Boolean);
  return parts.slice(0, maxSentences).join(" ").trim();
}

/** Direct Q&A block for AI extraction (1–2 sentences in answer). */
export function getAeoAnswerBlock(calculator: CalculatorEntry): {
  question: string;
  answer: string;
  explanation?: string;
} {
  const question = `What is the ${calculator.title}?`;

  const faqWhat = calculator.faq.find((f) => /^what (is|does)\b/i.test(f.question.trim()));
  const fromFaq = faqWhat ? takeSentences(faqWhat.answer, 2) : "";

  const answer =
    fromFaq ||
    takeSentences(calculator.description, 2) ||
    `The ${calculator.title} computes maritime quantities using standard nautical formulas and your inputs.`;

  const explanation = calculator.formulaDetail
    ? takeSentences(calculator.formulaDetail, 2)
    : undefined;

  return {
    question,
    answer,
    explanation: explanation && explanation !== answer ? explanation : undefined,
  };
}

/** Short bullets for structured AI summaries. */
export function getAeoKeyTakeaways(
  calculator: CalculatorEntry,
  generated: AeoGeneratedSlice
): string[] {
  const points: string[] = [];
  const lead = getEntityLeadForIntro(calculator);
  const entities = getEntitiesForCalculator(calculator);
  if (!lead) {
    for (const e of entities.slice(0, 2)) {
      points.push(e.definition);
    }
  } else if (entities[1]) {
    points.push(entities[1].definition);
  }

  const introOne = takeSentences(generated.intro, 1);
  if (introOne) points.push(introOne);

  const formulaOne = takeSentences(calculator.formula, 1);
  if (formulaOne && !points.some((p) => p.includes(formulaOne.slice(0, 20)))) {
    points.push(formulaOne);
  }

  const howOne = takeSentences(generated.howTo, 1);
  if (howOne && points.length < 4) points.push(howOne);

  const seen = new Set<string>();
  const deduped = points.filter((p) => {
    const k = p.slice(0, 96).toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return deduped.slice(0, 5);
}

/** Definition-first lead merged into generated intro (short, one entity). */
export function getEntityLeadForIntro(calculator: CalculatorEntry): string | null {
  const entities = getEntitiesForCalculator(calculator);
  if (entities.length === 0) return null;
  return takeSentences(entities[0].definition, 1);
}
