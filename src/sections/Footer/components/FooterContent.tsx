import Link from "next/link";

import { FooterPolicyLinks } from "@/components/policies/FooterPolicyLinks.client";

export const FooterContent = () => {
  return (
    <footer className="relative w-full bg-[#2B2A28] text-white">
      <div className="mx-auto w-full max-w-[1440px] px-[64px] py-[40px]">
        <div className="flex items-start gap-[80px]">
          <div className="shrink-0">
            <Link href="/" className="block">
              <img
                src="/brand/Logo%20Images/House-of-Watkins-Logo-white.png"
                alt="House of Watkins"
                className="h-[18px] w-auto"
              />
            </Link>
            <div className="mt-3 text-[12px] text-[#8F8E8C]">© {new Date().getFullYear()}</div>
          </div>

          <div className="flex flex-1 items-start gap-[80px]">
            <div className="min-w-[140px]">
              <div className="text-[14px] font-semibold text-white">Company</div>
              <div className="mt-3 flex flex-col gap-2 text-[14px] text-[#8F8E8C]">
                <Link href="/about" className="w-fit hover:text-white">
                  About Us
                </Link>
                <Link href="/catalog" className="w-fit hover:text-white">
                  Houses
                </Link>
              </div>
            </div>

            <div className="min-w-[140px]">
              <div className="text-[14px] font-semibold text-white">Follow Us</div>
              <div className="mt-3 flex flex-col gap-2 text-[14px] text-[#8F8E8C]">
                <a
                  href="https://www.instagram.com/house.of.watkins/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-fit hover:text-white"
                >
                  Instagram
                </a>
                <a
                  href="https://www.pinterest.com/HouseOfWatkinsLLC/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-fit hover:text-white"
                >
                  Pinterest
                </a>
                <a
                  href="https://www.facebook.com/House.of.Watkins/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-fit hover:text-white"
                >
                  Facebook
                </a>
                <a
                  href="https://www.linkedin.com/in/houseofwatkins/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-fit hover:text-white"
                >
                  LinkedIn
                </a>
              </div>
            </div>

            <div className="min-w-[200px]">
              <Link href="/faq" className="text-[14px] font-semibold text-white">
                FAQ
              </Link>
              <div className="mt-3">
                <FooterPolicyLinks variant="footerColumnDesktop" />
              </div>
            </div>

            <div className="ml-auto min-w-[260px]">
              <Link href="/contact-us" className="text-[14px] font-semibold text-white">
                Contact Us
              </Link>
              <div className="mt-3 flex flex-col gap-2 text-[14px] text-[#8F8E8C]">
                <a href="tel://+15412191673" className="w-fit hover:text-white">
                  +1 541 219 1673
                </a>
                <a href="mailto://david@houseofwatkins.com" className="w-fit hover:text-white">
                  david@houseofwatkins.com
                </a>
                <div className="text-[#8F8E8C]">16673 E Mansfield Circle,</div>
                <div className="text-[#8F8E8C]">Aurora, Colorado 80013</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Link
        href="/admin/login"
        title="Admin Login"
        className="absolute bottom-6 right-6 inline-flex h-[14px] w-[14px] items-center justify-center text-[#8F8E8C] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2B2A28]"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[14px] w-[14px]">
          <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
          <path d="M19.4 15a1.9 1.9 0 0 0 .38 2.09l.04.04a2.3 2.3 0 0 1-1.63 3.93 2.3 2.3 0 0 1-1.63-.68l-.04-.04A1.9 1.9 0 0 0 15 19.4a1.9 1.9 0 0 0-1.15 1.73V21.2a2.3 2.3 0 0 1-4.6 0v-.06A1.9 1.9 0 0 0 8 19.4a1.9 1.9 0 0 0-2.09.38l-.04.04a2.3 2.3 0 0 1-3.93-1.63 2.3 2.3 0 0 1 .68-1.63l.04-.04A1.9 1.9 0 0 0 4.6 15a1.9 1.9 0 0 0-1.73-1.15H2.8a2.3 2.3 0 0 1 0-4.6h.06A1.9 1.9 0 0 0 4.6 8a1.9 1.9 0 0 0-.38-2.09l-.04-.04a2.3 2.3 0 0 1 1.63-3.93 2.3 2.3 0 0 1 1.63.68l.04.04A1.9 1.9 0 0 0 8 4.6a1.9 1.9 0 0 0 1.15-1.73V2.8a2.3 2.3 0 0 1 4.6 0v.06A1.9 1.9 0 0 0 15 4.6a1.9 1.9 0 0 0 2.09-.38l.04-.04a2.3 2.3 0 0 1 3.93 1.63 2.3 2.3 0 0 1-.68 1.63l-.04.04A1.9 1.9 0 0 0 19.4 8c.5 0 .98.2 1.33.55.35.35.55.83.55 1.33s-.2.98-.55 1.33c-.35.35-.83.55-1.33.55Z" />
        </svg>
      </Link>
    </footer>
  );
};
