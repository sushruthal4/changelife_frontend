import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

const defaultApiOrigin = "https://heart-fuel-api.heart-fuel.workers.dev";
const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || defaultApiOrigin;

function normalizeApiBaseUrl(value: string) {
  const trimmed = value.replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
}

export const API_BASE_URL = normalizeApiBaseUrl(rawApiBaseUrl);

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

type ErrorBody = {
  message?: string;
  error?: string;
};

let api: AxiosInstance;

function getStoredToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}

function isAuthRoute(url?: string) {
  return Boolean(
    url?.includes("/users/login") ||
      url?.includes("/users/2fa/setup") ||
      url?.includes("/users/2fa/verify-setup"),
  );
}

export function getApiErrorMessage(error: unknown, fallback = "API request failed") {
  if (axios.isAxiosError<ErrorBody>(error)) {
    return error.response?.data?.message || error.response?.data?.error || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export const createApiClient = (): AxiosInstance => {
  api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getStoredToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ErrorBody>) => {
      const shouldRedirect =
        error.response?.status === 401 && getStoredToken() && !isAuthRoute(error.config?.url);

      if (shouldRedirect && typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("adminUser");
        window.location.href = "/admin/login";
      }

      return Promise.reject(error);
    },
  );

  return api;
};

export const getApiClient = (): AxiosInstance => {
  if (!api) {
    createApiClient();
  }
  return api;
};

export default getApiClient;
