import { Breadcrumb } from "@/components/Breadcrumb";
import { CartSection } from "@/sections/CartSection";
import { FavoritesSection } from "@/sections/FavoritesSection";

export const Main = () => {
  return (
    <main className="text-base box-content caret-black basis-auto grow-0 leading-[normal] min-h-0 min-w-0 outline-black md:text-[14.208px] md:aspect-auto md:box-border md:caret-transparent md:basis-[0%] md:grow md:leading-[21.312px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
      <div className="box-content caret-black gap-x-[normal] block flex-row outline-black gap-y-[normal] w-auto p-0 md:aspect-auto md:box-border md:caret-transparent md:gap-x-[35.456px] md:flex md:flex-col md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[35.456px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:pt-[35.456px] md:pb-[71.168px] md:px-[51.2px] md:scroll-m-0 md:scroll-p-[auto]">
        <Breadcrumb />
        <CartSection />
        <FavoritesSection />
      </div>
    </main>
  );
};
