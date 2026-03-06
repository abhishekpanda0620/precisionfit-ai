import React from "react";

export default function DashboardOverview() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Dashboard Overview
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Welcome back. Here is your ledger of estimations and tracked metrics.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col gap-1">
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Est. Calories Burned</span>
          <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">1,240 <span className="text-lg font-normal text-zinc-500">kcal</span></span>
        </div>
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col gap-1">
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Est. Consumed</span>
          <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">2,100 <span className="text-lg font-normal text-zinc-500">kcal</span></span>
        </div>
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col gap-1">
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Sessions</span>
          <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">4</span>
        </div>
      </div>

     <div className="p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center min-h-[300px] text-zinc-500 dark:text-zinc-400 border-dashed">
       The Core Logging Engine will be implemented here.
     </div>

    </div>
  );
}
