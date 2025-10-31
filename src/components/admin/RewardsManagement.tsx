import React, { useState } from 'react';
import { Gift, Search, Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const RewardsManagement: React.FC = () => {
  const { rewards } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'cashback' | 'trip' | 'gift' | 'voucher'>('all');

  const filteredRewards = rewards.filter(reward => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-dark-text-primary">Rewards Management</h2>
        <button className="bg-secondary-600 dark:bg-secondary-700 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 dark:hover:bg-secondary-600 transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Reward
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-6 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-dark-text-tertiary" />
            <input
              type="text"
              placeholder="Search rewards..."
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary placeholder-neutral-500 dark:placeholder-dark-text-tertiary transition-colors duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              className="px-4 py-2 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent appearance-none bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary pr-8"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
            >
              <option value="all">All Categories</option>
              <option value="cashback">Cashback</option>
              <option value="trip">Trip</option>
              <option value="gift">Gift</option>
              <option value="voucher">Voucher</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map((reward) => (
          <div key={reward.id} className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary overflow-hidden hover:shadow-medium transition-all">
            {/* Reward Image */}
            <div className="h-48 bg-gradient-to-br from-secondary-100 dark:from-secondary-900/30 to-primary-100 dark:to-primary-900/30 flex items-center justify-center">
              <Gift className="h-16 w-16 text-secondary-400 dark:text-secondary-500" />
            </div>

            {/* Reward Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getCategoryColor(reward.category)}`}>
                  {reward.category}
                </span>
                <div className="flex items-center">
                  {reward.isActive ? (
                    <ToggleRight className="h-5 w-5 text-success-500 dark:text-success-400" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 text-neutral-400 dark:text-dark-text-tertiary" />
                  )}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-2">{reward.title}</h3>
              <p className="text-sm text-neutral-600 dark:text-dark-text-secondary mb-4 line-clamp-2">{reward.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">{reward.coinsCost}</span>
                  <span className="text-sm text-neutral-500 dark:text-dark-text-tertiary ml-1">coins</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button className="flex-1 bg-secondary-600 dark:bg-secondary-700 text-white py-2 px-3 rounded-lg hover:bg-secondary-700 dark:hover:bg-secondary-600 transition-colors text-sm">
                  <Edit className="h-4 w-4 inline mr-1" />
                  Edit
                </button>
                <button className="p-2 text-neutral-400 dark:text-dark-text-tertiary hover:text-secondary-600 dark:hover:text-secondary-400 transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-neutral-400 dark:text-dark-text-tertiary hover:text-error-600 dark:hover:text-error-400 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
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

export default RewardsManagement;