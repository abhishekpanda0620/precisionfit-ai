"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Plus, Utensils, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApiResource } from "@/hooks/useApiResource";
import { PageHeader, StatCard, DashboardSection, EmptyState } from "@/components/dashboard/shared";
import { FormField, DarkInput } from "@/components/dashboard/FormField";

type MealEntry = {
  id: string;
  date: string;
  foodName: string;
  amountGrams: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
};

const INITIAL_FORM = {
  foodName: "", amountGrams: "", calories: "",
  proteinGrams: "", carbsGrams: "", fatGrams: "",
};

export default function MealsPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState(INITIAL_FORM);

  const { data: meals, submitting, create, remove } = useApiResource<MealEntry>({
    endpoint: "/api/meals",
    queryParams: { userId, date: today },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await create({
      userId,
      foodName: form.foodName,
      amountGrams: Number(form.amountGrams),
      calories: Number(form.calories),
      proteinGrams: Number(form.proteinGrams) || 0,
      carbsGrams: Number(form.carbsGrams) || 0,
      fatGrams: Number(form.fatGrams) || 0,
    });
    if (success) setForm(INITIAL_FORM);
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const totals = meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.proteinGrams,
      carbs: acc.carbs + m.carbsGrams,
      fat: acc.fat + m.fatGrams,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader title="Meal Log" description="Track daily nutrition with macro breakdowns." />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Calories" value={totals.calories} unit="kcal" />
        <StatCard title="Protein" value={totals.protein.toFixed(1)} unit="g" />
        <StatCard title="Carbs" value={totals.carbs.toFixed(1)} unit="g" />
        <StatCard title="Fat" value={totals.fat.toFixed(1)} unit="g" />
      </div>

      <DashboardSection title="Log Meal" icon={Plus}>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <FormField label="Food Name" className="col-span-2 lg:col-span-1">
            <DarkInput placeholder="Chicken Breast" value={form.foodName} onChange={update("foodName")} required />
          </FormField>
          <FormField label="Amount (g)">
            <DarkInput type="number" placeholder="200" value={form.amountGrams} onChange={update("amountGrams")} required />
          </FormField>
          <FormField label="Calories">
            <DarkInput type="number" placeholder="330" value={form.calories} onChange={update("calories")} required />
          </FormField>
          <FormField label="Protein (g)">
            <DarkInput type="number" step="0.1" placeholder="62" value={form.proteinGrams} onChange={update("proteinGrams")} />
          </FormField>
          <FormField label="Carbs (g)">
            <DarkInput type="number" step="0.1" placeholder="0" value={form.carbsGrams} onChange={update("carbsGrams")} />
          </FormField>
          <FormField label="Fat (g)">
            <DarkInput type="number" step="0.1" placeholder="7.2" value={form.fatGrams} onChange={update("fatGrams")} />
          </FormField>
          <div className="col-span-2 lg:col-span-3">
            <Button type="submit" disabled={submitting} className="bg-white text-zinc-950 hover:bg-zinc-200 font-semibold w-full sm:w-auto">
              {submitting ? "Logging..." : "Log Meal"}
            </Button>
          </div>
        </form>
      </DashboardSection>

      <DashboardSection title="Today's Meals" icon={Utensils}>
        {meals.length === 0 ? (
          <EmptyState message="No meals logged today. Start logging above!" />
        ) : (
          <div className="space-y-3">
            {meals.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/50 gap-3">
                <div className="min-w-0">
                  <p className="text-white font-medium truncate text-sm sm:text-base">{m.foodName}</p>
                  <p className="text-xs text-zinc-500">{m.amountGrams}g · P:{m.proteinGrams}g · C:{m.carbsGrams}g · F:{m.fatGrams}g</p>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                  <span className="text-white font-semibold text-sm sm:text-base">{m.calories} kcal</span>
                  <button onClick={() => remove(m.id)} className="text-zinc-500 hover:text-red-400 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardSection>
    </div>
  );
}
