import { apis } from "../axios";

export async function getPartner(lang: any) {
  let res = await apis.get(`api/v1/pages/home-page`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function getPartnerPanigation(page: any, lang: any) {
  let res = await apis.get(`api/v1/pages/home-page?page=${page}&per_page=10`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function SearchPartner(id: any, lang: any) {
  let res = await apis.get(`api/v1/pages/home-page?search=${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function DeletePartner(index: number, lang: any) {
  try {
    // 1. First get the current page data
    const currentPage = await apis.get(`api/v1/pages/home-page`, {
      headers: { "Accept-Language": lang },
    });

    // 2. Find the sec3 section
    const sec3 = currentPage.data.sections.find((s: any) => s.id === "sec3");

    // 3. Create a new list without the item at the specified index
    const updatedList = [
      ...sec3.list.slice(0, index),
      ...sec3.list.slice(index + 1),
    ];

    // 4. Update the section with the new list
    const res = await apis.put(
      `api/v1/pages/45/sections/sec3`,
      {
        list: updatedList,
      },
      {
        headers: {
          "Accept-Language": lang,
          "content-type": "application/json",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error updating partner list:", error);
    return false;
  }
}
export async function CreatePartners(data: any, lang: any) {
  let res = await apis.post(`api/v1/pages/home-page`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function UpdatePartners(data: any, id: any, lang: any) {
  let res = await apis.patch(`api/v1/partners/${id}`, data, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
