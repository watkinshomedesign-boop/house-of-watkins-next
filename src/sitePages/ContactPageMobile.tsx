"use client";

import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";

import { CONTACT_EMAIL, CONTACT_PHONE, SOCIAL_LINKS, CONTACT_PAGE_IMAGE_SRC } from "@/lib/contact/config";
import { MobileFooter } from "@/sitePages/home/mobile/MobileFooter";

import styles from "./ContactPageMobile.module.css";

import iconCart from "../../assets/Final small icon images black svg/Icon shopping cart-black.svg";

type ContactPageMediaProps = {
  sideImageSrc?: string;
  sideImageAlt?: string;
};

function imgSrc(mod: unknown): string {
  return (mod as any)?.src ?? (mod as any);
}

const IconPhone = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.51a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.57-1.06a2 2 0 0 1 2.11-.45c.81.24 1.65.42 2.51.54A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IconMail = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}>
    <path d="M4 4h16v16H4z" />
    <path d="m22 6-10 7L2 6" />
  </svg>
);

function SocialSvg(props: { kind: "instagram" | "pinterest" | "facebook" | "linkedin"; className?: string }) {
  if (props.kind === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5h.01" />
      </svg>
    );
  }
  if (props.kind === "pinterest") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}>
        <path d="M12 2a10 10 0 0 0-3.7 19.3c-.1-.8-.2-2 .1-2.9l1.2-5.1s-.3-.6-.3-1.5c0-1.4.8-2.5 1.9-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.3-.9 3.6-.2 1.1.6 2 1.7 2 2 0 3.6-2.1 3.6-5.1 0-2.7-1.9-4.5-4.7-4.5-3.2 0-5.1 2.4-5.1 4.9 0 1 .4 2 .9 2.6.1.1.1.2.1.3l-.3 1.1c0 .2-.2.2-.4.1-1.4-.7-2.2-2.8-2.2-4.6 0-3.7 2.7-7.2 7.8-7.2 4.1 0 7.3 2.9 7.3 6.8 0 4.1-2.6 7.4-6.2 7.4-1.2 0-2.3-.6-2.7-1.3l-.7 2.6c-.3 1-.9 2.2-1.3 3A10 10 0 0 0 12 22a10 10 0 0 0 0-20Z" />
      </svg>
    );
  }
  if (props.kind === "facebook") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V9h4v2" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function MobileContactHeader() {
  return (
    <header className="w-full bg-white">
      <div className="flex h-[58px] items-center justify-between px-4">
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/brand/Logo%20Images/House-of-Watkins-Logo-black.png"
            alt="House of Watkins"
            width={180}
            height={22}
            className="h-[22px] w-auto"
            priority
          />
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-600"
            aria-label="Cart"
          >
            <Image
              src={imgSrc(iconCart)}
              alt=""
              aria-hidden="true"
              width={18}
              height={18}
              className="h-[18px] w-[18px]"
              draggable={false}
            />
          </Link>

          <button
            type="button"
            aria-label="Menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-600"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-[18px] w-[18px] text-zinc-900"
              aria-hidden="true"
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export function ContactPageMobile(props?: { media?: ContactPageMediaProps }) {
  const sideImageSrc = props?.media?.sideImageSrc || CONTACT_PAGE_IMAGE_SRC;
  const sideImageAlt = props?.media?.sideImageAlt || "Interior";
  const normalizedSideImageSrc = sideImageSrc.replace(/%25/g, "%").replace(/ /g, "%20");

  return (
    <div className="bg-[#FAF9F7] text-zinc-800 font-gilroy">
      <MobileContactHeader />

      <div className="px-4 pb-10">
        <div className="pt-2 text-[12px] text-neutral-500">
          <Link href="/" className="text-orange-600 font-semibold">
            Main
          </Link>
          <span className="px-1">/</span>
          <span>Contacts</span>
        </div>

        <h1 className="mt-4 text-[36px] font-semibold leading-[1.1] text-neutral-900">Contacts</h1>

        <div className="mt-4 space-y-2 text-[14px] text-neutral-700">
          <a href={`tel:${CONTACT_PHONE.replace(/\s+/g, "")}`} className="inline-flex items-center gap-2">
            <IconPhone className="h-4 w-4 text-orange-600" />
            <span>{CONTACT_PHONE}</span>
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2">
            <IconMail className="h-4 w-4 text-orange-600" />
            <span>{CONTACT_EMAIL}</span>
          </a>
        </div>

        <div className="mt-4 flex items-center gap-4 text-neutral-700">
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="inline-flex">
            <SocialSvg kind="instagram" className="h-5 w-5" />
          </a>
          <a href={SOCIAL_LINKS.pinterest} target="_blank" rel="noreferrer" aria-label="Pinterest" className="inline-flex">
            <SocialSvg kind="pinterest" className="h-5 w-5" />
          </a>
          <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="inline-flex">
            <SocialSvg kind="facebook" className="h-5 w-5" />
          </a>
          <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="inline-flex">
            <SocialSvg kind="linkedin" className="h-5 w-5" />
          </a>
        </div>

        <div className="mt-6 rounded-[24px] bg-[#F5F5F5] p-5">
          <div className={styles.formCard}>
            <ContactForm />
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[24px] bg-neutral-200">
          <img src={normalizedSideImageSrc} alt={sideImageAlt} className="h-[300px] w-full object-cover" loading="lazy" />
        </div>
      </div>

      <MobileFooter />
    </div>
  );
}

export default ContactPageMobile;
