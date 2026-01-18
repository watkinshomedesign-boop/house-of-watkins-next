"use client";

import Link from "next/link";
import { useState } from "react";

import { PolicyModal } from "@/components/policies/PolicyModal";
import { TermsOfServiceContent } from "@/components/policies/TermsOfServiceContent";
import { PrivacyPolicyContent } from "@/components/policies/PrivacyPolicyContent";
import { ReturnPolicyContent } from "@/components/policies/ReturnPolicyContent";

type Variant = "desktop" | "mobile" | "footerColumnDesktop" | "footerColumnMobile";

export function FooterPolicyLinks(props: { variant: Variant }) {
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);

  const linkClassDesktop =
    "bg-transparent p-0 text-base text-[#8F8E8C] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2B2A28]";

  const linkClassMobile =
    "bg-transparent px-1 py-2 text-[14px] font-normal text-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2B2A28]";

  const linkClassFooterColumnDesktop =
    "bg-transparent p-0 text-[14px] text-[#8F8E8C] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2B2A28]";

  const linkClassFooterColumnMobile =
    "bg-transparent p-0 text-[14px] font-normal text-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2B2A28]";

  const linkClass =
    props.variant === "desktop"
      ? linkClassDesktop
      : props.variant === "mobile"
        ? linkClassMobile
        : props.variant === "footerColumnDesktop"
          ? linkClassFooterColumnDesktop
          : linkClassFooterColumnMobile;

  const TermsButton = (
    <button type="button" className={linkClass} onClick={() => setTermsOpen(true)}>
      Terms of Service
    </button>
  );

  const PrivacyButton = (
    <button type="button" className={linkClass} onClick={() => setPrivacyOpen(true)}>
      Privacy Policy
    </button>
  );

  const ReturnButton = (
    <button type="button" className={linkClass} onClick={() => setReturnOpen(true)}>
      Return Policy
    </button>
  );

  const FaqLink = (
    <Link href="/faq" className={linkClass}>
      FAQ
    </Link>
  );

  const WhatsIncludedLink = (
    <Link href="/whats-included" className={linkClass}>
      {"What's Included"}
    </Link>
  );

  const ContactLink = (
    <Link href="/contact-us" className={linkClass}>
      Contact Us
    </Link>
  );

  return (
    <>
      {props.variant === "desktop" ? (
        <div className="hidden w-full md:grid md:grid-cols-6 md:items-center md:justify-items-center">
          {TermsButton}
          {PrivacyButton}
          {FaqLink}
          {ReturnButton}
          {WhatsIncludedLink}
          {ContactLink}
        </div>
      ) : props.variant === "mobile" ? (
        <div className="w-full">
          <div className="grid grid-cols-3 items-center justify-items-center gap-x-3">
            {TermsButton}
            {PrivacyButton}
            {FaqLink}
          </div>
          <div className="mt-3 grid grid-cols-3 items-center justify-items-center gap-x-3">
            {ReturnButton}
            {WhatsIncludedLink}
            {ContactLink}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-3">
          {WhatsIncludedLink}
          {PrivacyButton}
          {TermsButton}
          {ReturnButton}
        </div>
      )}

      <PolicyModal open={termsOpen} title="Terms of Service" onClose={() => setTermsOpen(false)}>
        <TermsOfServiceContent />
      </PolicyModal>

      <PolicyModal open={privacyOpen} title="Privacy Policy" onClose={() => setPrivacyOpen(false)}>
        <PrivacyPolicyContent />
      </PolicyModal>

      <PolicyModal open={returnOpen} title="Return Policy" onClose={() => setReturnOpen(false)}>
        <ReturnPolicyContent />
      </PolicyModal>
    </>
  );
}
