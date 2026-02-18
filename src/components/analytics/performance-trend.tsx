import { Card } from "@/components/ui/card";

interface PerformanceTrendProps {
  data: Array<{ week: string; score: number }>;
}

export function PerformanceTrend({ data }: PerformanceTrendProps) {
  return (
    <Card className="p-5">
      <h3 className="text-lg">Performance Trend</h3>
      <div className="mt-4 space-y-2">
        {data.map((item) => (
          <div key={item.week} className="flex items-center gap-3">
            <span className="w-20 text-xs text-[var(--text-secondary)]">{item.week}</span>
            <div className="h-2 flex-1 rounded-full bg-slate-700/60">
              <div
                className="h-2 rounded-full bg-[var(--accent)]"
                style={{ width: `${Math.max(6, Math.min(100, item.score))}%` }}
              />
            </div>
            <span className="w-10 text-right text-xs text-[var(--text-secondary)]">{item.score.toFixed(0)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
