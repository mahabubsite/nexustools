import React, { useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { ArrowDownUp, Copy, Trash2, AlertCircle } from 'lucide-react';

const Base64Converter: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleConvert = (text: string, currentMode: 'encode' | 'decode') => {
    setInput(text);
    setError('');
    
    if (!text) {
      setOutput('');
      return;
    }

    try {
      if (currentMode === 'encode') {
        setOutput(btoa(text));
      } else {
        setOutput(atob(text));
      }
    } catch (err) {
      setError(currentMode === 'decode' ? 'Invalid Base64 string' : 'Encoding failed');
    }
  };

  const handleModeChange = (newMode: 'encode' | 'decode') => {
    setMode(newMode);
    // Swap input/output if valid
    if (!error && output) {
        setInput(output);
        // We need to trigger conversion immediately with swapped values
        if (newMode === 'encode') {
            try { setOutput(btoa(output)); } catch (e) { setOutput(''); }
        } else {
             try { setOutput(atob(output)); } catch (e) { setError('Invalid Base64 string'); setOutput(''); }
        }
    } else {
        setInput('');
        setOutput('');
        setError('');
    }
  };

  return (
    <ToolTemplate
      metadata={metadata}
      howItWorks="Choose between Encoding (Text to Base64) or Decoding (Base64 to Text). Enter your data, and the result will appear instantly."
    >
      <div className="p-6">
        {/* Toggle */}
        <div className="flex justify-center mb-8">
            <div className="bg-slate-100 p-1 rounded-lg inline-flex">
                <button 
                    onClick={() => handleModeChange('encode')}
                    className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${mode === 'encode' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Encode
                </button>
                <button 
                    onClick={() => handleModeChange('decode')}
                    className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${mode === 'decode' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Decode
                </button>
            </div>
        </div>

        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
                </label>
                <textarea
                    value={input}
                    onChange={(e) => handleConvert(e.target.value, mode)}
                    className={`w-full h-32 p-3 border rounded-lg focus:ring-2 focus:outline-none font-mono text-sm ${error ? 'border-red-300 ring-red-200' : 'border-slate-300 focus:ring-brand-500 border-slate-300'}`}
                    placeholder={mode === 'encode' ? 'Hello World' : 'SGVsbG8gV29ybGQ='}
                />
                {error && (
                    <div className="mt-2 text-red-600 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" /> {error}
                    </div>
                )}
            </div>

            <div className="flex justify-center">
                <ArrowDownUp className="h-6 w-6 text-slate-300" />
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-slate-700">Result</label>
                    <button 
                        onClick={() => navigator.clipboard.writeText(output)}
                        className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
                        disabled={!output}
                    >
                        <Copy className="h-3 w-3" /> Copy
                    </button>
                </div>
                <textarea
                    readOnly
                    value={output}
                    className="w-full h-32 p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-600 font-mono text-sm focus:outline-none"
                    placeholder="Result will appear here..."
                />
            </div>
             
             <button 
                onClick={() => { setInput(''); setOutput(''); setError(''); }}
                className="w-full py-3 flex items-center justify-center gap-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
                <Trash2 className="h-4 w-4" /> Clear All
            </button>
        </div>
      </div>
    </ToolTemplate>
  );
};

export default Base64Converter;