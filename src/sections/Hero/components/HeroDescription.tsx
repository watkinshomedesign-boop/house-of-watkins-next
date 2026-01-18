export const HeroDescription = (props: { cms?: { subhead?: string } }) => {
  const subhead =
    props.cms?.subhead ||
    "Collaborate directly with David Watkins, an award-winning designer\nwith over 30 years of experience, to customize a design that's\ntailored to your unique lifestyle, location, and budget.";

  return (
    <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row justify-normal leading-[normal] outline-black gap-y-[normal] w-auto left-auto top-auto md:absolute md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[1.792px] md:flex md:flex-col md:justify-start md:leading-[0px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[1.792px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[456.832px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:left-[56.832px] md:top-[355.584px]">
      <div className="static text-base normal-nums font-normal box-content caret-black shrink tracking-[normal] leading-[normal] min-h-0 min-w-0 outline-black normal-case w-auto md:relative md:text-[15.984px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:tracking-[0.23976px] md:leading-[24.864px] md:min-h-[auto] md:min-w-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:uppercase md:underline-offset-auto md:w-min md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <p className="box-content caret-black outline-black md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          We focus on personal{" "}
        </p>
        <p className="box-content caret-black outline-black md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          collaboration, ensuring{" "}
        </p>
        <p className="box-content caret-black outline-black md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          every detail of your home is truly yours.
        </p>
      </div>
      <div className="static text-base box-content caret-black shrink leading-[normal] min-h-0 min-w-0 outline-black w-auto md:relative md:text-[13.32px] md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:leading-[19.536px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[456.832px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <p className="box-content caret-black outline-black md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          {subhead}
        </p>
      </div>
    </div>
  );
};
