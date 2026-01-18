import { Navbar } from "@/sections/Navbar";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Hero } from "@/sections/Hero";
import { FilterSidebar } from "@/sections/FilterSidebar";
import { ContentHeader } from "@/sections/ContentHeader";
import { HouseGrid } from "@/sections/HouseGrid";
import { Footer } from "@/sections/Footer";

export const App = () => {
  return (
    <body className="text-zinc-800 text-[15.2625px] not-italic normal-nums font-normal accent-auto bg-white box-border caret-transparent block tracking-[normal] leading-[22.8937px] list-outside list-disc outline-[oklab(0.708_0_0_/_0.5)] overflow-x-hidden overflow-y-auto pointer-events-auto text-left indent-[0px] normal-case visible border-separate font-gilroy md:text-[14.208px] md:leading-[21.312px]">
      <div className="text-[15.2625px] box-border caret-transparent leading-[22.8937px] outline-[oklab(0.708_0_0_/_0.5)] md:text-[14.208px] md:leading-[21.312px]">
        <div className="text-[15.2625px] box-border caret-transparent leading-[22.8937px] outline-[oklab(0.708_0_0_/_0.5)] md:text-[14.208px] md:leading-[21.312px]">
          <div className="text-[15.2625px] box-border caret-transparent leading-[22.8937px] outline-[oklab(0.708_0_0_/_0.5)] md:text-[14.208px] md:leading-[21.312px]">
            <div className="relative text-[15.2625px] box-border caret-transparent basis-0 grow shrink-0 h-[1000px] leading-[22.8937px] min-h-px min-w-px outline-[oklab(0.708_0_0_/_0.5)] w-full md:text-[14.208px] md:leading-[21.312px]">
              <div className="text-[15.2625px] bg-[oklch(1_0_0)] box-border caret-transparent flex flex-col leading-[22.8937px] min-h-[1000px] outline-[oklab(0.708_0_0_/_0.5)] overflow-x-hidden overflow-y-auto md:text-[14.208px] md:leading-[21.312px]">
                <section
                  aria-label="Notifications alt+T"
                  className="text-[15.2625px] box-border caret-transparent leading-[22.8937px] outline-[oklab(0.708_0_0_/_0.5)] md:text-[14.208px] md:leading-[21.312px]"
                ></section>
                <div className="text-[15.2625px] box-border caret-transparent flex flex-col leading-[22.8937px] min-h-[1000px] outline-[oklab(0.708_0_0_/_0.5)] md:text-[14.208px] md:leading-[21.312px]">
                  <Navbar />
                  <main className="text-[15.2625px] box-border caret-transparent gap-x-[28.6125px] flex basis-[0%] flex-col grow leading-[22.8937px] outline-[oklab(0.708_0_0_/_0.5)] gap-y-[28.6125px] pt-[26.7px] pb-0 px-[16.65px] md:text-[14.208px] md:gap-x-[35.456px] md:leading-[21.312px] md:gap-y-[35.456px] md:px-[56.832px] md:py-[35.584px]">
                    <Breadcrumb />
                    <Hero />
                    <div className="text-[15.2625px] box-border caret-transparent gap-x-[8.325px] flex leading-[22.8937px] outline-[oklab(0.708_0_0_/_0.5)] gap-y-[8.325px] md:text-[14.208px] md:gap-x-[28.416px] md:leading-[21.312px] md:gap-y-[28.416px]">
                      <FilterSidebar />
                      <div className="text-[15.2625px] box-border caret-transparent gap-x-[8.325px] flex basis-[0%] flex-col grow leading-[22.8937px] outline-[oklab(0.708_0_0_/_0.5)] gap-y-[8.325px] md:text-[14.208px] md:gap-x-[28.416px] md:leading-[21.312px] md:gap-y-[28.416px]">
                        <ContentHeader />
                        <div className="text-stone-400 text-[14.325px] box-border caret-transparent leading-[21.4875px] outline-[oklab(0.708_0_0_/_0.5)] md:text-[13.312px] md:leading-[19.968px]">
                          Houses found: 6
                        </div>
                        <HouseGrid />
                      </div>
                    </div>
                  </main>
                  <Footer />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
};
