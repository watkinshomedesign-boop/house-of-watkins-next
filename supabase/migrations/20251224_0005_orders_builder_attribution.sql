-- Orders: builder attribution fields

alter table public.orders add column if not exists builder_code text;
alter table public.orders add column if not exists builder_profile_id uuid;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'orders_builder_profile_id_fkey'
  ) THEN
    alter table public.orders
      add constraint orders_builder_profile_id_fkey
      foreign key (builder_profile_id) references public.builder_profiles(id);
  END IF;
END $$;
