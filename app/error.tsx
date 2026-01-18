"use client";

import Link from "next/link";
import { Footer } from "@/sections/Footer";
import { InteriorHeader } from "@/sections/InteriorHeader";

export default function ErrorPage(props: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <>
      <InteriorHeader />
      <main className="mx-auto w-full max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="mt-4 text-sm leading-6 text-neutral-600">
          Please try again. If the issue persists, contact support.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={props.reset}
            className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Try again
          </button>
          <Link href="/" className="text-sm font-semibold text-orange-600 underline">
            Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
