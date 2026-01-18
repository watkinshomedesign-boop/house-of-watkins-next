import { HeroBackground } from "@/sections/Hero/components/HeroBackground";
import { HeroCarouselDots } from "@/sections/Hero/components/HeroCarouselDots";
import { HeroCallToAction } from "@/sections/Hero/components/HeroCallToAction";
import { HeroNavbar } from "@/sections/Hero/components/HeroNavbar";
import { HeroHeading } from "@/sections/Hero/components/HeroHeading";
import { HeroDescription } from "@/sections/Hero/components/HeroDescription";
import { HeroFeatureImage } from "@/sections/Hero/components/HeroFeatureImage";
import { HeroFeatureText } from "@/sections/Hero/components/HeroFeatureText";

export const Hero = () => {
  return (
    <div className="static box-content caret-black h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:h-[625.792px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
      <HeroBackground />
      <HeroCarouselDots totalDots={5} activeDotIndex={0} />
      <div className="static box-content caret-black h-auto outline-black w-auto right-auto top-auto md:absolute md:aspect-auto md:box-border md:caret-transparent md:h-[625.792px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[570.624px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:right-0 md:top-0">
        <div className="static box-content caret-black h-auto outline-black w-auto left-auto top-auto md:absolute md:aspect-auto md:box-border md:caret-transparent md:h-[627.2px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[570.624px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:left-0 md:top-0">
          <img
            src="https://c.animaapp.com/mi4ourt2lDMZ7U/assets/icon-2.svg"
            alt="Icon"
            className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
          />
        </div>
        <HeroCallToAction />
        <HeroNavbar />
        <HeroHeading />
        <HeroDescription />
        <HeroFeatureImage />
        <HeroFeatureText />
      </div>
    </div>
  );
};
