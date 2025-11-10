import React, { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import {
  Coins,
  Gift,
  History,
  User,
  Wallet,
  Star,
  TrendingUp,
  X,
} from "lucide-react";
// import Header from '../common/Header';
import StatsCard from "../common/StatsCard";
import RewardsCatalog from "./RewardsCatalog";
import TransactionHistory from "./TransactionHistory";
import RedemptionHistory from "./RedemptionHistory";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import Header from "../common/Header";

const MemberPortal: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  // const { members, transactions, redemptions } = useData();
  const memberData = {
    member: {
      id: 101,
      userId: 45,
      coinBalance: 250,
      totalCoinsEarned: 1000,
      totalCoinsRedeemed: 750,
      demographics: {
        age: 28,
        gender: "Male",
        location: "Mumbai, India",
        interests: ["Tech", "Gaming", "Fitness"],
      },
      eventRegistrations: [
        { eventId: 1, eventName: "Web3 Conference", date: "2025-07-12" },
        { eventId: 2, eventName: "Fitness Fest", date: "2025-09-01" },
      ],
      createdAt: new Date("2024-12-05T10:30:00Z"),
    },
    transactions: [
      {
        id: 5001,
        to_user_id: 45,
        from_user_id: 10,
        amount: 100,
        type: "Reward",
        description: "Completed weekly challenge",
        created_at: "2025-03-15T09:00:00Z",
      },
      {
        id: 5002,
        to_user_id: 45,
        from_user_id: 12,
        amount: 50,
        type: "Bonus",
        description: "Referral reward",
        created_at: "2025-04-01T12:15:00Z",
      },
    ],
    redemptions: [
      {
        id: 7001,
        user_id: 45,
        reward_name: "Amazon Gift Card",
        coins_redeemed: 200,
        status: "Delivered",
        redeemed_at: "2025-05-20T08:00:00Z",
      },
      {
        id: 7002,
        user_id: 45,
        reward_name: "Swiggy Coupon",
        coins_redeemed: 150,
        status: "Pending",
        redeemed_at: "2025-06-10T10:45:00Z",
      },
    ],
  };
  const { member, transactions, redemptions } = memberData;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // const currentMemberRaw = members.find(m => m.user_id === user?.id);
  const mappedMember = member
    ? {
        id: member.id,
        userId: member.userId,
        coinBalance: member.coinBalance,
        totalCoinsEarned: member.totalCoinsEarned,
        totalCoinsRedeemed: member.totalCoinsRedeemed,
        demographics: member.demographics,
        eventRegistrations: member.eventRegistrations,
        createdAt: new Date(member.createdAt),
      }
    : null;
  const memberTransactions = transactions.filter(
    (t) => t.to_user_id === user?.id
  );
  const memberRedemptions = redemptions.filter((r) => r.user_id === user?.id);

  const isActivePath = (path: string) => {
    if (path === "/member" && location.pathname === "/member") return true;
    return location.pathname.startsWith(path) && path !== "/member";
  };

  const navigation = [
    { name: "Overview", href: "/member", icon: Coins },
    { name: "Rewards Catalog", href: "/member/rewards", icon: Gift },
    { name: "Transactions", href: "/member/transactions", icon: History },
    { name: "Redemptions", href: "/member/redemptions", icon: Star },
    { name: "Profile", href: "/member/profile", icon: User },
  ];

  // if (!mappedMember) {
  //   return (
  //     <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg-primary flex items-center justify-center p-4">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold text-neutral-900 dark:text-dark-text-primary mb-2">Member Profile Not Found</h2>
  //         <p className="text-neutral-600 dark:text-dark-text-secondary">Please contact support to set up your member account.</p>
  //       </div>
  //     </div>
  //   );
  // }

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
                        className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors touch-manipulation ${
                          isActivePath(item.href)
                            ? "bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400 border-r-2 border-success-700 dark:border-success-400"
                            : "text-neutral-600 dark:text-dark-text-secondary hover:text-neutral-900 dark:hover:text-dark-text-primary hover:bg-neutral-50 dark:hover:bg-dark-bg-secondary"
                        }`}
                      >
                        <Icon
                          className={`mr-3 h-5 w-5 ${
                            isActivePath(item.href)
                              ? "text-success-500 dark:text-success-400"
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
                        ? "bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400 border-r-2 border-success-700 dark:border-success-400"
                        : "text-neutral-600 dark:text-dark-text-secondary hover:text-neutral-900 dark:hover:text-dark-text-primary hover:bg-neutral-50 dark:hover:bg-dark-bg-secondary"
                    }`}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 ${
                        isActivePath(item.href)
                          ? "text-success-500 dark:text-success-400"
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
                  {/* Coin Balance Hero */}
                  <div className="bg-gradient-to-r from-success-600 to-success-500 rounded-xl p-6 sm:p-8 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                          Your Coin Balance
                        </h2>
                        <div className="flex items-baseline">
                          <span className="text-4xl sm:text-5xl font-bold">
                            {mappedMember?.coinBalance}
                          </span>
                          <span className="text-lg sm:text-xl ml-2 text-success-100">
                            coins
                          </span>
                        </div>
                        <p className="text-success-100 mt-2 text-sm sm:text-base">
                          Total earned: {mappedMember?.totalCoinsEarned} • Total
                          redeemed: {mappedMember?.totalCoinsRedeemed}
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
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-2">
                              Browse Rewards
                            </h3>
                            <p className="text-neutral-600 dark:text-dark-text-secondary text-sm sm:text-base">
                              Discover amazing rewards you can redeem
                            </p>
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
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-2">
                              Transaction History
                            </h3>
                            <p className="text-neutral-600 dark:text-dark-text-secondary text-sm sm:text-base">
                              View all your coin transactions
                            </p>
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
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary">
                        Recent Activity
                      </h3>
                      <Link
                        to="/member/transactions"
                        className="text-success-600 dark:text-success-400 hover:text-success-700 dark:hover:text-success-300 text-sm font-medium"
                      >
                        View All
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {recentTransactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-dark-bg-tertiary rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-neutral-900 dark:text-dark-text-primary truncate">
                              {transaction.description}
                            </p>
                            <p className="text-sm text-neutral-600 dark:text-dark-text-secondary">
                              {new Date(
                                transaction.created_at
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <p
                              className={`font-semibold ${
                                transaction.transaction_type === "redeem"
                                  ? "text-error-600 dark:text-error-400"
                                  : "text-success-600 dark:text-success-400"
                              }`}
                            >
                              {transaction.transaction_type === "redeem"
                                ? "-"
                                : "+"}
                              {transaction.amount} coins
                            </p>
                            <p className="text-sm text-neutral-500 dark:text-dark-text-tertiary capitalize">
                              {transaction.transaction_type}
                            </p>
                          </div>
                        </div>
                      ))}
                      {recentTransactions.length === 0 && (
                        <p className="text-neutral-500 dark:text-dark-text-tertiary text-center py-4">
                          No recent activity
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              }
            />
            <Route
              path="/rewards"
              element={
                mappedMember ? <RewardsCatalog member={mappedMember} /> : null
              }
            />
            <Route
              path="/transactions"
              element={<TransactionHistory memberId={user?.id || ""} />}
            />
            <Route
              path="/redemptions"
              element={<RedemptionHistory memberId={user?.id || ""} />}
            />
            <Route
              path="/profile"
              element={
                <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-6 transition-colors duration-200">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-4">
                    Profile Settings
                  </h3>
                  <p className="text-neutral-600 dark:text-dark-text-secondary">
                    Profile management coming soon...
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

export default MemberPortal;
