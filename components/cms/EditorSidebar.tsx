"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { CreateMedia } from "@/services/auth/auth";
import { UpdateSpecifiedSection } from "@/services/sections/sections";
import { resolveCmsSrc } from "@/lib/cms-media";
import { useHomeEdit, type CmsSection, type EditorTarget } from "./HomeEditProvider";

function cloneSection(section: CmsSection): CmsSection {
  return JSON.parse(JSON.stringify(section));
}

function BilingualFields({
  en,
  ar,
  onChange,
  multiline,
}: {
  en: string;
  ar: string;
  onChange: (next: { en: string; ar: string }) => void;
  multiline?: boolean;
}) {
  const cls =
    "w-full rounded-md border border-default-200 bg-background px-3 py-2 text-sm";
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-default-500">
          English
        </label>
        {multiline ? (
          <textarea className={cls} rows={5} value={en} onChange={(e) => onChange({ en: e.target.value, ar })} />
        ) : (
          <input className={cls} value={en} onChange={(e) => onChange({ en: e.target.value, ar })} />
        )}
      </div>
      <div dir="rtl">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-default-500">
          العربية
        </label>
        {multiline ? (
          <textarea className={`${cls} text-end`} rows={5} value={ar} onChange={(e) => onChange({ en, ar: e.target.value })} />
        ) : (
          <input className={`${cls} text-end`} value={ar} onChange={(e) => onChange({ en, ar: e.target.value })} />
        )}
      </div>
    </div>
  );
}

