import { FeatureCard } from "@/sections/FeaturesSection/components/FeatureCard";

export const FeaturesSection = () => {
  return (
    <section className="box-content caret-black min-h-0 min-w-0 outline-black pb-0 px-0 md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:pb-[35.584px] md:px-[56.832px] md:scroll-m-0 md:scroll-p-[auto]">
      <div className="[align-items:normal] box-content caret-black block justify-normal outline-black md:items-start md:aspect-auto md:box-border md:caret-transparent md:flex md:justify-between md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <FeatureCard
          iconUrl="https://c.animaapp.com/mjfxv9somN4Dv6/assets/icon-4.svg"
          titleLine1="All Homes"
          titleLine2="Designed by David"
          description="For quality control, every home on this site is designed by David to meet these and other high standards"
        />
        <FeatureCard
          iconUrl="https://c.animaapp.com/mjfxv9somN4Dv6/assets/icon-5.svg"
          titleLine1="Fast Turn-Around"
          titleLine2="for Modifications"
          description="We guarantee that revisions to your plans will be completed in 10 days or less or your plans are free"
        />
        <FeatureCard
          iconUrl="https://c.animaapp.com/mjfxv9somN4Dv6/assets/icon-6.svg"
          titleLine1="Affordable"
          titleLine2="House Plans"
          description="It costs up to five times less than a fully custom design and giving you a way to get high-quality home plan for a lower price"
        />
        <FeatureCard
          iconUrl="https://c.animaapp.com/mjfxv9somN4Dv6/assets/icon-7.svg"
          titleLine1="Reliable Support"
          titleLine2="from Start to Finish"
          description="We support you through the entire design process. Call or write anytime — we're always here for you"
        />
        <FeatureCard
          iconUrl="https://c.animaapp.com/mjfxv9somN4Dv6/assets/icon-8.svg"
          titleLine1="Award Winning"
          titleLine2="House Plans"
          description="David Watkins is an award-winning designer, and every home on this site is personally designed by him"
        />
      </div>
    </section>
  );
};
