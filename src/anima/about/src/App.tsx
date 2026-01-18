import { Navbar } from "@/sections/Navbar";
import { Main } from "@/components/Main";
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
                <div className="text-base bg-transparent box-content caret-black block flex-row leading-[normal] min-h-0 min-w-0 outline-black md:text-[14.208px] md:aspect-auto md:bg-white md:box-border md:caret-transparent md:flex md:flex-col md:leading-[21.312px] md:min-h-[1000px] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                  <Navbar />
                  <Main />
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
