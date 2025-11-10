import React, { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import {
  Wallet,
  Gift,
  BarChart3,
  Settings,
  CreditCard,
  QrCode,
  History,
  Target,
  X,
} from "lucide-react";
// import Header from '../common/Header';
import StatsCard from "../common/StatsCard";
import CoinPurchase from "./CoinPurchase";
import RewardDistribution from "./RewardDistribution";
import PartnerAnalytics from "./PartnerAnalytics";
import SchemeManagement from "./SchemeManagement";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../common/Header";
import { useDashboard } from "../../hooks/partner/useDashboard";

const PartnerDashboard: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  console.log("user", user);

  const { data, isLoading, error } = useDashboard();

  // const partnerData = {
  //   partners: [
  //     {
  //       id: 201,
  //       user_id: 60,
  //       company_name: "TechWave Solutions",
  //       wallet_balance: 12500,
  //       kyc_status: "Verified",
  //       total_coins_distributed: 85000,
  //       created_at: "2024-11-20T09:30:00Z",
  //     },
  //   ],
  //   transactions: [
  //     {
  //       id: 9001,
  //       partner_id: 201,
  //       type: "Distribution",
  //       amount: 5000,
  //       description: "Coins distributed to members for referral program",
  //       created_at: "2025-02-15T11:00:00Z",
  //     },
  //     {
  //       id: 9002,
  //       partner_id: 201,
  //       type: "Top-Up",
  //       amount: 10000,
  //       description: "Wallet recharged by admin",
  //       created_at: "2025-03-10T14:30:00Z",
  //     },
  //   ],
  //   schemes: [
  //     {
  //       id: 3001,
  //       partner_id: 201,
  //       name: "New Year Bonus Scheme",
  //       description: "Extra 20% coins for new members joining before Jan 2025.",
  //       start_date: "2024-12-25T00:00:00Z",
  //       end_date: "2025-01-10T23:59:59Z",
  //       status: "Completed",
  //     },
  //     {
  //       id: 3002,
  //       partner_id: 201,
  //       name: "Loyalty Booster",
  //       description: "10% bonus coins for existing users completing all tasks.",
  //       start_date: "2025-03-01T00:00:00Z",
  //       end_date: "2025-04-15T23:59:59Z",
  //       status: "Active",
  //     },
  //   ],
  // };

  // const { partners, transactions, schemes } = useData();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // const currentPartner = partners.find((p) => p.user_id === user?.id);
  // const partnerTransactions = transactions.filter(
  //   (t) => t.partner_id === currentPartner?.id
  // );
  // const partnerSchemes = schemes.filter(
  //   (s) => s.partner_id === currentPartner?.id
  // );

  // Map DataContext partner shape to app Partner type when needed by child pages
  // const mappedPartner = currentPartner
  //   ? {
  //       id: currentPartner.id,
  //       userId: currentPartner.user_id,
  //       companyName: currentPartner.company_name,
  //       walletBalance: currentPartner.wallet_balance,
  //       kycStatus: currentPartner.kyc_status,
  //       totalCoinsDistributed: currentPartner.total_coins_distributed,
  //       createdAt: new Date(currentPartner.created_at),
  //     }
  //   : null;

  const { partners, transactions, schemes } = partnerData;

  const currentPartner = partners.find((p) => p.user_id === user?.id);
  // const partnerTransactions = transactions.filter(
  //   (t) => t.partner_id === currentPartner?.id
  // );
  // const partnerSchemes = schemes.filter(
  //   (s) => s.partner_id === currentPartner?.id
  // );

  // const mappedPartner = partners
  //   ? {
  //       id: 200,
  //       userId: user?.id || 0,
  //       companyName: "iCubes",
  //       walletBalance: 100,
  //       kycStatus: true,
  //       totalCoinsDistributed: 2000,
  //       createdAt: new Date(),
  //     }
  //   : null;

  const isActivePath = (path: string) => {
    if (path === "/partner" && location.pathname === "/partner") return true;
    return location.pathname.startsWith(path) && path !== "/partner";
  };

  const navigation = [
    { name: "Overview", href: "/partner", icon: BarChart3 },
    { name: "Buy Coins", href: "/partner/buy-coins", icon: CreditCard },
    { name: "Reward Schemes", href: "/partner/schemes", icon: Target },
    { name: "Reward Customers", href: "/partner/reward", icon: Gift },
    { name: "Analytics", href: "/partner/analytics", icon: BarChart3 },
    { name: "Settings", href: "/partner/settings", icon: Settings },
  ];

  // if (!currentPartner) {
  //   return (
  //     <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg-primary flex items-center justify-center p-4">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold text-neutral-900 dark:text-dark-text-primary mb-2">
  //           Partner Profile Not Found
  //         </h2>
  //         <p className="text-neutral-600 dark:text-dark-text-secondary">
  //           Please contact admin to set up your partner account.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  const activeSchemes = partnerSchemes.filter((s) => s.is_active).length;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg-primary transition-colors duration-200">
      <Header
        title="Partner Dashboard"
        subtitle={`Welcome back, ${currentPartner?.company_name}`}
        onMenuToggle={() => setSidebarOpen(true)}
        showMenuButton={true}
      />

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-dark-bg-primary shadow-xl transform transition-transform duration-300 ease-in-out">
              <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-dark-border-primary">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary">
                  Menu
                </h2>
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
                            ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 border-r-2 border-primary-700 dark:border-primary-400"
                            : "text-neutral-600 dark:text-dark-text-secondary hover:text-neutral-900 dark:hover:text-dark-text-primary hover:bg-neutral-50 dark:hover:bg-dark-bg-secondary"
                        }`}
                      >
                        <Icon
                          className={`mr-3 h-5 w-5 ${
                            isActivePath(item.href)
                              ? "text-primary-500 dark:text-primary-400"
                              : "text-neutral-400 dark:text-dark-text-tertiary group-hover:text-neutral-500 dark:group-hover:text-dark-text-secondary"
                          }`}
                        />
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
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 border-r-2 border-primary-700 dark:border-primary-400"
                        : "text-neutral-600 dark:text-dark-text-secondary hover:text-neutral-900 dark:hover:text-dark-text-primary hover:bg-neutral-50 dark:hover:bg-dark-bg-secondary"
                    }`}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 ${
                        isActivePath(item.href)
                          ? "text-primary-500 dark:text-primary-400"
                          : "text-neutral-400 dark:text-dark-text-tertiary group-hover:text-neutral-500 dark:group-hover:text-dark-text-secondary"
                      }`}
                    />
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
            <Route
              path="/"
              element={
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {data?.data?.walletBalance && (
                      <StatsCard
                        title="Wallet Balance"
                        value={data?.data?.walletBalance}
                        icon={Wallet}
                        color="success"
                      />
                    )}
                    {data?.data?.totalCoinsDistributed && (
                      <StatsCard
                        title="Coins Distributed"
                        value={data?.data?.totalCoinsDistributed}
                        icon={Gift}
                        color="secondary"
                      />
                    )}
                    <StatsCard
                      title="Active Schemes"
                      value={data?.data?.activeSchemes}
                      icon={Target}
                      color="primary"
                    />
                    <StatsCard
                      title="Total Transactions"
                      value={data?.data?.totalTransactions}
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
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-2">
                              Buy Coins
                            </h3>
                            <p className="text-neutral-600 dark:text-dark-text-secondary text-sm sm:text-base">
                              Purchase coins to reward your customers
                            </p>
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
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-2">
                              Manage Schemes
                            </h3>
                            <p className="text-neutral-600 dark:text-dark-text-secondary text-sm sm:text-base">
                              Create and manage reward schemes
                            </p>
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
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-2">
                              Reward Customers
                            </h3>
                            <p className="text-neutral-600 dark:text-dark-text-secondary text-sm sm:text-base">
                              Distribute coins using schemes
                            </p>
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
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-4">
                        Recent Transactions
                      </h3>
                      <div className="space-y-3">
                        {data?.data?.recentTransactions?.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-dark-bg-tertiary rounded-lg"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-neutral-900 dark:text-dark-text-primary truncate">
                                {transaction.availableBalance}
                              </p>
                              <p className="text-sm text-neutral-600 dark:text-dark-text-secondary">
                                {/* {transaction.date} */}
                                Available Balance
                              </p>
                            </div>
                            <div className="text-right ml-4">
                              <p className="font-semibold text-secondary-600 dark:text-secondary-400">
                                {transaction.amount} coins
                              </p>
                              <p className="text-sm text-neutral-500 dark:text-dark-text-tertiary capitalize">
                                {transaction.type}
                              </p>
                            </div>
                          </div>
                        ))}
                        {data?.data?.recentTransactions === 0 && (
                          <p className="text-neutral-500 dark:text-dark-text-tertiary text-center py-4">
                            No transactions yet
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Top Performing Schemes */}
                    <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 transition-colors duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary">
                          Top Performing Schemes
                        </h3>
                        <Link
                          to="/partner/schemes"
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
                        >
                          View All
                        </Link>
                      </div>
                      <div className="space-y-3">
                        {data?.data?.topPerformingSchemes?.map((scheme) => (
                          <div
                            key={scheme.id}
                            className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-dark-bg-tertiary rounded-lg"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-neutral-900 dark:text-dark-text-primary truncate">
                                {scheme?.name}
                              </p>
                              <p className="text-sm text-neutral-600 dark:text-dark-text-secondary">
                                {scheme?.coinsDistributed} coins per use
                              </p>
                            </div>
                            <div className="text-right ml-4">
                              <p className="font-semibold text-primary-600 dark:text-primary-400">
                                {scheme?.numberOfUsers}
                              </p>
                              <p className="text-sm text-neutral-500 dark:text-dark-text-tertiary">
                                uses
                              </p>
                            </div>
                          </div>
                        ))}
                        {data?.data?.topPerformingSchemes.length === 0 && (
                          <div className="text-center py-4">
                            <p className="text-neutral-500 dark:text-dark-text-tertiary mb-2">
                              No schemes created yet
                            </p>
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
              }
            />
            <Route
              path="/buy-coins"
              element={
                mappedPartner ? <CoinPurchase partner={mappedPartner} /> : null
              }
            />
            <Route
              path="/schemes"
              element={
                mappedPartner ? (
                  <SchemeManagement partner={mappedPartner} />
                ) : null
              }
            />
            <Route
              path="/reward"
              element={
                mappedPartner ? (
                  <RewardDistribution partner={mappedPartner} />
                ) : null
              }
            />
            <Route
              path="/analytics"
              element={
                mappedPartner ? (
                  <PartnerAnalytics partner={mappedPartner} />
                ) : null
              }
            />
            <Route
              path="/settings"
              element={
                <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-6 transition-colors duration-200">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-4">
                    Partner Settings
                  </h3>
                  <p className="text-neutral-600 dark:text-dark-text-secondary">
                    Settings panel coming soon...
                  </p>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
