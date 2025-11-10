import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrder } from "../../api/razorpay.api.ts";

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
