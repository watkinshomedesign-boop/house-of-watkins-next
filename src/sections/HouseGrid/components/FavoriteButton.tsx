export type FavoriteButtonProps = {
  iconUrl?: string;
  iconAlt?: string;
  className?: string;
};

export const FavoriteButton = (props: FavoriteButtonProps) => {
  const {
    iconUrl = "/placeholders/icon-15.svg",
    iconAlt = "Icon",
    className = "",
  } = props;

  return (
    <button
      className={`static [align-items:normal] bg-zinc-100 caret-black gap-x-[normal] inline-block h-auto justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto rounded-none md:relative md:items-center md:aspect-auto md:bg-rose-50 md:caret-transparent md:gap-x-[8.832px] md:flex md:h-[44.416px] md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[44.416px] md:overflow-clip md:[mask-position:0%] md:bg-left-top md:p-[11.52px] md:scroll-m-0 md:scroll-p-[auto] md:rounded-[100px] ${className}`}
    >
      <div className="box-content caret-black min-h-0 min-w-0 outline-black md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <div className="static box-content caret-black h-auto outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:h-[21.376px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[21.376px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          <img
            src={iconUrl}
            alt={iconAlt}
            className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
          />
        </div>
      </div>
    </button>
  );
};
