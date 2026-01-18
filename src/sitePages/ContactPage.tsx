import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import { CONTACT_EMAIL, CONTACT_PAGE_IMAGE_SRC, CONTACT_PHONE, SOCIAL_LINKS } from "@/lib/contact/config";
import { Reveal } from "@/components/Reveal";

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

const SocialIcon = (props: { href: string; label: string; children: React.ReactNode }) => (
  <a
    href={props.href}
    target="_blank"
    rel="noreferrer"
    className="inline-flex items-center justify-center text-neutral-700 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
    aria-label={props.label}
    title={props.label}
  >
    {props.children}
  </a>
);

export function ContactPage() {
  return <ContactPageInner />;
}

export type ContactPageMediaProps = {
  sideImageSrc?: string;
  sideImageAlt?: string;
};

export function ContactPageInner(props?: { media?: ContactPageMediaProps }) {
  const sideImageSrc = props?.media?.sideImageSrc || CONTACT_PAGE_IMAGE_SRC;
  const sideImageAlt = props?.media?.sideImageAlt || "Interior";

  const normalizedSideImageSrc = sideImageSrc.replace(/%25/g, "%").replace(/ /g, "%20");

  return (
    <main className="w-full px-[53px] py-12">
      <div className="mx-auto w-full max-w-[1323px]">
        <Reveal>
          <div className="text-xs text-neutral-500">
            <Link href="/" className="text-orange-600 hover:text-orange-700">
              Main
            </Link>
            <span className="px-1">/</span>
            <span className="text-neutral-700">Contact Us</span>
          </div>
        </Reveal>

        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Reveal className="w-full" delayMs={40}>
            <div>
              <h1 className="text-[4.125rem] font-bold leading-none tracking-tight text-neutral-900">Contact Us</h1>

              <div className="mt-3 flex flex-col gap-2 text-[1.1875rem] text-neutral-700 md:flex-row md:items-center md:gap-6">
                <a
                  href={`tel:${CONTACT_PHONE.replace(/\s+/g, "")}`}
                  className="inline-flex items-center gap-2 hover:text-neutral-900"
                >
                  <IconPhone className="h-4 w-4 text-orange-600" />
                  <span>{CONTACT_PHONE}</span>
                </a>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2 hover:text-neutral-900"
                >
                  <IconMail className="h-4 w-4 text-orange-600" />
                  <span>{CONTACT_EMAIL}</span>
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal className="w-full" delayMs={80}>
            <div className="flex justify-end gap-[14px]">
              <SocialIcon href={SOCIAL_LINKS.instagram} label="Instagram">
                <img
                  src="/placeholders/icon-15.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-[34px] w-[34px] brightness-0"
                />
              </SocialIcon>
              <SocialIcon href={SOCIAL_LINKS.pinterest} label="Pinterest">
                <img
                  src="/placeholders/icon-15.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-[34px] w-[34px] brightness-0"
                />
              </SocialIcon>
              <SocialIcon href={SOCIAL_LINKS.facebook} label="Facebook">
                <img
                  src="/placeholders/icon-15.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-[34px] w-[34px] brightness-0"
                />
              </SocialIcon>
              <SocialIcon href={SOCIAL_LINKS.linkedin} label="LinkedIn">
                <img
                  src="/placeholders/icon-15.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-[34px] w-[34px] brightness-0"
                />
              </SocialIcon>
            </div>
          </Reveal>
        </div>

        <div className="pt-[2.0625rem]">
          <div className="w-full rounded-[24px] bg-[#F5F5F5] md:aspect-[937/539]">
            <div className="grid h-full grid-cols-1 gap-[30px] p-[24px] md:grid-cols-[482fr_425fr] md:gap-[42px]">
              <div className="h-full">
                <div className="relative h-full w-full overflow-hidden rounded-[24px]">
                  <div className="h-full w-full" />
                  <img
                    src={normalizedSideImageSrc}
                    alt={sideImageAlt}
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </div>

              <Reveal className="h-full" delayMs={120}>
                <div className="flex w-full justify-center md:h-full md:items-center md:justify-center">
                  <ContactForm />
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        <div className="h-[6.625rem]" />
      </div>
    </main>
  );
}

export default ContactPage;
