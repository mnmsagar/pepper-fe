import React, { useState } from 'react';
import { CreditCard, Wallet, AlertCircle, CheckCircle } from 'lucide-react';
import { Partner } from '../../types';
import { useData } from '../../contexts/DataContext';

interface CoinPurchaseProps {
  partner: Partner;
}

const CoinPurchase: React.FC<CoinPurchaseProps> = ({ partner }) => {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const { addTransaction, updatePartnerBalance } = useData();

  const coinPackages = [
    { coins: 100, price: 100, discount: 0 },
    { coins: 500, price: 450, discount: 10 },
    { coins: 1000, price: 850, discount: 15 },
    { coins: 5000, price: 4000, discount: 20 },
  ];

  const handleQuickSelect = (pkg: { coins: number; price: number }) => {
    setAmount(pkg.price.toString());
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const purchaseAmount = parseInt(amount);
      const coinsReceived = purchaseAmount; // 1:1 ratio for simplicity

      // Add transaction
      addTransaction({
        toUserId: partner.userId,
        amount: coinsReceived,
        type: 'purchase',
        description: `Purchased ${coinsReceived} coins for ₹${purchaseAmount}`,
        partnerId: partner.id,
      });

      // Update partner balance
      updatePartnerBalance(partner.id, purchaseAmount);

      setSuccess(true);
      setAmount('');
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-dark-text-primary">Purchase Successful!</h2>
        
        <div className="bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-xl p-8 text-center transition-colors duration-200">
          <CheckCircle className="h-16 w-16 text-success-500 dark:text-success-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-success-900 dark:text-success-300 mb-2">Payment Processed</h3>
          <p className="text-success-700 dark:text-success-400 mb-4">Your coins have been added to your wallet successfully.</p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-success-600 dark:bg-success-700 text-white px-6 py-2 rounded-lg hover:bg-success-700 dark:hover:bg-success-600 transition-colors"
          >
            Make Another Purchase
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-dark-text-primary">Buy Coins</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coin Packages */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-6 transition-colors duration-200">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-4">Popular Packages</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coinPackages.map((pkg) => (
                <button
                  key={pkg.coins}
                  onClick={() => handleQuickSelect(pkg)}
                  className="p-4 border border-neutral-200 dark:border-dark-border-primary rounded-lg hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-left bg-white dark:bg-dark-bg-tertiary"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-neutral-900 dark:text-dark-text-primary">{pkg.coins} Coins</span>
                    {pkg.discount > 0 && (
                      <span className="bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400 text-xs font-medium px-2 py-1 rounded-full">
                        {pkg.discount}% OFF
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">₹{pkg.price}</div>
                  {pkg.discount > 0 && (
                    <div className="text-sm text-neutral-500 dark:text-dark-text-tertiary line-through">
                      ₹{pkg.coins}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Current Balance */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 mb-1">Current Wallet Balance</p>
                <p className="text-3xl font-bold">₹{partner.walletBalance.toLocaleString()}</p>
              </div>
              <Wallet className="h-12 w-12 text-primary-200" />
            </div>
          </div>
        </div>

        {/* Purchase Form */}
        <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-6 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-4">Custom Amount</h3>
          
          <form onSubmit={handlePurchase} className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-neutral-700 dark:text-dark-text-secondary mb-2">
                Amount (₹)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-neutral-500 dark:text-dark-text-tertiary sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  id="amount"
                  min="100"
                  step="10"
                  required
                  className="block w-full pl-7 pr-3 py-3 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary placeholder-neutral-500 dark:placeholder-dark-text-tertiary transition-colors duration-200"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              {amount && (
                <p className="mt-2 text-sm text-neutral-600 dark:text-dark-text-secondary">
                  You'll receive <span className="font-medium text-primary-600 dark:text-primary-400">{amount} coins</span>
                </p>
              )}
            </div>

            <div className="bg-info-50 dark:bg-info-900/20 border border-info-200 dark:border-info-800 rounded-lg p-4 transition-colors duration-200">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-info-500 dark:text-info-400 mr-2 mt-0.5" />
                <div className="text-sm text-info-800 dark:text-info-300">
                  <p className="font-medium mb-1">Payment Information</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Minimum purchase: ₹100</li>
                    <li>1 Rupee = 1 Coin</li>
                    <li>Instant wallet top-up</li>
                    <li>Secure payment via Razorpay</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!amount || parseInt(amount) < 100 || isProcessing}
              className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-4 rounded-lg font-medium hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Pay ₹{amount || '0'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CoinPurchase;