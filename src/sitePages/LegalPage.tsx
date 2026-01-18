import React from "react";
import Link from "next/link";

type LegalBullet = {
  title?: string;
  body: string;
};

type LegalSection = {
  heading?: string;
  paragraphs?: string[];
  bullets?: LegalBullet[];
  numbered?: string[];
};

export type LegalPageProps = {
  breadcrumbLabel?: string;
  breadcrumbHref?: string;
  title: string;
  sections: LegalSection[];
};

export function LegalPage(props: LegalPageProps) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      {props.breadcrumbHref ? (
        <Link href={props.breadcrumbHref} className="text-sm font-semibold text-neutral-500 md:text-[18px] md:leading-[22px] md:text-neutral-700">
          {props.breadcrumbLabel}
        </Link>
      ) : (
        <p className="text-sm font-semibold text-neutral-500 md:text-[18px] md:leading-[22px] md:text-neutral-700">{props.breadcrumbLabel}</p>
      )}
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{props.title}</h1>

      <div className="mt-8 space-y-10">
        {props.sections.map((s, i) => (
          <section key={i} className="space-y-4">
            {s.heading ? (
              <h2 className="text-xl font-semibold tracking-tight">{s.heading}</h2>
            ) : null}

            {s.paragraphs?.map((p, pi) => (
              <p key={pi} className="text-sm leading-6 text-neutral-700">
                {p}
              </p>
            ))}

            {s.bullets?.length ? (
              <ul className="list-disc space-y-3 pl-5">
                {s.bullets.map((b, bi) => (
                  <li key={bi} className="text-sm leading-6 text-neutral-700">
                    {b.title ? (
                      <span className="font-semibold">{b.title}: </span>
                    ) : null}
                    <span>{b.body}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {s.numbered?.length ? (
              <ol className="list-decimal space-y-2 pl-5">
                {s.numbered.map((n, ni) => (
                  <li key={ni} className="text-sm leading-6 text-neutral-700">
                    {n}
                  </li>
                ))}
              </ol>
            ) : null}
          </section>
        ))}
      </div>
    </main>
  );
}

function LegalPageRouteStub() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Legal</h1>
      <p className="mt-4 text-sm text-neutral-600">This route is not configured.</p>
    </main>
  );
}

export default LegalPageRouteStub;
