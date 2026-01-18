import { HousePlansPageResponsive } from "@/sitePages/HousePlansPageResponsive.client";
import { getHousePlansPage } from "@/lib/contentPages/sanity";
import { urlForImage } from "@/lib/sanity/image";

function getImageUrl(source: unknown): string | null {
  if (!source) return null;
  if (typeof source === "string") return source;
  try {
    return urlForImage(source as any).width(128).height(128).fit("max").url();
  } catch {
    return null;
  }
}

export default async function Page() {
  const cms = await getHousePlansPage();
  const media = (cms as any)?.housePlansMedia;
  const searchIconSrc = getImageUrl(media?.searchIcon);

  return (
    <HousePlansPageResponsive
      headerTitle={media?.headerTitle ?? null}
      headerDescription={media?.headerDescription ?? null}
      searchIconSrc={searchIconSrc}
      searchIconAlt={media?.searchIconAlt ?? null}
    />
  );
}
