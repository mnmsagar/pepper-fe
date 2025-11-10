import { useQuery } from "@tanstack/react-query";
import { partnerDashboardData } from "../../api/dashboard.api.ts";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["partnerDashboard"],
    queryFn: partnerDashboardData,
  });
};
