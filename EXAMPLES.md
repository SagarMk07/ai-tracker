# Focus Guardian AI - Developer Examples

## API Usage Examples

### Creating a Session Programmatically

```typescript
// Client-side component
async function createFocusSession() {
  const response = await fetch("/api/focus/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      goal: "Complete quarterly report",
      durationMinutes: 50,
      riskFactors: ["email", "slack"],
      personalityMode: "tactical"
    }),
  });

  const { sessionId, intention } = await response.json();
  // Redirect to /focus?session={sessionId}
}
```

### Logging Distractions

```typescript
async function logDistraction(sessionId: string) {
  await fetch("/api/focus/distractions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      type: "phone_notification",
      notes: "Team message about urgent issue"
    }),
  });
}
```

### Getting AI Task Breakdown

```typescript
async function breakdownTask(goal: string) {
  const response = await fetch("/api/tasks/breakdown", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      goal,
      personalityMode: "tactical",
      availableWindows: ["09:00-11:00", "14:00-16:00"]
    }),
  });

  const intelligence = await response.json();
  /*
  {
    difficultyScore: 7,
    suggestedTime: "09:00-11:00",
    focusBlocks: [
      { title: "Research phase", minutes: 30, reason: "..." },
      { title: "Execution", minutes: 60, reason: "..." }
    ]
  }
  */
}
```

## Component Patterns

### Using the Focus Timer Hook

```typescript
"use client";

import { useFocusTimer } from "@/hooks/use-focus-timer";

export function CustomTimer({ sessionId, duration }: Props) {
  const { 
    timeLeft, 
    isActive, 
    isPaused, 
    toggle, 
    formatTime, 
    progress 
  } = useFocusTimer({
    sessionId,
    durationSeconds: duration * 60,
    onComplete: () => {
      console.log("Session complete!");
    }
  });

  return (
    <div>
      <div>{formatTime()}</div>
      <button onClick={toggle}>
        {isActive ? "Pause" : "Start"}
      </button>
      <div>Progress: {progress.toFixed(0)}%</div>
    </div>
  );
}
```

### Creating Animated Cards

```typescript
"use client";

import { FadeIn } from "@/components/ui/fade-in";

export function MetricGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <FadeIn delay={0}>
        <MetricCard label="Sessions" value="12" />
      </FadeIn>
      <FadeIn delay={0.1}>
        <MetricCard label="Hours" value="8.5" />
      </FadeIn>
      <FadeIn delay={0.2}>
        <MetricCard label="Streak" value="5d" />
      </FadeIn>
    </div>
  );
}
```

### Personality-Aware Components

```typescript
import type { PersonalityMode } from "@/types";

function getMotivationalMessage(mode: PersonalityMode) {
  const messages = {
    soft: "You're doing great! Every session counts. 🌱",
    tactical: "Solid progress. Lock in the next block. 🎯",
    ruthless: "No excuses. Execute now. ⚡"
  };
  return messages[mode];
}

export function MotivationBanner({ mode }: { mode: PersonalityMode }) {
  return (
    <div className="panel p-4">
      <p>{getMotivationalMessage(mode)}</p>
    </div>
  );
}
```

## Database Queries

### Fetching User Sessions

```typescript
// Server component
import { requireUser } from "@/lib/supabase/server";

export default async function SessionHistory() {
  const { user, supabase } = await requireUser();

  const { data: sessions } = await supabase
    .from("focus_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div>
      {sessions?.map(session => (
        <div key={session.id}>
          <h3>{session.goal}</h3>
          <p>Status: {session.status}</p>
        </div>
      ))}
    </div>
  );
}
```

### Aggregating Weekly Stats

```typescript
const now = new Date();
const weekAgo = new Date(now);
weekAgo.setDate(now.getDate() - 7);

const { data: sessions } = await supabase
  .from("focus_sessions")
  .select("duration_minutes, status")
  .eq("user_id", user.id)
  .eq("status", "completed")
  .gte("created_at", weekAgo.toISOString());

const totalMinutes = sessions?.reduce(
  (sum, s) => sum + s.duration_minutes, 
  0
) || 0;

const hours = (totalMinutes / 60).toFixed(1);
```

## Styling Patterns

### Panel Component

```tsx
<div className="panel p-6 space-y-4">
  <h3 className="text-lg font-medium">Title</h3>
  <p className="text-slate-400">Description</p>
</div>
```

### Accent Button

```tsx
<button className="bg-[var(--accent)] text-slate-950 font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">
  Primary Action
</button>
```

### Secondary Button

```tsx
<button className="border border-slate-600 text-slate-200 px-4 py-2 rounded-xl hover:border-slate-500 transition-colors">
  Secondary Action
</button>
```

### Input Field

```tsx
<input
  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[var(--accent)] transition-colors"
  placeholder="Enter text..."
/>
```

## Extending the System

### Adding a New AI Feature

1. **Create OpenAI function** in `lib/openai.ts`:
```typescript
export async function generateCustomFeature(input: CustomInput) {
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content: `You are Focus Guardian AI. ${personalityInstruction(input.personality)}`
      },
      { role: "user", content: JSON.stringify(input) }
    ],
  });
  return completion.choices[0]?.message?.content;
}
```

2. **Create API route** in `app/api/custom/route.ts`:
```typescript
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/server";
import { generateCustomFeature } from "@/lib/openai";

export async function POST(request: Request) {
  const { user } = await requireUser();
  const body = await request.json();
  
  const result = await generateCustomFeature(body);
  return NextResponse.json({ result });
}
```

3. **Create component** in `components/custom/feature.tsx`:
```typescript
"use client";

import { useState, useTransition } from "react";

export function CustomFeature() {
  const [result, setResult] = useState(null);
  const [isPending, startTransition] = useTransition();

  function handleGenerate() {
    startTransition(async () => {
      const res = await fetch("/api/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ /* data */ })
      });
      const data = await res.json();
      setResult(data.result);
    });
  }

  return (
    <div className="panel p-6">
      <button onClick={handleGenerate} disabled={isPending}>
        {isPending ? "Generating..." : "Generate"}
      </button>
      {result && <div>{result}</div>}
    </div>
  );
}
```

## Testing Patterns

### Component Testing

```typescript
import { render, screen } from "@testing-library/react";
import { SmartTaskInput } from "@/components/tasks/smart-task-input";

test("renders task input", () => {
  render(<SmartTaskInput personalityMode="tactical" />);
  expect(screen.getByPlaceholderText(/accomplish/i)).toBeInTheDocument();
});
```

### API Testing

```typescript
import { POST } from "@/app/api/focus/sessions/route";

test("creates session with AI intention", async () => {
  const request = new Request("http://localhost/api/focus/sessions", {
    method: "POST",
    body: JSON.stringify({
      goal: "Test goal",
      durationMinutes: 25,
      riskFactors: [],
      personalityMode: "tactical"
    })
  });

  const response = await POST(request);
  const data = await response.json();
  
  expect(data.sessionId).toBeDefined();
  expect(data.intention).toBeDefined();
});
```
