import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Dummy data types
interface Partner {
  id: string;
  user_id: string;
  company_name: string;
  wallet_balance: number;
  kyc_status: 'pending' | 'approved' | 'rejected';
  total_coins_distributed: number;
  created_at: string;
  updated_at: string;
}

interface Member {
  id: string;
  user_id: string;
  coin_balance: number;
  total_coins_earned: number;
  total_coins_redeemed: number;
  demographics: any;
  event_registrations: string[];
  created_at: string;
  updated_at: string;
}

interface Employee {
  id: string;
  user_id: string;
  employer_id: string;
  employee_type: 'admin_employee' | 'partner_employee';
  permissions: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CoinTransaction {
  id: string;
  from_user_id?: string;
  to_user_id: string;
  amount: number;
  transaction_type: 'earn' | 'redeem' | 'purchase' | 'reward';
  description: string;
  partner_id?: string;
  scheme_id?: string;
  metadata: any;
  created_at: string;
}

interface RewardItem {
  id: string;
  title: string;
  description: string;
  coins_cost: number;
  category: 'cashback' | 'trip' | 'gift' | 'voucher';
  is_active: boolean;
  image_url?: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

interface Redemption {
  id: string;
  user_id: string;
  reward_id: string;
  coins_cost: number;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  processed_by?: string;
  processed_at?: string;
  metadata: any;
  created_at: string;
}

interface RewardScheme {
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

interface DataContextType {
  partners: Partner[];
  members: Member[];
  employees: Employee[];
  transactions: CoinTransaction[];
  rewards: RewardItem[];
  redemptions: Redemption[];
  schemes: RewardScheme[];
  loading: boolean;
  error: string | null;
  
