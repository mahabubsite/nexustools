import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { PaymentRequest } from '../types';
import { Check, X, Clock, RefreshCw } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const AdminPayment: React.FC = () => {
  const { user, isAdmin, updateProfile } = useAuth();
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Security Check (Frontend only - Firestore rules handle backend)
  if (!user || !isAdmin) {
      return <Navigate to="/" />;
  }

  const fetchPayments = async () => {
    setLoading(true);
    try {
        const q = query(collection(db, "manual_payments"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentRequest));
        setPayments(data);
    } catch (e) {
        console.error("Error fetching payments", e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleAction = async (paymentId: string, status: 'approved' | 'rejected', userId: string, plan: string) => {
      try {
          // 1. Update Payment Status
          const paymentRef = doc(db, "manual_payments", paymentId);
          await updateDoc(paymentRef, { status: status });

          // 2. If Approved, Update User Plan (Mocking logic since we can't run cloud functions here)
          if (status === 'approved') {
              // In a real app, a Cloud Function would listen to the payment update and update the user.
              // Here, we just update the local state for demonstration if it matches the current user, 
              // or ideally we would update the `users` collection in Firestore.
              // Note: We need a Firestore rule allowing admins to update users.
              
              // Simulating the update in the UI list
              if (user.uid === userId) {
                  updateProfile({ plan: plan as any, planExpiry: new Date(Date.now() + 30*24*60*60*1000).toISOString() });
              }
          }

          // Refresh list
          fetchPayments();
      } catch (e) {
          console.error("Action failed", e);
          alert("Failed to update status");
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Payment Approvals</h1>
            <button onClick={fetchPayments} className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-4 py-2 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300">
                <RefreshCw className="h-4 w-4" /> Refresh
            </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-bold text-xs">
                        <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">User</th>
                            <th className="p-4">Plan / Amount</th>
                            <th className="p-4">Method</th>
                            <th className="p-4">TrxID / Sender</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {loading ? (
                            <tr><td colSpan={7} className="p-8 text-center">Loading...</td></tr>
                        ) : payments.length === 0 ? (
                            <tr><td colSpan={7} className="p-8 text-center">No payment requests found.</td></tr>
                        ) : (
                            payments.map(payment => (
                                <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4 whitespace-nowrap">
                                        {payment.createdAt?.seconds ? new Date(payment.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-slate-900 dark:text-white">{payment.email}</div>
                                        <div className="text-xs">{payment.userId}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="font-bold text-brand-600 dark:text-brand-400 capitalize">{payment.plan}</span>
                                        <div className="text-xs">${payment.amount}</div>
                                    </td>
                                    <td className="p-4 capitalize">{payment.method}</td>
                                    <td className="p-4 font-mono text-xs">
                                        <div className="font-bold text-slate-900 dark:text-white">{payment.transactionId}</div>
                                        <div>{payment.senderNumber}</div>
                                    </td>
                                    <td className="p-4">
                                        <StatusBadge status={payment.status} />
                                    </td>
                                    <td className="p-4 text-right">
                                        {payment.status === 'pending' && (
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => handleAction(payment.id!, 'approved', payment.userId, payment.plan)}
                                                    className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                                                    title="Approve"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(payment.id!, 'rejected', payment.userId, payment.plan)}
                                                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                                                    title="Reject"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'approved') return <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300 font-medium">Approved</span>;
    if (status === 'rejected') return <span className="bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300 font-medium">Rejected</span>;
    return <span className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300 font-medium flex items-center gap-1 w-fit"><Clock className="h-3 w-3" /> Pending</span>;
};

export default AdminPayment;