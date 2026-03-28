export interface UnitPair {
  from: string;
  to: string;
  factor: number;
}

export interface EngineInputConfig {
  name: string;
  label: string;
  type: "number";
  unit: string;
  units?: string[];
  default?: number;
  min?: number;
  max?: number;
  step?: string;
}

export interface EngineOutputConfig {
  name: string;
  label: string;
  formula: string;
  unit?: string;
  format?: "number" | "hours" | "decimal";
  decimals?: number;
}

export interface CalculatorEngineConfig {
  inputs: EngineInputConfig[];
  outputs: EngineOutputConfig[];
  formulaDisplay?: string;
}

/** Registry-based shell: multi-input, optional units, validation, formula help text. */
export interface SimpleRegistryInput {
  name: string;
  label: string;
  type: "number";
  /** Default selected unit (e.g. nmi, knots, kmh). */
  unit?: string;
  /** If multiple, shows unit dropdown and converts to `canonical` for the formula. */
  units?: string[];
  /** Unit the formula expects after conversion (e.g. nmi, knots). */
  canonical?: string;
  default?: number;
  min?: number;
  max?: number;
  step?: string;
  validation?: "positive" | "nonNegative";
}

export interface SimpleRegistryOutput {
  unit: string;
  decimals?: number;
}

export interface SimpleRegistryConfig {
  formulaKey: string;
  inputs: SimpleRegistryInput[];
  /** Prefer `output` for new calculators. */
  resultLabel?: string;
  decimals?: number;
  output?: SimpleRegistryOutput;
  /** Shown in FormulaBlock (e.g. time = distance / speed). */
  formulaText?: string;
  formulaExplanation?: string;
}

export interface CalculatorEntry {
  slug: string;
  title: string;
  description: string;
  category: string;
  type: string;
  /**
   * When set, renders `CalculatorShell` with `lib/calculators` map (takes precedence over `engine` / legacy UI).
   */
  simpleRegistry?: SimpleRegistryConfig;
  /** Legacy: unit converter pairs. Use engine.inputs/outputs for universal engine. */
  unitPairs?: UnitPair[];
  defaultFrom?: string;
  defaultTo?: string;
  /** Universal engine: config-driven calculator */
  engine?: CalculatorEngineConfig;
  formula: string;
  formulaDetail?: string;
  examples?: string[];
  faq: Array<{ question: string; answer: string }>;
}

export interface KnotEntry {
  slug: string;
  name: string;
  category: string;
  difficulty: string;
  uses: string[];
  steps: string[];
  faq: Array<{ question: string; answer: string }>;
}

export interface ArticleEntry {
  slug: string;
  title: string;
  description: string;
  category: string;
  relatedToolSlugs?: string[];
  content: string;
  faq: Array<{ question: string; answer: string }>;
}

export type ContentCategory =
  | "tools"
  | "knots"
  | "navigation"
  | "wind-waves"
  | "maritime-measurements"
  | "sailing";

export const CATEGORY_PATHS: Record<ContentCategory, string> = {
  tools: "/tools",
  knots: "/knots",
  navigation: "/navigation",
  "wind-waves": "/wind-waves",
  "maritime-measurements": "/maritime-measurements",
  sailing: "/sailing",
};
