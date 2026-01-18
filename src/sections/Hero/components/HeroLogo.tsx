import Link from "next/link";

export const HeroLogo = () => {
  return (
    <Link href="/" className="contents">
      <button className="static bg-zinc-100 caret-black inline-block shrink h-auto outline-black w-auto left-auto top-auto md:absolute md:aspect-auto md:bg-transparent md:caret-transparent md:block md:shrink-0 md:h-[34.688px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[84.736px] md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:left-[56.832px] md:top-[15.584px] md:origin-top-left md:transform md:scale-[2.5]">
        <div className="static bg-none bg-repeat bg-auto box-content caret-black outline-black inset-auto md:absolute md:aspect-auto md:bg-[url('/brand/Logo%20Images/House-of-Watkins-Logo-white.png')] md:bg-no-repeat md:bg-contain md:bg-left md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:scroll-m-0 md:scroll-p-[auto] md:inset-0"></div>
      </button>
    </Link>
  );
};
