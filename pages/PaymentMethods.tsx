import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CreditCard, Banknote, Smartphone } from 'lucide-react';

const METHODS = [
    {
        id: 'bkash',
        name: 'bKash',
        type: 'Personal',
        number: '01405205660',
        color: 'bg-pink-600',
        icon: Smartphone
    },
    {
        id: 'nagad',
        name: 'Nagad',
        type: 'Personal',
        number: '01405205660',
        color: 'bg-orange-600',
        icon: Smartphone
    },
    {
        id: 'rocket',
        name: 'Rocket',
        type: 'Personal',
        number: '01835959202',
        color: 'bg-purple-600',
        icon: Smartphone
    },
    {
        id: 'bank',
        name: 'Bank Transfer',
        type: 'DBBL',
        number: 'Off Bank Transfer',
        color: 'bg-slate-700',
        icon: Banknote
    }
];

const PaymentMethods: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const plan = searchParams.get('plan');
  const price = searchParams.get('price');
  const billing = searchParams.get('billing');

  if (!plan || !price) {
      return <div className="text-center p-20 text-slate-500">Invalid Plan Details</div>;
  }

  // Conversion rate: 1 USD = 120 BDT
  const exchangeRate = 120;
  const bdtPrice = (parseFloat(price) * exchangeRate).toFixed(0);

  const handleSelect = (methodId: string) => {
      navigate(`/payment/submit?plan=${plan}&price=${price}&billing=${billing}&method=${methodId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 transition-colors">
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-2">Select Payment Method</h1>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-10">
                You are about to pay <span className="font-bold text-slate-900 dark:text-white">${price}</span> <span className="text-brand-600 font-medium">(approx. ৳{bdtPrice} BDT)</span> for the <span className="capitalize">{plan}</span> plan ({billing}).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {METHODS.map(method => (
                    <div 
                        key={method.id}
                        onClick={() => method.number !== 'Off Bank Transfer' && handleSelect(method.id)}
                        className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 transition-all group ${method.number === 'Off Bank Transfer' ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-lg'}`}
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${method.color} text-white`}>
                            <method.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">{method.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{method.type}</p>
                        <p className="text-sm font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded mt-3 text-slate-700 dark:text-slate-300">
                            {method.number}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default PaymentMethods;