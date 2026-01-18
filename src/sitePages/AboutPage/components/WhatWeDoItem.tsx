import React from "react";

export type WhatWeDoItemProps = {
  index: string;
  title: string;
  lines: string[];
};

export function WhatWeDoItem(props: WhatWeDoItemProps) {
  const lines = props?.lines ?? [];
  const index = props?.index ?? "";
  const title = props?.title ?? "";

  return (
    <div className="space-y-1.5">
      <div className="text-[28px] font-semibold leading-[34px] text-orange-600">{index}</div>
      <div className="text-[20px] font-semibold leading-[26px] text-neutral-900">{title}</div>
      <div className="text-[20px] leading-[26px] text-neutral-600">
        {lines.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>
    </div>
  );
}

export default WhatWeDoItem;
