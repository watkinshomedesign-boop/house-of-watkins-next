import type { HomePageMediaSlots } from "@/lib/homePage/types";
import { urlForImage } from "@/lib/sanity/image";
import Link from "next/link";
import iconArrowTopRightBlack from "../../../../assets/Final small icon images black svg/Icon arrow top right-black.svg";

function imageUrl(source: unknown): string | undefined {
  if (!source) return undefined;
  if (typeof source === "string") return source;
  try {
    return urlForImage(source as any).width(1600).fit("max").url();
  } catch {
    return undefined;
  }
}

export const WelcomeVideo = (props: { media?: HomePageMediaSlots }) => {
  const bgUrl = imageUrl(props.media?.welcomeCardBackgroundImage);
  const resolvedBgUrl = bgUrl ?? "/placeholders/plan-hero.svg";

  return (
    <div className="static box-content caret-black shrink min-h-0 min-w-0 outline-black w-auto rounded-none md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:scroll-m-0 md:scroll-p-[auto]">
      <div className="relative w-full overflow-hidden rounded-[35.584px]">
        <img
          src={resolvedBgUrl}
          alt=""
          className="block w-full object-cover md:h-[504px]"
          draggable={false}
        />
        <div className="absolute inset-0">
          <div className="absolute left-[clamp(16px,2.5vw,32px)] top-2/4 -translate-y-2/4 w-[clamp(300px,38vw,520px)] overflow-hidden rounded-[clamp(24px,2.6vw,32px)] bg-[#A88C62]/65 p-[clamp(18px,2.2vw,28px)] backdrop-blur-[32px] md:left-10 md:h-[409px] md:w-[678px] md:rounded-[40px] md:bg-[rgba(0,0,0,0.37)] md:p-8 md:backdrop-blur-[32px] md:backdrop-saturate-150 md:flex md:flex-col md:justify-start">
            <Link
              href="/about"
              aria-label="About"
              className="group static bg-zinc-100 caret-black inline-flex h-auto outline-black w-auto rounded-none right-auto top-auto md:absolute md:aspect-auto md:bg-white md:caret-transparent md:h-14 md:w-14 md:rounded-full md:right-6 md:top-6 md:items-center md:justify-center md:transition-shadow md:duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20"
            >
              <img
                src={(iconArrowTopRightBlack as any).src ?? (iconArrowTopRightBlack as any)}
                alt=""
                className="h-5 w-5 transition-transform duration-200 group-hover:scale-[1.02]"
                draggable={false}
              />
            </Link>
            <div className="static text-black text-base normal-nums font-normal box-content caret-black block flex-row justify-normal leading-[normal] outline-black w-auto left-auto top-auto text-center md:translate-y-[7px] md:text-left md:text-white md:text-[22px] md:font-medium md:leading-[32px] md:w-full">
              <div className="box-content caret-black min-h-0 min-w-0 outline-black">
                <p className="box-content caret-black outline-black md:max-w-[535px]">
                  <span className="md:font-semibold">Hello, I&#39;m David Watkins.</span> From my hands-on experience in construction, my studies at the Art Institute of Denver and my 30 years of experience as a designer, I&#39;ve honed the art of creating spaces that not only embrace aesthetic grace but resonate with the rhythms of the everyday lives of my clients and reflect their values and their individual senses of style. Notice in my portfolio that every house is unique. And that&#39;s because every client is different. It&#39;s reflected in my work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
