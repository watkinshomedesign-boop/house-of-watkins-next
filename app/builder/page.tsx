import { getBuilderLandingPage } from "@/lib/builderPage/sanity";
import BuilderLandingPage from "./BuilderLandingClient";

export default async function BuilderPage() {
  const cms = await getBuilderLandingPage();
  return <BuilderLandingPage cms={cms} />;
}
