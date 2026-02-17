"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <section className="panel max-w-lg p-8 text-center space-y-4">
        <h1 className="text-3xl">Something failed</h1>
        <p className="text-slate-300">{error.message || "Unexpected application error."}</p>
        <button onClick={reset} className="rounded-xl bg-[var(--accent)] px-4 py-2 text-slate-950 font-semibold">Retry</button>
      </section>
    </main>
  );
}
