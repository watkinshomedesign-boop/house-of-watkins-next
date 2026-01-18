import { EcoContent } from "@/sections/EcoSection/components/EcoContent";
import { EcoImage } from "@/sections/EcoSection/components/EcoImage";

export const EcoSection = () => {
  return (
    <section className="box-content caret-black min-h-0 min-w-0 outline-black px-0 md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:px-[56.832px] md:scroll-m-0 md:scroll-p-[auto]">
      <div className="[align-items:normal] box-content caret-black gap-x-[normal] block outline-black gap-y-[normal] md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[17.792px] md:flex md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[17.792px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <EcoContent />
        <EcoImage />
      </div>
    </section>
  );
};
