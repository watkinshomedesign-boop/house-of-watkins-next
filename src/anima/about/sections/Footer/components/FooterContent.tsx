import { FooterColumn } from "@/sections/Footer/components/FooterColumn";

export const FooterContent = () => {
  return (
    <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block h-auto justify-normal outline-black gap-y-[normal] w-auto p-0 md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[71.168px] md:flex md:h-full md:justify-start md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[71.168px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:px-[56.832px] md:py-[35.584px] md:scroll-m-0 md:scroll-p-[auto]">
      <FooterColumn
        variant="company"
        logoUrl="https://c.animaapp.com/mjfxv9somN4Dv6/assets/7463e3f5c3028d68d3703759460ee8a953ff2de0.png"
        logoAlt="Logo"
        companyLinks={[
          { text: "About us", isButton: true },
          { text: "All Houses", href: "/catalog" },
        ]}
        copyrightText="© 2025"
        showAdminButton={true}
        adminIconUrl="https://c.animaapp.com/mjfxv9somN4Dv6/assets/icon-11.svg"
      />
      <FooterColumn
        variant="social"
        socialLinks={[
          {
            text: "Instagram",
            href: "https://www.instagram.com/house.of.watkins/",
          },
          {
            text: "Pinterest",
            href: "https://www.pinterest.com/HouseOfWatkinsLLC/",
          },
          {
            text: "Facebook",
            href: "https://www.facebook.com/House.of.Watkins/",
          },
          {
            text: "LinkedIn",
            href: "https://www.linkedin.com/in/houseofwatkins/",
          },
        ]}
      />
      <FooterColumn
        variant="contact"
        contactPhone="+1 541 219 1673"
        contactEmail="david@houseofwatkins.com"
        contactAddress="16673 E Mansfield Circle, Aurora, Colorado 80013"
      />
    </div>
  );
};
