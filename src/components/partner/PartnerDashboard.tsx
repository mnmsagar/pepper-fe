import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Wallet, 
  Gift, 
  BarChart3,
  Settings,
  CreditCard,
  QrCode,
  History,
  Target,
  X
} from 'lucide-react';
import Header from '../common/Header';
import StatsCard from '../common/StatsCard';
import CoinPurchase from './CoinPurchase';
import RewardDistribution from './RewardDistribution';
import PartnerAnalytics from './PartnerAnalytics';
import SchemeManagement from './SchemeManagement';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const PartnerDashboard: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { partners, transactions, schemes } = useData();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentPartner = partners.find(p => p.user_id === user?.id);
  const partnerTransactions = transactions.filter(t => t.partner_id === currentPartner?.id);
  const partnerSchemes = schemes.filter(s => s.partner_id === currentPartner?.id);

  // Map DataContext partner shape to app Partner type when needed by child pages
  const mappedPartner = currentPartner
    ? {
        id: currentPartner.id,
        userId: currentPartner.user_id,
        companyName: currentPartner.company_name,
        walletBalance: currentPartner.wallet_balance,
        kycStatus: currentPartner.kyc_status,
        totalCoinsDistributed: currentPartner.total_coins_distributed,
        createdAt: new Date(currentPartner.created_at),
      }
    : null;

  const isActivePath = (path: string) => {
    if (path === '/partner' && location.pathname === '/partner') return true;
    return location.pathname.startsWith(path) && path !== '/partner';
  };

  const navigation = [
    { name: 'Overview', href: '/partner', icon: BarChart3 },
    { name: 'Buy Coins', href: '/partner/buy-coins', icon: CreditCard },
    { name: 'Reward Schemes', href: '/partner/schemes', icon: Target },
    { name: 'Reward Customers', href: '/partner/reward', icon: Gift },
    { name: 'Analytics', href: '/partner/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/partner/settings', icon: Settings },
  ];

  if (!currentPartner) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg-primary flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-dark-text-primary mb-2">Partner Profile Not Found</h2>
          <p className="text-neutral-600 dark:text-dark-text-secondary">Please contact admin to set up your partner account.</p>
        </div>
      </div>
    );
  }

  const activeSchemes = partnerSchemes.filter(s => s.is_active).length;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg-primary transition-colors duration-200">
      <Header 
        title="Partner Dashboard" 
        subtitle={`Welcome back, ${currentPartner.company_name}`}
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
                        className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                          isActivePath(item.href)
                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 border-r-2 border-primary-700 dark:border-primary-400'
                            : 'text-neutral-600 dark:text-dark-text-secondary hover:text-neutral-900 dark:hover:text-dark-text-primary hover:bg-neutral-50 dark:hover:bg-dark-bg-secondary'
                        }`}
                      >
                        <Icon className={`mr-3 h-5 w-5 ${
                          isActivePath(item.href) ? 'text-primary-500 dark:text-primary-400' : 'text-neutral-400 dark:text-dark-text-tertiary group-hover:text-neutral-500 dark:group-hover:text-dark-text-secondary'
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
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 border-r-2 border-primary-700 dark:border-primary-400'
                        : 'text-neutral-600 dark:text-dark-text-secondary hover:text-neutral-900 dark:hover:text-dark-text-primary hover:bg-neutral-50 dark:hover:bg-dark-bg-secondary'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${
                      isActivePath(item.href) ? 'text-primary-500 dark:text-primary-400' : 'text-neutral-400 dark:text-dark-text-tertiary group-hover:text-neutral-500 dark:group-hover:text-dark-text-secondary'
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
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <StatsCard
                    title="Wallet Balance"
                    value={`₹${currentPartner.wallet_balance.toLocaleString()}`}
                    icon={Wallet}
                    color="success"
                  />
                  <StatsCard
                    title="Coins Distributed"
                    value={currentPartner.total_coins_distributed.toLocaleString()}
                    icon={Gift}
                    color="secondary"
                  />
                  <StatsCard
                    title="Active Schemes"
                    value={activeSchemes}
                    icon={Target}
                    color="primary"
                  />
                  <StatsCard
                    title="Total Transactions"
                    value={partnerTransactions.length}
                    icon={History}
                    color="warning"
                  />
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <Link to="/partner/buy-coins" className="group">
                    <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 hover:shadow-medium transition-all touch-manipulation">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-2">Buy Coins</h3>
                          <p className="text-neutral-600 dark:text-dark-text-secondary text-sm sm:text-base">Purchase coins to reward your customers</p>
                        </div>
                        <div className="h-12 w-12 bg-gradient-to-r from-success-500 to-success-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <CreditCard className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link to="/partner/schemes" className="group">
                    <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 hover:shadow-medium transition-all touch-manipulation">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-2">Manage Schemes</h3>
                          <p className="text-neutral-600 dark:text-dark-text-secondary text-sm sm:text-base">Create and manage reward schemes</p>
                        </div>
                        <div className="h-12 w-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Target className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link to="/partner/reward" className="group">
                    <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 hover:shadow-medium transition-all touch-manipulation">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-2">Reward Customers</h3>
                          <p className="text-neutral-600 dark:text-dark-text-secondary text-sm sm:text-base">Distribute coins using schemes</p>
                        </div>
                        <div className="h-12 w-12 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <QrCode className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Recent Activity & Schemes Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Transactions */}
                  <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 transition-colors duration-200">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-4">Recent Transactions</h3>
                    <div className="space-y-3">
                      {partnerTransactions.slice(0, 5).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-dark-bg-tertiary rounded-lg">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-neutral-900 dark:text-dark-text-primary truncate">{transaction.description}</p>
                            <p className="text-sm text-neutral-600 dark:text-dark-text-secondary">{transaction.created_at}</p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="font-semibold text-secondary-600 dark:text-secondary-400">
                              {transaction.amount} coins
                            </p>
                            <p className="text-sm text-neutral-500 dark:text-dark-text-tertiary capitalize">{transaction.transaction_type}</p>
                          </div>
                        </div>
                      ))}
                      {partnerTransactions.length === 0 && (
                        <p className="text-neutral-500 dark:text-dark-text-tertiary text-center py-4">No transactions yet</p>
                      )}
                    </div>
                  </div>

                  {/* Top Performing Schemes */}
                  <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 transition-colors duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary">Top Performing Schemes</h3>
                      <Link to="/partner/schemes" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium">
                        View All
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {partnerSchemes
                        .sort((a, b) => b.usage_count - a.usage_count)
                        .slice(0, 3)
                        .map((scheme) => (
                        <div key={scheme.id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-dark-bg-tertiary rounded-lg">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-neutral-900 dark:text-dark-text-primary truncate">{scheme.name}</p>
                            <p className="text-sm text-neutral-600 dark:text-dark-text-secondary">{scheme.coins_reward} coins per use</p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="font-semibold text-primary-600 dark:text-primary-400">{scheme.usage_count}</p>
                            <p className="text-sm text-neutral-500 dark:text-dark-text-tertiary">uses</p>
                          </div>
                        </div>
                      ))}
                      {partnerSchemes.length === 0 && (
                        <div className="text-center py-4">
                          <p className="text-neutral-500 dark:text-dark-text-tertiary mb-2">No schemes created yet</p>
                          <Link
                            to="/partner/schemes"
                            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
                          >
                            Create your first scheme
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            } />
            <Route path="/buy-coins" element={mappedPartner ? <CoinPurchase partner={mappedPartner} /> : null} />
            <Route path="/schemes" element={mappedPartner ? <SchemeManagement partner={mappedPartner} /> : null} />
            <Route path="/reward" element={mappedPartner ? <RewardDistribution partner={mappedPartner} /> : null} />
            <Route path="/analytics" element={mappedPartner ? <PartnerAnalytics partner={mappedPartner} /> : null} />
            <Route path="/settings" element={
              <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-6 transition-colors duration-200">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-4">Partner Settings</h3>
                <p className="text-neutral-600 dark:text-dark-text-secondary">Settings panel coming soon...</p>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;