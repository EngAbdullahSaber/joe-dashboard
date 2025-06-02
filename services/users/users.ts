import { apis } from "../axios";

export async function getUsers(lang: any) {
  let res = await apis.get(`user/all`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}

export async function getUsersPanigation(page: any, lang: any) {
  let res = await apis.get(`user/all?page=${page}&per_page=10`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function SearchUsers(id: any, lang: any) {
  let res = await apis.get(`user/all`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function DeleteUser(id: any, lang: any) {
  let res = await apis.delete(`user/delete/user/${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
