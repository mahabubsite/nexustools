import React, { useState, useEffect } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { RefreshCw, Copy, List } from 'lucide-react';

const UuidGenerator: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [hyphens, setHyphens] = useState(true);
  const [uppercase, setUppercase] = useState(false);

  const generateUUID = () => {
    // Basic v4 UUID generation
    // crypto.randomUUID() is available in secure contexts (HTTPS/localhost)
    // Fallback for older browsers
    const generateOne = () => {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    const list = [];
    for(let i=0; i<quantity; i++) {
        let uuid = generateOne();
        if(!hyphens) uuid = uuid.replace(/-/g, '');
        if(uppercase) uuid = uuid.toUpperCase();
        list.push(uuid);
    }
    setUuids(list);
  };

  useEffect(() => {
    generateUUID();
  }, [quantity, hyphens, uppercase]);

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
  };

  return (
    <ToolTemplate
      metadata={metadata}
      howItWorks="Generate up to 100 random Version 4 UUIDs (Universally Unique Identifiers) instantly. Compatible with most database and software systems."
    >
      <div className="p-6">
        {/* Controls */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-end sm:justify-between gap-4">
            <div className="flex-1 space-y-4">
                <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Quantity ({quantity})</label>
                     <input 
                        type="range" min="1" max="50" value={quantity} 
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="w-full accent-brand-600"
                    />
                </div>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={hyphens} onChange={(e) => setHyphens(e.target.checked)} className="rounded text-brand-600 focus:ring-brand-500" />
                        <span className="text-sm text-slate-700">Hyphens</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="rounded text-brand-600 focus:ring-brand-500" />
                        <span className="text-sm text-slate-700">Uppercase</span>
                    </label>
                </div>
            </div>
            <button 
                onClick={generateUUID}
                className="w-full sm:w-auto px-6 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
            >
                <RefreshCw className="h-4 w-4" /> Refresh
            </button>
        </div>

        {/* Output */}
        <div className="relative">
             <div className="absolute top-0 right-0 p-2">
                 <button 
                    onClick={copyAll}
                    className="bg-white border border-slate-200 text-slate-600 hover:text-brand-600 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm flex items-center gap-1 transition-colors"
                >
                    <Copy className="h-3 w-3" /> Copy List
                </button>
             </div>
             <textarea 
                readOnly
                value={uuids.join('\n')}
                className="w-full h-96 p-4 font-mono text-sm border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none resize-none leading-loose"
             />
        </div>
      </div>
    </ToolTemplate>
  );
};

export default UuidGenerator;