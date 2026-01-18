import { FormField } from "@/components/FormField";

export const OrderForm = () => {
  return (
    <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block h-auto min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[17.792px] md:flex md:h-full md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[17.792px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
      <FormField
        label="Plan Set"
        placeholder="Select a plan"
        iconUrl="https://c.animaapp.com/mjfxgf97dMquCY/assets/icon-3.svg"
      />
      <FormField
        label="Options"
        placeholder="Options ad-on"
        iconUrl="https://c.animaapp.com/mjfxgf97dMquCY/assets/icon-3.svg"
      />
    </div>
  );
};
