export type HouseInfoProps = {
  title: string;
  squareFeet: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  garages: string;
  stories: string;
};

export const HouseInfo = (props: HouseInfoProps) => {
  const icons = {
    house: "/icons/house-simple-white.svg",
    arrow: "/icons/arrow-top-right-black.svg",
    bed: "/icons/bed-black.svg",
    bath: "/icons/bath-black.svg",
    garage: "/icons/garage-black.svg",
    stories: "/icons/layers-black.svg",
  } as const;

  return (
    <div className="static box-content caret-black min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
      <div className="static box-content caret-black h-auto outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:overflow-clip md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row justify-normal outline-black gap-y-[normal] w-auto pt-0 md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[21.376px] md:flex md:flex-col md:justify-start md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[21.376px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:pt-[17.792px] md:scroll-m-0 md:scroll-p-[auto]">
          <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[12.416px] md:flex md:justify-between md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[12.416px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block basis-auto grow-0 justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[12.416px] md:flex md:basis-0 md:grow md:justify-start md:min-h-px md:min-w-px md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[12.416px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <div className="box-content caret-black h-auto min-h-0 min-w-0 outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-[44.416px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[44.416px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                <button className="static bg-zinc-100 caret-black h-auto outline-black w-auto rounded-none md:relative md:aspect-auto md:bg-orange-600 md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[3.35544e+07px]">
                  <div className="static [align-items:normal] box-content caret-black block h-auto justify-normal outline-black w-auto md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:h-full md:justify-center md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                    <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block h-auto justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[8.88px] md:flex md:h-full md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.88px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:overflow-clip md:[mask-position:0%] md:bg-left-top md:p-[11.52px] md:scroll-m-0 md:scroll-p-[auto]">
                      <div className="static box-content caret-black shrink h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:h-[17.792px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[17.792px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                        <img
                          src={icons.house}
                          alt="Icon"
                          className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
                        />
                      </div>
                    </div>
                  </div>
                </button>
              </div>
              <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block basis-auto flex-row grow-0 justify-normal leading-[normal] min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[3.584px] md:flex md:basis-0 md:flex-col md:grow md:justify-start md:leading-[0px] md:min-h-px md:min-w-px md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[3.584px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                <div className="static text-base font-normal box-content caret-black min-h-0 min-w-0 outline-black w-auto md:relative md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                  <p className="box-content caret-black leading-[normal] outline-black break-normal md:aspect-auto md:box-border md:caret-transparent md:leading-[21.376px] md:outline-[oklab(0.708_0_0_/_0.5)] md:break-words md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                    {props.title}
                  </p>
                </div>
                <div className="static text-black text-base box-content caret-black min-h-0 min-w-0 outline-black w-auto md:relative md:text-stone-400 md:text-[13.312px] md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                  <p className="box-content caret-black leading-[normal] outline-black break-normal md:aspect-auto md:box-border md:caret-transparent md:leading-[19.584px] md:outline-[oklab(0.708_0_0_/_0.5)] md:break-words md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                    {props.squareFeet}
                  </p>
                </div>
              </div>
            </div>
            <button className="static [align-items:normal] bg-zinc-100 caret-black gap-x-[normal] inline-block h-auto justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto rounded-none md:relative md:items-center md:aspect-auto md:bg-rose-50 md:caret-transparent md:gap-x-[8.832px] md:flex md:h-[44.416px] md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[44.416px] md:overflow-clip md:[mask-position:0%] md:bg-left-top md:p-[11.52px] md:scroll-m-0 md:scroll-p-[auto] md:rounded-[100px]">
              <div className="box-content caret-black min-h-0 min-w-0 outline-black md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                <div className="static box-content caret-black h-auto outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:h-[21.376px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[21.376px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                  <img
                    src={icons.arrow}
                    alt="Icon"
                    className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
                  />
                </div>
              </div>
            </button>
          </div>
          <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[12.416px] md:flex md:flex-col md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[12.416px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block justify-normal leading-[normal] min-h-0 min-w-0 outline-black gap-y-[normal] text-wrap md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[7.168px] md:flex md:justify-start md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[7.168px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <div className="static text-black text-base box-content caret-black min-h-0 min-w-0 outline-black text-wrap md:relative md:text-stone-400 md:text-[13.312px] md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:overflow-hidden md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                <p className="box-content caret-black leading-[normal] outline-black break-normal md:aspect-auto md:box-border md:caret-transparent md:leading-[19.584px] md:outline-[oklab(0.708_0_0_/_0.5)] md:break-words md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                  starting at
                </p>
              </div>
              <div className="static text-black text-base font-normal box-content caret-black min-h-0 min-w-0 outline-black text-wrap md:relative md:text-orange-600 md:text-[17.792px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:overflow-hidden md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                <p className="box-content caret-black leading-[normal] outline-black break-normal md:aspect-auto md:box-border md:caret-transparent md:leading-[26.624px] md:outline-[oklab(0.708_0_0_/_0.5)] md:break-words md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                  {props.price}
                </p>
              </div>
            </div>
            <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-nowrap justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[23.04px] md:flex md:flex-wrap md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[7.68px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <div className="static bg-transparent box-content caret-black min-h-0 min-w-0 outline-black rounded-none md:relative md:aspect-auto md:bg-white md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[50px]">
                <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block justify-normal outline-black gap-y-[normal] p-0 md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[5.376px] md:flex md:justify-center md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[5.376px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:overflow-clip md:[mask-position:0%] md:bg-left-top md:px-[14.208px] md:py-[7.168px] md:scroll-m-0 md:scroll-p-[auto]">
                  <div className="static box-content caret-black h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:h-[17.792px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[17.792px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                    <img
                      src={icons.bed}
                      alt="Icon"
                      className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
                    />
                  </div>
                  <div className="static text-base font-normal box-content caret-black block flex-row justify-normal leading-[normal] min-h-0 min-w-0 outline-black md:relative md:text-[13.312px] md:font-medium md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:justify-center md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:overflow-hidden md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                    <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black break-normal md:aspect-auto md:box-border md:caret-transparent md:leading-[19.584px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:break-words md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                      {props.bedrooms}
                    </p>
                  </div>
                </div>
                <div className="static box-content caret-black outline-black pointer-events-auto rounded-none inset-auto md:absolute md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:pointer-events-none md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:border md:border-stone-200 md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[50px] md:border-solid md:inset-0"></div>
              </div>
              <div className="static bg-transparent box-content caret-black min-h-0 min-w-0 outline-black rounded-none md:relative md:aspect-auto md:bg-white md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[50px]">
                <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block justify-normal outline-black gap-y-[normal] p-0 md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[5.376px] md:flex md:justify-center md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[5.376px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:overflow-clip md:[mask-position:0%] md:bg-left-top md:px-[14.208px] md:py-[7.168px] md:scroll-m-0 md:scroll-p-[auto]">
                  <div className="static box-content caret-black h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:h-[17.792px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[17.792px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                    <img
                      src={icons.bath}
                      alt="Icon"
                      className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
                    />
                  </div>
                  <div className="static text-base font-normal box-content caret-black block flex-row justify-normal leading-[normal] min-h-0 min-w-0 outline-black md:relative md:text-[13.312px] md:font-medium md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:justify-center md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:overflow-hidden md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                    <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black break-normal md:aspect-auto md:box-border md:caret-transparent md:leading-[19.584px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:break-words md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                      {props.bathrooms}
                    </p>
                  </div>
                </div>
                <div className="static box-content caret-black outline-black pointer-events-auto rounded-none inset-auto md:absolute md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:pointer-events-none md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:border md:border-stone-200 md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[50px] md:border-solid md:inset-0"></div>
              </div>
              <div className="static bg-transparent box-content caret-black min-h-0 min-w-0 outline-black rounded-none md:relative md:aspect-auto md:bg-white md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[50px]">
                <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block justify-normal outline-black gap-y-[normal] p-0 md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[5.376px] md:flex md:justify-center md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[5.376px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:overflow-clip md:[mask-position:0%] md:bg-left-top md:px-[14.208px] md:py-[7.168px] md:scroll-m-0 md:scroll-p-[auto]">
                  <div className="static box-content caret-black h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:h-[17.792px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[17.792px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                    <img
                      src={icons.garage}
                      alt="Icon"
                      className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
                    />
                  </div>
                  <div className="static text-base font-normal box-content caret-black block flex-row justify-normal leading-[normal] min-h-0 min-w-0 outline-black md:relative md:text-[13.312px] md:font-medium md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:justify-center md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:overflow-hidden md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                    <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black break-normal md:aspect-auto md:box-border md:caret-transparent md:leading-[19.584px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:break-words md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                      {props.garages}
                    </p>
                  </div>
                </div>
                <div className="static box-content caret-black outline-black pointer-events-auto rounded-none inset-auto md:absolute md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:pointer-events-none md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:border md:border-stone-200 md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[50px] md:border-solid md:inset-0"></div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
