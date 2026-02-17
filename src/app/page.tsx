"use client";

// HOMEPAGE IS NOW THE DASHBOARD - NO NAVIGATION NEEDED
export default function HomePage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-slate-400">Focus Guardian AI</p>
            <h1 className="text-4xl font-bold mt-2">Dashboard</h1>
          </div>
        </header>

        <div className="panel p-6 bg-green-500/10 border-green-500/20">
          <h2 className="text-xl font-semibold text-green-400 mb-2">✅ Application is Working!</h2>
          <p className="text-slate-300">
            You're viewing the dashboard. Navigation and UI are functional.
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Database features are temporarily disabled in development mode.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="panel p-6">
            <p className="text-sm text-slate-400 mb-1">Focus Hours</p>
            <p className="text-4xl font-bold text-[var(--accent)]">0</p>
            <p className="text-xs text-slate-500 mt-1">This week</p>
          </div>

          <div className="panel p-6">
            <p className="text-sm text-slate-400 mb-1">Current Streak</p>
            <p className="text-4xl font-bold text-[var(--accent)]">0</p>
            <p className="text-xs text-slate-500 mt-1">Days</p>
          </div>

          <div className="panel p-6">
            <p className="text-sm text-slate-400 mb-1">Total Sessions</p>
            <p className="text-4xl font-bold text-[var(--accent)]">0</p>
            <p className="text-xs text-slate-500 mt-1">All time</p>
          </div>
        </div>

        <div className="panel p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-slate-600 px-6 py-4">
              <p className="font-semibold">Start Focus Session</p>
              <p className="text-sm text-slate-400 mt-1">Feature coming soon</p>
            </div>

            <div className="rounded-xl border border-slate-600 px-6 py-4">
              <p className="font-semibold">View Analytics</p>
              <p className="text-sm text-slate-400 mt-1">Feature coming soon</p>
            </div>
          </div>
        </div>

        <div className="panel p-6">
          <h3 className="text-lg font-semibold mb-2">Development Mode</h3>
          <p className="text-slate-400 text-sm">
            Authentication and database features are temporarily disabled.
            You can explore the UI and design.
          </p>
        </div>
      </div>
    </main>
  );
}
