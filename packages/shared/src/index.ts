// Shared Types for PrecisionFit AI

export type ValidationStatus = 'pending' | 'verified' | 'flagged';

export interface CardioSession {
  id: string;
  durationMinutes: number;
  distanceKm: number;
  caloriesDevice: number;
  caloriesFormula?: number;
  avgHeartRate: number;
  source: 'manual' | 'vision_extraction';
  confidenceScore?: number;
  status: ValidationStatus;
}
