"use client";

import { useState, useTransition } from "react";
import type { PersonalityMode, TaskIntelligence } from "@/types";

interface TaskIntelligencePlannerProps {
  personalityMode: PersonalityMode;
}

export function TaskIntelligencePlanner({ personalityMode }: TaskIntelligencePlannerProps) {
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState<TaskIntelligence | null>(null);
  const [isPending, startTransition] = useTransition();

  function runAnalysis() {
    startTransition(async () => {
      const response = await fetch("/api/tasks/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, personalityMode }),
      });

      if (!response.ok) return;
      const data = await response.json();
      setResult(data);
    });
  }

  return (
    <section className="panel p-5 space-y-4">
      <h3 className="text-lg">Smart Task Intelligence</h3>
      <input
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        className="w-full rounded-xl border border-slate-600 bg-slate-950/50 px-4 py-3"
        placeholder="Describe a high-value goal"
      />
      <button
        onClick={runAnalysis}
        disabled={!goal.trim() || isPending}
        className="rounded-xl bg-[var(--accent)] px-4 py-2 font-semibold text-slate-950 disabled:opacity-60"
      >
        {isPending ? "Analyzing..." : "Generate focus blocks"}
      </button>

      {result ? (
        <div className="space-y-3">
          <p className="text-sm text-slate-300">Difficulty: <span className="text-white">{result.difficultyScore}/10</span></p>
          <p className="text-sm text-slate-300">Suggested timing: <span className="text-white">{result.suggestedTime}</span></p>
          <ul className="space-y-2">
            {result.focusBlocks.map((block) => (
              <li key={block.title} className="rounded-xl border border-slate-700 p-3">
                <p className="text-sm font-semibold">{block.title} ({block.minutes}m)</p>
                <p className="text-xs text-slate-300 mt-1">{block.reason}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
