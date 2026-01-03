import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Pricing: React.FC = () => {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBuy = (plan: string, price: string) => {
    if (!user) {
        navigate('/auth?mode=signup');
        return;
    }
    // Encode details to pass to payment page
    navigate(`/payment/methods?plan=${plan}&price=${price}&billing=${billing}`);
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white dark:bg-slate-950 transition-colors">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl mb-4">
          Choose a Plan for <span className="text-brand-600 dark:text-brand-400">Your Needs</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8">
          Unlock the full potential of DevToolbox with our premium plans.
        </p>
        
        {/* Toggle */}
        <div className="flex items-center justify-center gap-4">
          <span className={`text-sm font-semibold ${billing === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>Monthly</span>
          <button 
            onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
            className="relative inline-flex h-8 w-14 items-center rounded-full bg-brand-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            <span
              className={`${
                billing === 'yearly' ? 'translate-x-7' : 'translate-x-1'
              } inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ease-in-out`}
            />
          </button>
          <span className={`text-sm font-semibold ${billing === 'yearly' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>Yearly <span className="text-brand-600 dark:text-brand-400 text-xs">(Save 20%)</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        
        {/* Guest Plan */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-all flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Guest (Free)</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Essential tools for casual users.</p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$0</span>
            <span className="text-slate-500 dark:text-slate-400"> / month</span>
          </div>
          <div className="space-y-4 flex-1 mb-8">
             <FeatureItem text="Access to basic tools" />
             <FeatureItem text="Limited daily usage" />
             <FeatureItem text="Standard processing speed" />
             <FeatureItem text="Ads enabled" />
             <FeatureItem text="Community support" />
             <FeatureItem text="API Access" negative />
          </div>
          <Link to="/tools" className="block w-full py-3 px-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-center hover:border-brand-600 dark:hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-500 transition-colors">
            Start Free
          </Link>
        </div>

        {/* Golden Plan (Highlighted) */}
        <div className="bg-brand-600 dark:bg-brand-700 rounded-2xl border border-brand-600 dark:border-brand-700 p-8 shadow-xl transform md:-translate-y-4 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-brand-500 dark:bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
          <div className="mb-6 text-white">
            <h3 className="text-xl font-bold">Golden</h3>
            <p className="text-brand-100 text-sm mt-2">Best for professionals and developers.</p>
          </div>
          <div className="mb-6 text-white">
            <span className="text-5xl font-extrabold">${billing === 'monthly' ? '4.99' : '49.99'}</span>
            <span className="text-brand-100"> / {billing === 'monthly' ? 'month' : 'year'}</span>
          </div>
          <div className="space-y-4 flex-1 mb-8">
             <FeatureItem text="Unlimited access to all tools" light />
             <FeatureItem text="Faster processing speeds" light />
             <FeatureItem text="Ad-free experience" light />
             <FeatureItem text="Priority email support" light />
             <FeatureItem text="Save tool history" light />
             <FeatureItem text="Early access to new features" light />
          </div>
          <button 
            onClick={() => handleBuy('golden', billing === 'monthly' ? '4.99' : '49.99')}
            className="block w-full py-4 px-4 bg-white text-brand-700 font-bold rounded-xl text-center hover:bg-brand-50 transition-colors shadow-lg"
          >
            Buy Now
          </button>
        </div>

        {/* Custom Plan */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-all flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Custom</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">For high-volume API and enterprise needs.</p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white">Contact</span>
          </div>
          <div className="space-y-4 flex-1 mb-8">
             <FeatureItem text="Dedicated API endpoints" />
             <FeatureItem text="Custom usage limits" />
             <FeatureItem text="SSO & Team Management" />
             <FeatureItem text="SLA & Uptime Guarantee" />
             <FeatureItem text="Dedicated Account Manager" />
             <FeatureItem text="Custom Integrations" />
          </div>
          <Link to="/contact" className="block w-full py-3 px-4 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 font-bold rounded-xl text-center hover:bg-brand-100 dark:hover:bg-brand-900/30 transition-colors">
            Contact Sales
          </Link>
        </div>

      </div>
    </div>
  );
};

const FeatureItem: React.FC<{ text: string; light?: boolean; negative?: boolean }> = ({ text, light, negative }) => (
  <div className="flex items-center gap-3">
    {negative ? (
       <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${light ? 'bg-brand-500 text-brand-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>
         <X className="w-3 h-3" />
       </div>
    ) : (
        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${light ? 'bg-white text-brand-600' : 'bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400'}`}>
         <Check className="w-3 h-3" />
       </div>
    )}
    <span className={`text-sm ${light ? 'text-brand-50' : negative ? 'text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'}`}>{text}</span>
  </div>
);

export default Pricing;