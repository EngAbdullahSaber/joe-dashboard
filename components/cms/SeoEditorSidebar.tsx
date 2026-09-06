"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import { UpdateSpecifiedPageMeta } from "@/services/page-meta/page-meta";
import { CreateMedia } from "@/services/auth/auth";
import { resolveCmsSrc } from "@/lib/cms-media";
import { useHomeEdit } from "./HomeEditProvider";

const FIELDS = [
  { key: "title", label: "Page title" },
  { key: "description", label: "Meta description", multiline: true },
  { key: "keywords", label: "Keywords (comma separated)" },
  { key: "ogTitle", label: "Open Graph title" },
  { key: "ogDescription", label: "Open Graph description", multiline: true },
  { key: "canonicalUrl", label: "Canonical URL" },
];

function asText(value: any) {
  if (Array.isArray(value)) return value.join(", ");
  return value == null ? "" : String(value);
}

export default function SeoEditorSidebar() {
  const { page, setPage, setShowSeo, setSaveStatus } = useHomeEdit();
  const { lang } = useParams();
  const meta = page.meta || {};
  const [draft, setDraft] = useState({
    en: { ...(meta.en || {}) },
    ar: { ...(meta.ar || {}) },
    ogImage: meta.en?.ogImage || meta.ar?.ogImage || meta.ogImage,
    headScript: meta.headScript || "",
    bodyScript: meta.bodyScript || "",
  });
  const [saving, setSaving] = useState(false);

  const update = (locale: "en" | "ar", key: string, value: string) => {
    setDraft((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [key]: value },
    }));
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("files", file);
    formData.append("alt[0]", "OG image");
    const res = await CreateMedia(formData, lang);
    const uploaded = Array.isArray(res) ? res[0] : res;
    setDraft((prev) => ({ ...prev, ogImage: uploaded }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus("saving");
    try {
      const en = {
        ...draft.en,
        keywords: String(draft.en.keywords || "")
          .split(",")
          .map((k: string) => k.trim())
          .filter(Boolean),
        ogImage: draft.ogImage,
      };
      const ar = {
        ...draft.ar,
        keywords: String(draft.ar.keywords || "")
          .split(",")
          .map((k: string) => k.trim())
          .filter(Boolean),
        ogImage: draft.ogImage,
      };
      const payload = {
        title: page.title,
        meta: {
          ...page.meta,
          en,
          ar,
          title: en.title,
          description: en.description,
          keywords: en.keywords,
          ogTitle: en.ogTitle,
          ogDescription: en.ogDescription,
          canonicalUrl: en.canonicalUrl || ar.canonicalUrl,
          ogUrl: page.meta?.ogUrl,
          ogType: page.meta?.ogType || "website",
          ogImage: draft.ogImage,
          headScript: draft.headScript,
          bodyScript: draft.bodyScript,
          structuredData: page.meta?.structuredData,
        },
      };
      const res = await UpdateSpecifiedPageMeta(payload, page.id, lang);
      setPage({ ...page, ...(res || {}), meta: payload.meta });
      setSaveStatus("saved");
      toast.success("SEO saved");
      setShowSeo(false);
    } catch (err: any) {
      setSaveStatus("failed");
      toast.error(err?.response?.data?.message || "SEO save failed");
    } finally {
      setSaving(false);
    }
  };

  const ogUrl = draft.ogImage?.url || (typeof draft.ogImage === "string" ? draft.ogImage : "");

  return (
    <aside className="fixed inset-y-0 end-0 z-[80] flex w-full max-w-lg flex-col border-s bg-background shadow-2xl">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <p className="text-sm font-semibold">Page SEO — English & العربية</p>
        <button type="button" onClick={() => setShowSeo(false)} className="rounded-full p-1 hover:bg-default-100">
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        {FIELDS.map((field) => (
          <div key={field.key} className="space-y-2 border-b border-default-100 pb-4">
            <p className="text-sm font-medium">{field.label}</p>
            <label className="text-xs uppercase text-default-500">English</label>
            {field.multiline ? (
              <textarea
                className="w-full rounded-md border px-3 py-2 text-sm"
                rows={3}
                value={asText(draft.en[field.key])}
                onChange={(e) => update("en", field.key, e.target.value)}
              />
            ) : (
              <input
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={asText(draft.en[field.key])}
                onChange={(e) => update("en", field.key, e.target.value)}
              />
            )}
            <label className="text-xs uppercase text-default-500">العربية</label>
            {field.multiline ? (
              <textarea
                dir="rtl"
                className="w-full rounded-md border px-3 py-2 text-end text-sm"
                rows={3}
                value={asText(draft.ar[field.key])}
                onChange={(e) => update("ar", field.key, e.target.value)}
              />
            ) : (
              <input
                dir="rtl"
                className="w-full rounded-md border px-3 py-2 text-end text-sm"
                value={asText(draft.ar[field.key])}
                onChange={(e) => update("ar", field.key, e.target.value)}
              />
            )}
          </div>
        ))}

        <div className="space-y-2">
          <p className="text-sm font-medium">Open Graph image</p>
          {ogUrl ? <img src={resolveCmsSrc(ogUrl)} alt="" className="h-32 w-full rounded-md object-cover" /> : null}
          <label className="flex cursor-pointer justify-center rounded-md border border-dashed py-3 text-sm">
            Upload OG image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleUpload(file);
              }}
            />
          </label>
        </div>
      </div>
      <div className="border-t p-4">
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save SEO"}
        </button>
      </div>
    </aside>
  );
}
