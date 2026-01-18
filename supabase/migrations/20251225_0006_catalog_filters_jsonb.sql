-- Phase: Catalog filters JSONB (admin-backed)

alter table public.plans
  add column if not exists filters jsonb not null default '{}'::jsonb;

create index if not exists plans_filters_gin_idx
  on public.plans
  using gin (filters);
