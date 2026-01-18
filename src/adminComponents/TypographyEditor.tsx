"use client";

import React, { useEffect, useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Mark, mergeAttributes } from "@tiptap/core";

import { TEXT_STYLES, type TextStyleKey, getTextStyleCss } from "@/lib/typography";
import { StyledText, type StyledTextRun } from "@/lib/styledText";
import { PAGE_CONTENT_AREAS, TEMPLATE_CONTENT_AREAS, type TypographyContentAreaDescriptor } from "@/lib/typographyContentAreas";

type PageKind = "templates" | "pages";

type TemplateDescriptor = { templateKey: string; label: string; instancesCount: number | null };
type PageDescriptor = { pageKey: string; label: string };

type RegistryResponse = {
  templates: TemplateDescriptor[];
  uniquePages: PageDescriptor[];
};

type StoredBlockValue =
  | { style: TextStyleKey }
  | { runs: StyledTextRun[] };

type StoredContent = Record<string, StoredBlockValue>;

function isTextStyleKey(v: any): v is TextStyleKey {
  return typeof v === "string" && Object.prototype.hasOwnProperty.call(TEXT_STYLES, v);
}

function getStyleOnly(content: StoredContent, area: TypographyContentAreaDescriptor): TextStyleKey {
  const raw = content[area.key];
  const style = (raw as any)?.style;
  if (isTextStyleKey(style)) return style;
  return area.defaultStyle;
}

function setStyleOnly(content: StoredContent, areaKey: string, style: TextStyleKey): StoredContent {
  return { ...content, [areaKey]: { style } };
}

function getRuns(content: StoredContent, area: TypographyContentAreaDescriptor): StyledTextRun[] {
  const raw = content[area.key];
  const runs = (raw as any)?.runs;
  if (Array.isArray(runs)) return runs as StyledTextRun[];
  return [{ text: area.previewText, style: area.defaultStyle }];
}

function setRuns(content: StoredContent, areaKey: string, runs: StyledTextRun[]): StoredContent {
  return { ...content, [areaKey]: { runs } };
}

const TypographyStyleMark = Mark.create({
  name: "typographyStyle",

  addAttributes() {
    return {
      styleKey: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-typography-style-key]" }];
  },

  renderHTML({ HTMLAttributes }) {
    const styleKey = String((HTMLAttributes as any)?.styleKey || "").trim();
    const css = getTextStyleCss(isTextStyleKey(styleKey) ? styleKey : null);
    const styleStr = `font-family:${css.fontFamily};font-size:${css.fontSize};line-height:${css.lineHeight};font-weight:${css.fontWeight};letter-spacing:${css.letterSpacing};`;

    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-typography-style-key": styleKey,
        style: styleStr,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setTypographyStyle:
        (styleKey: TextStyleKey) =>
        ({ commands }: any) => {
          return commands.setMark(this.name, { styleKey });
        },
      unsetTypographyStyle:
        () =>
        ({ commands }: any) => {
          return commands.unsetMark(this.name);
        },
    } as any;
  },
});

function runsToEditorDoc(runs: StyledTextRun[]) {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: runs.map((r) => {
          const styleKey = r.style ?? null;
          return {
            type: "text",
            text: r.text,
            marks: styleKey
              ? [
                  {
                    type: "typographyStyle",
                    attrs: { styleKey },
                  },
                ]
              : [],
          };
        }),
      },
    ],
  };
}

function editorDocToRuns(doc: any, fallbackStyle: TextStyleKey): StyledTextRun[] {
  const out: StyledTextRun[] = [];
  const paragraphs = Array.isArray(doc?.content) ? doc.content : [];

  for (const p of paragraphs) {
    const content = Array.isArray(p?.content) ? p.content : [];
    for (const n of content) {
      if (n?.type !== "text") continue;
      const text = String(n?.text ?? "");
      if (!text) continue;

      let style: TextStyleKey = fallbackStyle;
      const marks = Array.isArray(n?.marks) ? n.marks : [];
      const mark = marks.find((m: any) => m?.type === "typographyStyle");
      const markKey = mark?.attrs?.styleKey;
      if (isTextStyleKey(markKey)) style = markKey;

      const last = out[out.length - 1];
      if (last && last.style === style) {
        last.text += text;
      } else {
        out.push({ text, style });
      }
    }

    out.push({ text: "\n", style: fallbackStyle });
  }

  while (out.length > 0 && out[out.length - 1]?.text === "\n") {
    out.pop();
  }

  return out;
}

