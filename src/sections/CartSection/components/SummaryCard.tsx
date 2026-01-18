"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useCart } from "@/lib/cart/CartContext";
import { cartToCheckoutItems } from "@/lib/cart/toCheckoutItems";
import { getStoredBuilderCode } from "@/lib/builderPromo/storage";

export const SummaryCard = () => {
  const { items } = useCart();
  const [subtotal, setSubtotal] = useState("$ 0.00");
  const [total, setTotal] = useState("$ 0.00");
  const [builderDiscount, setBuilderDiscount] = useState("$ 0.00");
  const [cadDiscount, setCadDiscount] = useState("$ 0.00");
  const [showBuilderDiscount, setShowBuilderDiscount] = useState(false);
  const [showCadDiscount, setShowCadDiscount] = useState(false);
  const [builderDiscountLabel, setBuilderDiscountLabel] = useState("Builder Discount (15%)");
  const [cadDiscountLabel, setCadDiscountLabel] = useState("CAD Add-On Discount (50%)");

  const quoteItems = useMemo(() => cartToCheckoutItems(items), [items]);
  const [builderCode, setBuilderCode] = useState("");

  function formatUsdFromCents(cents: number) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
  }

  function extractDiscounts(data: any): {
    builderDiscountCents: number;
    cadDiscountCents: number;
    builderLabel: string;
    cadLabel: string;
  } {
    const builderPercent = Number(data?.promo?.discountPercent ?? 15);
    const cadPercent = Number(data?.promo?.cadDiscountPercent ?? 50);

    let builderDiscountCents = 0;
    let cadDiscountCents = 0;

    const itemsAny = Array.isArray(data?.items) ? data.items : [];
    for (const it of itemsAny) {
      const qty = Number(it?.qty ?? 1) || 1;
      const lineItems = Array.isArray(it?.lineItems) ? it.lineItems : [];
      for (const li of lineItems) {
        const label = String(li?.label ?? "");
        const amt = Number(li?.amountCents ?? 0);
        if (label.toLowerCase().startsWith("builder discount")) {
          builderDiscountCents += amt * qty;
        }
        if (label.toLowerCase().startsWith("cad discount")) {
          cadDiscountCents += amt * qty;
        }
      }
    }

    return {
      builderDiscountCents,
      cadDiscountCents,
      builderLabel: `Builder Discount (${builderPercent}%)`,
      cadLabel: `CAD Add-On Discount (${cadPercent}%)`,
    };
  }

  useEffect(() => {
    setBuilderCode(getStoredBuilderCode());

    function onChange() {
      setBuilderCode(getStoredBuilderCode());
    }

    window.addEventListener("moss_builder_code_changed", onChange);
    return () => window.removeEventListener("moss_builder_code_changed", onChange);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (quoteItems.length === 0) {
        setSubtotal("$ 0.00");
        setTotal("$ 0.00");
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
        setSubtotal(data?.formatted?.subtotal ?? "$ 0.00");
        setTotal(data?.formatted?.total ?? "$ 0.00");

        const extracted = extractDiscounts(data);
        setBuilderDiscountLabel(extracted.builderLabel);
        setCadDiscountLabel(extracted.cadLabel);

        setShowBuilderDiscount(extracted.builderDiscountCents !== 0);
        setShowCadDiscount(extracted.cadDiscountCents !== 0);
        setBuilderDiscount(formatUsdFromCents(extracted.builderDiscountCents));
        setCadDiscount(formatUsdFromCents(extracted.cadDiscountCents));
      } catch {
        if (cancelled) return;
        setSubtotal("$ 0.00");
        setTotal("$ 0.00");
        setShowBuilderDiscount(false);
        setShowCadDiscount(false);
        setBuilderDiscount("$ 0.00");
        setCadDiscount("$ 0.00");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [quoteItems, builderCode]);

  return (
    <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row outline-black gap-y-[normal] w-auto md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[28.416px] md:flex md:flex-col md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[28.416px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:p-[35.584px] md:scroll-m-0 md:scroll-p-[auto]">
      <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row shrink min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[17.792px] md:flex md:flex-col md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[17.792px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <div className="static font-normal [align-items:normal] box-content caret-black block shrink justify-normal leading-[normal] min-h-0 min-w-0 outline-black text-wrap w-auto md:relative md:font-semibold md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:shrink-0 md:justify-between md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          <div className="static box-content caret-black shrink min-h-0 min-w-0 outline-black text-wrap md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[21.376px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              Subtotal
            </p>
          </div>
          <div className="static box-content caret-black shrink min-h-0 min-w-0 outline-black text-start text-wrap md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:text-right md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[21.376px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              {subtotal}
            </p>
          </div>
        </div>
        {showBuilderDiscount ? (
          <div className="static font-normal [align-items:normal] box-content caret-black block shrink justify-normal leading-[normal] min-h-0 min-w-0 outline-black text-wrap w-auto md:relative md:font-semibold md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:shrink-0 md:justify-between md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <div className="static box-content caret-black shrink min-h-0 min-w-0 outline-black text-wrap md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[21.376px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                {builderDiscountLabel}
              </p>
            </div>
            <div className="static box-content caret-black shrink min-h-0 min-w-0 outline-black text-start text-wrap md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:text-right md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[21.376px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                {builderDiscount}
              </p>
            </div>
          </div>
        ) : null}
        {showCadDiscount ? (
          <div className="static font-normal [align-items:normal] box-content caret-black block shrink justify-normal leading-[normal] min-h-0 min-w-0 outline-black text-wrap w-auto md:relative md:font-semibold md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:shrink-0 md:justify-between md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <div className="static box-content caret-black shrink min-h-0 min-w-0 outline-black text-wrap md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[21.376px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                {cadDiscountLabel}
              </p>
            </div>
            <div className="static box-content caret-black shrink min-h-0 min-w-0 outline-black text-start text-wrap md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:text-right md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[21.376px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                {cadDiscount}
              </p>
            </div>
          </div>
        ) : null}
        <div className="static box-content caret-black gap-x-[normal] block flex-row shrink min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:gap-x-[5.376px] md:flex md:flex-col md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[5.376px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          <div className="static text-base font-normal [align-items:normal] box-content caret-black block shrink justify-normal leading-[normal] min-h-0 min-w-0 outline-black text-wrap w-auto md:relative md:text-[17.792px] md:font-semibold md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:shrink-0 md:justify-between md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <div className="static box-content caret-black shrink min-h-0 min-w-0 outline-black text-wrap md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[26.624px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                Total
              </p>
            </div>
            <div className="static box-content caret-black gap-x-[normal] block flex-row shrink min-h-0 min-w-0 outline-black gap-y-[normal] text-start text-wrap md:relative md:aspect-auto md:box-border md:caret-transparent md:gap-x-[3.584px] md:flex md:flex-col md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[3.584px] md:snap-align-none md:snap-normal md:snap-none md:text-right md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[26.624px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                {total}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row shrink min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[10.624px] md:flex md:flex-col md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[10.624px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        {items.length === 0 ? (
          <button
            disabled
            className="static bg-zinc-100 caret-black inline-block shrink min-h-0 min-w-0 outline-black w-auto rounded-none md:relative md:aspect-auto md:bg-[oklch(0.872_0.01_258.338)] md:caret-transparent md:block md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[31.104px]"
          >
            <div className="static [align-items:normal] box-content caret-black block h-auto justify-normal outline-black w-auto md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:h-full md:justify-center md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:overflow-clip md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto p-0 md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[8.832px] md:flex md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:px-[35.584px] md:py-[8.832px] md:scroll-m-0 md:scroll-p-[auto]">
                <div className="[align-items:normal] self-auto box-content caret-black block min-h-0 min-w-0 outline-black md:items-center md:self-stretch md:aspect-auto md:box-border md:caret-transparent md:flex md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                  <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink h-auto justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] pt-0 md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[8.832px] md:flex md:shrink-0 md:h-full md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:pt-[3.584px] md:scroll-m-0 md:scroll-p-[auto]">
                    <div className="static text-black text-base font-normal box-content caret-black block flex-row shrink justify-normal tracking-[normal] leading-[normal] min-h-0 min-w-0 outline-black normal-case text-wrap md:relative md:text-white md:text-[13.312px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:tracking-[0.15px] md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:uppercase md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                      <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[21.376px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                        checkout
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </button>
        ) : (
          <Link href="/ordering" className="contents">
            <button className="static bg-zinc-100 caret-black inline-block shrink min-h-0 min-w-0 outline-black w-auto rounded-none md:relative md:aspect-auto md:bg-[oklch(0.872_0.01_258.338)] md:caret-transparent md:block md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[31.104px]">
              <div className="static [align-items:normal] box-content caret-black block h-auto justify-normal outline-black w-auto md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:h-full md:justify-center md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:overflow-clip md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto p-0 md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[8.832px] md:flex md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:px-[35.584px] md:py-[8.832px] md:scroll-m-0 md:scroll-p-[auto]">
                  <div className="[align-items:normal] self-auto box-content caret-black block min-h-0 min-w-0 outline-black md:items-center md:self-stretch md:aspect-auto md:box-border md:caret-transparent md:flex md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                    <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink h-auto justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] pt-0 md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[8.832px] md:flex md:shrink-0 md:h-full md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:pt-[3.584px] md:scroll-m-0 md:scroll-p-[auto]">
                      <div className="static text-black text-base font-normal box-content caret-black block flex-row shrink justify-normal tracking-[normal] leading-[normal] min-h-0 min-w-0 outline-black normal-case text-wrap md:relative md:text-white md:text-[13.312px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:tracking-[0.15px] md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:uppercase md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                        <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[21.376px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                          checkout
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </Link>
        )}
        <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[7.168px] md:flex md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[7.168px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          <button className="static self-auto bg-zinc-100 caret-black inline-block basis-auto grow-0 shrink min-h-0 min-w-0 outline-black rounded-none md:relative md:self-stretch md:aspect-auto md:bg-white md:caret-transparent md:block md:basis-0 md:grow md:shrink-0 md:min-h-px md:min-w-px md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:border md:border-stone-200 md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[31.104px] md:border-solid">
            <div className="static [align-items:normal] box-content caret-black block flex-row h-auto justify-normal outline-black w-auto md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:h-full md:justify-center md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row h-auto justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto p-0 md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[8.832px] md:flex md:flex-col md:h-full md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:px-[47.104px] md:py-[3.584px] md:scroll-m-0 md:scroll-p-[auto]">
                <div className="static box-content caret-black shrink h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:h-[19.584px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[55.168px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                  <img
                    src="/placeholders/icon-15.svg"
                    alt="Icon"
                    className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
                  />
                </div>
              </div>
            </div>
          </button>
          <button className="static bg-zinc-100 caret-black inline-block basis-auto grow-0 shrink h-auto min-h-0 min-w-0 outline-black rounded-none md:relative md:aspect-auto md:bg-white md:caret-transparent md:block md:basis-0 md:grow md:shrink-0 md:h-[42.624px] md:min-h-px md:min-w-px md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:border md:border-stone-200 md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[31.104px] md:border-solid">
            <div className="static bg-transparent box-content caret-black outline-black rounded-none inset-auto md:absolute md:aspect-auto md:bg-white md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[31.104px] md:inset-0"></div>
            <div className="static box-content caret-black h-auto outline-black w-auto left-auto top-auto md:absolute md:aspect-auto md:box-border md:caret-transparent md:h-[18.816px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[45.312px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:left-[calc(50%_+_0.64px)] md:top-2/4">
              <img
                src="/placeholders/icon-15.svg"
                alt="Icon"
                className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
