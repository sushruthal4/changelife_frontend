import getApiClient, { ApiResponse } from "./client";

export interface DashboardMetrics {
  total_donations: number;
  total_amount: number;
  today_amount: number;
  successful_payments: number;
  failed_payments: number;
  pending_payments: number;
}

const dashboardApi = {
  get: async (): Promise<ApiResponse<DashboardMetrics>> => {
    const api = getApiClient();
    const response = await api.get<ApiResponse<DashboardMetrics>>("/dashboard");
    return response.data;
  },
};

export default dashboardApi;
