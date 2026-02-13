"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface FocusTimerProps {
    durationSeconds: number; // Total duration in seconds
    timeLeft: number;        // Current time left in seconds
    isActive: boolean;
    onComplete?: () => void;
    mode?: "focus" | "break";
}

export function FocusTimer({
    durationSeconds,
    timeLeft,
    isActive,
    onComplete,
    mode = "focus"
}: FocusTimerProps) {
    // Calculate progress for the ring (0 to 1)
    const progress = Math.max(0, Math.min(1, timeLeft / durationSeconds));

    // Format time as MM:SS with mono-spaced digits to prevent jitter
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    const radius = 140;
    const stroke = 6;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - progress * circumference;

    return (
        <div className="relative flex items-center justify-center w-[280px] h-[280px] md:w-[360px] md:h-[360px]">
            {/* Background Pulse Glow (Subtle) */}
            {isActive && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.15 }}
                    transition={{ duration: 2 }}
                    className="absolute inset-0 bg-indigo-500 rounded-full blur-[60px] md:blur-[80px]"
                />
            )}

            <div className="relative z-10 w-full h-full">
                <svg
                    viewBox={`0 0 ${radius * 2 + 20} ${radius * 2 + 20}`}
                    className="rotate-[-90deg] mx-auto overflow-visible w-full h-full"
                >
                    {/* Track Ring */}
                    <circle
                        stroke="currentColor"
                        fill="transparent"
                        strokeWidth={stroke}
                        r={normalizedRadius}
                        cx="50%"
                        cy="50%"
                        className="text-slate-800/50"
                    />

                    {/* Progress Ring */}
                    <motion.circle
                        stroke="currentColor"
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + " " + circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx="50%"
                        cy="50%"
                        className={cn(
                            "transition-all duration-1000 ease-linear",
                            mode === "focus" ? "text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" : "text-emerald-400"
                        )}
                    />
                </svg>

                {/* Time Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
                    <div className="text-5xl md:text-7xl font-light tracking-tight text-white font-mono tabular-nums">
                        {formattedMinutes}:{formattedSeconds}
                    </div>
                    <div className="mt-2 md:mt-4 text-[10px] md:text-xs tracking-[0.2em] text-slate-500 uppercase">
                        {isActive ? "Deep Focus" : "Paused"}
                    </div>
                </div>
            </div>
        </div>
    );
}
