import getApiClient, { ApiResponse } from "./client";

export type DonationPaymentStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "USER_DROPPED"
  | "CANCELLED";

export interface CreateDonationOrderPayload {
  donor_name: string;
  donor_email?: string;
  donor_phone: string;
  amount: number;
  cause_id?: string;
}

export interface CreateDonationOrderResponse {
  id: string;
  order_id: string;
  amount: number;
  donor_name: string;
  payment_status: DonationPaymentStatus;
}

export interface DonationStatus {
  id: string;
  order_id: string;
  donor_name?: string | null;
  amount: number;
  payment_status: DonationPaymentStatus;
  donor_number?: number | null;
  cause_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Donation extends DonationStatus {
  donor_email?: string | null;
  donor_phone?: string | null;
}

const donationsApi = {
  createOrder: async (
    payload: CreateDonationOrderPayload,
  ): Promise<ApiResponse<CreateDonationOrderResponse>> => {
    const api = getApiClient();
    const response = await api.post<ApiResponse<CreateDonationOrderResponse>>(
      "/donations/create-order",
      payload,
    );
    return response.data;
  },

  getStatus: async (orderId: string): Promise<ApiResponse<DonationStatus>> => {
    const api = getApiClient();
    const response = await api.get<ApiResponse<DonationStatus>>(
      `/donations/${encodeURIComponent(orderId)}/status`,
    );
    return response.data;
  },

  getAll: async (): Promise<ApiResponse<Donation[]>> => {
    const api = getApiClient();
    const response = await api.get<ApiResponse<Donation[]>>("/donations");
    return response.data;
  },
};

export default donationsApi;
