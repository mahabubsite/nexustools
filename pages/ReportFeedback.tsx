import React, { useState } from 'react';
import { Flag, Send, Bug, Lightbulb, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ReportFeedback: React.FC = () => {
  const [type, setType] = useState<'bug' | 'feature' | 'feedback'>('bug');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      await addDoc(collection(db, 'reports'), {
        type,
        subject,
        message,
        email,
        status: 'new',
        createdAt: serverTimestamp()
      });
      setStatus('success');
      setSubject('');
      setMessage('');
      setEmail('');
    } catch (error) {
      console.error("Error sending report:", error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-16 pb-20 transition-colors">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Report & Feedback</h1>
            <p className="text-slate-600 dark:text-slate-400">Found a bug? Have a great idea? Let us know!</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
            <div className="flex gap-4 mb-8 justify-center flex-wrap">
                <button 
                    onClick={() => setType('bug')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${type === 'bug' ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}`}
                >
                    <Bug className="h-5 w-5" /> Bug Report
                </button>
                <button 
                    onClick={() => setType('feature')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${type === 'feature' ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}`}
                >
                    <Lightbulb className="h-5 w-5" /> Feature Request
                </button>
                <button 
                    onClick={() => setType('feedback')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${type === 'feedback' ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}`}
                >
                    <MessageSquare className="h-5 w-5" /> General Feedback
                </button>
            </div>

            {status === 'success' ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Thank you!</h3>
                    <p className="text-slate-500 mb-6">Your report has been submitted successfully. We appreciate your input.</p>
                    <button onClick={() => setStatus('idle')} className="text-brand-600 font-medium hover:underline">Submit another report</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {status === 'error' && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" /> Failed to submit. Please try again.
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject</label>
                        <input 
                            type="text" 
                            required
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder={type === 'bug' ? "e.g., Tool X is crashing on mobile" : "e.g., Add Dark Mode support"}
                            className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email (Optional)</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="We may contact you for more details"
                            className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                        <textarea 
                            rows={6}
                            required
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Describe the issue or your idea in detail..."
                            className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        ></textarea>
                    </div>

                    <button 
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {status === 'submitting' ? 'Submitting...' : <><Send className="h-4 w-4" /> Submit Report</>}
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default ReportFeedback;