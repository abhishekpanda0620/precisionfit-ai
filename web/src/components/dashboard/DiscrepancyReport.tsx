import { AlertTriangle, Info, Monitor, Calculator } from "lucide-react";
import { DashboardSection } from "./shared";

type CardioSession = {
  id: string;
  date: string;
  caloriesDevice: number;
  caloriesFormula: number | null;
};

type DiscrepancyReportProps = {
  sessions: CardioSession[];
};

export function DiscrepancyReport({ sessions }: DiscrepancyReportProps) {
  if (sessions.length === 0) return null;

  let totalDevice = 0;
  let totalFormula = 0;
  let missingFormulas = 0;

  sessions.forEach(s => {
    totalDevice += s.caloriesDevice;
    if (s.caloriesFormula !== null) {
      totalFormula += s.caloriesFormula;
    } else {
      missingFormulas++;
    }
  });

  const hasData = totalDevice > 0 && totalFormula > 0;
  const difference = totalDevice - totalFormula;
  const isOverestimated = difference > 0;
  
  // Calculate percentage difference (capped between -100% and +100% for the progress bar visual)
  const percentDiff = hasData ? (difference / totalFormula) * 100 : 0;
  
  // For the visual bar: assuming 50% is parity. 
  // If machine claims +50% more, it shifts right.
  const visualPercentage = Math.max(0, Math.min(100, 50 + (percentDiff / 2)));

  // Agent 4 Rule: Flag if device overestimates by > 30% against scientific formula
  const requiresFlag = percentDiff > 30;

  return (
    <div className="col-span-1 lg:col-span-2">
      <DashboardSection title="Scientific Integrity Report" icon={Info}>
        <div className="space-y-6">
          <p className="text-sm text-zinc-400">
            This report compares the calories your cardio machines claim you burned versus the mathematical reality calculated using the Keytel formula based on your average heart rate and biometrics.
          </p>

          {!hasData ? (
            <div className="text-sm text-zinc-500 italic p-4 bg-zinc-900/30 rounded-lg border border-zinc-800/50">
              Not enough data to generate discrepancy report. Log more sessions with heart rate data.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 flex flex-col items-center justify-center text-center space-y-2">
                  <Monitor className="h-6 w-6 text-blue-400" />
                  <span className="text-xs text-zinc-500 uppercase font-semibold">Machines Claim</span>
                  <span className="text-3xl font-bold text-white">{totalDevice} <span className="text-sm font-normal text-zinc-500">kcal</span></span>
                </div>
                
                <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 flex flex-col items-center justify-center text-center space-y-2">
                  <Calculator className="h-6 w-6 text-emerald-400" />
                  <span className="text-xs text-zinc-500 uppercase font-semibold">Science Calculates</span>
                  <span className="text-3xl font-bold text-white">{Math.round(totalFormula)} <span className="text-sm font-normal text-zinc-500">kcal</span></span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400 font-medium">Discrepancy</span>
                  <span className={`font-bold ${isOverestimated ? 'text-red-400' : 'text-green-400'}`}>
                    {isOverestimated ? '+' : ''}{Math.round(difference)} kcal ({percentDiff > 0 ? '+' : ''}{percentDiff.toFixed(1)}%)
                  </span>
                </div>
                
                {/* Visual Bar */}
                <div className="relative h-4 bg-zinc-800 rounded-full overflow-hidden flex">
                  <div 
                    className={`h-full transition-all duration-1000 ${isOverestimated ? 'bg-red-500' : 'bg-green-500'}`} 
                    style={{ width: `${visualPercentage}%` }}
                  />
                  {/* Center marker for parity */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-zinc-950 z-10" />
                </div>
                <div className="flex justify-between text-xs text-zinc-500 font-medium px-1">
                  <span>Machine Underestimates</span>
                  <span>Parity</span>
                  <span>Machine Overestimates</span>
                </div>
              </div>

              {/* Agent 4 Enforcement Flag */}
              {requiresFlag && (
                <div className="p-4 mt-4 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-200/90 space-y-1">
                    <p className="font-semibold text-amber-500">High Estimation Discrepancy Detected</p>
                    <p>
                      Machines are overestimating your calorie burn by <strong>{percentDiff.toFixed(1)}%</strong>. 
                      Treadmills and bikes often use generalized formulas that don't account for your specific resting metabolic rate, fitness level, or true physiological exertion. Ensure you rely on the science-based formula calculations for strict deficit tracking.
                    </p>
                  </div>
                </div>
              )}
              
              {missingFormulas > 0 && (
                <p className="text-xs text-zinc-600 italic mt-4 text-center">
                  * Note: {missingFormulas} session(s) were excluded from this calculation because they lacked sufficient data for a formula estimate.
                </p>
              )}
            </>
          )}
        </div>
      </DashboardSection>
    </div>
  );
}
