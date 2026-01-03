import React, { useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { Copy } from 'lucide-react';

const HashGenerator: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});

  const generateHashes = async (text: string) => {
    setInput(text);
    if (!text) {
        setHashes({});
        return;
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    const algos = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
    const results: Record<string, string> = {};

    for (const algo of algos) {
        const hashBuffer = await crypto.subtle.digest(algo, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        results[algo] = hashHex;
    }
    setHashes(results);
  };

  return (
    <ToolTemplate metadata={metadata} howItWorks="Enter text to instantly generate cryptographic hashes (SHA-1, SHA-256, etc.) using your browser's Web Crypto API.">
      <div className="p-6 space-y-6">
        <textarea
            value={input}
            onChange={(e) => generateHashes(e.target.value)}
            className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            placeholder="Type text to hash..."
        />

        <div className="space-y-4">
            {Object.entries(hashes).map(([algo, hash]) => (
                <div key={algo} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-bold text-slate-700">{algo}</span>
                        <button 
                            onClick={() => navigator.clipboard.writeText(hash as string)}
                            className="text-slate-400 hover:text-brand-600 transition-colors"
                        >
                            <Copy className="h-4 w-4" />
                        </button>
                    </div>
                    <p className="font-mono text-xs break-all text-slate-600">{hash}</p>
                </div>
            ))}
            {!input && <div className="text-center text-slate-400 py-8">Enter text to see hashes</div>}
        </div>
      </div>
    </ToolTemplate>
  );
};

export default HashGenerator;