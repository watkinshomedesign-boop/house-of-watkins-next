-- Enable UUID generation
create extension if not exists pgcrypto;

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

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  email text not null,
  phone text,
  billing_address jsonb,
  shipping_address jsonb,
  shipping_required boolean default false,
  status text default 'pending',
  subtotal_cents int not null,
  shipping_cents int not null,
  total_cents int not null,
  currency text default 'usd',
  created_at timestamptz default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  plan_id uuid references public.plans(id),
  slug text not null,
  name text not null,
  heated_sqft_used int not null,
  license_type text not null,
  addons jsonb not null,
  rush boolean default false,
  paper_sets int default 0,
  unit_price_cents int not null,
  line_total_cents int not null
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  event_name text,
  path text,
  payload jsonb,
  created_at timestamptz default now()
);

-- RLS
alter table public.plans enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.events enable row level security;

-- Public read access for published plans only
create policy "public_read_published_plans" on public.plans
for select
to anon, authenticated
using (status = 'published');
