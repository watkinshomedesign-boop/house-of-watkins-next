import { CartProducts } from "@/sections/CartSection/components/CartProducts";
import { CartSummary } from "@/sections/CartSection/components/CartSummary";

export const CartSection = () => {
  return (
    <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block min-h-0 min-w-0 outline-black gap-y-[normal] pb-0 md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[56.832px] md:flex md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[56.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:pb-[35.456px] md:scroll-m-0 md:scroll-p-[auto]">
      <CartProducts />
      <CartSummary />
    </div>
  );
};
