/**
 * Centralized validation rules for the Input Validation Agent.
 * All numerical limits are defined here and shared across route modules.
 */

export const LIMITS = {
  // Cardio
  HR_MIN: 30,
  HR_MAX: 220,
  DURATION_MIN: 1,
  DURATION_MAX: 1440,
  DISTANCE_MIN: 0,
  DISTANCE_MAX: 500,

  // Nutrition
  CALORIES_MIN: 0,
  CALORIES_MAX: 10000,
  GRAMS_MIN: 0,
  GRAMS_MAX: 5000,
  MACROS_MIN: 0,
  MACROS_MAX: 2000,

  // Weight
  WEIGHT_MIN: 20,
  WEIGHT_MAX: 500,
} as const;

type ValidationRule = {
  field: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
};

/**
 * Validates an array of numeric fields against defined limits.
 * Returns the first error message found, or null if all inputs are valid.
 */
export function validateNumericFields(rules: ValidationRule[]): string | null {
  for (const rule of rules) {
    if (rule.value === undefined || rule.value === null) continue;
    if (rule.value < rule.min || rule.value > rule.max) {
      const unit = rule.unit ? ` ${rule.unit}` : '';
      return `${rule.field} must be between ${rule.min}-${rule.max}${unit}`;
    }
  }
  return null;
}

/**
 * Validates that all required fields are present in the request body.
 * Returns the first missing field name, or null if all are present.
 */
export function validateRequired(body: Record<string, unknown>, fields: string[]): string | null {
  for (const field of fields) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      return `${field} is required`;
    }
  }
  return null;
}
