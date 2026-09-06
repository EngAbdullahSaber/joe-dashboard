"use client";

import { Pencil, Plus } from "lucide-react";
import { HOME_SECTION_LABELS, HOME_SECTION_ORDER, resolveCmsSrc } from "@/lib/cms-media";
import { useHomeEdit, type CmsSection } from "./HomeEditProvider";

function Hit({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`group relative cursor-pointer rounded-sm text-start outline-dashed outline-2 outline-transparent transition hover:bg-white/10 hover:outline-emerald-400 ${className}`}
    >
      {children}
      <span className="absolute -end-1 -top-1 z-10 rounded-full bg-emerald-600 p-1 text-white opacity-0 group-hover:opacity-100">
        <Pencil size={10} />
      </span>
    </button>
  );
}

export default function HomePreview() {
  const { page, previewLang, openEditor } = useHomeEdit();
  const sections = HOME_SECTION_ORDER.map((id) => page.sections.find((s) => s.id === id)).filter(
    Boolean
  ) as CmsSection[];

  return (
    <div className="space-y-6 bg-[#070b12] p-4 text-white">
      {sections.map((section) => (
        <SectionPreview key={section.id} section={section} lang={previewLang} openEditor={openEditor} />
      ))}
    </div>
  );
}

function SectionPreview({
  section,
  lang,
  openEditor,
}: {
  section: CmsSection;
  lang: "en" | "ar";
  openEditor: ReturnType<typeof useHomeEdit>["openEditor"];
}) {
  const title = section.title?.[lang] || section.title?.en || "";
  const content = section.content?.[lang] || section.content?.en || "";
  const ui = section.ui?.[lang] || {};
  const bg = resolveCmsSrc(section.image?.url);

  return (
    <section className="relative min-h-[420px] overflow-hidden rounded-xl border border-white/10">
      {bg ? (
        <img src={bg} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-slate-900" />
      )}
      <div className="absolute inset-0 bg-black/55" />
      <button
        type="button"
        onClick={() => openEditor({ kind: "image", sectionId: section.id, label: "Background image" })}
        className="absolute start-3 top-3 z-20 rounded bg-white px-3 py-1.5 text-xs font-semibold text-gray-900"
      >
        Change image
      </button>
      <div className="absolute inset-x-0 top-0 z-20 flex justify-center">
        <span className="rounded-b bg-emerald-600 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide">
          {HOME_SECTION_LABELS[section.id] || section.id}
        </span>
      </div>

      <div className="relative z-10 flex min-h-[420px] flex-col items-center justify-center gap-4 px-8 py-16 text-center">
        {section.id === "sec1" ? (
          <Hit onClick={() => openEditor({ kind: "logo", sectionId: section.id, label: "Logo" })}>
            <img
              src={resolveCmsSrc(ui.logo || "/assets/svg/logo-white.svg")}
              alt="logo"
              className="mx-auto h-16 object-contain"
            />
          </Hit>
        ) : null}

        {ui.eyebrow || Array.isArray(ui.eyebrowParts) ? (
          <Hit
            onClick={() =>
              openEditor(
                Array.isArray(ui.eyebrowParts)
                  ? { kind: "eyebrowParts", sectionId: section.id }
                  : { kind: "ui", sectionId: section.id, key: "eyebrow", label: "Eyebrow" }
              )
            }
            className="text-xs tracking-[0.3em] text-sky-400"
          >
            {Array.isArray(ui.eyebrowParts) ? ui.eyebrowParts.join("  ") : ui.eyebrow}
          </Hit>
        ) : null}

        <Hit
          onClick={() =>
            openEditor({ kind: "text", sectionId: section.id, field: "title", label: "Title" })
          }
          className="max-w-3xl text-3xl font-bold"
        >
          {title || "Untitled"}
        </Hit>

        <Hit
          onClick={() =>
            openEditor({
              kind: "text",
              sectionId: section.id,
              field: "content",
              label: "Content",
              multiline: true,
            })
          }
          className="max-w-2xl text-base text-white/80"
        >
          {content || "Add content"}
        </Hit>

        {ui.body ? (
          <Hit
            onClick={() =>
              openEditor({ kind: "ui", sectionId: section.id, key: "body", label: "Body", multiline: true })
            }
            className="max-w-2xl text-sm text-white/70"
          >
            {ui.body}
          </Hit>
        ) : null}

        {ui.cta ? (
          <Hit
            onClick={() => openEditor({ kind: "ui", sectionId: section.id, key: "cta", label: "Button" })}
            className="rounded-full bg-sky-500 px-6 py-2 text-sm font-medium"
          >
            {ui.cta}
          </Hit>
        ) : null}

        {section.id === "sec2" ? <StatsBlock section={section} lang={lang} openEditor={openEditor} /> : null}
        {section.id === "sec3" ? <PartnersBlock section={section} openEditor={openEditor} /> : null}
        {Array.isArray(ui.features) ? (
          <FeaturesBlock section={section} features={ui.features} openEditor={openEditor} />
        ) : null}
        {section.id === "sec5" || section.id === "sec6" || section.id === "sec8" || section.id === "sec11" ? (
          <button
            type="button"
            className="text-xs text-sky-300 underline"
            onClick={() => openEditor({ kind: "list", sectionId: section.id })}
          >
            Edit modal list
          </button>
        ) : null}
        {section.id === "sec9" ? (
          <button
            type="button"
            className="text-xs text-sky-300 underline"
            onClick={() => openEditor({ kind: "stats", sectionId: section.id })}
          >
            Edit modal items
          </button>
        ) : null}
        {section.id === "sec10" ? (
          <button
            type="button"
            className="text-xs text-sky-300 underline"
            onClick={() => openEditor({ kind: "listObject", sectionId: section.id })}
          >
            Edit modal groups
          </button>
        ) : null}
      </div>
    </section>
  );
}

