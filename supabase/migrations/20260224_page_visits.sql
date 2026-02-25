create table if not exists public.page_visits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  session_id text not null,
  path text not null,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  is_new_visitor boolean default true,
  user_agent text,
  ip text
);

create index if not exists idx_page_visits_created_at on public.page_visits (created_at);
create index if not exists idx_page_visits_session_id on public.page_visits (session_id);

alter table public.page_visits enable row level security;

revoke all on table public.page_visits from anon, authenticated;
grant insert on table public.page_visits to anon, authenticated;

drop policy if exists page_visits_insert_public on public.page_visits;

create policy page_visits_insert_public
on public.page_visits
for insert
to anon, authenticated
with check (true);
