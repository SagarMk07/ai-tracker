"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const BREATH_PHASES = [
    { text: "Inhale", duration: 4 },
    { text: "Hold", duration: 4 },
    { text: "Exhale", duration: 4 },
    { text: "Hold", duration: 4 },
];

export function BreathingCircle() {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setPhase((prev) => (prev + 1) % BREATH_PHASES.length);
        }, BREATH_PHASES[phase].duration * 1000);

        return () => clearInterval(interval);
    }, [phase]);

    return (
        <div className="flex flex-col items-center justify-center space-y-8">
            <div className="relative flex items-center justify-center">
                {/* Outer Glow */}
                <motion.div
                    animate={{
                        scale: phase === 0 ? 1.4 : phase === 2 ? 1 : phase === 1 ? 1.4 : 1,
                        opacity: phase === 0 ? 0.4 : 0.2,
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="absolute w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
                />

                {/* Main Circle */}
                <motion.div
                    animate={{
                        scale: phase === 0 ? 1.2 : phase === 2 ? 0.8 : phase === 1 ? 1.2 : 0.8,
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="w-48 h-48 border-2 border-blue-400/30 rounded-full flex items-center justify-center relative overflow-hidden bg-slate-900/40 backdrop-blur-xl shadow-[0_0_50px_rgba(59,130,246,0.1)]"
                >
                    {/* Inner Fluid Wave */}
                    <motion.div
                        animate={{
                            y: phase === 0 ? "0%" : phase === 2 ? "100%" : phase === 1 ? "0%" : "100%",
                        }}
                        transition={{ duration: 4, ease: "easeInOut" }}
                        className="absolute bottom-0 left-0 w-full h-full bg-blue-500/10"
                    />

                    <AnimatePresence mode="wait">
                        <motion.span
                            key={phase}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-blue-400 font-light text-xl tracking-widest uppercase z-10"
                        >
                            {BREATH_PHASES[phase].text}
                        </motion.span>
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Phase Indicators */}
            <div className="flex gap-2">
                {BREATH_PHASES.map((_, i) => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all duration-500 ${i === phase ? "bg-blue-400 w-6" : "bg-slate-800"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
