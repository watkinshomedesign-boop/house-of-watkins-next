import React from "react";
import { Reveal } from "@/components/Reveal";
import { faqSections } from "@/content/faq";
import Link from "next/link";

export function FAQPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <Reveal>
        <h1 className="text-3xl font-semibold tracking-tight">FAQ</h1>
      </Reveal>

      <Reveal delayMs={60}>
        <p className="mt-4 text-sm leading-6 text-neutral-600">
          {"Answers to common questions about plans, permitting, modifications, and what's included."}
        </p>
      </Reveal>

      <div className="mt-10 space-y-10">
        {faqSections.map((section, sectionIdx) => (
          <Reveal key={section.title} delayMs={sectionIdx * 40}>
            <section className="space-y-4">
              <h2 className="text-lg font-semibold tracking-tight">{section.title}</h2>

              <div className="space-y-3">
                {section.items.map((item, idx) => (
                  <details
                    key={idx}
                    className="rounded-2xl border border-neutral-200 bg-white p-4"
                  >
                    <summary className="cursor-pointer select-none text-sm font-semibold text-neutral-900">
                      {item.question.replace(/^Q:\s*/i, "")}
                    </summary>
                    <div className="mt-3 whitespace-pre-line text-sm leading-6 text-neutral-700">
                      {item.answer.replace(/^A:\s*/i, "")}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          </Reveal>
        ))}
      </div>

      <Reveal delayMs={120}>
        <div className="mt-12 rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-semibold tracking-tight">Still have questions?</h2>
          <p className="mt-2 text-sm text-neutral-600">
            {"Send us your site plan and your wish list. We'll help you find (or adapt) the right plan."}
          </p>
          <div className="mt-4">
            <Link href="/contact-us" className="text-sm font-semibold text-orange-600 underline">
              Contact us
            </Link>
          </div>
        </div>
      </Reveal>
    </main>
  );
}

export default FAQPage;
