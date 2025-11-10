import React, { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Users,
  Building,
  Gift,
  Coins,
  Settings,
  TrendingUp,
  DollarSign,
  X,
} from "lucide-react";
// import Header from "../common/Header";
import StatsCard from "../common/StatsCard";
import PartnersManagement from "./PartnersManagement";
import MembersManagement from "./MembersManagement";
import RewardsManagement from "./RewardsManagement";
import Analytics from "./Analytics";
import { useData } from "../../contexts/DataContext";
import { useDashboard } from "../../hooks/admin/useDahsboard";
import Header from "../common/Header";

const AdminDashboard: React.FC = () => {
  const location = useLocation();
  // const { partners, members, transactions, redemptions, loading, error } =
  //   useData();
  const { data, isLoading, error } = useDashboard();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActivePath = (path: string) => {
    if (path === "/admin" && location.pathname === "/admin") return true;
    return location.pathname.startsWith(path) && path !== "/admin";
  };

  const navigation = [
    { name: "Overview", href: "/admin", icon: BarChart3 },
    { name: "Partners", href: "/admin/partners", icon: Building },
    { name: "Members", href: "/admin/members", icon: Users },
    { name: "Rewards", href: "/admin/rewards", icon: Gift },
    { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  // Calculate stats
  const totalPartners = 0;
  const totalMembers = 0;
  const totalCoinsInCirculation = 0;
  const totalTransactions = 0;
  const pendingRedemptions = 0;

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg-primary transition-colors duration-200">
        <Header
          title="Admin Dashboard"
          subtitle="Loading..."
          onMenuToggle={() => setSidebarOpen(true)}
          showMenuButton={true}
        />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600 dark:text-dark-text-secondary">
              Loading dashboard data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg-primary transition-colors duration-200">
        <Header
          title="Admin Dashboard"
          subtitle="Error loading data"
          onMenuToggle={() => setSidebarOpen(true)}
          showMenuButton={true}
        />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 bg-error-100 dark:bg-error-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-error-600 dark:text-error-400 text-xl">
                ⚠
              </span>
            </div>
            <h3 className="text-lg font-medium text-neutral-900 dark:text-dark-text-primary mb-2">
              Failed to load data
            </h3>
            <p className="text-neutral-600 dark:text-dark-text-secondary mb-4">
              {/* {error} */}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg-primary transition-colors duration-200">
      <Header
        title="Admin Dashboard"
        subtitle="Manage your loyalty platform ecosystem"
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
                    <StatsCard
                      title="Total Partners"
                      value={data?.data?.totalPartners?.thisMonth}
                      icon={Building}
                      trend={{
                        value: data?.data?.totalPartners?.value,
                        isPositive: data?.data?.totalPartners?.isPositive,
                      }}
                      color="primary"
                    />
                    <StatsCard
                      title="Active Members"
                      value={data?.data?.totalMembers?.thisMonth}
                      icon={Users}
                      trend={{
                        value: data?.data?.totalMembers?.value,
                        isPositive: data?.data?.totalMembers?.isPositive,
                      }}
                      color="success"
                    />
                    <StatsCard
                      title="Coins in Circulation"
                      value={data?.data?.coinsInCirculation?.thisMonth}
                      icon={Coins}
                      trend={{
                        value: data?.data?.coinsInCirculation?.value,
                        isPositive: data?.data?.coinsInCirculation?.isPositive,
                      }}
                      color="secondary"
                    />
                    <StatsCard
                      title="Total Transactions"
                      value={data?.data?.totalTransactions?.thisMonth}
                      icon={DollarSign}
                      trend={{
                        value: data?.data?.totalTransactions?.value,
                        isPositive: data?.data?.totalTransactions?.isPositive,
                      }}
                      color="warning"
                    />
                  </div>

                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pending Approvals */}
                    <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 transition-colors duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary">
                          Pending Approvals
                        </h3>
                        <span className="bg-warning-100 dark:bg-warning-900/20 text-warning-800 dark:text-warning-400 text-sm font-medium px-2.5 py-0.5 rounded-full">
                          {pendingRedemptions}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {data?.data?.pendingApprovals?.length > 0 &&
                          data.data.pendingApprovals.map((approval: any) => (
                            <div key={approval.id}>
                              {/* your JSX for each approval */}
                            </div>
                          ))}
                        {/* {data.redemptions
                          .filter((r) => r.status === "pending")
                          .map((redemption) => (
                            <div
                              key={redemption.id}
                              className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-dark-bg-tertiary rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-neutral-900 dark:text-dark-text-primary">
                                  Redemption Request
                                </p>
                                <p className="text-sm text-neutral-600 dark:text-dark-text-secondary">
                                  {redemption.coins_cost} coins
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <button className="px-3 py-1 bg-success-100 dark:bg-success-900/20 text-success-700 dark:text-success-400 text-sm rounded-md hover:bg-success-200 dark:hover:bg-success-900/30 transition-colors">
                                  Approve
                                </button>
                                <button className="px-3 py-1 bg-error-100 dark:bg-error-900/20 text-error-700 dark:text-error-400 text-sm rounded-md hover:bg-error-200 dark:hover:bg-error-900/30 transition-colors">
                                  Reject
                                </button>
                              </div>
                            </div>
                          ))}
                        {pendingRedemptions === 0 && (
                          <p className="text-neutral-500 dark:text-dark-text-tertiary text-center py-4">
                            No pending approvals
                          </p>
                        )} */}
                      </div>
                    </div>

                    {/* Top Performing Partners */}
                    <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 transition-colors duration-200">
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-4">
                        Top Performing Partners
                      </h3>
                      {data?.data?.topPerfomingPartners?.length > 0 &&
                        data.data.pendingApprovals.map((approval: any) => (
                          <div key={approval.id}>
                            {/* your JSX for each approval */}
                          </div>
                        ))}
                      {/* <div className="space-y-3">
                        {data.partners
                          .sort(
                            (a, b) =>
                              b.total_coins_distributed -
                              a.total_coins_distributed
                          )
                          .slice(0, 3)
                          .map((partner) => (
                            <div
                              key={partner.id}
                              className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-dark-bg-tertiary rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-neutral-900 dark:text-dark-text-primary">
                                  {partner.company_name}
                                </p>
                                <p className="text-sm text-neutral-600 dark:text-dark-text-secondary">
                                  {partner.total_coins_distributed} coins
                                  distributed
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-primary-600 dark:text-primary-400">
                                  ₹{partner.wallet_balance}
                                </p>
                                <p className="text-sm text-neutral-500 dark:text-dark-text-tertiary">
                                  wallet balance
                                </p>
                              </div>
                            </div>
                          ))}
                      </div> */}
                    </div>
                  </div>
                </div>
              }
            />
            <Route path="/partners" element={<PartnersManagement />} />
            <Route path="/members" element={<MembersManagement />} />
            <Route path="/rewards" element={<RewardsManagement />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route
              path="/settings"
              element={
                <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-6 transition-colors duration-200">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-4">
                    Platform Settings
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

export default AdminDashboard;
