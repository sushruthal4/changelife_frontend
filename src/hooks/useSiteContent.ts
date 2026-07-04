import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import siteContentApi, { SiteContentData } from "@/lib/api/siteContent";

export const useSiteContent = () => {
  return useQuery({
    queryKey: ["siteContent"],
    queryFn: () => siteContentApi.getMain(),
    select: (data) => data.data?.[0] || null,
  });
};

export const useCreateSiteContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: SiteContentData) => siteContentApi.create(content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siteContent"] });
    },
  });
};

export const useUpdateSiteContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: SiteContentData) => siteContentApi.update(content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siteContent"] });
    },
  });
};

export const useDeleteSiteContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => siteContentApi.delete(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siteContent"] });
    },
  });
};
