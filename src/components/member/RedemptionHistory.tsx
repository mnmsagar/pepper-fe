import React, { useState } from 'react';
import { Star, Search, Filter, Clock, CheckCircle, XCircle, AlertTriangle, Gift } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface RedemptionHistoryProps {
  memberId: string;
}

const RedemptionHistory: React.FC<RedemptionHistoryProps> = ({ memberId }) => {
  const { redemptions, rewards } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'completed' | 'rejected'>('all');

  const memberRedemptions = redemptions.filter(r => r.user_id === memberId);

  const filteredRedemptions = memberRedemptions.filter(redemption => {
    const reward = rewards.find(r => r.id === redemption.reward_id);
    const matchesSearch = reward?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reward?.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || redemption.status === filterStatus;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-warning-500 dark:text-warning-400" />;
      case 'approved':
        return <AlertTriangle className="h-5 w-5 text-info-500 dark:text-info-400" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-success-500 dark:text-success-400" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-error-500 dark:text-error-400" />;
      default:
        return <Clock className="h-5 w-5 text-neutral-400 dark:text-dark-text-tertiary" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning-100 dark:bg-warning-900/20 text-warning-800 dark:text-warning-400';
      case 'approved':
        return 'bg-info-100 dark:bg-info-900/20 text-info-800 dark:text-info-400';
      case 'completed':
        return 'bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400';
      case 'rejected':
        return 'bg-error-100 dark:bg-error-900/20 text-error-800 dark:text-error-400';
      default:
        return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300';
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Your redemption request is being reviewed';
      case 'approved':
        return 'Redemption approved and being processed';
      case 'completed':
        return 'Reward has been delivered successfully';
      case 'rejected':
        return 'Redemption request was declined';
      default:
        return '';
    }
  };

  const statusCounts = {
    pending: memberRedemptions.filter(r => r.status === 'pending').length,
    approved: memberRedemptions.filter(r => r.status === 'approved').length,
    completed: memberRedemptions.filter(r => r.status === 'completed').length,
    rejected: memberRedemptions.filter(r => r.status === 'rejected').length,
  };

  const totalCoinsRedeemed = memberRedemptions.reduce((sum, r) => sum + r.coins_cost, 0);

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-dark-text-secondary mb-1">Total Redemptions</p>
              <p className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-dark-text-primary">{memberRedemptions.length}</p>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
              <Star className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-dark-text-secondary mb-1">Coins Redeemed</p>
              <p className="text-xl sm:text-2xl font-bold text-secondary-600 dark:text-secondary-400">{totalCoinsRedeemed}</p>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <Gift className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-dark-text-secondary mb-1">Completed</p>
              <p className="text-xl sm:text-2xl font-bold text-success-600 dark:text-success-400">{statusCounts.completed}</p>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-r from-success-500 to-success-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-dark-text-secondary mb-1">Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-warning-600 dark:text-warning-400">{statusCounts.pending}</p>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-r from-warning-500 to-warning-600 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-dark-text-primary">Redemption History</h2>

      {/* Filters */}
      <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 transition-colors duration-200">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-dark-text-tertiary" />
            <input
              type="text"
              placeholder="Search redemptions..."
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary placeholder-neutral-500 dark:placeholder-dark-text-tertiary transition-colors duration-200 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-dark-text-tertiary" />
            <select
              className="pl-10 pr-8 py-3 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent appearance-none bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary text-base min-w-0 w-full sm:w-auto"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Redemptions List */}
      <div className="space-y-4">
        {filteredRedemptions.length > 0 ? (
          filteredRedemptions.map((redemption) => {
            const reward = rewards.find(r => r.id === redemption.reward_id);
            if (!reward) return null;

            return (
              <div key={redemption.id} className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 hover:shadow-medium transition-all touch-manipulation">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-br from-secondary-100 dark:from-secondary-900/30 to-primary-100 dark:to-primary-900/30 rounded-lg flex items-center justify-center">
                        <Gift className="h-6 w-6 sm:h-8 sm:w-8 text-secondary-400 dark:text-secondary-500" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-1 truncate">
                        {reward.title}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-dark-text-secondary mb-2 line-clamp-2">
                        {reward.description}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-3 space-y-2 sm:space-y-0">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(redemption.status)} w-fit`}>
                          {redemption.status}
                        </span>
                        <span className="text-sm text-neutral-500 dark:text-dark-text-tertiary">
                          {redemption.coins_cost} coins
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center text-sm text-neutral-500 dark:text-dark-text-tertiary space-y-1 sm:space-y-0 sm:space-x-4">
                        <span>
                          Requested: {new Date(redemption.created_at).toLocaleDateString()}
                        </span>
                        {redemption.processed_at && (
                          <span>
                            Processed: {new Date(redemption.processed_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {getStatusIcon(redemption.status)}
                  </div>
                </div>

                {/* Status Description */}
                <div className="mt-4 p-3 bg-neutral-50 dark:bg-dark-bg-tertiary rounded-lg">
                  <p className="text-sm text-neutral-600 dark:text-dark-text-secondary">
                    {getStatusDescription(redemption.status)}
                  </p>
                </div>

                {/* Actions for pending redemptions */}
                {redemption.status === 'pending' && (
                  <div className="mt-4 flex justify-end">
                    <button className="text-error-600 dark:text-error-400 hover:text-error-700 dark:hover:text-error-300 text-sm font-medium touch-manipulation">
                      Cancel Request
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <Star className="mx-auto h-12 w-12 text-neutral-400 dark:text-dark-text-tertiary mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-dark-text-primary mb-2">No redemptions found</h3>
            <p className="text-neutral-500 dark:text-dark-text-secondary mb-4">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'You haven\'t redeemed any rewards yet.'}
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button className="bg-gradient-to-r from-secondary-600 to-primary-600 text-white px-6 py-3 rounded-lg hover:from-secondary-700 hover:to-primary-700 transition-all touch-manipulation">
                Browse Rewards
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RedemptionHistory;