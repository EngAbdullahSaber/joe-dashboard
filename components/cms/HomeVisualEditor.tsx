"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { getSpecifiedPageMeta } from "@/services/page-meta/page-meta";
import { HomeEditProvider, useHomeEdit } from "./HomeEditProvider";
import HomePreview from "./HomePreview";
import EditorSidebar from "./EditorSidebar";
import SeoEditorSidebar from "./SeoEditorSidebar";

const SCALE = 0.62;

function ScaledPreview({ children }: { children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const ro = new ResizeObserver(() => {
      outer.style.height = `${inner.offsetHeight * SCALE}px`;
    });
    ro.observe(inner);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outerRef} className="overflow-hidden">
      <div
        ref={innerRef}
        style={{ transform: `scale(${SCALE})`, transformOrigin: "top left", width: `${100 / SCALE}%` }}
      >
        {children}
      </div>
    </div>
  );
}

function Toolbar() {
  const { previewLang, setPreviewLang, setShowSeo, saveStatus, page } = useHomeEdit();
  return (
    <div className="sticky top-0 z-40 flex flex-wrap items-center gap-3 border-b bg-background px-4 py-3 shadow-sm">
      <div>
        <p className="text-sm font-semibold">Home page</p>
        <p className="text-xs text-default-500">{page.slug}</p>
      </div>
      <div className="ms-auto flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-md border p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setPreviewLang("en")}
            className={`rounded px-2 py-1 ${previewLang === "en" ? "bg-primary text-primary-foreground" : ""}`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setPreviewLang("ar")}
            className={`rounded px-2 py-1 ${previewLang === "ar" ? "bg-primary text-primary-foreground" : ""}`}
          >
            AR
          </button>
        </div>
        <button
          type="button"
          onClick={() => setShowSeo(true)}
          className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm"
        >
          <Search size={14} />
          Page SEO
        </button>
        {saveStatus === "saving" ? <span className="text-xs text-amber-600">Saving…</span> : null}
        {saveStatus === "saved" ? <span className="text-xs text-emerald-600">Saved</span> : null}
        {saveStatus === "failed" ? <span className="text-xs text-red-600">Save failed</span> : null}
      </div>
    </div>
  );
}

function EditorShell() {
  const { showSeo, target } = useHomeEdit();
  return (
    <div className="-m-6 flex min-h-[calc(100vh-4rem)] flex-col">
      <Toolbar />
      <div className="flex-1 overflow-auto bg-[#d9d4cc] p-4 md:p-6">
        <div className="mx-auto max-w-[1440px] overflow-hidden rounded-xl bg-black shadow-lg">
          <ScaledPreview>
            <HomePreview />
          </ScaledPreview>
        </div>
      </div>
      {target ? <EditorSidebar /> : null}
      {showSeo ? <SeoEditorSidebar /> : null}
    </div>
  );
}

export default function HomeVisualEditor({ lang }: { lang: any }) {
  const [page, setPage] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getSpecifiedPageMeta(lang, "home-page")
      .then((res) => {
        if (cancelled) return;
        setPage(res?.data || res);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load home page");
      });
    return () => {
      cancelled = true;
    };
  }, [lang]);

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }
  if (!page) {
    return <div className="p-6 text-default-500">Loading home preview…</div>;
  }

  return (
    <HomeEditProvider page={page} setPage={setPage}>
      <EditorShell />
    </HomeEditProvider>
  );
}
