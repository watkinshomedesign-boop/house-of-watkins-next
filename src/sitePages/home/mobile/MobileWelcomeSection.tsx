import type { HomePageMediaSlots } from "@/lib/homePage/types";
import { urlForImage } from "@/lib/sanity/image";

function imageUrl(source: unknown): string | undefined {
  if (!source) return undefined;
  if (typeof source === "string") return source;
  try {
    return urlForImage(source as any).width(1600).fit("max").url();
  } catch {
    return undefined;
  }
}

export function MobileWelcomeSection(props: { media?: HomePageMediaSlots }) {
  const bgUrl = imageUrl(props.media?.welcomeCardBackgroundImage);
  const portraitUrl = imageUrl(props.media?.welcomeCardPortraitImage);

  return (
    <div className="rounded-3xl bg-neutral-100 overflow-hidden">
      {bgUrl ? <img src={bgUrl} alt="" className="h-[220px] w-full object-cover" draggable={false} /> : null}

      <div className="px-5 pb-6 pt-5">
        {portraitUrl ? (
          <div className="-mt-14 mb-4 flex justify-center">
            <div className="h-[112px] w-[112px] overflow-hidden rounded-full border-4 border-neutral-100 bg-white">
              <img src={portraitUrl} alt="" className="h-full w-full object-cover" draggable={false} />
            </div>
          </div>
        ) : null}

        <div className="text-[14px] leading-[20px] text-neutral-800">
          Hello, I&apos;m David Watkins. From my hands-on experience in construction, my studies at the Art Institute of Denver and my 30 years of
          experience as a designer, I&apos;ve honed the art of creating spaces that not only embrace aesthetic grace but resonate with the rhythms of the
          everyday lives of my clients and reflect their values and their individual senses of style. Notice in my portfolio that every house is unique.
          And that&apos;s because every client is different. It&apos;s reflected in my work.
        </div>
      </div>
    </div>
  );
}

export default MobileWelcomeSection;
