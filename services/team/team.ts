import { apis } from "../axios";

export async function getTeamMember(lang: any) {
  let res = await apis.get(`api/v1/team-members`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function getTeamMemberPanigation(page: any, lang: any) {
  let res = await apis.get(`api/v1/team-members?page=${page}&per_page=10`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function SearchTeamMember(id: any, lang: any) {
  let res = await apis.get(`api/v1/team-members?search=${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function DeleteTeamMember(id: any, lang: any) {
  let res = await apis.delete(`api/v1/team-members/${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateTeamMembers(data: any, lang: any) {
  let res = await apis.post(`api/v1/team-members`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function UpdateeamMembers(data: any, id: any, lang: any) {
  let res = await apis.patch(`api/v1/team-members/${id}`, data, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
