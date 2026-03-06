"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Plus, Activity, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApiResource } from "@/hooks/useApiResource";
import { PageHeader, StatCard, DashboardSection, EmptyState } from "@/components/dashboard/shared";
import { FormField, DarkInput } from "@/components/dashboard/FormField";

type CardioSession = {
  id: string;
  date: string;
  durationMinutes: number;
  distanceKm: number;
  caloriesDevice: number;
  caloriesFormula: number | null;
  avgHeartRate: number;
};

const INITIAL_FORM = { durationMinutes: "", distanceKm: "", caloriesDevice: "", avgHeartRate: "" };

export default function ActivityPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const [form, setForm] = useState(INITIAL_FORM);

  const { data: sessions, submitting, create, remove } = useApiResource<CardioSession>({
    endpoint: "/api/cardio",
    queryParams: { userId },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await create({
      userId,
      durationMinutes: Number(form.durationMinutes),
      distanceKm: Number(form.distanceKm),
      caloriesDevice: Number(form.caloriesDevice),
      avgHeartRate: Number(form.avgHeartRate),
    });
    if (success) setForm(INITIAL_FORM);
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const totalBurned = sessions.reduce((sum, s) => sum + (s.caloriesFormula ?? s.caloriesDevice), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader title="Activity Log" description="Track cardio sessions with formula-based calorie estimation." />

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <StatCard title="Sessions" value={sessions.length} icon={Activity} />
        <StatCard title="Total Burned" value={totalBurned} unit="kcal" icon={Activity} />
      </div>

      <DashboardSection title="Log Cardio Session" icon={Plus}>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <FormField label="Duration (min)">
            <DarkInput type="number" placeholder="30" value={form.durationMinutes} onChange={update("durationMinutes")} required />
          </FormField>
          <FormField label="Distance (km)">
            <DarkInput type="number" step="0.1" placeholder="5.0" value={form.distanceKm} onChange={update("distanceKm")} required />
          </FormField>
          <FormField label="Device Calories">
            <DarkInput type="number" placeholder="350" value={form.caloriesDevice} onChange={update("caloriesDevice")} required />
          </FormField>
          <FormField label="Avg Heart Rate">
            <DarkInput type="number" placeholder="145" value={form.avgHeartRate} onChange={update("avgHeartRate")} required />
          </FormField>
          <div className="col-span-2 lg:col-span-4">
            <Button type="submit" disabled={submitting} className="bg-white text-zinc-950 hover:bg-zinc-200 font-semibold w-full sm:w-auto">
              {submitting ? "Logging..." : "Log Session"}
            </Button>
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
