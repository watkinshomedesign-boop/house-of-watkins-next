import { HomePage } from "@/sitePages/HomePage";
import { HomePageMobile } from "@/sitePages/HomePageMobile";
import { notFound } from "next/navigation";
import { getHomePageSlots } from "@/lib/homePage/sanity";
import { draftMode } from "next/headers";

export default async function Page() {
  const cms = await getHomePageSlots();

  if (cms) {
    const dm = draftMode();
    const visible = dm.isEnabled ? true : cms.status === "published";
    if (!visible && process.env.NODE_ENV === "production") return notFound();
  }

  return (
    <>
      <div className="md:hidden">
        <HomePageMobile cms={cms ?? undefined} />
      </div>
      <div className="hidden md:block">
        <HomePage cms={cms ?? undefined} />
      </div>
    </>
  );
}
