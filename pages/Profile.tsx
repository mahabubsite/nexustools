import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Camera, Bell, CreditCard, Zap, Key, Lock, Check, Calendar, Download } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { BillingHistoryItem } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type Tab = 'general' | 'subscription' | 'security' | 'notifications';

const Profile: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const navigate = useNavigate();
  
  // General State
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saveMessage, setSaveMessage] = useState('');

  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState(false);

  // Notification State
  const [notifMarketing, setNotifMarketing] = useState(true);
  const [notifSecurity, setNotifSecurity] = useState(true);
  const [notifUpdates, setNotifUpdates] = useState(true);

  // Billing History State
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>([]);
  
  useEffect(() => {
      // In a real app, fetch from 'invoices' collection in Firestore
      // For now, mocking based on user plan
      if (user?.plan === 'golden') {
          setBillingHistory([
              { id: 'INV-001', date: new Date().toISOString(), description: 'Golden Plan (Monthly)', amount: '$4.99', status: 'paid' }
          ]);
      } else {
          setBillingHistory([]);
      }
  }, [user]);
  
  if (!user) {
      return <Navigate to="/auth" />;
  }

  const handleGeneralSave = () => {
    updateProfile({ name, bio });
    setSaveMessage('Profile updated successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handlePasswordSave = () => {
    setSaveMessage('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const downloadInvoice = (item: BillingHistoryItem) => {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(37, 99, 235); // Brand Blue
      doc.text('Nexus Tools', 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('Invoice #' + item.id, 14, 30);
      doc.text('Date: ' + new Date(item.date).toLocaleDateString(), 14, 35);

      // Bill To
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text('Bill To:', 14, 50);
      doc.setFontSize(10);
      doc.text(user.name, 14, 56);
      doc.text(user.email, 14, 61);

      // Table
      autoTable(doc, {
          startY: 70,
          head: [['Description', 'Amount', 'Status']],
          body: [
              [item.description, item.amount, item.status.toUpperCase()]
          ],
          theme: 'grid',
          headStyles: { fillColor: [37, 99, 235] },
      });

      // Total
      const finalY = (doc as any).lastAutoTable.finalY || 100;
      doc.setFontSize(12);
      doc.text(`Total: ${item.amount}`, 14, finalY + 15);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text('Thank you for your business. Nexus Tools Inc.', 14, finalY + 30);

      doc.save(`invoice_${item.id}.pdf`);
  };

  const renderContent = () => {
    switch (activeTab) {
        case 'general':
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">General Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Avatar */}
                        <div className="md:col-span-1 flex flex-col items-center">
                            <div className="relative group cursor-pointer">
                                <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
                                    <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
                                </div>
                                <div className="absolute bottom-0 right-0 bg-brand-600 p-2 rounded-full border-4 border-white dark:border-slate-900 text-white hover:bg-brand-700 transition-colors">
                                    <Camera className="h-4 w-4" />
                                </div>
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{user.name}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">{user.email}</p>
                            <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                                <Calendar className="h-3 w-3" />
                                <span>Member since {new Date(user.memberSince).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Fields */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-4 w-4 text-slate-400 dark:text-slate-600" />
                                        </div>
                                        <input 
                                            type="email" 
                                            value={user.email}
                                            disabled
                                            className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Bio</label>
                                <textarea 
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={4}
                                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all resize-none"
                                    placeholder="Tell us a bit about yourself..."
                                />
                                <div className="text-right text-xs text-slate-400 dark:text-slate-600 mt-2">0/500 characters</div>
                            </div>
                            
                            <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex justify-end items-center gap-4">
                                {saveMessage && <span className="text-green-600 dark:text-green-400 text-sm font-medium animate-pulse">{saveMessage}</span>}
                                <button 
                                    onClick={handleGeneralSave}
                                    className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-brand-500/20"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        case 'subscription':
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Subscription Plan</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your billing and subscription details.</p>
                        <p className="text-slate-400 text-xs mt-1">Member Since: <span className="font-semibold text-slate-300">{new Date(user.memberSince).toLocaleDateString()}</span></p>
                    </div>

                    <div className="bg-gradient-to-br from-brand-600 to-indigo-700 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <div className="text-brand-100 text-sm font-medium mb-1">Current Plan</div>
                                <div className="text-3xl font-extrabold mb-4 capitalize">{user.plan} Plan</div>
                                {user.plan === 'free' ? (
                                    <p className="text-brand-100 max-w-md text-sm leading-relaxed">
                                        You are currently on the free tier. Upgrade to Pro to unlock unlimited usage, API access, and priority support.
                                    </p>
                                ) : (
                                    <p className="text-brand-100 max-w-md text-sm leading-relaxed">
                                        You are enjoying all {user.plan} features. {user.planExpiry ? `Valid until ${new Date(user.planExpiry).toLocaleDateString()}` : ''}
                                    </p>
                                )}
                            </div>
                            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                                <Zap className="h-8 w-8 text-yellow-300" />
                            </div>
                        </div>
                        {user.plan === 'free' && (
                            <div className="relative z-10 mt-8">
                                <button 
                                    onClick={() => navigate('/pricing')}
                                    className="bg-white text-brand-700 px-6 py-3 rounded-lg font-bold hover:bg-brand-50 transition-colors shadow-lg"
                                >
                                    Upgrade to Pro
                                </button>
                            </div>
                        )}
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Billing History</h3>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                                    <tr>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Description</th>
                                        <th className="p-4">Amount</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Invoice</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {billingHistory.length > 0 ? billingHistory.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            <td className="p-4 text-slate-600 dark:text-slate-300">{new Date(item.date).toLocaleDateString()}</td>
                                            <td className="p-4 font-medium text-slate-900 dark:text-white">{item.description}</td>
                                            <td className="p-4 text-slate-600 dark:text-slate-300">{item.amount}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    item.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                                                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                                                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button 
                                                    onClick={() => downloadInvoice(item)}
                                                    className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 flex items-center gap-1 justify-end ml-auto"
                                                >
                                                    <Download className="h-4 w-4" /> Download
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-slate-500 dark:text-slate-400">
                                                No payment history found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        case 'security':
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Security Settings</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Update your password and secure your account.</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Key className="h-5 w-5 text-brand-600" /> Change Password
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Current Password</label>
                                <input 
                                    type="password" 
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">New Password</label>
                                <input 
                                    type="password" 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-600"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end items-center gap-4">
                             {saveMessage && <span className="text-green-600 dark:text-green-400 text-sm font-medium animate-pulse">{saveMessage}</span>}
                             <button onClick={handlePasswordSave} className="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors">Update Password</button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex justify-between items-center">
                        <div className="flex items-start gap-4">
                            <div className="bg-brand-100 dark:bg-slate-800 p-3 rounded-lg">
                                <Lock className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Two-Factor Authentication</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Add an extra layer of security to your account.</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                        </label>
                    </div>
                </div>
            );
        case 'notifications':
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Notification Preferences</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Choose what we can contact you about.</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
                        <div className="p-6 flex items-start gap-4">
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Marketing Emails</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Receive emails about new features and special offers.</p>
                            </div>
                            <div className="flex items-center h-full">
                                <button 
                                    onClick={() => setNotifMarketing(!notifMarketing)}
                                    className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${notifMarketing ? 'bg-brand-600 border-brand-600 text-white' : 'bg-transparent border-slate-300 dark:border-slate-600'}`}
                                >
                                    {notifMarketing && <Check className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="p-6 flex items-start gap-4">
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Security Alerts</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Get notified about suspicious activity on your account.</p>
                            </div>
                            <div className="flex items-center h-full">
                                <button 
                                    onClick={() => setNotifSecurity(!notifSecurity)}
                                    className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${notifSecurity ? 'bg-brand-600 border-brand-600 text-white' : 'bg-transparent border-slate-300 dark:border-slate-600'}`}
                                >
                                    {notifSecurity && <Check className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="p-6 flex items-start gap-4">
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Product Updates</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Receive our monthly newsletter with product changelogs.</p>
                            </div>
                            <div className="flex items-center h-full">
                                <button 
                                    onClick={() => setNotifUpdates(!notifUpdates)}
                                    className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${notifUpdates ? 'bg-brand-600 border-brand-600 text-white' : 'bg-transparent border-slate-300 dark:border-slate-600'}`}
                                >
                                    {notifUpdates && <Check className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        default:
            return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-12 pb-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Account Settings</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your profile, subscription, and preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 space-y-1">
                <button 
                    onClick={() => setActiveTab('general')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'general' ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm border border-slate-200 dark:border-slate-800' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/30'}`}
                >
                    <User className="h-5 w-5" /> General
                </button>
                <button 
                    onClick={() => setActiveTab('subscription')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'subscription' ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm border border-slate-200 dark:border-slate-800' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/30'}`}
                >
                    <CreditCard className="h-5 w-5" /> Subscription
                </button>
                <button 
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'security' ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm border border-slate-200 dark:border-slate-800' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/30'}`}
                >
                    <Shield className="h-5 w-5" /> Security
                </button>
                 <button 
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'notifications' ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm border border-slate-200 dark:border-slate-800' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/30'}`}
                >
                    <Bell className="h-5 w-5" /> Notifications
                </button>

                <div className="pt-8 mt-8 border-t border-slate-200 dark:border-slate-800">
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors font-medium border border-transparent hover:border-red-100 dark:hover:border-red-900/30">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
                {renderContent()}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;