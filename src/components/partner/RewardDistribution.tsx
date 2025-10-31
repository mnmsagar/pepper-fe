import React, { useState } from 'react';
import { QrCode, Smartphone, Gift, CheckCircle, AlertCircle, Target, Search } from 'lucide-react';
import { Partner, RewardScheme } from '../../types';
import { useData } from '../../contexts/DataContext';

interface RewardDistributionProps {
  partner: Partner;
}

const RewardDistribution: React.FC<RewardDistributionProps> = ({ partner }) => {
  const [method, setMethod] = useState<'phone' | 'email' | 'qr'>('phone');
  const [contact, setContact] = useState('');
  const [selectedScheme, setSelectedScheme] = useState<RewardScheme | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [useCustomAmount, setUseCustomAmount] = useState(false);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'input' | 'otp' | 'success'>('input');
  const [isProcessing, setIsProcessing] = useState(false);
  const [schemeSearch, setSchemeSearch] = useState('');
  const { addTransaction, addScheme, updateMemberBalance, members, schemes, incrementSchemeUsage } = useData();

  const partnerSchemes = schemes.filter(s => s.partner_id === partner.id && s.is_active);
  const filteredSchemes = partnerSchemes.filter(scheme =>
    scheme.name.toLowerCase().includes(schemeSearch.toLowerCase()) ||
    scheme.description.toLowerCase().includes(schemeSearch.toLowerCase())
  );
  const finalAmount = useCustomAmount ? parseInt(customAmount) : (selectedScheme?.coins_reward || 0);

  const handleSendReward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScheme && !useCustomAmount) {
      alert('Please select a scheme or enter a custom amount.');
      return;
    }

    if (method === 'phone' || method === 'email') {
      setIsProcessing(true);
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('otp');
      setIsProcessing(false);
    } else {
      // QR method - direct processing
      await processReward();
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '1234') { // Mock OTP verification
      await processReward();
    } else {
      alert('Invalid OTP. Please try 1234 for demo.');
    }
  };

  const processReward = async () => {
      setIsProcessing(true);
      
      try {
        // Find member by contact (mock lookup)
        const memberRaw = members.find(m => m.user_id === contact);

        if (!memberRaw) {
          throw new Error('Member not found');
        }

        const member = {
          id: memberRaw.id,
          userId: memberRaw.user_id,
          coinBalance: memberRaw.coin_balance,
          totalCoinsEarned: memberRaw.total_coins_earned,
          totalCoinsRedeemed: memberRaw.total_coins_redeemed
        };

        // Add transaction
        addTransaction({
          from_user_id: partner.userId,
          to_user_id: member.userId,
          amount: finalAmount,
          transaction_type: 'reward',
          description: selectedScheme 
            ? `Reward from ${partner.companyName} - ${selectedScheme.name}`
            : `Custom reward from ${partner.companyName}`,
          partner_id: partner.id,
          scheme_id: selectedScheme?.id,
          metadata:{}
        });
        

        // Update member balance
        updateMemberBalance(member.id, finalAmount);

        // Increment scheme usage if scheme was used
        if (selectedScheme) {
          incrementSchemeUsage(selectedScheme.id);
        }

        setStep('success');
        resetForm();
      } catch (error) {
        console.error('Failed to process reward:', error);
        alert('Failed to process reward. Please try again.');
      } finally {
        setIsProcessing(false);
      }
  };

  const resetForm = () => {
    setStep('input');
    setContact('');
    setSelectedScheme(null);
    setCustomAmount('');
    setUseCustomAmount(false);
    setOtp('');
    setSchemeSearch('');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'purchase': return 'bg-info-100 dark:bg-info-900/20 text-info-800 dark:text-info-400';
      case 'volume': return 'bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400';
      case 'loyalty': return 'bg-secondary-100 dark:bg-secondary-900/20 text-secondary-800 dark:text-secondary-400';
      case 'special': return 'bg-warning-100 dark:bg-warning-900/20 text-warning-800 dark:text-warning-400';
      default: return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300';
    }
  };

  if (step === 'success') {
    return (
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-dark-text-primary">Reward Sent Successfully!</h2>
        
        <div className="bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-xl p-6 sm:p-8 text-center transition-colors duration-200">
          <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-success-500 dark:text-success-400 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-success-900 dark:text-success-300 mb-2">Coins Distributed</h3>
          <p className="text-success-700 dark:text-success-400 mb-2 text-sm sm:text-base">
            Successfully sent <strong>{finalAmount} coins</strong> to customer
          </p>
          <p className="text-success-600 dark:text-success-500 mb-4 text-sm sm:text-base">
            {selectedScheme ? `Using scheme: ${selectedScheme.name}` : 'Custom reward amount'}
          </p>
          <button
            onClick={resetForm}
            className="bg-success-600 dark:bg-success-700 text-white px-6 py-3 rounded-lg hover:bg-success-700 dark:hover:bg-success-600 transition-colors touch-manipulation"
          >
            Send Another Reward
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-dark-text-primary">Reward Customers</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reward Configuration */}
        <div className="space-y-6">
          {/* Method Selection */}
          <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 transition-colors duration-200">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-4">Contact Method</h3>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                onClick={() => setMethod('phone')}
                className={`p-3 rounded-lg border-2 transition-all touch-manipulation ${
                  method === 'phone'
                    ? 'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-neutral-200 dark:border-dark-border-primary hover:border-neutral-300 dark:hover:border-dark-border-secondary bg-white dark:bg-dark-bg-tertiary'
                }`}
              >
                <Smartphone className={`h-6 w-6 mx-auto mb-2 ${
                  method === 'phone' ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-400 dark:text-dark-text-tertiary'
                }`} />
                <p className={`text-sm font-medium ${
                  method === 'phone' ? 'text-primary-900 dark:text-primary-300' : 'text-neutral-700 dark:text-dark-text-secondary'
                }`}>Phone</p>
              </button>

              <button
                onClick={() => setMethod('email')}
                className={`p-3 rounded-lg border-2 transition-all touch-manipulation ${
                  method === 'email'
                    ? 'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-neutral-200 dark:border-dark-border-primary hover:border-neutral-300 dark:hover:border-dark-border-secondary bg-white dark:bg-dark-bg-tertiary'
                }`}
              >
                <Gift className={`h-6 w-6 mx-auto mb-2 ${
                  method === 'email' ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-400 dark:text-dark-text-tertiary'
                }`} />
                <p className={`text-sm font-medium ${
                  method === 'email' ? 'text-primary-900 dark:text-primary-300' : 'text-neutral-700 dark:text-dark-text-secondary'
                }`}>Email</p>
              </button>

              <button
                onClick={() => setMethod('qr')}
                className={`p-3 rounded-lg border-2 transition-all touch-manipulation ${
                  method === 'qr'
                    ? 'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-neutral-200 dark:border-dark-border-primary hover:border-neutral-300 dark:hover:border-dark-border-secondary bg-white dark:bg-dark-bg-tertiary'
                }`}
              >
                <QrCode className={`h-6 w-6 mx-auto mb-2 ${
                  method === 'qr' ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-400 dark:text-dark-text-tertiary'
                }`} />
                <p className={`text-sm font-medium ${
                  method === 'qr' ? 'text-primary-900 dark:text-primary-300' : 'text-neutral-700 dark:text-dark-text-secondary'
                }`}>QR Code</p>
              </button>
            </div>

            {step === 'input' && (
              <form onSubmit={handleSendReward} className="space-y-4">
                {(method === 'phone' || method === 'email') && (
                  <div>
                    <label htmlFor="contact" className="block text-sm font-medium text-neutral-700 dark:text-dark-text-secondary mb-2">
                      Customer {method === 'phone' ? 'Phone Number' : 'Email Address'}
                    </label>
                    <input
                      type={method === 'phone' ? 'tel' : 'email'}
                      id="contact"
                      required
                      className="block w-full px-3 py-3 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary placeholder-neutral-500 dark:placeholder-dark-text-tertiary transition-colors duration-200 text-base"
                      placeholder={method === 'phone' ? '+91-9876543210' : 'customer@example.com'}
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                    />
                  </div>
                )}

                <div className="flex items-center space-x-3 mb-4">
                  <input
                    type="checkbox"
                    id="useCustomAmount"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 dark:border-dark-border-primary rounded bg-white dark:bg-dark-bg-tertiary"
                    checked={useCustomAmount}
                    onChange={(e) => setUseCustomAmount(e.target.checked)}
                  />
                  <label htmlFor="useCustomAmount" className="text-sm font-medium text-neutral-700 dark:text-dark-text-secondary">
                    Use custom amount instead of scheme
                  </label>
                </div>

                {useCustomAmount ? (
                  <div>
                    <label htmlFor="customAmount" className="block text-sm font-medium text-neutral-700 dark:text-dark-text-secondary mb-2">
                      Custom Coins Amount
                    </label>
                    <input
                      type="number"
                      id="customAmount"
                      min="1"
                      max={partner.walletBalance}
                      required
                      className="block w-full px-3 py-3 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary placeholder-neutral-500 dark:placeholder-dark-text-tertiary transition-colors duration-200 text-base"
                      placeholder="Enter number of coins"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                    />
                    <p className="mt-1 text-sm text-neutral-600 dark:text-dark-text-secondary">
                      Available balance: {partner.walletBalance} coins
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text-secondary mb-2">
                      Select Reward Scheme
                    </label>
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-dark-text-tertiary" />
                      <input
                        type="text"
                        placeholder="Search schemes..."
                        className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary placeholder-neutral-500 dark:placeholder-dark-text-tertiary transition-colors duration-200 text-sm"
                        value={schemeSearch}
                        onChange={(e) => setSchemeSearch(e.target.value)}
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-2 border border-neutral-200 dark:border-dark-border-primary rounded-lg p-2 bg-white dark:bg-dark-bg-tertiary">
                      {filteredSchemes.map((scheme) => (
                        <button
                          key={scheme.id}
                          type="button"
                          onClick={() => setSelectedScheme(scheme)}
                          className={`w-full text-left p-3 rounded-lg border transition-all touch-manipulation ${
                            selectedScheme?.id === scheme.id
                              ? 'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                              : 'border-neutral-200 dark:border-dark-border-primary hover:border-neutral-300 dark:hover:border-dark-border-secondary bg-white dark:bg-dark-bg-secondary'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-neutral-900 dark:text-dark-text-primary text-sm">{scheme.name}</h4>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(scheme.category)}`}>
                              {scheme.category}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-600 dark:text-dark-text-secondary mb-2">{scheme.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{scheme.coins_reward} coins</span>
                            <span className="text-xs text-neutral-500 dark:text-dark-text-tertiary">Used {scheme.usage_count} times</span>
                          </div>
                        </button>
                      ))}
                      {filteredSchemes.length === 0 && (
                        <p className="text-center text-neutral-500 dark:text-dark-text-tertiary py-4 text-sm">
                          {schemeSearch ? 'No schemes match your search.' : 'No active schemes available.'}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing || (!contact && method !== 'qr') || (!selectedScheme && !useCustomAmount) || (useCustomAmount && !customAmount)}
                  className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-4 rounded-lg font-medium hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center touch-manipulation"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {method === 'qr' ? 'Processing...' : 'Sending OTP...'}
                    </>
                  ) : (
                    <>
                      <Gift className="h-5 w-5 mr-2" />
                      {method === 'qr' ? 'Generate QR Code' : 'Send OTP'}
                    </>
                  )}
                </button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="bg-info-50 dark:bg-info-900/20 border border-info-200 dark:border-info-800 rounded-lg p-4 transition-colors duration-200">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-info-500 dark:text-info-400 mr-2 flex-shrink-0" />
                    <p className="text-sm text-info-800 dark:text-info-300">
                      OTP sent to {contact}. Please enter the code to confirm the reward.
                    </p>
                  </div>
                </div>

                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-neutral-700 dark:text-dark-text-secondary mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    maxLength={6}
                    required
                    className="block w-full px-3 py-3 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-xl tracking-widest bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-dark-text-primary placeholder-neutral-500 dark:placeholder-dark-text-tertiary transition-colors duration-200"
                    placeholder="1234"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <p className="mt-1 text-sm text-neutral-600 dark:text-dark-text-secondary">Use 1234 for demo</p>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setStep('input')}
                    className="flex-1 bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-300 py-3 px-4 rounded-lg font-medium hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors touch-manipulation"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing || otp.length !== 4}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-4 rounded-lg font-medium hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all touch-manipulation"
                  >
                    {isProcessing ? 'Verifying...' : 'Confirm Reward'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Preview & Instructions */}
        <div className="space-y-6">
          {/* Reward Preview */}
          {(selectedScheme || useCustomAmount) && (
            <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-4">Reward Preview</h3>
              <div className="bg-gradient-to-r from-primary-50 dark:from-primary-900/30 to-secondary-50 dark:to-secondary-900/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Target className="h-8 w-8 text-primary-600 dark:text-primary-400 mr-3" />
                    <div>
                      <h4 className="font-semibold text-neutral-900 dark:text-dark-text-primary">
                        {selectedScheme ? selectedScheme.name : 'Custom Reward'}
                      </h4>
                      {selectedScheme && (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(selectedScheme.category)}`}>
                          {selectedScheme.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{finalAmount}</p>
                    <p className="text-sm text-neutral-600 dark:text-dark-text-secondary">coins</p>
                  </div>
                </div>
                {selectedScheme && (
                  <div className="bg-white dark:bg-dark-bg-tertiary rounded-lg p-3">
                    <p className="text-sm text-neutral-600 dark:text-dark-text-secondary mb-1">Conditions:</p>
                    <p className="text-sm text-neutral-800 dark:text-dark-text-primary">{selectedScheme.conditions}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* QR Code Display */}
          {method === 'qr' && step === 'input' && (selectedScheme || useCustomAmount) && (
            <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-4">QR Code for Customer</h3>
              <div className="bg-neutral-100 dark:bg-dark-bg-tertiary rounded-lg p-6 sm:p-8 text-center">
                <div className="w-32 h-32 sm:w-48 sm:h-48 bg-white dark:bg-dark-bg-secondary rounded-lg shadow-soft mx-auto flex items-center justify-center mb-4">
                  <QrCode className="h-16 w-16 sm:h-24 sm:w-24 text-neutral-400 dark:text-dark-text-tertiary" />
                </div>
                <p className="text-sm text-neutral-600 dark:text-dark-text-secondary mb-2">
                  Customer scans this QR code to receive
                </p>
                <p className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400">{finalAmount} coins</p>
                {selectedScheme && (
                  <p className="text-sm text-neutral-500 dark:text-dark-text-tertiary mt-1">via {selectedScheme.name}</p>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 transition-colors duration-200">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary mb-4">How it Works</h3>
            <div className="space-y-3">
              {method === 'qr' ? (
                <>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      1
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-dark-text-secondary">Select a reward scheme or enter custom amount</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      2
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-dark-text-secondary">Show the QR code to your customer</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      3
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-dark-text-secondary">Customer scans to receive coins instantly</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      1
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-dark-text-secondary">Enter customer's {method} and select reward scheme</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      2
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-dark-text-secondary">Customer receives OTP on their {method}</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      3
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-dark-text-secondary">Verify OTP to complete the reward transfer</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardDistribution;