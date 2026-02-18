import { Card } from "@/components/ui/card";

interface DistractionFrequencyProps {
  data: Array<{ label: string; count: number }>;
}

export function DistractionFrequency({ data }: DistractionFrequencyProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0) || 1;

  return (
    <Card className="p-5">
      <h3 className="text-lg">Distraction Frequency</h3>
      <div className="mt-4 space-y-3">
        {data.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm text-[var(--text-secondary)]">
              <span>{item.label}</span>
              <span>{item.count}</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-slate-700/60">
              <div
                className="h-2 rounded-full bg-[var(--danger)]"
                style={{ width: `${Math.round((item.count / total) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
