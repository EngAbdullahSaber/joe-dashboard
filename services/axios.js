"use client";

import axios from "axios";
import { getHeaderConfig, clearAuthInfo } from "./utils";
import { baseUrl } from "./app.config";

export let apis = axios.create({
  baseURL: baseUrl,
  timeout: 100000,
  headers: getHeaderConfig().headers,
});

export function updateAxiosHeader() {
  apis = axios.create({
    baseURL: baseUrl,
    timeout: 100000,
    headers: getHeaderConfig().headers,
  });

  apis.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response.status == 401) {
        clearAuthInfo();
        window.location.reload(true);
      }
    }
  );
}
