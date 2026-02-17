# Focus Guardian AI - Quick Start Guide

## 🚀 First-Time Setup

### 1. Database Setup
Run this SQL in your Supabase SQL Editor:
```bash
# Copy the contents of supabase/schema.sql
# Paste into Supabase SQL Editor
# Execute
```

### 2. Environment Check
Verify these variables in `.env.local`:
```env
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 3. Start Development
```bash
npm run dev
# Visit http://localhost:3000
```

## 📖 Feature Guide

### Creating Your First Focus Session

1. **Navigate to Dashboard** (`/dashboard`)
2. **Find "Create Focus Session" panel**
   - Enter your goal (e.g., "Write project proposal")
   - Select duration: 25m, 50m, or 90m
   - Add risk factors (optional): "email", "slack", "phone"
3. **Click "Start Session"**
   - AI generates your intention statement
   - Redirects to Immersive Mode (`/focus`)

### Using Immersive Mode

**Timer Controls:**
- Click the timer to **pause/resume**
- Timer persists if you refresh the page

**During Session:**
- Click "Log Distraction" when interrupted
- Click X (top-right) to abandon session

**After Completion:**
- Rate your focus (1-5 stars)
- Add optional reflection notes
- Click "Save Session" to finish

### Smart Task Breakdown

1. **Scroll to "Smart Task Intelligence"** on dashboard
2. **Enter a complex goal**
   - Example: "Launch new marketing campaign"
3. **Click "Break Down"**
   - AI analyzes difficulty (1-10)
   - Suggests time blocks with reasoning
   - Recommends optimal scheduling
4. **Click "Add to Plan"** to save

### Personality Modes

**Location:** Dashboard → "AI Coach Personality" panel

**Modes:**
- 🫶 **Flow State Guide** - Gentle, supportive coaching
- 🛡️ **Tactical Coach** - Balanced, strategy-focused
- ⚡ **Drill Sergeant** - Direct, no-nonsense accountability

**Effect:** Changes AI tone in:
- Intention statements
- Session reflections
- Weekly summaries
- Task breakdowns

### Weekly Performance Summary

1. **Find "AI Accountability Summary"** panel
2. **Click "Generate"**
3. **Review AI analysis:**
   - Overall performance summary
   - Priority recommendations
   - Risk alerts

## 🎯 Pro Tips

### Maximize Focus Sessions
- Start with 25-minute sessions if new to deep work
- Log distractions immediately (don't wait)
- Be honest in post-session reflections

### Task Breakdown Strategy
- Use for goals that feel overwhelming
- Review AI suggestions before starting
- Adjust time blocks based on your energy levels

### Personality Mode Selection
- **Soft** - When building new habits or recovering from burnout
- **Tactical** - For consistent, sustainable performance
- **Ruthless** - When facing tight deadlines or breaking procrastination

### Dashboard Metrics
- **Streak** - Counts consecutive days with completed sessions
- **Completion Rate** - % of started sessions you finish
- **Weekly Focus** - Total deep work hours (completed sessions only)

## 🔧 Troubleshooting

### Session Not Recovering After Refresh
- Check browser localStorage is enabled
- Clear cache and try creating a new session

### AI Not Generating Responses
- Verify `OPENAI_API_KEY` is set correctly
- Check API key has sufficient credits
- Review browser console for errors

### Dashboard Shows No Data
- Ensure you've completed at least one session
- Check Supabase RLS policies are applied
- Verify you're logged in with the correct account

## 📊 Understanding Analytics

### Distraction Frequency Chart
- Shows top 5 distraction types
- Helps identify patterns
- Use to adjust risk factors in future sessions

### Performance Trend
- 4-week trajectory
- Combines completion rate, focus hours, and streak
- Higher score = better consistency

### Weekly Focus Chart
- Bar chart of last 7 days
- Shows minutes per day
- Helps spot productive days vs. slumps

## 🎨 UI Shortcuts

- **Dashboard** - `/dashboard`
- **Immersive Mode** - `/focus` (or click "Immersive Mode" button)
- **Settings** - `/settings`
- **Create Session** - Dashboard → "Start Session" button

## 🚀 Next Steps

1. Complete your first 25-minute session
2. Try the task breakdown feature
3. Experiment with different personality modes
4. Generate your first weekly summary after 3-4 sessions
5. Review analytics to identify patterns
