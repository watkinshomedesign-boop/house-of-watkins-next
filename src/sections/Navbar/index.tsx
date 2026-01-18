import { NavbarLogo } from "@/sections/Navbar/components/NavbarLogo";
import { NavbarLinks } from "@/sections/Navbar/components/NavbarLinks";
import { NavbarActions } from "@/sections/Navbar/components/NavbarActions";

export const Navbar = () => {
  return (
    <div className="static text-base [align-items:normal] bg-transparent box-content caret-black gap-x-[normal] block shrink h-auto justify-normal leading-[normal] min-h-0 min-w-0 outline-black gap-y-[normal] w-auto p-0 md:relative md:text-[14.208px] md:items-center md:aspect-auto md:bg-stone-50 md:box-border md:caret-transparent md:gap-x-[85.248px] md:flex md:shrink-0 md:h-[72px] md:justify-start md:leading-[21.312px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[85.248px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:px-[56.832px] md:py-[10.656px] md:scroll-m-0 md:scroll-p-[auto]">
      <NavbarLogo />
      <NavbarLinks />
      <NavbarActions />
    </div>
  );
};
