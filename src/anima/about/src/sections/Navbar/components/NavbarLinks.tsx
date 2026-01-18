export type NavbarLinksProps = {
  variant: string;
  firstButtonText: string;
  firstButtonIcon?: string;
  firstButtonIconAlt?: string;
  firstButtonHasIconWrapper?: boolean;
  firstButtonIconWrapperClass?: string;
  firstButtonClass: string;
  firstButtonHasTextWrapper?: boolean;
  secondButtonText: string;
  secondButtonClass: string;
  secondButtonHasTextWrapper?: boolean;
};

export const NavbarLinks = (props: NavbarLinksProps) => {
  return (
    <div
      className={`static [align-items:normal] box-content caret-black gap-x-[normal] block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] ${props.variant}`}
    >
      <button className={props.firstButtonClass}>
        {props.firstButtonHasIconWrapper && props.firstButtonIcon && (
          <div className={props.firstButtonIconWrapperClass}>
            <img
              src={props.firstButtonIcon}
              alt={props.firstButtonIconAlt || "Icon"}
              className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
            />
          </div>
        )}
        {props.firstButtonHasTextWrapper ? (
          <div className="static text-black text-base font-normal box-content caret-black shrink leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:text-orange-600 md:text-[15px] md:font-medium md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <p className="font-normal box-content caret-black leading-[normal] outline-black text-wrap md:font-bold md:aspect-auto md:box-border md:caret-transparent md:leading-[22px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              {props.firstButtonText}
            </p>
          </div>
        ) : (
          <p className="font-normal box-content caret-black leading-[normal] outline-black text-wrap md:font-bold md:aspect-auto md:box-border md:caret-transparent md:leading-[22px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            {props.firstButtonText}
          </p>
        )}
      </button>
      <button className={props.secondButtonClass}>
        {props.secondButtonHasTextWrapper ? (
          <div className="static text-base font-normal box-content caret-black shrink leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:text-[15px] md:font-medium md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <p className="font-normal box-content caret-black leading-[normal] outline-black text-wrap md:font-bold md:aspect-auto md:box-border md:caret-transparent md:leading-[22px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              {props.secondButtonText}
            </p>
          </div>
        ) : (
          <p className="font-normal box-content caret-black leading-[normal] outline-black text-wrap md:font-bold md:aspect-auto md:box-border md:caret-transparent md:leading-[22px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            {props.secondButtonText}
          </p>
        )}
      </button>
    </div>
  );
};
