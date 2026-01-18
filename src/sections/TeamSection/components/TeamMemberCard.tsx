export type TeamMemberCardProps = {
  imageUrl: string;
  name: string;
  role: string;
  iconUrl: string;
};

export const TeamMemberCard = (props: TeamMemberCardProps) => {
  return (
    <div className="w-[456px]">
      <div className="overflow-hidden rounded-[24px]">
        <div className="h-[520px] w-[456px]">
          <img src={props.imageUrl} alt="" className="h-full w-full object-cover object-top" />
        </div>
      </div>

      <div className="mt-[20px] flex items-center whitespace-nowrap">
        <span className="h-[8px] w-[8px] rounded-full bg-orange-600" aria-hidden="true" />
        <span className="ml-[10px] text-[22px] font-semibold leading-none text-neutral-900">{props.name}</span>
        <span className="ml-[14px] h-[8px] w-[8px] rounded-full bg-orange-600" aria-hidden="true" />
        <span className="ml-[10px] text-[20px] font-normal leading-none text-neutral-500">{props.role}</span>
      </div>
    </div>
  );
};
