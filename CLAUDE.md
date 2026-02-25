# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server on port 3001
npm run build      # Production build
npm run lint       # ESLint via Next.js
npm run start      # Start production server on port 3001

# Database / seeding
npm run seed:plans          # Seed house plans from src/data/plans.seed.json
npm run seed:portfolio      # Seed portfolio projects
npm run seed:plan-media     # Seed plan media metadata
npm run seed:typography     # Seed typography settings
npm run embeddings:plans    # Generate OpenAI embeddings for plan search
npm run diagnose:supabase   # Diagnose Supabase connection issues
npm run verify:preview      # Verify Sanity preview mode
```

No test framework is configured; there are no test commands.

## Architecture Overview

**What it is**: B2C e-commerce platform for selling house plans (project name: `moss-site`).

### App Router structure

```
app/
  (site)/           # Public-facing site (home, catalog, PDP, cart, checkout, blog, portfolio, legal)
  admin/
    (public)/       # Login, password reset
    (protected)/    # Dashboard, plans, orders, pricing, promos, analytics, leads, builders, etc.
  api/              # REST API routes (Stripe webhook, checkout, quote, admin ops, builders, leads)
  studio/           # Embedded Sanity Studio
  auth/             # Auth callback pages
  builder/          # Builder partner program pages
src/
  sitePages/        # Page-level React components (one per route)
  sections/         # Composable page sections (Hero, HouseGrid, CartSection, Footer, etc.)
  components/       # Reusable UI components
  adminComponents/  # Admin panel UI (forms, tables, rich-text editors)
  lib/              # Core utilities, data fetching, context providers
  config/           # Constants (commerce.ts for pricing, chat.ts)
  data/             # Static seed data (plans.seed.json)
supabase/
  migrations/       # SQL migration files (apply via Supabase CLI)
```

### Data layer

- **Supabase** — primary database (plans, orders, order_items, favorites, promo_codes, lead_signups, builders, pricing_settings, plan_redirects). Uses Row-Level Security throughout.
  - `src/lib/supabaseAdmin.ts` — service-role client (server only)
  - `src/lib/supabaseServer.ts` — SSR client (respects RLS)
  - `src/lib/supabaseBrowser.ts` — browser client
- **Sanity CMS** — content (blog, portfolio, homepage copy, typography, page sections)
  - `src/lib/sanity/` — client, server client, image helpers
- **Seed JSON** (`src/data/plans.seed.json`) — canonical plan definitions seeded into Supabase

### Commerce

- Pricing logic: `src/lib/pricing.ts` — base price + sqft multiplier + addons + rush fee
- Cart: `src/lib/cart/` — React Context with localStorage persistence
- Checkout: Stripe session creation at `/api/checkout`, webhook at `/api/webhook/stripe`
- Quotes: `src/lib/serverQuote.ts`
- Builder promo codes: `src/lib/builderPromo/`

### Key context providers

| Provider | Location | Purpose |
|---|---|---|
| `CartContext` | `src/lib/cart/` | Cart state + localStorage |
| `FavoritesProvider` | `src/lib/favorites/` | User favorites synced to Supabase |
| `PlansCacheProvider` | `src/lib/plans/` | Client-side plans cache |
| `TypographyContext` | `src/lib/` | Typography/text config from Sanity |
| `PDPState` | `src/lib/pdpState.tsx` | Product detail page state |

### External integrations

| Service | Env vars |
|---|---|
| Supabase | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| Stripe | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| Sanity | `SANITY_API_READ_TOKEN`, `NEXT_PUBLIC_PREVIEW_SECRET`, `PREVIEW_SECRET` |
| Shopify Admin API | `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_CLIENT_ID`, `SHOPIFY_CLIENT_SECRET` |
| Email (SMTP) | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`, `ADMIN_EMAIL` |
| HubSpot | `NEXT_PUBLIC_HUBSPOT_PORTAL_ID` |
| GA4 | `NEXT_PUBLIC_GA_MEASUREMENT_ID` |
| Meta Pixel | `NEXT_PUBLIC_META_PIXEL_ID` |
| Pinterest | `NEXT_PUBLIC_PINTEREST_TAG_ID` |
| OpenAI (embeddings) | `OPENAI_API_KEY` |

## Code Style

- **Tailwind only** — no separate CSS files or `<style>` tags for anything achievable with Tailwind classes
- **`cn()` / `clsx`** for conditional class logic, not inline ternaries
- **`const fn = () => {}`** over `function fn() {}`; add TypeScript types throughout
- Event handlers use the `handle` prefix (`handleClick`, `handleKeyDown`)
- Early returns preferred for readability
- Path alias: `@/*` resolves to `src/*`
- `tsx` is used to run scripts directly: `node --import tsx scripts/foo.ts`
