"use client";

import { usePlan } from "@/lib/planContext";
import { useTypographyStyle } from "@/lib/typographyContext";
import { getTextStyleCss } from "@/lib/typography";

export const HeroTitle = () => {
  const plan = usePlan();
  const titleStyle = useTypographyStyle("house.hero.title", "Title/40");

  return (
    <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] pt-0 md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[22.272px] md:flex md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[22.272px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:pt-[13.312px] md:scroll-m-0 md:scroll-p-[auto]">
      <div className="static text-base font-normal box-content caret-black shrink leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:text-[40px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:leading-[48px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[48px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          <span style={getTextStyleCss(titleStyle)}>{plan.name}</span>
        </p>
      </div>
    </div>
  );
};
