import { useQuery } from "@tanstack/react-query";
import { adminDashboardData } from "../../api/dashboard.api.ts";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["adminDashboard"],
    queryFn: adminDashboardData,
  });
};
