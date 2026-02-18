# Focus Guardian AI - Production SaaS Architecture

## Core Identity
Focus Guardian AI is an AI-powered deep work accountability system focused on execution quality, session consistency, and cognitive load management.

## Updated Folder Structure
```text
src/
  app/
    api/
      accountability/
        weekly-summary/
          _metrics.ts
          route.ts
          stream/route.ts
      focus/
        distractions/route.ts
        intention/route.ts
        reflection/route.ts
        sessions/route.ts
      profile/
        personality/route.ts
      tasks/
        breakdown/route.ts
        intelligence/route.ts
        route.ts
    auth/
      callback/route.ts
      signout/route.ts
    dashboard/page.tsx
    focus/page.tsx
    login/page.tsx
    settings/page.tsx
    globals.css
  components/
    analytics/
      distraction-frequency.tsx
      metric-card.tsx
      performance-trend.tsx
      personality-selector.tsx
      weekly-focus-chart.tsx
      weekly-summary-card.tsx
    navigation/
      app-sidebar.tsx
    session/
      create-session-modal.tsx
      immersive-session.tsx
    tasks/
      smart-task-input.tsx
    ui/
      button.tsx
      card.tsx
      input.tsx
      modal.tsx
  hooks/
    use-focus-timer.ts
  lib/
    env.ts
    metrics.ts
    openai.ts
    supabase/
      client.ts
      server.ts
  types/
    index.ts
supabase/
  schema.sql
```

## Supabase Schema
Implemented in `supabase/schema.sql`.

Tables:
- `users`
- `focus_sessions`
- `tasks`
- `session_reflections`
- `distraction_logs`
- `performance_metrics`

Key production details:
- RLS enabled on all product tables
- Per-user select/insert/update/delete policies
- `updated_at` triggers for mutable entities
- `focus_sessions.recovered` flag for stale session recovery
- `tasks` supports AI fields: `difficulty_score`, `suggested_time`, `ai_breakdown`
- `performance_metrics` uses unique `(user_id, week_start)` for weekly upsert integrity

## CSS Design System
Global tokenized system in `src/app/globals.css`.

Design tokens include:
- Background layers: `--bg-primary`, `--bg-secondary`, `--bg-tertiary`
- Text hierarchy: `--text-primary`, `--text-secondary`, `--text-muted`
- Accent system: `--accent`, `--accent-strong`, `--accent-soft`
- Border softness: `--border-soft`, `--border-medium`, `--border-strong`
- Elevation shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`

Reusable classes:
- Cards: `.surface-card`, `.surface-card-hover`
- Buttons: `.btn-base`, `.btn-primary`, `.btn-ghost`
- Inputs: `.input-base`
- Layout styling: `.panel`, `.grid-overlay`

## Example UI Components
- Card with hover elevation: `src/components/ui/card.tsx`
- Primary + ghost buttons: `src/components/ui/button.tsx`
- Accent-focus inputs: `src/components/ui/input.tsx`
- Modal system: `src/components/ui/modal.tsx`
- Navigation sidebar: `src/components/navigation/app-sidebar.tsx`
- Analytics widgets: `src/components/analytics/*`

## Core Feature Implementation
### A) Focus Session Engine
- Session modal + intention generation: `src/components/session/create-session-modal.tsx`
- Server session creation/update: `src/app/api/focus/sessions/route.ts`
- Persistent timer + recovery behavior: `src/hooks/use-focus-timer.ts`
- Post-session reflection (AI + persistence): `src/app/api/focus/reflection/route.ts`

### B) AI Accountability System
- Incomplete-session detection: `src/app/dashboard/page.tsx`
- Weekly summary generation: `src/app/api/accountability/weekly-summary/route.ts`
- Streaming summary UX: `src/app/api/accountability/weekly-summary/stream/route.ts`
- Personality mode management: `src/components/analytics/personality-selector.tsx` and `src/app/api/profile/personality/route.ts`

### C) Analytics Dashboard
- Streak/completion calculations: `src/lib/metrics.ts`
- Dashboard assembly: `src/app/dashboard/page.tsx`
- Widgets: `src/components/analytics/*`

### D) Smart Task Intelligence
- AI breakdown endpoint: `src/app/api/tasks/breakdown/route.ts`
- Task persistence with cognitive scoring + schedule suggestion: `src/app/api/tasks/route.ts`
- UX component: `src/components/tasks/smart-task-input.tsx`

## UX Flow
1. User signs in on `/login` (email OTP or OAuth).
2. Authenticated user lands on `/dashboard` (protected route).
3. User creates a session in modal, optionally generates AI intention, then enters immersive `/focus` mode.
4. Timer state persists and can recover after refresh.
5. Session completion writes reflection and updates analytics inputs.
6. Weekly accountability summary and task intelligence provide AI-driven guidance for next execution cycle.