function ImageField({
  url,
  onUploaded,
  onClear,
}: {
  url?: string;
  onUploaded: (nextUrl: string) => void;
  onClear: () => void;
}) {
  const { lang } = useParams();
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File) => {
    setBusy(true);
    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("alt[0]", file.name);
      const res = await CreateMedia(formData, lang);
      const uploaded = Array.isArray(res) ? res[0] : res;
      const nextUrl = uploaded?.url || uploaded;
      if (!nextUrl) throw new Error("Upload failed");
      onUploaded(typeof nextUrl === "string" ? nextUrl : nextUrl.url);
    } catch (err: any) {
      toast.error(err?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      {url ? (
        <div className="relative overflow-hidden rounded-md border">
          <img src={resolveCmsSrc(url)} alt="" className="h-40 w-full object-cover" />
          <button
            type="button"
            onClick={onClear}
            className="absolute end-2 top-2 rounded-full bg-red-600 p-1 text-white"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ) : null}
      <label className="flex cursor-pointer items-center justify-center rounded-md border border-dashed px-3 py-6 text-sm">
        {busy ? "Uploading…" : "Upload image"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={busy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
      </label>
    </div>
  );
}

export default function EditorSidebar() {
  const { target, page, setPage, closeEditor, setSaveStatus } = useHomeEdit();
  const { lang } = useParams();
  const section = page.sections.find((s) => s.id === target?.sectionId);

  if (!target || !section) return null;

  return (
    <aside className="fixed inset-y-0 end-0 z-[80] flex w-full max-w-md flex-col border-s bg-background shadow-2xl">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <p className="text-sm font-semibold">{labelFor(target)}</p>
          <p className="text-xs text-default-500">{section.id}</p>
        </div>
        <button type="button" onClick={closeEditor} className="rounded-full p-1 hover:bg-default-100">
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <SidebarBody
          target={target}
          section={section}
          lang={lang}
          pageId={page.id}
          onSaved={(nextSection) => {
            setPage({
              ...page,
              sections: page.sections.map((s) => (s.id === nextSection.id ? nextSection : s)),
            });
          }}
          setSaveStatus={setSaveStatus}
        />
      </div>
    </aside>
  );
}

function labelFor(target: EditorTarget) {
  if ("label" in target && target.label) return target.label;
  return target.kind;
}

function SidebarBody({
  target,
  section,
  lang,
  pageId,
  onSaved,
  setSaveStatus,
}: {
  target: EditorTarget;
  section: CmsSection;
  lang: any;
  pageId: number;
  onSaved: (section: CmsSection) => void;
  setSaveStatus: (s: "idle" | "saving" | "saved" | "failed") => void;
}) {
  const persist = async (next: CmsSection) => {
    setSaveStatus("saving");
    try {
      await UpdateSpecifiedSection(next, pageId, next.id, lang);
      onSaved(next);
      setSaveStatus("saved");
      toast.success("Saved");
    } catch (err: any) {
      setSaveStatus("failed");
      toast.error(err?.response?.data?.message || "Save failed");
    }
  };

  if (target.kind === "text") {
    return (
      <TextEditor
        en={String(section[target.field]?.en || "")}
        ar={String(section[target.field]?.ar || "")}
        multiline={target.multiline}
        onSave={(values) => {
          const next = cloneSection(section);
          next[target.field] = values;
          void persist(next);
        }}
      />
    );
  }

  if (target.kind === "ui") {
    return (
      <TextEditor
        en={String(section.ui?.en?.[target.key] || "")}
        ar={String(section.ui?.ar?.[target.key] || "")}
        multiline={target.multiline}
        onSave={(values) => {
          const next = cloneSection(section);
          next.ui = {
            en: { ...(next.ui?.en || {}), [target.key]: values.en },
            ar: { ...(next.ui?.ar || {}), [target.key]: values.ar },
          };
          void persist(next);
        }}
      />
    );
  }

  if (target.kind === "image") {
    return (
      <ImageField
        url={section.image?.url}
        onUploaded={(url) => {
          const next = cloneSection(section);
          next.image = { ...(next.image || {}), url };
          void persist(next);
        }}
        onClear={() => {
          const next = cloneSection(section);
          next.image = { ...(next.image || {}), url: "" };
          void persist(next);
        }}
      />
    );
  }

  if (target.kind === "logo") {
    return (
      <ImageField
        url={section.ui?.en?.logo || section.image?.url}
        onUploaded={(url) => {
          const next = cloneSection(section);
          next.ui = {
            en: { ...(next.ui?.en || {}), logo: url },
            ar: { ...(next.ui?.ar || {}), logo: url },
          };
          void persist(next);
        }}
        onClear={() => {
          const next = cloneSection(section);
          next.ui = {
            en: { ...(next.ui?.en || {}), logo: "" },
            ar: { ...(next.ui?.ar || {}), logo: "" },
          };
          void persist(next);
        }}
      />
    );
  }

  if (target.kind === "partners") {
    return <PartnersEditor section={section} persist={persist} />;
  }
  if (target.kind === "stats") {
    return <StatsEditor section={section} persist={persist} />;
  }
  if (target.kind === "list") {
    return <ListEditor section={section} persist={persist} />;
  }
  if (target.kind === "features") {
    return <FeaturesEditor section={section} persist={persist} />;
  }
  if (target.kind === "eyebrowParts") {
    return <EyebrowEditor section={section} persist={persist} />;
  }
  if (target.kind === "listObject") {
    return <ListObjectEditor section={section} persist={persist} />;
  }
  return null;
}

function TextEditor({
  en,
  ar,
  multiline,
  onSave,
}: {
  en: string;
  ar: string;
  multiline?: boolean;
  onSave: (values: { en: string; ar: string }) => void;
}) {
  const [values, setValues] = useState({ en, ar });
  return (
    <div className="space-y-4">
      <BilingualFields en={values.en} ar={values.ar} multiline={multiline} onChange={setValues} />
      <button
        type="button"
        onClick={() => onSave(values)}
        className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
      >
        Save
      </button>
    </div>
  );
}

function PartnersEditor({
  section,
  persist,
}: {
  section: CmsSection;
  persist: (s: CmsSection) => Promise<void>;
}) {
  const logos: { url: string; alt?: string }[] = Array.isArray(section.list) ? section.list : [];
  const { lang } = useParams();

  const update = (nextList: any[]) => {
    const next = cloneSection(section);
    next.list = nextList;
    void persist(next);
  };

  return (
    <div className="space-y-3">
      {logos.map((logo, index) => (
        <div key={`${logo.url}-${index}`} className="flex items-center gap-3 rounded-md border p-2">
          <img src={resolveCmsSrc(logo.url)} alt={logo.alt || ""} className="h-12 w-20 object-contain" />
          <button
            type="button"
            className="ms-auto text-red-600"
            onClick={() => update(logos.filter((_, i) => i !== index))}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed py-3 text-sm">
        <Plus size={16} /> Add logo
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const formData = new FormData();
            formData.append("files", file);
            formData.append("alt[0]", file.name);
            const res = await CreateMedia(formData, lang);
            const uploaded = Array.isArray(res) ? res[0] : res;
            const url = uploaded?.url || uploaded;
            if (url) update([...logos, { url: typeof url === "string" ? url : url.url, alt: file.name }]);
          }}
        />
      </label>
    </div>
  );
}

function StatsEditor({
  section,
  persist,
}: {
  section: CmsSection;
  persist: (s: CmsSection) => Promise<void>;
}) {
  const initial = useMemo(() => {
    const enEntries = Object.entries(section.objectData?.en || {}).filter(([k]) => !k.startsWith("_"));
    const arEntries = Object.entries(section.objectData?.ar || {}).filter(([k]) => !k.startsWith("_"));
    return enEntries.map(([enKey, enVal], i) => ({
      enKey,
      enVal: String(enVal ?? ""),
      arKey: arEntries[i]?.[0] || enKey,
      arVal: String(arEntries[i]?.[1] ?? enVal ?? ""),
    }));
  }, [section]);
  const [rows, setRows] = useState(initial);

  return (
    <div className="space-y-4">
      {rows.map((row, index) => (
        <div key={index} className="space-y-2 rounded-md border p-3">
          <div className="flex justify-between">
            <span className="text-xs text-default-500">Stat {index + 1}</span>
            <button type="button" onClick={() => setRows(rows.filter((_, i) => i !== index))}>
              <Trash2 size={14} />
            </button>
          </div>
          <input
            className="w-full rounded border px-2 py-1 text-sm"
            value={row.enKey}
            onChange={(e) => setRows(rows.map((r, i) => (i === index ? { ...r, enKey: e.target.value } : r)))}
          />
          <input
            className="w-full rounded border px-2 py-1 text-sm"
            value={row.enVal}
            onChange={(e) => setRows(rows.map((r, i) => (i === index ? { ...r, enVal: e.target.value } : r)))}
          />
          <input
            dir="rtl"
            className="w-full rounded border px-2 py-1 text-end text-sm"
            value={row.arKey}
            onChange={(e) => setRows(rows.map((r, i) => (i === index ? { ...r, arKey: e.target.value } : r)))}
          />
          <input
            dir="rtl"
            className="w-full rounded border px-2 py-1 text-end text-sm"
            value={row.arVal}
            onChange={(e) => setRows(rows.map((r, i) => (i === index ? { ...r, arVal: e.target.value } : r)))}
          />
        </div>
      ))}
      <button
        type="button"
        className="w-full rounded-md border border-dashed py-2 text-sm"
        onClick={() => setRows([...rows, { enKey: "New", enVal: "0", arKey: "جديد", arVal: "0" }])}
      >
        + Add stat
      </button>
      <button
        type="button"
        className="w-full rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
        onClick={() => {
          const next = cloneSection(section);
          next.objectData = {
            en: Object.fromEntries(rows.map((r) => [r.enKey, r.enVal])),
            ar: Object.fromEntries(rows.map((r) => [r.arKey, r.arVal])),
          };
          void persist(next);
        }}
      >
        Save
      </button>
    </div>
  );
}

function ListEditor({
  section,
  persist,
}: {
  section: CmsSection;
  persist: (s: CmsSection) => Promise<void>;
}) {
  const enList = Array.isArray(section.list?.en) ? section.list.en : [];
  const arList = Array.isArray(section.list?.ar) ? section.list.ar : [];
  const [rows, setRows] = useState(
    Array.from({ length: Math.max(enList.length, arList.length) }, (_, i) => ({
      en: String(enList[i] || ""),
      ar: String(arList[i] || ""),
    }))
  );

  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div key={index} className="space-y-2 rounded-md border p-3">
          <div className="flex justify-between text-xs text-default-500">
            Item {index + 1}
            <button type="button" onClick={() => setRows(rows.filter((_, i) => i !== index))}>
              <Trash2 size={14} />
            </button>
          </div>
          <input className="w-full rounded border px-2 py-1 text-sm" value={row.en} onChange={(e) => setRows(rows.map((r, i) => (i === index ? { ...r, en: e.target.value } : r)))} />
          <input dir="rtl" className="w-full rounded border px-2 py-1 text-end text-sm" value={row.ar} onChange={(e) => setRows(rows.map((r, i) => (i === index ? { ...r, ar: e.target.value } : r)))} />
        </div>
      ))}
      <button type="button" className="w-full rounded-md border border-dashed py-2 text-sm" onClick={() => setRows([...rows, { en: "", ar: "" }])}>
        + Add item
      </button>
      <button
        type="button"
        className="w-full rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
        onClick={() => {
          const next = cloneSection(section);
          next.list = { en: rows.map((r) => r.en), ar: rows.map((r) => r.ar) };
          void persist(next);
        }}
      >
        Save
      </button>
    </div>
  );
}

