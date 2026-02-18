export const HeroHeading = (props: { cms?: { line1?: string; line2?: string } }) => {
  const line1 = props.cms?.line1 || "Design that feels like ";
  const line2 = props.cms?.line2 || "home";

  return (
    <div className="static box-content w-auto left-auto top-auto md:absolute md:w-[456.832px] md:left-[56.832px] md:top-[78.416px] font-gilroy font-semibold text-[79px] leading-[82px] tracking-normal tabular-nums lining-nums [leading-trim:none]">
      <p>{line1}</p>
      <p>{line2}</p>
    </div>
  );
};
