"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CmsSection = {
  id: string;
  type?: string;
  visible?: boolean | string;
  position?: number;
  title?: { en?: string; ar?: string };
  content?: { en?: string; ar?: string };
  image?: { url?: string; alt?: string; id?: number };
  list?: any;
  list_Object?: any;
  objectData?: { en?: Record<string, any>; ar?: Record<string, any> };
  ui?: { en?: Record<string, any>; ar?: Record<string, any> };
};

export type EditorTarget =
  | { kind: "text"; sectionId: string; field: "title" | "content"; label: string; multiline?: boolean }
  | { kind: "ui"; sectionId: string; key: string; label: string; multiline?: boolean }
  | { kind: "image"; sectionId: string; label: string }
  | { kind: "logo"; sectionId: string; label: string }
  | { kind: "partners"; sectionId: string }
  | { kind: "stats"; sectionId: string }
  | { kind: "list"; sectionId: string }
  | { kind: "features"; sectionId: string }
  | { kind: "listObject"; sectionId: string }
  | { kind: "eyebrowParts"; sectionId: string };

type EditModeValue = {
  isEditing: true;
  previewLang: "en" | "ar";
  setPreviewLang: (lang: "en" | "ar") => void;
  page: { id: number; slug: string; title: string; meta: any; sections: CmsSection[] };
  setPage: (page: any) => void;
  target: EditorTarget | null;
  openEditor: (target: EditorTarget) => void;
  closeEditor: () => void;
  showSeo: boolean;
  setShowSeo: (open: boolean) => void;
  saveStatus: "idle" | "saving" | "saved" | "failed";
  setSaveStatus: (status: "idle" | "saving" | "saved" | "failed") => void;
};

const EditModeContext = createContext<EditModeValue | null>(null);

export function useHomeEdit() {
  const ctx = useContext(EditModeContext);
  if (!ctx) throw new Error("useHomeEdit must be used inside provider");
  return ctx;
}

export function HomeEditProvider({
  children,
  page,
  setPage,
}: {
  children: ReactNode;
  page: EditModeValue["page"];
  setPage: (page: any) => void;
}) {
  const [previewLang, setPreviewLang] = useState<"en" | "ar">("en");
  const [target, setTarget] = useState<EditorTarget | null>(null);
  const [showSeo, setShowSeo] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "failed">("idle");

  const value = useMemo(
    () => ({
      isEditing: true as const,
      previewLang,
      setPreviewLang,
      page,
      setPage,
      target,
      openEditor: (next: EditorTarget) => {
        setShowSeo(false);
        setTarget(next);
      },
      closeEditor: () => setTarget(null),
      showSeo,
      setShowSeo: (open: boolean) => {
        if (open) setTarget(null);
        setShowSeo(open);
      },
      saveStatus,
      setSaveStatus,
    }),
    [previewLang, page, target, showSeo, saveStatus, setPage]
  );

  return (
    <EditModeContext.Provider value={value}>{children}</EditModeContext.Provider>
  );
}
