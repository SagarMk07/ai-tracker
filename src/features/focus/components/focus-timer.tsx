"use client";

import { motion, AnimatePresence } from "framer-motion";

type Props = {
    timeLeft: number;
    duration: number; // in seconds
    isActive: boolean;
    isComplete: boolean;
};

export default function FocusTimer({ timeLeft, duration, isActive, isComplete }: Props) {
    const radius = 120;
    const stroke = 8;
    const normalizedRadius = radius - stroke * 0.5;
    const circumference = normalizedRadius * 2 * Math.PI;

    const progress = timeLeft / duration;
    const strokeDashoffset = circumference - progress * circumference;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="relative flex items-center justify-center">

            {/* Ambient glow */}
            <motion.div
                className="absolute w-[350px] h-[350px] bg-white/5 rounded-full blur-[120px]"
                animate={{ scale: isActive ? [1, 1.04, 1] : 1, opacity: isActive ? 1 : 0.5 }}
                transition={{ duration: 6, repeat: Infinity }}
            />

            <svg
                height={radius * 2}
                width={radius * 2}
                className="rotate-[-90deg]"
            >
                {/* Background Ring */}
                <circle
                    stroke="rgba(255,255,255,0.08)"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />

                {/* Progress Ring */}
                <motion.circle
                    stroke="white"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1, ease: "linear" }}
                />
            </svg>

            {/* Time Display */}
            <div className="absolute text-5xl font-semibold tracking-tight text-white tabular-nums">
                {minutes}:{seconds.toString().padStart(2, "0")}
            </div>

            {/* Cinematic Finish Overlay */}
            <AnimatePresence>
                {isComplete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/90 rounded-full z-20"
                    >
                        {/* White Flash Pulse */}
                        <motion.div
                            className="absolute w-[400px] h-[400px] rounded-full bg-white/10 blur-[120px]"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        />

                        <motion.div
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: [1, 1.08, 1], opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-center relative z-10"
                        >
                            <p className="uppercase text-xs tracking-widest text-white/50 mb-3 font-medium">
                                FOCUS ACHIEVED
                            </p>
                            <h2 className="text-3xl font-semibold tracking-tight text-white">
                                Session Complete
                            </h2>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
