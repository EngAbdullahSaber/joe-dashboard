"use client";

import axios from "axios";
import { getHeaderConfig, clearAuthInfo } from "./utils";
import { baseUrl } from "./app.config";

export let apis = axios.create({
  baseURL: baseUrl,
  timeout: 100000,
  headers: getHeaderConfig().headers,
});

function attachInterceptors(instance) {
  instance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response?.status == 401) {
        clearAuthInfo();
        const lang = window.location.pathname.split("/")[1] || "en";
        window.location.href = `/${lang}/auth/login`;
      }
      return Promise.reject(error);
    },
  );
}

attachInterceptors(apis);

export function updateAxiosHeader() {
  apis = axios.create({
    baseURL: baseUrl,
    timeout: 100000,
    headers: getHeaderConfig().headers,
  });

  attachInterceptors(apis);
}
