"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus, Sparkles } from "lucide-react";
import type { PersonalityMode, TaskIntelligence } from "@/types";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/use-tasks";

interface SmartTaskInputProps {
  personalityMode: PersonalityMode;
}

export function SmartTaskInput({ personalityMode }: SmartTaskInputProps) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [intelligence, setIntelligence] = useState<TaskIntelligence | null>(null);
  const [isBreakingDown, startBreakdown] = useTransition();
  const [isSaving, startSaving] = useTransition();

  function handleBreakdown() {
    if (!input.trim()) return;
    startBreakdown(async () => {
      const response = await fetch("/api/tasks/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: input, personalityMode }),
      });

      if (response.ok) {
        const data = await response.json();
        setIntelligence(data);
      }
    });
  }

  const { addTask } = useTasks();

  function handleSave() {
    startSaving(async () => {
      await addTask(input, {
        difficultyScore: intelligence?.difficultyScore,
        estimatedMinutes: intelligence?.focusBlocks.reduce((sum, block) => sum + block.minutes, 0),
        subTasks: intelligence?.focusBlocks,
        suggestedTime: intelligence?.suggestedTime,
      });

      setInput("");
      setIntelligence(null);
      router.refresh();
    });
  }

  return (
    <Card className="space-y-4 p-6">
      <div className="flex items-center gap-2 text-sm uppercase tracking-widest text-[var(--text-muted)]">
        <Sparkles size={14} className="text-[var(--accent)]" />
        <span>Smart Task Intelligence</span>
      </div>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              if (intelligence) {
                handleSave();
                return;
              }
              handleBreakdown();
            }
          }}
          placeholder="What do you need to accomplish?"
        />
        <Button onClick={handleBreakdown} disabled={isBreakingDown || !input.trim()} variant="ghost">
          {isBreakingDown ? <Loader2 className="animate-spin" size={16} /> : "Break down"}
        </Button>
      </div>

      {intelligence ? (
        <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
            <span>
              Difficulty: <span className="font-bold text-[var(--accent)]">{intelligence.difficultyScore}/10</span>
            </span>
            <span>Suggested: {intelligence.suggestedTime}</span>
          </div>

          <div className="space-y-2">
            {intelligence.focusBlocks.map((block, index) => (
              <div key={index} className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-secondary)]/55 p-3">
                <p className="text-sm font-medium text-[var(--text-primary)]">{index + 1}. {block.title}</p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">{block.minutes} min | {block.reason}</p>
              </div>
            ))}
          </div>

          <Button onClick={handleSave} disabled={isSaving} className="w-full" variant="primary">
            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
            {isSaving ? "Saving..." : "Add to Plan"}
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
