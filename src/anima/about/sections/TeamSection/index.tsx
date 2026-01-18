import { TeamMemberCard } from "@/sections/TeamSection/components/TeamMemberCard";

export const TeamSection = () => {
  return (
    <section className="box-content caret-black min-h-0 min-w-0 outline-black pb-0 px-0 md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:pb-[35.584px] md:px-[56.832px] md:scroll-m-0 md:scroll-p-[auto]">
      <div className="box-content caret-black gap-x-[normal] block flex-row outline-black gap-y-[normal] md:aspect-auto md:box-border md:caret-transparent md:gap-x-[35.584px] md:flex md:flex-col md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[35.584px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <h2 className="text-2xl font-bold box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black w-auto md:text-[49.792px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:leading-[56.832px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[357.376px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          Our Team
        </h2>
        <div className="[align-items:normal] box-content caret-black gap-x-[normal] block min-h-0 min-w-0 outline-black gap-y-[normal] md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[17.792px] md:flex md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[17.792px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          <TeamMemberCard
            imageVariant="md:bg-[url('https://c.animaapp.com/mjfxv9somN4Dv6/assets/fdefd24cd29b920e7e9f6204aa6488cc31616f2f.png')] md:bg-no-repeat md:bg-size-[100%_115.617%] md:bg-[position:0px_-32.896px]"
            name="Nino Gogichaishvili"
            role="Drafting"
            iconUrl="https://c.animaapp.com/mjfxv9somN4Dv6/assets/icon-9.svg"
          />
          <TeamMemberCard
            imageVariant="md:bg-[url('https://c.animaapp.com/mjfxv9somN4Dv6/assets/bdce4bab429a4665b88d51089c65563cbdef61b9.png')] md:bg-no-repeat md:bg-size-[204.049%_123.184%] md:bg-[position:-391.04px_-10.496px]"
            name="David Watkins"
            role="Residential Designer"
            iconUrl="https://c.animaapp.com/mjfxv9somN4Dv6/assets/icon-9.svg"
          />
          <TeamMemberCard
            imageVariant="md:bg-[url('https://c.animaapp.com/mjfxv9somN4Dv6/assets/f7b7c2000bc54db4c9fa64a5a04383c58979b77b.png')] md:bg-no-repeat md:bg-size-[110.947%_118.498%] md:bg-[position:-17.536px_-60.928px]"
            name="Anastasia Shkarubo"
            role="Office Manager"
            iconUrl="https://c.animaapp.com/mjfxv9somN4Dv6/assets/icon-9.svg"
          />
        </div>
      </div>
    </section>
  );
};
