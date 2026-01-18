import { FooterLogo } from "@/sections/Footer/components/FooterLogo";
import { FooterCopyright } from "@/sections/Footer/components/FooterCopyright";
import { FooterColumn } from "@/sections/Footer/components/FooterColumn";

export const FooterContent = () => {
  return (
    <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block h-auto justify-normal outline-black gap-y-[normal] w-auto p-0 md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[71.168px] md:flex md:h-full md:justify-start md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[71.168px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:px-[56.832px] md:py-[35.584px] md:scroll-m-0 md:scroll-p-[auto]">
      <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row shrink h-auto justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[35.584px] md:flex md:flex-col md:shrink-0 md:h-[167.168px] md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[35.584px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[278.272px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <FooterLogo />
        <FooterCopyright />
      </div>
      <FooterColumn
        title="Follow us"
        variant="basis-auto flex-row grow-0"
        items={[
          {
            type: "link",
            text: "Instagram",
            href: "https://www.instagram.com/house.of.watkins/",
          },
          {
            type: "link",
            text: "Pinterest",
            href: "https://www.pinterest.com/HouseOfWatkinsLLC/",
          },
          {
            type: "link",
            text: "Facebook",
            href: "https://www.facebook.com/House.of.Watkins/",
          },
          {
            type: "link",
            text: "LinkedIn",
            href: "https://www.linkedin.com/in/houseofwatkins/",
          },
        ]}
      />
      <FooterColumn
        title="Contact us"
        variant="h-auto w-auto md:h-full md:min-h-[auto] md:min-w-[auto] md:w-[213.376px]"
        items={[
          { type: "link", text: "+1 541 219 1673", href: "tel://+15412191673" },
          {
            type: "link",
            text: "david@houseofwatkins.com",
            href: "mailto://david@houseofwatkins.com",
          },
          {
            type: "text",
            text: "16673 E Mansfield Circle, Aurora, Colorado 80013",
          },
        ]}
      />
    </div>
  );
};
