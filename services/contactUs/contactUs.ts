import { apis } from "../axios";

export async function getContactUsOffers(lang: any) {
  let res = await apis.get(`api/v1/contacts?search=offers`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function getContactUsOffersPanigation(page: any, lang: any) {
  let res = await apis.get(
    `api/v1/contacts?search=offers&page=${page}&per_page=10`,
    {
      headers: { "Accept-Language": lang },
    }
  );
  if (res) return res.data;
  else return false;
}
export async function SearchContactUsOffers(id: any, lang: any) {
  let res = await apis.get(`api/v1/contacts?search=offers&search=${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}

/////// career

export async function getContactUsCareer(lang: any) {
  let res = await apis.get(`api/v1/contacts?search=career`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function getContactUsCareerPanigation(page: any, lang: any) {
  let res = await apis.get(
    `api/v1/contacts?search=career&page=${page}&per_page=10`,
    {
      headers: { "Accept-Language": lang },
    }
  );
  if (res) return res.data;
  else return false;
}
export async function SearchContactUsCareer(id: any, lang: any) {
  let res = await apis.get(`api/v1/contacts?search=career&search=${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}

/////// User

export async function getContactUsGeneral(lang: any) {
  let res = await apis.get(`api/v1/contacts?search=general`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function getContactUsGeneralPanigation(page: any, lang: any) {
  let res = await apis.get(
    `api/v1/contacts?search=general&page=${page}&per_page=10`,
    {
      headers: { "Accept-Language": lang },
    }
  );
  if (res) return res.data;
  else return false;
}
export async function SearchContactUsGeneral(id: any, lang: any) {
  let res = await apis.get(`api/v1/contacts?general=career&search=${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}

export async function DeleteContactUs(id: any, lang: any) {
  let res = await apis.delete(`api/v1/contacts/${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
