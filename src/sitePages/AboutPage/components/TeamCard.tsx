import React from "react";

export type TeamCardProps = {
  imageSrc: string;
  name: string;
  role?: string;
};

export function TeamCard(props: TeamCardProps) {
  const imageSrc = props?.imageSrc ?? "/placeholders/about/team-1.svg";
  const name = props?.name ?? "";
  const role = props?.role;

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-[24px]">
        <div className="w-full aspect-[456/520]">
          <img src={imageSrc} alt={name} className="h-full w-full object-cover object-top" />
        </div>
      </div>

      <div className="mt-[20px] flex items-center whitespace-nowrap">
        <span className="h-[8px] w-[8px] rounded-full bg-orange-600" aria-hidden="true" />
        <span className="ml-[10px] text-[22px] font-semibold leading-none text-neutral-900">{name}</span>
        {role ? (
          <>
            <span className="ml-[14px] h-[8px] w-[8px] rounded-full bg-orange-600" aria-hidden="true" />
            <span className="ml-[10px] text-[20px] font-normal leading-none text-neutral-500">{role}</span>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default TeamCard;