function StyleSelect(props: {
  value: TextStyleKey;
  onChange: (v: TextStyleKey) => void;
}) {
  return (
    <select
      value={props.value}
      onChange={(e) => props.onChange(e.target.value as TextStyleKey)}
      className="h-9 rounded border border-zinc-300 bg-white px-2 text-sm"
    >
      {(Object.keys(TEXT_STYLES) as TextStyleKey[]).map((k) => {
        const s = TEXT_STYLES[k];
        const weightLabel = s.fontWeight === 600 ? "Semibold" : s.fontWeight === 500 ? "Medium" : "Regular";
        const label = `${k} · ${s.fontFamily} · ${s.fontSizePx}px · ${weightLabel}`;
        return (
          <option key={k} value={k}>
            {label}
          </option>
        );
      })}
    </select>
  );
}

function StyleInfo(props: { styleKey: TextStyleKey }) {
  const s = TEXT_STYLES[props.styleKey];
  const weightLabel = s.fontWeight === 600 ? "Semibold" : s.fontWeight === 500 ? "Medium" : "Regular";

  return (
    <div className="text-xs text-zinc-600">
      <div>
        <span className="font-medium text-zinc-800">{props.styleKey}</span>
        <span> · {s.fontFamily}</span>
        <span> · {s.fontSizePx}px</span>
        <span> · {weightLabel}</span>
        <span> · LH {s.lineHeightPx}px</span>
      </div>
      <div className="mt-2 rounded border border-zinc-200 bg-white p-2">
        <span style={getTextStyleCss(props.styleKey)}>Preview Text</span>
      </div>
    </div>
  );
}

function ContentAreaCard(props: {
  area: TypographyContentAreaDescriptor;
  content: StoredContent;
  setContent: (next: StoredContent) => void;
}) {
  const area = props.area;

  if (area.type === "style_only") {
    const styleKey = getStyleOnly(props.content, area);

    return (
      <div className="rounded border border-zinc-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="font-medium">{area.label}</div>
          <StyleSelect value={styleKey} onChange={(v) => props.setContent(setStyleOnly(props.content, area.key, v))} />
        </div>
        <div className="mt-3">
          <StyleInfo styleKey={styleKey} />
        </div>
        <div className="mt-3 rounded border border-zinc-200 bg-zinc-50 p-3">
          <span style={getTextStyleCss(styleKey)}>{area.previewText}</span>
        </div>
      </div>
    );
  }

  const runs = getRuns(props.content, area);

  return (
    <RichTextAreaCard
      area={area}
      runs={runs}
      onRunsChange={(nextRuns) => props.setContent(setRuns(props.content, area.key, nextRuns))}
    />
  );
}

