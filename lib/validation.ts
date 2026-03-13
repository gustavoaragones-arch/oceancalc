/**
 * Input validation for calculator fields.
 * Prevents invalid values and shows helpful messages.
 */

export interface ValidationRule {
  min?: number;
  max?: number;
  required?: boolean;
  message?: string;
}

export interface ValidationResult {
  valid: boolean;
  message?: string;
  value?: number;
}

/**
 * Validate a numeric input. Returns valid=true and parsed value, or valid=false with message.
 */
export function validateInput(
  raw: string,
  rules: ValidationRule = {}
): ValidationResult {
  const trimmed = raw.trim();
  if (rules.required && trimmed === "") {
    return { valid: false, message: rules.message ?? "This field is required." };
  }
  if (trimmed === "" || trimmed === "-" || trimmed === ".") {
    return { valid: true, value: NaN };
  }
  const value = parseFloat(trimmed);
  if (!Number.isFinite(value)) {
    return { valid: false, message: rules.message ?? "Enter a valid number." };
  }
  if (rules.min !== undefined && value < rules.min) {
    return {
      valid: false,
      message: rules.message ?? `Value must be at least ${rules.min}.`,
    };
  }
  if (rules.max !== undefined && value > rules.max) {
    return {
      valid: false,
      message: rules.message ?? `Value must be no more than ${rules.max}.`,
    };
  }
  return { valid: true, value };
}

/**
 * Common rules for maritime calculators
 */
export const RULES = {
  positive: { min: 0, message: "Value must be greater than 0." },
  nonNegative: { min: 0, message: "Value must be 0 or greater." },
  latitude: { min: -90, max: 90, message: "Latitude must be between -90 and 90." },
  longitude: { min: -180, max: 180, message: "Longitude must be between -180 and 180." },
  angle: { min: 0, max: 360, message: "Angle must be between 0 and 360." },
  scopeRatio: { min: 3, max: 10, message: "Scope ratio is typically 3:1 to 10:1." },
  speedReasonable: { min: 0, max: 100, message: "Speed seems unrealistic. Check units." },
} as const;
