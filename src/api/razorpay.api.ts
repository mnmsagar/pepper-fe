import { apiClient } from "./client";

export const createOrder = async ({
  amount,
  coins,
}: {
  amount: number;
  coins: number;
}) => {
  const response = await apiClient.post("/partner/razorpay/create-order", {
    amount,
    coins,
  });
  return response.data;
};

export const verifyPayment = async ({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}) => {
  const response = await apiClient.post("/partner/razorpay/verify-payment", {
    orderId,
    paymentId,
    signature,
  });
  return response.data;
};

export const updateOrder = async ({
  razorpayOrderId,
  razorpayPaymentId,
}: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
}) => {
  const response = await apiClient.post("/partner/razorpay/update-order", {
    razorpayOrderId,
    razorpayPaymentId,
  });
  return response.data;
};
