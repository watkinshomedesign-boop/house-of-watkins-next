import { FilterSection } from "@/sections/FilterSidebar/components/FilterSection";

export const FilterSidebar = () => {
  return (
    <div className="static text-base box-content caret-black shrink leading-[normal] min-h-0 min-w-0 outline-black w-auto md:relative md:text-[14.208px] md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:leading-[21.312px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[334.208px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
      <div className="static box-content caret-black outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row justify-normal outline-black gap-y-[normal] w-auto pl-0 md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[28.416px] md:flex md:flex-col md:justify-start md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[28.416px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:pl-[3.584px] md:scroll-m-0 md:scroll-p-[auto]">
          <FilterSection
            variant="header"
            title="Filter"
            showClearAll={true}
            showCloseButton={true}
            showConsultation={true}
            consultationUrl="https://meetings.hubspot.com/watkinshomedesign"
            consultationText="Book a consultation"
            consultationSubtext="Need help deciding? Talk to an expert."
            iconUrl="https://c.animaapp.com/mjfsv96lMpH6rC/assets/icon-4.svg"
          />
          <FilterSection
            variant="options-with-checkboxes"
            iconUrl="https://c.animaapp.com/mjfsv96lMpH6rC/assets/icon-5.svg"
            title="Bedrooms"
            options={[
              { label: "1" },
              { label: "2" },
              { label: "3" },
              { label: "4" },
              { label: "5" },
              { label: "6" },
            ]}
            checkboxOptions={[{ label: "Office" }, { label: "Casita" }]}
          />
          <FilterSection
            variant="options-only"
            title="Baths"
            iconUrl="https://c.animaapp.com/mjfsv96lMpH6rC/assets/icon-6.svg"
            options={[
              { label: "1" },
              { label: "1.5" },
              { label: "2" },
              { label: "2.5" },
              { label: "3+" },
            ]}
          />
          <FilterSection
            variant="options-only"
            title="Big Windows for Scenic Views"
            iconUrl="https://c.animaapp.com/mjfsv96lMpH6rC/assets/icon-7.svg"
            options={[
              { label: "None" },
              { label: "Back" },
              { label: "Side" },
              { label: "Front" },
              { label: "Angle" },
            ]}
          />
          <FilterSection
            variant="options-with-checkboxes"
            title="Garages"
            iconUrl="https://c.animaapp.com/mjfsv96lMpH6rC/assets/icon-8.svg"
            options={[
              { label: "0" },
              { label: "1" },
              { label: "2" },
              { label: "3+" },
            ]}
            checkboxOptions={[{ label: "RV" }, { label: "Side-load" }]}
          />
          <FilterSection
            variant="options-with-checkboxes"
            title="Stories"
            iconUrl="https://c.animaapp.com/mjfsv96lMpH6rC/assets/icon-9.svg"
            options={[{ label: "1" }, { label: "2" }]}
            checkboxOptions={[{ label: "Bonus Rm" }, { label: "Basement" }]}
          />
          <FilterSection
            variant="sliders"
            sliders={[
              {
                title: "Max Sq, ft",
                iconUrl:
                  "https://c.animaapp.com/mjfsv96lMpH6rC/assets/icon-10.svg",
                sliderIconUrl:
                  "https://c.animaapp.com/mjfsv96lMpH6rC/assets/icon-11.svg",
                min: "800",
                max: "4000",
                minLabel: "800",
                maxLabel: "4000",
              },
              {
                title: "Max Width, ft",
                iconUrl:
                  "https://c.animaapp.com/mjfsv96lMpH6rC/assets/icon-10.svg",
                sliderIconUrl:
                  "https://c.animaapp.com/mjfsv96lMpH6rC/assets/icon-12.svg",
                min: "10",
                max: "100",
                minLabel: "10",
                maxLabel: "100",
              },
              {
                title: "Max Depth, ft",
                iconUrl:
                  "https://c.animaapp.com/mjfsv96lMpH6rC/assets/icon-10.svg",
                sliderIconUrl:
                  "https://c.animaapp.com/mjfsv96lMpH6rC/assets/icon-13.svg",
                min: "10",
                max: "100",
                minLabel: "10",
                maxLabel: "100",
              },
            ]}
          />
          <FilterSection
            variant="styles"
            title="Styles"
            iconUrl="https://c.animaapp.com/mjfsv96lMpH6rC/assets/icon-14.svg"
            styleCheckboxes={[
              { label: "Craftsman" },
              { label: "Farmhouse" },
              { label: "Accessory" },
              { label: "Traditional" },
              { label: "2 Story" },
              { label: "Cottage" },
              { label: "Narrow Lot" },
              { label: "Contemporary" },
              { label: "Small Home" },
              { label: "Multi-Family" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
