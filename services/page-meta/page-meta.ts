import { apis } from "../axios";

export async function getSpecifiedPageMeta(lang: any, page: any) {
  let res = await apis.get(`api/v1/pages/${page}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}

export async function UpdateSpecifiedPageMeta(data: any, id: any, lang: any) {
  let res = await apis.put(`api/v1/pages/${id}`, data, {
    headers: { "Accept-Language": lang, "Content-Type": "application/json" },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateSection(data: any, lang: any) {
  let res = await apis.post(`partner`, data, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
