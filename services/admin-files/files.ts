import { apis } from "../axios";

export async function getFiles(lang: any) {
  let res = await apis.get(`user/admin/files`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function getFilesPanigation(page: any, lang: any) {
  let res = await apis.get(`user/admin/files?page=${page}&per_page=10`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function SearchFiles(id: any, lang: any) {
  let res = await apis.get(`user/admin/files`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function DeleteFiles(id: any, lang: any) {
  let res = await apis.delete(`user/delete/file/${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateFiles(data: any, lang: any) {
  let res = await apis.post(`user/add-files`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
