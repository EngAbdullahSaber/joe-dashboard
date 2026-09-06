"use client";

import { headerConfigKeyName } from "./app.config";

export function getHeaderConfig() {
  const hasStorage = typeof localStorage !== "undefined";
  const raw = hasStorage ? localStorage.getItem(headerConfigKeyName) : null;
  let token = null;
  if (raw) {
    try {
      token = JSON.parse(raw);
    } catch {
      token = null;
    }
  }

  return {
    headers: {
      Accept: "application/json",
      "Accept-Language": "en",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
}

export const storeTokenInLocalStorage = (token) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(headerConfigKeyName, JSON.stringify(token));
  }
};

export function getToken() {
  if (typeof localStorage !== "undefined") {
    return localStorage.getItem(headerConfigKeyName);
  }
  return null; // If localStorage is not available
}

export function clearAuthInfo() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(headerConfigKeyName);
  }
}

export function makeFilterString(filter_obj) {
  var filterString = "?";
  Object.keys(filter_obj).map(function (key) {
    if (filter_obj[key] != null) {
      filterString += key + "=" + filter_obj[key] + "&";
    } else {
      return false;
    }
  });

  return filterString;
}
