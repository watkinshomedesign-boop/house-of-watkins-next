"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Breadcrumb } from "@/components/Breadcrumb";
import { EmptyCart } from "@/sections/CartSection/components/EmptyCart";
import { useCart } from "@/lib/cart/CartContext";
import { cartToCheckoutItems } from "@/lib/cart/toCheckoutItems";
import { getStoredBuilderCode } from "@/lib/builderPromo/storage";
import { useFavorites } from "@/lib/favorites/useFavorites";
import { usePlansCache, type CachedPlan } from "@/lib/plans/PlansCache";

import { HouseGrid } from "@/sections/HouseGrid";
import type { Plan } from "@/lib/plans";

function formatUsdFromCents(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export const Main = () => {
  const cart = useCart();
  const fav = useFavorites();

  const { plans: cachedPlans, loading: plansLoading } = usePlansCache();
  const plans = cachedPlans as CachedPlan[];
  const plansLoaded = !plansLoading;

  const [builderCode, setBuilderCode] = useState("");
  const [quoteSubtotal, setQuoteSubtotal] = useState("$ 0.00");
  const [quoteTotal, setQuoteTotal] = useState("$ 0.00");
  const [quoteItemsExpanded, setQuoteItemsExpanded] = useState<
    Array<{ name: string; qty: number; rows: Array<{ label: string; amount: string }> }>
  >([]);

  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "stripe">("card");
  const [agreeTerms, setAgreeTerms] = useState(false);

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
        setQuoteSubtotal("$ 0.00");
        setQuoteTotal("$ 0.00");
        setQuoteItemsExpanded([]);
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

        setQuoteSubtotal(String(data?.formatted?.subtotal ?? "$ 0.00"));
        setQuoteTotal(String(data?.formatted?.total ?? "$ 0.00"));

        const itemsAny = Array.isArray(data?.items) ? data.items : [];
        const expanded = itemsAny.map((it: any) => {
          const qty = Math.max(1, Number(it?.qty ?? 1) || 1);
          const lineItems = Array.isArray(it?.lineItems) ? it.lineItems : [];
          return {
            name: String(it?.name ?? ""),
            qty,
            rows: lineItems.map((li: any) => ({
              label: String(li?.label ?? ""),
              amount: formatUsdFromCents(Number(li?.amountCents ?? 0) * qty),
            })),
          };
        });
        setQuoteItemsExpanded(expanded);
      } catch {
        if (cancelled) return;
        setQuoteSubtotal("$ 0.00");
        setQuoteTotal("$ 0.00");
        setQuoteItemsExpanded([]);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [quoteItems, builderCode]);

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

  const cardExpanded = paymentMethod === "card";

  return (
    <main className="w-full bg-[#FAF9F7] text-zinc-800">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-14">
        <div className="pt-6 md:pt-4">
          <Breadcrumb currentLabel="Cart" currentHref="/cart" />
        </div>

        {cart.items.length === 0 ? (
          <div className="pb-20 md:pb-24">
            <div className="mt-6 text-[28px] font-semibold leading-[34px] text-neutral-900">Products</div>

            <div className="mt-10 flex w-full items-center justify-center">
              <div className="w-full max-w-[520px]">
                <div className="flex justify-center">
                  <EmptyCart />
                </div>
              </div>
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
        ) : (
          <div className="pb-20 md:pb-24">
            <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-[1fr_460px] md:gap-12">
              <section>
                <h1 className="text-[28px] font-semibold leading-[34px] text-neutral-900">Billing Details</h1>

                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                  <label className="block">
                    <div className="text-[12px] font-semibold text-neutral-900">
                      Email address <span className="text-red-500">*</span>
                    </div>
                    <input
                      type="email"
                      placeholder="example@mail.com"
                      className="mt-2 h-11 w-full rounded-full border border-stone-200 bg-white px-5 text-[13px] outline-none"
                    />
                  </label>

                  <label className="block">
                    <div className="text-[12px] font-semibold text-neutral-900">
                      Phone <span className="text-red-500">*</span>
                    </div>
                    <input
                      type="tel"
                      placeholder="+1 Phone number"
                      className="mt-2 h-11 w-full rounded-full border border-stone-200 bg-white px-5 text-[13px] outline-none"
                    />
                  </label>

                  <label className="block">
                    <div className="text-[12px] font-semibold text-neutral-900">
                      First name <span className="text-red-500">*</span>
                    </div>
                    <input
                      type="text"
                      placeholder="John"
                      className="mt-2 h-11 w-full rounded-full border border-stone-200 bg-white px-5 text-[13px] outline-none"
                    />
                  </label>

                  <label className="block">
                    <div className="text-[12px] font-semibold text-neutral-900">
                      Last name <span className="text-red-500">*</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Smith"
                      className="mt-2 h-11 w-full rounded-full border border-stone-200 bg-white px-5 text-[13px] outline-none"
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <div className="text-[12px] font-semibold text-neutral-900">Company name (optional)</div>
                    <input
                      type="text"
                      placeholder="Enter the name of your company"
                      className="mt-2 h-11 w-full rounded-full border border-stone-200 bg-white px-5 text-[13px] outline-none"
                    />
                  </label>

                  <label className="block">
                    <div className="text-[12px] font-semibold text-neutral-900">
                      Country/Region <span className="text-red-500">*</span>
                    </div>
                    <select className="mt-2 h-11 w-full rounded-full border border-stone-200 bg-white px-5 text-[13px] outline-none">
                      <option value="">Select country</option>
                    </select>
                  </label>

                  <label className="block">
                    <div className="text-[12px] font-semibold text-neutral-900">
                      State <span className="text-red-500">*</span>
                    </div>
                    <select className="mt-2 h-11 w-full rounded-full border border-stone-200 bg-white px-5 text-[13px] outline-none">
                      <option value="">Select state</option>
                    </select>
                  </label>

                  <label className="block">
                    <div className="text-[12px] font-semibold text-neutral-900">
                      Town/City <span className="text-red-500">*</span>
                    </div>
                    <select className="mt-2 h-11 w-full rounded-full border border-stone-200 bg-white px-5 text-[13px] outline-none">
                      <option value="">Select town or city</option>
                    </select>
                  </label>

                  <label className="block">
                    <div className="text-[12px] font-semibold text-neutral-900">
                      Street address <span className="text-red-500">*</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter street address"
                      className="mt-2 h-11 w-full rounded-full border border-stone-200 bg-white px-5 text-[13px] outline-none"
                    />
                  </label>

                  <label className="block">
                    <div className="text-[12px] font-semibold text-neutral-900">
                      Zip code <span className="text-red-500">*</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter zip code"
                      className="mt-2 h-11 w-full rounded-full border border-stone-200 bg-white px-5 text-[13px] outline-none"
                    />
                  </label>

                  <label className="block">
                    <div className="text-[12px] font-semibold text-neutral-900">
                      Unit <span className="text-red-500">*</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Unit number"
                      className="mt-2 h-11 w-full rounded-full border border-stone-200 bg-white px-5 text-[13px] outline-none"
                    />
                  </label>
                </div>
              </section>

              <aside>
                <h2 className="text-[28px] font-semibold leading-[34px] text-neutral-900">Your Order</h2>

                <div className="mt-6 rounded-[32px] bg-[#F7F3EE] p-8">
                  <div className="flex items-center justify-between text-[14px] font-semibold text-neutral-900">
                    <div>Product</div>
                    <div>Subtotal</div>
                  </div>

                  <div className="mt-4 space-y-4">
                    {quoteItemsExpanded.map((it, idx) => {
                      return (
                        <div key={idx} className="space-y-2">
                          <div className="text-[12px] font-semibold text-neutral-900">{it.name}</div>
                          <div className="space-y-2">
                            {it.rows.map((r, rIdx) => (
                              <div key={rIdx} className="flex items-center justify-between text-[12px] text-neutral-700">
                                <div className="pr-4">{r.label}</div>
                                <div className="shrink-0">{r.amount}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 h-px w-full bg-stone-200" />

                  <div className="mt-4 flex items-center justify-between text-[13px] font-semibold text-neutral-900">
                    <div>Subtotal</div>
                    <div>{quoteSubtotal}</div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[16px] font-semibold text-neutral-900">
                    <div>Total</div>
                    <div>{quoteTotal}</div>
                  </div>

                  <div className="mt-6 h-px w-full bg-stone-200" />

                  <div className="mt-6 space-y-4">
                    <label className="flex items-center gap-3 text-[13px] text-neutral-900">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="h-4 w-4 accent-orange-600"
                      />
                      <span>Credit / Debit Card</span>
                    </label>

                    {cardExpanded ? (
                      <div className="pl-7">
                        <div className="text-[12px] font-semibold text-neutral-900">
                          Secure, 1-click checkout with <span className="text-orange-600">Link</span>
                        </div>
                        <div className="mt-2 text-[12px] leading-[18px] text-neutral-600">
                          Securely pay with your saved info, or create a Link account for faster checkout next time.
                        </div>

                        <div className="mt-4 space-y-4">
                          <label className="block">
                            <div className="text-[11px] font-semibold text-neutral-900">
                              Email <span className="text-red-500">*</span>
                            </div>
                            <input
                              type="email"
                              placeholder="example@mail.com"
                              className="mt-2 h-11 w-full rounded-full border border-stone-200 bg-white px-5 text-[13px] outline-none"
                            />
                          </label>

                          <label className="block">
                            <div className="text-[11px] font-semibold text-neutral-900">
                              Card number <span className="text-red-500">*</span>
                            </div>
                            <div className="mt-2 flex h-11 w-full items-center rounded-full border border-stone-200 bg-white px-5">
                              <input
                                type="text"
                                placeholder="1111 1111 1111 1111"
                                className="w-full bg-transparent text-[13px] outline-none"
                              />
                            </div>
                          </label>

                          <label className="block">
                            <div className="text-[11px] font-semibold text-neutral-900">
                              Expiration date <span className="text-red-500">*</span>
                            </div>
                            <input
                              type="text"
                              placeholder="MM / YY"
                              className="mt-2 h-11 w-full rounded-full border border-stone-200 bg-white px-5 text-[13px] outline-none"
                            />
                          </label>

                          <label className="block">
                            <div className="text-[11px] font-semibold text-neutral-900">
                              Security code <span className="text-red-500">*</span>
                            </div>
                            <div className="mt-2 flex h-11 w-full items-center rounded-full border border-stone-200 bg-white px-5">
                              <input type="text" placeholder="CVC" className="w-full bg-transparent text-[13px] outline-none" />
                            </div>
                          </label>
                        </div>
                      </div>
                    ) : null}

                    <label className="flex items-center gap-3 text-[13px] text-neutral-900">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "paypal"}
                        onChange={() => setPaymentMethod("paypal")}
                        className="h-4 w-4 accent-orange-600"
                      />
                      <span className="font-semibold text-[#003087]">PayPal</span>
                    </label>

                    <label className="flex items-center gap-3 text-[13px] text-neutral-900">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "stripe"}
                        onChange={() => setPaymentMethod("stripe")}
                        className="h-4 w-4 accent-orange-600"
                      />
                      <span className="font-semibold text-[#635BFF]">stripe</span>
                    </label>
                  </div>

                  <div className="mt-7">
                    <Link
                      href="/ordering"
                      className="flex h-14 w-full items-center justify-center rounded-full bg-orange-600 text-[13px] font-semibold uppercase tracking-[0.15px] text-white"
                    >
                      Place Order
                    </Link>
                  </div>

                  <label className="mt-5 flex items-start gap-3 text-[12px] text-neutral-700">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-[2px] h-4 w-4 accent-orange-600"
                    />
                    <span>
                      I have read and agree to the website <span className="text-orange-600">terms and conditions</span>
                    </span>
                  </label>
                </div>
              </aside>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
