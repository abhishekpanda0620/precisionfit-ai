"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Plus, Scale, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApiResource } from "@/hooks/useApiResource";
import { PageHeader, DashboardSection, EmptyState } from "@/components/dashboard/shared";
import { FormField, DarkInput } from "@/components/dashboard/FormField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WeightEntry = {
  id: string;
  date: string;
  weightKg: number;
};

export default function WeightPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const [weightKg, setWeightKg] = useState("");

  const { data: entries, submitting, create, remove } = useApiResource<WeightEntry>({
    endpoint: "/api/weight",
    queryParams: { userId },
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const result = await create({ userId, weightKg: Number(weightKg) });
    if (result.success) {
      setWeightKg("");
    } else {
      setErrorMsg(result.error);
    }
  };

  const latest = entries[0];
  const previous = entries[1];
  const delta = latest && previous ? (latest.weightKg - previous.weightKg).toFixed(1) : null;

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader title="Weight Tracker" description="Monitor your body weight over time." />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="pt-6">
            <p className="text-xs text-zinc-500 font-medium mb-1">Current Weight</p>
            <p className="text-3xl sm:text-4xl font-bold text-white">
              {latest?.weightKg ?? "—"} <span className="text-base sm:text-lg font-normal text-zinc-500">kg</span>
            </p>
            {delta && (
              <p className={`text-sm mt-1 font-medium ${Number(delta) > 0 ? "text-red-400" : Number(delta) < 0 ? "text-green-400" : "text-zinc-500"}`}>
                {Number(delta) > 0 ? `+${delta}` : delta} kg since last entry
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <Plus className="h-4 w-4" /> Log Weight
            </CardTitle>
          </CardHeader>
          <CardContent>
            {errorMsg && (
              <div className="text-sm font-medium text-red-500 bg-red-500/10 p-2 rounded-md border border-red-500/20 mb-3">
                Validation Error: {errorMsg}
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex gap-3">
              <FormField label="Weight (kg)" className="flex-1">
                <DarkInput type="number" step="0.1" placeholder="78.5" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} required />
              </FormField>
              <Button type="submit" disabled={submitting} className="bg-white text-zinc-950 hover:bg-zinc-200 font-semibold self-end">
                {submitting ? "..." : "Log"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <DashboardSection title="Weight History" icon={Scale}>
        {entries.length === 0 ? (
          <EmptyState message="No weight entries yet. Start logging above!" />
        ) : (
          <div className="space-y-2">
            {entries.map((entry, i) => {
              const prev = entries[i + 1];
              const change = prev ? (entry.weightKg - prev.weightKg).toFixed(1) : null;
              return (
                <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
                  <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                    <span className="text-zinc-400 text-xs sm:text-sm w-20 sm:w-24">{new Date(entry.date).toLocaleDateString()}</span>
                    <span className="text-white font-semibold text-sm sm:text-base">{entry.weightKg} kg</span>
                    {change && (
                      <span className={`text-xs font-medium ${Number(change) > 0 ? "text-red-400" : Number(change) < 0 ? "text-green-400" : "text-zinc-500"}`}>
                        {Number(change) > 0 ? `+${change}` : change} kg
                      </span>
                    )}
                  </div>
                  <button onClick={() => remove(entry.id)} className="text-zinc-500 hover:text-red-400 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </DashboardSection>
    </div>
  );
}
