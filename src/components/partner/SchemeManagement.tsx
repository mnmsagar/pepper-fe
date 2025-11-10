import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Target,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";
import { Partner, RewardScheme } from "../../types";
import { useCreateScheme } from "../../hooks/rewardScheme/UseCreateScheme";

interface SchemeManagementProps {
  partner: Partner;
}

const SchemeManagement: React.FC<SchemeManagementProps> = ({ partner }) => {
  const [schemes, setSchemes] = useState<RewardScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const createSchemeMutation = useCreateScheme();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<
    "all" | "purchase" | "volume" | "loyalty" | "special"
  >("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingScheme, setEditingScheme] = useState<RewardScheme | null>(null);

  // 🔹 Fetch Schemes from backend
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/reward-scheme/user/${
            partner.id
          }`
        );
        const data = await res.json();
        setSchemes(data);
      } catch (err) {
        console.error("Failed to load schemes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, [partner.id]);

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch =
      scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || scheme.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "purchase":
        return "bg-info-100 dark:bg-info-900/20 text-info-800 dark:text-info-400";
      case "volume":
        return "bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400";
      case "loyalty":
        return "bg-secondary-100 dark:bg-secondary-900/20 text-secondary-800 dark:text-secondary-400";
      case "special":
        return "bg-warning-100 dark:bg-warning-900/20 text-warning-800 dark:text-warning-400";
      default:
        return "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "purchase":
        return Target;
      case "volume":
        return TrendingUp;
      case "loyalty":
        return Users;
      case "special":
        return Calendar;
      default:
        return Target;
    }
  };

  const handleToggleActive = (schemeId: string) => {
    setSchemes((prev) =>
      prev.map((s) =>
        s.id === schemeId ? { ...s, isActivated: !s.isActivated } : s
      )
    );
  };

  const handleDeleteScheme = async (schemeId: string) => {
    if (!window.confirm("Are you sure you want to delete this scheme?")) return;
    try {
      await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/reward-scheme/${schemeId}`,
        {
          method: "DELETE",
        }
      );
      setSchemes((prev) => prev.filter((s) => s.id !== schemeId));
    } catch (err) {
      console.error("Failed to delete scheme:", err);
      alert("Failed to delete scheme");
    }
  };

  const handleSchemeCreated = (newScheme: RewardScheme) => {
    setSchemes((prev) => [newScheme, ...prev]);
  };

  if (loading) {
    return (
      <p className="text-center py-8 text-neutral-500">Loading schemes...</p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-dark-text-primary">
          Reward Schemes
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" /> Create New Scheme
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search schemes..."
            className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <select
            className="pl-10 pr-8 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
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

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSchemes.length > 0 ? (
          filteredSchemes.map((scheme) => {
            const Icon = getCategoryIcon(scheme.category);
            const usagePercentage = scheme.maxRedemptions
              ? (scheme.usageCount / scheme.maxRedemptions) * 100
              : 0;

            return (
              <div
                key={scheme.id}
                className="bg-white dark:bg-dark-bg-secondary rounded-xl border border-neutral-200 p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-primary-600 text-white rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{scheme.name}</h3>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${getCategoryColor(
                          scheme.category
                        )}`}
                      >
                        {scheme.category}
                      </span>
                    </div>
                  </div>
                  <button
                  //@ts-ignore
                    onClick={() => handleToggleActive(scheme.id)}
                    className="p-1 rounded-lg hover:bg-neutral-100"
                  >
                    {scheme.isActivated ? (
                      <ToggleRight className="text-success-500 h-6 w-6" />
                    ) : (
                      <ToggleLeft className="text-neutral-400 h-6 w-6" />
                    )}
                  </button>
                </div>

                <p className="text-sm text-neutral-600 mb-3">
                  {scheme.description}
                </p>

                <div className="bg-neutral-50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-neutral-700 mb-1">
                    Conditions:
                  </p>
                  <p className="text-sm text-neutral-600">
                    {scheme.conditions}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-neutral-600">Reward</p>
                    <p className="text-lg font-bold text-primary-600">
                      {scheme.coinReward} coins
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Min. Purchase</p>
                    <p className="text-lg font-bold">
                      ₹{scheme.minimumPurchase?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>

                {scheme.maxRedemptions && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Usage</span>
                      <span>
                        {scheme.usageCount} / {scheme.maxRedemptions}
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="text-sm text-neutral-500">
                    Used {scheme.usageCount} times
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingScheme(scheme)}
                      className="p-2 text-neutral-400 hover:text-primary-600"
                      title="Edit Scheme"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                    //@ts-ignore
                      onClick={() => handleDeleteScheme(scheme.id)}
                      className="p-2 text-neutral-400 hover:text-error-600"
                      title="Delete Scheme"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 col-span-2">
            <Target className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No schemes found</h3>
            <p className="text-neutral-500 mb-4">
              Try adjusting filters or create a new reward scheme.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
            >
              Create New Scheme
            </button>
          </div>
        )}
      </div>

      {(showCreateForm || editingScheme) && (
        <SchemeFormModal
          partnerId={partner.id}
          scheme={editingScheme}
          onClose={() => {
            setShowCreateForm(false);
            setEditingScheme(null);
          }}
          onSchemeCreated={handleSchemeCreated}
        />
      )}
    </div>
  );
};

// 🔹 Scheme Form Modal
interface SchemeFormModalProps {
  partnerId: string;
  scheme?: RewardScheme | null;
  onClose: () => void;
  onSchemeCreated: (scheme: RewardScheme) => void;
}

const SchemeFormModal: React.FC<SchemeFormModalProps> = ({
  partnerId,
  scheme,
  onClose,
  onSchemeCreated,
}) => {
  const createSchemeMutation = useCreateScheme();

  const [formData, setFormData] = useState({
    name: scheme?.name || "",
    description: scheme?.description || "",
    conditions: scheme?.conditions || "",
    coinReward: scheme?.coinReward || 0,
    category: scheme?.category || "purchase",
    minimumPurchase: scheme?.minimumPurchase || 0,
    maxRedemptions: scheme?.maxRedemptions || 1,
    startDate: "",
    endDate: "",
    isActivated: scheme?.isActivated ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      userId: Number(partnerId),
      name: formData.name,
      description: formData.description,
      conditions: formData.conditions,
      coinReward: Number(formData.coinReward),
      category: formData.category,
      minimumPurchase: Number(formData.minimumPurchase),
      maxRedemptions: Number(formData.maxRedemptions),
      startDate: formData.startDate,
      endDate: formData.endDate,
      isActivated: formData.isActivated,
    };

    try {
      const newScheme = await createSchemeMutation.mutateAsync(payload);
      onSchemeCreated(newScheme);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create scheme");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-xl p-6 w-full max-w-2xl">
        <h3 className="text-lg font-semibold mb-4">
          {scheme ? "Edit Scheme" : "Create New Scheme"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Scheme name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="border rounded-lg px-3 py-3"
            />
            <select
              value={formData.category}
              onChange={(e) =>
                //@ts-ignore
                setFormData({ ...formData, category: e.target.value })
              }
              className="border rounded-lg px-3 py-3"
            >
              <option value="purchase">Purchase Based</option>
              <option value="volume">Volume Based</option>
              <option value="loyalty">Loyalty Rewards</option>
              <option value="special">Special Offers</option>
            </select>
          </div>

          <textarea
            placeholder="Description"
            required
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="border rounded-lg px-3 py-3 w-full"
          />
          <textarea
            placeholder="Conditions"
            required
            rows={3}
            value={formData.conditions}
            onChange={(e) =>
              setFormData({ ...formData, conditions: e.target.value })
            }
            className="border rounded-lg px-3 py-3 w-full"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Coin Reward"
              value={formData.coinReward}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  coinReward: Number(e.target.value),
                })
              }
              className="border rounded-lg px-3 py-3"
            />
            <input
              type="number"
              placeholder="Min Purchase"
              value={formData.minimumPurchase}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  minimumPurchase: Number(e.target.value),
                })
              }
              className="border rounded-lg px-3 py-3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              className="border rounded-lg px-3 py-3"
            />
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              className="border rounded-lg px-3 py-3"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isActivated}
              onChange={(e) =>
                setFormData({ ...formData, isActivated: e.target.checked })
              }
            />
            <label>Activate scheme immediately</label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createSchemeMutation.isPending}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg"
            >
              {createSchemeMutation.isPending
                ? "Saving..."
                : scheme
                ? "Update Scheme"
                : "Create Scheme"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchemeManagement;
