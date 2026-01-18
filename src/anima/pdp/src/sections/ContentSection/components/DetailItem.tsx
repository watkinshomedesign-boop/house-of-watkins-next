export type DetailItemProps = {
  variant: string;
  title?: string;
  content?: string;
  items?: Array<{
    label: string;
    value: string;
  }>;
};

export const DetailItem = (props: DetailItemProps) => {
  if (
    props.variant ===
    "static box-content caret-black shrink h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:h-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
  ) {
    return (
      <div className="static box-content caret-black shrink h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:h-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <div className="static box-content caret-black outline-black md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] border-t-0 inset-auto md:absolute md:top-[-0.896px] md:border-stone-200 md:border-t md:border-solid md:bottom-0 md:inset-x-0"></div>
      </div>
    );
  }

  if (
    props.variant ===
      "font-normal [align-items:normal] gap-x-[normal] block flex-row leading-[normal] gap-y-[normal] text-wrap md:font-semibold md:items-start md:gap-x-[7.168px] md:flex md:flex-col md:leading-[0px] md:gap-y-[7.168px] md:text-nowrap" ||
    props.variant ===
      "[align-items:normal] gap-x-[normal] block flex-row leading-[normal] gap-y-[normal] w-auto md:items-start md:gap-x-[7.168px] md:flex md:flex-col md:leading-[0px] md:gap-y-[7.168px] md:w-full"
  ) {
    return (
      <div
        className={`box-content caret-black min-h-0 min-w-0 outline-black md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] ${props.variant}`}
      >
        <div
          className={`static box-content caret-black outline-black md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] ${props.variant === "font-normal [align-items:normal] gap-x-[normal] block flex-row leading-[normal] gap-y-[normal] text-wrap md:font-semibold md:items-start md:gap-x-[7.168px] md:flex md:flex-col md:leading-[0px] md:gap-y-[7.168px] md:text-nowrap" ? "text-black shrink min-h-0 min-w-0 text-wrap md:relative md:text-stone-400 md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:text-nowrap" : "text-black font-normal shrink min-h-0 min-w-0 text-wrap md:relative md:text-stone-400 md:font-semibold md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:text-nowrap"}`}
        >
          <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[21.376px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            {props.title}
          </p>
        </div>
        <div
          className={`box-content caret-black min-h-0 min-w-0 outline-black md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] ${props.variant === "font-normal [align-items:normal] gap-x-[normal] block flex-row leading-[normal] gap-y-[normal] text-wrap md:font-semibold md:items-start md:gap-x-[7.168px] md:flex md:flex-col md:leading-[0px] md:gap-y-[7.168px] md:text-nowrap" ? "static text-base shrink text-wrap md:relative md:text-[17.792px] md:shrink-0 md:min-w-[auto] md:text-nowrap" : "static text-base shrink w-auto md:relative md:text-[0px] md:shrink-0 md:min-w-full md:w-min"}`}
        >
          <p
            className={`box-content caret-black leading-[normal] outline-black md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] ${props.variant === "font-normal [align-items:normal] gap-x-[normal] block flex-row leading-[normal] gap-y-[normal] text-wrap md:font-semibold md:items-start md:gap-x-[7.168px] md:flex md:flex-col md:leading-[0px] md:gap-y-[7.168px] md:text-nowrap" ? "text-wrap md:leading-[26.624px] md:text-nowrap" : "text-base font-normal md:text-[13.312px] md:font-bold md:leading-[19.584px]"}`}
          >
            {props.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="box-content caret-black min-h-0 min-w-0 outline-black md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] [align-items:normal] gap-x-[normal] block flex-row gap-y-[normal] w-auto md:items-start md:gap-x-[14.208px] md:flex md:flex-col md:gap-y-[14.208px] md:w-full">
      <div className="static box-content caret-black outline-black md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] font-normal shrink leading-[normal] min-h-0 min-w-0 text-wrap md:relative md:font-semibold md:shrink-0 md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:text-nowrap">
        <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[21.376px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          {props.title}
        </p>
      </div>
      <div className="box-content caret-black min-h-0 min-w-0 outline-black md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] [align-items:normal] gap-x-[normal] block flex-row gap-y-[normal] w-auto md:items-start md:gap-x-[10.624px] md:flex md:flex-col md:min-w-[auto] md:gap-y-[10.624px] md:w-full">
        {props.items?.map((item, index) => (
          <div
            key={index}
            className="[align-items:normal] box-content caret-black gap-x-[normal] block min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[8.832px] md:flex md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
          >
            <div className="text-black text-base font-normal box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:text-stone-400 md:text-[0px] md:font-medium md:aspect-auto md:box-border md:caret-transparent md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <p className="text-base font-normal box-content caret-black leading-[normal] outline-black text-wrap md:text-[13.312px] md:font-bold md:aspect-auto md:box-border md:caret-transparent md:leading-[19.584px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                {item.label}
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
            <div className="static text-base font-normal box-content caret-black shrink leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:text-[0px] md:font-medium md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <p className="text-base font-normal box-content caret-black leading-[normal] outline-black text-wrap md:text-[13.312px] md:font-bold md:aspect-auto md:box-border md:caret-transparent md:leading-[19.584px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
