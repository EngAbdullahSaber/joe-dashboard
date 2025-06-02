import { apis } from "../axios";

export async function getCareer(lang: any) {
  let res = await apis.get(`api/v1/careers`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function getCareerPanigation(page: any, lang: any) {
  let res = await apis.get(`api/v1/careers?page=${page}&per_page=10`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function SearchCareer(id: any, lang: any) {
  let res = await apis.get(`api/v1/careers?search=${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}

export async function DeleteCareer(id: any, lang: any) {
  let res = await apis.delete(`api/v1/careers/${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateCareers(data: any, lang: any) {
  let res = await apis.post(`api/v1/careers`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function UpdateCareers(data: any, id: any, lang: any) {
  let res = await apis.patch(`api/v1/careers/${id}`, data, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
