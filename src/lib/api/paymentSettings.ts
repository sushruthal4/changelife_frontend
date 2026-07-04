import getApiClient, { ApiResponse } from "./client";

export interface PaymentSetting {
  id: string;
  payment_name: string;
  upi_id?: string | null;
  upi_payee_name?: string | null;
  qr_image?: string | null;
  bank_name?: string | null;
  account_name?: string | null;
  account_number?: string | null;
  ifsc_code?: string | null;
  branch_name?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type PaymentSettingPayload = Omit<PaymentSetting, "id" | "created_at" | "updated_at">;

const paymentSettingsApi = {
  getAll: async (): Promise<ApiResponse<PaymentSetting[]>> => {
    const api = getApiClient();
    const response = await api.get<ApiResponse<PaymentSetting[]>>("/payment-settings");
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<PaymentSetting[]>> => {
    const api = getApiClient();
    const response = await api.get<ApiResponse<PaymentSetting[]>>(`/payment-settings/${id}`);
    return response.data;
  },

  create: async (setting: PaymentSettingPayload): Promise<ApiResponse<PaymentSetting[]>> => {
    const api = getApiClient();
    const response = await api.post<ApiResponse<PaymentSetting[]>>("/payment-settings", setting);
    return response.data;
  },

  update: async (
    id: string,
    setting: Partial<PaymentSettingPayload>,
  ): Promise<ApiResponse<PaymentSetting[]>> => {
    const api = getApiClient();
    const response = await api.patch<ApiResponse<PaymentSetting[]>>(
      `/payment-settings/${id}`,
      setting,
    );
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const api = getApiClient();
    const response = await api.delete<ApiResponse<null>>(`/payment-settings/${id}`);
    return response.data;
  },
};

export default paymentSettingsApi;
