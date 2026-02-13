"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface FocusMentorProps {
    intent: string;
    duration: number;
    timeLeft: number;
    isActive: boolean;
}

export function FocusMentor({ intent, duration, timeLeft, isActive }: FocusMentorProps) {
    const [guidance, setGuidance] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Fetch guidance occasionally (e.g., every 5 minutes or on distraction)
    // For now, let's just fetch it once at the start and then have a manual trigger or interval
    useEffect(() => {
        if (isActive && !guidance) {
            fetchGuidance();
        }
    }, [isActive]);

    const fetchGuidance = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/guidance", {
                method: "POST",
                body: JSON.stringify({
                    context: intent,
                    duration: duration,
                    elapsed: duration - timeLeft
                }),
            });

            if (!response.ok) throw new Error("Failed to fetch guidance");

            const text = await response.text();
            setGuidance(text);

            // Clear guidance after 15 seconds to keep it "micro"
            setTimeout(() => setGuidance(null), 15000);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-8 flex justify-center items-center">
            <AnimatePresence mode="wait">
                {guidance ? (
                    <motion.div
                        key="message"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 text-indigo-300/80 text-sm font-medium tracking-wide"
                    >
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        {guidance}
                    </motion.div>
                ) : (
                    null
                )}
            </AnimatePresence>
        </div>
    );
}
