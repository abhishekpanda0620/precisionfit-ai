/**
 * Scientific calorie estimation formulas.
 * Per the Scientific Integrity Agent: all formulas must be transparent and traceable.
 */

/**
 * Keytel HR-Based Calorie Burn Formula
 * 
 * Male:   cal/min = (-55.0969 + 0.6309*HR + 0.1988*W + 0.2017*A) / 4.184
 * Female: cal/min = (-20.4022 + 0.4472*HR - 0.1263*W + 0.074*A) / 4.184
 * 
 * Reference: Keytel et al. (2005) — "Prediction of energy expenditure from 
 * heart rate monitoring during submaximal exercise"
 */
export function keytelCalorieBurn(
  avgHeartRate: number,
  durationMinutes: number,
  weightKg: number = 75,
  age: number = 30,
  gender: 'male' | 'female' = 'male'
): number {
  let calPerMin: number;

  if (gender === 'male') {
    calPerMin = (-55.0969 + 0.6309 * avgHeartRate + 0.1988 * weightKg + 0.2017 * age) / 4.184;
  } else {
    calPerMin = (-20.4022 + 0.4472 * avgHeartRate - 0.1263 * weightKg + 0.074 * age) / 4.184;
  }

  return Math.max(0, Math.round(calPerMin * durationMinutes));
}
