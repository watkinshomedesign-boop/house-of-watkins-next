import Link from "next/link";

export const FooterLogo = () => {
  return (
    <div className="static [align-items:normal] box-content caret-black block basis-auto grow-0 shrink justify-normal min-h-0 min-w-0 outline-black w-auto md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:flex md:basis-0 md:grow md:shrink-0 md:justify-between md:min-h-px md:min-w-px md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
      <Link href="/" className="contents">
        <button className="[align-items:normal] bg-zinc-100 caret-black inline-block shrink justify-normal min-h-0 min-w-0 outline-black w-auto md:items-center md:aspect-auto md:bg-transparent md:caret-transparent md:flex md:shrink-0 md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[106px] md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto]">
          <img
            src="/brand/Logo%20Images/Logo%20Stacked.png"
            alt="Logo"
            className="box-content caret-black max-w-none min-h-0 min-w-0 outline-black invert md:aspect-auto md:box-border md:caret-transparent md:max-w-full md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
          />
        </button>
      </Link>
    </div>
  );
};
