import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Coins, 
  Gift, 
  History, 
  User,
  Wallet,
  Star,
  TrendingUp,
  X
} from 'lucide-react';
import Header from '../common/Header';
import StatsCard from '../common/StatsCard';
import RewardsCatalog from './RewardsCatalog';
import TransactionHistory from './TransactionHistory';
import RedemptionHistory from './RedemptionHistory';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const MemberPortal: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { members, transactions, redemptions } = useData();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentMemberRaw = members.find(m => m.user_id === user?.id);
  const mappedMember = currentMemberRaw
    ? {
        id: currentMemberRaw.id,
        userId: currentMemberRaw.user_id,
        coinBalance: currentMemberRaw.coin_balance,
        totalCoinsEarned: currentMemberRaw.total_coins_earned,
        totalCoinsRedeemed: currentMemberRaw.total_coins_redeemed,
        demographics: currentMemberRaw.demographics,
        eventRegistrations: currentMemberRaw.event_registrations,
        createdAt: new Date(currentMemberRaw.created_at),
      }
    : null;
  const memberTransactions = transactions.filter(t => t.to_user_id === user?.id);
  const memberRedemptions = redemptions.filter(r => r.user_id === user?.id);

  const isActivePath = (path: string) => {
    if (path === '/member' && location.pathname === '/member') return true;
    return location.pathname.startsWith(path) && path !== '/member';
  };

  const navigation = [
    { name: 'Overview', href: '/member', icon: Coins },
    { name: 'Rewards Catalog', href: '/member/rewards', icon: Gift },
    { name: 'Transactions', href: '/member/transactions', icon: History },
    { name: 'Redemptions', href: '/member/redemptions', icon: Star },
    { name: 'Profile', href: '/member/profile', icon: User },
  ];

  if (!mappedMember) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg-primary flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-dark-text-primary mb-2">Member Profile Not Found</h2>
          <p className="text-neutral-600 dark:text-dark-text-secondary">Please contact support to set up your member account.</p>
        </div>
      </div>
    );
  }

  const recentTransactions = memberTransactions.slice(0, 3);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg-primary transition-colors duration-200">
      <Header 
        title="Member Portal" 
        subtitle={`Welcome back, ${user?.name}`}
        onMenuToggle={() => setSidebarOpen(true)}
        showMenuButton={true}
      />
      
      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
            <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-dark-bg-primary shadow-xl transform transition-transform duration-300 ease-in-out">
              <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-dark-border-primary">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary">Menu</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-dark-bg-secondary transition-colors"
                >
                  <X className="h-5 w-5 text-neutral-600 dark:text-dark-text-secondary" />
                </button>
              </div>
              <nav className="mt-6 px-4">
                <div className="space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors touch-manipulation ${
                          isActivePath(item.href)
                            ? 'bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400 border-r-2 border-success-700 dark:border-success-400'
                            : 'text-neutral-600 dark:text-dark-text-secondary hover:text-neutral-900 dark:hover:text-dark-text-primary hover:bg-neutral-50 dark:hover:bg-dark-bg-secondary'
                        }`}
                      >
                        <Icon className={`mr-3 h-5 w-5 ${
                          isActivePath(item.href) ? 'text-success-500 dark:text-success-400' : 'text-neutral-400 dark:text-dark-text-tertiary group-hover:text-neutral-500 dark:group-hover:text-dark-text-secondary'
                        }`} />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </nav>
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 bg-white dark:bg-dark-bg-primary border-r border-neutral-200 dark:border-dark-border-primary min-h-screen transition-colors duration-200">
          <nav className="mt-6 px-4">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActivePath(item.href)
                        ? 'bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400 border-r-2 border-success-700 dark:border-success-400'
                        : 'text-neutral-600 dark:text-dark-text-secondary hover:text-neutral-900 dark:hover:text-dark-text-primary hover:bg-neutral-50 dark:hover:bg-dark-bg-secondary'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${
                      isActivePath(item.href) ? 'text-success-500 dark:text-success-400' : 'text-neutral-400 dark:text-dark-text-tertiary group-hover:text-neutral-500 dark:group-hover:text-dark-text-secondary'
                    }`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6">
          <Routes>
            <Route path="/" element={
              <div className="space-y-6">
                {/* Coin Balance Hero */}
                <div className="bg-gradient-to-r from-success-600 to-success-500 rounded-xl p-6 sm:p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl sm:text-3xl font-bold mb-2">Your Coin Balance</h2>
                      <div className="flex items-baseline">
                        <span className="text-4xl sm:text-5xl font-bold">{mappedMember.coinBalance}</span>
                        <span className="text-lg sm:text-xl ml-2 text-success-100">coins</span>
                      </div>
                      <p className="text-success-100 mt-2 text-sm sm:text-base">
                        Total earned: {mappedMember.totalCoinsEarned} • Total redeemed: {mappedMember.totalCoinsRedeemed}
                      </p>
                    </div>
                    <div className="h-16 w-16 sm:h-24 sm:w-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center ml-4">
                      <Coins className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <StatsCard
                    title="Current Balance"
                    value={mappedMember.coinBalance}
                    icon={Wallet}
                    color="success"
                  />
                  <StatsCard
                    title="Total Earned"
                    value={mappedMember.totalCoinsEarned}
                    icon={TrendingUp}
                    color="primary"
                  />
                  <StatsCard
                    title="Total Redeemed"
                    value={mappedMember.totalCoinsRedeemed}
                    icon={Gift}
                    color="secondary"
                  />
                  <StatsCard
                    title="Redemptions"
                    value={memberRedemptions.length}
                    icon={Star}
                    color="warning"
                  />
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <Link to="/member/rewards" className="group">
                    <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 hover:shadow-medium transition-all touch-manipulation">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-2">Browse Rewards</h3>
                          <p className="text-neutral-600 dark:text-dark-text-secondary text-sm sm:text-base">Discover amazing rewards you can redeem</p>
                        </div>
                        <div className="h-12 w-12 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Gift className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link to="/member/transactions" className="group">
                    <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 hover:shadow-medium transition-all touch-manipulation">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-2">Transaction History</h3>
                          <p className="text-neutral-600 dark:text-dark-text-secondary text-sm sm:text-base">View all your coin transactions</p>
                        </div>
                        <div className="h-12 w-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <History className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 transition-colors duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary">Recent Activity</h3>
                    <Link to="/member/transactions" className="text-success-600 dark:text-success-400 hover:text-success-700 dark:hover:text-success-300 text-sm font-medium">
                      View All
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-dark-bg-tertiary rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-neutral-900 dark:text-dark-text-primary truncate">{transaction.description}</p>
                          <p className="text-sm text-neutral-600 dark:text-dark-text-secondary">{new Date(transaction.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className={`font-semibold ${
                            transaction.transaction_type === 'redeem' ? 'text-error-600 dark:text-error-400' : 'text-success-600 dark:text-success-400'
                          }`}>
                            {transaction.transaction_type === 'redeem' ? '-' : '+'}{transaction.amount} coins
                          </p>
                          <p className="text-sm text-neutral-500 dark:text-dark-text-tertiary capitalize">{transaction.transaction_type}</p>
                        </div>
                      </div>
                    ))}
                    {recentTransactions.length === 0 && (
                      <p className="text-neutral-500 dark:text-dark-text-tertiary text-center py-4">No recent activity</p>
                    )}
                  </div>
                </div>
              </div>
            } />
            <Route path="/rewards" element={mappedMember ? <RewardsCatalog member={mappedMember} /> : null} />
            <Route path="/transactions" element={<TransactionHistory memberId={user?.id || ''} />} />
            <Route path="/redemptions" element={<RedemptionHistory memberId={user?.id || ''} />} />
            <Route path="/profile" element={
              <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-6 transition-colors duration-200">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-4">Profile Settings</h3>
                <p className="text-neutral-600 dark:text-dark-text-secondary">Profile management coming soon...</p>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default MemberPortal;