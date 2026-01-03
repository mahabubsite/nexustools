import React, { useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { RefreshCw } from 'lucide-react';

const RandomNumber: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [result, setResult] = useState<number | null>(null);

  const generate = () => {
    const rand = Math.floor(Math.random() * (max - min + 1)) + min;
    setResult(rand);
  };

  return (
    <ToolTemplate metadata={metadata} howItWorks="Generate a random integer between a minimum and maximum range.">
      <div className="p-6 text-center">
        <div className="flex justify-center gap-4 mb-8">
            <div className="text-left">
                <label className="block text-sm font-medium text-slate-700 mb-1">Min</label>
                <input 
                    type="number" value={min} onChange={(e) => setMin(Number(e.target.value))}
                    className="w-32 p-2 border border-slate-300 rounded-lg"
                />
            </div>
            <div className="text-left">
                <label className="block text-sm font-medium text-slate-700 mb-1">Max</label>
                <input 
                    type="number" value={max} onChange={(e) => setMax(Number(e.target.value))}
                    className="w-32 p-2 border border-slate-300 rounded-lg"
                />
            </div>
        </div>

        <div className="mb-8">
            <div className="text-6xl font-bold text-brand-600 min-h-[1em]">
                {result !== null ? result : '-'}
            </div>
            <p className="text-slate-400 text-sm mt-2">Random Number</p>
        </div>

        <button 
            onClick={generate}
            className="bg-brand-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-brand-700 transition-colors inline-flex items-center gap-2"
        >
            <RefreshCw className="h-5 w-5" /> Generate
        </button>
      </div>
    </ToolTemplate>
  );
};

export default RandomNumber;