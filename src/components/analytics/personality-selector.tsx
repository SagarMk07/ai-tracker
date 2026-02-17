"use client";

import { useState, useTransition } from "react";
import type { PersonalityMode } from "@/types";

const modes: PersonalityMode[] = ["soft", "tactical", "ruthless"];

interface PersonalitySelectorProps {
  currentMode: PersonalityMode;
}

export function PersonalitySelector({ currentMode }: PersonalitySelectorProps) {
  const [mode, setMode] = useState<PersonalityMode>(currentMode);
  const [isPending, startTransition] = useTransition();

  function save(nextMode: PersonalityMode) {
    setMode(nextMode);
    startTransition(async () => {
      await fetch("/api/accountability/weekly-summary", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personalityMode: nextMode }),
      });
    });
  }

  return (
    <section className="panel p-5">
      <h3 className="text-lg">Personality Mode</h3>
      <p className="text-sm text-slate-300 mt-1">Choose how strict your AI accountability should be.</p>
      <div className="mt-4 flex gap-2">
        {modes.map((item) => (
          <button
            key={item}
            onClick={() => save(item)}
            disabled={isPending}
            className={`rounded-full px-4 py-2 text-sm capitalize border ${mode === item ? "bg-[var(--accent)] text-slate-950 border-transparent" : "border-slate-600 text-slate-200"}`}
          >
            {item}
          </button>
        ))}
      </div>
    </section>
  );
}
