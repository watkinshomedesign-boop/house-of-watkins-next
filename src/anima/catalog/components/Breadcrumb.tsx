export const Breadcrumb = () => {
  return (
    <div className="relative text-[15.2625px] items-start box-border caret-transparent gap-x-[11.4375px] flex shrink-0 justify-start leading-[22.8937px] outline-[oklab(0.708_0_0_/_0.5)] gap-y-[11.4375px] w-full md:text-[14.208px] md:gap-x-[10.624px] md:leading-[21.312px] md:gap-y-[10.624px]">
      <div className="relative text-[15.2625px] items-center box-border caret-transparent gap-x-[9.525px] flex shrink-0 justify-center leading-[22.8937px] outline-[oklab(0.708_0_0_/_0.5)] gap-y-[9.525px] md:text-[14.208px] md:gap-x-[8.832px] md:leading-[21.312px] md:gap-y-[8.832px]">
        <button className="relative text-orange-600 text-[14.325px] font-medium bg-transparent caret-transparent block shrink-0 leading-[21px] outline-[oklab(0.708_0_0_/_0.5)] text-nowrap p-0 md:text-[13.312px] md:leading-[19.584px]">
          <p className="text-[14.325px] font-bold box-border caret-transparent leading-[21px] outline-[oklab(0.708_0_0_/_0.5)] text-nowrap md:text-[13.312px] md:leading-[19.584px]">
            Main
          </p>
        </button>
      </div>
      <div className="relative text-stone-400 text-[14.325px] font-semibold box-border caret-transparent shrink-0 leading-[21px] outline-[oklab(0.708_0_0_/_0.5)] text-nowrap md:text-[13.312px] md:leading-[19.584px]">
        <p className="text-[14.325px] box-border caret-transparent leading-[21px] outline-[oklab(0.708_0_0_/_0.5)] text-nowrap md:text-[13.312px] md:leading-[19.584px]">
          /
        </p>
      </div>
      <div className="relative text-[15.2625px] items-center box-border caret-transparent gap-x-[9.525px] flex shrink-0 justify-center leading-[22.8937px] outline-[oklab(0.708_0_0_/_0.5)] gap-y-[9.525px] md:text-[14.208px] md:gap-x-[8.832px] md:leading-[21.312px] md:gap-y-[8.832px]">
        <div className="relative text-stone-400 text-[14.325px] box-border caret-transparent shrink-0 leading-[21px] outline-[oklab(0.708_0_0_/_0.5)] text-nowrap md:text-[13.312px] md:leading-[19.584px]">
          <p className="text-[14.325px] font-bold box-border caret-transparent leading-[21px] outline-[oklab(0.708_0_0_/_0.5)] text-nowrap md:text-[13.312px] md:leading-[19.584px]">
            House plans
          </p>
        </div>
      </div>
    </div>
  );
};
