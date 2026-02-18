"use client";

import { FormEvent, useState, useTransition } from "react";
import { createClient } from "@/services/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function signInWithEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    startTransition(async () => {
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      setMessage("Check your inbox for a secure sign-in link.");
    });
  }

  function signInWithGoogle() {
    setError(null);
    setMessage(null);

    startTransition(async () => {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (oauthError) {
        setError(oauthError.message);
      }
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <section className="panel w-full max-w-md p-8 space-y-6">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-slate-400">Focus Guardian AI</p>
          <h1 className="text-3xl mt-2">Sign in</h1>
          <p className="mt-2 text-sm text-slate-400">Access your accountability dashboard and active sessions.</p>
        </div>

        <form className="space-y-3" onSubmit={signInWithEmail}>
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            required
          />
          <Button type="submit" className="w-full" disabled={isPending || !email.trim()}>
            {isPending ? "Sending..." : "Continue with email"}
          </Button>
        </form>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-700" />
          </div>
          <p className="relative text-center text-xs uppercase tracking-[0.15em] text-slate-500 bg-transparent">or</p>
        </div>

        <Button variant="outline" className="w-full" onClick={signInWithGoogle} disabled={isPending}>
          Continue with Google
        </Button>

        {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      </section>
    </main>
  );
}
