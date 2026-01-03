import React, { useState } from 'react';
import { Mail, MapPin, MessageCircle, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        read: false,
        createdAt: serverTimestamp()
      });
      setStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-16 pb-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Get in touch</h1>
            <p className="text-slate-600 dark:text-slate-400">We'd love to hear from you. Please fill out this form.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-4 shadow-sm">
                    <Mail className="h-6 w-6 text-brand-600 dark:text-brand-400 mt-1" />
                    <div>
                        <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-1">Email</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">For general inquiries and support.</p>
                        <a href="mailto:support@nexustools.com" className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium">support@nexustools.com</a>
                    </div>
                </div>
                 <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-4 shadow-sm">
                    <MessageCircle className="h-6 w-6 text-brand-600 dark:text-brand-400 mt-1" />
                    <div>
                        <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-1">Live Chat</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">Available Mon-Fri, 9am-5pm EST.</p>
                        <button className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium">Start a chat</button>
                    </div>
                </div>
                 <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-4 shadow-sm">
                    <MapPin className="h-6 w-6 text-brand-600 dark:text-brand-400 mt-1" />
                    <div>
                        <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-1">Office</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">123 Tech Blvd, San Francisco, CA 94107</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-6 shadow-lg">
                {status === 'success' && (
                    <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-4 rounded-lg flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" /> Message sent successfully!
                    </div>
                )}
                {status === 'error' && (
                    <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" /> Failed to send message. Please try again.
                    </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">First Name</label>
                        <input 
                            type="text" 
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-600 focus:outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">Last Name</label>
                        <input 
                            type="text" 
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-600 focus:outline-none" 
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">Email</label>
                    <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-600 focus:outline-none" 
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">Message</label>
                    <textarea 
                        rows={4} 
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-600 focus:outline-none"
                    ></textarea>
                </div>
                <button 
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-brand-600 text-white font-bold py-3 rounded-lg hover:bg-brand-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {status === 'submitting' ? 'Sending...' : <><Send className="h-4 w-4" /> Send Message</>}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;