function StatsBlock({
  section,
  lang,
  openEditor,
}: {
  section: CmsSection;
  lang: "en" | "ar";
  openEditor: ReturnType<typeof useHomeEdit>["openEditor"];
}) {
  const entries = Object.entries(section.objectData?.[lang] || {}).filter(([k]) => !k.startsWith("_"));
  return (
    <div className="mt-4 grid w-full max-w-4xl grid-cols-2 gap-2 lg:grid-cols-5">
      {entries.map(([name, value]) => (
        <Hit
          key={name}
          onClick={() => openEditor({ kind: "stats", sectionId: section.id })}
          className="rounded-lg border border-white/20 bg-black/30 p-3"
        >
          <div className="text-2xl font-bold text-sky-400">+{String(value)}</div>
          <div className="text-sm">{name}</div>
        </Hit>
      ))}
      <button
        type="button"
        onClick={() => openEditor({ kind: "stats", sectionId: section.id })}
        className="flex items-center justify-center rounded-lg border border-dashed border-emerald-400 p-3 text-emerald-300"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}

function PartnersBlock({
  section,
  openEditor,
}: {
  section: CmsSection;
  openEditor: ReturnType<typeof useHomeEdit>["openEditor"];
}) {
  const logos: { url: string; alt?: string }[] = Array.isArray(section.list) ? section.list : [];
  return (
    <div className="mt-4 flex w-full max-w-5xl flex-wrap justify-center gap-2">
      {logos.map((logo, i) => (
        <Hit key={`${logo.url}-${i}`} onClick={() => openEditor({ kind: "partners", sectionId: section.id })}>
          <div className="flex h-16 w-28 items-center justify-center rounded-md border border-white/20 bg-black/40 p-2">
            <img src={resolveCmsSrc(logo.url)} alt={logo.alt || ""} className="max-h-full max-w-full object-contain" />
          </div>
        </Hit>
      ))}
      <button
        type="button"
        onClick={() => openEditor({ kind: "partners", sectionId: section.id })}
        className="flex h-16 w-28 items-center justify-center rounded-md border border-dashed border-emerald-400 text-emerald-300"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}

function FeaturesBlock({
  section,
  features,
  openEditor,
}: {
  section: CmsSection;
  features: string[];
  openEditor: ReturnType<typeof useHomeEdit>["openEditor"];
}) {
  return (
    <div className="mt-4 grid w-full max-w-3xl grid-cols-2 gap-2 sm:grid-cols-4">
      {features.map((label, i) => (
        <Hit
          key={`${label}-${i}`}
          onClick={() => openEditor({ kind: "features", sectionId: section.id })}
          className="rounded-lg border border-white/20 bg-black/30 p-3 text-sm whitespace-pre-line"
        >
          {label}
        </Hit>
      ))}
    </div>
  );
}
