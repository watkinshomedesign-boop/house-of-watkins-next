import { TeamMemberCard } from "@/sections/TeamSection/components/TeamMemberCard";

export const TeamSection = () => {
  return (
    <section className="pt-[48px]">
      <div className="mx-auto max-w-[1887px] px-[56px]">
        <h2 className="text-[64px] font-black leading-none text-neutral-900 mb-[38px]">
          Our Team
        </h2>
        <div className="grid grid-cols-3 gap-x-[26px]">
          <TeamMemberCard
            imageUrl="/placeholders/about/team-1.svg"
            name="Nino Gogichaishvili"
            role="Drafting"
            iconUrl="/placeholders/icon-15.svg"
          />
          <TeamMemberCard
            imageUrl="/placeholders/about/team-2.svg"
            name="David Watkins"
            role="Residential Designer"
            iconUrl="/placeholders/icon-15.svg"
          />
          <TeamMemberCard
            imageUrl="/placeholders/about/team-3.svg"
            name="Anastasia Shkarubo"
            role="Office Manager"
            iconUrl="/placeholders/icon-15.svg"
          />
        </div>
      </div>
    </section>
  );
};
