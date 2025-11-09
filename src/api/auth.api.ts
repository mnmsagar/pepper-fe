import { apiClient } from "./client";

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await apiClient.post("/users/login", { email, password });
  return response.data;
};
