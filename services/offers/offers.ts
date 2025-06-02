import { apis } from "../axios";

export async function getOffers(lang: any) {
  let res = await apis.get(`api/v1/offers`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function getOffersPanigation(page: any, lang: any) {
  let res = await apis.get(`api/v1/offers?page=${page}&per_page=10`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function SearchOffers(id: any, lang: any) {
  let res = await apis.get(`api/v1/offers?search=${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function DeleteOffers(id: any, lang: any) {
  let res = await apis.delete(`api/v1/offers/${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateOffers(data: any, lang: any) {
  let res = await apis.post(`api/v1/offers`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function UpdateOfferss(data: any, id: any, lang: any) {
  let res = await apis.patch(`api/v1/offers/${id}`, data, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
