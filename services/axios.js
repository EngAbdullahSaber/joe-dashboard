"use client";

import axios from "axios";
import { getHeaderConfig, clearAuthInfo } from "./utils";
import { baseUrl, headerConfigKeyName } from "./app.config";

export let apis = axios.create({
  baseURL: baseUrl,
  timeout: 100000,
  headers: getHeaderConfig().headers,
});

function attachInterceptors(instance) {
  instance.interceptors.request.use(function (config) {
    if (typeof localStorage !== "undefined") {
      const raw = localStorage.getItem(headerConfigKeyName);
      if (raw) {
        config.headers["Authorization"] = `Bearer ${JSON.parse(raw)}`;
      }
    }
    return config;
  });

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
