"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { PayPalExpressModal } from "@/components/checkout/PayPalExpressModal";
import { StripeExpressModal } from "@/components/checkout/StripeExpressModal";
import { useCart } from "@/lib/cart/CartContext";
import { cartToCheckoutItems } from "@/lib/cart/toCheckoutItems";
import { getStoredBuilderCode } from "@/lib/builderPromo/storage";
import { useFavorites } from "@/lib/favorites/useFavorites";

import { ProductCard } from "@/sections/ProductGrid/components/ProductCard";
import { PromoCode } from "@/sections/CartSection/components/PromoCode";
import { MobileFooter } from "@/sitePages/home/mobile/MobileFooter";

import iconCart from "../../assets/Final small icon images black svg/Icon shopping cart-black.svg";

type CatalogPlan = {
  id: string;
  slug: string;
  name: string;
  heated_sqft: number;
  beds: number | null;
  baths: number | null;
  stories: number | null;
  garage_bays: number | null;
  cardImages?: { front?: string; plan?: string };
};

function imgSrc(mod: unknown): string {
  return (mod as any)?.src ?? (mod as any);
}

function formatUsdFromCents(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

function startingPriceUsd(heatedSqft: number) {
  const price = 1250 + 0.65 * heatedSqft;
  return `$${Math.round(price).toLocaleString()}`;
}

function safePlanImage(plan: CatalogPlan | undefined | null) {
  const front = String(plan?.cardImages?.front ?? "").trim();
  const p = String(plan?.cardImages?.plan ?? "").trim();
  return front || p || "/placeholders/plan-hero.svg";
}

function MobileCartHeader() {
  return (
    <header className="w-full bg-white">
      <div className="flex h-[58px] items-center justify-between px-4">
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/brand/Logo%20Images/House-of-Watkins-Logo-black.png"
            alt="House of Watkins"
            width={180}
            height={22}
            className="h-[22px] w-auto"
            priority
          />
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-600"
            aria-label="Cart"
          >
            <Image
              src={imgSrc(iconCart)}
              alt=""
              aria-hidden="true"
              width={18}
              height={18}
              className="h-[18px] w-[18px]"
              draggable={false}
            />
          </Link>

          <button
            type="button"
            aria-label="Menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-600"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-[18px] w-[18px] text-zinc-900"
              aria-hidden="true"
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export function CartPageMobile() {
  const cart = useCart();
  const fav = useFavorites();

  const [plans, setPlans] = useState<CatalogPlan[]>([]);
  const [plansLoaded, setPlansLoaded] = useState(false);

  const [builderCode, setBuilderCode] = useState("");
  const [subtotal, setSubtotal] = useState("$ 0.00");
  const [total, setTotal] = useState("$ 0.00");
  const [lineTotals, setLineTotals] = useState<string[]>([]);

  const [stripeExpressOpen, setStripeExpressOpen] = useState(false);
  const [paypalExpressOpen, setPaypalExpressOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    setPlansLoaded(false);

    fetch("/api/catalog/plans")
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j?.error || "Failed to load plans");
        return j;
      })
      .then((j) => {
        if (!mounted) return;
        setPlans((j?.plans ?? []) as CatalogPlan[]);
      })
      .catch(() => {
        if (!mounted) return;
        setPlans([]);
      })
      .finally(() => {
        if (!mounted) return;
        setPlansLoaded(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const planBySlug = useMemo(() => {
    const m = new Map<string, CatalogPlan>();
    for (const p of plans) m.set(String(p.slug), p);
    return m;
  }, [plans]);

  useEffect(() => {
    setBuilderCode(getStoredBuilderCode());

    function onChange() {
      setBuilderCode(getStoredBuilderCode());
    }

    window.addEventListener("moss_builder_code_changed", onChange);
    return () => window.removeEventListener("moss_builder_code_changed", onChange);
  }, []);

  const quoteItems = useMemo(() => cartToCheckoutItems(cart.items), [cart.items]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (quoteItems.length === 0) {
        setSubtotal("$ 0.00");
        setTotal("$ 0.00");
        setLineTotals([]);
        return;
      }

      try {
        const res = await fetch("/api/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: quoteItems, builderCode }),
        });
        const data = (await res.json()) as any;
        if (cancelled) return;

        setSubtotal(String(data?.formatted?.subtotal ?? "$ 0.00"));
        setTotal(String(data?.formatted?.total ?? "$ 0.00"));

        const itemsAny = Array.isArray(data?.items) ? data.items : [];
        const totals = itemsAny.map((it: any) => formatUsdFromCents(Number(it?.lineTotalCents ?? 0)));
        setLineTotals(totals);
      } catch {
        if (cancelled) return;
        setSubtotal("$ 0.00");
        setTotal("$ 0.00");
        setLineTotals([]);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [quoteItems, builderCode]);

  const favoritePlans = useMemo(() => {
    const slugs = fav.favorites;
    const out: CatalogPlan[] = [];
    for (const p of plans) {
      if (slugs.has(String(p.slug))) out.push(p);
    }
    return out;
  }, [fav.favorites, plans]);

  return (
    <div className="bg-white text-zinc-800 font-gilroy">
      <MobileCartHeader />

      <div className="px-4 pb-10">
        <div className="pt-2 text-[12px] text-neutral-500">
          <Link href="/" className="text-orange-600">
            Main
          </Link>
          <span className="px-2 text-neutral-400">/</span>
          <Link href="/cart" className="text-neutral-700">
            Cart
          </Link>
        </div>

        <section className="mt-4">
          <div className="text-[20px] font-semibold text-neutral-900">Products</div>

          {cart.items.length === 0 ? (
            <div className="mt-4 rounded-[22px] bg-white px-4 py-10">
              <div className="mx-auto flex h-[86px] w-[86px] items-center justify-center rounded-full border-2 border-orange-600 bg-white">
                <img src="/placeholders/icon-15.svg" alt="" className="h-8 w-8" aria-hidden="true" />
              </div>
              <div className="mt-4 text-center text-[14px] font-semibold text-neutral-900">Your cart is empty</div>
              <div className="mt-4 flex justify-center">
                <Link
                  href="/catalog"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-orange-600 px-10 text-[13px] font-semibold uppercase tracking-wide text-white"
                >
                  Choose house
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-4">
              {cart.items.map((it, idx) => {
                const p = planBySlug.get(it.slug);
                const img = safePlanImage(p);
                const price = lineTotals[idx] ?? "";
                const sqft = `${Number(it.heated_sqft ?? 0).toLocaleString()} Sq Ft`;

                const addOns = Object.entries(it.addons ?? {})
                  .filter(([, v]) => Boolean(v))
                  .map(([k]) => k);

                return (
                  <div key={it.slug} className="overflow-hidden rounded-[22px] bg-stone-50 p-3">
                    <div className="flex gap-3">
                      <Link href={`/house/${it.slug}`} className="h-[76px] w-[110px] shrink-0 overflow-hidden rounded-[16px] bg-neutral-100">
                        <img src={img} alt="" className="h-full w-full object-cover" draggable={false} />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link href={`/house/${it.slug}`} className="block truncate text-[14px] font-semibold text-neutral-900">
                              {it.name}
                            </Link>
                            <div className="mt-1 text-[12px] text-neutral-500">{sqft}</div>
                          </div>
                          <div className="shrink-0 text-[13px] font-semibold text-orange-600">{price}</div>
                        </div>

                        <div className="mt-2 text-[12px] text-neutral-500">
                          <div>License: {it.license_type}</div>
                          {it.paper_sets > 0 ? <div>Paper sets: {it.paper_sets}</div> : null}
                          {it.rush ? <div>Rush service</div> : null}
                          {addOns.length > 0 ? <div className="truncate">Add-ons: {addOns.join(", ")}</div> : null}
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="text-[12px] text-neutral-500">Qty</div>
                            <input
                              className="h-9 w-20 rounded-full border border-stone-200 bg-white px-3 text-[12px]"
                              type="number"
                              min={1}
                              value={it.qty}
                              onChange={(e) =>
                                cart.updateItem(it.slug, { qty: Math.max(1, parseInt(e.target.value || "1", 10)) })
                              }
                            />
                          </div>

                          <button
                            type="button"
                            aria-label="Remove"
                            onClick={() => cart.removeItem(it.slug)}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white"
                          >
                            <img src="/placeholders/icon-15.svg" alt="" className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {cart.items.length > 0 ? (
          <section className="mt-8">
            <div className="text-[20px] font-semibold text-neutral-900">Summary</div>

            <div className="mt-4 rounded-[22px] bg-stone-50 p-4">
              <div className="space-y-3 text-[13px]">
                <div className="flex items-center justify-between">
                  <div className="text-neutral-600">Subtotal</div>
                  <div className="font-semibold text-neutral-900">{subtotal}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-neutral-600">Total</div>
                  <div className="font-semibold text-neutral-900">{total}</div>
                </div>
              </div>

              <div className="mt-4">
                <Link
                  href="/ordering"
                  className="inline-flex h-11 w-full items-center justify-center rounded-full bg-orange-600 text-[13px] font-semibold uppercase tracking-wide text-white"
                >
                  Checkout
                </Link>
              </div>

              <div className="mt-3 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setPaypalExpressOpen(true)}
                  className="h-11 w-full rounded-full border border-stone-200 bg-white text-[13px] font-semibold"
                >
                  PayPal
                </button>
                <button
                  type="button"
                  onClick={() => setStripeExpressOpen(true)}
                  className="h-11 w-full rounded-full border border-stone-200 bg-white text-[13px] font-semibold"
                >
                  Stripe
                </button>
              </div>

              <div className="mt-4">
                <PromoCode />
              </div>
            </div>
          </section>
        ) : null}

        <section className="mt-8">
          <div className="text-[20px] font-semibold text-neutral-900">Favourites</div>

          {!plansLoaded ? (
            <div className="mt-4 text-[13px] text-neutral-500">Loading…</div>
          ) : favoritePlans.length === 0 ? (
            <div className="mt-4 rounded-[22px] border border-neutral-200 bg-white p-4 text-[13px] text-neutral-600">
              No favourites yet.
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-4">
              {favoritePlans.map((p) => {
                const price = startingPriceUsd(Number(p.heated_sqft ?? 0));
                const sqft = `${Number(p.heated_sqft ?? 0).toLocaleString()} Sq Ft`;
                const beds = p.beds == null ? "- Beds" : `${p.beds} Beds`;
                const baths = p.baths == null ? "- Bath" : `${p.baths} Bath`;
                const garages = p.garage_bays == null ? "- Garage" : `${p.garage_bays} Garage`;
                const stories = p.stories == null ? "- Stories" : `${p.stories} Stories`;

                return (
                  <ProductCard
                    key={p.slug}
                    href={`/house/${p.slug}`}
                    fullCardLink
                    planSlug={p.slug}
                    imageSrc={safePlanImage(p)}
                    title={p.name}
                    squareFeet={sqft}
                    price={price}
                    bedrooms={beds}
                    bathrooms={baths}
                    garages={garages}
                    stories={stories}
                  />
                );
              })}
            </div>
          )}
        </section>

        <div className="mt-10">
          <MobileFooter />
        </div>
      </div>

      <StripeExpressModal
        open={stripeExpressOpen}
        items={quoteItems}
        builderCode={builderCode}
        onClose={() => setStripeExpressOpen(false)}
      />

      <PayPalExpressModal
        open={paypalExpressOpen}
        items={quoteItems}
        builderCode={builderCode}
        onClose={() => setPaypalExpressOpen(false)}
      />
    </div>
  );
}

export default CartPageMobile;
