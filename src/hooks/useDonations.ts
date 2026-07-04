import { useMutation, useQuery } from "@tanstack/react-query";
import donationsApi, { CreateDonationOrderPayload } from "@/lib/api/donations";

export const useCreateDonationOrder = () => {
  return useMutation({
    mutationFn: (payload: CreateDonationOrderPayload) => donationsApi.createOrder(payload),
  });
};

export const useDonationStatus = (orderId: string | undefined, enabled = true) => {
  return useQuery({
    queryKey: ["donationStatus", orderId],
    queryFn: () => donationsApi.getStatus(orderId!),
    enabled: Boolean(orderId) && enabled,
    select: (response) => response.data,
  });
};

export const useDonations = () => {
  return useQuery({
    queryKey: ["donations"],
    queryFn: () => donationsApi.getAll(),
    select: (response) => response.data || [],
  });
};
