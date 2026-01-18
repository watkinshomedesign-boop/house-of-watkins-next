import { NavbarLogo } from "@/sections/Navbar/components/NavbarLogo";
import { NavbarLinks } from "@/sections/Navbar/components/NavbarLinks";
import { NavbarContactButton } from "@/sections/Navbar/components/NavbarContactButton";

export const Navbar = () => {
  return (
    <div className="static [align-items:normal] bg-transparent box-content caret-black gap-x-[normal] block shrink h-auto justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto p-0 md:relative md:items-center md:aspect-auto md:bg-stone-50 md:box-border md:caret-transparent md:gap-x-[85.248px] md:flex md:shrink-0 md:h-[72px] md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[85.248px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:px-[56.832px] md:py-[10.656px] md:scroll-m-0 md:scroll-p-[auto]">
      <NavbarLogo />
      <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block basis-auto grow-0 shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[28.416px] md:flex md:basis-0 md:grow md:shrink-0 md:justify-start md:min-h-px md:min-w-px md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[28.416px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <NavbarLinks
          variant="md:gap-x-[35.52px] md:justify-start md:gap-y-[35.52px]"
          firstButtonText="About Us"
          firstButtonClass="static [align-items:normal] bg-zinc-100 caret-black gap-x-[normal] inline-block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-center md:aspect-auto md:bg-transparent md:caret-transparent md:gap-x-[8.88px] md:flex md:shrink-0 md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.88px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto]"
          firstButtonHasTextWrapper={true}
          secondButtonText="House plans"
          secondButtonClass="static [align-items:normal] bg-zinc-100 caret-black gap-x-[normal] inline-block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-center md:aspect-auto md:bg-transparent md:caret-transparent md:gap-x-[8.88px] md:flex md:shrink-0 md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.88px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto]"
          secondButtonHasTextWrapper={true}
        />
      </div>
      <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[35.52px] md:flex md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[35.52px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <NavbarLinks
          variant="md:gap-x-[28.416px] md:justify-end md:gap-y-[28.416px]"
          firstButtonText="+1 541 219 1673"
          firstButtonIcon="https://c.animaapp.com/mjfxv9somN4Dv6/assets/icon-1.svg"
          firstButtonIconAlt="Icon"
          firstButtonHasIconWrapper={true}
          firstButtonIconWrapperClass="static box-content caret-black shrink h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:h-[17.76px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[17.76px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
          firstButtonClass="static [align-items:normal] bg-zinc-100 caret-black gap-x-[normal] inline-block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-center md:aspect-auto md:bg-transparent md:caret-transparent md:gap-x-[7.104px] md:flex md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[7.104px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto]"
          firstButtonHasTextWrapper={true}
          secondButtonText="david@houseofwatkins.com"
          secondButtonClass="static text-[13.3333px] font-normal bg-zinc-100 caret-black inline-block shrink leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:relative md:text-[15px] md:font-medium md:aspect-auto md:bg-transparent md:caret-transparent md:block md:shrink-0 md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto]"
          secondButtonHasTextWrapper={false}
        />
        <NavbarContactButton />
      </div>
    </div>
  );
};
