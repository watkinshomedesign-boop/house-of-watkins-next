export const HeroFeatureImage = (props: { cms?: { src?: string; alt?: string } }) => {
  const src = props.cms?.src || "/placeholders/plan-hero.svg";
  const alt = props.cms?.alt || "Portrait";

  return (
    <div className="static box-content caret-black h-auto outline-black w-auto rounded-none left-auto top-auto md:absolute md:aspect-auto md:box-border md:caret-transparent md:h-[139.52px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[139.52px] md:[mask-position:0%] md:scroll-m-0 md:scroll-p-[auto] md:rounded-[500px] md:left-[353.792px] md:top-[214.376px] overflow-hidden">
      <img src={src} alt={alt} className="h-full w-full object-cover" draggable={false} />
    </div>
  );
};
