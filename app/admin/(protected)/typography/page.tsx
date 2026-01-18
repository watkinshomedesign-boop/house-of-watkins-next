import { requireAdmin } from "@/lib/adminAuth";
import { TypographyEditor } from "@/adminComponents/TypographyEditor";

export default async function AdminTypographyPage() {
  await requireAdmin();

  return <TypographyEditor />;
}
