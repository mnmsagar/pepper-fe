import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRewardScheme } from "../../api/rewardScheme.api.ts";

export const useCreateScheme = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRewardScheme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewardSchemes"] });
    },
  });
};
