import { apis } from "../axios";

export async function getContactUsOffers(lang: any) {
  let res = await apis.get(`api/v1/contacts?type=offers`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function getContactUsOffersPanigation(page: any, lang: any) {
  let res = await apis.get(
    `api/v1/contacts?type=offers&page=${page}&per_page=10`,
    {
      headers: { "Accept-Language": lang },
    }
  );
  if (res) return res.data;
  else return false;
}
export async function SearchContactUsOffers(id: any, lang: any) {
  let res = await apis.get(`api/v1/contacts?type=offers&search=${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}

/////// career

export async function getContactUsCareer(lang: any) {
  let res = await apis.get(`api/v1/contacts?type=career`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function getContactUsCareerPanigation(page: any, lang: any) {
  let res = await apis.get(
    `api/v1/contacts?type=career&page=${page}&per_page=10`,
    {
      headers: { "Accept-Language": lang },
    }
  );
  if (res) return res.data;
  else return false;
}
export async function SearchContactUsCareer(id: any, lang: any) {
  let res = await apis.get(`api/v1/contacts?type=career&search=${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function ExportExcelContactUsCareer(lang: any) {
  let res = await apis.get(`api/v1/contacts/export/excel?type=career`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export const getContactUsCareerWithFilters = async (
  filters: any,
  page = "1",
  lang = "en"
) => {
  try {
    let url = `/api/v1/contacts?type=career&page=${page}&per_page=10`;

    // Add filters if they exist
    if (filters.offers_name) {
      url += `&offers_name=${encodeURIComponent(filters.offers_name)}`;
    }
    if (filters.address) {
      url += `&address=${encodeURIComponent(filters.address)}`;
    }

    const response = await apis.get(url, {
      headers: {
        "Accept-Language": lang,
      },
    });

    return response.data;
  } catch (error) {
    console.error("API Filter Error:", error);
    throw error;
  }
};
/////// users
export async function getContactUsGeneral(lang: any) {
  let res = await apis.get(`api/v1/contacts?type=general`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function getContactUsGeneralPanigation(page: any, lang: any) {
  let res = await apis.get(
    `api/v1/contacts?type=general&page=${page}&per_page=10`,
    {
      headers: { "Accept-Language": lang },
    }
  );
  if (res) return res.data;
  else return false;
}
export async function SearchContactUsGeneral(id: any, lang: any) {
  let res = await apis.get(`api/v1/contacts?type=general&search=${id}`, {
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
