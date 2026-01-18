import { NavbarLogo } from "@/sections/Navbar/components/NavbarLogo";
import { DesktopMenu } from "@/sections/Navbar/components/DesktopMenu";

export const Navbar = () => {
  return (
    <div className="static text-base [align-items:normal] bg-transparent box-content caret-black gap-x-[normal] block shrink h-auto justify-normal leading-[normal] min-h-0 min-w-0 outline-black gap-y-[normal] w-auto p-0 md:relative md:text-[14.208px] md:items-center md:aspect-auto md:bg-stone-50 md:box-border md:caret-transparent md:gap-x-[85.248px] md:flex md:shrink-0 md:h-[72px] md:justify-start md:leading-[21.312px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[85.248px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:px-[56.832px] md:py-[10.656px] md:scroll-m-0 md:scroll-p-[auto]">
      <NavbarLogo />
      <DesktopMenu
        variant="navigation"
        navigationItems={[
          {
            variant:
              "[align-items:normal] gap-x-[normal] justify-normal gap-y-[normal] md:items-center md:bg-transparent md:gap-x-[8.88px] md:flex md:justify-center md:gap-y-[8.88px]",
            text: "About Us",
          },
          {
            variant:
              "[align-items:normal] gap-x-[normal] justify-normal gap-y-[normal] md:items-center md:bg-transparent md:gap-x-[8.88px] md:flex md:justify-center md:gap-y-[8.88px]",
            text: "House plans",
          },
        ]}
      />
      <DesktopMenu
        variant="contact"
        contactItems={[
          {
            text: "+1 541 219 1673",
            variant:
              "[align-items:normal] gap-x-[normal] justify-normal gap-y-[normal] md:items-center md:bg-transparent md:gap-x-[7.104px] md:flex md:justify-start md:gap-y-[7.104px]",
            iconUrl: "https://c.animaapp.com/mjfxm8t3acn9s3/assets/icon-1.svg",
            iconAlt: "Icon",
          },
          {
            text: "david@houseofwatkins.com",
            variant:
              "text-[13.3333px] font-normal leading-[normal] text-wrap md:text-[15px] md:font-medium md:bg-transparent md:block md:leading-[0px] md:text-nowrap",
          },
        ]}
        actionButton={{
          variant:
            "h-auto w-auto rounded-none md:bg-white md:block md:h-[50px] md:w-[50px] md:rounded-[100px]",
          iconUrl: "https://c.animaapp.com/mjfxm8t3acn9s3/assets/icon-2.svg",
          iconAlt: "Icon",
          showSecondaryDiv: true,
        }}
      />
    </div>
  );
};
