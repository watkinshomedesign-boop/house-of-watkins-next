export type NavbarButtonProps = {
  variant: string;
  text?: string;
  iconUrl?: string;
  iconAlt?: string;
  showSecondaryDiv?: boolean;
};

export const NavbarButton = (props: NavbarButtonProps) => {
  return (
    <button
      className={`static bg-zinc-100 caret-black inline-block shrink min-h-0 min-w-0 outline-black md:relative md:aspect-auto md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] ${props.variant}`}
    >
      {props.iconUrl && (
        <div
          className={`static box-content caret-black outline-black md:relative md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] ${props.variant === "[align-items:normal] gap-x-[normal] justify-normal gap-y-[normal] md:items-center md:bg-transparent md:gap-x-[7.104px] md:flex md:justify-start md:gap-y-[7.104px]" ? "shrink h-auto min-h-0 min-w-0 w-auto md:shrink-0 md:h-[17.76px] md:min-h-[auto] md:min-w-[auto] md:w-[17.76px]" : props.variant === "h-auto w-auto rounded-none md:bg-white md:block md:h-[50px] md:w-[50px] md:rounded-[100px]" ? "[align-items:normal] gap-x-[normal] block h-auto justify-normal gap-y-[normal] w-auto md:items-center md:gap-x-[8.88px] md:flex md:h-[50px] md:justify-center md:gap-y-[8.88px] md:w-[50px] md:overflow-clip md:p-[13px]" : "text-base font-normal shrink leading-[normal] min-h-0 min-w-0 text-wrap md:text-[15px] md:font-medium md:shrink-0 md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:text-nowrap"}`}
        >
          {props.variant ===
          "h-auto w-auto rounded-none md:bg-white md:block md:h-[50px] md:w-[50px] md:rounded-[100px]" ? (
            <div className="static box-content caret-black shrink h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:h-[21.312px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[21.312px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <img
                src={props.iconUrl}
                alt={props.iconAlt}
                className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
              />
            </div>
          ) : (
            <img
              src={props.iconUrl}
              alt={props.iconAlt}
              className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
            />
          )}
        </div>
      )}
      {props.text &&
        props.variant !==
          "text-[13.3333px] font-normal leading-[normal] text-wrap md:text-[15px] md:font-medium md:bg-transparent md:block md:leading-[0px] md:text-nowrap" &&
        !props.iconUrl && (
          <div className="static box-content caret-black outline-black md:relative md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] text-base font-normal shrink leading-[normal] min-h-0 min-w-0 text-wrap md:text-[15px] md:font-medium md:shrink-0 md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:text-nowrap">
            <p className="font-normal box-content caret-black leading-[normal] outline-black text-wrap md:font-bold md:aspect-auto md:box-border md:caret-transparent md:leading-[22px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              {props.text}
            </p>
          </div>
        )}
      {props.text &&
        props.variant ===
          "text-[13.3333px] font-normal leading-[normal] text-wrap md:text-[15px] md:font-medium md:bg-transparent md:block md:leading-[0px] md:text-nowrap" && (
          <p className="font-normal box-content caret-black leading-[normal] outline-black text-wrap md:font-bold md:aspect-auto md:box-border md:caret-transparent md:leading-[22px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            {props.text}
          </p>
        )}
      {props.text && props.iconUrl && (
        <div
          className={`static box-content caret-black outline-black md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] ${props.variant === "[align-items:normal] gap-x-[normal] justify-normal gap-y-[normal] md:items-center md:bg-transparent md:gap-x-[7.104px] md:flex md:justify-start md:gap-y-[7.104px]" ? "text-black text-base font-normal shrink leading-[normal] min-h-0 min-w-0 text-wrap md:relative md:text-orange-600 md:text-[15px] md:font-medium md:shrink-0 md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:text-nowrap" : "pointer-events-auto rounded-none inset-auto md:absolute md:pointer-events-none md:border md:border-orange-600 md:rounded-[100px] md:border-solid md:inset-0"}`}
        >
          {props.variant ===
            "[align-items:normal] gap-x-[normal] justify-normal gap-y-[normal] md:items-center md:bg-transparent md:gap-x-[7.104px] md:flex md:justify-start md:gap-y-[7.104px]" && (
            <p className="font-normal box-content caret-black leading-[normal] outline-black text-wrap md:font-bold md:aspect-auto md:box-border md:caret-transparent md:leading-[22px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              {props.text}
            </p>
          )}
        </div>
      )}
      {props.showSecondaryDiv &&
        props.variant ===
          "h-auto w-auto rounded-none md:bg-white md:block md:h-[50px] md:w-[50px] md:rounded-[100px]" && (
          <div className="static box-content caret-black outline-black md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] pointer-events-auto rounded-none inset-auto md:absolute md:pointer-events-none md:border md:border-orange-600 md:rounded-[100px] md:border-solid md:inset-0"></div>
        )}
    </button>
  );
};
