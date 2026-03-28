import type { CalculatorEntry } from "./types";
import { templates } from "@/data/contentTemplates";

export interface GeneratedToolContent {
  intro: string;
  howTo: string;
  formulaLine: string;
  useCases: string;
  tips: string[];
  mergedFaq: Array<{ question: string; answer: string }>;
}

function mergeFaqs(
  specific: Array<{ question: string; answer: string }>,
  templateBlock: Array<{ question: string; answer: string }>
): Array<{ question: string; answer: string }> {
  const seen = new Set(specific.map((f) => f.question.trim().toLowerCase()));
  const out = [...specific];
  for (const t of templateBlock) {
    const key = t.question.trim().toLowerCase();
    if (!seen.has(key)) {
      out.push(t);
      seen.add(key);
    }
  }
  return out;
}

/** Plain formula line for templates (display / SEO). */
export function getFormulaTextForGenerator(calculator: CalculatorEntry): string {
  if (calculator.simpleRegistry?.formulaText) {
    return calculator.simpleRegistry.formulaText;
  }
  if (calculator.engine?.formulaDisplay) {
    return calculator.engine.formulaDisplay;
  }
  return calculator.formula;
}

export function generateContent(calculator: CalculatorEntry): GeneratedToolContent {
  const formulaText = getFormulaTextForGenerator(calculator);
  const t = templates.default;
  return {
    intro: t.intro(calculator.title),
    howTo: t.howTo(calculator.title),
    formulaLine: t.formula(formulaText),
    useCases: t.useCases(calculator.title),
    tips: t.tips(calculator.title),
    mergedFaq: mergeFaqs(calculator.faq, t.templateFaq),
  };
}
