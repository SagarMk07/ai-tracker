"use client";

import { useState, useTransition } from "react";
import type { PersonalityMode } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WeeklySummaryCardProps {
  personalityMode: PersonalityMode;
}

export function WeeklySummaryCard({ personalityMode }: WeeklySummaryCardProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [riskAlert, setRiskAlert] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function streamNarrative() {
    const response = await fetch("/api/accountability/weekly-summary/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personalityMode }),
    });

    if (!response.ok || !response.body) {
      return;
    }

    const decoder = new TextDecoder();
    const reader = response.body.getReader();
    let text = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
      setSummary(text);
    }
  }

  function generate() {
    setSummary(null);
    setPriorities([]);
    setRiskAlert(null);

    startTransition(async () => {
      await streamNarrative();

      const response = await fetch("/api/accountability/weekly-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personalityMode }),
      });

      if (!response.ok) return;

      const data = await response.json();
      setSummary((current) => current || data.summary);
      setPriorities(data.priorities || []);
      setRiskAlert(data.riskAlert || null);
    });
  }

  return (
    <Card className="space-y-3 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg">AI Accountability Summary</h3>
        <Button onClick={generate} variant="ghost" size="sm" disabled={isPending}>
          {isPending ? "Generating..." : "Generate"}
        </Button>
      </div>
      {summary ? (
        <p className="whitespace-pre-wrap text-[var(--text-secondary)]">{summary}</p>
      ) : (
        <p className="text-sm text-[var(--text-muted)]">Generate a weekly coaching summary using your selected personality mode.</p>
      )}
      {priorities.length ? (
        <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
          {priorities.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>
      ) : null}
      {riskAlert ? <p className="text-sm text-amber-300">Risk alert: {riskAlert}</p> : null}
    </Card>
  );
}
