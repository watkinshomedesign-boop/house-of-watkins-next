import Image from "next/image";
import Link from "next/link";
import { FooterPolicyLinks } from "@/components/policies/FooterPolicyLinks.client";

export function MobileFooter() {
  return (
    <footer className="w-full bg-[#2B2A28] px-8 py-12 text-white">
      <div className="mx-auto w-full max-w-[420px]">
        <div>
          <Image
            src="/brand/Logo%20Images/Logo%20Stacked.png"
            alt="House of Watkins"
            width={260}
            height={28}
            className="h-auto w-[260px] object-contain invert"
          />
          <div className="mt-3 text-[16px] font-semibold text-white/50">© {new Date().getFullYear()}</div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-12">
          <div>
            <Link href="/faq" className="text-[18px] font-semibold text-white">
              FAQ
            </Link>
            <div className="mt-4">
              <FooterPolicyLinks variant="footerColumnMobile" />
            </div>
          </div>

          <div>
            <div className="text-[18px] font-semibold text-white">Follow Us</div>
            <div className="mt-4 flex flex-col gap-3 text-[14px] font-normal text-white/50">
              <a
                href="https://www.instagram.com/house.of.watkins/"
                target="_blank"
                rel="noreferrer"
                className="w-fit"
              >
                Instagram
              </a>
              <a
                href="https://www.pinterest.com/HouseOfWatkinsLLC/"
                target="_blank"
                rel="noreferrer"
                className="w-fit"
              >
                Pinterest
              </a>
              <a
                href="https://www.facebook.com/House.of.Watkins/"
                target="_blank"
                rel="noreferrer"
                className="w-fit"
              >
                Facebook
              </a>
              <a
                href="https://www.linkedin.com/in/houseofwatkins/"
                target="_blank"
                rel="noreferrer"
                className="w-fit"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Link href="/contact-us" className="text-[18px] font-semibold text-white">
            Contact Us
          </Link>
          <div className="mt-4 space-y-3 text-[14px] font-normal text-white/50">
            <a href="tel://+15412191673" className="block">
              +1 541 219 1673
            </a>
            <a href="mailto://david@houseofwatkins.com" className="block">
              david@houseofwatkins.com
            </a>
            <div>
              16673 E Mansfield Circle,
              <br />
              Aurora, Colorado 80013
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default MobileFooter;
