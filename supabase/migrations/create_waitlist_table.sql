-- Create waitlist table
create table if not exists public.waitlist (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.waitlist enable row level security;

-- Allow anyone (public/anon) to insert into waitlist
create policy "Enable insert for public" 
on public.waitlist 
for insert 
with check (true);

-- Allow service role (dashboard) to read waitlist
create policy "Enable read for service role only" 
on public.waitlist 
for select 
using (auth.role() = 'service_role');
