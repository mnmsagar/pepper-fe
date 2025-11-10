import React, { useState } from "react";
import { CreditCard, Wallet, AlertCircle, CheckCircle } from "lucide-react";
import { Partner } from "../../types";
import { useData } from "../../contexts/DataContext";
import { useCreateOrder } from "../../hooks/razorpay/useCreateOrder";
import { useUpdateOrder } from "../../hooks/razorpay/useUpdateOrder";

interface CoinPurchaseProps {
  partner: Partner;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CoinPurchase: React.FC<CoinPurchaseProps> = ({ partner }) => {
  const [amount, setAmount] = useState("");
  const [coins, setCoins] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const { addTransaction, updatePartnerBalance } = useData();
  const { mutateAsync: createOrder } = useCreateOrder();
  const { mutateAsync: updateOrder } = useUpdateOrder();

  const coinPackages = [
    { coins: 100, price: 100, discount: 0 },
    { coins: 500, price: 450, discount: 10 },
    { coins: 1000, price: 850, discount: 15 },
    { coins: 5000, price: 4000, discount: 20 },
  ];

  const handleQuickSelect = (pkg: { coins: number; price: number }) => {
    setAmount(pkg.price.toString());
    setCoins(pkg.coins);
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseInt(amount) < 100) return;
    setIsProcessing(true);

    try {
      // ✅ Step 1: Create Razorpay order via backend
      // const res = await fetch(
      //   "http://localhost:3000/partner/razorpay/create-order",
      //   {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       amount: parseInt(amount),
      //       coins: parseInt(coins),
      //     }),
      //   }
      // );

      // isko poora react query se h kr do ab

      const order = await createOrder({
        amount: parseInt(amount),
        coins: parseInt(coins),
      });

      if (!order?.id) throw new Error("Failed to create Razorpay order");

      // ✅ Step 2: Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Pepper Partner Wallet",
        description: `Coin Purchase of ₹${amount}`,
        order_id: order.id,
        prefill: {
          name: partner.companyName || "Partner",
          email: partner.email || "test@example.com",
        },
        theme: { color: "#6d28d9" },

        // ✅ Step 3: Success Handler
        handler: async function (response: any) {
          // You can also call your backend to verify signature here if needed
          const purchaseAmount = parseInt(amount);
          const coinsReceived = purchaseAmount;

          await updateOrder({
            razorpayOrderId: order.id,
            razorpayPaymentId: response.razorpay_payment_id,
          });

          addTransaction({
            toUserId: partner.userId,
            amount: coinsReceived,
            type: "purchase",
            description: `Purchased ${coinsReceived} coins for ₹${purchaseAmount}`,
            partnerId: partner.id,
          });

          updatePartnerBalance(partner.id, purchaseAmount);
          setSuccess(true);
          setAmount("");
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal closed");
          },
        },
      };

      // ✅ Step 4: Open Razorpay modal
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Purchase failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ Success Screen
  if (success) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-dark-text-primary">
          Purchase Successful!
        </h2>

        <div className="bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-xl p-8 text-center">
          <CheckCircle className="h-16 w-16 text-success-500 dark:text-success-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-success-900 dark:text-success-300 mb-2">
            Payment Processed
          </h3>
          <p className="text-success-700 dark:text-success-400 mb-4">
            Your coins have been added to your wallet successfully.
          </p>
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

  // ✅ Purchase Form UI
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-dark-text-primary">
        Buy Coins
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coin Packages */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-6">
            <h3 className="text-lg font-semibold mb-4">Popular Packages</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coinPackages.map((pkg) => (
                <button
                  key={pkg.coins}
                  onClick={() => handleQuickSelect(pkg)}
                  className="p-4 border rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all text-left"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold">{pkg.coins} Coins</span>
                    {pkg.discount > 0 && (
                      <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                        {pkg.discount}% OFF
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-primary-600">
                    ₹{pkg.price}
                  </div>
                  {pkg.discount > 0 && (
                    <div className="text-sm text-gray-500 line-through">
                      ₹{pkg.coins}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Wallet Balance */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 mb-1">Current Wallet Balance</p>
                <p className="text-3xl font-bold">
                  ₹{partner.walletBalance.toLocaleString()}
                </p>
              </div>
              <Wallet className="h-12 w-12 text-primary-200" />
            </div>
          </div>
        </div>

        {/* Custom Amount Form */}
        <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-6">
          <h3 className="text-lg font-semibold mb-4">Custom Amount</h3>
          <form onSubmit={handlePurchase} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                min="100"
                step="10"
                required
                className="block w-full pl-3 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {amount && (
                <p className="mt-2 text-sm text-gray-600">
                  You’ll receive{" "}
                  <span className="font-medium text-primary-600">{amount}</span>{" "}
                  coins
                </p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <AlertCircle className="h-5 w-5 inline mr-2" />
              Secure payment powered by Razorpay
            </div>

            <button
              type="submit"
              disabled={!amount || parseInt(amount) < 100 || isProcessing}
              className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-4 rounded-lg font-medium hover:from-primary-700 hover:to-secondary-700 disabled:opacity-50 flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Pay ₹{amount || "0"}
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
