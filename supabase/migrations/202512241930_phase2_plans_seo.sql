-- Phase 2: Plans SEO fields (additive)

alter table public.plans
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists og_media_id uuid;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'plans_og_media_id_fkey'
  ) then
    alter table public.plans
      add constraint plans_og_media_id_fkey
      foreign key (og_media_id)
      references public.plan_media(id)
      on delete set null;
  end if;
end $$;

create index if not exists plans_og_media_id_idx on public.plans(og_media_id);
