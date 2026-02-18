"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/cart/CartContext";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "About Us", href: "/about" },
  { label: "Houses", href: "/house-plans" },
  { label: "Blog", href: "/blog" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "FAQ", href: "/faq" },
];

const IconCart = (props: { className?: string }) => (
  <svg
    viewBox="1359 44 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={props.className}
    aria-hidden="true"
  >
    <path
      d="M1361 46H1362.74C1363.82 46 1364.67 46.93 1364.58 48L1363.75 57.96C1363.61 59.59 1364.9 60.99 1366.54 60.99H1377.19C1378.63 60.99 1379.89 59.81 1380 58.38L1380.54 50.88C1380.66 49.22 1379.4 47.87 1377.73 47.87H1364.82"
      stroke="#2B2A28"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1375.25 66C1375.94 66 1376.5 65.4404 1376.5 64.75C1376.5 64.0596 1375.94 63.5 1375.25 63.5C1374.56 63.5 1374 64.0596 1374 64.75C1374 65.4404 1374.56 66 1375.25 66Z"
      stroke="#2B2A28"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1367.25 66C1367.94 66 1368.5 65.4404 1368.5 64.75C1368.5 64.0596 1367.94 63.5 1367.25 63.5C1366.56 63.5 1366 64.0596 1366 64.75C1366 65.4404 1366.56 66 1367.25 66Z"
      stroke="#2B2A28"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1368 52H1380"
      stroke="#2B2A28"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconHamburger = (props: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={props.className}
    aria-hidden="true"
  >
    <path d="M4 6h16" />
    <path d="M4 12h16" />
    <path d="M4 18h16" />
  </svg>
);

const IconX = (props: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={props.className}
    aria-hidden="true"
  >
    <path d="M18 6 6 18" />
    <path d="M6 6l12 12" />
  </svg>
);

const IconPhone = (props: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={props.className}
    aria-hidden="true"
  >
    <path
      d="M18.3082 15.2753C18.3082 15.5753 18.2415 15.8837 18.0998 16.1837C17.9582 16.4837 17.7748 16.767 17.5332 17.0337C17.1248 17.4837 16.6748 17.8087 16.1665 18.017C15.6665 18.2253 15.1248 18.3337 14.5415 18.3337C13.6915 18.3337 12.7832 18.1337 11.8248 17.7253C10.8665 17.317 9.90817 16.767 8.95817 16.0753C7.99984 15.3753 7.0915 14.6003 6.22484 13.742C5.3665 12.8753 4.5915 11.967 3.89984 11.017C3.2165 10.067 2.6665 9.11699 2.2665 8.17533C1.8665 7.22533 1.6665 6.31699 1.6665 5.45033C1.6665 4.88366 1.7665 4.34199 1.9665 3.84199C2.1665 3.33366 2.48317 2.86699 2.92484 2.45033C3.45817 1.92533 4.0415 1.66699 4.65817 1.66699C4.8915 1.66699 5.12484 1.71699 5.33317 1.81699C5.54984 1.91699 5.7415 2.06699 5.8915 2.28366L7.82484 5.00866C7.97484 5.21699 8.08317 5.40866 8.15817 5.59199C8.23317 5.76699 8.27484 5.94199 8.27484 6.10033C8.27484 6.30033 8.2165 6.50033 8.09984 6.69199C7.9915 6.88366 7.83317 7.08366 7.63317 7.28366L6.99984 7.94199C6.90817 8.03366 6.8665 8.14199 6.8665 8.27533C6.8665 8.34199 6.87484 8.40033 6.8915 8.46699C6.9165 8.53366 6.9415 8.58366 6.95817 8.63366C7.10817 8.90866 7.3665 9.26699 7.73317 9.70033C8.10817 10.1337 8.50817 10.5753 8.9415 11.017C9.3915 11.4587 9.82484 11.867 10.2665 12.242C10.6998 12.6087 11.0582 12.8587 11.3415 13.0087C11.3832 13.0253 11.4332 13.0503 11.4915 13.0753C11.5582 13.1003 11.6248 13.1087 11.6998 13.1087C11.8415 13.1087 11.9498 13.0587 12.0415 12.967L12.6748 12.342C12.8832 12.1337 13.0832 11.9753 13.2748 11.8753C13.4665 11.7587 13.6582 11.7003 13.8665 11.7003C14.0248 11.7003 14.1915 11.7337 14.3748 11.8087C14.5582 11.8837 14.7498 11.992 14.9582 12.1337L17.7165 14.092C17.9332 14.242 18.0832 14.417 18.1748 14.6253C18.2582 14.8337 18.3082 15.042 18.3082 15.2753Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
    />
  </svg>
);

const IconMail = (props: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
    aria-hidden="true"
  >
    <path d="M4 4h16v16H4z" />
    <path d="m22 6-10 7L2 6" />
  </svg>
);

const Logo = (props: { className?: string }) => (
  <svg
    width="74"
    height="30"
    viewBox="0 0 74 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    className={props.className}
    aria-hidden="true"
  >
    <rect width="74" height="29" fill="url(#pattern0_2801_2533)" />
    <defs>
      <pattern id="pattern0_2801_2533" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use
          xlinkHref="#image0_2801_2533"
          transform="matrix(0.00244093 0 0 0.00596652 -0.00180323 0.00653332)"
        />
      </pattern>
      <image
        id="image0_2801_2533"
        width="409"
        height="163"
        preserveAspectRatio="none"
        xlinkHref="data:image/png;base64,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"
      />
    </defs>
  </svg>
);

export const InteriorHeader = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const cart = useCart();
  const hasCartItems = cart.items.length > 0;

  const activeHref = useMemo(() => {
    if (!pathname) return "";
    const exact = navItems.find((i) => i.href === pathname);
    return exact?.href ?? "";
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="w-full bg-[#FAF9F7] font-gilroy text-[15px] font-normal leading-[22px] tracking-normal">
      <div className="mx-auto w-full px-4 md:px-[50px] min-[1440px]:px-[56px]">
        <div className="flex h-[72px] w-full items-center justify-between">
          <div className="flex items-center gap-[80px]">
            <Link href="/" className="block" aria-label="House of Watkins">
              <Logo className="h-[30px] w-[74px]" />
            </Link>

            <nav className="hidden md:flex flex-nowrap items-center gap-[30px] whitespace-nowrap text-[#2B2A28]">
              {navItems.map((item) => {
                const active = item.href === activeHref;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      (active ? "text-[#FF5C02]" : "text-[#2B2A28] hover:text-[#FF5C02]") +
                      " whitespace-nowrap"
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-[28.416px]">
            <a
              href="tel:+15412191673"
              className="flex items-center gap-2 cursor-pointer text-[#FF5C02] hover:text-black"
            >
              <IconPhone className="h-5 w-5" />
              +1 541 219 1673
            </a>
            <a
              href="mailto:david@houseofwatkins.com"
              className="cursor-pointer pointer-events-auto text-[#2B2A28] hover:underline"
            >
              david@houseofwatkins.com
            </a>
            <Link
              href="/cart"
              className="relative flex h-[50px] w-[50px] items-center justify-center rounded-full border-[1.5px] border-[#FF5C02] bg-white"
              aria-label="Cart"
            >
              <span className="relative inline-flex">
                <IconCart className="h-[22px] w-[22px]" />
                {hasCartItems ? (
                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#FF5C02]" aria-hidden="true" />
                ) : null}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-orange-600"
              aria-label="Cart"
            >
              <span className="relative inline-flex">
                <IconCart className="h-5 w-5 text-zinc-900" />
                {hasCartItems ? (
                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#FF5C02]" aria-hidden="true" />
                ) : null}
              </span>
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-600"
            >
              <IconHamburger className="h-5 w-5 text-zinc-900" />
            </button>
          </div>
        </div>
      </div>

      <div
        className={
          open
            ? "fixed inset-0 z-50 bg-black/30"
            : "pointer-events-none fixed inset-0 z-50 bg-transparent"
        }
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      >
        <div
          className={
            open
              ? "absolute right-0 top-0 h-full w-[320px] bg-white shadow-xl transition-transform duration-300 translate-x-0"
              : "absolute right-0 top-0 h-full w-[320px] bg-white shadow-xl transition-transform duration-300 translate-x-full"
          }
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-5 h-[72px] border-b border-zinc-200">
            <Logo className="h-[30px] w-[74px]" />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-600"
            >
              <IconX className="h-5 w-5 text-zinc-900" />
            </button>
          </div>

          <div className="px-5 py-4">
            <div className="flex flex-col">
              {navItems.map((item) => {
                const active = item.href === activeHref;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      "py-4 border-b border-zinc-200 " + (active ? "text-orange-600" : "text-zinc-900")
                    }
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href="tel:+15412191673"
                className="flex items-center gap-2 cursor-pointer text-orange-600 hover:text-black"
              >
                <IconPhone className="h-5 w-5" />
                +1 541 219 1673
              </a>
              <a
                href="mailto:david@houseofwatkins.com"
                className="flex items-center gap-2 cursor-pointer pointer-events-auto text-[#2B2A28] hover:underline"
              >
                <IconMail className="h-4 w-4" />
                david@houseofwatkins.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
