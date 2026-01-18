create extension if not exists pgcrypto;

-- 1) PLANS (extend existing)
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  heated_sqft int not null,
  beds int,
  baths numeric,
  stories int,
  garage_bays int,
  width_ft numeric,
  depth_ft numeric,
  images jsonb,
  tags text[],
  status text default 'published',
  created_at timestamptz default now()
);

alter table public.plans add column if not exists old_slugs text[] not null default '{}'::text[];
alter table public.plans add column if not exists updated_at timestamptz not null default now();

alter table public.plans alter column status set default 'draft';
alter table public.plans alter column tags set default '{}'::text[];


create index if not exists plans_status_idx on public.plans(status);
create index if not exists plans_slug_idx on public.plans(slug);
create index if not exists plans_tags_gin_idx on public.plans using gin(tags);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'set_plans_updated_at'
  ) then
    create trigger set_plans_updated_at
    before update on public.plans
    for each row
    execute procedure public.set_updated_at();
  end if;
end $$;

-- 2) PLAN MEDIA (normalized)
create table if not exists public.plan_media (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans(id) on delete cascade,
  kind text not null,
  file_path text not null,
  is_external boolean not null default false,
  alt text,
  caption text,
  sort_order int not null default 0,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists plan_media_plan_kind_sort_idx on public.plan_media(plan_id, kind, sort_order);

-- 3) PRICING SETTINGS (single-row config)
create table if not exists public.pricing_settings (
  id int generated always as identity primary key,
  base_price_cents int not null,
  per_heated_sqft_cents int not null,
  cad_addon_cents int not null,
  mirrored_addon_cents int not null,
  rush_percent int not null default 0,
  paper_plan_shipping_cents int not null default 5000,
  paper_set_price_cents int not null default 0,
  updated_at timestamptz not null default now()
);

insert into public.pricing_settings (
  base_price_cents,
  per_heated_sqft_cents,
  cad_addon_cents,
  mirrored_addon_cents,
  rush_percent,
  paper_plan_shipping_cents,
  paper_set_price_cents
)
select
  125000,
  65,
  75000,
  29500,
  15,
  5000,
  0
where not exists (select 1 from public.pricing_settings);

-- 4) PROMO CODES
create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  status text not null default 'active',
  discount_type text not null,
  discount_value int not null,
  applies_to text not null default 'order',
  starts_at timestamptz,
  ends_at timestamptz,
  max_redemptions int,
  redemptions_count int not null default 0,
  min_subtotal_cents int,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.promo_targets (
  promo_id uuid not null references public.promo_codes(id) on delete cascade,
  target_type text not null,
  target_value text not null,
  unique (promo_id, target_type, target_value)
);

-- 5) REDIRECTS
create table if not exists public.redirects (
  id uuid primary key default gen_random_uuid(),
  from_path text unique not null,
  to_path text not null,
  status_code int not null default 301,
  created_at timestamptz not null default now()
);

-- 6) EVENTS (analytics)
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  event_name text,
  path text,
  payload jsonb,
  created_at timestamptz default now()
);

alter table public.events add column if not exists user_id uuid;
alter table public.events add column if not exists session_id text;
alter table public.events add column if not exists plan_id uuid;
alter table public.events add column if not exists plan_slug text;
alter table public.events add column if not exists order_id uuid;
alter table public.events add column if not exists metadata jsonb not null default '{}'::jsonb;

update public.events set event_name = 'unknown' where event_name is null;
alter table public.events alter column event_name set not null;

create index if not exists events_name_created_idx on public.events(event_name, created_at);
create index if not exists events_plan_id_created_idx on public.events(plan_id, created_at);
create index if not exists events_plan_slug_created_idx on public.events(plan_slug, created_at);

-- 7) STATS VIEWS
create or replace view public.plan_stats_total as
select
  p.slug as plan_slug,
  coalesce(ev.views_count, 0)::bigint as views_count,
  coalesce(f.favorites_count, 0)::bigint as favorites_count,
  coalesce(pu.purchases_count, 0)::bigint as purchases_count
