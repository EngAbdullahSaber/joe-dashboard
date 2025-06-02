import { apis } from "../axios";

export async function getBlogs(lang: any) {
  let res = await apis.get(`api/v1/blogs`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function getBlogsPanigation(page: any, lang: any) {
  let res = await apis.get(`api/v1/blogs?page=${page}&per_page=10`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function SearchBlogs(id: any, lang: any) {
  let res = await apis.get(`api/v1/blogs?search=${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}

export async function CreateBlogs(data: any, lang: any) {
  let res = await apis.post(`api/v1/blogs`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function DeleteBlogs(id: any, lang: any) {
  let res = await apis.delete(`api/v1/blogs/${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function UpdateBlogs(data: any, id: any, lang: any) {
  let res = await apis.patch(`api/v1/blogs/${id}`, data, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