function FeaturesEditor({
  section,
  persist,
}: {
  section: CmsSection;
  persist: (s: CmsSection) => Promise<void>;
}) {
  const en = Array.isArray(section.ui?.en?.features) ? section.ui.en.features : [];
  const ar = Array.isArray(section.ui?.ar?.features) ? section.ui.ar.features : [];
  const [rows, setRows] = useState(
    Array.from({ length: Math.max(en.length, ar.length, 4) }, (_, i) => ({
      en: String(en[i] || ""),
      ar: String(ar[i] || ""),
    }))
  );

  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div key={index} className="space-y-2 rounded-md border p-3">
          <input className="w-full rounded border px-2 py-1 text-sm" value={row.en} onChange={(e) => setRows(rows.map((r, i) => (i === index ? { ...r, en: e.target.value } : r)))} />
          <input dir="rtl" className="w-full rounded border px-2 py-1 text-end text-sm" value={row.ar} onChange={(e) => setRows(rows.map((r, i) => (i === index ? { ...r, ar: e.target.value } : r)))} />
        </div>
      ))}
      <button
        type="button"
        className="w-full rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
        onClick={() => {
          const next = cloneSection(section);
          next.ui = {
            en: { ...(next.ui?.en || {}), features: rows.map((r) => r.en) },
            ar: { ...(next.ui?.ar || {}), features: rows.map((r) => r.ar) },
          };
          void persist(next);
        }}
      >
        Save
      </button>
    </div>
  );
}

