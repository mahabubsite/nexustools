import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { CheckCircle2, AlertCircle, Copy } from 'lucide-react';

const PaymentSubmit: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const plan = searchParams.get('plan') as 'golden' | 'custom';
  const price = searchParams.get('price');
  const methodId = searchParams.get('method');
  const billing = searchParams.get('billing');

  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Conversion logic
  const exchangeRate = 120;
  const bdtAmount = Math.ceil(parseFloat(price || '0') * exchangeRate);

  const getMethodDetails = (id: string | null) => {
      switch(id) {
          case 'bkash': return { name: 'bKash', number: '01405205660', type: 'Personal' };
          case 'nagad': return { name: 'Nagad', number: '01405205660', type: 'Personal' };
          case 'rocket': return { name: 'Rocket', number: '01835959202', type: 'Personal' };
          case 'bank': return { name: 'Bank Transfer', number: 'Off Bank Transfer', type: 'DBBL' };
          default: return { name: 'Unknown', number: '', type: '' };
      }
  };

  const methodDetails = getMethodDetails(methodId);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) return;
      setLoading(true);
      setError('');

      try {
          // Add to manual_payments collection
          await addDoc(collection(db, "manual_payments"), {
              userId: user.uid || 'guest',
              email: user.email,
              plan: plan,
              amount: price,
              amountBdt: bdtAmount, // Store BDT amount too
              billingCycle: billing,
              method: methodDetails.name,
              senderNumber: senderNumber,
              transactionId: trxId,
              status: 'pending',
              createdAt: serverTimestamp()
          });

          setSuccess(true);
      } catch (err: any) {
          console.error("Payment submission error", err);
          setError('Failed to submit payment details. Please try again.');
      } finally {
          setLoading(false);
      }
  };

  if (success) {
      return (
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl max-w-md text-center border border-slate-200 dark:border-slate-800">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Payment Submitted!</h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                      Your transaction details have been received. An admin will verify your payment and activate your <strong>{plan}</strong> plan shortly.
                  </p>
                  <button 
                    onClick={() => navigate('/profile')} 
                    className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition-colors"
                  >
                      Go to Dashboard
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 transition-colors">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="bg-brand-600 p-6 text-white text-center">
                <h2 className="text-xl font-bold">Confirm Payment</h2>
                <p className="opacity-90">Please send money to the account below</p>
            </div>
            
            <div className="p-8 space-y-8">
                {/* Instruction Box */}
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{methodDetails.name} ({methodDetails.type})</span>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-2xl font-mono font-bold text-slate-900 dark:text-white">{methodDetails.number}</span>
                        {methodDetails.number !== 'Off Bank Transfer' && (
                            <button onClick={() => navigator.clipboard.writeText(methodDetails.number)} className="text-brand-600 hover:text-brand-700">
                                <Copy className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                    <p className="text-base text-slate-700 dark:text-slate-200 mt-4 font-medium">
                        Send exactly <span className="text-brand-600 dark:text-brand-400 font-bold text-xl">৳{bdtAmount}</span> BDT
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        (Equivalent to ${price} USD at rate 1 USD = {exchangeRate} BDT)
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Sender Number</label>
                        <input 
                            type="text" 
                            required
                            value={senderNumber}
                            onChange={e => setSenderNumber(e.target.value)}
                            placeholder="e.g., 017xxxxxxxx"
                            className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Transaction ID (TrxID)</label>
                        <input 
                            type="text" 
                            required
                            value={trxId}
                            onChange={e => setTrxId(e.target.value)}
                            placeholder="e.g., 8J3K2L9M"
                            className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 uppercase font-mono"
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                            <AlertCircle className="h-4 w-4" /> {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-70"
                    >
                        {loading ? 'Submitting...' : 'Submit Payment Details'}
                    </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSubmit;