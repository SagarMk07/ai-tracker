"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleClick = () => {
    console.log("Button clicked - navigating to dashboard");
    window.location.href = "/dashboard";
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <section className="panel w-full max-w-md p-8 space-y-5 text-center">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-slate-400">Focus Guardian AI</p>
          <h1 className="text-3xl mt-2">Development Mode</h1>
        </div>

        <div className="space-y-4">
          <p className="text-slate-300">Authentication is temporarily disabled for testing.</p>

          <button
            onClick={handleClick}
            className="block w-full rounded-xl bg-[var(--accent)] py-3 font-semibold text-slate-950 hover:opacity-90 transition-opacity cursor-pointer"
          >
            Go to Dashboard
          </button>

          <div className="text-sm text-slate-400 space-y-2">
            <p>⚠️ Auth bypass is active</p>
            <p>Click the button above to access the dashboard</p>
          </div>

          <div className="text-xs text-slate-500 mt-4">
            <p>If the button doesn't work, manually go to:</p>
            <code className="text-slate-300">http://localhost:3000/dashboard</code>
          </div>
        </div>
      </section>
    </main>
  );
}
