/**
 * hooks/useCauseCategories.ts
 *
 * React-Query hooks for cause_categories CRUD.
 * Drop into src/hooks/ alongside useCauses.ts.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import causeCategoriesApi, { CauseCategoryPayload } from "@/lib/api/causeCategories";

const QUERY_KEY = ["cause-categories"] as const;

/** Fetch all categories */
export const useCauseCategories = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await causeCategoriesApi.getAll();
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 min
  });

/** Create a new category */
export const useCreateCauseCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CauseCategoryPayload) => causeCategoriesApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};

/** Update an existing category */
export const useUpdateCauseCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CauseCategoryPayload }) =>
      causeCategoriesApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};

/** Delete a category */
export const useDeleteCauseCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => causeCategoriesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};
