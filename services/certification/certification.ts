import { apis } from "../axios";

export async function getCertification(lang: any) {
  let res = await apis.get(`resources/certification`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}

export async function CreateCertifications(data: any, lang: any) {
  let res = await apis.post(`certification`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function DeleteCertifications(id: any, lang: any) {
  let res = await apis.delete(`resources/certification/${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
