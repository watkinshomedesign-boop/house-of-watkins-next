import React from "react";
import { PageRenderer } from "@/components/PageRenderer";
import { Reveal } from "@/components/Reveal";

export function SectionsRenderer(props: { sections: { title?: string; content?: any[] }[] }) {
  const sections = Array.isArray(props.sections) ? props.sections : [];

  return (
    <div className="space-y-10">
      {sections.map((s, idx) => (
        <Reveal key={idx} delayMs={idx * 40}>
          <section>
            {s?.title ? <h2 className="text-xl font-semibold tracking-tight">{s.title}</h2> : null}
            <div className={s?.title ? "mt-4" : ""}>
              <PageRenderer content={Array.isArray(s?.content) ? s.content : []} />
            </div>
          </section>
        </Reveal>
      ))}
    </div>
  );
}

export default SectionsRenderer;
