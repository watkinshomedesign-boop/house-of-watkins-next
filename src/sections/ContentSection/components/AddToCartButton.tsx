"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/CartContext";
import { usePdp } from "@/lib/pdpState";

export function AddToCartButton(props: {
  slug: string;
  name: string;
  heated_sqft: number;
  license_type?: "single" | "builder";
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const { selections, planSetOptions, canAddToCart } = usePdp();

  const planSet = planSetOptions.find((o) => o.id === selections.planSetId) ?? null;

  function onClick() {
    if (!canAddToCart || !planSet) {
      window.alert("Please select a Plan Set.");
      return;
    }

    addItem({
      slug: props.slug,
      name: props.name,
      heated_sqft: props.heated_sqft,
      license_type: planSet.license,
      addons: {
        ...(planSet.addOns ?? {}),
        ...(selections.addOns ?? {}),
      },
      rush: false,
      paper_sets: planSet.paperSets,
      qty: 1,
    });

    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_name: "add_to_cart", plan_slug: props.slug }),
    }).catch(() => {
      // ignore
    });

    router.push("/cart");
  }

  return (
    <button
      onClick={onClick}
      disabled={!canAddToCart}
      className="static bg-zinc-100 caret-black inline-block shrink min-h-0 min-w-0 outline-black w-auto rounded-none disabled:cursor-not-allowed disabled:opacity-50 md:relative md:aspect-auto md:bg-orange-600 md:caret-transparent md:block md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[31.104px]"
    >
      <div className="static [align-items:normal] box-content caret-black block h-auto justify-normal outline-black w-auto md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:h-full md:justify-center md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:overflow-clip md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto p-0 md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[10.624px] md:flex md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[10.624px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:px-[35.584px] md:py-[14px] md:scroll-m-0 md:scroll-p-[auto]">
          <div className="static box-content caret-black shrink h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:h-[17.792px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[17.792px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"></div>
          <div className="[align-items:normal] self-auto box-content caret-black block min-h-0 min-w-0 outline-black md:items-center md:self-stretch md:aspect-auto md:box-border md:caret-transparent md:flex md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink h-auto justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-8 md:flex md:shrink-0 md:h-full md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-8 md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <div className="static text-black text-base font-normal box-content caret-black block flex-row shrink justify-normal tracking-[normal] leading-[normal] min-h-0 min-w-0 outline-black normal-case text-wrap md:relative md:text-white md:text-[18px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:tracking-[0.128px] md:leading-[26px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:uppercase md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                <p className="box-content caret-black min-h-0 min-w-0 outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                  add to cart
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
