import { apis } from "../axios";

export async function getDepatment(lang: any) {
  let res = await apis.get(`api/v1/departments`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function getAllDepatment(lang: any) {
  let res = await apis.get(`api/v1/departments?limit=10000`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function getDepatmentPanigation(page: any, lang: any) {
  let res = await apis.get(`api/v1/departments?page=${page}&per_page=10`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function SearchDepatment(id: any, lang: any) {
  let res = await apis.get(`api/v1/departments?search=${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function DeleteDepatment(id: any, lang: any) {
  let res = await apis.delete(`api/v1/departments/${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateDepatment(data: any, lang: any) {
  let res = await apis.post(`api/v1/departments`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function UpdateDepatments(data: any, id: any, lang: any) {
  let res = await apis.patch(`api/v1/departments/${id}`, data, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
