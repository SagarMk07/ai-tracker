# Focus Guardian AI - Architecture Overview

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── focus/
│   │   │   ├── sessions/route.ts      # Create & update sessions
│   │   │   ├── distractions/route.ts  # Log distractions
│   │   │   └── reflection/route.ts    # Generate AI reflections
│   │   ├── tasks/
│   │   │   ├── route.ts               # Create tasks
│   │   │   └── breakdown/route.ts     # AI task breakdown
│   │   ├── profile/
│   │   │   └── personality/route.ts   # Update personality mode
│   │   └── accountability/
│   │       └── weekly-summary/route.ts # Weekly AI summary
│   ├── dashboard/page.tsx             # Main dashboard
│   ├── focus/page.tsx                 # Immersive session page
│   └── globals.css                    # Cinematic dark theme
├── components/
│   ├── session/
│   │   ├── create-session-modal.tsx   # Session creation UI
│   │   └── immersive-session.tsx      # Timer + reflection flow
│   ├── tasks/
│   │   └── smart-task-input.tsx       # AI-powered task breakdown
│   ├── profile/
│   │   └── personality-selector.tsx   # Coaching mode selector
│   ├── analytics/
│   │   ├── metric-card.tsx
│   │   ├── weekly-focus-chart.tsx
│   │   ├── distraction-frequency.tsx
│   │   ├── performance-trend.tsx
│   │   └── weekly-summary-card.tsx
│   └── ui/
│       └── fade-in.tsx                # Framer Motion wrapper
├── hooks/
│   └── use-focus-timer.ts             # Persistent timer logic
├── lib/
│   ├── openai.ts                      # AI prompt engineering
│   ├── metrics.ts                     # Dashboard calculations
│   └── database.types.ts              # Supabase types
└── types/
    └── index.ts                       # TypeScript interfaces
```

## Core Features

### 1. Focus Session Engine
- **Modal Creation**: Goal, duration, risk factors
- **AI Intention**: Generated before session starts
- **Persistent Timer**: Survives page refresh via localStorage
- **Distraction Logging**: Real-time tracking
- **Post-Session Reflection**: User rating + AI feedback

### 2. AI Accountability System
- **Personality Modes**: Soft / Tactical / Ruthless
- **Weekly Summary**: AI-generated performance review
- **Adaptive Coaching**: Tone changes based on mode

### 3. Smart Task Intelligence
- **Goal Breakdown**: AI splits large tasks into focus blocks
- **Difficulty Scoring**: 1-10 complexity rating
- **Time Estimation**: Suggested scheduling windows

### 4. Analytics Dashboard
- **Weekly Focus Hours**: Completed deep work time
- **Streak Counter**: Consecutive session days
- **Completion Rate**: % of finished sessions
- **Distraction Graph**: Frequency by type
- **Performance Trend**: 4-week trajectory

## Database Schema

### Tables
- `users` - Profile + personality_mode
- `focus_sessions` - Goal, intention, status, duration
- `tasks` - Title, difficulty, AI-suggested blocks
- `session_reflections` - User + AI feedback
- `distraction_logs` - Type, notes, timestamp
- `performance_metrics` - Weekly aggregates

## AI Integration

### OpenAI Functions
1. `generateIntentionStatement` - Pre-session motivation
2. `generateSessionReflection` - Post-session analysis
3. `generateWeeklyAccountabilitySummary` - Weekly coaching
4. `generateTaskIntelligence` - Task decomposition

### Prompt Engineering
- Personality-aware system prompts
- Structured JSON responses
- Fallback defaults for errors

## UI/UX Design

### Theme
- **Colors**: Deep blues (#080b12 → #0e1320)
- **Accents**: Teal (#77e3c8) for CTAs
- **Panels**: Glass morphism with subtle borders
- **Animations**: Framer Motion for micro-interactions

### Key Interactions
- Breathing timer animation
- Smooth fade-in transitions
- Optimistic UI updates
- Loading states with spinners

## Deployment Checklist

- [ ] Apply `supabase/schema.sql` to database
- [ ] Set `OPENAI_API_KEY` in environment
- [ ] Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Run `npm run build` to check for errors
- [ ] Test auth flow (signup/login)
- [ ] Test session creation → timer → reflection
- [ ] Test task breakdown → save
- [ ] Test personality mode switching
