export default function DashboardLoading() {
  return (
    <main className="min-h-screen px-6 py-8 md:px-12 md:py-10">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="h-8 w-72 animate-pulse rounded bg-slate-700/40" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="panel h-28 animate-pulse" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="panel h-56 animate-pulse" />
          ))}
        </div>
      </div>
    </main>
  );
}
