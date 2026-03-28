import type { CalculatorEntry } from "./types";

export const TOOL_VARIANT_IDS = [
  "km",
  "miles",
  "meters",
  "formula",
  "example",
] as const;

/** Variant path segments for `/tools/[slug]/[variant]` (sitemap + routing). */
export const toolVariants: readonly ToolVariantId[] = TOOL_VARIANT_IDS;

export type ToolVariantId = (typeof TOOL_VARIANT_IDS)[number];

export function isToolVariantId(id: string): id is ToolVariantId {
  return (TOOL_VARIANT_IDS as readonly string[]).includes(id);
}

export interface VariantPageCopy {
  pageTitle: string;
  description: string;
  lead: string;
}

function baseDescription(calculator: CalculatorEntry): string {
  return calculator.description;
}

/** Long-tail titles + intros for variant URLs (canonical remains main tool). */
export function getVariantPageCopy(
  calculator: CalculatorEntry,
  variant: ToolVariantId
): VariantPageCopy {
  const t = calculator.title;
  switch (variant) {
    case "km":
      return {
        pageTitle: `${t} — Kilometers`,
        description: `${baseDescription(calculator)} Focus on kilometer outputs and km-related conversions.`,
        lead: `Use this view when you need kilometer-focused results from the ${t}. Enter your values above; results stay synchronized with the full tool.`,
      };
    case "miles":
      return {
        pageTitle: `${t} — Miles`,
        description: `${baseDescription(calculator)} Emphasis on statute miles and mile-based planning.`,
        lead: `This layout highlights mile-related thinking for the ${t}. The same calculator runs above—ideal when your notes or road book use miles.`,
      };
    case "meters":
      return {
        pageTitle: `${t} — Meters`,
        description: `${baseDescription(calculator)} Meter-based distances and metric maritime work.`,
        lead: `When you want meter-centric outputs from the ${t}, work in the fields above and cross-check against metric charts or soundings.`,
      };
    case "formula":
      return {
        pageTitle: `${t} — Formula`,
        description: `Formula reference for the ${t}. How the math works, with the live calculator on the same page.`,
        lead: `See how the ${t} is derived. Use the live tool above, then read the formula section below for the exact relationship and context.`,
      };
    case "example":
      return {
        pageTitle: `${t} — Examples`,
        description: `Worked-style context for the ${t}. Practice scenarios alongside the calculator.`,
        lead: `Explore typical numbers with the ${t}. Try the examples in the Examples section below while you vary inputs in the calculator.`,
      };
    default:
      return {
        pageTitle: t,
        description: baseDescription(calculator),
        lead: "",
      };
  }
}
