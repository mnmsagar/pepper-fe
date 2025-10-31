import React, { useMemo, useState } from 'react';
import { Users, Search, Filter, Plus, Edit, Trash2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const MembersManagement: React.FC = () => {
  const { members, addMember, updateMember, deleteMember } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [minBalance, setMinBalance] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    user_id: '',
    coin_balance: 0,
    total_coins_earned: 0,
    total_coins_redeemed: 0,
    demographics: {},
    event_registrations: [] as string[],
  });

  const filteredMembers = useMemo(() => {
    const min = minBalance ? parseInt(minBalance) : 0;
    return members.filter(m => {
      const matchesSearch = m.user_id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMin = m.coin_balance >= min;
      return matchesSearch && matchesMin;
    });
  }, [members, searchTerm, minBalance]);

  const startCreate = () => {
    setEditingId(null);
    setFormData({ user_id: '', coin_balance: 0, total_coins_earned: 0, total_coins_redeemed: 0, demographics: {}, event_registrations: [] });
    setShowForm(true);
  };

  const startEdit = (id: string) => {
    const m = members.find(m => m.id === id);
    if (!m) return;
    setEditingId(id);
    setFormData({
      user_id: m.user_id,
      coin_balance: m.coin_balance,
      total_coins_earned: m.total_coins_earned,
      total_coins_redeemed: m.total_coins_redeemed,
      demographics: m.demographics,
      event_registrations: m.event_registrations,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateMember(editingId, { ...formData });
    } else {
      await addMember({ ...formData });
    }
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-dark-text-primary">Members Management</h2>
        <button onClick={startCreate} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" /> Add Member
        </button>
      </div>

      <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-dark-text-tertiary" />
            <input
              type="text"
              placeholder="Search by user ID..."
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-dark-text-tertiary" />
            <input
              type="number"
              min="0"
              placeholder="Min balance"
              className="pl-10 pr-3 py-2 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary"
              value={minBalance}
              onChange={(e) => setMinBalance(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-dark-border-primary">
            <thead className="bg-neutral-50 dark:bg-dark-bg-tertiary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-dark-text-tertiary uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-dark-text-tertiary uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-dark-text-tertiary uppercase tracking-wider">Earned</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-dark-text-tertiary uppercase tracking-wider">Redeemed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-dark-text-tertiary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-bg-secondary divide-y divide-neutral-200 dark:divide-dark-border-primary">
              {filteredMembers.map(m => (
                <tr key={m.id} className="hover:bg-neutral-50 dark:hover:bg-dark-bg-tertiary">
                  <td className="px-6 py-4 text-sm text-neutral-900 dark:text-dark-text-primary">{m.user_id}</td>
                  <td className="px-6 py-4 text-sm text-neutral-900 dark:text-dark-text-primary">{m.coin_balance}</td>
                  <td className="px-6 py-4 text-sm text-neutral-900 dark:text-dark-text-primary">{m.total_coins_earned}</td>
                  <td className="px-6 py-4 text-sm text-neutral-900 dark:text-dark-text-primary">{m.total_coins_redeemed}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <button className="text-primary-600 dark:text-primary-400 hover:text-primary-800" onClick={() => startEdit(m.id)} title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-error-600 dark:text-error-400 hover:text-error-800" onClick={() => deleteMember(m.id)} title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-neutral-400 dark:text-dark-text-tertiary mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-dark-text-primary mb-2">No members found</h3>
            <p className="text-neutral-500 dark:text-dark-text-secondary">Try adjusting your search or add a new member.</p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-4">{editingId ? 'Edit Member' : 'Add Member'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text-secondary mb-1">User ID</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary"
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text-secondary mb-1">Balance</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary"
                    value={formData.coin_balance}
                    onChange={(e) => setFormData({ ...formData, coin_balance: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text-secondary mb-1">Earned</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary"
                    value={formData.total_coins_earned}
                    onChange={(e) => setFormData({ ...formData, total_coins_earned: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text-secondary mb-1">Redeemed</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary"
                    value={formData.total_coins_redeemed}
                    onChange={(e) => setFormData({ ...formData, total_coins_redeemed: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4 border-t border-neutral-200 dark:border-dark-border-primary">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-neutral-300 dark:border-dark-border-primary rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">{editingId ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersManagement;

