import Link from "next/link";
import { Footer } from "@/sections/Footer";
import { InteriorHeader } from "@/sections/InteriorHeader";

export default function NotFound() {
  return (
    <>
      <InteriorHeader />
      <main className="mx-auto w-full max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-4 text-sm leading-6 text-neutral-600">
          The page youre looking for doesnt exist or may have moved.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Back to home
          </Link>
          <Link href="/catalog" className="text-sm font-semibold text-orange-600 underline">
            Browse plans
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
