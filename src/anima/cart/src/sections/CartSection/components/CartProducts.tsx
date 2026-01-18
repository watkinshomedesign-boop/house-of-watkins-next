import { EmptyCart } from "@/sections/CartSection/components/EmptyCart";

export const CartProducts = () => {
  return (
    <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block basis-auto flex-row grow-0 shrink min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[17.792px] md:flex md:basis-0 md:flex-col md:grow md:shrink-0 md:min-h-px md:min-w-px md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[17.792px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
      <div className="static text-base font-normal box-content caret-black shrink leading-[normal] min-h-0 min-w-0 outline-black w-auto md:relative md:text-[24.832px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:leading-[0px] md:min-h-[auto] md:min-w-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-min md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <p className="box-content caret-black leading-[normal] outline-black md:aspect-auto md:box-border md:caret-transparent md:leading-[35.584px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          Products
        </p>
      </div>
      <div className="static [align-items:normal] bg-transparent box-content caret-black block shrink justify-normal min-h-0 min-w-0 outline-black w-auto rounded-none md:relative md:items-center md:aspect-auto md:bg-stone-50 md:box-border md:caret-transparent md:flex md:shrink-0 md:justify-center md:min-h-64 md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[35.584px]">
        <EmptyCart />
      </div>
    </div>
  );
};
