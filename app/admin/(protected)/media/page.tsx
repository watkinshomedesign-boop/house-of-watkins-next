import { requireAdmin } from "@/lib/adminAuth";
import { MediaAdmin } from "@/adminComponents/MediaAdmin";
import { SanityMediaLibrary } from "@/adminComponents/SanityMediaLibrary";

export default async function AdminMediaPage() {
  await requireAdmin();

  return (
    <div className="mx-auto w-full max-w-5xl">
      <h1 className="text-2xl font-semibold">Media</h1>
      <div className="mt-3 rounded border p-4 text-sm text-neutral-700">
        <div className="font-semibold">This is a browser for Sanity assets. To place images on pages, open the page document in Studio.</div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <a href="/studio" target="_blank" rel="noreferrer" className="rounded bg-black px-3 py-2 text-sm font-semibold text-white">
            Open Studio Media
          </a>
          <a href="/studio" target="_blank" rel="noreferrer" className="rounded border px-3 py-2 text-sm">
            Open Content Editor
          </a>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex items-center gap-2 border-b">
          <a href="#sanity" className="border-b-2 border-black px-3 py-2 text-sm font-semibold">
            Sanity Media Library
          </a>
          <a href="#supabase" className="px-3 py-2 text-sm text-neutral-600">
            Plan Media (Supabase records)
          </a>
        </div>
        <div id="sanity" className="pt-4">
          <SanityMediaLibrary />
        </div>
        <div id="supabase" className="pt-8">
          <MediaAdmin />
        </div>
      </div>
    </div>
  );
}
