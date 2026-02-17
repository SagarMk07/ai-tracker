interface WeeklyFocusChartProps {
  minutesByDay: Array<{ day: string; minutes: number }>;
}

export function WeeklyFocusChart({ minutesByDay }: WeeklyFocusChartProps) {
  const max = Math.max(...minutesByDay.map((m) => m.minutes), 1);

  return (
    <div className="panel p-5">
      <h3 className="text-lg">Weekly Focus Hours</h3>
      <div className="mt-5 flex items-end gap-3 h-44">
        {minutesByDay.map((row) => (
          <div key={row.day} className="flex-1 text-center">
            <div
              className="mx-auto w-full rounded-t-md bg-[var(--accent)]/75"
              style={{ height: `${Math.max(8, (row.minutes / max) * 130)}px` }}
            />
            <p className="mt-2 text-xs text-slate-300">{row.day}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
