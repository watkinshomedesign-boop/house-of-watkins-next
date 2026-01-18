import { Tabs } from "@/components/Tabs";
import { DetailsSection } from "@/sections/ContentSection/components/DetailsSection";
import { Sidebar } from "@/sections/ContentSection/components/Sidebar";

export const ContentSection = () => {
  return (
    <div className="[align-items:normal] self-auto box-content caret-black gap-x-[normal] block min-h-0 min-w-0 outline-black gap-y-[normal] pb-0 md:items-start md:self-stretch md:aspect-auto md:box-border md:caret-transparent md:flex md:justify-between md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-x-[26.624px] md:gap-y-[44.416px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:pb-[35.456px] md:scroll-m-0 md:scroll-p-[auto] lg:gap-x-[35.584px]">
      <div className="[align-items:normal] box-content caret-black gap-x-[normal] block flex-row min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:items-start md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:min-h-[auto] md:min-w-0 md:flex-[1.15] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-x-[28.416px] md:gap-y-[28.416px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] lg:max-w-none">
        <Tabs />
        <DetailsSection />
      </div>
      <Sidebar />
    </div>
  );
};
