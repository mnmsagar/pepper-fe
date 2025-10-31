import React from 'react';
import { BarChart3, TrendingUp, Coins, DollarSign, Gift } from 'lucide-react';
import StatsCard from '../common/StatsCard';
import { useData } from '../../contexts/DataContext';

const Analytics: React.FC = () => {
  const { partners, members, transactions, redemptions } = useData();

  // Calculate analytics
  const totalRevenue = partners.reduce((sum, p) => sum + (p.wallet_balance * 0.1), 0); // Assuming 10% commission
  const totalCoinsDistributed = partners.reduce((sum, p) => sum + p.total_coins_distributed, 0);
  const totalCoinsRedeemed = members.reduce((sum, m) => sum + m.total_coins_redeemed, 0);
  const redemptionRate = totalCoinsDistributed > 0 ? (totalCoinsRedeemed / totalCoinsDistributed * 100) : 0;

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-dark-text-primary">Analytics Dashboard</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Platform Revenue"
          value={`₹${totalRevenue.toFixed(0)}`}
          icon={DollarSign}
          trend={{ value: 18, isPositive: true }}
          color="success"
        />
        <StatsCard
          title="Coins Distributed"
          value={totalCoinsDistributed.toLocaleString()}
          icon={Coins}
          trend={{ value: 25, isPositive: true }}
          color="secondary"
        />
        <StatsCard
          title="Coins Redeemed"
          value={totalCoinsRedeemed.toLocaleString()}
          icon={Gift}
          trend={{ value: 12, isPositive: true }}
          color="warning"
        />
        <StatsCard
          title="Redemption Rate"
          value={`${redemptionRate.toFixed(1)}%`}
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
          color="info"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction History */}
        <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-6 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-dark-bg-tertiary rounded-lg">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-dark-text-primary capitalize">{transaction.transaction_type}</p>
                  <p className="text-sm text-neutral-600 dark:text-dark-text-secondary">{transaction.description}</p>
                  <p className="text-xs text-neutral-500 dark:text-dark-text-tertiary">{new Date(transaction.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.transaction_type === 'redeem' ? 'text-error-600 dark:text-error-400' : 'text-success-600 dark:text-success-400'
                  }`}>
                    {transaction.transaction_type === 'redeem' ? '-' : '+'}{transaction.amount} coins
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partner Performance */}
        <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-6 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-4">Partner Performance</h3>
          <div className="space-y-3">
            {partners
              .sort((a, b) => b.total_coins_distributed - a.total_coins_distributed)
              .map((partner) => (
              <div key={partner.id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-dark-bg-tertiary rounded-lg">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-dark-text-primary">{partner.company_name}</p>
                  <p className="text-sm text-neutral-600 dark:text-dark-text-secondary">Wallet: ₹{partner.wallet_balance.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-secondary-600 dark:text-secondary-400">
                    {partner.total_coins_distributed} coins
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-dark-text-tertiary">distributed</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Growth Chart Placeholder */}
      <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-6 transition-colors duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary">Monthly Growth</h3>
          <BarChart3 className="h-5 w-5 text-neutral-400 dark:text-dark-text-tertiary" />
        </div>
        <div className="h-64 bg-neutral-50 dark:bg-dark-bg-tertiary rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-neutral-300 dark:text-dark-text-tertiary mx-auto mb-4" />
            <p className="text-neutral-500 dark:text-dark-text-secondary">Chart visualization will be implemented here</p>
            <p className="text-sm text-neutral-400 dark:text-dark-text-tertiary">Integration with charting library required</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;