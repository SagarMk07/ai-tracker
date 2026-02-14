"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Play,
    X,
    CheckCircle2,
    Timer,
    Brain,
    ArrowLeft,
    Heart,
    Maximize2,
    Settings2,
    Sparkles
} from "lucide-react";
import { BreathingCircle } from "./breathing-circle";
import { AudioController } from "./audio-controller";
import Link from "next/link";

const MENTOR_MESSAGES = [
    "Stay with it.",
    "Breathe. You're doing great.",
    "Don't break the flow.",
    "Quiet the mind, find the work.",
    "The obstacle is the way.",
    "Deep work is rare. Stay here.",
    "Your future self thanks you."
];

type FocusState = "IDLE" | "SETUP" | "ACTIVE" | "COMPLETE";

export function FocusRoomImpl() {
    const [state, setState] = useState<FocusState>("IDLE");
    const [intention, setIntention] = useState("");
    const [duration, setDuration] = useState(25); // minutes
    const [timeLeft, setTimeLeft] = useState(duration * 60);
    const [showBreathing, setShowBreathing] = useState(false);
    const [mentorMessage, setMentorMessage] = useState("");

    useEffect(() => {
        if (state === "ACTIVE") {
            const interval = setInterval(() => {
                const msg = MENTOR_MESSAGES[Math.floor(Math.random() * MENTOR_MESSAGES.length)];
                setMentorMessage(msg);
                setTimeout(() => setMentorMessage(""), 5000);
            }, 60000); // Every minute
            return () => clearInterval(interval);
        }
    }, [state]);

    const startSession = () => {
        if (!intention) return;
        setTimeLeft(duration * 60);
        setState("ACTIVE");
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (state === "ACTIVE" && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setState("COMPLETE");
        }
        return () => clearInterval(timer);
    }, [state, timeLeft]);

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col font-inter selection:bg-blue-500/30 overflow-hidden relative">
            {/* Premium Atmospheric Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_80%)] opacity-60" />
            </div>

            {/* Minimal Header */}
            <div className="p-8 flex justify-between items-center z-50 relative">
                <Link href="/dashboard" className="text-slate-500 hover:text-white transition-all flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-white/5">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    </div>
                    <span className="text-xs font-light tracking-widest uppercase">Terminate Ritual</span>
                </Link>

                <div className="flex gap-4">
                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white hover:bg-white/5 rounded-xl">
                        <Maximize2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <main className="flex-1 flex flex-col items-center justify-center relative px-6 z-10">
                <AnimatePresence mode="wait">
                    {state === "IDLE" && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-center space-y-16 max-w-xl"
                        >
                            <div className="space-y-6">
                                <h1 className="text-6xl md:text-8xl font-light tracking-tighter leading-none">
                                    Initiate <br />
                                    <span className="font-medium bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent italic">Deep Focus.</span>
                                </h1>
                                <p className="text-slate-400 text-lg font-light tracking-wide max-w-md mx-auto">
                                    A ritualistic environment for extreme cognitive throughput.
                                </p>
                            </div>
                            <Button
                                size="lg"
                                className="rounded-full px-16 py-10 text-xl font-light tracking-widest bg-white text-black hover:bg-slate-200 shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-all duration-500 uppercase"
                                onClick={() => setState("SETUP")}
                            >
                                Begin Ritual
                            </Button>
                        </motion.div>
                    )}

                    {state === "SETUP" && (
                        <motion.div
                            key="setup"
                            initial={{ opacity: 0, scale: 0.98, filter: "blur(20px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                            transition={{ duration: 0.6 }}
                            className="w-full max-w-2xl space-y-16"
                        >
                            <div className="space-y-6 text-center">
                                <h2 className="text-sm font-light text-blue-400 uppercase tracking-[.4em] opacity-60">Architect the Intention</h2>
                                <Input
                                    autoFocus
                                    placeholder="What will you conquer?"
                                    className="bg-transparent border-0 border-b border-white/10 rounded-none text-5xl md:text-6xl text-center py-16 focus-visible:ring-0 focus-visible:border-blue-400/50 transition-all font-light placeholder:text-slate-800 tracking-tight"
                                    value={intention}
                                    onChange={(e) => setIntention(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && startSession()}
                                />
                            </div>

                            <div className="flex flex-col items-center gap-12">
                                <div className="flex items-center gap-4">
                                    {[15, 25, 45, 60].map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => setDuration(m)}
                                            className={`w-16 h-16 rounded-full border transition-all duration-500 font-light flex items-center justify-center ${duration === m
                                                ? "bg-white text-black border-white shadow-lg"
                                                : "border-white/5 text-slate-500 hover:border-white/20 hover:text-white"
                                                }`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                                <Button
                                    size="lg"
                                    className="rounded-full bg-blue-600 hover:bg-blue-700 px-16 py-8 text-lg font-light tracking-widest uppercase transition-all shadow-lg shadow-blue-500/20"
                                    disabled={!intention}
                                    onClick={startSession}
                                >
                                    Enter Zenith
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {state === "ACTIVE" && (
                        <motion.div
                            key="active"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full flex flex-col items-center justify-center gap-20"
                        >
                            <div className="text-center space-y-3 relative">
                                <p className="text-blue-400/40 uppercase tracking-[0.5em] text-xs font-light">Deep Work Protocol Active</p>
                                <h3 className="text-4xl md:text-5xl font-light text-white tracking-tight">{intention}</h3>
                                <div className="absolute -inset-8 bg-blue-500/5 rounded-full blur-[60px] -z-10" />
                            </div>

                            <div className="relative group cursor-default">
                                <motion.div
                                    animate={{ opacity: [0.05, 0.1, 0.05] }}
                                    transition={{ duration: 10, repeat: Infinity }}
                                    className="text-[14rem] md:text-[20rem] font-bold leading-none tracking-tighter select-none tabular-nums text-blue-400 blur-2xl absolute inset-0 -z-10"
                                >
                                    {formatTime(timeLeft)}
                                </motion.div>
                                <div className="text-[12rem] md:text-[18rem] font-extralight tabular-nums tracking-tighter text-white leading-none">
                                    {formatTime(timeLeft)}
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-16 min-h-[4rem]">
                                <AnimatePresence mode="wait">
                                    {showBreathing ? (
                                        <motion.div
                                            key="breathing"
                                            initial={{ opacity: 0, y: 40 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 40 }}
                                            transition={{ type: "spring", damping: 30 }}
                                        >
                                            <BreathingCircle />
                                        </motion.div>
                                    ) : mentorMessage ? (
                                        <motion.p
                                            key="message"
                                            initial={{ opacity: 0, filter: "blur(10px)" }}
                                            animate={{ opacity: 0.3, filter: "blur(0px)" }}
                                            exit={{ opacity: 0, filter: "blur(10px)" }}
                                            className="text-slate-400 italic text-2xl font-light tracking-wide uppercase"
                                        >
                                            {mentorMessage}
                                        </motion.p>
                                    ) : null}
                                </AnimatePresence>

                                <div className="flex items-center gap-4 opacity-30 hover:opacity-100 transition-opacity duration-700">
                                    <Button
                                        variant="ghost"
                                        className="rounded-full border border-white/5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 px-8 py-6 font-light tracking-wide"
                                        onClick={() => setShowBreathing(!showBreathing)}
                                    >
                                        <Brain className="w-4 h-4 mr-2" />
                                        {showBreathing ? "Hide Ritual" : "Guided Breath"}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="rounded-full border border-white/5 bg-white/5 text-slate-500 hover:bg-rose-500/20 hover:text-rose-400 px-8 py-6 font-light tracking-wide"
                                        onClick={() => setState("IDLE")}
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Exit Room
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {state === "COMPLETE" && (
                        <motion.div
                            key="complete"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-16"
                        >
                            <div className="relative inline-block">
                                <CheckCircle2 className="w-32 h-32 text-blue-400 mx-auto font-extralight" />
                                <motion.div
                                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="absolute inset-0 bg-blue-500/20 rounded-full blur-[80px]"
                                />
                            </div>
                            <div className="space-y-6">
                                <h2 className="text-6xl md:text-7xl font-light tracking-tighter">Session Integrated.</h2>
                                <p className="text-slate-400 max-w-md mx-auto font-light text-xl">
                                    Excellence sustained for <span className="text-white font-medium">"{intention}"</span>.
                                </p>
                            </div>
                            <Button
                                className="rounded-full bg-white text-black hover:bg-slate-200 px-16 py-10 text-xl font-light tracking-widest uppercase transition-all"
                                onClick={() => setState("IDLE")}
                            >
                                Re-enter Flow
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Bottom Audio Bar */}
            <div className="p-12 self-end relative z-50">
                <AudioController />
            </div>
        </div>
    );
}
