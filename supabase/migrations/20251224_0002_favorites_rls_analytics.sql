-- Favorites hardening: normalize + minimal RLS + analytics view
-- Safe/idempotent: can be run multiple times.
-- NOTE: if you already have different column names, run the INSPECTION QUERIES first and adjust accordingly.

create extension if not exists pgcrypto;

-- 1) PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Ensure updated_at exists
alter table public.profiles add column if not exists updated_at timestamptz default now();

-- Keep RLS minimal and correct
alter table public.profiles enable row level security;

drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_insert_own on public.profiles;
drop policy if exists profiles_update_own on public.profiles;

create policy profiles_select_own
on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy profiles_insert_own
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

create policy profiles_update_own
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- Optional: auto-create profile row on signup (safe)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', null))
  on conflict (id) do update set
    name = excluded.name,
    updated_at = now();
  return new;
end;
$$;

-- Trigger may already exist; ensure it's present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE t.tgname = 'on_auth_user_created'
      AND n.nspname = 'auth'
      AND c.relname = 'users'
  ) THEN
    create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
  END IF;
END $$;


-- 2) FAVORITES
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_slug text not null,
  created_at timestamptz default now()
);

-- Ensure required columns exist (no-op if already present)
alter table public.favorites add column if not exists user_id uuid;
alter table public.favorites add column if not exists plan_slug text;
alter table public.favorites add column if not exists created_at timestamptz default now();

-- Ensure foreign key exists (create only if missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'favorites_user_id_fkey'
  ) THEN
    alter table public.favorites
      add constraint favorites_user_id_fkey
      foreign key (user_id) references auth.users(id) on delete cascade;
  END IF;
END $$;

-- Ensure uniqueness (user can only favorite a plan once)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'favorites_user_plan_unique'
  ) THEN
    alter table public.favorites
      add constraint favorites_user_plan_unique unique (user_id, plan_slug);
  END IF;
END $$;

-- Minimal RLS: read/insert/delete own only
alter table public.favorites enable row level security;

drop policy if exists favorites_select_own on public.favorites;
drop policy if exists favorites_insert_own on public.favorites;
drop policy if exists favorites_delete_own on public.favorites;

create policy favorites_select_own
on public.favorites
for select
to authenticated
using (user_id = auth.uid());

create policy favorites_insert_own
on public.favorites
for insert
to authenticated
with check (user_id = auth.uid());

create policy favorites_delete_own
on public.favorites
for delete
to authenticated
using (user_id = auth.uid());


-- 3) ADMIN ANALYTICS (server-side only)
-- View is safe; service role can query it. Do not grant to anon/authenticated.
create or replace view public.favorite_counts_by_plan as
select
  plan_slug,
  count(*)::bigint as favorites_count
from public.favorites
group by plan_slug
order by favorites_count desc;

revoke all on public.favorite_counts_by_plan from anon, authenticated;
grant select on public.favorite_counts_by_plan to service_role;
