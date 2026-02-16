import Link from "next/link";

import iconArrowRight from "../../../../assets/Final small icon images black svg/Icon arrow right-black.svg";

export const HeroCallToAction = (props: { cms?: { href?: string; label?: string } }) => {
  const href = props.cms?.href || "/catalog";
  const label = props.cms?.label || "CHOOSE HOUSE";

  return (
    <Link href={href} className="contents">
      <button className="static [align-items:normal] bg-zinc-100 caret-black gap-x-[normal] inline-block justify-normal outline-black gap-y-[normal] px-1.5 py-px rounded-none left-auto top-auto md:absolute md:z-[60] md:pointer-events-auto md:items-center md:aspect-auto md:bg-orange-600 md:caret-transparent md:gap-x-[19.2px] md:flex md:justify-start md:left-[-115.376px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[19.2px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:overflow-clip md:[mask-position:0%] md:bg-left-top md:pl-[22.784px] md:pr-[4.48px] md:py-[4.48px] md:scroll-m-0 md:scroll-p-[auto] md:rounded-[31.104px] md:top-auto md:bottom-[28.624px]">
        <div className="[align-items:normal] self-auto box-content caret-black block min-h-0 min-w-0 outline-black md:items-center md:self-stretch md:aspect-auto md:box-border md:caret-transparent md:flex md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink h-auto justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] pt-0 md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[8.88px] md:flex md:shrink-0 md:h-full md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.88px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:pt-[3.552px] md:scroll-m-0 md:scroll-p-[auto]">
            <div className="static text-black font-normal box-content caret-black block flex-row shrink justify-normal tracking-[normal] leading-[normal] min-h-0 min-w-0 outline-black normal-case text-wrap md:relative md:text-white md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:tracking-[0.16px] md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:uppercase md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[21.376px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                {label}
              </p>
            </div>
          </div>
        </div>
        <div className="static [align-items:normal] bg-transparent box-content caret-black gap-x-[normal] block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] rounded-none md:relative md:items-center md:aspect-auto md:bg-white md:box-border md:caret-transparent md:gap-x-[8.88px] md:flex md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.88px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:overflow-clip md:[mask-position:0%] md:bg-left-top md:p-[11.52px] md:scroll-m-0 md:scroll-p-[auto] md:rounded-[100px]">
          <div className="static box-content caret-black shrink h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:h-[21.376px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[21.376px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <img
              src={(iconArrowRight as any).src ?? (iconArrowRight as any)}
              alt=""
              aria-hidden="true"
              className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
              style={{ transform: "rotate(-45deg)" }}
            />
          </div>
        </div>
      </button>
    </Link>
  );
};
