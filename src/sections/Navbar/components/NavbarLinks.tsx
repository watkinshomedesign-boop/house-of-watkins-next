import Link from "next/link";

export const NavbarLinks = () => {
  return (
    <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block basis-auto grow-0 shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[28.416px] md:flex md:basis-0 md:grow md:shrink-0 md:justify-start md:min-h-px md:min-w-px md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[28.416px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
      <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[35.52px] md:flex md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[35.52px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <Link href="/about" className="contents">
          <button className="static [align-items:normal] bg-zinc-100 caret-black gap-x-[normal] inline-block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-center md:aspect-auto md:bg-transparent md:caret-transparent md:gap-x-[8.88px] md:flex md:shrink-0 md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.88px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto]">
            <div className="static text-base font-normal box-content caret-black shrink leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:text-[15px] md:font-medium md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <p className="font-normal box-content caret-black leading-[normal] outline-black text-wrap md:font-bold md:aspect-auto md:box-border md:caret-transparent md:leading-[22px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                About Us
              </p>
            </div>
          </button>
        </Link>
        <Link href="/catalog" className="contents">
          <button className="static [align-items:normal] bg-zinc-100 caret-black gap-x-[normal] inline-block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-center md:aspect-auto md:bg-transparent md:caret-transparent md:gap-x-[8.88px] md:flex md:shrink-0 md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.88px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto]">
            <div className="static text-black text-base font-normal box-content caret-black shrink leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:text-orange-600 md:text-[15px] md:font-medium md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <p className="font-normal box-content caret-black leading-[normal] outline-black text-wrap md:font-bold md:aspect-auto md:box-border md:caret-transparent md:leading-[22px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                House plans
              </p>
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
};
