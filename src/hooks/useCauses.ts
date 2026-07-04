import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import causesApi, { CausePayload } from "@/lib/api/causes";

export const useCauses = (filters?: {
  category?: string;
  featured?: boolean;
  active?: boolean;
}) => {
  return useQuery({
    queryKey: ["causes", filters],
    queryFn: () => causesApi.getAll(),
    select: (data) => {
      const causes = data.data || [];
      return causes.filter((cause) => {
        if (filters?.category && cause.category !== filters.category) return false;
        if (typeof filters?.featured === "boolean" && cause.is_featured !== filters.featured) {
          return false;
        }
        if (typeof filters?.active === "boolean" && cause.is_active !== filters.active) return false;
        return true;
      });
    },
  });
};

export const useCauseById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["cause", id],
    queryFn: () => causesApi.getById(id!),
    enabled: !!id,
    select: (data) => data.data?.[0],
  });
};

export const useCreateCause = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cause: CausePayload) => causesApi.create(cause),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["causes"] });
    },
  });
};

export const useUpdateCause = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CausePayload> }) =>
      causesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["causes"] });
    },
  });
};

export const useDeleteCause = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => causesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["causes"] });
    },
  });
};
