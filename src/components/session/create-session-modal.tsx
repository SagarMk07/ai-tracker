"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { PersonalityMode } from "@/types";

interface CreateSessionModalProps {
  personalityMode: PersonalityMode;
}

export function CreateSessionModal({ personalityMode }: CreateSessionModalProps) {
  const router = useRouter();
  const [goal, setGoal] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(50);
  const [riskFactors, setRiskFactors] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    setError(null);
    startTransition(async () => {
      const response = await fetch("/api/focus/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal,
          durationMinutes,
          riskFactors: riskFactors.split(",").map((x) => x.trim()).filter(Boolean),
          personalityMode,
        }),
      });

      if (!response.ok) {
        setError("Unable to create session.");
        return;
      }

      const data = await response.json();
      router.push(`/focus?session=${data.sessionId}`);
    });
  }

  return (
    <div className="panel p-5 space-y-4">
      <h3 className="text-lg">Create Focus Session</h3>
      <input
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Goal"
        className="w-full rounded-xl border border-slate-600 bg-slate-950/50 px-4 py-3"
      />
      <div className="flex gap-2">
        {[25, 50, 90].map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => setDurationMinutes(option)}
            className={`rounded-full px-4 py-2 text-sm border ${durationMinutes === option ? "bg-[var(--accent)] text-slate-950 border-transparent" : "border-slate-600 text-slate-200"}`}
          >
            {option}m
          </button>
        ))}
      </div>
      <input
        value={riskFactors}
        onChange={(e) => setRiskFactors(e.target.value)}
        placeholder="Risk factors, comma-separated"
        className="w-full rounded-xl border border-slate-600 bg-slate-950/50 px-4 py-3"
      />
      <button disabled={isPending || !goal.trim()} onClick={submit} className="w-full rounded-xl bg-[var(--accent)] py-3 font-semibold text-slate-950 disabled:opacity-60">
        {isPending ? "Creating..." : "Start Session"}
      </button>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </div>
  );
}