from public.plans p
left join (
  select plan_slug, count(*)::bigint as views_count
  from public.events
  where event_name = 'plan_view'
  group by plan_slug
) ev on ev.plan_slug = p.slug
left join (
  select plan_slug, count(*)::bigint as favorites_count
  from public.favorites
  group by plan_slug
) f on f.plan_slug = p.slug
left join (
  select oi.slug as plan_slug, count(*)::bigint as purchases_count
  from public.order_items oi
  join public.orders o on o.id = oi.order_id
  where o.status in ('paid','pdf_sent','print_queued','shipped','complete')
  group by oi.slug
) pu on pu.plan_slug = p.slug;

create or replace view public.plan_stats_30d as
select
  p.slug as plan_slug,
  coalesce(ev.views_count, 0)::bigint as views_count,
  coalesce(f.favorites_count, 0)::bigint as favorites_count,
  coalesce(pu.purchases_count, 0)::bigint as purchases_count
from public.plans p
left join (
  select plan_slug, count(*)::bigint as views_count
  from public.events
  where event_name = 'plan_view'
    and created_at >= now() - interval '30 days'
  group by plan_slug
) ev on ev.plan_slug = p.slug
left join (
  select plan_slug, count(*)::bigint as favorites_count
  from public.favorites
  where created_at >= now() - interval '30 days'
  group by plan_slug
) f on f.plan_slug = p.slug
left join (
  select oi.slug as plan_slug, count(*)::bigint as purchases_count
  from public.order_items oi
  join public.orders o on o.id = oi.order_id
  where o.status in ('paid','pdf_sent','print_queued','shipped','complete')
    and o.created_at >= now() - interval '30 days'
  group by oi.slug
) pu on pu.plan_slug = p.slug;

revoke all on public.plan_stats_total from anon, authenticated;
revoke all on public.plan_stats_30d from anon, authenticated;
grant select on public.plan_stats_total to service_role;
grant select on public.plan_stats_30d to service_role;

-- 8) RLS + privileges
alter table public.plan_media enable row level security;
alter table public.pricing_settings enable row level security;
alter table public.promo_codes enable row level security;
alter table public.promo_targets enable row level security;
alter table public.redirects enable row level security;
alter table public.events enable row level security;

-- Lock down plans writes explicitly (RLS still gates visibility)
revoke all on table public.plans from anon, authenticated;
grant select on table public.plans to anon, authenticated;
grant select, insert, update, delete on table public.plans to service_role;

revoke all on table public.plan_media from anon, authenticated;
revoke all on table public.pricing_settings from anon, authenticated;
revoke all on table public.promo_codes from anon, authenticated;
revoke all on table public.promo_targets from anon, authenticated;
revoke all on table public.redirects from anon, authenticated;
revoke all on table public.events from anon, authenticated;

grant select on table public.plan_media to anon, authenticated;
grant insert on table public.events to anon, authenticated;

drop policy if exists plan_media_public_select_published on public.plan_media;
create policy plan_media_public_select_published
on public.plan_media
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.plans p
    where p.id = plan_media.plan_id
      and p.status = 'published'
  )
);

drop policy if exists events_insert_anon_session on public.events;
create policy events_insert_anon_session
on public.events
for insert
to anon
with check (
  session_id is not null
  and event_name in ('plan_view','add_to_cart')
);

drop policy if exists events_insert_auth on public.events;
create policy events_insert_auth
on public.events
for insert
to authenticated
with check (
  (user_id is null or user_id = auth.uid())
);

revoke all on table public.pricing_settings from anon, authenticated;
revoke all on table public.promo_codes from anon, authenticated;
revoke all on table public.promo_targets from anon, authenticated;
revoke all on table public.redirects from anon, authenticated;

grant select, insert, update, delete on table public.plan_media to service_role;
grant select, insert, update, delete on table public.pricing_settings to service_role;
grant select, insert, update, delete on table public.promo_codes to service_role;
grant select, insert, update, delete on table public.promo_targets to service_role;
grant select, insert, update, delete on table public.redirects to service_role;
grant select, insert, update, delete on table public.events to service_role;
