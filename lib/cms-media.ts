import { ImageUrl } from "@/services/app.config";

const websiteUrl = (
  process.env.NEXT_PUBLIC_WEBSITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000"
).replace(/\/$/, "");

export function resolveCmsSrc(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("blob:") || url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (
    url.startsWith("/landing") ||
    url.startsWith("/assets") ||
    url.startsWith("/joe")
  ) {
    return `${websiteUrl}${url}`;
  }
  return `${ImageUrl}${url}`;
}

export const HOME_SECTION_ORDER = [
  "sec1",
  "sec2",
  "sec3",
  "sec4",
  "sec5",
  "sec6",
  "sec8",
  "sec9",
  "sec10",
  "sec11",
];

export const HOME_SECTION_LABELS: Record<string, string> = {
  sec1: "Hero",
  sec2: "Success in numbers",
  sec3: "Partners",
  sec4: "Business units",
  sec5: "Marketing",
  sec6: "Software & AI",
  sec8: "Telecoms",
  sec9: "Manpower & HR",
  sec10: "Merchandising",
  sec11: "Products",
};
