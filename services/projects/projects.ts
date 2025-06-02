import { apis } from "../axios";

export async function getProject(lang: any) {
  let res = await apis.get(`api/v1/projects`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function getAllProject(lang: any) {
  let res = await apis.get(`api/v1/projects?limit=10000`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function getProjectPanigation(page: any, lang: any) {
  let res = await apis.get(`api/v1/projects?page=${page}&per_page=10`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function SearchProject(id: any, lang: any) {
  let res = await apis.get(`api/v1/projects?search=${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function DeleteProjectImage(projectId: any, lang: any, data: any) {
  const res = await apis.delete(`/api/v1/projects/${projectId}/images`, {
    data,
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function DeleteProject(id: any, lang: any) {
  let res = await apis.delete(`api/v1/projects/${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateProjects(data: any, lang: any) {
  let res = await apis.post(`api/v1/projects`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function UpdateProjects(data: any, id: any, lang: any) {
  let res = await apis.patch(`api/v1/projects/${id}`, data, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
