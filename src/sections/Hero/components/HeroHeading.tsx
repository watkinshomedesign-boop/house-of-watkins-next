export const HeroHeading = (props: { cms?: { line1?: string; line2?: string } }) => {
  const line1 = props.cms?.line1 || "Design that feels like ";
  const line2 = props.cms?.line2 || "home";

  return (
    <div className="static text-base normal-nums font-normal box-content caret-black leading-[normal] outline-black w-auto left-auto top-auto md:absolute md:text-[70.272px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:leading-[72.832px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[456.832px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:left-[56.832px] md:top-[108.416px]">
      <p className="box-content caret-black outline-black md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        {line1}
      </p>
      <p className="box-content caret-black outline-black md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        {line2}
      </p>
    </div>
  );
};
