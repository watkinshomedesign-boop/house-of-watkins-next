import Link from "next/link";

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
  selectedOptions?: string[];
  selectedCheckboxes?: Record<string, boolean>;
  selectedSingle?: string | null;
  sliderValues?: Record<string, number | null>;
  onToggleOption?: (label: string) => void;
  onToggleCheckbox?: (label: string) => void;
  onSelectSingle?: (label: string) => void;
  onSliderChange?: (title: string, value: number | null) => void;
  onClearAll?: () => void;
  onClose?: () => void;
  onShowResults?: () => void;
  showResultsLabel?: string;
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
  const isOptionSelected = (label: string) => (props.selectedOptions ?? []).includes(label);
  const isCheckboxSelected = (label: string) => Boolean(props.selectedCheckboxes?.[label]);

  const MobileInfoIcon = (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="h-[18px] w-[18px] text-stone-400"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 9v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 6.4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  if (props.variant === "header") {
    return (
      <>
        <div className="md:hidden">
          <div className="flex items-center justify-between">
            <div className="text-[18px] font-semibold text-zinc-900">{props.title || "Filter"}</div>
            {props.showCloseButton && props.onClose ? (
              <button
                type="button"
                onClick={props.onClose}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-50"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="h-4 w-4 text-zinc-900"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            ) : null}
          </div>

          {props.showConsultation ? (
            <div className="mt-4 rounded-[16px] border border-stone-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-zinc-900">
                    <span>Need help deciding?</span>
                    <span className="shrink-0">{MobileInfoIcon}</span>
                  </div>
                  <div className="mt-1 text-[12px] text-zinc-600">Talk to an expert.</div>
                </div>

                <Link
                  href={props.consultationUrl || "https://meetings.hubspot.com/watkinshomedesign"}
                  className="shrink-0 rounded-full bg-[#FFEFEB] px-4 py-2 text-[12px] font-semibold text-orange-600"
                >
                  {props.consultationText || "Book a consultation"}
                </Link>
              </div>
            </div>
          ) : null}
        </div>

        <div className="hidden md:block">
          <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:gap-x-[10.624px] md:gap-y-[10.624px]">
            <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:flex md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] h-auto md:items-center md:gap-x-[17.792px] md:h-[42.624px] md:gap-y-[17.792px]">
              <div className="static box-content caret-black shrink min-h-0 min-w-0 outline-black md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] text-base font-normal leading-[normal] text-wrap md:text-[24.832px] md:font-semibold md:leading-[0px] md:text-nowrap">
                <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[35.584px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                  Filter
                </p>
              </div>
              <div className="static box-content caret-black shrink min-h-0 min-w-0 outline-black md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] [align-items:normal] gap-x-[normal] block basis-auto grow-0 h-auto justify-normal gap-y-[normal] pt-0 md:items-center md:gap-x-[8.832px] md:flex md:basis-0 md:grow md:h-full md:justify-start md:min-h-px md:min-w-px md:gap-y-[8.832px] md:pt-[8.064px]">
                {props.showClearAll ? (
                  <button
                    type="button"
                    onClick={props.onClearAll}
                    className="static bg-zinc-100 caret-black inline-block shrink min-h-0 min-w-0 outline-black md:relative md:aspect-auto md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] [align-items:normal] gap-x-[normal] justify-normal gap-y-[normal] md:items-center md:bg-transparent md:gap-x-[8.832px] md:flex md:justify-center md:gap-y-[8.832px]"
                  >
                    <div className="static text-black text-base font-normal box-content caret-black block flex-row shrink justify-normal leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:text-orange-600 md:text-[12.416px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                      <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[16.896px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                        Clear All
                      </p>
                    </div>
                  </button>
                ) : null}
              </div>
              {props.showCloseButton && props.onClose ? (
                <button
                  type="button"
                  onClick={props.onClose}
                  className="bg-zinc-100 caret-black inline-block min-h-0 min-w-0 outline-black md:aspect-auto md:bg-transparent md:caret-transparent md:block md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto]"
                >
                  <div className="static box-content caret-black shrink h-auto outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:h-[21.376px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[21.376px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                    <img
                      src={props.iconUrl || "/placeholders/icon-15.svg"}
                      alt="Icon"
                      className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
                    />
                  </div>
                </button>
              ) : null}
            </div>

            {props.showConsultation ? (
              <div className="static box-content caret-black shrink min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] bg-transparent h-auto rounded-none md:bg-white md:h-[71.168px] md:rounded-[17.792px]">
                <div className="static box-content caret-black outline-black md:relative md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] h-auto w-auto md:h-[71.168px] md:w-full md:overflow-clip lg:flex lg:items-center lg:justify-between lg:px-6 lg:overflow-visible">
                  <Link
                    href={props.consultationUrl || "https://meetings.hubspot.com/watkinshomedesign"}
                    className="static [align-items:normal] bg-transparent box-content caret-black gap-x-[normal] inline h-auto justify-normal outline-black gap-y-[normal] p-0 rounded-none left-auto top-auto md:absolute md:items-center md:aspect-auto md:bg-rose-50 md:box-border md:caret-transparent md:gap-x-[8.832px] md:flex md:h-[42.624px] md:justify-center md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:overflow-clip md:[mask-position:0%] md:bg-left-top md:px-[14.208px] md:py-[8.832px] md:scroll-m-0 md:scroll-p-[auto] md:rounded-[35.584px] md:left-[176.896px] md:top-[14.208px] lg:static lg:order-2 lg:bg-[#FFEFEB] lg:translate-x-[10px]"
                  >
                    <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink h-auto justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] pt-0 md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[8.832px] md:flex md:shrink-0 md:h-full md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:pt-[3.584px] md:scroll-m-0 md:scroll-p-[auto]">
                      <div className="static text-black text-base font-normal box-content caret-black block flex-row shrink justify-normal leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:text-orange-600 md:text-[12.416px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] lg:text-[#FF5C02]">
                        <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[16.896px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                          {props.consultationText || "Book a Consultation"}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="static box-content caret-black outline-black md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] text-base font-normal block flex-row justify-normal leading-[normal] w-auto left-auto top-auto md:absolute md:text-[12.416px] md:font-semibold md:flex md:flex-col md:justify-center md:leading-[0px] md:w-[120.832px] md:left-[21.376px] md:top-2/4 lg:static lg:order-1 lg:w-auto lg:-translate-x-[5px]">
                    <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black md:aspect-auto md:box-border md:caret-transparent md:leading-[16.896px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                      {(() => {
                        const text = props.consultationSubtext || "Need help deciding? Talk to an expert.";
                        const match = text.match(/^(.*?\?)(?:\s+)(.*)$/);
                        if (!match) return text;
                        return (
                          <>
                            {match[1]}
                            <br className="hidden lg:block" />
                            <span className="lg:block">{match[2]}</span>
                          </>
                        );
                      })()}
                    </p>
                  </div>
                </div>
                <div className="static box-content caret-black outline-black md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] pointer-events-auto rounded-none inset-auto md:absolute md:pointer-events-none md:border md:border-stone-200 md:rounded-[17.792px] md:border-solid md:inset-0"></div>
              </div>
            ) : null}
          </div>
        </div>
      </>
    );
  }

  if (props.variant === "options-with-checkboxes") {
    return (
      <>
        <div className="md:hidden">
          <div className="border-b border-stone-200 pb-5">
            <div className="flex items-center gap-2">
              {props.iconUrl ? (
                <img src={props.iconUrl} alt="Icon" className="h-[18px] w-[18px]" />
              ) : null}
              <div className="text-[14px] font-semibold text-zinc-900">{props.title}</div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {props.options?.map((option, index) => {
                const selected = isOptionSelected(option.label);
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => props.onToggleOption?.(option.label)}
                    className={
                      selected
                        ? "rounded-full bg-orange-600 px-4 py-2 text-[13px] font-semibold text-white"
                        : "rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-[13px] font-semibold text-zinc-900"
                    }
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            {props.checkboxOptions?.length ? (
              <div className="mt-4 grid gap-3">
                {props.checkboxOptions.map((option, index) => {
                  const checked = isCheckboxSelected(option.label);
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => props.onToggleCheckbox?.(option.label)}
                      className="flex items-center gap-3 text-left"
                    >
                      <span
                        className={
                          checked
                            ? "flex h-5 w-5 items-center justify-center rounded-md bg-orange-600"
                            : "flex h-5 w-5 items-center justify-center rounded-md border border-stone-200 bg-white"
                        }
                      >
                        {checked ? (
                          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                            <path d="M16.5 5.5 8.25 13.75 4 9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : null}
                      </span>
                      <span className="text-[13px] font-medium text-zinc-900">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        <div className="hidden md:block">
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
                {(props.title === "Bedrooms" ? props.options?.filter((o) => o.label !== "6") : props.options)?.map((option, index) => {
                  const selected = isOptionSelected(option.label);
                  const circleChip = /^\d/.test(option.label);

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => props.onToggleOption?.(option.label)}
                      className={
                        selected
                          ? `static text-black bg-zinc-100 caret-black inline-block shrink h-auto min-h-0 min-w-0 outline-black rounded-none md:relative md:text-white md:aspect-auto md:bg-orange-600 md:caret-transparent md:block md:shrink-0 md:h-[42.624px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[44.416px] lg:bg-[#FF5C02]${circleChip ? " lg:w-[51.2px] lg:h-[51.2px]" : ""}`
                          : `static bg-zinc-100 caret-black inline-block shrink h-auto min-h-0 min-w-0 outline-black w-auto rounded-none md:relative md:aspect-auto md:bg-stone-50 md:caret-transparent md:block md:shrink-0 md:h-[42.624px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[42.624px] md:border md:border-stone-200 md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[44.416px] md:border-solid${circleChip ? " lg:w-[51.2px] lg:h-[51.2px]" : ""}`
                      }
                    >
                      <div className={`static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row h-auto justify-normal outline-black gap-y-[normal] p-0 md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[8.832px] md:flex md:flex-col md:h-full md:justify-center md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:overflow-clip md:[mask-position:0%] md:bg-left-top md:px-[14.208px] md:py-[10.624px] md:scroll-m-0 md:scroll-p-[auto]${circleChip ? " lg:px-0" : ""}`}
                      >
                        <div className="static text-base font-normal box-content caret-black block flex-row shrink justify-normal leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:text-[13.312px] md:font-medium md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                          <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[19.584px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                            {option.label}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="static box-content caret-black shrink min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] [align-items:normal] gap-x-[normal] block justify-normal gap-y-[normal] md:items-start md:gap-x-[28.416px] md:flex md:justify-start md:gap-y-[28.416px]">
              {props.checkboxOptions?.map((option, index) => (
                <div
                  key={index}
                  className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[8.832px] md:flex md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
                >
                  <button
                    type="button"
                    onClick={() => props.onToggleCheckbox?.(option.label)}
                    className={
                      isCheckboxSelected(option.label)
                        ? "static bg-zinc-100 caret-black inline-block shrink h-auto min-h-0 min-w-0 outline-black w-auto rounded-none md:relative md:aspect-auto md:bg-orange-600 md:caret-transparent md:block md:shrink-0 md:h-[21.376px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[21.376px] md:border md:border-orange-600 md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[7.168px] md:border-solid lg:flex lg:items-center lg:justify-center lg:bg-[#FF5C02] lg:border-[#FF5C02]"
                        : "static bg-zinc-100 caret-black inline-block shrink h-auto min-h-0 min-w-0 outline-black w-auto rounded-none md:relative md:aspect-auto md:bg-white md:caret-transparent md:block md:shrink-0 md:h-[21.376px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[21.376px] md:border md:border-stone-200 md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[7.168px] md:border-solid lg:flex lg:items-center lg:justify-center"
                    }
                  >
                    {isCheckboxSelected(option.label) ? (
                      <svg viewBox="0 0 20 20" fill="none" className="hidden h-4 w-4 lg:block" aria-hidden="true">
                        <path d="M16.5 5.5 8.25 13.75 4 9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : null}
                  </button>
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
      </>
    );
  }

  if (props.variant === "options-only") {
    return (
      <>
        <div className="md:hidden">
          <div className="border-b border-stone-200 pb-5">
            <div className="flex items-center gap-2">
              {props.iconUrl ? <img src={props.iconUrl} alt="Icon" className="h-[18px] w-[18px]" /> : null}
              <div className="text-[14px] font-semibold text-zinc-900">{props.title}</div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {props.options?.map((option, index) => {
                const selected = props.onSelectSingle
                  ? (props.selectedSingle ?? null) === option.label
                  : isOptionSelected(option.label);

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      if (props.onSelectSingle) return props.onSelectSingle(option.label);
                      props.onToggleOption?.(option.label);
                    }}
                    className={
                      selected
                        ? "rounded-full bg-orange-600 px-4 py-2 text-[13px] font-semibold text-white"
                        : "rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-[13px] font-semibold text-zinc-900"
                    }
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="hidden md:block">
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
                    type="button"
                    onClick={() => {
                      if (props.onSelectSingle) return props.onSelectSingle(option.label);
                      props.onToggleOption?.(option.label);
                    }}
                    className={
                      props.onSelectSingle
                        ? (props.selectedSingle ?? null) === option.label
                          ? "static text-black bg-zinc-100 caret-black inline-block shrink h-auto min-h-0 min-w-0 outline-black rounded-none md:relative md:text-white md:aspect-auto md:bg-orange-600 md:caret-transparent md:block md:shrink-0 md:h-[42.624px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[44.416px] lg:w-[51.2px] lg:h-[51.2px]"
                          : (option.buttonVariant ||
                            "static bg-zinc-100 caret-black inline-block shrink h-auto min-h-0 min-w-0 outline-black w-auto rounded-none md:relative md:aspect-auto md:bg-stone-50 md:caret-transparent md:block md:shrink-0 md:h-[42.624px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[42.624px] md:border md:border-stone-200 md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[44.416px] md:border-solid lg:w-[51.2px] lg:h-[51.2px]")
                        : isOptionSelected(option.label)
                          ? "static text-black bg-zinc-100 caret-black inline-block shrink h-auto min-h-0 min-w-0 outline-black rounded-none md:relative md:text-white md:aspect-auto md:bg-orange-600 md:caret-transparent md:block md:shrink-0 md:h-[42.624px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[44.416px] lg:w-[51.2px] lg:h-[51.2px]"
                          : (option.buttonVariant ||
                            "static bg-zinc-100 caret-black inline-block shrink h-auto min-h-0 min-w-0 outline-black w-auto rounded-none md:relative md:aspect-auto md:bg-stone-50 md:caret-transparent md:block md:shrink-0 md:h-[42.624px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[42.624px] md:border md:border-stone-200 md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[44.416px] md:border-solid lg:w-[51.2px] lg:h-[51.2px]")
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
        </div>
      </>
    );
  }

  if (props.variant === "sliders") {
    return (
      <>
        <div className="md:hidden">
          <div className="border-b border-stone-200 pb-5">
            <div className="grid gap-5">
              {props.sliders?.map((slider, index) => {
                const max = Number(slider.max);
                const current = props.sliderValues?.[slider.title];
                const value = current == null ? max : Number(current);

                return (
                  <div key={index}>
                    <div className="flex items-center gap-2">
                      {slider.iconUrl ? <img src={slider.iconUrl} alt="Icon" className="h-[18px] w-[18px]" /> : null}
                      <div className="text-[14px] font-semibold text-zinc-900">{slider.title}</div>
                    </div>

                    <div className="mt-3">
                      <input
                        type="range"
                        min={Number(slider.min)}
                        max={Number(slider.max)}
                        step={1}
                        value={value}
                        onChange={(e) => {
                          const next = Number(e.target.value);
                          props.onSliderChange?.(slider.title, next === max ? null : next);
                        }}
                        className="w-full accent-orange-600"
                      />
                      <div className="mt-1 flex items-center justify-between text-[12px] text-stone-500">
                        <span>{slider.minLabel}</span>
                        <span>{slider.maxLabel}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] pb-0 border-b-0 md:gap-x-[24.32px] md:gap-y-[24.32px] md:border-stone-200 md:pb-[35.584px] md:border-b md:border-solid">
            {props.sliders?.map((slider, index) => {
              const max = Number(slider.max);
              const current = props.sliderValues?.[slider.title];
              const value = current == null ? max : Number(current);

              return (
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
                <div className="static box-content caret-black shrink h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:h-[42.624px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] lg:w-[130%] lg:max-w-none lg:overflow-visible">
                  <input
                    type="range"
                    min={Number(slider.min)}
                    max={Number(slider.max)}
                    step={1}
                    value={value}
                    onChange={(e) => {
                      const next = Number(e.target.value);
                      props.onSliderChange?.(slider.title, next === max ? null : next);
                    }}
                    className="w-full accent-[#FF5C02]"
                  />
                  <div className="mt-1 flex items-center justify-between text-[12px] text-stone-500">
                    <span>{slider.minLabel}</span>
                    <span>{slider.maxLabel}</span>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  if (props.variant === "styles") {
    return (
      <>
        <div className="md:hidden">
          <div className="pb-2">
            <div className="flex items-center gap-2">
              {props.iconUrl ? <img src={props.iconUrl} alt="Icon" className="h-[18px] w-[18px]" /> : null}
              <div className="text-[14px] font-semibold text-zinc-900">{props.title}</div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
              {[...(props.styleCheckboxes ?? []), ...(props.styleCheckboxesColumn2 ?? [])].map((option, index) => {
                const checked = isOptionSelected(option.label);
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => props.onToggleOption?.(option.label)}
                    className="flex items-center gap-3 text-left"
                  >
                    <span
                      className={
                        checked
                          ? "flex h-5 w-5 items-center justify-center rounded-md bg-orange-600"
                          : "flex h-5 w-5 items-center justify-center rounded-md border border-stone-200 bg-white"
                      }
                    >
                      {checked ? (
                        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                          <path d="M16.5 5.5 8.25 13.75 4 9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : null}
                    </span>
                    <span className="text-[13px] font-medium text-zinc-900">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="hidden md:block">
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
                    <button
                      type="button"
                      onClick={() => props.onToggleOption?.(option.label)}
                      className={
                        isOptionSelected(option.label)
                          ? "static bg-zinc-100 caret-black inline-block shrink h-auto min-h-0 min-w-0 outline-black w-auto rounded-none md:relative md:aspect-auto md:bg-orange-600 md:caret-transparent md:block md:shrink-0 md:h-[21.376px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[21.376px] md:border md:border-orange-600 md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[7.168px] md:border-solid lg:flex lg:items-center lg:justify-center lg:bg-[#FF5C02] lg:border-[#FF5C02]"
                          : "static bg-zinc-100 caret-black inline-block shrink h-auto min-h-0 min-w-0 outline-black w-auto rounded-none md:relative md:aspect-auto md:bg-white md:caret-transparent md:block md:shrink-0 md:h-[21.376px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[21.376px] md:border md:border-stone-200 md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[7.168px] md:border-solid lg:flex lg:items-center lg:justify-center"
                      }
                    >
                      {isOptionSelected(option.label) ? (
                        <svg viewBox="0 0 20 20" fill="none" className="hidden h-4 w-4 lg:block" aria-hidden="true">
                          <path d="M16.5 5.5 8.25 13.75 4 9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : null}
                    </button>
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
                    <button
                      type="button"
                      onClick={() => props.onToggleOption?.(option.label)}
                      className={
                        isOptionSelected(option.label)
                          ? "static bg-zinc-100 caret-black inline-block shrink h-auto min-h-0 min-w-0 outline-black w-auto rounded-none md:relative md:aspect-auto md:bg-orange-600 md:caret-transparent md:block md:shrink-0 md:h-[21.376px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[21.376px] md:border md:border-orange-600 md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[7.168px] md:border-solid lg:flex lg:items-center lg:justify-center lg:bg-[#FF5C02] lg:border-[#FF5C02]"
                          : "static bg-zinc-100 caret-black inline-block shrink h-auto min-h-0 min-w-0 outline-black w-auto rounded-none md:relative md:aspect-auto md:bg-white md:caret-transparent md:block md:shrink-0 md:h-[21.376px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[21.376px] md:border md:border-stone-200 md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[7.168px] md:border-solid lg:flex lg:items-center lg:justify-center"
                      }
                    >
                      {isOptionSelected(option.label) ? (
                        <svg viewBox="0 0 20 20" fill="none" className="hidden h-4 w-4 lg:block" aria-hidden="true">
                          <path d="M16.5 5.5 8.25 13.75 4 9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : null}
                    </button>
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
        </div>
      </>
    );
  }

  return null;
};
