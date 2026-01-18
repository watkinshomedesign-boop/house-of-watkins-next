-- Add plan-change add-ons pricing fields and persist plan-change description on orders

alter table public.pricing_settings
  add column if not exists site_plan_addon_cents int not null default 55000,
  add column if not exists small_adjustments_addon_cents int not null default 22500,
  add column if not exists minor_changes_addon_cents int not null default 37500,
  add column if not exists additions_addon_cents int not null default 47500;

alter table public.orders
  add column if not exists cart_snapshot jsonb not null default '[]'::jsonb,
  add column if not exists plan_change_description text;