  // Actions
  addTransaction: (transaction: Omit<CoinTransaction, 'id' | 'created_at'>) => Promise<void>;
  updatePartnerBalance: (partnerId: string, amount: number) => Promise<void>;
  updateMemberBalance: (memberId: string, amount: number) => Promise<void>;
  addRedemption: (redemption: Omit<Redemption, 'id' | 'created_at'>) => Promise<void>;
  addScheme: (scheme: Omit<RewardScheme, 'id' | 'created_at' | 'updated_at' | 'usage_count'>) => Promise<void>;
  updateScheme: (schemeId: string, updates: Partial<RewardScheme>) => Promise<void>;
  deleteScheme: (schemeId: string) => Promise<void>;
  incrementSchemeUsage: (schemeId: string) => Promise<void>;
  refreshData: () => Promise<void>;
  // Member management
  addMember: (member: Omit<Member, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateMember: (memberId: string, updates: Partial<Member>) => Promise<void>;
  deleteMember: (memberId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Dummy data
const DUMMY_PARTNERS: Partner[] = [
  {
    id: 'partner-1',
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    company_name: 'TechCorp Solutions',
    wallet_balance: 5000,
    kyc_status: 'approved',
    total_coins_distributed: 2500,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'partner-2',
    user_id: 'partner-user-2',
    company_name: 'Digital Innovations',
    wallet_balance: 3200,
    kyc_status: 'pending',
    total_coins_distributed: 1800,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z'
  }
];

const DUMMY_MEMBERS: Member[] = [
  {
    id: 'member-1',
    user_id: '550e8400-e29b-41d4-a716-446655440002',
    coin_balance: 450,
    total_coins_earned: 650,
    total_coins_redeemed: 200,
    demographics: {},
    event_registrations: [],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'member-2',
    user_id: 'member-user-2',
    coin_balance: 320,
    total_coins_earned: 420,
    total_coins_redeemed: 100,
    demographics: {},
    event_registrations: [],
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z'
  }
];

const DUMMY_TRANSACTIONS: CoinTransaction[] = [
  {
    id: 'tx-1',
    to_user_id: '550e8400-e29b-41d4-a716-446655440002',
    amount: 100,
    transaction_type: 'reward',
    description: 'Welcome bonus',
    created_at: '2024-01-01T00:00:00Z',
    metadata: {}
  },
  {
    id: 'tx-2',
    to_user_id: '550e8400-e29b-41d4-a716-446655440002',
    amount: 50,
    transaction_type: 'redeem',
    description: 'Redeemed gift card',
    created_at: '2024-01-02T00:00:00Z',
    metadata: {}
  }
];

const DUMMY_REWARDS: RewardItem[] = [
  {
    id: 'reward-1',
    title: '10% Cashback',
    description: 'Get 10% cashback up to ₹500',
    coins_cost: 100,
    category: 'cashback',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    metadata: {}
  },
  {
    id: 'reward-2',
    title: 'Goa Trip Voucher',
    description: '3 days 2 nights Goa trip for 2 people',
    coins_cost: 5000,
    category: 'trip',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    metadata: {}
  },
  {
    id: 'reward-3',
    title: 'Amazon Gift Card',
    description: '₹1000 Amazon gift card',
    coins_cost: 800,
    category: 'voucher',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    metadata: {}
  },
  {
    id: 'reward-4',
    title: 'Premium Headphones',
    description: 'Sony WH-1000XM4 Wireless Headphones',
    coins_cost: 2500,
    category: 'gift',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    metadata: {}
  }
];

const DUMMY_REDEMPTIONS: Redemption[] = [
  {
    id: 'redemption-1',
    user_id: '550e8400-e29b-41d4-a716-446655440002',
    reward_id: 'reward-1',
    coins_cost: 100,
    status: 'completed',
    created_at: '2024-01-01T00:00:00Z',
    metadata: {}
  },
  {
    id: 'redemption-2',
    user_id: '550e8400-e29b-41d4-a716-446655440002',
    reward_id: 'reward-3',
    coins_cost: 800,
    status: 'pending',
    created_at: '2024-01-02T00:00:00Z',
    metadata: {}
  }
];

const DUMMY_SCHEMES: RewardScheme[] = [
  {
    id: 'scheme-1',
    partner_id: 'partner-1',
    name: 'Bulk Purchase Reward',
    description: 'Get coins for bulk purchases',
    conditions: 'Purchase minimum ₹5000 worth of products',
    coins_reward: 100,
    is_active: true,
    category: 'purchase',
    minimum_purchase: 5000,
    usage_count: 25,
    max_usage: 100,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    metadata: {}
  },
  {
    id: 'scheme-2',
    partner_id: 'partner-1',
    name: 'Loyalty Bonus',
    description: 'Monthly loyalty bonus for regular customers',
    conditions: 'Make at least 3 purchases in a month',
    coins_reward: 50,
    is_active: true,
    category: 'loyalty',
    usage_count: 12,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    metadata: {}
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, currentUserRole } = useAuth();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [schemes, setSchemes] = useState<RewardScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('📊 DataContext: Auth state changed', { user: user?.email, role: currentUserRole?.role });
    if (user && currentUserRole) {
      refreshData();
    } else {
      console.log('📊 DataContext: No user or role, skipping data fetch');
      setLoading(false);
    }
  }, [user, currentUserRole]);

  const refreshData = async () => {
    if (!user || !currentUserRole) {
      console.log('📊 DataContext: No user or role for data refresh');
      return;
    }

    try {
      console.log('📊 DataContext: Starting dummy data refresh for', currentUserRole.role);
      setLoading(true);
      setError(null);
      
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Load dummy data based on role
      console.log('📊 DataContext: Loading dummy rewards...');
      setRewards(DUMMY_REWARDS);
      
      if (currentUserRole.role === 'admin' || currentUserRole.role === 'admin_employee') {
        console.log('📊 DataContext: Loading admin dummy data...');
        setPartners(DUMMY_PARTNERS);
        setMembers(DUMMY_MEMBERS);
        setEmployees([]);
        setTransactions(DUMMY_TRANSACTIONS);
        setRedemptions(DUMMY_REDEMPTIONS);
        setSchemes(DUMMY_SCHEMES);
        
        console.log('✅ DataContext: Admin dummy data loaded:', {
          partners: DUMMY_PARTNERS.length,
          members: DUMMY_MEMBERS.length,
          transactions: DUMMY_TRANSACTIONS.length,
          redemptions: DUMMY_REDEMPTIONS.length,
          schemes: DUMMY_SCHEMES.length
        });

      } else if (currentUserRole.role === 'partner' || currentUserRole.role === 'partner_employee') {
        console.log('📊 DataContext: Loading partner dummy data...');
        const userPartners = DUMMY_PARTNERS.filter(p => p.user_id === user.id);
        const userSchemes = DUMMY_SCHEMES.filter(s => userPartners.some(p => p.id === s.partner_id));
        
        setPartners(userPartners);
        setMembers(DUMMY_MEMBERS);
        setEmployees([]);
        setTransactions(DUMMY_TRANSACTIONS);
        setRedemptions(DUMMY_REDEMPTIONS);
        setSchemes(userSchemes);
        
        console.log('✅ DataContext: Partner dummy data loaded');

      } else if (currentUserRole.role === 'member') {
        console.log('📊 DataContext: Loading member dummy data...');
        const userMembers = DUMMY_MEMBERS.filter(m => m.user_id === user.id);
        const userTransactions = DUMMY_TRANSACTIONS.filter(t => t.to_user_id === user.id);
        const userRedemptions = DUMMY_REDEMPTIONS.filter(r => r.user_id === user.id);
        
        setPartners(DUMMY_PARTNERS);
        setMembers(userMembers);
        setTransactions(userTransactions);
        setRedemptions(userRedemptions);
        setSchemes(DUMMY_SCHEMES.filter(s => s.is_active));
        
        console.log('✅ DataContext: Member dummy data loaded');
      }

      console.log('✅ DataContext: Dummy data refresh completed successfully');

    } catch (error) {
      console.error('❌ DataContext: Error loading dummy data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Mock implementations for actions
  const addTransaction = async (transaction: Omit<CoinTransaction, 'id' | 'created_at'>) => {
    console.log('📊 DataContext: Adding dummy transaction:', transaction);
    const newTransaction: CoinTransaction = {
      ...transaction,
      id: `tx-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updatePartnerBalance = async (partnerId: string, amount: number) => {
    console.log('📊 DataContext: Updating partner balance:', { partnerId, amount });
    setPartners(prev => prev.map(p => 
      p.id === partnerId 
        ? { ...p, wallet_balance: p.wallet_balance + amount }
        : p
    ));
  };

  const updateMemberBalance = async (memberId: string, amount: number) => {
    console.log('📊 DataContext: Updating member balance:', { memberId, amount });
    setMembers(prev => prev.map(m => 
      m.id === memberId 
        ? { ...m, coin_balance: m.coin_balance + amount }
        : m
    ));
  };

  const addRedemption = async (redemption: Omit<Redemption, 'id' | 'created_at'>) => {
    console.log('📊 DataContext: Adding dummy redemption:', redemption);
    const newRedemption: Redemption = {
      ...redemption,
      id: `redemption-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    setRedemptions(prev => [newRedemption, ...prev]);
  };

  const addScheme = async (scheme: Omit<RewardScheme, 'id' | 'created_at' | 'updated_at' | 'usage_count'>) => {
    console.log('📊 DataContext: Adding dummy scheme:', scheme);
    const newScheme: RewardScheme = {
      ...scheme,
      id: `scheme-${Date.now()}`,
      usage_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setSchemes(prev => [newScheme, ...prev]);
  };

  const updateScheme = async (schemeId: string, updates: Partial<RewardScheme>) => {
    console.log('📊 DataContext: Updating dummy scheme:', { schemeId, updates });
    setSchemes(prev => prev.map(s => 
      s.id === schemeId 
        ? { ...s, ...updates, updated_at: new Date().toISOString() }
        : s
    ));
  };

  const deleteScheme = async (schemeId: string) => {
    console.log('📊 DataContext: Deleting dummy scheme:', schemeId);
    setSchemes(prev => prev.filter(s => s.id !== schemeId));
  };

  const incrementSchemeUsage = async (schemeId: string) => {
    console.log('📊 DataContext: Incrementing scheme usage:', schemeId);
    setSchemes(prev => prev.map(s => 
      s.id === schemeId 
        ? { ...s, usage_count: s.usage_count + 1, updated_at: new Date().toISOString() }
        : s
    ));
  };

  // Member CRUD (dummy)
  const addMember = async (member: Omit<Member, 'id' | 'created_at' | 'updated_at'>) => {
    const newMember: Member = {
      ...member,
      id: `member-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Member;
    setMembers(prev => [newMember, ...prev]);
  };

  const updateMember = async (memberId: string, updates: Partial<Member>) => {
    setMembers(prev => prev.map(m => 
      m.id === memberId
        ? { ...m, ...updates, updated_at: new Date().toISOString() }
        : m
    ));
  };

  const deleteMember = async (memberId: string) => {
    setMembers(prev => prev.filter(m => m.id !== memberId));
  };

  const value: DataContextType = {
    partners,
    members,
    employees,
    transactions,
    rewards,
    redemptions,
    schemes,
    loading,
    error,
    addTransaction,
    updatePartnerBalance,
    updateMemberBalance,
    addRedemption,
    addScheme,
    updateScheme,
    deleteScheme,
    incrementSchemeUsage,
    refreshData,
    addMember,
    updateMember,
    deleteMember,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};