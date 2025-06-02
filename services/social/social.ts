import { apis } from "../axios";

export async function getSocial(lang: any) {
  let res = await apis.get(`resources/about`, {
    headers: { "Accept-Language": lang, "Content-Type": "application/json" },
  });
  if (res) return res.data;
  else return false;
}

export async function UpdateSocial(data: any, lang: any) {
  let res = await apis.patch(`resources/about/1`, data, {
    headers: { "Accept-Language": lang, "Content-Type": "application/json" },
  });
  if (res) return res.data;
  else return false;
}
