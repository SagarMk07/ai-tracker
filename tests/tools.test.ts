import { describe, expect, it } from "vitest";
import { buildDashboardSnapshot } from "../src/lib/metrics";
import type { FocusSession } from "../src/types";

describe("buildDashboardSnapshot", () => {
  it("computes weekly focus and completion rate", () => {
    const now = new Date().toISOString();

    const sessions: FocusSession[] = [
      {
        id: "1",
        user_id: "u1",
        goal: "Write architecture doc",
        duration_minutes: 50,
        risk_factors: [],
        intention_statement: null,
        status: "completed",
        started_at: now,
        ended_at: now,
        recovered: false,
        created_at: now,
        updated_at: now,
      },
      {
        id: "2",
        user_id: "u1",
        goal: "Design API",
        duration_minutes: 25,
        risk_factors: [],
        intention_statement: null,
        status: "incomplete",
        started_at: now,
        ended_at: now,
        recovered: false,
        created_at: now,
        updated_at: now,
      },
    ];

    const snapshot = buildDashboardSnapshot(sessions, 3);

    expect(snapshot.weeklyFocusHours).toBeGreaterThan(0);
    expect(snapshot.completionRate).toBe(50);
    expect(snapshot.distractionCount).toBe(3);
  });
});
