import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "../../api/razorpay.api.ts";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
