import { FooterColumn } from "@/sections/Footer/components/FooterColumn";

export const Footer = () => {
  return (
    <div className="static text-base bg-transparent box-content caret-black shrink leading-[normal] min-h-0 min-w-0 outline-black w-auto md:relative md:text-[14.208px] md:aspect-auto md:bg-zinc-800 md:box-border md:caret-transparent md:shrink-0 md:leading-[21.312px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
      <div className="static box-content caret-black h-auto outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block h-auto justify-normal outline-black gap-y-[normal] w-auto p-0 md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[71.168px] md:flex md:h-full md:justify-start md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[71.168px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:px-[56.832px] md:py-[35.584px] md:scroll-m-0 md:scroll-p-[auto]">
          <FooterColumn variant="company" />
          <FooterColumn variant="social" />
          <FooterColumn variant="contact" />
        </div>
      </div>
    </div>
  );
};
