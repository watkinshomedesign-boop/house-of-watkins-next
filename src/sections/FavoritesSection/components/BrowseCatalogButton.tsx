import Link from "next/link";

export const BrowseCatalogButton = () => {
  return (
    <Link href="/catalog" className="contents">
      <button className="static bg-zinc-100 caret-black inline-block shrink min-h-0 min-w-0 outline-black rounded-none md:relative md:aspect-auto md:bg-white md:caret-transparent md:block md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[35px]">
        <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block justify-normal outline-black gap-y-[normal] p-0 md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-2.5 md:flex md:justify-center md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-2.5 md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:overflow-clip md:[mask-position:0%] md:bg-left-top md:px-10 md:py-2.5 md:scroll-m-0 md:scroll-p-[auto]">
          <div className="[align-items:normal] self-auto box-content caret-black block min-h-0 min-w-0 outline-black md:items-center md:self-stretch md:aspect-auto md:box-border md:caret-transparent md:flex md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink h-auto justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] pt-0 md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-2.5 md:flex md:shrink-0 md:h-full md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-2.5 md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:pt-1 md:scroll-m-0 md:scroll-p-[auto]">
              <div className="static text-base font-normal box-content caret-black block flex-row shrink justify-normal tracking-[normal] leading-[normal] min-h-0 min-w-0 outline-black normal-case text-wrap md:relative md:text-[15px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:tracking-[0.15px] md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:uppercase md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-6 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                  Browse Catalog
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="static box-content caret-black outline-black pointer-events-auto rounded-none inset-auto md:absolute md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:pointer-events-none md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:border md:border-orange-600 md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[35px] md:border-solid md:inset-0"></div>
      </button>
    </Link>
  );
};
