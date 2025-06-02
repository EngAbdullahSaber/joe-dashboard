import { apis } from "../axios";

export async function getCategory(lang: any) {
  let res = await apis.get(`resources/category`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}

export async function getCategoryPanigation(page: any, lang: any) {
  let res = await apis.get(`resources/category?page=${page}&per_page=10`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function SearchCategory(id: any, lang: any) {
  let res = await apis.get(`resources/category`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function getSpecifiedCategory(lang: any, id: any) {
  let res = await apis.get(`resources/category/${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function UpdateCategory(data: any, id: any, lang: any) {
  let res = await apis.patch(`resources/category/${id}`, data, {
    headers: { "Accept-Language": lang, "Content-Type": "application/json" },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateCategory(data: any, lang: any) {
  let res = await apis.post(`resources/category`, data, {
    headers: {
      "Accept-Language": lang,
      "Content-Type": "application/json",
    },
  });
  if (res) return res.data;
  else return false;
}

export async function DeleteCategory(id: any, lang: any) {
  let res = await apis.delete(`resources/category/${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
