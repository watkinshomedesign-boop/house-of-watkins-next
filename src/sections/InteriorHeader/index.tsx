"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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
    viewBox="956 45 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={props.className}
    aria-hidden="true"
  >
    <path
      d="M976.309 61.275C976.309 61.575 976.242 61.8834 976.1 62.1834C975.959 62.4834 975.775 62.7667 975.534 63.0334C975.125 63.4834 974.675 63.8084 974.167 64.0167C973.667 64.225 973.125 64.3334 972.542 64.3334C971.692 64.3334 970.784 64.1334 969.825 63.725C968.867 63.3167 967.909 62.7667 966.959 62.075C966 61.375 965.092 60.6 964.225 59.7417C963.367 58.875 962.592 57.9667 961.9 57.0167C961.217 56.0667 960.667 55.1167 960.267 54.175C959.867 53.225 959.667 52.3167 959.667 51.45C959.667 50.8834 959.767 50.3417 959.967 49.8417C960.167 49.3334 960.484 48.8667 960.925 48.45C961.459 47.925 962.042 47.6667 962.659 47.6667C962.892 47.6667 963.125 47.7167 963.334 47.8167C963.55 47.9167 963.742 48.0667 963.892 48.2834L965.825 51.0084C965.975 51.2167 966.084 51.4084 966.159 51.5917C966.234 51.7667 966.275 51.9417 966.275 52.1C966.275 52.3 966.217 52.5 966.1 52.6917C965.992 52.8834 965.834 53.0834 965.634 53.2834L965 53.9417C964.909 54.0334 964.867 54.1417 964.867 54.275C964.867 54.3417 964.875 54.4 964.892 54.4667C964.917 54.5334 964.942 54.5834 964.959 54.6334C965.109 54.9084 965.367 55.2667 965.734 55.7C966.109 56.1334 966.509 56.575 966.942 57.0167C967.392 57.4584 967.825 57.8667 968.267 58.2417C968.7 58.6084 969.059 58.8584 969.342 59.0084C969.384 59.025 969.434 59.05 969.492 59.075C969.559 59.1 969.625 59.1084 969.7 59.1084C969.842 59.1084 969.95 59.0584 970.042 58.9667L970.675 58.3417C970.884 58.1334 971.084 57.975 971.275 57.875C971.467 57.7584 971.659 57.7 971.867 57.7C972.025 57.7 972.192 57.7334 972.375 57.8084C972.559 57.8834 972.75 57.9917 972.959 58.1334L975.717 60.0917C975.934 60.2417 976.084 60.4167 976.175 60.625C976.259 60.8334 976.309 61.0417 976.309 61.275Z"
      stroke="#FF5C02"
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

export const InteriorHeader = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
    <header className="w-full bg-[#FAF9F7]">
      <div className="mx-auto w-full px-4 md:px-[50px] min-[1440px]:px-[56px]">
        <div className="flex h-[72px] w-full items-center justify-between">
          <div className="flex items-center gap-[56px]">
            <Link href="/" className="block">
              <img
                src="/brand/Logo%20Images/House-of-Watkins-Logo-black.png"
                alt="House of Watkins"
                className="h-[22px] w-auto"
              />
            </Link>

            <nav className="hidden md:flex flex-nowrap items-center gap-[30px] whitespace-nowrap text-[15px] font-bold leading-[22px] text-[#2B2A28]">
              {navItems.map((item) => {
                const active = item.href === activeHref;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      (active
                        ? "text-[#FF5C02]"
                        : "text-[#2B2A28] hover:text-[#FF5C02]") + " whitespace-nowrap"
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
              className="flex items-center gap-2 text-[15px] font-bold leading-[22px] text-[#FF5C02]"
            >
              <IconPhone className="h-[18px] w-[18px]" />
              +1 541 219 1673
            </a>
            <a
              href="mailto:david@houseofwatkins.com"
              className="text-[15px] font-bold leading-[22px] text-[#FF5C02]"
            >
              david@houseofwatkins.com
            </a>
            <Link
              href="/cart"
              className="flex h-[50px] w-[50px] items-center justify-center rounded-full border-[1.5px] border-[#FF5C02] bg-white"
              aria-label="Cart"
            >
              <IconCart className="h-[22px] w-[22px]" />
            </Link>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <Link
              href="/cart"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-600"
              aria-label="Cart"
            >
              <IconCart className="h-5 w-5 text-zinc-900" />
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
            <img
              src="/brand/Logo%20Images/House-of-Watkins-Logo-black.png"
              alt="House of Watkins"
              className="h-[22px] w-auto"
            />
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
                      "py-4 border-b border-zinc-200 text-[14px] font-semibold " +
                      (active ? "text-orange-600" : "text-zinc-900")
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
                className="flex items-center gap-2 text-[14px] font-semibold text-orange-600"
              >
                <IconPhone className="h-4 w-4" />
                +1 541 219 1673
              </a>
              <a
                href="mailto:david@houseofwatkins.com"
                className="flex items-center gap-2 text-[14px] font-semibold text-orange-600"
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
