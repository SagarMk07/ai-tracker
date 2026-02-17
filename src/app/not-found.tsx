import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <section className="panel max-w-lg p-8 text-center space-y-4">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">404</p>
        <h1 className="text-3xl">Page not found</h1>
        <Link href="/dashboard" className="inline-block rounded-xl bg-[var(--accent)] px-4 py-2 text-slate-950 font-semibold">Go to dashboard</Link>
      </section>
    </main>
  );
}
