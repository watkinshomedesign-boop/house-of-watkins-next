import { Navbar } from "@/sections/Navbar";
import { Breadcrumb } from "@/components/Breadcrumb";
import { HeroSection } from "@/sections/HeroSection";
import { ContentSection } from "@/sections/ContentSection";
import { TrendingSection } from "@/sections/TrendingSection";
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
                <div className="static text-base bg-transparent box-content caret-black h-auto leading-[normal] min-h-0 min-w-0 outline-black overflow-x-visible overflow-y-visible w-auto md:relative md:text-[14.208px] md:aspect-auto md:bg-white md:box-border md:caret-transparent md:h-full md:leading-[21.312px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overflow-x-hidden md:overflow-y-auto md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                  <Navbar />
                  <div className="static box-content caret-black h-auto outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                    <div className="static box-content caret-black h-auto outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                      <div className="[align-items:normal] self-auto box-content caret-black gap-x-[normal] block flex-row outline-black gap-y-[normal] p-0 md:items-start md:self-stretch md:aspect-auto md:box-border md:caret-transparent md:gap-x-[35.584px] md:flex md:flex-col md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[35.584px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:px-[56.832px] md:py-[35.584px] md:scroll-m-0 md:scroll-p-[auto]">
                        <Breadcrumb />
                        <HeroSection />
                        <ContentSection />
                        <TrendingSection />
                      </div>
                    </div>
                  </div>
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
