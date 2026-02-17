interface MetricCardProps {
  label: string;
  value: string;
  helper: string;
}

export function MetricCard({ label, value, helper }: MetricCardProps) {
  return (
    <article className="panel p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-slate-300">{helper}</p>
    </article>
  );
}
