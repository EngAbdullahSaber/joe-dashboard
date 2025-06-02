import { apis } from "../axios";

export async function getServices(lang: any) {
  let res = await apis.get(`api/v1/services`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function getServicesById(lang: any, id: any) {
  let res = await apis.get(`api/v1/services/${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function getServicesPanigation(page: any, lang: any) {
  let res = await apis.get(`api/v1/services?page=${page}&per_page=10`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function SearchServices(id: any, lang: any) {
  let res = await apis.get(`api/v1/services?search=${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function DeleteServices(id: any, lang: any) {
  let res = await apis.delete(`api/v1/services/${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateServices(data: any, lang: any) {
  let res = await apis.post(`api/v1/services`, data, {
    headers: {
      "Accept-Language": lang,
      "Content-Type": "application/json",
    },
  });
  if (res) return res.data;
  else return false;
}
export async function UpdateServices(data: any, id: any, lang: any) {
  let res = await apis.patch(`api/v1/services/${id}`, data, {
    headers: { "Accept-Language": lang, "Content-Type": "application/json" },
  });
  if (res) return res.data;
  else return false;
}
