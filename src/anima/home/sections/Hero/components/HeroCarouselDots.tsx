export type HeroCarouselDotsProps = {
  totalDots: number;
  activeDotIndex: number;
};

export const HeroCarouselDots = (props: HeroCarouselDotsProps) => {
  return (
    <div className="static box-content caret-black gap-x-[normal] block outline-black gap-y-[normal] z-auto left-auto top-auto md:absolute md:aspect-auto md:box-border md:caret-transparent md:gap-x-[12.8px] md:flex md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[12.8px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:z-10 md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:left-[51.2px] md:top-[576px]">
      {Array.from({ length: props.totalDots }).map((_, index) => (
        <div
          key={index}
          className={
            index === props.activeDotIndex
              ? "bg-transparent shadow-none box-content caret-black h-auto min-h-0 min-w-0 outline-black w-auto rounded-none md:aspect-auto md:bg-white md:shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_10px_15px_-3px,rgba(0,0,0,0.1)_0px_4px_6px_-4px] md:box-border md:caret-transparent md:h-[12.8px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[12.8px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[3.35544e+07px]"
              : "bg-transparent shadow-none box-content caret-black h-auto min-h-0 min-w-0 opacity-100 outline-black w-auto rounded-none md:aspect-auto md:bg-white md:shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_10px_15px_-3px,rgba(0,0,0,0.1)_0px_4px_6px_-4px] md:box-border md:caret-transparent md:h-[12.8px] md:min-h-[auto] md:min-w-[auto] md:opacity-35 md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[12.8px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[3.35544e+07px]"
          }
        ></div>
      ))}
    </div>
  );
};
