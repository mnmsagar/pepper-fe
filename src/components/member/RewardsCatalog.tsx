import React, { useState } from 'react';
import { Gift, Search, Filter, Coins, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Member, RewardItem } from '../../types';
import { useData } from '../../contexts/DataContext';

interface RewardsCatalogProps {
  member: Member;
}

const RewardsCatalog: React.FC<RewardsCatalogProps> = ({ member }) => {
  const { rewards, addRedemption, addTransaction } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'cashback' | 'trip' | 'gift' | 'voucher'>('all');
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redemptionSuccess, setRedemptionSuccess] = useState(false);

  const filteredRewards = rewards.filter(reward => {
    if (!reward.isActive) return false;
    
    const matchesSearch = reward.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reward.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || reward.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cashback': return 'bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400';
      case 'trip': return 'bg-info-100 dark:bg-info-900/20 text-info-800 dark:text-info-400';
      case 'gift': return 'bg-secondary-100 dark:bg-secondary-900/20 text-secondary-800 dark:text-secondary-400';
      case 'voucher': return 'bg-warning-100 dark:bg-warning-900/20 text-warning-800 dark:text-warning-400';
      default: return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300';
    }
  };

  const handleRedemption = async (reward: RewardItem) => {
    if (member.coinBalance < reward.coinsCost) {
      alert('Insufficient coins for this reward.');
      return;
    }

    setIsRedeeming(true);
    setSelectedReward(reward);

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Add redemption record
      addRedemption({
        userId: member.userId,
        rewardId: reward.id,
        coinsCost: reward.coinsCost,
        status: 'pending',
      });

      // Add transaction for coin deduction
      addTransaction({
        toUserId: member.userId,
        amount: reward.coinsCost,
        type: 'redeem',
        description: `Redeemed: ${reward.title}`,
      });

      setRedemptionSuccess(true);
    } catch (error) {
      console.error('Redemption failed:', error);
      alert('Redemption failed. Please try again.');
    } finally {
      setIsRedeeming(false);
    }
  };

  const resetRedemption = () => {
    setSelectedReward(null);
    setRedemptionSuccess(false);
  };

  if (redemptionSuccess && selectedReward) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-dark-text-primary">Redemption Successful!</h2>
        
        <div className="bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-xl p-6 sm:p-8 text-center transition-colors duration-200">
          <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-success-500 dark:text-success-400 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-success-900 dark:text-success-300 mb-2">Reward Redeemed</h3>
          <p className="text-success-700 dark:text-success-400 mb-2 text-sm sm:text-base">
            You have successfully redeemed <strong>{selectedReward.title}</strong>
          </p>
          <p className="text-success-600 dark:text-success-500 mb-4 text-sm sm:text-base">
            {selectedReward.coinsCost} coins have been deducted from your balance.
          </p>
          <div className="bg-white dark:bg-dark-bg-secondary rounded-lg p-4 mb-4 border border-success-200 dark:border-success-800">
            <div className="flex items-center justify-center text-warning-600 dark:text-warning-400 mb-2">
              <Clock className="h-5 w-5 mr-2" />
              <span className="font-medium">Processing</span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-dark-text-secondary">
              Your redemption request is being processed. You'll receive an email confirmation within 24 hours.
            </p>
          </div>
          <button
            onClick={resetRedemption}
            className="bg-success-600 dark:bg-success-700 text-white px-6 py-3 rounded-lg hover:bg-success-700 dark:hover:bg-success-600 transition-colors touch-manipulation"
          >
            Browse More Rewards
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Balance */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-dark-text-primary">Rewards Catalog</h2>
        <div className="bg-gradient-to-r from-success-600 to-success-500 text-white px-4 sm:px-6 py-3 rounded-lg shadow-medium">
          <div className="flex items-center">
            <Coins className="h-5 w-5 mr-2" />
            <span className="font-semibold">{member.coinBalance} coins available</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 transition-colors duration-200">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-dark-text-tertiary" />
            <input
              type="text"
              placeholder="Search rewards..."
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary placeholder-neutral-500 dark:placeholder-dark-text-tertiary transition-colors duration-200 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-dark-text-tertiary" />
            <select
              className="pl-10 pr-8 py-3 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent appearance-none bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary text-base min-w-0 w-full sm:w-auto"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
            >
              <option value="all">All Categories</option>
              <option value="cashback">Cashback</option>
              <option value="trip">Trips</option>
              <option value="gift">Gifts</option>
              <option value="voucher">Vouchers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredRewards.map((reward) => {
          const canAfford = member.coinBalance >= reward.coinsCost;
          
          return (
            <div key={reward.id} className={`bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border overflow-hidden hover:shadow-medium transition-all touch-manipulation ${
              canAfford ? 'border-neutral-200 dark:border-dark-border-primary' : 'border-neutral-100 dark:border-dark-border-primary opacity-75'
            }`}>
              {/* Reward Image */}
              <div className="h-40 sm:h-48 bg-gradient-to-br from-secondary-100 dark:from-secondary-900/30 to-primary-100 dark:to-primary-900/30 flex items-center justify-center relative">
                <Gift className="h-12 w-12 sm:h-16 sm:w-16 text-secondary-400 dark:text-secondary-500" />
                {!canAfford && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 dark:bg-black dark:bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-dark-bg-secondary rounded-full p-2">
                      <AlertCircle className="h-6 w-6 text-warning-500 dark:text-warning-400" />
                    </div>
                  </div>
                )}
              </div>

              {/* Reward Content */}
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getCategoryColor(reward.category)}`}>
                    {reward.category}
                  </span>
                  <div className={`flex items-center ${canAfford ? 'text-success-600 dark:text-success-400' : 'text-neutral-400 dark:text-dark-text-tertiary'}`}>
                    <Coins className="h-4 w-4 mr-1" />
                    <span className="font-bold">{reward.coinsCost}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-2">{reward.title}</h3>
                <p className="text-sm text-neutral-600 dark:text-dark-text-secondary mb-4 line-clamp-2">{reward.description}</p>

                {!canAfford && (
                  <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg p-3 mb-4">
                    <div className="flex items-center text-warning-700 dark:text-warning-400">
                      <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm font-medium">
                        Need {reward.coinsCost - member.coinBalance} more coins
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleRedemption(reward)}
                  disabled={!canAfford || isRedeeming}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all touch-manipulation ${
                    canAfford && !isRedeeming
                      ? 'bg-gradient-to-r from-success-600 to-success-500 text-white hover:from-success-700 hover:to-success-600 active:scale-95 shadow-medium'
                      : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  {isRedeeming && selectedReward?.id === reward.id ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </div>
                  ) : canAfford ? (
                    'Redeem Now'
                  ) : (
                    'Insufficient Coins'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRewards.length === 0 && (
        <div className="text-center py-12">
          <Gift className="mx-auto h-12 w-12 text-neutral-400 dark:text-dark-text-tertiary mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 dark:text-dark-text-primary mb-2">No rewards found</h3>
          <p className="text-neutral-500 dark:text-dark-text-secondary">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default RewardsCatalog;