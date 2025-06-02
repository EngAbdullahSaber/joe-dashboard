import { apis } from "../axios";

export async function getClients(lang: any) {
  let res = await apis.get(`resources/client`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function getFiles(lang: any) {
  let res = await apis.get(`user/all-files`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function getFilesPanigation(page: any, lang: any) {
  let res = await apis.get(`user/all-files?page=${page}&per_page=10`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function SearchFiles(id: any, lang: any) {
  let res = await apis.get(`user/all-files`, {
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
export async function getClientsPanigation(page: any, lang: any) {
  let res = await apis.get(`resources/client?page=${page}&per_page=10`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function SearchClients(id: any, lang: any) {
  let res = await apis.get(`resources/client`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function UpdateClients(data: any, id: any, lang: any) {
  let res = await apis.patch(`resources/client`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateClients(data: any, lang: any) {
  let res = await apis.post(`client`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function DeleteClients(id: any, lang: any) {
  let res = await apis.delete(`resources/client/${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
