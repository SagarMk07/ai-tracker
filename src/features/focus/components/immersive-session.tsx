"use client";

import { useState, useEffect } from "react";
import FocusTimer from "@/features/focus/components/focus-timer";
import { useFocusTimer } from "@/hooks/use-focus-timer";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { voice } from "@/services/voice";

interface ImmersiveSessionProps {
  sessionId: string;
  goal: string;
  intention: string;
  durationMinutes: number;
}

export function ImmersiveSession({ sessionId, goal, intention, durationMinutes }: ImmersiveSessionProps) {
  const router = useRouter();
  const [isReflecting, setIsReflecting] = useState(false);
  const [isSessionDone, setIsSessionDone] = useState(false);
  const [distractionCount, setDistractionCount] = useState(0);
  const [reflectionSyncing, setReflectionSyncing] = useState(false);

  useEffect(() => {
    // Announce start
    voice.speak(`Starting focus session. ${goal}. ${durationMinutes} minutes.`);
  }, []); // Run once on mount

  const { timeLeft, isActive, isPaused, toggle, formatTime, progress } = useFocusTimer({
    sessionId,
    durationSeconds: durationMinutes * 60,
    onComplete: () => {
      setIsSessionDone(true);
      voice.speak("Session complete. Great work.");
      // Allow cinematic animation to play for 5 seconds before showing reflection
      setTimeout(() => {
        setIsReflecting(true);
      }, 5000);
    },
  });

  async function handleAbandon() {
    if (!confirm("Abandon this session? It will be marked as incomplete.")) return;

    await fetch("/api/focus/sessions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, status: "abandoned" }),
    });
    router.push("/dashboard");
  }

  async function logDistraction() {
    setDistractionCount(p => p + 1);
    // Optimistic UI, fire and forget
    fetch("/api/focus/distractions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, type: "internal_drift" }),
    });
  }

  async function submitReflection(rating: number, feedback: string) {
    setReflectionSyncing(true);

    // 1. Mark complete
    await fetch("/api/focus/sessions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, status: "completed" }),
    });

    // 2. Submit reflection
    await fetch("/api/focus/reflection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, rating, feedback }),
    });

    setReflectionSyncing(false);
    router.push("/dashboard");
  }

  if (isReflecting) {
    return (
      <ReflectionView
        goal={goal}
        distractions={distractionCount}
        onSubmit={submitReflection}
        isSyncing={reflectionSyncing}
      />
    );
  }

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center p-6 text-center"
      style={{
        background: `
          radial-gradient(circle at center, rgba(59,130,246,0.15) 0%, transparent 40%),
          radial-gradient(circle at 80% 20%, rgba(99,102,241,0.12) 0%, transparent 50%),
          #020617
        `
      }}
    >

      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-500/20 blur-[180px] rounded-full animate-pulse pointer-events-none" />

      {/* Header */}
      <header className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2 text-slate-400 text-sm tracking-widest uppercase">
          {isActive ? <span className="w-2 h-2 rounded-full bg-[var(--accent-strong)] animate-pulse" /> : <span className="w-2 h-2 rounded-full bg-slate-600" />}
          Focus Guardian
        </div>
        <button onClick={handleAbandon} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-red-400 transition-colors">
          <X size={20} />
        </button>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center space-y-12">

        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-medium text-white">{goal}</h1>
          <p className="text-lg text-slate-400 italic font-light">"{intention}"</p>
        </div>

        {/* Timer Display */}
        <div className="relative group cursor-pointer" onClick={toggle}>
          <FocusTimer
            timeLeft={timeLeft}
            duration={durationMinutes * 60}
            isActive={isActive}
            isComplete={isSessionDone}
          />

          {!isActive && !isSessionDone && (
            <div className="absolute inset-x-0 -bottom-12 text-sm uppercase tracking-widest text-slate-500">
              Paused
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button
            onClick={logDistraction}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white transition-all active:scale-95"
          >
            <AlertCircle size={18} />
            <span>Log Distraction ({distractionCount})</span>
          </button>
        </div>

      </div>
    </main>
  );
}

function ReflectionView({ goal, distractions, onSubmit, isSyncing }: { goal: string, distractions: number, onSubmit: (r: number, f: string) => void, isSyncing: boolean }) {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="panel w-full max-w-lg p-8 space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] mb-4">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold">Session Complete</h2>
          <p className="text-slate-400">You focused on "{goal}"</p>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-300">How focused did you feel?</label>
          <div className="flex justify-between gap-2">
            {[1, 2, 3, 4, 5].map(rem => (
              <button
                key={rem}
                onClick={() => setRating(rem)}
                className={`flex-1 py-3 rounded-lg border transition-all ${rating === rem ? "bg-[var(--accent)] border-[var(--accent)] text-slate-950 font-bold" : "border-slate-700 bg-slate-900 text-slate-400 hover:bg-slate-800"}`}
              >
                {rem}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-300">Brief reflection (optional)</label>
          <textarea
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="What went well? What distracted you?"
            className="w-full h-24 rounded-xl bg-slate-900 border border-slate-700 p-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        <button
          onClick={() => onSubmit(rating, feedback)}
          disabled={isSyncing}
          className="w-full py-4 rounded-xl bg-[var(--accent)] text-slate-950 font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSyncing ? "Saving..." : "Save Session"}
        </button>
      </div>
    </main>
  );
}
