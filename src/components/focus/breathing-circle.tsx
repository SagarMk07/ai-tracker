"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function BreathingCircle({ onComplete }: { onComplete: () => void }) {
    const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
    const [cycles, setCycles] = useState(0);
    const MAX_CYCLES = 3;

    useEffect(() => {
        // Simple Box Breathing: 4s Inhale, 4s Hold, 4s Exhale
        // Cycle 1
        if (cycles >= MAX_CYCLES) {
            onComplete();
            return;
        }

        let timeout: NodeJS.Timeout;

        if (phase === "inhale") {
            timeout = setTimeout(() => setPhase("hold"), 4000);
        } else if (phase === "hold") {
            timeout = setTimeout(() => setPhase("exhale"), 4000);
        } else if (phase === "exhale") {
            timeout = setTimeout(() => {
                setCycles(c => c + 1);
                setPhase("inhale");
            }, 4000);
        }

        return () => clearTimeout(timeout);
    }, [phase, cycles, onComplete]);

    const text = {
        inhale: "Inhale...",
        hold: "Hold...",
        exhale: "Exhale..."
    }[phase];

    return (
        <div className="flex flex-col items-center justify-center h-[400px]">
            <div className="relative flex items-center justify-center w-64 h-64">
                {/* Outer Ripple */}
                <motion.div
                    animate={{
                        scale: phase === "inhale" ? 1.5 : phase === "hold" ? 1.5 : 1,
                        opacity: phase === "inhale" ? 0.3 : phase === "exhale" ? 0 : 0.3,
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl"
                />

                {/* Core Circle */}
                <motion.div
                    animate={{
                        scale: phase === "inhale" ? 1.2 : phase === "hold" ? 1.2 : 0.8,
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="w-32 h-32 bg-indigo-500 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.4)] flex items-center justify-center z-10"
                >
                </motion.div>
            </div>

            <motion.p
                key={phase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-8 text-xl font-light text-indigo-100"
            >
                {text}
            </motion.p>

            <p className="mt-2 text-sm text-slate-600">
                Cycle {Math.min(cycles + 1, MAX_CYCLES)} of {MAX_CYCLES}
            </p>
        </div>
    );
}
