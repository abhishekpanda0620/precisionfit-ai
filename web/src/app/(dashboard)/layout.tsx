import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col sm:flex-row">
      {/* Sidebar Placeholder */}
      <aside className="w-full sm:w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 hidden sm:flex flex-col p-6">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight mb-8">
          Precision<span className="text-primary opacity-80">Fit</span>
        </h2>
        
        <nav className="flex-1 space-y-2">
          {/* Note: This dummy nav strictly follows the modern, minimalist premium SaaS aesthetics */}
          <div className="px-3 py-2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-sm font-medium text-zinc-900 dark:text-zinc-50 transition-colors">
            Overview
          </div>
          <div className="px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-sm font-medium text-zinc-600 dark:text-zinc-400 transition-colors cursor-pointer">
            Cardio Log
          </div>
          <div className="px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-sm font-medium text-zinc-600 dark:text-zinc-400 transition-colors cursor-pointer">
            Nutrition
          </div>
        </nav>

        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-medium">
               {session.user?.name?.charAt(0) || "U"}
             </div>
             <div className="text-sm">
               <p className="font-medium text-zinc-900 dark:text-zinc-50">{session.user?.name}</p>
               <p className="text-xs text-zinc-500 max-w-[140px] truncate">{session.user?.email}</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 sm:p-12 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
}
