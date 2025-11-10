import { apiClient } from "./client";

export const createOrder = async (amount: number) => {
  const response = await apiClient.post("/partner/razorpay/create-order", {
    amount,
  });
  return response.data;
};
