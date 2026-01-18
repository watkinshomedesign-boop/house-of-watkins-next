export type TeamMemberCardProps = {
  imageVariant: string;
  name: string;
  role: string;
  iconUrl: string;
};

export const TeamMemberCard = (props: TeamMemberCardProps) => {
  return (
    <div className="[align-items:normal] box-content caret-black gap-x-[normal] block basis-auto flex-row grow-0 min-h-0 min-w-0 outline-black gap-y-[normal] md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[14.208px] md:flex md:basis-[0%] md:flex-col md:grow md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[14.208px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
      <div
        className={`bg-transparent bg-none bg-repeat bg-auto box-content caret-black h-auto min-h-0 min-w-0 outline-black w-auto rounded-none md:aspect-auto md:bg-neutral-300 md:bg-no-repeat md:box-border md:caret-transparent md:h-[421.376px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:scroll-m-0 md:scroll-p-[auto] md:rounded-[35.584px] ${props.imageVariant}`}
      ></div>
      <div className="[align-items:normal] box-content caret-black gap-x-[normal] block min-h-0 min-w-0 outline-black gap-y-[normal] md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[14.208px] md:flex md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[14.208px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <div className="[align-items:normal] box-content caret-black gap-x-[normal] block min-h-0 min-w-0 outline-black gap-y-[normal] md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[10.624px] md:flex md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[10.624px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          <div className="box-content caret-black h-auto min-h-0 min-w-0 outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-[10.624px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[10.624px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <img
              src={props.iconUrl}
              alt="Icon"
              className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
            />
          </div>
          <p className="text-base font-normal box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-start text-wrap md:text-[17.792px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:leading-[26.624px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:text-center md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            {props.name}
          </p>
        </div>
        <div className="[align-items:normal] box-content caret-black gap-x-[normal] block min-h-0 min-w-0 outline-black gap-y-[normal] md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[10.624px] md:flex md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[10.624px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          <div className="box-content caret-black h-auto min-h-0 min-w-0 outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-[10.624px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[10.624px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <img
              src={props.iconUrl}
              alt="Icon"
              className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
            />
          </div>
          <p className="text-base box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-start text-wrap md:text-[13.312px] md:aspect-auto md:box-border md:caret-transparent md:leading-[19.584px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:text-center md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            {props.role}
          </p>
        </div>
      </div>
    </div>
  );
};
