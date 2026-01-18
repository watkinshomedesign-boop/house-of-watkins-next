create extension if not exists pgcrypto;

create table if not exists public.lead_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  first_name text,
  last_name text,
  email text not null,
  user_type text not null default 'homeowner',
  source text default 'lead_capture',
  page_path text,
  user_agent text,
  ip text
);

alter table public.lead_signups enable row level security;

revoke all on table public.lead_signups from anon, authenticated;
grant insert on table public.lead_signups to anon, authenticated;

drop policy if exists lead_signups_insert_public on public.lead_signups;

create policy lead_signups_insert_public
on public.lead_signups
for insert
to anon, authenticated
with check (true);
