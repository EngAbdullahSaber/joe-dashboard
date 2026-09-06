import { apis } from "../axios";

function normalizePhoto(item: any) {
  return {
    id: item.id,
    name: item.name,
    alt: item.alt || "",
    photo_url: item.url || item.photo_url || "",
    created_at: item.created_at,
  };
}

export async function getPhotos(lang: any) {
  const res = await apis.get(`api/v1/images`, {
    params: { limit: 100, page: 1 },
    headers: { "Accept-Language": lang, "x-lang": lang },
  });
  const payload = res?.data;
  const items = Array.isArray(payload)
    ? payload
    : payload?.data || [];
  return items.map(normalizePhoto);
}

export async function getPhotosPagination(page: any, lang: any) {
  const res = await apis.get(`api/v1/images`, {
    params: { page, limit: 12 },
    headers: { "Accept-Language": lang, "x-lang": lang },
  });
  const payload = res?.data;
  const items = (Array.isArray(payload) ? payload : payload?.data || []).map(
    normalizePhoto
  );
  const total = payload?.countRecored ?? items.length;
  const limit = payload?.limit ?? 12;
  const current = payload?.page ?? page;
  return {
    data: items,
    meta: {
      total,
      page: current,
      limit,
      total_pages: Math.max(1, Math.ceil(total / limit) || 1),
    },
  };
}

export async function CreatePhoto(data: any, lang: any) {
  const res = await apis.post(`api/v1/images`, data, {
    headers: {
      "Accept-Language": lang,
      "x-lang": lang,
    },
  });
  return res?.data;
}

export async function DeletePhoto(id: any, lang: any) {
  const res = await apis.delete(`api/v1/images/${id}`, {
    headers: { "Accept-Language": lang, "x-lang": lang },
  });
  return res?.data;
}
