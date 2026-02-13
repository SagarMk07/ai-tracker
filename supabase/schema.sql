-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS
create table public.users (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  focus_integrity_score integer default 100,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.users enable row level security;
create policy "Users can view own data" on public.users for select using (auth.uid() = id);
create policy "Users can update own data" on public.users for update using (auth.uid() = id);

-- FOCUS SESSIONS
create table public.focus_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users not null,
  intent text not null,
  duration_seconds integer not null,
  completed boolean default false,
  started_at timestamptz default timezone('utc'::text, now()) not null,
  ended_at timestamptz,
  distraction_count integer default 0,
  reflection_rating integer
);

alter table public.focus_sessions enable row level security;
create policy "Users can view own sessions" on public.focus_sessions for select using (auth.uid() = user_id);
create policy "Users can insert own sessions" on public.focus_sessions for insert with check (auth.uid() = user_id);
create policy "Users can update own sessions" on public.focus_sessions for update using (auth.uid() = user_id);

-- TASKS
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users not null,
  title text not null,
  description text,
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  status text check (status in ('todo', 'in_progress', 'done', 'wishlist')) default 'todo',
  created_at timestamptz default timezone('utc'::text, now()) not null,
  due_date timestamptz
);

alter table public.tasks enable row level security;
create policy "Users can view own tasks" on public.tasks for select using (auth.uid() = user_id);
create policy "Users can insert own tasks" on public.tasks for insert with check (auth.uid() = user_id);
create policy "Users can update own tasks" on public.tasks for update using (auth.uid() = user_id);
create policy "Users can delete own tasks" on public.tasks for delete using (auth.uid() = user_id);

-- BEHAVIOR PATTERNS
create table public.behavior_patterns (
  user_id uuid references public.users not null primary key,
  best_focus_time text, -- e.g., "morning", "after_10am"
  avg_session_length integer,
  total_focus_minutes integer default 0,
  updated_at timestamptz default timezone('utc'::text, now())
);

alter table public.behavior_patterns enable row level security;
create policy "Users can view own patterns" on public.behavior_patterns for select using (auth.uid() = user_id);
create policy "Users can insert own patterns" on public.behavior_patterns for insert with check (auth.uid() = user_id);

-- AI CONVERSATIONS (Simple store for now)
create table public.ai_conversations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users not null,
  messages jsonb not null,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.ai_conversations enable row level security;
create policy "Users can view own conversations" on public.ai_conversations for select using (auth.uid() = user_id);
create policy "Users can insert own conversations" on public.ai_conversations for insert with check (auth.uid() = user_id);

-- TRIGGERS
-- Auto-create public.users record on signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
