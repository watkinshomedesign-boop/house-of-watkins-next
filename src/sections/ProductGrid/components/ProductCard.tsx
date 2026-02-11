import Link from "next/link";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { HouseIcon } from "@/components/icons/HouseIcon";
import { Tour3dIcon } from "@/components/icons/Tour3dIcon";
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
  const renderFavoriteInside = !props.fullCardLink;

  const tour3dBadge = show3d && (
    <a
      href={props.tour3dUrl!}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute left-4 top-[19px] z-10 inline-flex h-[38px] min-w-0 max-w-[calc(100%-2rem)] shrink-0 items-center gap-1.5 rounded-[50px] border border-[#FF5C02] bg-white px-4 py-2 font-gilroy font-medium leading-[22px] text-[15px] text-black no-underline outline-none hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-[#FF5C02] md:left-[18px]"
      aria-label="Open 3D tour"
    >
      <Tour3dIcon className="h-5 w-5 shrink-0" />
      <span className="truncate">3D tour</span>
    </a>
  );

  const mobileCta =
    props.href && !props.fullCardLink ? (
      <Link href={props.href} className="contents">
        <button
          type="button"
          className="flex h-12 w-12 min-h-[48px] min-w-[48px] items-center justify-center rounded-full bg-[#FF5C02] text-white"
          aria-label="View plan"
        >
          <HouseIcon className="h-[18px] w-[18px]" />
        </button>
      </Link>
    ) : props.href && props.fullCardLink ? (
      <div
        className="flex h-12 w-12 min-h-[48px] min-w-[48px] items-center justify-center rounded-full bg-[#FF5C02] text-white"
        aria-hidden="true"
      >
        <HouseIcon className="h-[18px] w-[18px]" />
      </div>
    ) : (
      <button type="button" className="flex h-12 w-12 min-h-[48px] min-w-[48px] items-center justify-center rounded-full bg-[#FF5C02] text-white">
        <HouseIcon className="h-[18px] w-[18px]" />
      </button>
    );

  const desktopContent = (
    <div className="static bg-transparent box-content caret-black basis-auto grow-0 min-h-0 min-w-0 outline-black w-auto rounded-none md:relative md:h-[484px] md:w-[424px] md:shrink-0 md:aspect-auto md:bg-stone-50 md:box-border md:caret-transparent md:min-h-px md:min-w-px md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[35.584px]">
      <div className="static box-content caret-black h-auto outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <div className="static [align-items:normal] box-content caret-black block flex-row justify-normal outline-black w-auto p-0 md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:justify-start md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:pt-[17.792px] md:pb-[81.792px] md:px-[17.792px] md:scroll-m-0 md:scroll-p-[auto]">
          <div className="static [align-items:normal] box-content caret-black block flex-row justify-normal min-h-0 min-w-0 outline-black w-auto mb-0 md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:-mb-16 md:scroll-m-0 md:scroll-p-[auto]">
            <PlanImage
              src={props.imageSrc}
              alt=""
              sizes="(min-width: 768px) 384px, 100vw"
              className="rounded-none md:h-[268px] md:w-[384px] md:rounded-[28.416px] md:shrink-0"
              aspect="auto"
              rounded={false}
            >
              {tour3dBadge}
              {renderFavoriteInside && props.planSlug ? <FavoriteButton planSlug={props.planSlug} /> : null}
            </PlanImage>

            <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[12.416px] md:flex md:justify-between md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[12.416px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:pt-5 md:scroll-m-0 md:scroll-p-[auto]">
              <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block basis-auto grow-0 justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[3.584px] md:flex md:basis-0 md:flex-col md:grow md:justify-start md:min-h-px md:min-w-px md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[3.584px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                <div className="static font-normal text-[16px] box-content caret-black min-h-0 min-w-0 outline-black w-auto md:relative md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                  <p className="box-content caret-black leading-[normal] outline-black break-normal md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:break-words md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                    {props.title}
                  </p>
                </div>
                <div className="static text-black text-[15px] box-content caret-black min-h-0 min-w-0 outline-black w-auto md:relative md:text-stone-400 md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                  <p className="box-content caret-black leading-[normal] outline-black break-normal md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:break-words md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                    {props.squareFeet}
                  </p>
                </div>
              </div>

              {props.href && !props.fullCardLink ? (
                <Link href={props.href} className="contents">
                  <button className="flex h-12 w-12 min-h-[48px] min-w-[48px] shrink-0 items-center justify-center rounded-full bg-[#FF5C02] text-white" aria-label="View plan">
                    <HouseIcon className="h-[18px] w-[18px]" />
                  </button>
                </Link>
              ) : props.href && props.fullCardLink ? (
                <div className="flex h-12 w-12 min-h-[48px] min-w-[48px] shrink-0 items-center justify-center rounded-full bg-[#FF5C02] text-white" aria-hidden="true">
                  <HouseIcon className="h-[18px] w-[18px]" />
                </div>
              ) : (
                <button type="button" className="flex h-12 w-12 min-h-[48px] min-w-[48px] shrink-0 items-center justify-center rounded-full bg-[#FF5C02] text-white">
                  <HouseIcon className="h-[18px] w-[18px]" />
                </button>
              )}
            </div>
          </div>

          <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[12.416px] md:flex md:flex-col md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-6 md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block justify-normal leading-[normal] min-h-0 min-w-0 outline-black gap-y-[normal] text-wrap md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[7.168px] md:flex md:justify-start md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[7.168px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <div className="static text-black text-[15px] box-content caret-black min-h-0 min-w-0 outline-black text-wrap md:relative md:text-stone-400 md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:overflow-hidden md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                <p className="box-content caret-black leading-[normal] outline-black break-normal md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:break-words md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                  starting at
                </p>
              </div>
              <div className="static text-black font-normal text-[20px] box-content caret-black min-h-0 min-w-0 outline-black text-wrap md:relative md:text-orange-600 md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:overflow-hidden md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                <p className="box-content caret-black leading-[normal] outline-black break-normal md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:break-words md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                  {props.price}
                </p>
              </div>
            </div>

            <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-nowrap justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-6 md:flex md:flex-wrap md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[7.68px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <div className="static bg-transparent box-content caret-black min-h-0 min-w-0 outline-black rounded-none md:relative md:aspect-auto md:bg-white md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[50px]">
                <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block justify-normal outline-black gap-y-[normal] p-0 md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[5.376px] md:flex md:justify-center md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[5.376px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:overflow-clip md:[mask-position:0%] md:bg-left-top md:px-[14.208px] md:py-[7.168px] md:scroll-m-0 md:scroll-p-[auto]">
                  <div className="static box-content caret-black h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:h-[17.792px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[17.792px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                    <img
                      src={icons.bed}
                      alt="Icon"
                      className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
                    />
                  </div>
                  <div className="static font-normal text-[15px] box-content caret-black block flex-row justify-normal leading-[normal] min-h-0 min-w-0 outline-black md:relative md:font-medium md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:justify-center md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:overflow-hidden md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
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
                  <div className="static font-normal text-[15px] box-content caret-black block flex-row justify-normal leading-[normal] min-h-0 min-w-0 outline-black md:relative md:font-medium md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:justify-center md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:overflow-hidden md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
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
                  <div className="static font-normal text-[15px] box-content caret-black block flex-row justify-normal leading-[normal] min-h-0 min-w-0 outline-black md:relative md:font-medium md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:justify-center md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:overflow-hidden md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
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
    <div className="w-full min-w-0 md:w-auto md:min-w-0">
      <div className="md:hidden overflow-hidden rounded-2xl bg-stone-50">
        <PlanImage src={props.imageSrc} alt="" sizes="100vw" className="rounded-none" rounded={false}>
          {tour3dBadge}
          {renderFavoriteInside && props.planSlug ? <FavoriteButton planSlug={props.planSlug} /> : null}
        </PlanImage>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[16px] font-semibold leading-snug text-neutral-900 break-words">{props.title}</div>
              <div className="mt-1 text-[15px] text-neutral-500">{props.squareFeet}</div>
            </div>
            <div className="shrink-0">{mobileCta}</div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <div className="text-[15px] text-neutral-500">starting at</div>
            <div className="text-[20px] font-semibold text-[#FF5C02]">{props.price}</div>
          </div>

          <div className="mt-4 flex flex-wrap gap-6">
            <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2">
              <img src={icons.bed} alt="" className="h-4 w-4 shrink-0" />
              <div className="min-w-0 truncate text-[15px] text-neutral-700">{props.bedrooms}</div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2">
              <img src={icons.bath} alt="" className="h-4 w-4 shrink-0" />
              <div className="min-w-0 truncate text-[15px] text-neutral-700">{props.bathrooms}</div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2">
              <img src={icons.garage} alt="" className="h-4 w-4 shrink-0" />
              <div className="min-w-0 truncate text-[15px] text-neutral-700">{props.garages}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block">{desktopContent}</div>
    </div>
  );

  if (props.href && props.fullCardLink) {
    return (
      <div className="relative">
        <Link href={props.href} className="contents">
          {content}
        </Link>
        {props.planSlug ? (
          <div className="absolute right-4 top-4 z-30 md:right-[calc(17.792px+4px)] md:top-[calc(17.792px+4px)]">
            <FavoriteButton planSlug={props.planSlug} layout="inline" />
          </div>
        ) : null}
      </div>
    );
  }

  return content;
};
