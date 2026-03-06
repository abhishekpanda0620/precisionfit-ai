"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Activity, Utensils, Scale, LayoutDashboard, LogOut, Menu, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/activity", label: "Activity", icon: Activity },
  { href: "/dashboard/meals", label: "Meals", icon: Utensils },
  { href: "/dashboard/weight", label: "Weight", icon: Scale },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <>
      <Link href="/dashboard" className="inline-block outline-none mb-8" onClick={onNavigate}>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Precision<span className="text-primary opacity-80">Fit</span>
        </h2>
      </Link>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-zinc-800/50 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-white">
            {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="text-sm min-w-0">
            <p className="font-medium text-white truncate">{session?.user?.name || "User"}</p>
            <p className="text-xs text-zinc-500 truncate">{session?.user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800/50 gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </>
  );
}

export default function DashboardSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="sm:hidden flex items-center justify-between p-4 bg-zinc-900/80 border-b border-zinc-800/50 backdrop-blur-sm sticky top-0 z-40">
        <Link href="/dashboard">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Precision<span className="text-primary opacity-80">Fit</span>
          </h2>
        </Link>
        <button onClick={() => setMobileOpen(true)} className="text-zinc-400 hover:text-white transition-colors p-1">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-zinc-900 border-r border-zinc-800/50 flex flex-col p-6 animate-in slide-in-from-left duration-300">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <NavContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-64 shrink-0 bg-zinc-900/50 border-r border-zinc-800/50 hidden sm:flex flex-col p-6 backdrop-blur-sm">
        <NavContent />
      </aside>
    </>
  );
}
