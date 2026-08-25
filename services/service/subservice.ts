import { apis } from "../axios";

export async function getSubservices(lang: any, params: Record<string, any> = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });
  const qs = query.toString();
  let res = await apis.get(`api/v1/subservices${qs ? `?${qs}` : ""}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}

export async function getSubservicesByServiceId(
  serviceId: any,
  lang: any,
  activeOnly = false
) {
  let res = await apis.get(
    `api/v1/services/${serviceId}/subservices${
      activeOnly ? "?activeOnly=true" : ""
    }`,
    {
      headers: { "Accept-Language": lang },
    }
  );
  if (res) return res.data;
  else return false;
}

export async function getSubserviceById(lang: any, id: any) {
  let res = await apis.get(`api/v1/subservices/${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}

export async function CreateSubservice(data: any, lang: any) {
  let res = await apis.post(`api/v1/subservices`, data, {
    headers: {
      "Accept-Language": lang,
      "Content-Type": "application/json",
    },
  });
  if (res) return res.data;
  else return false;
}

export async function UpdateSubservice(data: any, id: any, lang: any) {
  let res = await apis.patch(`api/v1/subservices/${id}`, data, {
    headers: {
      "Accept-Language": lang,
      "Content-Type": "application/json",
    },
  });
  if (res) return res.data;
  else return false;
}

export async function DeleteSubservice(id: any, lang: any) {
  let res = await apis.delete(`api/v1/subservices/${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}

export async function ReorderSubservices(items: any, lang: any) {
  let res = await apis.patch(
    `api/v1/subservices/reorder`,
    { items },
    {
      headers: {
        "Accept-Language": lang,
        "Content-Type": "application/json",
      },
    }
  );
  if (res) return res.data;
  else return false;
}
