-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS
create table public.users (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.users enable row level security;
create policy "Users can view own data" on public.users for select using (auth.uid() = id);
create policy "Users can update own data" on public.users for update using (auth.uid() = id);

-- AI TOOLS
create table public.tools (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users not null,
  name text not null,
  description text,
  category text,
  url text,
  pricing_type text check (pricing_type in ('free', 'freemium', 'paid', 'subscription')),
  created_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.tools enable row level security;
create policy "Users can view own tools" on public.tools for select using (auth.uid() = user_id);
create policy "Users can insert own tools" on public.tools for insert with check (auth.uid() = user_id);
create policy "Users can update own tools" on public.tools for update using (auth.uid() = user_id);
create policy "Users can delete own tools" on public.tools for delete using (auth.uid() = user_id);

-- WORKFLOWS
create table public.workflows (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users not null,
  name text not null,
  description text,
  trigger text,
  actions jsonb default '[]'::jsonb,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.workflows enable row level security;
create policy "Users can view own workflows" on public.workflows for select using (auth.uid() = user_id);
create policy "Users can insert own workflows" on public.workflows for insert with check (auth.uid() = user_id);
create policy "Users can update own workflows" on public.workflows for update using (auth.uid() = user_id);
create policy "Users can delete own workflows" on public.workflows for delete using (auth.uid() = user_id);

-- AI LOGS
create table public.ai_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users not null,
  prompt text not null,
  response text,
  tokens_used integer,
  model_used text,
  timestamp timestamptz default timezone('utc'::text, now()) not null
);

alter table public.ai_logs enable row level security;
create policy "Users can view own logs" on public.ai_logs for select using (auth.uid() = user_id);
create policy "Users can insert own logs" on public.ai_logs for insert with check (auth.uid() = user_id);

-- TRIGGERS
-- Auto-create public.users record on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to avoid errors on reapplying
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
