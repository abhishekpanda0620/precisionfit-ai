"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Plus, Activity, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApiResource } from "@/hooks/useApiResource";
import { PageHeader, StatCard, DashboardSection, EmptyState } from "@/components/dashboard/shared";
import { FormField, DarkInput } from "@/components/dashboard/FormField";
import { VisionUpload } from "@/components/dashboard/VisionUpload";

type CardioSession = {
  id: string;
  date: string;
  durationMinutes: number;
  distanceKm: number;
  caloriesDevice: number;
  caloriesFormula: number | null;
  avgHeartRate: number;
  confidenceScore?: number;
};

const INITIAL_FORM = { durationMinutes: "", distanceKm: "", caloriesDevice: "", avgHeartRate: "" };

export default function ActivityPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const [form, setForm] = useState(INITIAL_FORM);
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null);

  const { data: sessions, submitting, create, remove } = useApiResource<CardioSession>({
    endpoint: "/api/cardio",
    queryParams: { userId },
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const result = await create({
      userId,
      durationMinutes: Number(form.durationMinutes),
      distanceKm: Number(form.distanceKm),
      caloriesDevice: Number(form.caloriesDevice),
      avgHeartRate: Number(form.avgHeartRate),
      source: confidenceScore !== null ? "vision_extraction" : "manual",
      confidenceScore: confidenceScore !== null ? confidenceScore : undefined,
    });
    if (result.success) {
      setForm(INITIAL_FORM);
      setConfidenceScore(null);
    } else {
      setErrorMsg(result.error);
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleVisionExtraction = (data: any) => {
    // Sanitize hallucinatory or out-of-bounds values from the OCR
    const safeNum = (val: any, min: number, max: number) => {
      const num = Number(val);
      if (!val || isNaN(num) || num < min || num > max) return "";
      return num.toString();
    };

    setForm({
      durationMinutes: safeNum(data.durationMinutes, 1, 1440),
      distanceKm: safeNum(data.distanceKm, 0.1, 500),
      caloriesDevice: safeNum(data.caloriesDevice, 10, 10000),
      avgHeartRate: safeNum(data.avgHeartRate, 30, 220),
    });
    setConfidenceScore(data.confidenceScore ?? 1.0);
  };

  const totalBurned = sessions.reduce((sum, s) => sum + (s.caloriesFormula ?? s.caloriesDevice), 0);
  
  // Vision Confidence Agent UI Rule
  const needsVerification = confidenceScore !== null && confidenceScore < 0.85;
  const inputClassOverride = needsVerification ? "border-amber-500/50 focus-visible:ring-amber-500/50 ring-amber-500/20" : undefined;

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader title="Activity Log" description="Track cardio sessions with formula-based calorie estimation." />

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <StatCard title="Sessions" value={sessions.length} icon={Activity} />
        <StatCard title="Total Burned" value={totalBurned} unit="kcal" icon={Activity} />
      </div>

      <DashboardSection title="Log Cardio Session" icon={Plus}>
        <VisionUpload onExtract={handleVisionExtraction} />
        
        {needsVerification && (
          <div className="col-span-2 lg:col-span-4 mb-4 p-3 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-200">
              <strong>Low Confidence ({Math.round(confidenceScore * 100)}%):</strong> 
              {" "}The image was unclear or some fields couldn't be detected. Please manually verify and correct the highlighted fields below.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <FormField label="Duration (min)">
            <DarkInput className={inputClassOverride} type="number" placeholder="30" value={form.durationMinutes} onChange={update("durationMinutes")} required />
          </FormField>
          <FormField label="Distance (km)">
            <DarkInput className={inputClassOverride} type="number" step="0.1" placeholder="5.0" value={form.distanceKm} onChange={update("distanceKm")} required />
          </FormField>
          <FormField label="Device Calories">
            <DarkInput className={inputClassOverride} type="number" placeholder="350" value={form.caloriesDevice} onChange={update("caloriesDevice")} required />
          </FormField>
          <FormField label="Avg Heart Rate">
            <DarkInput className={inputClassOverride} type="number" placeholder="145" value={form.avgHeartRate} onChange={update("avgHeartRate")} required />
          </FormField>
          <div className="col-span-2 lg:col-span-4 flex flex-col gap-2 mt-2">
            {errorMsg && (
              <div className="text-sm font-medium text-red-500 bg-red-500/10 p-2 rounded-md border border-red-500/20">
                Validation Error: {errorMsg}
              </div>
            )}
            <div className="flex items-center justify-between">
              <Button type="submit" disabled={submitting} className="bg-white text-zinc-950 hover:bg-zinc-200 font-semibold w-full sm:w-auto">
                {submitting ? "Logging..." : "Log Session"}
              </Button>
              {confidenceScore !== null && (
                <span className="text-xs text-zinc-500 font-medium">Source: AI Extraction</span>
              )}
            </div>
          </div>
        </form>
      </DashboardSection>

      <DashboardSection title="Session History" icon={Activity}>
        {sessions.length === 0 ? (
          <EmptyState message="No sessions logged yet. Start tracking above!" />
        ) : (
          <div className="space-y-2 sm:space-y-0">
            {/* Mobile: card layout */}
            <div className="sm:hidden space-y-3">
              {sessions.map((s) => {
                const delta = s.caloriesFormula ? s.caloriesFormula - s.caloriesDevice : null;
                return (
                  <div key={s.id} className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400 text-xs">{new Date(s.date).toLocaleDateString()}</span>
                      <button onClick={() => remove(s.id)} className="text-zinc-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-zinc-500">Duration</span><p className="text-white font-medium">{s.durationMinutes} min</p></div>
                      <div><span className="text-zinc-500">Distance</span><p className="text-white font-medium">{s.distanceKm} km</p></div>
                      <div><span className="text-zinc-500">Device</span><p className="text-white font-medium">{s.caloriesDevice} kcal</p></div>
                      <div>
                        <span className="text-zinc-500">Formula</span>
                        <p className="text-white font-medium">{s.caloriesFormula ?? "—"} kcal</p>
                        {delta !== null && (
                          <span className={`text-xs ${delta > 0 ? "text-green-400" : delta < 0 ? "text-red-400" : "text-zinc-500"}`}>
                            {delta > 0 ? `+${delta}` : delta}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop: table layout */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    {["Date","Duration","Distance","HR","Device Cal","Formula Cal","Δ",""].map((h) => (
                      <th key={h} className="text-left py-3 px-2 text-zinc-400 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => {
                    const delta = s.caloriesFormula ? s.caloriesFormula - s.caloriesDevice : null;
                    return (
                      <tr key={s.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                        <td className="py-3 px-2 text-zinc-300">{new Date(s.date).toLocaleDateString()}</td>
                        <td className="py-3 px-2 text-white">{s.durationMinutes} min</td>
                        <td className="py-3 px-2 text-white">{s.distanceKm} km</td>
                        <td className="py-3 px-2 text-white">{s.avgHeartRate} bpm</td>
                        <td className="py-3 px-2 text-white">{s.caloriesDevice}</td>
                        <td className="py-3 px-2 text-white font-medium">{s.caloriesFormula ?? "—"}</td>
                        <td className={`py-3 px-2 font-medium ${delta && delta > 0 ? "text-green-400" : delta && delta < 0 ? "text-red-400" : "text-zinc-500"}`}>
                          {delta !== null ? (delta > 0 ? `+${delta}` : delta) : "—"}
                        </td>
                        <td className="py-3 px-2">
                          <button onClick={() => remove(s.id)} className="text-zinc-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </DashboardSection>
    </div>
  );
}
