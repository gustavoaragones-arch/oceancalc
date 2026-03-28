import * as nautical from "./nautical";

export type RegistryInputs = Record<string, number>;

export type RegistryFormulaFn = (inputs: RegistryInputs) => number;

/**
 * Maps `simpleRegistry.formulaKey` from calculator JSON to pure functions.
 * Add new calculators: implement the function, then register it here.
 */
export const calculatorMap: Record<string, RegistryFormulaFn> = {
  nauticalMilesToKm: (inputs) => nautical.nauticalMilesToKm(inputs.value ?? 0),
  knotsToKmh: (inputs) => nautical.knotsToKmh(inputs.value ?? 0),
};
