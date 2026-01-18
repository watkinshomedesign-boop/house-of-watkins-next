create extension if not exists pgcrypto;

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  message text not null,
  source text default 'contact_page',
  page_path text,
  user_agent text,
  ip text
);

alter table public.contact_messages enable row level security;

-- Privileges: do not allow public SELECT/UPDATE/DELETE regardless of RLS
revoke all on table public.contact_messages from anon, authenticated;
grant insert on table public.contact_messages to anon, authenticated;

drop policy if exists contact_messages_insert_public on public.contact_messages;

create policy contact_messages_insert_public
on public.contact_messages
for insert
to anon, authenticated
with check (true);
