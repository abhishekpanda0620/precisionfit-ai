"use client";

import { useSession } from "next-auth/react";
import { Activity, Utensils, Scale, TrendingUp } from "lucide-react";
import { useApiResource } from "@/hooks/useApiResource";
import { PageHeader, StatCard, DashboardSection, EmptyState } from "@/components/dashboard/shared";

type CardioSession = {
  id: string;
  date: string;
  caloriesDevice: number;
  caloriesFormula: number | null;
};

type MealEntry = {
  id: string;
  date: string;
  calories: number;
};

type WeightEntry = {
  id: string;
  date: string;
  weightKg: number;
};

export default function DashboardOverview() {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const today = new Date().toISOString().split("T")[0];

  // Fetch data from all three resources
  const { data: cardioSessions } = useApiResource<CardioSession>({
    endpoint: "/api/cardio",
    queryParams: { userId },
  });

  const { data: meals } = useApiResource<MealEntry>({
    endpoint: "/api/meals",
    queryParams: { userId, date: today },
  });

  const { data: weightEntries } = useApiResource<WeightEntry>({
    endpoint: "/api/weight",
    queryParams: { userId },
  });

  // Calculate stats for today
  const burnedToday = cardioSessions
    .filter(s => s.date.startsWith(today))
    .reduce((sum, s) => sum + (s.caloriesFormula ?? s.caloriesDevice), 0);

  const consumedToday = meals.reduce((sum, m) => sum + m.calories, 0);
  const netBalance = consumedToday - burnedToday;
  const currentWeight = weightEntries[0]?.weightKg || "—";

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader 
        title={`Welcome back, ${session?.user?.name?.split(" ")[0] || "User"}`}
        description="Your ledger of estimations and tracked metrics."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Calories Burned" 
          value={burnedToday} 
          unit="kcal" 
          icon={Activity}
          description="From cardio sessions today"
        />
        <StatCard 
          title="Calories Consumed" 
          value={consumedToday} 
          unit="kcal" 
          icon={Utensils}
          description="From logged meals today"
        />
        <StatCard 
          title="Net Balance" 
          value={netBalance > 0 ? `+${netBalance}` : netBalance} 
          unit="kcal" 
          icon={TrendingUp}
          description="Consumed − Burned"
        />
        <StatCard 
          title="Current Weight" 
          value={currentWeight} 
          unit="kg" 
          icon={Scale}
          description="Last recorded entry"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardSection title="Insights" icon={TrendingUp}>
          <div className="space-y-4">
            {netBalance < 0 ? (
              <p className="text-sm text-green-400">
                You are in a calorie deficit of <span className="font-bold">{Math.abs(netBalance)} kcal</span> today. Great work!
              </p>
            ) : netBalance > 0 ? (
              <p className="text-sm text-zinc-400">
                You have consumed <span className="font-bold">{netBalance} kcal</span> more than you burned today.
              </p>
            ) : (
              <p className="text-sm text-zinc-500">
                Logged metrics will show your daily balance here.
              </p>
            )}
          </div>
        </DashboardSection>

        <DashboardSection title="Quick Stats" icon={Activity}>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm border-b border-zinc-800 pb-2">
              <span className="text-zinc-500">Cardio Sessions (Today)</span>
              <span className="text-white font-medium">
                {cardioSessions.filter(s => s.date.startsWith(today)).length}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-zinc-800 pb-2">
              <span className="text-zinc-500">Meals Logged (Today)</span>
              <span className="text-white font-medium">{meals.length}</span>
            </div>
          </div>
        </DashboardSection>
      </div>
    </div>
  );
}
