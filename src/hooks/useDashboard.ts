import { useQuery } from "@tanstack/react-query";
import dashboardApi from "@/lib/api/dashboard";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dashboardApi.get(),
    select: (response) => response.data,
  });
};
