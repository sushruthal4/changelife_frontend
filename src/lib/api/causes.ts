import getApiClient, { ApiResponse } from "./client";

export interface Cause {
  id: string;
  title: string;
  full_description?: string | null;
  target_amount: number;
  category?: string | null;
  images: string[];
  videos: string[];
  is_featured: boolean;
  is_active: boolean;
  created_at?: string;
}

export type CausePayload = Omit<Cause, "id" | "created_at">;

const causesApi = {
  getAll: async (): Promise<ApiResponse<Cause[]>> => {
    const api = getApiClient();
    const response = await api.get<ApiResponse<Cause[]>>("/causes");
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Cause[]>> => {
    const api = getApiClient();
    const response = await api.get<ApiResponse<Cause[]>>(`/causes/${id}`);
    return response.data;
  },

  create: async (cause: CausePayload): Promise<ApiResponse<Cause[]>> => {
    const api = getApiClient();
    const response = await api.post<ApiResponse<Cause[]>>("/causes", cause);
    return response.data;
  },

  update: async (id: string, cause: Partial<CausePayload>): Promise<ApiResponse<Cause[]>> => {
    const api = getApiClient();
    const response = await api.patch<ApiResponse<Cause[]>>(`/causes/${id}`, cause);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const api = getApiClient();
    const response = await api.delete<ApiResponse<null>>(`/causes/${id}`);
    return response.data;
  },
};

export default causesApi;
