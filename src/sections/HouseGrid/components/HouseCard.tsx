import { HouseImage } from "@/sections/HouseGrid/components/HouseImage";
import { HouseInfo } from "@/sections/HouseGrid/components/HouseInfo";

export type HouseCardProps = {
  imageDesktop: string;
  imageMobile?: string;
  imageHover?: string;
  planSlug?: string;
  tour3dUrl?: string | null;
  title: string;
  squareFeet: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  garages: string;
  stories: string;
};

export const HouseCard = (props: HouseCardProps) => {
  return (
    <div className="static text-base bg-transparent box-content caret-black basis-auto grow-0 leading-[normal] min-h-0 min-w-0 outline-black w-auto rounded-none md:relative md:text-[14.208px] md:aspect-auto md:bg-stone-50 md:box-border md:caret-transparent md:basis-0 md:grow md:leading-[21.312px] md:min-h-px md:min-w-px md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[35.584px]">
      <div className="static box-content caret-black h-auto outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <div className="static [align-items:normal] box-content caret-black block flex-row justify-normal outline-black w-auto p-0 md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:justify-start md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:pt-[17.792px] md:pb-[81.792px] md:px-[17.792px] md:scroll-m-0 md:scroll-p-[auto]">
          <div className="static [align-items:normal] box-content caret-black block flex-row justify-normal min-h-0 min-w-0 outline-black w-auto mb-0 md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:-mb-16 md:scroll-m-0 md:scroll-p-[auto]">
            <HouseImage
              desktop={props.imageDesktop}
              mobile={props.imageMobile}
              hover={props.imageHover}
              planSlug={props.planSlug}
              tour3dUrl={props.tour3dUrl}
            />
            <HouseInfo
              title={props.title}
              squareFeet={props.squareFeet}
              price={props.price}
              bedrooms={props.bedrooms}
              bathrooms={props.bathrooms}
              garages={props.garages}
              stories={props.stories}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
