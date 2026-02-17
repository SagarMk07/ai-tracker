"use client";

import { useState, useTransition } from "react";
import { Sparkles, ArrowRight, Loader2, Plus, Calendar } from "lucide-react";
import type { PersonalityMode, TaskIntelligence } from "@/types";
import { useRouter } from "next/navigation";

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
            const res = await fetch("/api/tasks/breakdown", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ goal: input, personalityMode }),
            });
            if (res.ok) {
                const data = await res.json();
                setIntelligence(data);
            }
        });
    }

    function handleSave() {
        startSaving(async () => {
            await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: input,
                    difficultyScore: intelligence?.difficultyScore,
                    estimatedMinutes: intelligence?.focusBlocks.reduce((acc, b) => acc + b.minutes, 0),
                    subTasks: intelligence?.focusBlocks,
                }),
            });
            setInput("");
            setIntelligence(null);
            router.refresh();
        });
    }

    return (
        <div className="panel p-6 space-y-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm uppercase tracking-widest">
                <Sparkles size={14} className="text-[var(--accent)]" />
                <span>Smart Task Intelligence</span>
            </div>

            <div className="flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            if (intelligence) handleSave();
                            else handleBreakdown();
                        }
                    }}
                    placeholder="What do you need to accomplish?"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
                <button
                    onClick={handleBreakdown}
                    disabled={isBreakingDown || !input.trim()}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 rounded-xl border border-slate-700 transition-colors disabled:opacity-50"
                >
                    {isBreakingDown ? <Loader2 className="animate-spin" /> : "Break Down"}
                </button>
            </div>

            {intelligence && (
                <div className="animate-in fade-in slide-in-from-top-4 space-y-4 pt-2">
                    <div className="flex justify-between items-center text-sm text-slate-400">
                        <span>Difficulty: <span className="text-[var(--accent)] font-bold">{intelligence.difficultyScore}/10</span></span>
                        <span>Suggested: {intelligence.suggestedTime}</span>
                    </div>

                    <div className="space-y-2">
                        {intelligence.focusBlocks.map((block, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                                <div className="mt-1 w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-500">
                                    {i + 1}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-200">{block.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-[var(--accent)]">{block.minutes}m</span>
                                        <span className="text-xs text-slate-500">• {block.reason}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full flex items-center justify-center gap-2 bg-[var(--accent)] text-slate-950 font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="animate-spin" /> : (
                            <>
                                <Plus size={18} />
                                Add to Plan
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
