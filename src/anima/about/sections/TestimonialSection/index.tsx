import { TestimonialCard } from "@/sections/TestimonialSection/components/TestimonialCard";

export const TestimonialSection = () => {
  return (
    <section className="box-content caret-black min-h-0 min-w-0 outline-black px-0 md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:px-[56.832px] md:scroll-m-0 md:scroll-p-[auto]">
      <div className="static box-content caret-black outline-black w-auto rounded-none md:relative md:aspect-[1440_/_457] md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:overflow-hidden md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[35.584px]">
        <img
          alt="Beautiful landscape with modern house"
          src="https://c.animaapp.com/mjfxv9somN4Dv6/assets/65cf1c9d4999a555ca3cd80f55710a01290e1478.png"
          className="static box-content caret-black h-auto max-w-none object-fill outline-black w-auto inset-auto md:absolute md:aspect-auto md:box-border md:caret-transparent md:h-full md:max-w-full md:object-cover md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:inset-0"
        />
        <div className="static box-content caret-black outline-black right-auto bottom-auto md:absolute md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:right-[21.376px] md:bottom-[21.376px]">
          <TestimonialCard />
        </div>
      </div>
    </section>
  );
};
