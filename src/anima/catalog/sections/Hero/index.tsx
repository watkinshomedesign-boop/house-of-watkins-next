import { SearchBar } from "@/sections/Hero/components/SearchBar";

export const Hero = () => {
  return (
    <div className="relative text-[15.2625px] items-start box-border caret-transparent gap-x-[22.875px] flex flex-col h-auto justify-start leading-[22.8937px] outline-[oklab(0.708_0_0_/_0.5)] gap-y-[22.875px] w-full md:text-[14.208px] md:gap-x-[17.792px] md:flex-row md:h-full md:leading-[21.312px] md:gap-y-[17.792px]">
      <div className="static text-base [align-items:normal] box-content caret-black gap-x-[normal] block shrink justify-normal leading-[normal] min-h-0 min-w-0 outline-black gap-y-[normal] w-auto pt-0 md:relative md:text-[14.208px] md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[8.832px] md:flex md:shrink-0 md:justify-start md:leading-[21.312px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[376.832px] md:[mask-position:0%] md:bg-left-top md:pt-[5.376px] md:scroll-m-0 md:scroll-p-[auto]">
        <div className="static text-base font-normal box-content caret-black shrink leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:text-[49.792px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:leading-[42.624px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          <p className="box-content caret-black outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            House plans
          </p>
        </div>
      </div>
      <SearchBar />
    </div>
  );
};
