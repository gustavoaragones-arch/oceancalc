import type { RegistryFormulaFn } from "./types";
import * as nautical from "./nautical";
import * as navigation from "./navigation";

export type { RegistryInputs, RegistryFormulaFn } from "./types";

/**
 * Maps `simpleRegistry.formulaKey` from calculator JSON to pure functions.
 * Functions receive canonical numeric inputs (e.g. nm, knots) after unit conversion.
 */
export const calculatorMap: Record<string, RegistryFormulaFn> = {
  nauticalMilesToKm: (inputs) => nautical.nauticalMilesToKm(inputs),
  knotsToKmh: (inputs) => nautical.knotsToKmh(inputs),
  sailingTime: (inputs) => navigation.sailingTime(inputs),
};
