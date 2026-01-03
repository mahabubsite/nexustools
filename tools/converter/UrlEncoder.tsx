import React, { useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { ArrowLeftRight, Copy } from 'lucide-react';

const UrlEncoder: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const process = (val: string, m: 'encode' | 'decode') => {
    setInput(val);
    try {
        if (m === 'encode') {
            setOutput(encodeURIComponent(val));
        } else {
            setOutput(decodeURIComponent(val));
        }
    } catch (e) {
        setOutput('Error: Invalid URI sequence');
    }
  };

  const toggleMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    process(input, newMode);
  };

  return (
    <ToolTemplate metadata={metadata} howItWorks="Encode special characters in a URL to their safe percent-encoded format, or decode them back to readable text.">
      <div className="p-6 space-y-6">
        <div className="flex justify-center">
             <button 
                onClick={toggleMode}
                className="flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-full font-medium hover:bg-brand-100 transition-colors"
             >
                <ArrowLeftRight className="h-4 w-4" />
                Mode: {mode === 'encode' ? 'Encode' : 'Decode'}
             </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Input</label>
                <textarea
                    value={input}
                    onChange={(e) => process(e.target.value, mode)}
                    className="w-full h-48 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none resize-none"
                    placeholder="Enter text..."
                />
            </div>
            <div>
                <div className="flex justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700">Output</label>
                    <button onClick={() => navigator.clipboard.writeText(output)} className="text-xs text-brand-600 hover:underline">Copy</button>
                </div>
                <textarea
                    readOnly
                    value={output}
                    className="w-full h-48 p-4 bg-slate-50 border border-slate-300 rounded-lg text-slate-600 resize-none focus:outline-none"
                />
            </div>
        </div>
      </div>
    </ToolTemplate>
  );
};

export default UrlEncoder;