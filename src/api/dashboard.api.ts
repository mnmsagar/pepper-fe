import { apiClient } from "./client";

export const adminDashboardData = async () => {
  const response = await apiClient.get("/admin/dashboard");
  console.log("API Response:", response);
  return response.data;
};
