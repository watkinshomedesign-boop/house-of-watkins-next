create extension if not exists pgcrypto;

create table if not exists public.builder_profiles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  auth_user_id uuid null,
  first_name text not null,
  last_name text not null,
  email text not null unique,
  company text not null,
  role text not null,
  license_number text null,
  is_builder_verified boolean default false,
  attested_builder boolean default true,
  hubspot_sync_status text null
);

create table if not exists public.builder_discount_codes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  builder_profile_id uuid references public.builder_profiles(id) on delete cascade,
  code text not null unique,
  discount_percent int not null default 15,
  active boolean default true,
  usage_count int default 0,
  last_used_at timestamptz null,
  includes_builder_pack boolean default true,
  free_mirror boolean default true,
  cad_discount_percent int default 50,
  priority_support boolean default true
);

create table if not exists public.builder_code_redemptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  code text not null,
  builder_profile_id uuid null,
  email text null,
  plan_slug text null,
  order_id uuid null
);

create table if not exists public.builder_benefit_redemptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  code text not null,
  builder_profile_id uuid null,
  order_id uuid null,
  plan_slug text null,
  applied_mirror boolean default false,
  applied_cad_discount boolean default false,
  applied_priority_support boolean default false
);

alter table public.builder_profiles enable row level security;
alter table public.builder_discount_codes enable row level security;
alter table public.builder_code_redemptions enable row level security;
alter table public.builder_benefit_redemptions enable row level security;

-- Privileges: do not allow public SELECT/UPDATE/DELETE regardless of RLS
revoke all on table public.builder_profiles from anon, authenticated;
revoke all on table public.builder_discount_codes from anon, authenticated;
revoke all on table public.builder_code_redemptions from anon, authenticated;
revoke all on table public.builder_benefit_redemptions from anon, authenticated;

grant insert on table public.builder_profiles to anon, authenticated;
grant insert on table public.builder_code_redemptions to anon, authenticated;
grant insert on table public.builder_benefit_redemptions to anon, authenticated;

-- Builder self-read/update when linked to auth
grant select, update on table public.builder_profiles to authenticated;
grant select on table public.builder_discount_codes to authenticated;
grant select on table public.builder_code_redemptions to authenticated;
grant select on table public.builder_benefit_redemptions to authenticated;

drop policy if exists builder_profiles_public_insert on public.builder_profiles;
create policy builder_profiles_public_insert
on public.builder_profiles
for insert
to anon, authenticated
with check (true);

drop policy if exists builder_profiles_owner_select on public.builder_profiles;
create policy builder_profiles_owner_select
on public.builder_profiles
for select
to authenticated
using (auth_user_id = auth.uid());

drop policy if exists builder_profiles_owner_update on public.builder_profiles;
create policy builder_profiles_owner_update
on public.builder_profiles
for update
to authenticated
using (auth_user_id = auth.uid())
with check (auth_user_id = auth.uid());

-- Codes readable by owner (via join)
drop policy if exists builder_discount_codes_owner_select on public.builder_discount_codes;
create policy builder_discount_codes_owner_select
on public.builder_discount_codes
for select
to authenticated
using (
  exists (
    select 1
    from public.builder_profiles bp
    where bp.id = builder_discount_codes.builder_profile_id
      and bp.auth_user_id = auth.uid()
  )
);

-- Redemption rows readable by owner
drop policy if exists builder_code_redemptions_owner_select on public.builder_code_redemptions;
create policy builder_code_redemptions_owner_select
on public.builder_code_redemptions
for select
to authenticated
using (
  exists (
    select 1
    from public.builder_profiles bp
    where bp.id = builder_code_redemptions.builder_profile_id
      and bp.auth_user_id = auth.uid()
  )
);

drop policy if exists builder_benefit_redemptions_owner_select on public.builder_benefit_redemptions;
create policy builder_benefit_redemptions_owner_select
on public.builder_benefit_redemptions
for select
to authenticated
using (
  exists (
    select 1
    from public.builder_profiles bp
    where bp.id = builder_benefit_redemptions.builder_profile_id
      and bp.auth_user_id = auth.uid()
  )
);

-- Public insert policies for redemption tracking
drop policy if exists builder_code_redemptions_public_insert on public.builder_code_redemptions;
create policy builder_code_redemptions_public_insert
on public.builder_code_redemptions
for insert
to anon, authenticated
with check (true);

drop policy if exists builder_benefit_redemptions_public_insert on public.builder_benefit_redemptions;
create policy builder_benefit_redemptions_public_insert
on public.builder_benefit_redemptions
for insert
to anon, authenticated
with check (true);

-- Views (admin/service role use)
create or replace view public.builder_code_usage as
select
  c.code,
  bp.id as builder_profile_id,
  bp.first_name,
  bp.last_name,
  bp.email,
  bp.company,
  bp.role,
  c.usage_count,
  c.last_used_at,
  c.discount_percent,
  c.includes_builder_pack,
  c.free_mirror,
  c.cad_discount_percent,
  c.priority_support
from public.builder_discount_codes c
join public.builder_profiles bp on bp.id = c.builder_profile_id;

create or replace view public.top_builder_codes as
select *
from public.builder_code_usage
order by usage_count desc nulls last, last_used_at desc nulls last;

create or replace view public.builder_pack_usage as
select
  br.builder_profile_id,
  bp.email,
  bp.company,
  bp.first_name,
  bp.last_name,
  count(*)::int as total_benefit_redemptions,
  sum(case when br.applied_mirror then 1 else 0 end)::int as mirror_freebies_granted,
  sum(case when br.applied_cad_discount then 1 else 0 end)::int as cad_discounts_applied,
  sum(case when br.applied_priority_support then 1 else 0 end)::int as priority_support_redemptions,
  max(br.created_at) as last_benefit_redeemed_at
from public.builder_benefit_redemptions br
left join public.builder_profiles bp on bp.id = br.builder_profile_id
group by br.builder_profile_id, bp.email, bp.company, bp.first_name, bp.last_name;

create or replace view public.top_builder_partners as
select
  u.builder_profile_id,
  u.email,
  u.company,
  u.first_name,
  u.last_name,
  coalesce(c.usage_count, 0)::int as usage_count,
  coalesce(u.total_benefit_redemptions, 0)::int as total_benefit_redemptions,
  coalesce(u.mirror_freebies_granted, 0)::int as mirror_freebies_granted,
  coalesce(u.cad_discounts_applied, 0)::int as cad_discounts_applied,
  coalesce(u.priority_support_redemptions, 0)::int as priority_support_redemptions,
  greatest(c.last_used_at, u.last_benefit_redeemed_at) as last_activity_at
from public.builder_pack_usage u
left join public.builder_code_usage c on c.builder_profile_id = u.builder_profile_id
order by usage_count desc nulls last, total_benefit_redemptions desc nulls last;
