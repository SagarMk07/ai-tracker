"use client";

import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
    const supabase = createClient();

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        });

        if (error) {
            setMessage({ text: error.message, type: "error" });
        } else {
            setMessage({ text: "Check your email for the magic link.", type: "success" });
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.1),transparent_50%)]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-md p-8 relative z-10"
            >
                <div className="text-center mb-8 space-y-2">
                    <div className="mx-auto w-12 h-12 bg-surface rounded-xl flex items-center justify-center border border-white/5 mb-6 shadow-lg shadow-indigo-500/10">
                        <Lock className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-white">Focus Guardian</h1>
                    <p className="text-sm text-slate-400">Enter the sanctuary of deep work.</p>
                </div>

                <div className="space-y-6">
                    <Button
                        variant="outline"
                        className="w-full h-11 border-slate-700 hover:bg-slate-800 text-white relative group overflow-hidden"
                        onClick={handleGoogleLogin}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continue with Google
                        </span>
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-slate-500">Or using email</span>
                        </div>
                    </div>

                    <form onSubmit={handleMagicLink} className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <Input
                                    placeholder="name@example.com"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 bg-slate-900/50 border-slate-800 focus:border-indigo-500/50 transition-colors"
                                />
                                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Magic Link"}
                        </Button>
                    </form>

                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "p-3 rounded-md text-sm text-center",
                                message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                            )}
                        >
                            {message.text}
                        </motion.div>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-600">
                        By continuing, you agree to our <a href="#" className="underline hover:text-slate-400">Terms</a> and <a href="#" className="underline hover:text-slate-400">Privacy Policy</a>.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
