import Link from "next/link";

import iconCart from "../../../../assets/Final small icon images black svg/Icon shopping cart-black.svg";
import iconPhone from "../../../../assets/Final small icon images black svg/Icon phone-black.svg";

export const NavbarActions = () => {
  return (
    <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[35.52px] md:flex md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[35.52px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
      <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[28.416px] md:flex md:shrink-0 md:justify-end md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[28.416px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <a href="tel:+15412191673" className="static [align-items:normal] bg-zinc-100 caret-black gap-x-[normal] inline-block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-center md:aspect-auto md:bg-transparent md:caret-transparent md:gap-x-[7.104px] md:flex md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[7.104px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto]">
          <div className="static box-content caret-black shrink h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:h-[17.76px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[17.76px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <img
              src={(iconPhone as any).src ?? (iconPhone as any)}
              alt="Icon"
              className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
            />
          </div>
          <div className="static text-black text-base font-normal box-content caret-black shrink leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:text-orange-600 md:text-[15px] md:font-medium md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <p className="font-normal box-content caret-black leading-[normal] outline-black text-wrap md:font-bold md:aspect-auto md:box-border md:caret-transparent md:leading-[22px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              +1 541 219 1673
            </p>
          </div>
        </a>
        <a href="mailto:david@houseofwatkins.com" className="static text-[13.3333px] font-normal bg-zinc-100 caret-black inline-block shrink leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:text-[15px] md:font-medium md:aspect-auto md:bg-transparent md:caret-transparent md:block md:shrink-0 md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto]">
          <p className="font-normal box-content caret-black leading-[normal] outline-black text-wrap md:font-bold md:aspect-auto md:box-border md:caret-transparent md:leading-[22px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            david@houseofwatkins.com
          </p>
        </a>
      </div>
      <Link href="/cart" className="contents">
        <button className="static bg-zinc-100 caret-black inline-block shrink h-auto min-h-0 min-w-0 outline-black w-auto rounded-none md:relative md:aspect-auto md:bg-white md:caret-transparent md:block md:shrink-0 md:h-[50px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[50px] md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[100px]">
          <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block h-auto justify-normal outline-black gap-y-[normal] w-auto md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[8.88px] md:flex md:h-[50px] md:justify-center md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.88px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[50px] md:overflow-clip md:[mask-position:0%] md:bg-left-top md:p-[13px] md:scroll-m-0 md:scroll-p-[auto]">
            <div className="static box-content caret-black shrink h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:h-[21.312px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[21.312px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <img
                src={(iconCart as any).src ?? (iconCart as any)}
                alt="Icon"
                className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
              />
            </div>
          </div>
          <div className="static box-content caret-black outline-black pointer-events-auto rounded-none inset-auto md:absolute md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:pointer-events-none md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:border md:border-orange-600 md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[100px] md:border-solid md:inset-0"></div>
        </button>
      </Link>
    </div>
  );
};
