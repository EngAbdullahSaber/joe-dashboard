import { apis } from "../axios";

export async function getProducts(lang: any) {
  let res = await apis.get(`resources/product`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}

export async function getProductsPanigation(page: any, lang: any) {
  let res = await apis.get(`resources/product?page=${page}&per_page=10`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function SearchProducts(id: any, lang: any) {
  let res = await apis.get(`resources/product`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function getSpecifiedProducts(lang: any, id: any) {
  let res = await apis.get(`resources/product/${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function UpdateProducts(data: any, id: any, lang: any) {
  let res = await apis.patch(`product/${id}`, data, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateProducts(data: any, lang: any) {
  let res = await apis.post(`product`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function DeleteProducts(id: any, lang: any) {
  let res = await apis.delete(`resources/product/${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
export async function getOrderProducts(lang: any) {
  let res = await apis.get(`resources/productQuestion`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}

export async function getOrderProductsPanigation(page: any, lang: any) {
  let res = await apis.get(
    `resources/productQuestion?page=${page}&per_page=10`,
    {
      headers: { "Accept-Language": lang },
    }
  );
  if (res) return res.data;
  else return false;
}
export async function DeleteOrderProducts(id: any, lang: any) {
  let res = await apis.delete(`resources/productQuestion/${id}`, {
    headers: { "Accept-Language": lang },
  });
  if (res) return res.data;
  else return false;
}