function EyebrowEditor({
  section,
  persist,
}: {
  section: CmsSection;
  persist: (s: CmsSection) => Promise<void>;
}) {
  const en = Array.isArray(section.ui?.en?.eyebrowParts) ? section.ui.en.eyebrowParts : [];
  const ar = Array.isArray(section.ui?.ar?.eyebrowParts) ? section.ui.ar.eyebrowParts : [];
  const [rows, setRows] = useState(
    Array.from({ length: Math.max(en.length, ar.length, 1) }, (_, i) => ({
      en: String(en[i] || ""),
      ar: String(ar[i] || ""),
    }))
  );
  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div key={index} className="space-y-2 rounded-md border p-3">
          <input className="w-full rounded border px-2 py-1 text-sm" value={row.en} onChange={(e) => setRows(rows.map((r, i) => (i === index ? { ...r, en: e.target.value } : r)))} />
          <input dir="rtl" className="w-full rounded border px-2 py-1 text-end text-sm" value={row.ar} onChange={(e) => setRows(rows.map((r, i) => (i === index ? { ...r, ar: e.target.value } : r)))} />
        </div>
      ))}
      <button type="button" className="w-full rounded-md border border-dashed py-2 text-sm" onClick={() => setRows([...rows, { en: "", ar: "" }])}>
        + Add word
      </button>
      <button
        type="button"
        className="w-full rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
        onClick={() => {
          const next = cloneSection(section);
          next.ui = {
            en: { ...(next.ui?.en || {}), eyebrowParts: rows.map((r) => r.en) },
            ar: { ...(next.ui?.ar || {}), eyebrowParts: rows.map((r) => r.ar) },
          };
          void persist(next);
        }}
      >
        Save
      </button>
    </div>
  );
}

