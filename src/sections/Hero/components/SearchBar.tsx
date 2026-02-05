import searchIcon from "../../../../assets/search Icon.png";

export type SearchBarProps = {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  buttonLabel?: string;
  iconSrc?: string;
  iconAlt?: string;
  chatButton?: React.ReactNode;
};

 export const SearchBar = (props: SearchBarProps) => {
  const value = props.value ?? "";
  const onChange = props.onChange ?? (() => {});
 
  const defaultIconSrc = (searchIcon as any).src ?? (searchIcon as any);
  const iconSrc = defaultIconSrc;
  const iconAlt = String(props.iconAlt || "").trim() || "Icon";
 
  return (
    <div className="relative text-[15.2625px] items-center box-border caret-transparent gap-x-[11.4375px] flex basis-auto flex-col grow-0 shrink h-auto justify-start leading-[22.8937px] min-h-[auto] min-w-[auto] outline-[oklab(0.708_0_0_/_0.5)] gap-y-[11.4375px] w-full md:text-[14.208px] md:items-start md:gap-x-[10.624px] md:basis-0 md:flex-row md:grow md:shrink-0 md:h-[53.376px] md:justify-center md:leading-[21.312px] md:min-h-px md:min-w-px md:gap-y-[10.624px] md:w-auto">
      <div className="relative text-[15.2625px] box-border caret-transparent basis-auto grow-0 shrink h-[49.6125px] leading-[22.8937px] min-h-[auto] min-w-[auto] outline-[oklab(0.708_0_0_/_0.5)] w-full rounded-[33.4125px] md:text-[14.208px] md:basis-0 md:grow md:shrink-0 md:h-[53.376px] md:leading-[21.312px] md:min-h-px md:min-w-px md:w-auto md:rounded-[35.584px]">
        <div className="relative text-[15.2625px] items-center box-border caret-transparent flex h-full leading-[22.8937px] outline-[oklab(0.708_0_0_/_0.5)] w-full overflow-clip md:text-[14.208px] md:leading-[21.312px]">
          <div className="relative text-[15.2625px] items-center box-border caret-transparent gap-x-[11.4375px] flex h-[49.6125px] justify-start leading-[22.8937px] outline-[oklab(0.708_0_0_/_0.5)] gap-y-[11.4375px] w-full px-[15.2625px] py-[9.525px] md:text-[14.208px] md:gap-x-[14.208px] md:h-[53.376px] md:leading-[21.312px] md:gap-y-[14.208px] md:px-[21.376px] md:py-[12.416px]">
            <div className="relative text-[15.2625px] box-border caret-transparent shrink-0 h-[19.0875px] leading-[22.8937px] outline-[oklab(0.708_0_0_/_0.5)] w-[19.0875px] md:text-[14.208px] md:h-[21.376px] md:leading-[21.312px] md:w-[21.376px]">
              <img
                src={iconSrc}
                alt={iconAlt}
                className="text-[15.2625px] box-border caret-transparent h-full leading-[22.8937px] outline-[oklab(0.708_0_0_/_0.5)] w-full md:text-[14.208px] md:leading-[21.312px]"
              />
            </div>
            <div className="relative text-[15.2625px] items-center box-border caret-transparent gap-x-[9.525px] flex basis-0 grow shrink-0 h-full justify-center leading-[22.8937px] min-h-px min-w-px outline-[oklab(0.708_0_0_/_0.5)] gap-y-[9.525px] pt-[1.9125px] md:text-[14.208px] md:gap-x-[8.832px] md:leading-[21.312px] md:gap-y-[8.832px] md:pt-[1.792px]">
              <input
                type="text"
                placeholder="Search plans"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") props.onSubmit?.();
                }}
                className="text-stone-400 text-[14.325px] bg-transparent box-border caret-black block basis-0 grow leading-[21px] min-h-px min-w-px outline-[oklab(0.708_0_0_/_0.5)] text-start w-full p-0 focus:outline-none md:text-base md:leading-[24.832px]"
              />
            </div>
            {props.chatButton}
          </div>
        </div>
        <div className="absolute text-[15.2625px] box-border caret-transparent leading-[22.8937px] outline-[oklab(0.708_0_0_/_0.5)] pointer-events-none border border-stone-200 rounded-[33.4125px] border-solid inset-0 md:text-[14.208px] md:leading-[21.312px] md:rounded-[35.584px]"></div>
      </div>
      <button
        type="button"
        onClick={props.onSubmit}
        className="relative text-[15.2625px] items-center bg-orange-600 caret-transparent gap-x-[9.525px] flex shrink h-[49.6125px] justify-center leading-[22.8937px] outline-[oklab(0.708_0_0_/_0.5)] gap-y-[9.525px] w-full overflow-clip px-[38.175px] py-[9.525px] rounded-[38.175px] md:text-[14.208px] md:gap-x-[8.832px] md:shrink-0 md:h-full md:leading-[21.312px] md:gap-y-[8.832px] md:w-auto md:px-[35.584px] md:py-[8.832px] md:rounded-[35.584px]"
      >
        <div className="relative text-[15.2625px] items-center box-border caret-transparent gap-x-[9.525px] flex shrink-0 h-full justify-center leading-[22.8937px] outline-[oklab(0.708_0_0_/_0.5)] gap-y-[9.525px] pt-[3.825px] md:text-[14.208px] md:gap-x-[8.832px] md:leading-[21.312px] md:gap-y-[8.832px] md:pt-[3.584px]">
          <div className="relative text-white text-[14.325px] font-semibold box-border caret-transparent flex flex-col shrink-0 justify-center tracking-[1.425px] leading-[22.9125px] outline-[oklab(0.708_0_0_/_0.5)] uppercase text-nowrap md:text-[13.312px] md:tracking-[0.128px] md:leading-[21.376px]">
            <p className="text-[14.325px] box-border caret-transparent tracking-[1.425px] leading-[22.9125px] outline-[oklab(0.708_0_0_/_0.5)] text-nowrap md:text-[13.312px] md:tracking-[0.128px] md:leading-[21.376px]">
              {props.buttonLabel ?? "search"}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
};
