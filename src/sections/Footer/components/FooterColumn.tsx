import Link from "next/link";

export type FooterColumnProps = {
  title: string;
  variant: string;
  items: Array<{
    type: "button" | "link" | "text";
    text: string;
    href?: string;
    className?: string;
  }>;
};

export const FooterColumn = (props: FooterColumnProps) => {
  return (
    <div
      className={`static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row shrink justify-normal leading-[normal] min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[14.208px] md:flex md:flex-col md:shrink-0 md:justify-start md:leading-[0px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[14.208px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] ${props.variant}`}
    >
      <div className="static text-black text-base font-normal box-content caret-black shrink min-h-0 min-w-0 outline-black text-wrap md:relative md:text-white md:text-[17.792px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[26.624px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          {props.title}
        </p>
      </div>
      {props.items.map((item, index) => {
        if (item.type === "button") {
          return (
            <button
              key={index}
              className="static text-black text-[13.3333px] bg-zinc-100 caret-black inline-block flex-row shrink justify-normal min-h-0 min-w-0 outline-black text-wrap md:relative md:text-[#8F8E8C] md:text-base md:aspect-auto md:bg-transparent md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto]"
            >
              <p
                className={`box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black md:aspect-auto md:box-border md:caret-transparent md:leading-[24.832px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] text-wrap md:text-nowrap ${item.className || ""}`}
              >
                {item.text}
              </p>
            </button>
          );
        }

        if (item.type === "link" && item.href) {
          if (item.href.startsWith("/")) {
            return (
              <Link
                key={index}
                href={item.href}
                className={
                  item.className ||
                  "static text-black text-base box-content caret-black inline flex-row shrink justify-normal min-h-0 min-w-0 outline-black w-auto md:relative md:text-[#8F8E8C] md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:min-h-[auto] md:min-w-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-min md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
                }
              >
                <p
                  className={`box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black md:aspect-auto md:box-border md:caret-transparent md:leading-[24.832px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] ${item.className === "static text-black text-base box-content caret-black inline flex-row shrink justify-normal min-h-0 min-w-0 outline-black md:relative md:text-stone-400 md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:min-h-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] text-wrap md:min-w-[auto] md:text-nowrap" ? "text-wrap md:text-nowrap" : ""}`}
                >
                  {item.text}
                </p>
              </Link>
            );
          }

          return (
            <a
              key={index}
              href={item.href}
              className={
                item.className ||
                "static text-black text-base box-content caret-black inline flex-row shrink justify-normal min-h-0 min-w-0 outline-black w-auto md:relative md:text-[#8F8E8C] md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:min-h-[auto] md:min-w-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-min md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
              }
            >
              <p
                className={`box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black md:aspect-auto md:box-border md:caret-transparent md:leading-[24.832px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] ${item.className === "static text-black text-base box-content caret-black inline flex-row shrink justify-normal min-h-0 min-w-0 outline-black md:relative md:text-stone-400 md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:min-h-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] text-wrap md:min-w-[auto] md:text-nowrap" ? "text-wrap md:text-nowrap" : ""}`}
              >
                {item.text}
              </p>
            </a>
          );
        }

        if (item.type === "text") {
          return (
            <div
              key={index}
              className="static text-black text-base box-content caret-black block flex-row shrink justify-normal min-h-0 min-w-0 outline-black w-auto md:relative md:text-[#8F8E8C] md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:min-h-[auto] md:min-w-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-min md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
            >
              {item.href ? (
                <a
                  href={item.href}
                  className="box-content caret-black inline leading-[normal] min-h-0 min-w-0 outline-black md:aspect-auto md:box-border md:caret-transparent md:block md:leading-[24.832px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
                >
                  {item.text}
                </a>
              ) : (
                <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black md:aspect-auto md:box-border md:caret-transparent md:leading-[24.832px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                  {item.text}
                </p>
              )}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};
