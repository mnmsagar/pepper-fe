import React, { useState } from 'react';
import { Building, Search, Filter, MoreVertical, Check, X, Eye } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const PartnersManagement: React.FC = () => {
  const { partners } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || partner.kyc_status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400';
      case 'pending': return 'bg-warning-100 dark:bg-warning-900/20 text-warning-800 dark:text-warning-400';
      case 'rejected': return 'bg-error-100 dark:bg-error-900/20 text-error-800 dark:text-error-400';
      default: return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-dark-text-primary">Partners Management</h2>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
          Add Partner
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
              placeholder="Search partners..."
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary placeholder-neutral-500 dark:placeholder-dark-text-tertiary transition-colors duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-dark-text-tertiary" />
            <select
              className="pl-10 pr-8 py-2 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Partners Table */}
      <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary overflow-hidden transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-dark-border-primary">
            <thead className="bg-neutral-50 dark:bg-dark-bg-tertiary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-dark-text-tertiary uppercase tracking-wider">
                  Partner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-dark-text-tertiary uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-dark-text-tertiary uppercase tracking-wider">
                  Wallet Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-dark-text-tertiary uppercase tracking-wider">
                  Coins Distributed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-dark-text-tertiary uppercase tracking-wider">
                  KYC Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-dark-text-tertiary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-bg-secondary divide-y divide-neutral-200 dark:divide-dark-border-primary">
              {filteredPartners.map((partner) => {
                return (
                  <tr key={partner.id} className="hover:bg-neutral-50 dark:hover:bg-dark-bg-tertiary transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                          <Building className="h-5 w-5 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral-900 dark:text-dark-text-primary">
                            {partner.company_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900 dark:text-dark-text-primary">Contact Info</div>
                      <div className="text-sm text-neutral-500 dark:text-dark-text-secondary">Available in full version</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900 dark:text-dark-text-primary">
                        ₹{partner.wallet_balance.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900 dark:text-dark-text-primary">
                        {partner.total_coins_distributed.toLocaleString()} coins
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(partner.kyc_status)}`}>
                        {partner.kyc_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300" title="View Details">
                          <Eye className="h-4 w-4" />
                        </button>
                        {partner.kyc_status === 'pending' && (
                          <>
                            <button className="text-success-600 dark:text-success-400 hover:text-success-900 dark:hover:text-success-300" title="Approve">
                              <Check className="h-4 w-4" />
                            </button>
                            <button className="text-error-600 dark:text-error-400 hover:text-error-900 dark:hover:text-error-300" title="Reject">
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button className="text-neutral-400 dark:text-dark-text-tertiary hover:text-neutral-600 dark:hover:text-dark-text-secondary" title="More Options">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredPartners.length === 0 && (
          <div className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-neutral-400 dark:text-dark-text-tertiary mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-dark-text-primary mb-2">No partners found</h3>
            <p className="text-neutral-500 dark:text-dark-text-secondary">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnersManagement;