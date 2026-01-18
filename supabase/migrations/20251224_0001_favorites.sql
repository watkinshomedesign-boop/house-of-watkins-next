-- Favorites + profiles
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_slug text not null,
  created_at timestamptz default now(),
  unique (user_id, plan_slug)
);

alter table public.profiles enable row level security;
alter table public.favorites enable row level security;

-- Profiles: users can manage their own profile row
create policy "profiles_select_own" on public.profiles
for select to authenticated
using (id = auth.uid());

create policy "profiles_insert_own" on public.profiles
for insert to authenticated
with check (id = auth.uid());

create policy "profiles_update_own" on public.profiles
for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- Favorites: users can manage only their own favorites
create policy "favorites_select_own" on public.favorites
for select to authenticated
using (user_id = auth.uid());

create policy "favorites_insert_own" on public.favorites
for insert to authenticated
with check (user_id = auth.uid());

create policy "favorites_delete_own" on public.favorites
for delete to authenticated
using (user_id = auth.uid());
