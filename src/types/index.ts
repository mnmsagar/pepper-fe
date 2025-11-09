export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  roles: UserRole[];
  createdAt: Date;
  type: 'admin' | 'partner' | 'member';
}

export interface UserRole {
  role: 'admin' | 'admin_employee' | 'partner' | 'partner_employee' | 'member';
  userId: string;
}

export interface Partner {
  id: string;
  userId: string;
  companyName: string;
  walletBalance: number;
  kycStatus: 'pending' | 'approved' | 'rejected';
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
  type: 'earn' | 'redeem' | 'purchase' | 'reward';
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
  category: 'cashback' | 'trip' | 'gift' | 'voucher';
  isActive: boolean;
  imageUrl?: string;
}

export interface Redemption {
  id: string;
  userId: string;
  rewardId: string;
  coinsCost: number;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  createdAt: Date;
  processedAt?: Date;
}

export interface RewardScheme {
   id: string;
  partner_id: string;
  name: string;
  description: string;
  conditions: string;
  coins_reward: number;
  is_active: boolean;
  category: 'purchase' | 'volume' | 'loyalty' | 'special';
  minimum_purchase?: number;
  valid_until?: string;
  usage_count: number;
  max_usage?: number;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  activeRole: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setActiveRole: (role: string) => void;
  isAuthenticated: boolean;
}