import getApiClient, { ApiResponse } from "./client";
import { normalizeUser, type User } from "./users";

export interface LoginRequest {
  email: string;
  token: string;
}

export type LoginResponse = ApiResponse<{
  user: User;
  token: string;
}>;

export interface Setup2FARequest {
  email: string;
}

export interface Setup2FAResponse {
  message: string;
  data: {
    secret: string;
    otpauth_url: string;
  };
}

export type VerifySetupResponse = ApiResponse<{
  token: string;
}>;

const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const api = getApiClient();
    const response = await api.post<LoginResponse>("/users/login", credentials);
    return {
      ...response.data,
      data: {
        ...response.data.data,
        user: normalizeUser(response.data.data.user),
      },
    };
  },

  setup2FA: async (payload: Setup2FARequest): Promise<Setup2FAResponse> => {
    const api = getApiClient();
    const response = await api.post<Setup2FAResponse>("/users/2fa/setup", payload);
    return response.data;
  },

  verify2FASetup: async (payload: LoginRequest): Promise<VerifySetupResponse> => {
    const api = getApiClient();
    const response = await api.post<VerifySetupResponse>("/users/2fa/verify-setup", payload);
    return response.data;
  },

  saveSession: (token: string, user: User) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("adminUser", JSON.stringify(user));
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("adminUser");
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem("adminUser");
    if (!user) return null;

    try {
      return normalizeUser(JSON.parse(user) as User);
    } catch {
      authApi.logout();
      return null;
    }
  },

  getAuthToken: (): string | null => {
    return localStorage.getItem("authToken");
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("authToken");
  },
};

export default authApi;
