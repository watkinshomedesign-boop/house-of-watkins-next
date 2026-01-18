import { SortControls } from "@/sections/ContentHeader/components/SortControls";
import { ViewToggle } from "@/sections/ContentHeader/components/ViewToggle";

import type { SortKey } from "@/sections/ContentHeader/components/SortControls";
import type { ViewKey } from "@/sections/ContentHeader/components/ViewToggle";

export type ContentHeaderProps = {
  sort?: SortKey;
  onSortChange?: (value: SortKey) => void;
  view?: ViewKey;
  onViewChange?: (value: ViewKey) => void;
};

export const ContentHeader = (props: ContentHeaderProps) => {
  const sort = props.sort ?? "popular";
  const view = props.view ?? "front";
  const onSortChange = props.onSortChange ?? (() => {});
  const onViewChange = props.onViewChange ?? (() => {});

  return (
    <div className="relative text-[15.2625px] items-start box-border caret-transparent gap-x-[10.425px] flex h-auto justify-center leading-[22.8937px] min-h-[45.7875px] outline-[oklab(0.708_0_0_/_0.5)] gap-y-[10.425px] w-full md:text-[14.208px] md:gap-x-[35.584px] md:h-[42.624px] md:leading-[21.312px] md:min-h-[auto] md:gap-y-[35.584px]">
      <SortControls value={sort} onChange={onSortChange} />
      <ViewToggle value={view} onChange={onViewChange} />
    </div>
  );
};
