import { ContactPageInner } from "@/sitePages/ContactPage";
import { Footer } from "@/sections/Footer";
import { InteriorHeader } from "@/sections/InteriorHeader";
import { getContactPage } from "@/lib/contentPages/sanity";
import { urlForImage } from "@/lib/sanity/image";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";

function imageUrl(source: unknown, width: number) {
  if (!source) return undefined;
  if (typeof source === "string") {
    const lower = source.toLowerCase();
    if (lower.includes(".heif") || lower.includes(".heic")) return undefined;
    return source;
  }
  try {
    return urlForImage(source as any).width(width).fit("max").auto("format").url();
  } catch {
    return undefined;
  }
}

export default async function Page() {
  noStore();
  redirect("/contact-us");
}
