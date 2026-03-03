import { getBuilderLandingPage } from "@/lib/builderPage/sanity";
import BuilderLandingPage from "./BuilderLandingClient";

export const revalidate = 60;

export default async function BuilderPage() {
  const cms = await getBuilderLandingPage();
  return <BuilderLandingPage cms={cms} />;
}
