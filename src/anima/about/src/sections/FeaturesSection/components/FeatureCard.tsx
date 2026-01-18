export type FeatureCardProps = {
  iconUrl: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
};

export const FeatureCard = (props: FeatureCardProps) => {
  return (
    <div className="[align-items:normal] box-content caret-black gap-x-[normal] block flex-row justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[14.208px] md:flex md:flex-col md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[14.208px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
      <div className="[align-items:normal] box-content caret-black gap-x-[normal] block flex-row min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[10.624px] md:flex md:flex-col md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[10.624px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <div className="bg-transparent box-content caret-black shrink min-h-0 min-w-0 outline-black rounded-none md:aspect-auto md:bg-orange-600 md:box-border md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:p-[8.832px] md:scroll-m-0 md:scroll-p-[auto] md:rounded-[44.416px]">
          <div className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-[17.792px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[17.792px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <img
              src={props.iconUrl}
              alt="Icon"
              className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
            />
          </div>
        </div>
        <div className="text-base font-normal box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-start md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:leading-[21.376px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:text-center md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          <p className="box-content caret-black outline-black md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            {props.titleLine1}
          </p>
          <p className="box-content caret-black outline-black md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            {props.titleLine2}
          </p>
        </div>
      </div>
      <p className="text-black text-base box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-start w-auto md:text-stone-400 md:text-[11.52px] md:aspect-auto md:box-border md:caret-transparent md:leading-[16.896px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:text-center md:decoration-auto md:underline-offset-auto md:w-[180.48px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        {props.description}
      </p>
    </div>
  );
};
