import Link from "next/link";

export const Breadcrumb = (props: { currentLabel?: string; currentHref?: string }) => {
  const currentLabel = props.currentLabel ?? "House plans";
  return (
    <div className="flex items-center text-[15px] font-semibold md:text-[18px]">
      <Link href="/" className="text-orange-600">
        Main
      </Link>
      <span className="px-2 text-neutral-400">/</span>
      {props.currentHref ? (
        <Link href={props.currentHref} className="text-neutral-700">
          {currentLabel}
        </Link>
      ) : (
        <span className="text-neutral-700">{currentLabel}</span>
      )}
    </div>
  );
};
