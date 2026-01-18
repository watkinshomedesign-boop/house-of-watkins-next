alter table public.redirects
  add column if not exists disabled boolean not null default false,
  add column if not exists is_auto boolean not null default false;

create index if not exists redirects_disabled_idx on public.redirects(disabled);
create index if not exists redirects_is_auto_idx on public.redirects(is_auto);
