"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
    const supabase = createClient();

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`
                },
            });
            if (error) throw error;
            setMessage({ text: "Check your email for the magic link.", type: "success" });
        } catch (error: any) {
            setMessage({ text: error.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h1>Welcome Back</h1>
            <p>Sign in to continue</p>

            <form onSubmit={handleMagicLink}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                />
                <button type="submit" className="button-primary" disabled={loading}>
                    {loading ? "Sending..." : "Send Magic Link"}
                </button>
            </form>

            {message && (
                <p style={{
                    marginTop: '20px',
                    fontSize: '14px',
                    color: message.type === 'success' ? '#d4c2ff' : '#ff9494',
                    opacity: 1
                }}>
                    {message.text}
                </p>
            )}
        </div>
    );
}
