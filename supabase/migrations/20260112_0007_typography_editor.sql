create table if not exists public.typography_templates (
  template_key text primary key,
  label text not null,
  instances_count int,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.typography_pages (
  page_key text primary key,
  label text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'set_typography_templates_updated_at'
  ) then
    create trigger set_typography_templates_updated_at
    before update on public.typography_templates
    for each row
    execute procedure public.set_updated_at();
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'set_typography_pages_updated_at'
  ) then
    create trigger set_typography_pages_updated_at
    before update on public.typography_pages
    for each row
    execute procedure public.set_updated_at();
  end if;
end $$;

alter table public.typography_templates enable row level security;
alter table public.typography_pages enable row level security;

revoke all on table public.typography_templates from anon, authenticated;
revoke all on table public.typography_pages from anon, authenticated;

grant select on table public.typography_templates to anon, authenticated;
grant select on table public.typography_pages to anon, authenticated;

grant select, insert, update, delete on table public.typography_templates to service_role;
grant select, insert, update, delete on table public.typography_pages to service_role;

drop policy if exists typography_templates_public_select on public.typography_templates;
create policy typography_templates_public_select
on public.typography_templates
for select
to anon, authenticated
using (true);

drop policy if exists typography_pages_public_select on public.typography_pages;
create policy typography_pages_public_select
on public.typography_pages
for select
to anon, authenticated
using (true);
