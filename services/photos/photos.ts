import { apis } from "../axios";

export async function getPhotos(lang: any) {
  let res = await apis.get(`api/v1/photos`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}

export async function getPhotosPagination(page: any, lang: any) {
  let res = await apis.get(`api/v1/photos?page=${page}&per_page=12`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}

export async function CreatePhoto(data: any, lang: any) {
  let res = await apis.post(`api/v1/photos`, data, {
    headers: {
      "Accept-Language": lang,
      "Content-Type": "multipart/form-data",
    },
  });
  if (res) return res.data;
  else return false;
}

export async function DeletePhoto(id: any, lang: any) {
  let res = await apis.delete(`api/v1/photos/${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
