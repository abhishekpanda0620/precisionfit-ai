import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, Zap, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-zinc-950 font-sans selection:bg-zinc-800 overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-zinc-500 opacity-20 blur-[100px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center mb-8">
            <span className="relative inline-flex overflow-hidden rounded-full p-[1px]">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#52525b_0%,#18181b_50%,#52525b_100%)]" />
              <div className="inline-flex h-full w-full items-center justify-center rounded-full bg-zinc-950 px-3 py-1 text-xs font-medium text-zinc-200 backdrop-blur-3xl">
                PrecisionFit AI Beta Release
              </div>
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-7xl">
            <span className="block text-zinc-400">Master Your Metabolism.</span>
            <span className="block mt-2">Zero Guesswork.</span>
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-zinc-400 max-w-2xl mx-auto">
            A scientifically-grounded, privacy-first engine that correlates your 
            daily activity with exact caloric expenditure. Log less. Know more.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg" className="h-14 px-8 text-base rounded-full bg-white text-zinc-950 hover:bg-zinc-200 transition-all font-semibold shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
              <Link href="/register">
                Start Tracking <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="h-14 px-8 text-base rounded-full text-zinc-300 hover:text-white hover:bg-zinc-900 border-zinc-800">
              <Link href="/login">Sign In to Dashboard</Link>
            </Button>
          </div>
        </div>

        {/* Mockup Preview Area */}
        <div className="mt-20 sm:mt-24 lg:mt-32 relative animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="rounded-xl bg-zinc-900/50 p-2 ring-1 ring-inset ring-zinc-800/50 backdrop-blur-sm lg:rounded-2xl lg:p-4 shadow-2xl">
            <div className="rounded-md bg-zinc-950 ring-1 ring-zinc-800 shadow-xl overflow-hidden">
               <div className="h-10 border-b border-zinc-800/50 bg-zinc-900/50 flex items-center px-4 gap-2">
                 <div className="w-3 h-3 rounded-full bg-zinc-700 hover:bg-zinc-500 transition-colors" />
                 <div className="w-3 h-3 rounded-full bg-zinc-700 hover:bg-zinc-500 transition-colors" />
                 <div className="w-3 h-3 rounded-full bg-zinc-700 hover:bg-zinc-500 transition-colors" />
               </div>
               <div className="p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 pattern-dots pattern-zinc-800 pattern-bg-transparent pattern-size-4 pattern-opacity-20">
                  <div className="col-span-1 md:col-span-2 space-y-4">
                    <div className="h-8 w-1/3 bg-zinc-800/50 rounded-lg animate-pulse" />
                    <div className="h-64 w-full bg-zinc-800/20 border border-zinc-800/50 rounded-xl flex items-center justify-center">
                       <p className="text-zinc-600 text-sm font-medium">Dashboard Telemetry Visualization</p>
                    </div>
                  </div>
                  <div className="col-span-1 space-y-4">
                    <div className="h-32 w-full bg-zinc-800/30 border border-zinc-800/50 rounded-xl" />
                    <div className="h-32 w-full bg-zinc-800/30 border border-zinc-800/50 rounded-xl" />
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mx-auto mt-24 max-w-7xl sm:mt-32 pb-32">
          <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-3 lg:gap-x-12">
            <div className="relative pl-4 border-l border-zinc-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 mb-6">
                <Activity className="h-6 w-6 text-zinc-300" />
              </div>
              <h3 className="text-lg font-semibold leading-8 text-white">Metabolic Intelligence</h3>
              <p className="mt-2 text-base leading-7 text-zinc-400">Strictly adheres to researched formulas utilizing your heart rate and VO2 max to derive precise energy burn.</p>
            </div>
            <div className="relative pl-4 border-l border-zinc-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 mb-6">
                <Shield className="h-6 w-6 text-zinc-300" />
              </div>
              <h3 className="text-lg font-semibold leading-8 text-white">Absolute Privacy</h3>
              <p className="mt-2 text-base leading-7 text-zinc-400">A security-first microservice architecture ensures your sensitive health markers never touch the presentation layer.</p>
            </div>
            <div className="relative pl-4 border-l border-zinc-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 mb-6">
                <Zap className="h-6 w-6 text-zinc-300" />
              </div>
              <h3 className="text-lg font-semibold leading-8 text-white">Frictionless Logging</h3>
              <p className="mt-2 text-base leading-7 text-zinc-400">Bypass tedious manual entry. Our AI agent parses natural language and validates it against mathematical limits.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
