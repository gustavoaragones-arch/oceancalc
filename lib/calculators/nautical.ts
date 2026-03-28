import type { RegistryInputs } from "./types";

export function nauticalMilesToKm(inputs: RegistryInputs): number {
  const nm = inputs.value ?? 0;
  return nm * 1.852;
}

export function knotsToKmh(inputs: RegistryInputs): number {
  const kn = inputs.value ?? 0;
  return kn * 1.852;
}