function RichTextAreaCard(props: {
  area: TypographyContentAreaDescriptor;
  runs: StyledTextRun[];
  onRunsChange: (runs: StyledTextRun[]) => void;
}) {
  const [selectedStyle, setSelectedStyle] = useState<TextStyleKey>(props.area.defaultStyle);

  const editor = useEditor({
    extensions: [StarterKit.configure({ history: {} }), TypographyStyleMark],
    content: runsToEditorDoc(props.runs),
    editorProps: {
      attributes: {
        class: "min-h-[120px] rounded border border-zinc-300 bg-white p-2 text-sm outline-none",
      },
    },
    onSelectionUpdate({ editor }) {
      const attrs = editor.getAttributes("typographyStyle") as any;
      const key = attrs?.styleKey;
      if (isTextStyleKey(key)) setSelectedStyle(key);
    },
    onUpdate({ editor }) {
      const doc = editor.getJSON();
      const runs = editorDocToRuns(doc, props.area.defaultStyle);
      props.onRunsChange(runs);
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(runsToEditorDoc(props.runs), false);
  }, [editor, props.runs]);

  return (
    <div className="rounded border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="font-medium">{props.area.label}</div>
        <div className="flex items-center gap-2">
          <StyleSelect
            value={selectedStyle}
            onChange={(v) => {
              setSelectedStyle(v);
              (editor as any)?.chain().focus().setTypographyStyle(v).run();
            }}
          />
        </div>
      </div>

      <div className="mt-3">
        <StyleInfo styleKey={selectedStyle} />
      </div>

      <div className="mt-3">{editor ? <EditorContent editor={editor} /> : null}</div>

      <div className="mt-3 rounded border border-zinc-200 bg-zinc-50 p-3">
        <div className="text-xs font-medium text-zinc-700">Live Preview</div>
        <div className="mt-2">
          <StyledText value={props.runs} as="div" />
        </div>
      </div>
    </div>
  );
}

export function TypographyEditor() {
  const [kind, setKind] = useState<PageKind>("templates");
  const [registry, setRegistry] = useState<RegistryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const [rowLabel, setRowLabel] = useState<string>("");
  const [instancesCount, setInstancesCount] = useState<number | null>(null);
  const [content, setContent] = useState<StoredContent>({});

  const areas = useMemo(() => {
    if (!selectedKey) return [];
    if (kind === "templates") {
      return (TEMPLATE_CONTENT_AREAS as any)[selectedKey] ?? [];
    }
    return (PAGE_CONTENT_AREAS as any)[selectedKey] ?? [];
  }, [kind, selectedKey]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetch("/api/admin/typography")
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Failed to load typography registry");
        return j as RegistryResponse;
      })
      .then((j) => {
        if (!mounted) return;
        setRegistry(j);
      })
      .catch((e: any) => {
        if (!mounted) return;
        setError(e?.message || "Failed");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const list = kind === "templates" ? registry?.templates ?? [] : registry?.uniquePages ?? [];
    const firstKey = kind === "templates" ? (list[0] as any)?.templateKey : (list[0] as any)?.pageKey;
    setSelectedKey(firstKey || null);
  }, [kind, registry]);

  useEffect(() => {
    if (!selectedKey) return;

    const url =
      kind === "templates"
        ? `/api/admin/typography/templates/${encodeURIComponent(selectedKey)}`
        : `/api/admin/typography/pages/${encodeURIComponent(selectedKey)}`;

    let mounted = true;
    setError(null);

    fetch(url)
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Failed to load");
        return j;
      })
      .then((j) => {
        if (!mounted) return;
        const row = j.row ?? null;
        setRowLabel(String(row?.label ?? ""));
        setInstancesCount(row?.instances_count == null ? null : Number(row.instances_count));
        const c = (row?.content ?? {}) as any;
        setContent(typeof c === "object" && c ? (c as StoredContent) : {});
      })
      .catch((e: any) => {
        if (!mounted) return;
        setError(e?.message || "Failed");
      });

    return () => {
      mounted = false;
    };
  }, [kind, selectedKey]);

  async function save() {
    if (!selectedKey) return;

    const url =
      kind === "templates"
        ? `/api/admin/typography/templates/${encodeURIComponent(selectedKey)}`
        : `/api/admin/typography/pages/${encodeURIComponent(selectedKey)}`;

    const payload: any = {
      label: rowLabel,
      content,
    };
    if (kind === "templates") {
      payload.instancesCount = instancesCount;
    }

    const r = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || "Save failed");
  }

  const list = kind === "templates" ? registry?.templates ?? [] : registry?.uniquePages ?? [];

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Typography Editor</h1>
          <div className="mt-1 text-sm text-zinc-600">
            Edit typography for template pages (shared) or unique pages (one-off).
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setKind("templates")}
            className={
              "h-9 rounded border px-3 text-sm " +
              (kind === "templates" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white")
            }
          >
            Template Pages
          </button>
          <button
            type="button"
            onClick={() => setKind("pages")}
            className={
              "h-9 rounded border px-3 text-sm " +
              (kind === "pages" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white")
            }
          >
            Unique Pages
          </button>
        </div>
      </div>

      {loading ? <div className="mt-6 text-sm">Loading…</div> : null}
      {error ? <div className="mt-6 text-sm text-red-600">{error}</div> : null}

      {!loading && registry ? (
        <div className="mt-6 grid grid-cols-12 gap-6">
          <div className="col-span-4">
            <div className="rounded border border-zinc-200 bg-white">
              <div className="border-b border-zinc-200 p-3 text-sm font-medium">
                {kind === "templates" ? "Templates" : "Pages"}
              </div>
              <div className="max-h-[520px] overflow-auto">
                {list.map((it: any) => {
                  const key = kind === "templates" ? String(it.templateKey) : String(it.pageKey);
                  const active = key === selectedKey;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedKey(key)}
                      className={
                        "flex w-full items-start justify-between gap-3 border-b border-zinc-100 p-3 text-left text-sm hover:bg-zinc-50 " +
                        (active ? "bg-zinc-50" : "")
                      }
                    >
                      <div>
                        <div className="font-medium">{it.label}</div>
                        {kind === "templates" ? (
                          <div className="mt-1 text-xs text-zinc-600">
                            This template affects {it.instancesCount ?? "many"} pages.
                          </div>
                        ) : null}
                      </div>
                      <div className="text-xs text-zinc-500">{key}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="col-span-8">
            {selectedKey ? (
              <div>
                {kind === "templates" && instancesCount ? (
                  <div className="mb-4 rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                    Changes here apply to approximately {instancesCount} pages.
                  </div>
                ) : null}

                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm">
                    <div className="font-medium">{rowLabel || selectedKey}</div>
                    <div className="text-xs text-zinc-600">{selectedKey}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      save().catch((e: any) => {
                        window.alert(e?.message || "Save failed");
                      });
                    }}
                    className="h-9 rounded bg-orange-600 px-3 text-sm font-semibold text-white hover:bg-orange-700"
                  >
                    Save
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  {areas.length === 0 ? (
                    <div className="rounded border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
                      No content areas configured for this page yet.
                    </div>
                  ) : null}

                  {areas.map((a: any) => (
                    <ContentAreaCard key={a.key} area={a} content={content} setContent={setContent} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded border border-zinc-200 bg-white p-4 text-sm text-zinc-600">Select an item.</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
