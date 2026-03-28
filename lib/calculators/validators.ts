export function validatePositive(value: number): string | null {
  if (value <= 0) return "Value must be greater than zero";
  return null;
}

export function validateNonNegative(value: number): string | null {
  if (value < 0) return "Value cannot be negative";
  return null;
}
