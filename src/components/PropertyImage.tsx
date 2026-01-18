import { PlanImage } from "@/components/media/PlanImage";

export const PropertyImage = () => {
  return (
    <PlanImage
      src="/placeholders/plan-hero.svg"
      alt=""
      sizes="(min-width: 768px) 33vw, 100vw"
      className="rounded-none md:rounded-[28.416px]"
      rounded={false}
    >
      <div className="static [align-items:normal] bg-transparent box-content caret-black gap-x-[normal] block justify-normal outline-black gap-y-[normal] rounded-none right-auto top-auto md:absolute md:items-center md:aspect-auto md:backdrop-blur-[3.75px] md:bg-neutral-800/30 md:box-border md:caret-transparent md:gap-x-[8.832px] md:flex md:justify-start md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:p-[7.168px] md:scroll-m-0 md:scroll-p-[auto] md:rounded-[50px] md:right-4 md:top-4">
        <div className="static box-content caret-black h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:h-[21.376px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[21.376px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          <div className="static box-content caret-black block outline-black inset-auto md:absolute md:aspect-auto md:box-border md:caret-transparent md:contents md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:inset-0">
            <img
              src="/placeholders/icon-15.svg"
              alt="Icon"
              className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
            />
          </div>
        </div>
      </div>
    </PlanImage>
  );
};
