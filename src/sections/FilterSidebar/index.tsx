import { FilterSection } from "@/sections/FilterSidebar/components/FilterSection";

import iconBed from "../../../assets/Final small icon images black svg/Icon bed-black.svg";
import iconBath from "../../../assets/Final small icon images black svg/Icon bath-black.svg";
import iconGarage from "../../../assets/Final small icon images black svg/Icon garage-black.svg";
import iconLayers from "../../../assets/Final small icon images black svg/Icon layers-black.svg";
import iconMeasure from "../../../assets/Final small icon images black svg/Icon measure-black.svg";
import iconBox from "../../../assets/Final small icon images black svg/Icon box-black.svg";
import iconPlans from "../../../assets/Final small icon images black svg/Icon plans-black.svg";

export type CatalogFilterState = {
  bedrooms: string[];
  office: boolean;
  casita: boolean;
  baths: string[];
  bigWindows: string | null;
  garages: string[];
  rv: boolean;
  sideLoad: boolean;
  stories: string[];
  bonusRoom: boolean;
  basement: boolean;
  maxSqft: number | null;
  maxWidth: number | null;
  maxDepth: number | null;
  styles: string[];
};

export type FilterSidebarProps = {
  state: CatalogFilterState;
  onChange: (patch: Partial<CatalogFilterState>) => void;
  onClearAll: () => void;
  onClose?: () => void;
  onShowResults?: () => void;
  showResultsLabel?: string;
  hideHeaderClearAll?: boolean;
};

 const imgSrc = (mod: unknown): string => (mod as any)?.src ?? (mod as any);

