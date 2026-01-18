"use client";

import searchIcon from "../../../../assets/search Icon.png";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const SearchBar = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function submit() {
    const q = query.trim();
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    router.push(`/house-plans?${sp.toString()}`);
  }

  return (
    <div className="static box-content caret-black shrink min-h-0 min-w-0 outline-black w-auto rounded-none md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[35.584px]">
      <div className="static [align-items:normal] box-content caret-black block h-auto outline-black w-auto md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:overflow-clip md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto p-0 md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[14.208px] md:flex md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[14.208px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:px-[21.376px] md:py-[12.416px] md:scroll-m-0 md:scroll-p-[auto]">
          <div className="[align-items:normal] box-content caret-black gap-x-[normal] block grow-0 justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[14.208px] md:flex md:grow md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[14.208px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <div className="static box-content caret-black shrink h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:h-[21.376px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[21.376px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <div className="static box-content caret-black block outline-black inset-auto md:absolute md:aspect-auto md:box-border md:caret-transparent md:contents md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:inset-0">
                <img
                  src={(searchIcon as any).src ?? (searchIcon as any)}
                  alt="Icon"
                  className="box-content caret-black h-auto outline-black w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
                />
              </div>
            </div>
            <input
              type="text"
              placeholder="Search plans"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
              className="text-black text-[13.3333px] normal-nums bg-white box-content caret-black inline-block leading-[normal] min-h-0 min-w-0 outline-black stroke-none text-start w-auto focus:outline-none md:text-stone-400 md:text-[15.984px] md:aspect-auto md:bg-transparent md:box-border md:caret-black md:block md:leading-[24.864px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:stroke-[oklch(0.97_0_0)] md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto]"
            />
          </div>
        </div>
      </div>
      <div className="static box-content caret-black outline-black pointer-events-auto rounded-none inset-auto md:absolute md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:pointer-events-none md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:border md:border-stone-200 md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[35.584px] md:border-solid md:inset-0"></div>
    </div>
  );
};
