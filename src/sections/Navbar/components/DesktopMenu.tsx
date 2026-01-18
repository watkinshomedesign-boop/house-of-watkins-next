import { NavbarButton } from "@/sections/Navbar/components/NavbarButton";

export type DesktopMenuProps = {
  variant: "navigation" | "contact";
  navigationItems?: Array<{
    text: string;
    variant: string;
  }>;
  contactItems?: Array<{
    text: string;
    variant: string;
    iconUrl?: string;
    iconAlt?: string;
  }>;
  actionButton?: {
    variant: string;
    iconUrl: string;
    iconAlt: string;
    showSecondaryDiv: boolean;
  };
};

export const DesktopMenu = (props: DesktopMenuProps) => {
  if (props.variant === "navigation") {
    return (
      <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:shrink-0 md:justify-start md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] basis-auto grow-0 md:gap-x-[28.416px] md:basis-0 md:grow md:min-h-px md:min-w-px md:gap-y-[28.416px]">
        <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:gap-x-[35.52px] md:justify-start md:gap-y-[35.52px]">
          {props.navigationItems?.map((item, index) => (
            <NavbarButton key={index} variant={item.variant} text={item.text} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:gap-x-[35.52px] md:justify-start md:gap-y-[35.52px]">
      <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:gap-x-[28.416px] md:justify-end md:gap-y-[28.416px]">
        {props.contactItems?.map((item, index) => (
          <NavbarButton
            key={index}
            variant={item.variant}
            text={item.text}
            iconUrl={item.iconUrl}
            iconAlt={item.iconAlt}
          />
        ))}
      </div>
      {props.actionButton && (
        <NavbarButton
          variant={props.actionButton.variant}
          iconUrl={props.actionButton.iconUrl}
          iconAlt={props.actionButton.iconAlt}
          showSecondaryDiv={props.actionButton.showSecondaryDiv}
        />
      )}
    </div>
  );
};
