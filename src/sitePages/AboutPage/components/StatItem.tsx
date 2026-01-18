import React from "react";

export type StatItemProps = {
  value: string;
  lines: string[];
};

export function StatItem(props: StatItemProps) {
  const lines = props?.lines ?? [];
  const value = props?.value ?? "";

  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-[58px] font-semibold leading-none tracking-tight text-neutral-900 md:text-[92px]">{value}</div>
      <div className="mt-2 text-[15px] leading-[21px] text-neutral-500">
        {lines.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>
    </div>
  );
}

export default StatItem;
