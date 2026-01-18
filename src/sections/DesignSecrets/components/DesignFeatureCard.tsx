export type DesignFeatureCardProps = {
  title: string;
  description: string;
  iconVariant: string;
  iconUrl?: string | null;
  containerVariant?: string;
};

export const DesignFeatureCard = (props: DesignFeatureCardProps) => {
  return (
    <div
      className={`[align-items:normal] box-content caret-black block basis-auto grow-0 shrink min-h-0 min-w-0 outline-black md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:basis-0 md:grow md:shrink-0 md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] self-auto md:self-stretch md:min-h-[auto] md:min-w-[auto] ${props.containerVariant || ""}`}
    >
      <div className="box-content caret-black shrink min-h-0 min-w-0 outline-black md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:scroll-m-0 md:scroll-p-[auto] static [align-items:normal] gap-x-[normal] block basis-auto flex-row grow-0 justify-normal gap-y-[normal] py-0 rounded-none md:relative md:items-center md:gap-x-[28.416px] md:flex md:basis-0 md:flex-col md:grow md:justify-center md:min-h-px md:min-w-px md:gap-y-[28.416px] md:overflow-clip md:bg-left-top md:py-[21.376px] md:rounded-[17.792px]">
        <div
          className={`bg-none bg-repeat bg-auto box-content caret-black shrink h-auto min-h-0 min-w-0 outline-black w-auto md:aspect-auto md:bg-no-repeat md:bg-cover md:box-border md:caret-transparent md:shrink-0 md:h-[84.48px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[84.48px] md:[mask-position:0%] md:bg-center md:scroll-m-0 md:scroll-p-[auto] ${props.iconVariant}`}
          style={props.iconUrl ? ({ backgroundImage: `url('${props.iconUrl}')` } as any) : undefined}
        ></div>
        <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row shrink justify-normal leading-[normal] min-h-0 min-w-0 outline-black gap-y-[normal] text-start w-auto md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[12.416px] md:flex md:flex-col md:shrink-0 md:justify-center md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[12.416px] md:snap-align-none md:snap-normal md:snap-none md:text-center md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          <div className="text-base normal-nums font-normal box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black w-auto md:text-[24.864px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:leading-[35.52px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <p className="box-content caret-black outline-black md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              {props.title}
            </p>
          </div>
          <div className="text-black text-base normal-nums box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black w-auto md:text-stone-400 md:text-[13.32px] md:aspect-auto md:box-border md:caret-transparent md:leading-[19.536px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <p className="box-content caret-black outline-black md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              {props.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