export const FilterSidebar = (props: FilterSidebarProps) => {
  return (
    <div className="flex flex-col gap-6 text-base box-content caret-black shrink leading-[normal] min-h-0 min-w-0 outline-black w-auto md:relative md:text-[14.208px] md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:leading-[21.312px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[334.208px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
      <div className="static box-content caret-black outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row justify-normal outline-black gap-y-[normal] w-auto pl-0 md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[28.416px] md:flex md:flex-col md:justify-start md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[28.416px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:pl-[3.584px] md:scroll-m-0 md:scroll-p-[auto]">
          <FilterSection
            variant="header"
            title="Filter"
            showClearAll={!props.hideHeaderClearAll}
            showCloseButton={Boolean(props.onClose)}
            showConsultation={true}
            consultationUrl="https://meetings.hubspot.com/watkinshomedesign"
            consultationText="Book a consultation"
            consultationSubtext="Need help deciding? Talk to an expert."
            iconUrl={imgSrc(iconBed)}
            onClearAll={props.onClearAll}
            onClose={props.onClose}
            onShowResults={props.onShowResults}
            showResultsLabel={props.showResultsLabel}
          />
          <FilterSection
            variant="options-with-checkboxes"
            iconUrl={imgSrc(iconBed)}
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
            selectedOptions={props.state.bedrooms}
            selectedCheckboxes={{ Office: props.state.office, Casita: props.state.casita }}
            onToggleOption={(label) => {
              const exists = props.state.bedrooms.includes(label);
              const next = exists ? props.state.bedrooms.filter((x) => x !== label) : [...props.state.bedrooms, label];
              props.onChange({ bedrooms: next });
            }}
            onToggleCheckbox={(label) => {
              if (label === "Office") props.onChange({ office: !props.state.office });
              if (label === "Casita") props.onChange({ casita: !props.state.casita });
            }}
          />
          <FilterSection
            variant="options-only"
            title="Baths"
            iconUrl={imgSrc(iconBath)}
            options={[
              { label: "1" },
              { label: "1.5" },
              { label: "2" },
              { label: "2.5" },
              { label: "3+" },
            ]}
            selectedOptions={props.state.baths}
            onToggleOption={(label) => {
              const exists = props.state.baths.includes(label);
              const next = exists ? props.state.baths.filter((x) => x !== label) : [...props.state.baths, label];
              props.onChange({ baths: next });
            }}
          />
          <FilterSection
            variant="options-only"
            title="Big Windows for Scenic Views"
            iconUrl={imgSrc(iconMeasure)}
            options={[
              { label: "None" },
              { label: "Back" },
              { label: "Side" },
              { label: "Front" },
              { label: "Angle" },
            ]}
            selectedSingle={props.state.bigWindows}
            onSelectSingle={(label) => props.onChange({ bigWindows: label === "None" ? null : label })}
          />
          <FilterSection
            variant="options-with-checkboxes"
            title="Garages"
            iconUrl={imgSrc(iconGarage)}
            options={[
              { label: "0" },
              { label: "1" },
              { label: "2" },
              { label: "3+" },
            ]}
            checkboxOptions={[{ label: "RV" }, { label: "Side-load" }]}
            selectedOptions={props.state.garages}
            selectedCheckboxes={{ RV: props.state.rv, "Side-load": props.state.sideLoad }}
            onToggleOption={(label) => {
              const exists = props.state.garages.includes(label);
              const next = exists ? props.state.garages.filter((x) => x !== label) : [...props.state.garages, label];
              props.onChange({ garages: next });
            }}
            onToggleCheckbox={(label) => {
              if (label === "RV") props.onChange({ rv: !props.state.rv });
              if (label === "Side-load") props.onChange({ sideLoad: !props.state.sideLoad });
            }}
          />
          <FilterSection
            variant="options-with-checkboxes"
            title="Stories"
            iconUrl={imgSrc(iconLayers)}
            options={[{ label: "1" }, { label: "2" }]}
            checkboxOptions={[{ label: "Bonus Rm" }, { label: "Basement" }]}
            selectedOptions={props.state.stories}
            selectedCheckboxes={{ "Bonus Rm": props.state.bonusRoom, Basement: props.state.basement }}
            onToggleOption={(label) => {
              const exists = props.state.stories.includes(label);
              const next = exists ? props.state.stories.filter((x) => x !== label) : [...props.state.stories, label];
              props.onChange({ stories: next });
            }}
            onToggleCheckbox={(label) => {
              if (label === "Bonus Rm") props.onChange({ bonusRoom: !props.state.bonusRoom });
              if (label === "Basement") props.onChange({ basement: !props.state.basement });
            }}
          />
          <FilterSection
            variant="sliders"
            sliders={[
              {
                title: "Max Sq, ft",
                iconUrl: imgSrc(iconBox),
                sliderIconUrl:
                  "/placeholders/icon-15.svg",
                min: "800",
                max: "4000",
                minLabel: "800",
                maxLabel: "4000",
              },
              {
                title: "Max Width, ft",
                iconUrl: imgSrc(iconMeasure),
                sliderIconUrl:
                  "/placeholders/icon-15.svg",
                min: "10",
                max: "100",
                minLabel: "10",
                maxLabel: "100",
              },
              {
                title: "Max Depth, ft",
                iconUrl: imgSrc(iconMeasure),
                sliderIconUrl:
                  "/placeholders/icon-15.svg",
                min: "10",
                max: "100",
                minLabel: "10",
                maxLabel: "100",
              },
            ]}
            sliderValues={{
              "Max Sq, ft": props.state.maxSqft,
              "Max Width, ft": props.state.maxWidth,
              "Max Depth, ft": props.state.maxDepth,
            }}
            onSliderChange={(title, value) => {
              if (title === "Max Sq, ft") props.onChange({ maxSqft: value });
              if (title === "Max Width, ft") props.onChange({ maxWidth: value });
              if (title === "Max Depth, ft") props.onChange({ maxDepth: value });
            }}
          />
          <FilterSection
            variant="styles"
            title="Styles"
            iconUrl={imgSrc(iconPlans)}
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
            selectedOptions={props.state.styles}
            onToggleOption={(label) => {
              const exists = props.state.styles.includes(label);
              const next = exists ? props.state.styles.filter((x) => x !== label) : [...props.state.styles, label];
              props.onChange({ styles: next });
            }}
          />
        </div>
      </div>
    </div>
  );
};
