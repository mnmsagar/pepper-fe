import React, { useState } from 'react';
import { History, Search, Filter, TrendingUp, TrendingDown, Calendar, Coins } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface TransactionHistoryProps {
  memberId: string;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ memberId }) => {
  const { transactions } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'earn' | 'redeem' | 'reward'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const memberTransactions = transactions.filter(t => t.to_user_id === memberId);

  const filteredTransactions = memberTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.transaction_type === filterType;
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else {
      return b.amount - a.amount;
    }
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earn':
      case 'reward':
        return <TrendingUp className="h-5 w-5 text-success-500 dark:text-success-400" />;
      case 'redeem':
        return <TrendingDown className="h-5 w-5 text-error-500 dark:text-error-400" />;
      default:
        return <Coins className="h-5 w-5 text-neutral-500 dark:text-dark-text-tertiary" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earn':
      case 'reward':
        return 'text-success-600 dark:text-success-400';
      case 'redeem':
        return 'text-error-600 dark:text-error-400';
      default:
        return 'text-neutral-600 dark:text-dark-text-secondary';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'earn':
      case 'reward':
        return 'bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400';
      case 'redeem':
        return 'bg-error-100 dark:bg-error-900/20 text-error-800 dark:text-error-400';
      default:
        return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300';
    }
  };

  const totalEarned = memberTransactions
    .filter(t => t.transaction_type === 'earn' || t.transaction_type === 'reward')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRedeemed = memberTransactions
    .filter(t => t.transaction_type === 'redeem')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-dark-text-secondary mb-1">Total Transactions</p>
              <p className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-dark-text-primary">{memberTransactions.length}</p>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <History className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-dark-text-secondary mb-1">Total Earned</p>
              <p className="text-xl sm:text-2xl font-bold text-success-600 dark:text-success-400">{totalEarned}</p>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-r from-success-500 to-success-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-dark-text-secondary mb-1">Total Redeemed</p>
              <p className="text-xl sm:text-2xl font-bold text-error-600 dark:text-error-400">{totalRedeemed}</p>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-r from-error-500 to-error-600 rounded-lg flex items-center justify-center">
              <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-dark-text-primary">Transaction History</h2>

      {/* Filters */}
      <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 transition-colors duration-200">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-dark-text-tertiary" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary placeholder-neutral-500 dark:placeholder-dark-text-tertiary transition-colors duration-200 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-dark-text-tertiary" />
            <select
              className="pl-10 pr-8 py-3 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent appearance-none bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary text-base min-w-0 w-full sm:w-auto"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
            >
              <option value="all">All Types</option>
              <option value="earn">Earned</option>
              <option value="reward">Rewards</option>
              <option value="redeem">Redeemed</option>
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-dark-text-tertiary" />
            <select
              className="pl-10 pr-8 py-3 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent appearance-none bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary text-base min-w-0 w-full sm:w-auto"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary overflow-hidden transition-colors duration-200">
        {filteredTransactions.length > 0 ? (
          <div className="divide-y divide-neutral-200 dark:divide-dark-border-primary">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="p-4 sm:p-6 hover:bg-neutral-50 dark:hover:bg-dark-bg-tertiary transition-colors touch-manipulation">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {getTransactionIcon(transaction.transaction_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-neutral-900 dark:text-dark-text-primary truncate">
                        {transaction.description}
                      </h4>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getTypeColor(transaction.transaction_type)} w-fit`}>
                          {transaction.transaction_type}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-dark-text-tertiary mt-1 sm:mt-0">
                          {new Date(transaction.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className={`text-lg font-semibold ${getTransactionColor(transaction.transaction_type)}`}>
                      {transaction.transaction_type === 'redeem' ? '-' : '+'}{transaction.amount}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-dark-text-tertiary">coins</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <History className="mx-auto h-12 w-12 text-neutral-400 dark:text-dark-text-tertiary mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-dark-text-primary mb-2">No transactions found</h3>
            <p className="text-neutral-500 dark:text-dark-text-secondary">
              {searchTerm || filterType !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Start earning coins to see your transaction history here.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;