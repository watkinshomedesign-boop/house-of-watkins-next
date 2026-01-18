export type FooterColumnProps = {
  variant: "company" | "social" | "contact";
};

export const FooterColumn = (props: FooterColumnProps) => {
  if (props.variant === "company") {
    return (
      <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-start md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] h-auto w-auto md:gap-x-[35.584px] md:h-[167.168px] md:min-h-[auto] md:min-w-[auto] md:gap-y-[35.584px] md:w-[278.272px]">
        <div className="static box-content caret-black shrink min-h-0 min-w-0 outline-black md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] [align-items:normal] block basis-auto grow-0 justify-normal w-auto md:items-start md:flex md:basis-0 md:grow md:justify-between md:min-h-px md:min-w-px md:w-full">
          <button className="[align-items:normal] bg-zinc-100 caret-black inline-block shrink justify-normal min-h-0 min-w-0 outline-black w-auto md:items-center md:aspect-auto md:bg-transparent md:caret-transparent md:flex md:shrink-0 md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[94.128px] md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto]">
            <img
              src="https://c.animaapp.com/mjfsv96lMpH6rC/assets/7463e3f5c3028d68d3703759460ee8a953ff2de0.png"
              alt="Logo"
              className="box-content caret-black max-w-none min-h-0 min-w-0 outline-black md:aspect-auto md:box-border md:caret-transparent md:max-w-full md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
            />
          </button>
          <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row shrink justify-normal leading-[normal] min-h-0 min-w-0 outline-black gap-y-[normal] text-wrap md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[14.208px] md:flex md:flex-col md:shrink-0 md:justify-start md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[14.208px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <div className="static text-black text-base font-normal box-content caret-black shrink min-h-0 min-w-0 outline-black text-wrap md:relative md:text-white md:text-[17.792px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[26.624px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                Company
              </p>
            </div>
            <button className="static text-black text-[13.3333px] bg-zinc-100 caret-black inline-block flex-row shrink justify-normal min-h-0 min-w-0 outline-black text-wrap md:relative md:text-stone-400 md:text-base md:aspect-auto md:bg-transparent md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto]">
              <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[24.832px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                About us
              </p>
            </button>
            <a
              href="/catalog"
              className="static text-black text-base box-content caret-black inline flex-row shrink justify-normal min-h-0 min-w-0 outline-black text-wrap md:relative md:text-stone-400 md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
            >
              <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[24.832px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                All Houses
              </p>
            </a>
          </div>
        </div>
        <div className="box-content caret-black block min-h-0 min-w-0 outline-black md:aspect-auto md:box-border md:caret-transparent md:flex md:min-h-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] [align-items:normal] gap-x-[normal] gap-y-[normal] md:items-center md:gap-x-[7.104px] md:min-w-[auto] md:gap-y-[7.104px]">
          <div className="static text-black text-base font-normal box-content caret-black block basis-auto flex-row grow-0 shrink justify-normal leading-[normal] min-h-0 min-w-0 outline-black text-start text-wrap md:relative md:text-white md:text-[12.416px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:flex md:basis-[0%] md:flex-col md:grow md:shrink-0 md:justify-center md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:text-center md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[16.896px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              © 2025
            </p>
          </div>
          <button
            title="Admin Login"
            className="text-black [align-items:normal] bg-zinc-100 caret-black inline-block h-auto justify-normal min-h-0 min-w-0 outline-black w-auto rounded-none md:text-stone-400 md:items-center md:aspect-auto md:bg-[oklab(0.646961_0.000300229_0.00315607_/_0.2)] md:caret-transparent md:flex md:h-[28.416px] md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[28.416px] md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[3.35544e+07px]"
          >
            <img
              src="https://c.animaapp.com/mjfsv96lMpH6rC/assets/icon-22.svg"
              alt="Icon"
              className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-[17.76px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[17.76px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
            />
          </button>
        </div>
      </div>
    );
  }

  if (props.variant === "social") {
    return (
      <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-start md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] basis-auto grow-0 leading-[normal] md:gap-x-[14.208px] md:basis-0 md:grow md:leading-[0px] md:min-h-px md:min-w-px md:gap-y-[14.208px]">
        <div className="static text-black text-base font-normal box-content caret-black shrink min-h-0 min-w-0 outline-black text-wrap md:relative md:text-white md:text-[17.792px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[26.624px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            Follow us
          </p>
        </div>
        <a
          href="https://www.instagram.com/house.of.watkins/"
          className="static text-black text-base box-content caret-black inline flex-row shrink justify-normal min-h-0 min-w-0 outline-black w-auto md:relative md:text-stone-400 md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:min-h-[auto] md:min-w-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-min md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
        >
          <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black md:aspect-auto md:box-border md:caret-transparent md:leading-[24.832px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            Instagram
          </p>
        </a>
        <a
          href="https://www.pinterest.com/HouseOfWatkinsLLC/"
          className="static text-black text-base box-content caret-black inline flex-row shrink justify-normal min-h-0 min-w-0 outline-black w-auto md:relative md:text-stone-400 md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:min-h-[auto] md:min-w-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-min md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
        >
          <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black md:aspect-auto md:box-border md:caret-transparent md:leading-[24.832px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            Pinterest
          </p>
        </a>
        <a
          href="https://www.facebook.com/House.of.Watkins/"
          className="static text-black text-base box-content caret-black inline flex-row shrink justify-normal min-h-0 min-w-0 outline-black w-auto md:relative md:text-stone-400 md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:min-h-[auto] md:min-w-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-min md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
        >
          <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black md:aspect-auto md:box-border md:caret-transparent md:leading-[24.832px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            Facebook
          </p>
        </a>
        <a
          href="https://www.linkedin.com/in/houseofwatkins/"
          className="static text-black text-base box-content caret-black inline flex-row shrink justify-normal min-h-0 min-w-0 outline-black w-auto md:relative md:text-stone-400 md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:min-h-[auto] md:min-w-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-min md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
        >
          <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black md:aspect-auto md:box-border md:caret-transparent md:leading-[24.832px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            LinkedIn
          </p>
        </a>
      </div>
    );
  }

  return (
    <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-start md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] h-auto leading-[normal] w-auto md:gap-x-[14.208px] md:h-full md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:gap-y-[14.208px] md:w-[213.376px]">
      <div className="static text-black text-base font-normal box-content caret-black shrink min-h-0 min-w-0 outline-black text-wrap md:relative md:text-white md:text-[17.792px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[26.624px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          Contact us
        </p>
      </div>
      <div className="static text-black text-base box-content caret-black block flex-row shrink justify-normal min-h-0 min-w-0 outline-black w-auto md:relative md:text-stone-400 md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:min-h-[auto] md:min-w-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-min md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <a
          href="tel://+15412191673"
          className="box-content caret-black inline leading-[normal] min-h-0 min-w-0 outline-black md:aspect-auto md:box-border md:caret-transparent md:block md:leading-[24.832px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
        >
          +1 541 219 1673
        </a>
      </div>
      <div className="static text-black text-base box-content caret-black block flex-row shrink justify-normal min-h-0 min-w-0 outline-black w-auto md:relative md:text-stone-400 md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:min-h-[auto] md:min-w-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-min md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <a
          href="mailto://david@houseofwatkins.com"
          className="box-content caret-black inline leading-[normal] min-h-0 min-w-0 outline-black md:aspect-auto md:box-border md:caret-transparent md:block md:leading-[24.832px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
        >
          david@houseofwatkins.com
        </a>
      </div>
      <div className="static text-black text-base box-content caret-black block flex-row shrink justify-normal min-h-0 min-w-0 outline-black w-auto md:relative md:text-stone-400 md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:min-h-[auto] md:min-w-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-min md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black md:aspect-auto md:box-border md:caret-transparent md:leading-[24.832px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          16673 E Mansfield Circle, Aurora, Colorado 80013
        </p>
      </div>
    </div>
  );
};
