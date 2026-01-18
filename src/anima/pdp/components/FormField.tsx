export type FormFieldProps = {
  label: string;
  placeholder: string;
  iconUrl?: string;
};

export const FormField = (props: FormFieldProps) => {
  return (
    <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block basis-auto flex-row grow-0 shrink min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[3.584px] md:flex md:basis-0 md:flex-col md:grow md:shrink-0 md:min-h-px md:min-w-px md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[3.584px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
      <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[5.376px] md:flex md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[5.376px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <div className="static text-base font-normal box-content caret-black block flex-row shrink justify-normal leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:text-[11.52px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[21.376px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            {props.label}
          </p>
        </div>
      </div>
      <button
        type="button"
        role="combobox"
        className="text-[13.3333px] [align-items:normal] bg-zinc-100 shadow-none caret-black gap-x-[normal] inline-block justify-normal leading-[normal] min-h-0 min-w-0 outline-black gap-y-[normal] text-wrap w-auto rounded-none md:text-[12.432px] md:items-center md:aspect-auto md:bg-transparent md:shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px] md:caret-transparent md:gap-x-[7.104px] md:flex md:justify-between md:leading-[17.76px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[7.104px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:w-full md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[6.0384px]"
      >
        <div className="static bg-transparent box-content caret-black shrink min-h-0 min-w-0 outline-black text-wrap w-auto rounded-none md:relative md:aspect-auto md:bg-white md:box-border md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[31.104px]">
          <div className="static box-content caret-black outline-black pointer-events-auto text-wrap rounded-none inset-auto md:absolute md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:pointer-events-none md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:border md:border-stone-200 md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[31.104px] md:border-solid md:inset-0"></div>
          <div className="static [align-items:normal] box-content caret-black block h-auto outline-black text-wrap w-auto md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block min-h-0 min-w-0 outline-black gap-y-[normal] text-wrap w-auto p-0 md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[5.376px] md:flex md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[5.376px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:w-full md:[mask-position:0%] md:bg-left-top md:pl-4 md:pr-[10.624px] md:py-[9.728px] md:scroll-m-0 md:scroll-p-[auto]">
              <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block basis-auto grow-0 shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] text-wrap pt-0 md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[8.832px] md:flex md:basis-0 md:grow md:shrink-0 md:justify-center md:min-h-px md:min-w-px md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:pt-[1.792px] md:scroll-m-0 md:scroll-p-[auto]">
                <div className="static text-black text-base box-content caret-black block basis-auto flex-row grow-0 shrink justify-normal leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:text-stone-400 md:text-[0px] md:aspect-auto md:box-border md:caret-transparent md:flex md:basis-0 md:flex-col md:grow md:shrink-0 md:justify-center md:leading-[0px] md:min-h-px md:min-w-px md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                  <p className="text-base font-normal box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:text-[13.312px] md:font-bold md:aspect-auto md:box-border md:caret-transparent md:leading-[19.584px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                    {props.placeholder}
                  </p>
                </div>
              </div>
              <div className="static box-content caret-black shrink h-auto min-h-0 min-w-0 outline-black text-wrap w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:h-[21.376px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:w-[21.376px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                {props.iconUrl && (
                  <img
                    src={props.iconUrl}
                    alt="Icon"
                    className="text-black box-content caret-black shrink h-auto outline-black pointer-events-auto text-wrap w-auto md:text-[oklch(0.556_0_0)] md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:pointer-events-none md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <img
          src="https://c.animaapp.com/mjfxgf97dMquCY/assets/icon-4.svg"
          alt="Icon"
          className="text-black box-content caret-black block shrink h-auto opacity-100 outline-black pointer-events-auto text-wrap w-auto md:text-[oklch(0.556_0_0)] md:aspect-auto md:box-border md:caret-transparent md:hidden md:shrink-0 md:h-[14.208px] md:opacity-50 md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:pointer-events-none md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:w-[14.208px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
        />
      </button>
    </div>
  );
};
