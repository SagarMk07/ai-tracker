import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 relative overflow-hidden">
      <div className="z-10 text-center space-y-8">
        <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
          Focus Guardian AI
        </h1>
        <p className="text-xl text-muted-foreground max-w-lg mx-auto">
          Protect your attention. Master your craft.
        </p>
        <Link href="/login">
          <button className="px-8 py-3 rounded-full bg-accent text-white font-medium hover:bg-indigo-500 transition-colors shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            Enter Focus Room
          </button>
        </Link>
      </div>

      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl -z-10 animate-pulse-slow" />
    </main>
  );
}