function ListObjectEditor({
  section,
  persist,
}: {
  section: CmsSection;
  persist: (s: CmsSection) => Promise<void>;
}) {
  const en = Array.isArray(section.list_Object?.en) ? section.list_Object.en : [];
  const ar = Array.isArray(section.list_Object?.ar) ? section.list_Object.ar : [];
  const [rows, setRows] = useState(
    Array.from({ length: Math.max(en.length, ar.length) }, (_, i) => ({
      titleEn: String(en[i]?.title || ""),
      descEn: String(en[i]?.desc || ""),
      listEn: Array.isArray(en[i]?.list) ? en[i].list.join("\n") : "",
      titleAr: String(ar[i]?.title || ""),
      descAr: String(ar[i]?.desc || ""),
      listAr: Array.isArray(ar[i]?.list) ? ar[i].list.join("\n") : "",
    }))
  );

  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div key={index} className="space-y-2 rounded-md border p-3">
          <div className="flex justify-between text-xs">
            Group {index + 1}
            <button type="button" onClick={() => setRows(rows.filter((_, i) => i !== index))}>
              <Trash2 size={14} />
            </button>
          </div>
          <input className="w-full rounded border px-2 py-1 text-sm" value={row.titleEn} onChange={(e) => setRows(rows.map((r, i) => (i === index ? { ...r, titleEn: e.target.value } : r)))} />
          <textarea className="w-full rounded border px-2 py-1 text-sm" rows={2} value={row.descEn} onChange={(e) => setRows(rows.map((r, i) => (i === index ? { ...r, descEn: e.target.value } : r)))} />
          <textarea className="w-full rounded border px-2 py-1 text-sm" rows={3} value={row.listEn} onChange={(e) => setRows(rows.map((r, i) => (i === index ? { ...r, listEn: e.target.value } : r)))} />
          <input dir="rtl" className="w-full rounded border px-2 py-1 text-end text-sm" value={row.titleAr} onChange={(e) => setRows(rows.map((r, i) => (i === index ? { ...r, titleAr: e.target.value } : r)))} />
          <textarea dir="rtl" className="w-full rounded border px-2 py-1 text-end text-sm" rows={2} value={row.descAr} onChange={(e) => setRows(rows.map((r, i) => (i === index ? { ...r, descAr: e.target.value } : r)))} />
          <textarea dir="rtl" className="w-full rounded border px-2 py-1 text-end text-sm" rows={3} value={row.listAr} onChange={(e) => setRows(rows.map((r, i) => (i === index ? { ...r, listAr: e.target.value } : r)))} />
        </div>
      ))}
      <button type="button" className="w-full rounded-md border border-dashed py-2 text-sm" onClick={() => setRows([...rows, { titleEn: "", descEn: "", listEn: "", titleAr: "", descAr: "", listAr: "" }])}>
        + Add group
      </button>
      <button
        type="button"
        className="w-full rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
        onClick={() => {
          const next = cloneSection(section);
          next.list_Object = {
            en: rows.map((r) => ({ title: r.titleEn, desc: r.descEn, list: r.listEn.split("\n").filter(Boolean) })),
            ar: rows.map((r) => ({ title: r.titleAr, desc: r.descAr, list: r.listAr.split("\n").filter(Boolean) })),
          };
          void persist(next);
        }}
      >
        Save
      </button>
    </div>
  );
}
