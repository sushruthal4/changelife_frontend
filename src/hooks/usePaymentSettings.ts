import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import paymentSettingsApi, {
  PaymentSettingPayload,
} from "@/lib/api/paymentSettings";

export const usePaymentSettings = () => {
  return useQuery({
    queryKey: ["paymentSettings"],
    queryFn: () => paymentSettingsApi.getAll(),
    select: (data) => data.data || [],
  });
};

export const usePaymentSettingById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["paymentSetting", id],
    queryFn: () => paymentSettingsApi.getById(id!),
    enabled: !!id,
    select: (data) => data.data?.[0],
  });
};

export const useCreatePaymentSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (setting: PaymentSettingPayload) => paymentSettingsApi.create(setting),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentSettings"] });
    },
  });
};

export const useUpdatePaymentSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PaymentSettingPayload> }) =>
      paymentSettingsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentSettings"] });
    },
  });
};

export const useDeletePaymentSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => paymentSettingsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentSettings"] });
    },
  });
};
