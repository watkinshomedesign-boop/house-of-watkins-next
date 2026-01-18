import { DetailItem } from "@/sections/ContentSection/components/DetailItem";

export const DetailsSection = () => {
  return (
    <div className="[align-items:normal] box-content caret-black gap-x-[normal] block flex-row min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[28.416px] md:flex md:flex-col md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[28.416px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
      <DetailItem
        variant="font-normal [align-items:normal] gap-x-[normal] block flex-row leading-[normal] gap-y-[normal] text-wrap md:font-semibold md:items-start md:gap-x-[7.168px] md:flex md:flex-col md:leading-[0px] md:gap-y-[7.168px] md:text-nowrap"
        title="Name of Project"
        content="Mountain Retreat"
      />
      <DetailItem
        variant="[align-items:normal] gap-x-[normal] block flex-row leading-[normal] gap-y-[normal] w-auto md:items-start md:gap-x-[7.168px] md:flex md:flex-col md:leading-[0px] md:gap-y-[7.168px] md:w-full"
        title="Description"
        content="Welcome to the Mountain Retreat, a thoughtfully designed home where practicality meets luxurious living. With 3 spacious bedrooms, 2 full bathrooms, and an open, single-story layout spread across 1,440 sq. ft., this house plan is tailored to meet the needs of families who value both comfort and style."
      />
      <DetailItem variant="static box-content caret-black shrink h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:h-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]" />
      <DetailItem
        variant="[align-items:normal] gap-x-[normal] block flex-row gap-y-[normal] w-auto md:items-start md:gap-x-[14.208px] md:flex md:flex-col md:gap-y-[14.208px] md:w-full"
        title="Square Footage Breakdown"
        items={[
          { label: "Total Heated Area", value: "1,440 Sq Ft" },
          { label: "1st Floor", value: "30 Sq Ft" },
          { label: "Covered Patio", value: "92 Sq Ft" },
          { label: "Porch, Front", value: "42 Sq Ft" },
        ]}
      />
      <DetailItem
        variant="[align-items:normal] gap-x-[normal] block flex-row gap-y-[normal] w-auto md:items-start md:gap-x-[14.208px] md:flex md:flex-col md:gap-y-[14.208px] md:w-full"
        title="Beds/Baths"
        items={[
          { label: "Bedrooms", value: "4" },
          { label: "Full bathrooms", value: "2" },
        ]}
      />
      <DetailItem
        variant="[align-items:normal] gap-x-[normal] block flex-row gap-y-[normal] w-auto md:items-start md:gap-x-[14.208px] md:flex md:flex-col md:gap-y-[14.208px] md:w-full"
        title="Exterior Walls"
        items={[{ label: "Standard Type(s)", value: "2х6" }]}
      />
      <DetailItem
        variant="[align-items:normal] gap-x-[normal] block flex-row gap-y-[normal] w-auto md:items-start md:gap-x-[14.208px] md:flex md:flex-col md:gap-y-[14.208px] md:w-full"
        title="Garage"
        items={[
          { label: "Type", value: "Attached" },
          { label: "Area", value: "446 sq. ft." },
          { label: "Count", value: "1" },
          { label: "Entry Location", value: "Front" },
        ]}
      />
      <DetailItem
        variant="[align-items:normal] gap-x-[normal] block flex-row gap-y-[normal] w-auto md:items-start md:gap-x-[14.208px] md:flex md:flex-col md:gap-y-[14.208px] md:w-full"
        title="Ceiling Heights"
        items={[
          { label: "First Floor", value: "9 ft." },
          { label: "Living Room", value: "10' Vaulted" },
        ]}
      />
      <DetailItem
        variant="[align-items:normal] gap-x-[normal] block flex-row gap-y-[normal] w-auto md:items-start md:gap-x-[14.208px] md:flex md:flex-col md:gap-y-[14.208px] md:w-full"
        title="Roof Details"
        items={[
          { label: "Primary Pitch", value: "4:12" },
          { label: "Framing Type", value: "Truss" },
        ]}
      />
      <DetailItem variant="static box-content caret-black shrink h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:h-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]" />
      <div className="[align-items:normal] box-content caret-black gap-x-[normal] block flex-row leading-[normal] min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[7.168px] md:flex md:flex-col md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[7.168px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <div className="static text-black font-normal box-content caret-black shrink min-h-0 min-w-0 outline-black text-wrap md:relative md:text-stone-400 md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[21.376px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            Key Features That Make It Feel Like Home
          </p>
        </div>
        <div className="static text-base box-content caret-black shrink min-h-0 min-w-0 outline-black w-auto md:relative md:text-[0px] md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-min md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          <ul className="box-content caret-black outline-black pl-10 md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:pl-0 md:scroll-m-0 md:scroll-p-[auto]">
            <li className="box-content caret-black outline-black md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <span className="text-base font-normal box-content caret-black leading-[normal] outline-black md:text-[13.312px] md:font-bold md:aspect-auto md:box-border md:caret-transparent md:leading-[19.584px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                Spacious Living Area: The open floor plan ensures a seamless
                flow between the living room, dining area, and kitchen. It&#39;s
                perfect for everything from quiet nights in to lively
                get-togethers.
              </span>
            </li>
            <li className="box-content caret-black outline-black md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <span className="text-base font-normal box-content caret-black leading-[normal] outline-black md:text-[13.312px] md:font-bold md:aspect-auto md:box-border md:caret-transparent md:leading-[19.584px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                Dream Kitchen: The kitchen is the crown jewel of this home.
                Featuring ample counter space, refined cabinetry, and room for
                culinary creativity, it inspires you to whip up anything from
                family dinners to weekend baking adventures.
              </span>
            </li>
            <li className="box-content caret-black outline-black md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <span className="text-base font-normal box-content caret-black leading-[normal] outline-black md:text-[13.312px] md:font-bold md:aspect-auto md:box-border md:caret-transparent md:leading-[19.584px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                Elegant Vaulted Ceilings: With 9-foot ceilings and a stunning
                vaulted design, the main living space feels open, airy, and
                bathed in natural light.
              </span>
            </li>
            <li className="box-content caret-black outline-black md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <span className="text-base font-normal box-content caret-black leading-[normal] outline-black md:text-[13.312px] md:font-bold md:aspect-auto md:box-border md:caret-transparent md:leading-[19.584px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                Relaxing Owner&#39;s Suite: The owner&#39;s suite is a private
                oasis, complete with a luxurious bathroom for those moments when
                you simply need to relax and recharge.
              </span>
            </li>
            <li className="box-content caret-black outline-black md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <span className="text-base font-normal box-content caret-black leading-[normal] outline-black md:text-[13.312px] md:font-bold md:aspect-auto md:box-border md:caret-transparent md:leading-[19.584px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                Charming Outdoor Spaces: Step outside to an inviting back patio,
                perfect for coffee in the morning or barbecues in the evening.
                Pair this with a cozy front porch to complete the outdoor
                experience.
              </span>
            </li>
            <li className="box-content caret-black outline-black md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <span className="text-base font-normal box-content caret-black leading-[normal] outline-black md:text-[13.312px] md:font-bold md:aspect-auto md:box-border md:caret-transparent md:leading-[19.584px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                Functional Garage: The 2-car front-load garage isn&#39;t just
                for parking; it&#39;s a versatile space ideal for hobbies,
                crafts, or additional storage.
              </span>
            </li>
          </ul>
          <p className="text-base box-content caret-black leading-[normal] outline-black md:text-[13.312px] md:aspect-auto md:box-border md:caret-transparent md:leading-[19.584px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
             
          </p>
        </div>
      </div>
      <DetailItem
        variant="[align-items:normal] gap-x-[normal] block flex-row leading-[normal] gap-y-[normal] w-auto md:items-start md:gap-x-[7.168px] md:flex md:flex-col md:leading-[0px] md:gap-y-[7.168px] md:w-full"
        title="Designed For Family Living"
        content="The Mountain Retreat offers a harmonious balance of coziness and elegance, designed for families who cherish connection and convenience. Whether it&#39;s morning light streaming through the windows or evenings spent gathered around the table, this home is built for life&#39;s beautiful moments."
      />
      <DetailItem
        variant="[align-items:normal] gap-x-[normal] block flex-row leading-[normal] gap-y-[normal] w-auto md:items-start md:gap-x-[7.168px] md:flex md:flex-col md:leading-[0px] md:gap-y-[7.168px] md:w-full"
        title="Start Your Journey Today"
        content="Make it yours by tailoring the Mountain Retreat to fit your family's unique needs. Schedule a free screen-sharing session with a professional designer and customize this house plan in real time. Your dream home awaits—don't wait to begin your next chapter!"
      />
    </div>
  );
};
