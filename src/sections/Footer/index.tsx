import { FooterContent } from "@/sections/Footer/components/FooterContent";
import { MobileFooter } from "@/sitePages/home/mobile/MobileFooter";

export const Footer = () => {
  return (
    <>
      <div className="md:hidden">
        <MobileFooter />
      </div>

      <div className="hidden md:block md:relative md:w-full md:bg-[#2B2A28]">
        <div className="md:w-full">
          <FooterContent />
        </div>
      </div>
    </>
  );
};
