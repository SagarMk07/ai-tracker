import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, Zap, Layout, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 relative overflow-hidden bg-[#020617] selection:bg-blue-500/30">
      {/* Premium Atmospheric Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary Ambient Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse-slow" />

        {/* Dynamic Glow Orbs */}
        <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-blue-400/5 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-purple-400/5 rounded-full blur-3xl animate-float" />

        {/* Radial Mesh Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_80%)] opacity-60" />
      </div>

      <div className="z-10 text-center space-y-16 max-w-5xl">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/5 border border-blue-500/10 text-blue-400 text-sm font-light tracking-wide animate-fade-in backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span>Redefining Workflow Strategy</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-light tracking-tighter text-white leading-[1.1]">
            Your AI Stack, <br />
            <span className="font-medium bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-500 bg-clip-text text-transparent">
              Finally Sophisticated.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
            AI Tracker is the elite command center for your intelligence stack.
            Organize tools, engineer workflows, and sustain deep focus in an atmosphere designed for excellence.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <Button size="lg" className="rounded-full px-10 py-8 bg-white text-black hover:bg-slate-200 text-xl font-medium group transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)]" asChild>
            <Link href="/dashboard">
              Enter Dashboard <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button size="lg" variant="ghost" className="rounded-full px-10 py-8 text-slate-300 text-xl hover:text-white hover:bg-white/5 backdrop-blur-sm transition-all border border-transparent hover:border-white/10" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-20 border-t border-white/5 mt-12">
          <div className="flex flex-col items-center gap-4 group cursor-default">
            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-3xl group-hover:bg-blue-500/10 transition-colors">
              <Layout className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-white text-xl font-light tracking-tight">Curation</h3>
            <p className="text-slate-500 text-center font-light">A meticulous catalog for your premium AI toolset.</p>
          </div>
          <div className="flex flex-col items-center gap-4 group cursor-default">
            <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-3xl group-hover:bg-purple-500/10 transition-colors">
              <Zap className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-white text-xl font-light tracking-tight">Automation</h3>
            <p className="text-slate-500 text-center font-light">Seamless sequential pipelines orchestrated by AI.</p>
          </div>
          <div className="flex flex-col items-center gap-4 group cursor-default">
            <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-3xl group-hover:bg-green-500/10 transition-colors">
              <Bot className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-white text-xl font-light tracking-tight">Intelligence</h3>
            <p className="text-slate-500 text-center font-light">Strategic insights tailored to your unique tool stack.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
