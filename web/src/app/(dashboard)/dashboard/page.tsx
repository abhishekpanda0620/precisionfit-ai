"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Utensils, Scale, TrendingUp } from "lucide-react";

const STAT_CARDS = [
  { title: "Calories Burned", icon: Activity, value: "—", unit: "kcal", description: "From cardio sessions today" },
  { title: "Calories Consumed", icon: Utensils, value: "—", unit: "kcal", description: "From logged meals today" },
  { title: "Net Balance", icon: TrendingUp, value: "—", unit: "kcal", description: "Consumed − Burned" },
  { title: "Current Weight", icon: Scale, value: "—", unit: "kg", description: "Last recorded entry" },
];

export default function DashboardOverview() {
  const { data: session } = useSession();

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Welcome back, {session?.user?.name?.split(" ")[0] || "User"}
        </h1>
        <p className="text-zinc-400">
          Your ledger of estimations and tracked metrics.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((stat) => (
          <Card key={stat.title} className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stat.value} <span className="text-sm font-normal text-zinc-500">{stat.unit}</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity Placeholder */}
      <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center min-h-[200px] text-zinc-500 text-sm border border-dashed border-zinc-800 rounded-lg">
            Your recent cardio sessions and meals will appear here once you start logging.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
