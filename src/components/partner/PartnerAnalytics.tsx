import React from 'react';
import { BarChart3, TrendingUp, Users, Gift } from 'lucide-react';
import StatsCard from '../common/StatsCard';
import { Partner } from '../../types';
import { useData } from '../../contexts/DataContext';

interface PartnerAnalyticsProps {
  partner: Partner;
}

const PartnerAnalytics: React.FC<PartnerAnalyticsProps> = ({ partner }) => {
  const { transactions } = useData();

  const partnerTransactions = transactions.filter(t => t.partnerId === partner.id);
  const rewardTransactions = partnerTransactions.filter(t => t.type === 'reward');
  const purchaseTransactions = partnerTransactions.filter(t => t.type === 'purchase');

  const totalSpent = purchaseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const averageReward = rewardTransactions.length > 0 
    ? rewardTransactions.reduce((sum, t) => sum + t.amount, 0) / rewardTransactions.length 
    : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-dark-text-primary">Analytics & Reports</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Spent"
          value={`₹${totalSpent.toLocaleString()}`}
          icon={TrendingUp}
          trend={{ value: 12, isPositive: true }}
          color="success"
        />
        <StatsCard
          title="Coins Distributed"
          value={partner.totalCoinsDistributed.toLocaleString()}
          icon={Gift}
          trend={{ value: 18, isPositive: true }}
          color="secondary"
        />
        <StatsCard
          title="Unique Customers"
          value={rewardTransactions.length}
          icon={Users}
          trend={{ value: 8, isPositive: true }}
          color="info"
        />
        <StatsCard
          title="Avg. Reward"
          value={Math.round(averageReward)}
          icon={BarChart3}
          trend={{ value: 5, isPositive: true }}
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-6 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-4">Recent Rewards</h3>
          <div className="space-y-3">
            {rewardTransactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-dark-bg-tertiary rounded-lg">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-dark-text-primary">{transaction.description}</p>
                  <p className="text-sm text-neutral-600 dark:text-dark-text-secondary">{transaction.createdAt.toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-secondary-600 dark:text-secondary-400">{transaction.amount} coins</p>
                </div>
              </div>
            ))}
            {rewardTransactions.length === 0 && (
              <p className="text-neutral-500 dark:text-dark-text-tertiary text-center py-4">No rewards distributed yet</p>
            )}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-6 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-4">Performance Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-success-50 dark:bg-success-900/20 rounded-lg">
              <h4 className="font-medium text-success-900 dark:text-success-300 mb-1">Customer Engagement</h4>
              <p className="text-sm text-success-700 dark:text-success-400">
                Your average reward of {Math.round(averageReward)} coins is above platform average
              </p>
            </div>
            <div className="p-4 bg-info-50 dark:bg-info-900/20 rounded-lg">
              <h4 className="font-medium text-info-900 dark:text-info-300 mb-1">Growth Opportunity</h4>
              <p className="text-sm text-info-700 dark:text-info-400">
                Consider increasing reward frequency to boost customer retention
              </p>
            </div>
            <div className="p-4 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg">
              <h4 className="font-medium text-secondary-900 dark:text-secondary-300 mb-1">Wallet Status</h4>
              <p className="text-sm text-secondary-700 dark:text-secondary-400">
                Current balance: ₹{partner.walletBalance.toLocaleString()}. 
                {partner.walletBalance < 500 && ' Consider topping up soon.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends Placeholder */}
      <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-6 transition-colors duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary">Monthly Trends</h3>
          <BarChart3 className="h-5 w-5 text-neutral-400 dark:text-dark-text-tertiary" />
        </div>
        <div className="h-64 bg-neutral-50 dark:bg-dark-bg-tertiary rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-neutral-300 dark:text-dark-text-tertiary mx-auto mb-4" />
            <p className="text-neutral-500 dark:text-dark-text-secondary">Chart visualization will be implemented here</p>
            <p className="text-sm text-neutral-400 dark:text-dark-text-tertiary">Show monthly spending, rewards, and customer engagement</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerAnalytics;