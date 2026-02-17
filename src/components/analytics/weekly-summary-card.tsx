"use client";

import { useState, useTransition } from "react";
import type { PersonalityMode } from "@/types";

interface WeeklySummaryCardProps {
  personalityMode: PersonalityMode;
}

export function WeeklySummaryCard({ personalityMode }: WeeklySummaryCardProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  function generate() {
    startTransition(async () => {
      const response = await fetch("/api/accountability/weekly-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personalityMode }),
      });

      if (!response.ok) return;

      const data = await response.json();
      setSummary(data.summary);
      setPriorities(data.priorities || []);
    });
  }

  return (
    <section className="panel p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg">AI Accountability Summary</h3>
        <button onClick={generate} className="rounded-lg border border-slate-600 px-3 py-1 text-sm" disabled={isPending}>
          {isPending ? "Running..." : "Generate"}
        </button>
      </div>
      {summary ? <p className="text-slate-200">{summary}</p> : <p className="text-slate-400 text-sm">Generate a weekly coaching summary using your selected personality mode.</p>}
      {priorities.length ? (
        <ul className="text-sm text-slate-300 space-y-1">
          {priorities.map((item) => <li key={item}>- {item}</li>)}
        </ul>
      ) : null}
    </section>
  );
}
