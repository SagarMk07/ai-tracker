"use client";

import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Mail, ArrowRight, Lock, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [mode, setMode] = useState<"magic" | "password" | "signup">("magic");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
    const supabase = createClient();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (mode === "magic") {
                const { error } = await supabase.auth.signInWithOtp({
                    email,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`
                    },
                });
                if (error) {
                    console.error("Supabase Auth Error:", error);
                    throw error;
                }
                setMessage({ text: "Check your email for the magic link.", type: "success" });
            } else if (mode === "password") {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                location.href = "/dashboard";
            } else if (mode === "signup") {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setMessage({ text: "Registration successful! Check your email for verification.", type: "success" });
            }
        } catch (error: any) {
            setMessage({ text: error.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            },
        });
        if (error) {
            console.error("Google OAuth Error:", error);
            setMessage({ text: error.message, type: "error" });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] -z-0" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 relative z-10"
            >
                <div className="text-center mb-10 space-y-4">
                    <Link href="/" className="inline-flex mx-auto w-14 h-14 bg-slate-900 rounded-2xl items-center justify-center border border-slate-800 shadow-xl shadow-blue-500/10 mb-2 hover:border-blue-500/50 transition-colors">
                        <Bot className="w-7 h-7 text-blue-400" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-light tracking-tight text-white italic">AI Tracker</h1>
                        <p className="text-slate-400 mt-2">The companion for your AI journey.</p>
                    </div>
                </div>

                <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-xl space-y-6">
                    <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-full">
                        <button
                            onClick={() => { setMode("magic"); setMessage(null); }}
                            className={cn("flex-1 py-2 text-xs font-bold rounded-full transition-all", mode === "magic" ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300")}
                        >
                            MAGIC LINK
                        </button>
                        <button
                            onClick={() => { setMode("password"); setMessage(null); }}
                            className={cn("flex-1 py-2 text-xs font-bold rounded-full transition-all", mode === "password" ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300")}
                        >
                            SIGN IN
                        </button>
                        <button
                            onClick={() => { setMode("signup"); setMessage(null); }}
                            className={cn("flex-1 py-2 text-xs font-bold rounded-full transition-all", mode === "signup" ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300")}
                        >
                            SIGN UP
                        </button>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div className="space-y-4">
                            <div className="relative">
                                <Input
                                    placeholder="your@email.com"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 pl-11 bg-slate-950/50 border-slate-800 focus:border-blue-500/50 transition-all rounded-full"
                                />
                                <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-4 pointer-events-none" />
                            </div>

                            {mode !== "magic" && (
                                <div className="relative">
                                    <Input
                                        placeholder="••••••••"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-12 pl-11 bg-slate-950/50 border-slate-800 focus:border-blue-500/50 transition-all rounded-full"
                                    />
                                    <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-4 pointer-events-none" />
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/10 rounded-full group"
                            disabled={loading}
                        >
                            {loading ? "Processing..." : (
                                mode === "magic" ? "Send Magic Link" :
                                    mode === "signup" ? "Create Account" : "Sign In"
                            )}
                            <Sparkles className="ml-2 w-4 h-4 group-hover:rotate-12 transition-transform" />
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                            <span className="bg-[#0b1424] px-4 text-slate-500 focus:outline-none">Or social</span>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        className="w-full h-12 border border-slate-800 hover:bg-slate-800 text-white rounded-full transition-all"
                        onClick={handleGoogleLogin}
                    >
                        <span className="flex items-center justify-center gap-2 font-medium">
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </span>
                    </Button>

                    <AnimatePresence>
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={cn(
                                    "p-4 rounded-2xl text-sm text-center font-medium",
                                    message.type === "success"
                                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                                )}
                            >
                                {message.text}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
