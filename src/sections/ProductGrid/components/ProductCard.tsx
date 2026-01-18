import Link from "next/link";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { PlanImage } from "@/components/media/PlanImage";

export type ProductCardProps = {
  href?: string;
  fullCardLink?: boolean;
  planSlug?: string;
  tour3dUrl?: string | null;
  imageSrc: string;
  title: string;
  squareFeet: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  garages: string;
  stories: string;
};

export const ProductCard = (props: ProductCardProps) => {
  const icons = {
    arrow: "/icons/arrow-top-right-black.svg",
    bed: "/icons/bed-black.svg",
    bath: "/icons/bath-black.svg",
    garage: "/icons/garage-black.svg",
    stories: "/icons/layers-black.svg",
  } as const;

  const show3d = Boolean(String(props.tour3dUrl || "").trim());

  const mobileCta =
    props.href && !props.fullCardLink ? (
      <Link href={props.href} className="contents">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFEFEB] text-[#FF5C02]"
          aria-label="View plan"
        >
          <img src={icons.arrow} alt="" className="h-4 w-4" />
        </button>
      </Link>
    ) : props.href && props.fullCardLink ? (
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFEFEB] text-[#FF5C02]"
        aria-hidden="true"
      >
        <img src={icons.arrow} alt="" className="h-4 w-4" />
      </div>
    ) : (
      <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFEFEB] text-[#FF5C02]">
        <img src={icons.arrow} alt="" className="h-4 w-4" />
      </button>
    );

  const desktopContent = (
    <div className="static bg-transparent box-content caret-black basis-auto grow-0 min-h-0 min-w-0 outline-black w-auto rounded-none md:relative md:aspect-auto md:bg-stone-50 md:box-border md:caret-transparent md:basis-0 md:grow md:min-h-px md:min-w-px md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[35.584px]">
      <div className="static box-content caret-black h-auto outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <div className="static [align-items:normal] box-content caret-black block flex-row justify-normal outline-black w-auto p-0 md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:justify-start md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:pt-[17.792px] md:pb-[81.792px] md:px-[17.792px] md:scroll-m-0 md:scroll-p-[auto]">
          <div className="static [align-items:normal] box-content caret-black block flex-row justify-normal min-h-0 min-w-0 outline-black w-auto mb-0 md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:-mb-16 md:scroll-m-0 md:scroll-p-[auto]">
            <PlanImage
              src={props.imageSrc}
              alt=""
              sizes="(min-width: 768px) 33vw, 100vw"
              className="rounded-none md:rounded-[28.416px]"
              rounded={false}
            >
              {show3d ? (
                <img
                  src="/assets/Final%20small%20icon%20images%20black%20svg/3D%20Tour.svg"
                  alt="3D Tour Available"
                  className="pointer-events-none absolute inset-0 z-10 h-full w-full object-cover"
                  draggable={false}
                />
              ) : null}
              {props.planSlug ? <FavoriteButton planSlug={props.planSlug} /> : null}
            </PlanImage>

            <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[12.416px] md:flex md:justify-between md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[12.416px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:pt-[17.792px] md:scroll-m-0 md:scroll-p-[auto]">
              <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block basis-auto grow-0 justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[3.584px] md:flex md:basis-0 md:flex-col md:grow md:justify-start md:min-h-px md:min-w-px md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[3.584px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
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

              {props.href && !props.fullCardLink ? (
                <Link href={props.href} className="contents">
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
                </Link>
              ) : props.href && props.fullCardLink ? (
                <div
                  className="static [align-items:normal] bg-zinc-100 caret-black gap-x-[normal] inline-block h-auto justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto rounded-none md:relative md:items-center md:aspect-auto md:bg-rose-50 md:caret-transparent md:gap-x-[8.832px] md:flex md:h-[44.416px] md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[44.416px] md:overflow-clip md:[mask-position:0%] md:bg-left-top md:p-[11.52px] md:scroll-m-0 md:scroll-p-[auto] md:rounded-[100px]"
                  aria-hidden="true"
                >
                  <div className="box-content caret-black min-h-0 min-w-0 outline-black md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                    <div className="static box-content caret-black h-auto outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:h-[21.376px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[21.376px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                      <img
                        src={icons.arrow}
                        alt=""
                        className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
                      />
                    </div>
                  </div>
                </div>
              ) : (
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
              )}
            </div>
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

  const content = (
    <>
      <div className="md:hidden overflow-hidden rounded-2xl bg-stone-50">
        <PlanImage src={props.imageSrc} alt="" sizes="100vw" className="rounded-none" rounded={false}>
          {show3d ? (
            <img
              src="/assets/Final%20small%20icon%20images%20black%20svg/3D%20Tour.svg"
              alt="3D Tour Available"
              className="pointer-events-none absolute inset-0 z-10 h-full w-full object-cover"
              draggable={false}
            />
          ) : null}
          {props.planSlug ? <FavoriteButton planSlug={props.planSlug} /> : null}
        </PlanImage>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-base font-semibold leading-snug text-neutral-900 break-words">{props.title}</div>
              <div className="mt-1 text-sm text-neutral-500">{props.squareFeet}</div>
            </div>
            <div className="shrink-0">{mobileCta}</div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <div className="text-xs text-neutral-500">starting at</div>
            <div className="text-base font-semibold text-[#FF5C02]">{props.price}</div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2">
              <img src={icons.bed} alt="" className="h-4 w-4 shrink-0" />
              <div className="min-w-0 truncate text-sm text-neutral-700">{props.bedrooms}</div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2">
              <img src={icons.bath} alt="" className="h-4 w-4 shrink-0" />
              <div className="min-w-0 truncate text-sm text-neutral-700">{props.bathrooms}</div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2">
              <img src={icons.garage} alt="" className="h-4 w-4 shrink-0" />
              <div className="min-w-0 truncate text-sm text-neutral-700">{props.garages}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block">{desktopContent}</div>
    </>
  );

  if (props.href && props.fullCardLink) {
    return (
      <Link href={props.href} className="contents">
        {content}
      </Link>
    );
  }

  return content;
};
