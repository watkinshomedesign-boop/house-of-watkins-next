import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { ExitPreviewButton } from "@/components/ExitPreviewButton";
import { SiteIntegrations } from "@/components/integrations/SiteIntegrations";

export const metadata: Metadata = {
  title: "Moss",
  description: "Moss website clone",
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const dm = draftMode();
  return (
    <>
      <SiteIntegrations />
      {children}
      {dm.isEnabled ? <ExitPreviewButton /> : null}
    </>
  );
}
