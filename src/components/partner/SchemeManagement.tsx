import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, ToggleLeft, ToggleRight, Target, TrendingUp, Users, Calendar } from 'lucide-react';
import { Partner, RewardScheme } from '../../types';
import { useData } from '../../contexts/DataContext';

interface SchemeManagementProps {
  partner: Partner;
}

const SchemeManagement: React.FC<SchemeManagementProps> = ({ partner }) => {
  const { schemes, addScheme, updateScheme, deleteScheme } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'purchase' | 'volume' | 'loyalty' | 'special'>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingScheme, setEditingScheme] = useState<RewardScheme | null>(null);

  const partnerSchemes = schemes.filter(s => s.partnerId === partner.id);

  const filteredSchemes = partnerSchemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || scheme.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'purchase': return 'bg-info-100 dark:bg-info-900/20 text-info-800 dark:text-info-400';
      case 'volume': return 'bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400';
      case 'loyalty': return 'bg-secondary-100 dark:bg-secondary-900/20 text-secondary-800 dark:text-secondary-400';
      case 'special': return 'bg-warning-100 dark:bg-warning-900/20 text-warning-800 dark:text-warning-400';
      default: return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'purchase': return Target;
      case 'volume': return TrendingUp;
      case 'loyalty': return Users;
      case 'special': return Calendar;
      default: return Target;
    }
  };

  const handleToggleActive = (scheme: RewardScheme) => {
    updateScheme(scheme.id, { isActive: !scheme.isActive });
  };

  const handleDeleteScheme = (schemeId: string) => {
    if (window.confirm('Are you sure you want to delete this scheme?')) {
      deleteScheme(schemeId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-dark-text-primary">Reward Schemes</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-primary-600 dark:bg-primary-700 text-white px-4 py-3 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors flex items-center touch-manipulation"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Scheme
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-dark-text-secondary mb-1">Total Schemes</p>
              <p className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-dark-text-primary">{partnerSchemes.length}</p>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-dark-text-secondary mb-1">Active Schemes</p>
              <p className="text-xl sm:text-2xl font-bold text-success-600 dark:text-success-400">
                {partnerSchemes.filter(s => s.isActive).length}
              </p>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-r from-success-500 to-success-600 rounded-lg flex items-center justify-center">
              <ToggleRight className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-dark-text-secondary mb-1">Total Usage</p>
              <p className="text-xl sm:text-2xl font-bold text-secondary-600 dark:text-secondary-400">
                {partnerSchemes.reduce((sum, s) => sum + s.usageCount, 0)}
              </p>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-dark-text-secondary mb-1">Coins Distributed</p>
              <p className="text-xl sm:text-2xl font-bold text-warning-600 dark:text-warning-400">
                {partnerSchemes.reduce((sum, s) => sum + (s.usageCount * s.coinsReward), 0)}
              </p>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-r from-warning-500 to-warning-600 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
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
              placeholder="Search schemes..."
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary placeholder-neutral-500 dark:placeholder-dark-text-tertiary transition-colors duration-200 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-dark-text-tertiary" />
            <select
              className="pl-10 pr-8 py-3 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary text-base min-w-0 w-full sm:w-auto"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
            >
              <option value="all">All Categories</option>
              <option value="purchase">Purchase Based</option>
              <option value="volume">Volume Based</option>
              <option value="loyalty">Loyalty Rewards</option>
              <option value="special">Special Offers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {filteredSchemes.map((scheme) => {
          const Icon = getCategoryIcon(scheme.category);
          const usagePercentage = scheme.maxUsage ? (scheme.usageCount / scheme.maxUsage) * 100 : 0;
          
          return (
            <div key={scheme.id} className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 hover:shadow-medium transition-all touch-manipulation">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary">{scheme.name}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getCategoryColor(scheme.category)}`}>
                      {scheme.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleActive(scheme)}
                  className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-dark-bg-tertiary transition-colors"
                >
                  {scheme.isActive ? (
                    <ToggleRight className="h-6 w-6 text-success-500 dark:text-success-400" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 text-neutral-400 dark:text-dark-text-tertiary" />
                  )}
                </button>
              </div>

              <p className="text-sm text-neutral-600 dark:text-dark-text-secondary mb-3">{scheme.description}</p>
              
              <div className="bg-neutral-50 dark:bg-dark-bg-tertiary rounded-lg p-3 mb-4">
                <p className="text-sm font-medium text-neutral-700 dark:text-dark-text-secondary mb-1">Conditions:</p>
                <p className="text-sm text-neutral-600 dark:text-dark-text-secondary">{scheme.conditions}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-dark-text-secondary">Reward</p>
                  <p className="text-lg font-bold text-primary-600 dark:text-primary-400">{scheme.coinsReward} coins</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 dark:text-dark-text-secondary">Min. Purchase</p>
                  <p className="text-lg font-bold text-neutral-900 dark:text-dark-text-primary">
                    {scheme.minimumPurchase ? `₹${scheme.minimumPurchase.toLocaleString()}` : 'N/A'}
                  </p>
                </div>
              </div>

              {scheme.maxUsage && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-neutral-600 dark:text-dark-text-secondary mb-1">
                    <span>Usage</span>
                    <span>{scheme.usageCount} / {scheme.maxUsage}</span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                    <div 
                      className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-dark-border-primary">
                <div className="text-sm text-neutral-500 dark:text-dark-text-tertiary">
                  Used {scheme.usageCount} times
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingScheme(scheme)}
                    className="p-2 text-neutral-400 dark:text-dark-text-tertiary hover:text-primary-600 dark:hover:text-primary-400 transition-colors touch-manipulation"
                    title="Edit Scheme"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteScheme(scheme.id)}
                    className="p-2 text-neutral-400 dark:text-dark-text-tertiary hover:text-error-600 dark:hover:text-error-400 transition-colors touch-manipulation"
                    title="Delete Scheme"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSchemes.length === 0 && (
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-neutral-400 dark:text-dark-text-tertiary mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 dark:text-dark-text-primary mb-2">No schemes found</h3>
          <p className="text-neutral-500 dark:text-dark-text-secondary mb-4">
            {searchTerm || filterCategory !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Create your first reward scheme to start incentivizing your distributors.'}
          </p>
          {!searchTerm && filterCategory === 'all' && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-primary-600 dark:bg-primary-700 text-white px-6 py-3 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors touch-manipulation"
            >
              Create First Scheme
            </button>
          )}
        </div>
      )}

      {/* Create/Edit Scheme Modal would go here */}
      {(showCreateForm || editingScheme) && (
        <SchemeFormModal
          scheme={editingScheme}
          partnerId={partner.id}
          onClose={() => {
            setShowCreateForm(false);
            setEditingScheme(null);
          }}
          onSave={(schemeData) => {
            if (editingScheme) {
              updateScheme(editingScheme.id, schemeData);
            } else {
              addScheme({ ...schemeData, partnerId: partner.id });
            }
            setShowCreateForm(false);
            setEditingScheme(null);
          }}
        />
      )}
    </div>
  );
};

// Scheme Form Modal Component
interface SchemeFormModalProps {
  scheme?: RewardScheme | null;
  partnerId: string;
  onClose: () => void;
  onSave: (schemeData: Partial<RewardScheme>) => void;
}

const SchemeFormModal: React.FC<SchemeFormModalProps> = ({ scheme, partnerId, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: scheme?.name || '',
    description: scheme?.description || '',
    conditions: scheme?.conditions || '',
    coinsReward: scheme?.coinsReward || 0,
    category: scheme?.category || 'purchase' as const,
    minimumPurchase: scheme?.minimumPurchase || 0,
    maxUsage: scheme?.maxUsage || undefined,
    validUntil: scheme?.validUntil ? scheme.validUntil.toISOString().split('T')[0] : '',
    isActive: scheme?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      validUntil: formData.validUntil ? new Date(formData.validUntil) : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={onClose}></div>

        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-dark-bg-secondary shadow-xl rounded-xl border border-neutral-200 dark:border-dark-border-primary">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary">
              {scheme ? 'Edit Scheme' : 'Create New Scheme'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 dark:text-dark-text-tertiary hover:text-neutral-600 dark:hover:text-dark-text-secondary transition-colors"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text-secondary mb-2">
                  Scheme Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-3 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary placeholder-neutral-500 dark:placeholder-dark-text-tertiary transition-colors duration-200"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Bulk Purchase Reward"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text-secondary mb-2">
                  Category *
                </label>
                <select
                  required
                  className="w-full px-3 py-3 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                >
                  <option value="purchase">Purchase Based</option>
                  <option value="volume">Volume Based</option>
                  <option value="loyalty">Loyalty Rewards</option>
                  <option value="special">Special Offers</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text-secondary mb-2">
                Description *
              </label>
              <textarea
                required
                rows={3}
                className="w-full px-3 py-3 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary placeholder-neutral-500 dark:placeholder-dark-text-tertiary transition-colors duration-200"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the scheme"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text-secondary mb-2">
                Conditions *
              </label>
              <textarea
                required
                rows={3}
                className="w-full px-3 py-3 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary placeholder-neutral-500 dark:placeholder-dark-text-tertiary transition-colors duration-200"
                value={formData.conditions}
                onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                placeholder="Detailed conditions for earning this reward"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text-secondary mb-2">
                  Coins Reward *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full px-3 py-3 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary placeholder-neutral-500 dark:placeholder-dark-text-tertiary transition-colors duration-200"
                  value={formData.coinsReward}
                  onChange={(e) => setFormData({ ...formData, coinsReward: parseInt(e.target.value) })}
                  placeholder="Number of coins to reward"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text-secondary mb-2">
                  Minimum Purchase (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-3 py-3 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary placeholder-neutral-500 dark:placeholder-dark-text-tertiary transition-colors duration-200"
                  value={formData.minimumPurchase}
                  onChange={(e) => setFormData({ ...formData, minimumPurchase: parseInt(e.target.value) || 0 })}
                  placeholder="Minimum purchase amount"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text-secondary mb-2">
                  Max Usage (Optional)
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-3 py-3 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary placeholder-neutral-500 dark:placeholder-dark-text-tertiary transition-colors duration-200"
                  value={formData.maxUsage || ''}
                  onChange={(e) => setFormData({ ...formData, maxUsage: e.target.value ? parseInt(e.target.value) : undefined })}
                  placeholder="Maximum number of uses"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text-secondary mb-2">
                  Valid Until (Optional)
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-3 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary transition-colors duration-200"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 dark:border-dark-border-primary rounded bg-white dark:bg-dark-bg-tertiary"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-neutral-700 dark:text-dark-text-secondary">
                Activate scheme immediately
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200 dark:border-dark-border-primary">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-neutral-300 dark:border-dark-border-primary text-neutral-700 dark:text-dark-text-secondary rounded-lg hover:bg-neutral-50 dark:hover:bg-dark-bg-tertiary transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-primary-600 dark:bg-primary-700 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
              >
                {scheme ? 'Update Scheme' : 'Create Scheme'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SchemeManagement;