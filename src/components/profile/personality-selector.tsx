"use client";

import { useState, useTransition } from "react";
import type { PersonalityMode } from "@/types";
import { Check, Shield, Zap, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

interface PersonalitySelectorProps {
    currentMode: PersonalityMode;
}

const MODES: { id: PersonalityMode; label: string; icon: any; description: string }[] = [
    {
        id: "soft",
        label: "Flow State Guide",
        icon: Heart,
        description: "Supportive, gentle reminders. Prioritizes mental well-being and steady progress."
    },
    {
        id: "tactical",
        label: "Tactical Coach",
        icon: Shield,
        description: "Balanced, practical advice. Focuses on strategy and blocking distractions."
    },
    {
        id: "ruthless",
        label: "Drill Sergeant",
        icon: Zap,
        description: "No excuses. Direct, blunt accountability. For when you absolutely must ship."
    },
];

export function PersonalitySelector({ currentMode }: PersonalitySelectorProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [optimisticMode, setOptimisticMode] = useState(currentMode);

    function handleSelect(mode: PersonalityMode) {
        setOptimisticMode(mode);
        startTransition(async () => {
            await fetch("/api/profile/personality", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mode }),
            });
            router.refresh();
        });
    }

    return (
        <div className="panel p-6 space-y-6">
            <div className="space-y-1">
                <h3 className="text-lg font-medium">AI Coach Personality</h3>
                <p className="text-sm text-slate-400">Choose how Focus Guardian keeps you accountable.</p>
            </div>

            <div className="grid gap-3">
                {MODES.map((mode) => (
                    <button
                        key={mode.id}
                        onClick={() => handleSelect(mode.id)}
                        disabled={isPending}
                        className={`relative flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${optimisticMode === mode.id
                                ? "bg-[var(--accent)]/10 border-[var(--accent)]"
                                : "bg-slate-900/50 border-slate-700 hover:border-slate-500"
                            }`}
                    >
                        <div className={`mt-1 p-2 rounded-lg ${optimisticMode === mode.id ? "bg-[var(--accent)] text-slate-950" : "bg-slate-800 text-slate-400"}`}>
                            <mode.icon size={20} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <span className={`font-medium ${optimisticMode === mode.id ? "text-[var(--accent)]" : "text-slate-200"}`}>
                                    {mode.label}
                                </span>
                                {optimisticMode === mode.id && <Check size={16} className="text-[var(--accent)]" />}
                            </div>
                            <p className="text-sm text-slate-400 mt-1 leading-relaxed">{mode.description}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
