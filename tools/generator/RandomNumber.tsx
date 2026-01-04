import React, { useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import AdNative from '../../components/AdNative';
import { RefreshCw } from 'lucide-react';

const RandomNumber: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [result, setResult] = useState<number | null>(null);

  const generate = () => {
    if (min > max) return;
    const rand = Math.floor(Math.random() * (max - min + 1)) + min;
    setResult(rand);
  };

  return (
    <ToolTemplate
      metadata={metadata}
      howItWorks="Generate a random integer between a minimum and maximum range."
    >
      <div className="p-6 text-center space-y-8">

        {/* INPUTS */}
        <div className="flex justify-center gap-4">
          <div className="text-left">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Min
            </label>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(Number(e.target.value))}
              className="w-32 p-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Max
            </label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(Number(e.target.value))}
              className="w-32 p-2 border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        {/* 🔥 AD – AFTER INPUTS */}
        <AdNative />

        {/* RESULT */}
        <div>
          <div className="text-6xl font-bold text-brand-600 min-h-[1em]">
            {result !== null ? result : '-'}
          </div>
          <p className="text-slate-400 text-sm mt-2">Random Number</p>
        </div>

        {/* 🔥 AD – AFTER RESULT */}
        <AdNative />

        {/* GENERATE BUTTON */}
        <button
          onClick={generate}
          className="bg-brand-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-brand-700 transition-colors inline-flex items-center gap-2 shadow-md active:scale-95"
        >
          <RefreshCw className="h-5 w-5" /> Generate
        </button>

        {/* 🔥 AD – EXIT / REPEAT ZONE */}
        <AdNative />
      </div>
    </ToolTemplate>
  );
};

export default RandomNumber;
