import React, { useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import AdNative from '../../components/AdNative'; // 🔥 add this

const NumberToWords: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [num, setNum] = useState<number | ''>('');
  
  const convert = (n: number): string => {
    if (n === 0) return "Zero";
    const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    
    const numToWords = (num: number): string => {
        if (num < 20) return units[num];
        if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + units[num % 10] : "");
        if (num < 1000) return units[Math.floor(num / 100)] + " Hundred" + (num % 100 !== 0 ? " " + numToWords(num % 100) : "");
        if (num < 1000000) return numToWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 !== 0 ? " " + numToWords(num % 1000) : "");
        return "Number too large";
    };
    return numToWords(n);
  };

  return (
    <ToolTemplate metadata={metadata}>
      <div className="p-6">
        <input 
            type="number" 
            value={num} 
            onChange={e => setNum(parseInt(e.target.value) || '')} 
            className="w-full text-3xl font-bold p-4 border border-slate-300 rounded-lg mb-6 text-center"
            placeholder="Enter a number"
        />
        <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 text-center">
            <p className="text-2xl text-brand-600 font-serif italic">
                {num !== '' ? convert(Number(num)) : 'Waiting for input...'}
            </p>
        </div>

        {/* 🔥 AD PLACE — AFTER RESULT */}
        <AdNative />
      </div>
    </ToolTemplate>
  );
};

export default NumberToWords;
