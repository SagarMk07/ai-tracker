"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, LogOut, Shield, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showScore, setShowScore] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }
            setUser(user);
            setLoading(false);
        };

        // Load preference
        const storedPref = localStorage.getItem("focus_show_score");
        if (storedPref !== null) {
            setShowScore(storedPref === "true");
        }

        checkUser();
    }, [supabase, router]);

    const handleToggleScore = () => {
        const newValue = !showScore;
        setShowScore(newValue);
        localStorage.setItem("focus_show_score", String(newValue));
        // Dispatch event so other components can react if needed (optional)
        window.dispatchEvent(new Event("storage"));
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    if (loading) return <div className="min-h-screen bg-[#0B1220] flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#0B1220] text-slate-200 font-sans selection:bg-indigo-500/30">
            <div className="max-w-2xl mx-auto p-6 space-y-8">

                {/* Header */}
                <header className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" className="rounded-full w-10 h-10 p-0" onClick={() => router.back()}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-2xl font-light text-white tracking-tight">Settings</h1>
                </header>

                {/* Profile Section */}
                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-surface/30 border border-white/5 rounded-2xl p-6 space-y-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                            <span className="text-2xl font-medium text-indigo-300">
                                {user.email?.[0].toUpperCase() || "U"}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-white">{user.user_metadata?.full_name || "Focus Guardian"}</h2>
                            <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                    </div>
                </motion.section>

                {/* Preferences */}
                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-surface/30 border border-white/5 rounded-2xl p-6 space-y-6"
                >
                    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Preferences</h3>

                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-indigo-400" />
                                <span className="text-white font-medium">Focus Integrity Score</span>
                            </div>
                            <p className="text-xs text-slate-500 max-w-[300px]">
                                Show your gamified reliability score on the dashboard.
                            </p>
                        </div>
                        <button
                            onClick={handleToggleScore}
                            className={`w-12 h-7 rounded-full transition-colors flex items-center px-1 ${showScore ? "bg-indigo-600" : "bg-slate-700"}`}
                        >
                            <motion.div
                                layout
                                className="w-5 h-5 rounded-full bg-white shadow-sm"
                            />
                        </button>
                    </div>
                </motion.section>

                {/* Danger Zone */}
                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="pt-8"
                >
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-2 h-12"
                        onClick={handleSignOut}
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Button>
                </motion.section>

            </div>
        </div>
    );
}
