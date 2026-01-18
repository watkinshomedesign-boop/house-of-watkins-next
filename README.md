# Moss House Plans (Next.js)

## Routing note

This project uses the **Next.js App Router** (`/app`). Do not create a `src/pages` directory: Next.js will treat it as a Pages Router and may introduce unintended routes.

Page components for App Router routes live in `src/sitePages` and are rendered by route files under `app/(site)`.

## Environment Variables

Required:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `ADMIN_EMAIL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`

Optional:

- `NEXT_PUBLIC_SITE_URL` (defaults to `http://localhost:3000`)

## Supabase Setup

1. Create a new Supabase project.
2. In Supabase SQL Editor, run the migration(s) in `supabase/migrations/`.

Current migration:

- `supabase/migrations/20251221_0144_init_plans_orders.sql`
- `supabase/migrations/202512241905_phaseA_admin_foundation.sql`

## Supabase Storage Buckets

Create these buckets in the Supabase dashboard:

- **site-assets** (public)
- **plan-assets** (public)
- **private-uploads** (private)

Recommended path conventions:

- `plan-assets/plans/<plan-slug>/thumbs/...`
- `plan-assets/plans/<plan-slug>/gallery/...`
- `plan-assets/plans/<plan-slug>/floorplans/...`
- `site-assets/brand/...`
- `site-assets/icons/...`

## Admin Panel (Phase A)

Visit `/admin` and log in with the Supabase auth user whose email matches `ADMIN_EMAIL`.

Tabs:

- **Plans**: list/publish/edit (slug edits create a redirect record)
- **Media**: add/delete `plan_media` rows (upload binaries via Supabase UI for now, then paste `file_path`)
- **Pricing**: edit `pricing_settings` (server-side quote uses it with fallbacks)
- **Promos**: create basic promo codes (validation via `/api/admin/promos/validate`)
- **Analytics**: view plan stats (30d/total)

## Seed Plans

`src/data/plans.seed.json` is the seed source of truth.

Run:

```bash
npm install
npm run seed:plans
```

Or directly:

```bash
node --loader tsx scripts/seedPlans.ts
```

## Stripe Setup

- Create a Stripe account and set `STRIPE_SECRET_KEY`.
- Create a webhook endpoint pointing to:

`/api/webhook/stripe`

- Set the webhook signing secret as `STRIPE_WEBHOOK_SECRET`.

## Local Dev

```bash
npm install
npm run dev
```

## Preview / Draft Mode (Sanity)

Set these env vars:

- `PREVIEW_SECRET` (server-only; used by `/api/preview`)
- `NEXT_PUBLIC_PREVIEW_SECRET` (used by Sanity Studio preview pane)
- `NEXT_PUBLIC_SITE_URL` (optional; recommended in production if Studio is hosted separately)
- `SANITY_API_READ_TOKEN` (server-only; required to read drafts in preview)

How to use:

- Go to `/studio`
- Open a singleton page (e.g. About)
- Click the **Preview** tab

To exit preview:

- Use the **Exit Preview** link in the Preview tab, or visit `/api/exit-preview`

Verification:

```bash
npm run verify:preview
```
