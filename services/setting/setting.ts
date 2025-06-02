import { apis } from "../axios";

export async function getSetting(lang: any) {
  let res = await apis.get(`api/v1/settings`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}

export async function UpdateSetting(data: any, id: any, lang: any) {
  let res = await apis.patch(`api/v1/settings/${id}`, data, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
