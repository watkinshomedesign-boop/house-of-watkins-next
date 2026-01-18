const CURVE_PATH_D__PASTE_PATH_HERE = "";
const CURVE_PATH_D =
  CURVE_PATH_D__PASTE_PATH_HERE ||
  "M140,0 L140,700 L75,700 C15,700 25,560 75,520 C115,488 115,412 75,380 C25,340 15,210 75,170 C115,140 115,60 75,40 C35,20 25,0 75,0 Z";

export const HeroOverlay = (props: { className?: string }) => {
  return (
    <svg
      className={props.className}
      viewBox="0 0 140 700"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="white"
        d={CURVE_PATH_D}
      />
    </svg>
  );
};
