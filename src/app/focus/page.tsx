"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FocusTimer } from "@/components/focus/focus-timer";
import { BreathingCircle } from "@/components/focus/breathing-circle";
import { FocusMentor } from "@/components/focus/focus-mentor";
import { AmbientPlayer } from "@/components/focus/ambient-player";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type SessionState = "intent" | "breathing" | "focus" | "completion" | "reflection";

export default function FocusRoomPage() {
    const [state, setState] = useState<SessionState>("intent");
    const [intent, setIntent] = useState("");
    const [duration, setDuration] = useState(25 * 60); // 25 mins default
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isActive, setIsActive] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const [startedAt, setStartedAt] = useState<string | null>(null);
    const supabase = createClient();

    // Timer Logic
    // Timer Tick
    useEffect(() => {
        if (!isActive || state !== "focus") return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) return 0;
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, state]);

    // Completion Trigger
    useEffect(() => {
        if (timeLeft === 0 && state === "focus") {
            setIsActive(false);
            setState("completion");
            saveSession(true);
        }
    }, [timeLeft, state]);

    // Handlers
    const handleStartBreathing = () => {
        if (!intent.trim()) return;
        setState("breathing");
    };

    const handleStartFocus = () => {
        setTimeLeft(duration);
        setStartedAt(new Date().toISOString());
        setState("focus");
        setIsActive(true);
    };

    const saveSession = async (completed: boolean) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !startedAt) return;

        const elapsed = duration - timeLeft;

        // 1. Save Session
        await supabase.from("focus_sessions").insert({
            user_id: user.id,
            intent,
            duration_seconds: completed ? duration : elapsed,
            completed,
            started_at: startedAt,
            ended_at: new Date().toISOString(),
            distraction_count: 0
        });

        // 2. Update Integrity Score
        // Fetch current score first
        const { data: profile } = await supabase.from("users").select("focus_integrity_score").eq("id", user.id).single();

        if (profile) {
            let newScore = profile.focus_integrity_score || 100;
            if (completed) {
                newScore = Math.min(100, newScore + 2);
            } else {
                newScore = Math.max(0, newScore - 5);
            }

            await supabase.from("users").update({ focus_integrity_score: newScore }).eq("id", user.id);
        }
    };

    const handleEndEarly = () => {
        setIsActive(false);
        setState("reflection"); // active -> reflection directly if ended early? or just completion state?
        // Let's use reflection state to show "Session Ended"
        saveSession(false);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col relative overflow-hidden transition-colors duration-1000">

            {/* Ambient Overlay primarily for Focus Mode */}
            <div className={cn(
                "absolute inset-0 pointer-events-none transition-opacity duration-1000",
                state === "focus" ? "opacity-100 bg-black/40" : "opacity-0"
            )} />

            {/* Top Bar (Auto-hide in focus?) */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
                <div className={cn("text-lg font-medium transition-opacity", state === "focus" ? "opacity-20 hover:opacity-100" : "opacity-100")}>
                    Focus Guardian
                </div>
                <button
                    onClick={toggleFullscreen}
                    className="text-slate-500 hover:text-white transition-colors"
                >
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex items-center justify-center p-4 z-10">
                <AnimatePresence mode="wait">

                    {/* 1. INTENT PHASE */}
                    {state === "intent" && (
                        <motion.div
                            key="intent"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                            className="w-full max-w-lg text-center space-y-8"
                        >
                            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white">
                                What will you achieve?
                            </h1>
                            <div className="space-y-4">
                                <Input
                                    value={intent}
                                    onChange={(e) => setIntent(e.target.value)}
                                    placeholder="I will complete the API integration..."
                                    className="bg-transparent border-b border-slate-700 rounded-none border-t-0 border-x-0 px-0 text-2xl md:text-3xl text-center py-4 focus:ring-0 focus:border-indigo-500 placeholder:text-slate-600 h-auto"
                                    autoFocus
                                />
                                <div className="flex justify-center gap-4 text-slate-400">
                                    <button onClick={() => setDuration(25 * 60)} className={cn("px-4 py-2 hover:text-white transition-colors", duration === 25 * 60 && "text-white font-medium")}>25m</button>
                                    <button onClick={() => setDuration(50 * 60)} className={cn("px-4 py-2 hover:text-white transition-colors", duration === 50 * 60 && "text-white font-medium")}>50m</button>
                                    <button onClick={() => setDuration(90 * 60)} className={cn("px-4 py-2 hover:text-white transition-colors", duration === 90 * 60 && "text-white font-medium")}>90m</button>
                                </div>
                            </div>
                            <Button
                                onClick={handleStartBreathing}
                                disabled={!intent.trim()}
                                className="mt-8 text-lg px-8 py-6"
                            >
                                Begin Session <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </motion.div>
                    )}

                    {/* 2. BREATHING PHASE */}
                    {state === "breathing" && (
                        <motion.div
                            key="breathing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <BreathingCircle onComplete={handleStartFocus} />
                        </motion.div>
                    )}

                    {/* 3. FOCUS PHASE */}
                    {state === "focus" && (
                        <motion.div
                            key="focus"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center"
                        >
                            <div className="mb-12 text-center opacity-80">
                                <h2 className="text-2xl font-light text-white mb-2">{intent}</h2>
                                <p className="text-sm text-indigo-400/80 uppercase tracking-widest">Focus Mode Active</p>
                            </div>

                            <FocusMentor
                                intent={intent}
                                duration={duration}
                                timeLeft={timeLeft}
                                isActive={isActive}
                            />

                            <FocusTimer
                                durationSeconds={duration}
                                timeLeft={timeLeft}
                                isActive={isActive}
                            />

                            <div className="mt-16 opacity-0 hover:opacity-100 transition-opacity duration-500">
                                <Button variant="ghost" className="text-red-400 hover:bg-red-950/30 hover:text-red-300" onClick={handleEndEarly}>
                                    End Session Early
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* 4. COMPLETION / REFLECTION PHASE (Placeholder for now) */}
                    {(state === "completion" || state === "reflection") && (
                        <motion.div
                            key="reflection"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center space-y-6"
                        >
                            <h1 className="text-3xl font-medium text-white">Session {state === "completion" ? "Complete" : "Ended"}</h1>
                            <p className="text-slate-400">Time to reflect. How was your focus?</p>
                            <div className="flex gap-4 justify-center">
                                <Button onClick={() => setState("intent")}>Begin Again</Button>
                                <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>Dashboard</Button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Ambient Player - Persistent across phases (except maybe completion? No, keep it.) */}
            <AmbientPlayer />

        </div>
    );
}
