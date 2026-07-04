import getApiClient, { ApiResponse } from "./client";

export interface User {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  mobile?: string | null;
  role?: "admin" | "super_admin" | string;
  twoFactorEnabled?: boolean;
  twofactorenabled?: boolean;
  twoFactorSecret?: string | null;
  twofactorsecret?: string | null;
  is_active?: boolean;
  created_at?: string;
}

export type UserPayload = Partial<
  Pick<User, "first_name" | "last_name" | "mobile" | "role" | "twoFactorEnabled" | "is_active">
>;

export type CreateUserPayload = UserPayload & { email: string };

export function normalizeUser(user: User): User {
  const twoFactorEnabled = user.twoFactorEnabled ?? user.twofactorenabled ?? false;
  const { twoFactorSecret, twofactorsecret, ...safeUser } = user;

  return {
    ...safeUser,
    twoFactorEnabled,
  };
}

const usersApi = {
  getAll: async (): Promise<ApiResponse<User[]>> => {
    const api = getApiClient();
    const response = await api.get<ApiResponse<User[]>>("/users");
    return {
      ...response.data,
      data: (response.data.data || []).map(normalizeUser),
    };
  },

  create: async (payload: CreateUserPayload): Promise<ApiResponse<User>> => {
    const api = getApiClient();
    const response = await api.post<ApiResponse<User>>("/users", payload);
    return {
      ...response.data,
      data: normalizeUser(response.data.data as User),
    };
  },

  update: async (id: string, payload: UserPayload): Promise<ApiResponse<User[]>> => {
    const api = getApiClient();
    const response = await api.patch<ApiResponse<User[]>>(`/users/${id}`, payload);
    return {
      ...response.data,
      data: (response.data.data || []).map(normalizeUser),
    };
  },
};

export default usersApi;