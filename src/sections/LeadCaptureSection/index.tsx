import { LeadCaptureForm } from "@/sections/LeadCaptureSection/components/LeadCaptureForm";
import { urlForImage } from "@/lib/sanity/image";

function getImageUrl(source: unknown): string | null {
  if (!source) return null;
  if (typeof source === "string") return source;
  try {
    return urlForImage(source as any).width(1600).height(1200).fit("crop").url();
  } catch {
    return null;
  }
}

export const LeadCaptureSection = (props: { image?: unknown; imageAlt?: string }) => {
  const src = getImageUrl(props.image) ?? "/placeholders/whats-included-interior.svg";
  const alt = props.imageAlt ?? "Office interior";
  return (
    <div className="static box-content caret-black shrink min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:min-h-[426.624px] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
      <div className="static [align-items:normal] box-content caret-black block h-auto justify-normal outline-black w-auto px-0 md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:flex md:h-full md:justify-center md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:px-[56.832px] md:scroll-m-0 md:scroll-p-[auto]">
        <div className="static [align-items:normal] box-content caret-black block h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:items-start md:aspect-auto md:bg-stone-50 md:box-border md:caret-transparent md:flex md:min-h-[426.624px] md:min-w-[auto] md:rounded-[35.584px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:gap-0 md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          <LeadCaptureForm />
          <div className="static self-auto box-content caret-black shrink min-h-0 min-w-0 outline-black w-auto md:relative md:self-stretch md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:min-h-full md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[52%] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <div className="static box-content caret-black min-h-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:h-full md:overflow-hidden md:rounded-[35.584px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <img
                src={src}
                alt={alt}
                className="static box-content caret-black h-full min-h-0 object-cover outline-black w-full inset-auto md:absolute md:aspect-auto md:box-border md:caret-transparent md:h-full md:max-w-full md:object-cover md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:inset-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
