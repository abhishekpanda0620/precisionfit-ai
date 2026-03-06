import React from "react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-zinc-950 font-sans selection:bg-zinc-800 overflow-hidden flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Subtle Grid Background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-zinc-500 opacity-20 blur-[100px]" />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <Link href="/" className="inline-block outline-none">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
            Precision<span className="text-primary opacity-80">Fit</span> AI
          </h2>
        </Link>
        <p className="mt-2 text-center text-sm text-zinc-400">
          Data-driven fitness & nutrition estimation.
        </p>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150">
        <div className="bg-zinc-900/50 py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-zinc-800/50 backdrop-blur-sm ring-1 ring-inset ring-zinc-800/50">
          {children}
        </div>
      </div>
    </div>
  );
}
