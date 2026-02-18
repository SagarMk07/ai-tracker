"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { PersonalityMode } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

interface CreateSessionModalProps {
  personalityMode: PersonalityMode;
}

export function CreateSessionModal({ personalityMode }: CreateSessionModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [goal, setGoal] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(50);
  const [riskFactors, setRiskFactors] = useState("");
  const [intention, setIntention] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function generateIntention() {
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/focus/intention", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal,
          durationMinutes,
          riskFactors: riskFactors.split(",").map((value) => value.trim()).filter(Boolean),
          personalityMode,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setError(payload?.error || "Unable to generate intention.");
        return;
      }

      const data = await response.json();
      setIntention(data.intention);
    });
  }

  function submit() {
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/focus/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal,
          durationMinutes,
          riskFactors: riskFactors.split(",").map((value) => value.trim()).filter(Boolean),
          personalityMode,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setError(payload?.error || "Unable to create session.");
        return;
      }

      const data = await response.json();
      setOpen(false);
      setGoal("");
      setRiskFactors("");
      setIntention(null);
      router.push(`/focus?session=${data.sessionId}`);
    });
  }

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Create Focus Session
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="New Deep Work Session">
        <div className="space-y-3">
          <Input value={goal} onChange={(event) => setGoal(event.target.value)} placeholder="What is your single outcome for this session?" />

          <div className="flex gap-2">
            {[25, 50, 90].map((option) => (
              <Button
                type="button"
                key={option}
                size="sm"
                variant={durationMinutes === option ? "primary" : "ghost"}
                onClick={() => setDurationMinutes(option)}
              >
                {option}m
              </Button>
            ))}
          </div>

          <Input
            value={riskFactors}
            onChange={(event) => setRiskFactors(event.target.value)}
            placeholder="Risk factors (comma separated)"
          />

          <div className="flex gap-2">
            <Button variant="ghost" onClick={generateIntention} disabled={isPending || !goal.trim()}>
              {isPending ? "Generating..." : "Generate intention"}
            </Button>
            <Button variant="primary" onClick={submit} disabled={isPending || !goal.trim()}>
              {isPending ? "Creating..." : "Start session"}
            </Button>
          </div>

          {intention ? <p className="rounded-xl border border-[var(--border-soft)] bg-[var(--accent-soft)] px-3 py-2 text-sm text-[var(--text-secondary)]">{intention}</p> : null}
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        </div>
      </Modal>
    </>
  );
}
