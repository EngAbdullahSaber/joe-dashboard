import { apis } from "../axios";

export async function getPartner(lang: any) {
  let res = await apis.get(`api/v1/partners`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function getPartnerPanigation(page: any, lang: any) {
  let res = await apis.get(`api/v1/partners?page=${page}&per_page=10`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function SearchPartner(id: any, lang: any) {
  let res = await apis.get(`api/v1/partners?search=${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function DeletePartner(id: any, lang: any) {
  let res = await apis.delete(`api/v1/partners/${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function CreatePartners(data: any, lang: any) {
  let res = await apis.post(`api/v1/partners`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function UpdatePartners(data: any, id: any, lang: any) {
  let res = await apis.patch(`api/v1/partners/${id}`, data, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
