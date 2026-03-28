import type { RegistryInputs } from "./types";

/**
 * Sailing time in hours: distance (nautical miles) ÷ speed (knots).
 * Inputs must already be in canonical units.
 */
export function sailingTime(inputs: RegistryInputs): number {
  const distance = inputs.distance ?? 0;
  const speed = inputs.speed ?? 0;
  if (speed === 0) return Number.NaN;
  return distance / speed;
}
