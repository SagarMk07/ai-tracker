"use client";

import { useState, useTransition } from "react";
import type { PersonalityMode } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const modes: PersonalityMode[] = ["soft", "tactical", "ruthless"];

interface PersonalitySelectorProps {
  currentMode: PersonalityMode;
}

export function PersonalitySelector({ currentMode }: PersonalitySelectorProps) {
  const [mode, setMode] = useState<PersonalityMode>(currentMode);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function save(nextMode: PersonalityMode) {
    setError(null);
    setMode(nextMode);
    startTransition(async () => {
      const response = await fetch("/api/profile/personality", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: nextMode }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setMode(currentMode);
        setError(payload?.error || "Unable to update mode. Please retry.");
      }
    });
  }

  return (
    <Card className="p-5">
      <h3 className="text-lg">Personality Mode</h3>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">Choose how strict your AI accountability should be.</p>
      <div className="mt-4 flex gap-2">
        {modes.map((item) => (
          <Button key={item} onClick={() => save(item)} disabled={isPending} size="sm" variant={mode === item ? "primary" : "ghost"}>
            {item}
          </Button>
        ))}
      </div>
      {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
    </Card>
  );
}
