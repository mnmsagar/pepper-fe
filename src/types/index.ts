export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  roles: UserRole[];
  createdAt: Date;
  type: "admin" | "partner" | "member";
}

export interface UserRole {
  role: "admin" | "admin_employee" | "partner" | "partner_employee" | "member";
  userId: string;
}

export interface Partner {
  id: string;
  userId: string;
  companyName: string;
  walletBalance: number;
  kycStatus: "pending" | "approved" | "rejected";
  totalCoinsDistributed: number;
  createdAt: Date;
}

export interface Member {
  id: string;
  userId: string;
  coinBalance: number;
  totalCoinsEarned: number;
  totalCoinsRedeemed: number;
  demographics?: string;
  eventRegistrations: string[];
}

export interface CoinTransaction {
  id: string;
  fromUserId?: string;
  toUserId: string;
  amount: number;
  type: "earn" | "redeem" | "purchase" | "reward";
  description: string;
  partnerId?: string;
  schemeId?: string;
  createdAt: Date;
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  coinsCost: number;
  category: "cashback" | "trip" | "gift" | "voucher";
  isActive: boolean;
  imageUrl?: string;
}

export interface Redemption {
  id: string;
  userId: string;
  rewardId: string;
  coinsCost: number;
  status: "pending" | "approved" | "completed" | "rejected";
  createdAt: Date;
  processedAt?: Date;
}

export interface RewardScheme {
  id: number;
  userId: number; // partner_id → userId for clarity
  name: string;
  description: string;
  conditions: string;
  coinReward: number;
  category: "purchase" | "volume" | "loyalty" | "special";
  isActivated: boolean;
  minimumPurchase: number;
  maxRedemptions: number;
  startDate: string;
  endDate: string;
  usageCount: number;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  activeRole: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setActiveRole: (role: string) => void;
  isAuthenticated: boolean;
}
