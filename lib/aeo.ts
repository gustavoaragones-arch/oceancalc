import * as fs from "fs";
import * as path from "path";
import type { CalculatorEntry } from "./types";

/** Minimal slice from `generateContent` for AEO takeaways (avoids import cycle). */
export interface AeoGeneratedSlice {
  intro: string;
  howTo: string;
}

/** Key takeaways: `<strong>entity</strong> — definition` rows. */
export interface KeyTakeawayBullet {
  entity: string;
  definition: string;
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
  "rhumb-distance-calculator": ["rhumb line"],
  "statute-nautical-mile-converter": ["nautical mile"],
  "latitude-degrees-to-nm-calculator": ["nautical mile"],
  "longitude-minute-nautical-mile-calculator": ["nautical mile"],
  "cable-nautical-mile-converter": ["nautical mile"],
  "fuel-range-nautical-calculator": ["nautical mile", "knot"],
  "anchor-shackle-rode-calculator": ["fathom"],
  "anchor-rode-shackles-calculator": ["fathom"],
  "geographic-range-lights-calculator": ["nautical chart"],
  "radar-horizon-calculator": ["nautical chart"],
  "drift-set-distance-calculator": ["dead reckoning"],
  "true-magnetic-heading-calculator": ["heading", "magnetic variation"],
  "speed-over-ground-calculator": ["knot"],
  "meters-second-knots-converter": ["knot"],
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

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Strip leading “A {term} is …” so the em-dash reads as entity — rest. */
function definitionAfterEntity(def: string, term: string): string {
  const t = term.trim();
  if (!t) return def;
  const re = new RegExp(`^(A|An|The)\\s+${escapeRe(t)}\\s+is\\s+`, "i");
  const stripped = def.replace(re, "").trim();
  return stripped.length > 0 ? stripped : def;
}

function entityDisplayName(term: string): string {
  if (term === term.toUpperCase() && term.length <= 4) return term;
  return term.charAt(0).toUpperCase() + term.slice(1);
}

/** Short bullets: entity — definition (AEO / entity parsing). */
export function getAeoKeyTakeaways(
  calculator: CalculatorEntry,
  generated: AeoGeneratedSlice
): KeyTakeawayBullet[] {
  const items: KeyTakeawayBullet[] = [];
  const lead = getEntityLeadForIntro(calculator);
  const entities = getEntitiesForCalculator(calculator);

  if (!lead) {
    for (const e of entities.slice(0, 2)) {
      items.push({
        entity: entityDisplayName(e.term),
        definition: definitionAfterEntity(e.definition, e.term),
      });
    }
  } else if (entities[1]) {
    const e = entities[1];
    items.push({
      entity: entityDisplayName(e.term),
      definition: definitionAfterEntity(e.definition, e.term),
    });
  }

  const introOne = takeSentences(generated.intro, 1);
  if (introOne) {
    items.push({
      entity: calculator.title,
      definition: introOne,
    });
  }

  const formulaOne = takeSentences(calculator.formula, 1);
  if (
    formulaOne &&
    !items.some((it) => it.definition.includes(formulaOne.slice(0, 20)))
  ) {
    items.push({
      entity: "Formula",
      definition: formulaOne,
    });
  }

  const howOne = takeSentences(generated.howTo, 1);
  if (howOne && items.length < 5) {
    items.push({
      entity: "How to use",
      definition: howOne,
    });
  }

  const seen = new Set<string>();
  const deduped = items.filter((it) => {
    const k = `${it.entity}|${it.definition.slice(0, 96)}`.toLowerCase();
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
