import { apis } from "../axios";

export async function getSpecifiedPageMeta(lang: any, page: any) {
  let res = await apis.get(`api/v1/pages/${page}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}

export async function UpdateSpecifiedSection(
  data: any,
  id: any,
  sectionId: any,
  lang: any
) {
  let res = await apis.put(`api/v1/pages/${id}/sections/${sectionId}`, data, {
    headers: { "Accept-Language": lang, "Content-Type": "application/json" },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateSection(data: any, lang: any, id: any) {
  let res = await apis.post(`api/v1/pages/${id}/sections`, data, {
    headers: { "Accept-Language": lang, "Content-Type": "application/json" },
  });
  if (res) return res.data;
  else return false;
}
export async function DeleteSection(pageId: any, sectiond: any, lang: any) {
  let res = await apis.delete(`api/v1/pages/${pageId}/sections/${sectiond}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
