"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { createClient } from "@/services/supabaseClient";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const supabase = createClient();

  async function handleJoinWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const { error } = await supabase.from("waitlist").insert({ email });
      if (error) throw error;
      setStatus("success");
      setEmail("");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white selection:bg-white selection:text-black">
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference">
        <div className="text-xl font-bold tracking-tighter">AI TRACKER</div>
        <Button variant="outline" className="rounded-full px-6" onClick={() => window.location.href = '/login'}>
          Login
        </Button>
      </nav>

      <main className="flex flex-col items-center text-center px-4 max-w-4xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/60 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            Accepting Early Access
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent pb-4">
            Focus deeply.<br />
            Achieve more.
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-xl mx-auto leading-relaxed">
            The minimal productivity suite that combines deep work sessions with AI-driven accountability.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          onSubmit={handleJoinWaitlist}
          className="flex w-full max-w-md flex-col space-y-4 sm:flex-row sm:space-x-2 sm:space-y-0"
        >
          <div className="relative flex-1">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-full border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:border-white focus:ring-0"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="h-12 rounded-full px-8 font-medium transition-all hover:scale-105"
          >
            {status === "loading" ? (
              <span className="opacity-50">Joining...</span>
            ) : status === "success" ? (
              <span className="flex items-center text-emerald-400">
                <Check className="mr-2 h-4 w-4" /> Joined
              </span>
            ) : (
              <span className="flex items-center">
                Join Waitlist <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 text-left"
        >
          <FeatureCard title="Deep Focus" description="Distraction-free environment with ambient soundscapes." />
          <FeatureCard title="AI Accountability" description="Smart nudges to keep you on track." />
          <FeatureCard title="Progress Tracking" description="Visual analytics of your focused hours." />
        </motion.div>
      </main>

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-black to-black"></div>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-white/60 text-sm">{description}</p>
    </div>
  )
}
