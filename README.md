# Focus Guardian AI

> An AI-powered deep work accountability and cognitive optimization system.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-purple?logo=openai)

## ✨ Features

### 🎯 Focus Session Engine
- **AI-Generated Intentions** - Personalized motivation before each session
- **Persistent Timer** - Survives page refreshes and browser crashes
- **Distraction Tracking** - Real-time logging of interruptions
- **Post-Session Reflection** - AI analyzes your performance

### 🤖 AI Accountability System
- **3 Personality Modes** - Soft Guide, Tactical Coach, or Ruthless Drill Sergeant
- **Weekly Performance Reviews** - AI-generated summaries with actionable insights
- **Adaptive Coaching** - Tone adjusts based on your selected mode

### 📋 Smart Task Intelligence
- **AI Task Breakdown** - Decomposes complex goals into focus blocks
- **Difficulty Scoring** - 1-10 complexity rating
- **Time Estimation** - Suggested scheduling windows
- **One-Click Planning** - Save tasks with AI metadata

### 📊 Analytics Dashboard
- **Weekly Focus Hours** - Track completed deep work time
- **Streak Counter** - Consecutive session days
- **Completion Rate** - % of finished vs. abandoned sessions
- **Distraction Analysis** - Frequency charts by type
- **Performance Trends** - 4-week trajectory visualization

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Supabase account
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-tracker-1.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Apply database schema**
   - Open Supabase SQL Editor
   - Copy contents of `supabase/schema.sql`
   - Execute

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Visit** `http://localhost:3000`

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - User guide for all features
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design and structure
- **[EXAMPLES.md](./EXAMPLES.md)** - Developer patterns and API usage

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **AI**: OpenAI GPT-4o-mini
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── dashboard/         # Main dashboard
│   └── focus/             # Immersive session mode
├── components/
│   ├── session/           # Focus session components
│   ├── tasks/             # Task management
│   ├── profile/           # User preferences
│   ├── analytics/         # Dashboard metrics
│   └── ui/                # Shared UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and integrations
└── types/                 # TypeScript definitions
```

## 🎨 Design Philosophy

### Cinematic Dark Theme
- Deep gradient backgrounds (#080b12 → #0e1320)
- Teal accent color (#77e3c8) for CTAs
- Glass morphism panels with subtle borders
- Smooth micro-interactions

### Premium UX
- Framer Motion animations
- Optimistic UI updates
- Loading states with spinners
- Distraction-free immersive mode

## 🔧 Development

### Build
```bash
npm run build
```

### Lint
```bash
npm run lint
```

### Test
```bash
npm test
```

## 🚢 Deployment

### Vercel (Recommended)
```bash
vercel
```

### Environment Variables
Ensure these are set in your deployment:
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please read the [ARCHITECTURE.md](./ARCHITECTURE.md) first.

## 💡 Roadmap

- [ ] Mobile app (React Native)
- [ ] Team collaboration features
- [ ] Advanced analytics (heatmaps, patterns)
- [ ] Integration with calendar apps
- [ ] Pomodoro technique variants
- [ ] Focus music integration
- [ ] Browser extension for distraction blocking

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [OpenAI](https://openai.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

**Focus Guardian AI** - Ship more. Distract less. Execute relentlessly.
