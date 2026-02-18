# Focus Guardian AI

AI-powered deep-work accountability and cognitive optimization.

## Tech Stack
- Next.js 16 (App Router)
- TypeScript 5
- Tailwind CSS
- Supabase (Auth + Postgres)
- OpenAI
- Framer Motion

## Core Product Modules
- Focus Session Engine (intention + timer + reflection)
- AI Accountability (weekly summaries + personality modes)
- Analytics Dashboard (focus hours, streaks, completion, trends)
- Smart Task Intelligence (AI decomposition + difficulty + schedule hints)

## Setup
1. Install dependencies:
```bash
npm install
```
2. Configure env:
```bash
cp .env.example .env.local
```
3. Apply database schema from `supabase/schema.sql`.
4. Run development server:
```bash
npm run dev
```

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; recommended for robust profile sync)

## Commands
- `npm run dev`
- `npm run lint`
- `npm test`
- `npm run build`

## Documentation
- `ARCHITECTURE.md`
- `QUICKSTART.md`
- `EXAMPLES.md`
