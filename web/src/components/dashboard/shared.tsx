import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/** Consistent page header across all dashboard pages */
export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{title}</h1>
      <p className="text-sm sm:text-base text-zinc-400">{description}</p>
    </div>
  );
}

/** Reusable stat card with icon */
export function StatCard({ title, value, unit, icon: Icon, description }: {
  title: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  description?: string;
}) {
  return (
    <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium text-zinc-400">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-zinc-500" />}
      </CardHeader>
      <CardContent>
        <div className="text-xl sm:text-2xl font-bold text-white">
          {value} {unit && <span className="text-sm font-normal text-zinc-500">{unit}</span>}
        </div>
        {description && <p className="text-xs text-zinc-500 mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}

/** Consistent section wrapper for forms and tables */
export function DashboardSection({ title, icon: Icon, children }: {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
          {Icon && <Icon className="h-5 w-5" />} {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

/** Empty state placeholder */
export function EmptyState({ message }: { message: string }) {
  return (
    <p className="text-zinc-500 text-sm text-center py-8">{message}</p>
  );
}
