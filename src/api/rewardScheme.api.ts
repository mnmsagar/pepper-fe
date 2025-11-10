import { apiClient } from "./client";

// Create Reward Scheme
export const createRewardScheme = async ({
  name,
  category,
  isActivated = false,
  description,
  conditions,
  coinReward,
  minimumPurchase,
  startDate,
  endDate,
  maxRedemptions,
}: {
  name: string;
  category: string;
  isActivated?: boolean;
  description: string;
  conditions: string;
  coinReward: number;
  minimumPurchase: number;
  startDate: string; // ISO string format (YYYY-MM-DD)
  endDate: string; // ISO string format
  maxRedemptions: number;
}) => {
  try {
    const response = await apiClient.post(
      "/partner/rewardschemes",
      {
        name,
        category,
        isActivated,
        description,
        conditions,
        coinReward,
        minimumPurchase,
        startDate,
        endDate,
        maxRedemptions,
      },
      { withCredentials: true } // 👈 Important since you're using cookies for token
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error creating reward scheme:",
      error.response?.data || error.message
    );
    throw error;
  }
};
