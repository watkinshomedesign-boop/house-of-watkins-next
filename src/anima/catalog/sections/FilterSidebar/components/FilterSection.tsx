export type FilterSectionProps = {
  variant: string;
  title?: string;
  iconUrl?: string;
  showClearAll?: boolean;
  showCloseButton?: boolean;
  showConsultation?: boolean;
  consultationUrl?: string;
  consultationText?: string;
  consultationSubtext?: string;
  options?: Array<{
    label: string;
    buttonVariant?: string;
  }>;
  checkboxOptions?: Array<{
    label: string;
  }>;
  sliders?: Array<{
    title: string;
    iconUrl: string;
    sliderIconUrl: string;
    min: string;
    max: string;
    minLabel: string;
    maxLabel: string;
  }>;
  styleCheckboxes?: Array<{
    label: string;
  }>;
  styleCheckboxesColumn2?: Array<{
    label: string;
  }>;
};

export const FilterSection = (props: FilterSectionProps) => {
  if (props.variant === "header") {
    return (
      <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:gap-x-[10.624px] md:gap-y-[10.624px]">
        <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:flex md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] h-auto md:items-center md:gap-x-[17.792px] md:h-[42.624px] md:gap-y-[17.792px]">
          <div className="static box-content caret-black shrink min-h-0 min-w-0 outline-black md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] text-base font-normal leading-[normal] text-wrap md:text-[24.832px] md:font-semibold md:leading-[0px] md:text-nowrap">
            <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[35.584px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              Filter
            </p>
          </div>
          <div className="static box-content caret-black shrink min-h-0 min-w-0 outline-black md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] [align-items:normal] gap-x-[normal] block basis-auto grow-0 h-auto justify-normal gap-y-[normal] pt-0 md:items-center md:gap-x-[8.832px] md:flex md:basis-0 md:grow md:h-full md:justify-start md:min-h-px md:min-w-px md:gap-y-[8.832px] md:pt-[8.064px]">
            <button className="static bg-zinc-100 caret-black inline-block shrink min-h-0 min-w-0 outline-black md:relative md:aspect-auto md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] [align-items:normal] gap-x-[normal] justify-normal gap-y-[normal] md:items-center md:bg-transparent md:gap-x-[8.832px] md:flex md:justify-center md:gap-y-[8.832px]">
              <div className="static text-black text-base font-normal box-content caret-black block flex-row shrink justify-normal leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:text-orange-600 md:text-[12.416px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[16.896px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                  Clear All
                </p>
              </div>
            </button>
          </div>
          <button className="bg-zinc-100 caret-black inline-block min-h-0 min-w-0 outline-black md:aspect-auto md:bg-transparent md:caret-transparent md:block md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto]">
            <div className="static box-content caret-black shrink h-auto outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:h-[21.376px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[21.376px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <img
                src="https://c.animaapp.com/mjfsv96lMpH6rC/assets/icon-4.svg"
                alt="Icon"
                className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
              />
            </div>
          </button>
        </div>
        <div className="static box-content caret-black shrink min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] bg-transparent h-auto rounded-none md:bg-white md:h-[71.168px] md:rounded-[17.792px]">
          <div className="static box-content caret-black outline-black md:relative md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] h-auto w-auto md:h-[71.168px] md:w-full md:overflow-clip">
            <a
              href={
                props.consultationUrl ||
                "https://meetings.hubspot.com/watkinshomedesign"
              }
              className="static [align-items:normal] bg-transparent box-content caret-black gap-x-[normal] inline h-auto justify-normal outline-black gap-y-[normal] p-0 rounded-none left-auto top-auto md:absolute md:items-center md:aspect-auto md:bg-rose-50 md:box-border md:caret-transparent md:gap-x-[8.832px] md:flex md:h-[42.624px] md:justify-center md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:overflow-clip md:[mask-position:0%] md:bg-left-top md:px-[14.208px] md:py-[8.832px] md:scroll-m-0 md:scroll-p-[auto] md:rounded-[35.584px] md:left-[176.896px] md:top-[14.208px]"
            >
              <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink h-auto justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] pt-0 md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[8.832px] md:flex md:shrink-0 md:h-full md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:pt-[3.584px] md:scroll-m-0 md:scroll-p-[auto]">
                <div className="static text-black text-base font-normal box-content caret-black block flex-row shrink justify-normal leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:text-orange-600 md:text-[12.416px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                  <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[16.896px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                    {props.consultationText || "Book a consultation"}
                  </p>
                </div>
              </div>
            </a>
            <div className="static box-content caret-black outline-black md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] text-base font-normal block flex-row justify-normal leading-[normal] w-auto left-auto top-auto md:absolute md:text-[12.416px] md:font-semibold md:flex md:flex-col md:justify-center md:leading-[0px] md:w-[120.832px] md:left-[21.376px] md:top-2/4">
              <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black md:aspect-auto md:box-border md:caret-transparent md:leading-[16.896px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                {props.consultationSubtext ||
                  "Need help deciding? Talk to an expert."}
              </p>
            </div>
          </div>
          <div className="static box-content caret-black outline-black md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] pointer-events-auto rounded-none inset-auto md:absolute md:pointer-events-none md:border md:border-stone-200 md:rounded-[17.792px] md:border-solid md:inset-0"></div>
        </div>
      </div>
    );
  }

  if (props.variant === "options-with-checkboxes") {
    return (
      <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] pb-0 border-b-0 md:gap-x-[28.416px] md:gap-y-[28.416px] md:border-stone-200 md:pb-[17.792px] md:border-b md:border-solid">
        <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:flex md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] flex-row md:items-start md:gap-x-[8.832px] md:flex-col md:gap-y-[8.832px]">
          <div className="static box-content caret-black shrink min-h-0 min-w-0 outline-black md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] [align-items:normal] gap-x-[normal] block justify-normal gap-y-[normal] w-auto md:items-center md:gap-x-[10.624px] md:flex md:justify-start md:gap-y-[10.624px] md:w-full">
            <div className="static box-content caret-black shrink h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:h-[17.792px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[17.792px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <img
                src={props.iconUrl}
                alt="Icon"
                className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
              />
            </div>
            <div className="static font-normal box-content caret-black block flex-row shrink justify-normal leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[21.376px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                {props.title}
              </p>
            </div>
          </div>
          <div className="static box-content caret-black shrink min-h-0 min-w-0 outline-black md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] [align-items:normal] gap-x-[normal] block h-auto justify-normal gap-y-[normal] w-auto md:items-center md:gap-x-[5.376px] md:flex md:h-[42.624px] md:justify-start md:min-h-[auto] md:min-w-[auto] md:gap-y-[5.376px] md:w-full">
            {props.options?.map((option, index) => (
              <button
                key={index}
                className="static bg-zinc-100 caret-black inline-block shrink h-auto min-h-0 min-w-0 outline-black w-auto rounded-none md:relative md:aspect-auto md:bg-stone-50 md:caret-transparent md:block md:shrink-0 md:h-[42.624px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[42.624px] md:border md:border-stone-200 md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[44.416px] md:border-solid"
              >
                <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row h-auto justify-normal outline-black gap-y-[normal] p-0 md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[8.832px] md:flex md:flex-col md:h-full md:justify-center md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:overflow-clip md:[mask-position:0%] md:bg-left-top md:px-[14.208px] md:py-[10.624px] md:scroll-m-0 md:scroll-p-[auto]">
                  <div className="static text-base font-normal box-content caret-black block flex-row shrink justify-normal leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:text-[13.312px] md:font-medium md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                    <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[19.584px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                      {option.label}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="static box-content caret-black shrink min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] [align-items:normal] gap-x-[normal] block justify-normal gap-y-[normal] md:items-start md:gap-x-[28.416px] md:flex md:justify-start md:gap-y-[28.416px]">
          {props.checkboxOptions?.map((option, index) => (
            <div
              key={index}
              className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[8.832px] md:flex md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
            >
              <button className="static bg-zinc-100 caret-black inline-block shrink h-auto min-h-0 min-w-0 outline-black w-auto rounded-none md:relative md:aspect-auto md:bg-white md:caret-transparent md:block md:shrink-0 md:h-[21.376px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[21.376px] md:border md:border-stone-200 md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[7.168px] md:border-solid"></button>
              <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] pt-0 md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[8.832px] md:flex md:flex-col md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:pt-[1.792px] md:scroll-m-0 md:scroll-p-[auto]">
                <div className="static text-black text-base font-normal box-content caret-black block flex-row shrink justify-normal leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:text-neutral-700 md:text-[13.312px] md:font-medium md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                  <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[19.584px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                    {option.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (props.variant === "options-only") {
    return (
      <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] pb-0 border-b-0 md:gap-x-[28.416px] md:gap-y-[28.416px] md:border-stone-200 md:pb-[17.792px] md:border-b md:border-solid">
        <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:flex md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] flex-row md:items-start md:gap-x-[8.832px] md:flex-col md:gap-y-[8.832px]">
          <div className="static box-content caret-black shrink min-h-0 min-w-0 outline-black md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] [align-items:normal] gap-x-[normal] block justify-normal gap-y-[normal] w-auto md:items-center md:gap-x-[10.624px] md:flex md:justify-start md:gap-y-[10.624px] md:w-full">
            <div className="static box-content caret-black shrink h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:h-[17.792px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[17.792px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <img
                src={props.iconUrl}
                alt="Icon"
                className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
              />
            </div>
            <div className="static font-normal box-content caret-black block flex-row shrink justify-normal leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[21.376px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                {props.title}
              </p>
            </div>
          </div>
          <div className="static box-content caret-black shrink min-h-0 min-w-0 outline-black md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] [align-items:normal] gap-x-[normal] block h-auto justify-normal gap-y-[normal] w-auto md:items-center md:gap-x-[5.376px] md:flex md:h-[42.624px] md:justify-start md:min-h-[auto] md:min-w-[auto] md:gap-y-[5.376px] md:w-full">
            {props.options?.map((option, index) => (
              <button
                key={index}
                className={
                  option.buttonVariant ||
                  "static bg-zinc-100 caret-black inline-block shrink h-auto min-h-0 min-w-0 outline-black w-auto rounded-none md:relative md:aspect-auto md:bg-stone-50 md:caret-transparent md:block md:shrink-0 md:h-[42.624px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[42.624px] md:border md:border-stone-200 md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[44.416px] md:border-solid"
                }
              >
                <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row h-auto justify-normal outline-black gap-y-[normal] p-0 md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[8.832px] md:flex md:flex-col md:h-full md:justify-center md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:overflow-clip md:[mask-position:0%] md:bg-left-top md:px-[14.208px] md:py-[10.624px] md:scroll-m-0 md:scroll-p-[auto]">
                  <div className="static text-base font-normal box-content caret-black block flex-row shrink justify-normal leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:text-[13.312px] md:font-medium md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                    <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[19.584px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                      {option.label}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (props.variant === "sliders") {
    return (
      <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] pb-0 border-b-0 md:gap-x-[24.32px] md:gap-y-[24.32px] md:border-stone-200 md:pb-[35.584px] md:border-b md:border-solid">
        {props.sliders?.map((slider, index) => (
          <div
            key={index}
            className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row shrink h-auto justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[8.832px] md:flex md:flex-col md:shrink-0 md:h-[87.168px] md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
          >
            <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[10.624px] md:flex md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[10.624px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <div className="static box-content caret-black shrink h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:h-[17.792px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[17.792px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                <img
                  src={slider.iconUrl}
                  alt="Icon"
                  className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
                />
              </div>
              <div className="static font-normal box-content caret-black block flex-row shrink justify-normal leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[21.376px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                  {slider.title}
                </p>
              </div>
            </div>
            <div className="static box-content caret-black shrink h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:h-[42.624px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <div className="static box-content caret-black h-auto outline-black w-auto left-auto top-auto md:absolute md:aspect-auto md:box-border md:caret-transparent md:h-[21.376px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:left-0 md:top-[10.624px]">
                <img
                  src={slider.sliderIconUrl}
                  alt="Icon"
                  className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
                />
              </div>
              <div className="static box-content caret-black outline-black transform-none w-auto z-auto left-auto inset-y-auto md:absolute md:aspect-auto md:bottom-[-3.584px] md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:top-[-3.584px] md:translate-x-[-50.0%] md:w-[28.416px] md:z-10 md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:left-[3.18302%]"></div>
              <div className="static box-content caret-black outline-black transform-none w-auto z-auto left-auto inset-y-auto md:absolute md:aspect-auto md:bottom-[-3.584px] md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:top-[-3.584px] md:translate-x-[-50.0%] md:w-[28.416px] md:z-10 md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:left-[96.817%]"></div>
              <div className="static text-black text-base box-content caret-black block leading-[normal] outline-black left-auto bottom-auto md:absolute md:text-stone-400 md:text-[13.312px] md:aspect-auto md:bottom-[-5.376px] md:box-border md:caret-transparent md:hidden md:leading-[19.584px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:left-[10.624px]">
                {slider.min}
              </div>
              <div className="static text-black text-base box-content caret-black block leading-[normal] outline-black right-auto bottom-auto md:absolute md:text-stone-400 md:text-[13.312px] md:aspect-auto md:bottom-[-5.376px] md:box-border md:caret-transparent md:hidden md:leading-[19.584px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:right-[10.624px]">
                {slider.max}
              </div>
              <div className="static text-base font-normal box-content caret-black leading-[normal] outline-black pointer-events-auto left-auto top-auto md:absolute md:text-[13.312px] md:font-medium md:aspect-auto md:box-border md:caret-transparent md:leading-[19.584px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:pointer-events-none md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:top-[-5.376px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:left-[3.18302%]">
                {slider.minLabel}
              </div>
              <div className="static text-base font-normal box-content caret-black leading-[normal] outline-black pointer-events-auto left-auto top-auto md:absolute md:text-[13.312px] md:font-medium md:aspect-auto md:box-border md:caret-transparent md:leading-[19.584px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:pointer-events-none md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:top-[-5.376px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:left-[96.817%]">
                {slider.maxLabel}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (props.variant === "styles") {
    return (
      <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] pb-0 md:gap-x-[21.376px] md:gap-y-[21.376px] md:pb-[17.792px]">
        <div className="static box-content caret-black shrink min-h-0 min-w-0 outline-black md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] [align-items:normal] gap-x-[normal] block justify-normal gap-y-[normal] w-auto md:items-center md:gap-x-[10.624px] md:flex md:justify-start md:gap-y-[10.624px] md:w-full">
          <div className="static box-content caret-black shrink h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:h-[17.792px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[17.792px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <img
              src={props.iconUrl}
              alt="Icon"
              className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
            />
          </div>
          <div className="static font-normal box-content caret-black block flex-row shrink justify-normal leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[21.376px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              {props.title}
            </p>
          </div>
        </div>
        <div className="static box-content caret-black shrink min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] [align-items:normal] gap-x-[normal] block justify-normal gap-y-[normal] md:items-start md:gap-x-[28.416px] md:flex md:justify-start md:gap-y-[28.416px]">
          <div className="static box-content caret-black outline-black md:relative md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] [align-items:normal] gap-x-[normal] block flex-row shrink justify-normal min-h-0 min-w-0 gap-y-[normal] md:items-start md:gap-x-[14.208px] md:flex md:flex-col md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:gap-y-[14.208px]">
            {props.styleCheckboxes?.map((option, index) => (
              <div
                key={index}
                className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[8.832px] md:flex md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
              >
                <button className="static bg-zinc-100 caret-black inline-block shrink h-auto min-h-0 min-w-0 outline-black w-auto rounded-none md:relative md:aspect-auto md:bg-white md:caret-transparent md:block md:shrink-0 md:h-[21.376px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[21.376px] md:border md:border-stone-200 md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[7.168px] md:border-solid"></button>
                <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] pt-0 md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[8.832px] md:flex md:flex-col md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:pt-[1.792px] md:scroll-m-0 md:scroll-p-[auto]">
                  <div className="static text-black text-base font-normal box-content caret-black block flex-row shrink justify-normal leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:text-neutral-700 md:text-[13.312px] md:font-medium md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                    <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[19.584px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                      {option.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="static box-content caret-black outline-black md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] [align-items:normal] gap-x-[normal] block basis-auto flex-row grow-0 shrink justify-normal min-h-0 min-w-0 gap-y-[normal] md:relative md:items-start md:gap-x-[14.208px] md:flex md:basis-[0%] md:flex-col md:grow md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:gap-y-[14.208px]">
            {props.styleCheckboxesColumn2?.map((option, index) => (
              <div
                key={index}
                className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[8.832px] md:flex md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
              >
                <button className="static bg-zinc-100 caret-black inline-block shrink h-auto min-h-0 min-w-0 outline-black w-auto rounded-none md:relative md:aspect-auto md:bg-white md:caret-transparent md:block md:shrink-0 md:h-[21.376px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[21.376px] md:border md:border-stone-200 md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[7.168px] md:border-solid"></button>
                <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] pt-0 md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[8.832px] md:flex md:flex-col md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:pt-[1.792px] md:scroll-m-0 md:scroll-p-[auto]">
                  <div className="static text-black text-base font-normal box-content caret-black block flex-row shrink justify-normal leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:text-neutral-700 md:text-[13.312px] md:font-medium md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                    <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[19.584px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                      {option.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
