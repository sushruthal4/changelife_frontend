export { createApiClient, getApiClient, getApiErrorMessage } from './client';
export { default as apiClient } from './client';
export type { ApiResponse } from './client';

export { default as authApi } from './auth';
export type { LoginRequest, LoginResponse, Setup2FARequest, Setup2FAResponse } from './auth';

export { default as usersApi } from './users';
export type { User, UserPayload } from './users';

export { default as causesApi } from './causes';
export type { Cause, CausePayload } from './causes';

export { default as siteContentApi } from './siteContent';
export type { SiteContentData, SiteContentPayload, SiteContentRecord } from './siteContent';

export { default as paymentSettingsApi } from './paymentSettings';
export type { PaymentSetting, PaymentSettingPayload } from './paymentSettings';

export { default as donationsApi } from './donations';
export type {
  CreateDonationOrderPayload,
  CreateDonationOrderResponse,
  Donation,
  DonationPaymentStatus,
  DonationStatus,
} from './donations';

export { default as dashboardApi } from './dashboard';
export type { DashboardMetrics } from './dashboard';
