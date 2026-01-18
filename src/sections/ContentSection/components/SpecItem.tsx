"use client";

import { useTypographyStyle } from "@/lib/typographyContext";
import { getTextStyleCss } from "@/lib/typography";

export type SpecItemProps = {
  label: string;
  value: string;
};

export const SpecItem = (props: SpecItemProps) => {
  const labelStyle = useTypographyStyle("house.sidebar.spec_label", "Body/13");
  const valueStyle = useTypographyStyle("house.sidebar.spec_value", "Title/13");

  return (
    <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[8.832px] md:flex md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
      <div className="text-black text-base font-normal box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:text-stone-400 md:text-[16px] md:font-medium md:aspect-auto md:box-border md:caret-transparent md:leading-[24px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <p className="font-normal box-content caret-black outline-black text-wrap md:font-bold md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          <span style={getTextStyleCss(labelStyle)}>{props.label}</span>
        </p>
      </div>
      <div className="static self-auto box-content caret-black basis-auto grow-0 shrink min-h-0 min-w-0 outline-black md:relative md:self-stretch md:aspect-auto md:box-border md:caret-transparent md:basis-0 md:grow md:shrink-0 md:min-h-px md:min-w-px md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <div className="static box-content caret-black h-auto outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row h-auto justify-normal outline-black gap-y-[normal] w-auto pt-0 md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[22.272px] md:flex md:flex-col md:h-full md:justify-start md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[22.272px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:pt-[13.3325px] md:scroll-m-0 md:scroll-p-[auto]">
            <div className="static box-content caret-black shrink h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:h-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <div className="static box-content caret-black outline-black border-t-0 inset-auto md:absolute md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:top-[-0.896px] md:border-stone-400 md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:border-t md:border-dashed md:bottom-0 md:inset-x-0"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="static text-base font-normal box-content caret-black shrink leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:text-[16px] md:font-medium md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:leading-[24px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <p className="font-normal box-content caret-black outline-black text-wrap md:font-bold md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          <span style={getTextStyleCss(valueStyle)}>{props.value}</span>
        </p>
      </div>
    </div>
  );
};
