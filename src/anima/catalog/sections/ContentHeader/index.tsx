import { SortControls } from "@/sections/ContentHeader/components/SortControls";
import { ViewToggle } from "@/sections/ContentHeader/components/ViewToggle";

export const ContentHeader = () => {
  return (
    <div className="relative text-[15.2625px] items-start box-border caret-transparent gap-x-[10.425px] flex h-auto justify-center leading-[22.8937px] min-h-[45.7875px] outline-[oklab(0.708_0_0_/_0.5)] gap-y-[10.425px] w-full md:text-[14.208px] md:gap-x-[35.584px] md:h-[42.624px] md:leading-[21.312px] md:min-h-[auto] md:gap-y-[35.584px]">
      <SortControls />
      <ViewToggle />
    </div>
  );
};
