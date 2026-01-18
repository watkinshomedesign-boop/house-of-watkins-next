"use client";

import { usePdp } from "@/lib/pdpState";

export const PriceInfo = () => {
  const { quote } = usePdp();

  const dollars = quote ? Math.round(quote.subtotalCents / 100) : 0;

  return (
    <div className="static font-normal [align-items:normal] box-content caret-black gap-x-[normal] block shrink justify-normal leading-[normal] min-h-0 min-w-0 outline-black gap-y-[normal] text-wrap md:relative md:font-normal md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[10.624px] md:flex md:shrink-0 md:justify-start md:leading-[normal] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[10.624px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
      <div className="static text-base box-content caret-black shrink leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:text-[15px] md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:leading-[22px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <p className="box-content caret-black outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          Starting at
        </p>
      </div>
      <div className="static text-black text-base box-content caret-black shrink leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:text-orange-600 md:text-[40px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:leading-[48px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <p className="box-content caret-black outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          $ {dollars.toLocaleString()}
        </p>
      </div>
    </div>
  );
};
