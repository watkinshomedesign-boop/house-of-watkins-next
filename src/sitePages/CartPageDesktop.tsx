"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Breadcrumb } from "@/components/Breadcrumb";
import { PayPalExpressModal } from "@/components/checkout/PayPalExpressModal";
import { StripeExpressModal } from "@/components/checkout/StripeExpressModal";
import { useCart } from "@/lib/cart/CartContext";
import { cartToCheckoutItems } from "@/lib/cart/toCheckoutItems";
import { getStoredBuilderCode, normalizeBuilderCode, setStoredBuilderCode } from "@/lib/builderPromo/storage";
import { useFavorites } from "@/lib/favorites/useFavorites";

import { HouseGrid } from "@/sections/HouseGrid";
import type { Plan } from "@/lib/plans";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";

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

function formatUsdFromCents(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

function safePlanImage(plan: CatalogPlan | undefined | null) {
  const front = String(plan?.cardImages?.front ?? "").trim();
  const p = String(plan?.cardImages?.plan ?? "").trim();
  return front || p || "/placeholders/plan-hero.svg";
}

export function CartPageDesktop() {
  const cart = useCart();
  const fav = useFavorites();

  const [plans, setPlans] = useState<CatalogPlan[]>([]);
  const [plansLoaded, setPlansLoaded] = useState(false);

  const [builderCode, setBuilderCode] = useState("");
  const [promoValue, setPromoValue] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);

  const [stripeExpressOpen, setStripeExpressOpen] = useState(false);
  const [paypalExpressOpen, setPaypalExpressOpen] = useState(false);

  const [subtotal, setSubtotal] = useState("$ 0.00");
  const [total, setTotal] = useState("$ 0.00");
  const [lineTotals, setLineTotals] = useState<string[]>([]);

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
    const code = getStoredBuilderCode();
    setBuilderCode(code);
    setPromoValue(code);

    function onChange() {
      const next = getStoredBuilderCode();
      setBuilderCode(next);
      setPromoValue(next);
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

  async function applyPromoCode() {
    const code = normalizeBuilderCode(promoValue);
    if (!code) return;

    setPromoLoading(true);
    setPromoError(null);

    try {
      const res = await fetch("/api/builders/status", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        setPromoError(String(json?.error ?? "Failed to validate code"));
        return;
      }

      if (!json?.valid) {
        setPromoError("Code not found or inactive.");
        return;
      }

      setStoredBuilderCode(code);
      setBuilderCode(code);
    } catch (e: any) {
      setPromoError(String(e?.message ?? "Failed to validate code"));
    } finally {
      setPromoLoading(false);
    }
  }

  const favoritePlans = useMemo(() => {
    const slugs = fav.favorites;
    const inFavorites = plans.filter((p) => slugs.has(String(p.slug)));
    if (inFavorites.length >= 3) return inFavorites.slice(0, 3);

    const out = [...inFavorites];
    for (const p of plans) {
      if (out.length >= 3) break;
      if (slugs.has(String(p.slug))) continue;
      out.push(p);
    }
    return out;
  }, [fav.favorites, plans]);

  return (
    <main className="w-full bg-white text-zinc-800">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-14">
        <div className="pt-6 md:pt-4">
          <Breadcrumb currentLabel="Cart" currentHref="/cart" />
        </div>

        <div className="pb-20 md:pb-24">
          <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-[1fr_460px] md:gap-12">
            <section>
              <h1 className="text-[28px] font-semibold leading-[34px] text-neutral-900">Products</h1>

              {cart.items.length === 0 ? (
                <div className="mt-10 flex w-full items-center justify-center">
                  <div className="w-full max-w-[520px]">
                    <div className="flex justify-center">
                      <div className="rounded-[28px] bg-white px-6 py-10 text-center">
                        <div className="mx-auto flex h-[86px] w-[86px] items-center justify-center rounded-full border-2 border-orange-600">
                          <img src="/placeholders/icon-15.svg" alt="" className="h-8 w-8" aria-hidden="true" />
                        </div>
                        <div className="mt-4 text-[14px] font-semibold text-neutral-900">Your cart is empty</div>
                        <div className="mt-5">
                          <Link
                            href="/catalog"
                            className="inline-flex h-11 items-center justify-center rounded-full bg-orange-600 px-10 text-[13px] font-semibold uppercase tracking-wide text-white"
                          >
                            Choose house
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-8 divide-y divide-stone-200 rounded-[32px] bg-white">
                  {cart.items.map((it, idx) => {
                    const p = planBySlug.get(it.slug);
                    const img = safePlanImage(p);
                    const price = lineTotals[idx] ?? "";
                    const sqft = `${Number(it.heated_sqft ?? 0).toLocaleString()} Sq Ft`;

                    const addOns = Object.entries(it.addons ?? {})
                      .filter(([, v]) => Boolean(v))
                      .map(([k]) => k);

                    return (
                      <div key={it.slug} className="py-6">
                        <div className="flex gap-6">
                          <Link href={`/house/${it.slug}`} className="h-[110px] w-[160px] shrink-0 overflow-hidden rounded-[22px] bg-neutral-100">
                            <img src={img} alt="" className="h-full w-full object-cover" draggable={false} />
                          </Link>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-6">
                              <div className="min-w-0">
                                <div className="truncate text-[16px] font-semibold text-neutral-900">{it.name}</div>
                                <div className="mt-1 text-[12px] text-neutral-500">{sqft}</div>
                                <div className="mt-4 flex flex-wrap gap-8 text-[12px] text-neutral-500">
                                  <div>
                                    <div className="text-[11px] uppercase tracking-wide">Selected Plan</div>
                                    <div className="mt-1 font-semibold text-neutral-900">{it.license_type === "builder" ? "Builder" : "Single"}</div>
                                  </div>
                                  <div>
                                    <div className="text-[11px] uppercase tracking-wide">Options Add-On</div>
                                    <div className="mt-1 font-semibold text-neutral-900">{addOns.length > 0 ? addOns.join(", ") : "-"}</div>
                                  </div>
                                </div>
                              </div>

                              <div className="shrink-0 text-[14px] font-semibold text-orange-600">{price}</div>
                            </div>

                            <div className="mt-5 flex items-center justify-end gap-3">
                              <button
                                type="button"
                                aria-label="Remove"
                                onClick={() => cart.removeItem(it.slug)}
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white"
                              >
                                <img src="/placeholders/icon-15.svg" alt="" className="h-4 w-4" aria-hidden="true" />
                              </button>
                              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white">
                                <FavoriteButton planSlug={it.slug} layout="inline" className="h-6 w-6" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <aside>
              <h2 className="text-[28px] font-semibold leading-[34px] text-neutral-900">Summary</h2>

              <div className="mt-6 rounded-[32px] bg-[#F7F3EE] p-8">
                <div className="space-y-4 text-[13px]">
                  <div className="flex items-center justify-between text-neutral-900">
                    <div>Subtotal</div>
                    <div className="font-semibold">{subtotal}</div>
                  </div>
                  <div className="flex items-center justify-between text-neutral-900">
                    <div>Total</div>
                    <div className="text-[16px] font-semibold">{total}</div>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href="/ordering"
                    className="flex h-14 w-full items-center justify-center rounded-full bg-orange-600 text-[13px] font-semibold uppercase tracking-[0.15px] text-white"
                  >
                    Checkout
                  </Link>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaypalExpressOpen(true)}
                    className="h-12 rounded-full border border-stone-200 bg-white text-[13px] font-semibold"
                  >
                    PayPal
                  </button>
                  <button
                    type="button"
                    onClick={() => setStripeExpressOpen(true)}
                    className="h-12 rounded-full border border-stone-200 bg-white text-[13px] font-semibold"
                  >
                    stripe
                  </button>
                </div>

                <div className="mt-6">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Enter your discount code"
                      value={promoValue}
                      onChange={(e) => setPromoValue(e.target.value)}
                      className="h-12 w-full rounded-full border border-stone-200 bg-white px-5 text-[13px] outline-none"
                      autoCapitalize="characters"
                    />
                    <button
                      type="button"
                      onClick={applyPromoCode}
                      disabled={promoLoading || normalizeBuilderCode(promoValue).length === 0}
                      className="h-12 shrink-0 rounded-full bg-[#FDEFE6] px-6 text-[12px] font-semibold uppercase tracking-wide text-orange-600 disabled:opacity-50"
                    >
                      {promoLoading ? "Applying…" : "Apply code"}
                    </button>
                  </div>
                  {promoError ? <div className="mt-2 text-xs text-red-600">{promoError}</div> : null}
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-20">
            <div className="text-[28px] font-semibold leading-[34px] text-neutral-900">Favourites</div>

            {plansLoaded && favoritePlans.length > 0 ? (
              <div className="mt-8">
                <HouseGrid plans={favoritePlans as unknown as Plan[]} desktopCols={3} />
              </div>
            ) : (
              <div className="mt-8" />
            )}
          </div>
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
    </main>
  );
}
