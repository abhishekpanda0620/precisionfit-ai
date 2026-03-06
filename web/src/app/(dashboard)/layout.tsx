import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import DashboardSidebar from "@/components/DashboardSidebar";

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
    <div className="min-h-screen bg-zinc-950 flex flex-col sm:flex-row">
      <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
}
