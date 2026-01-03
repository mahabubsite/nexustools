import React, { useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { ArrowLeftRight } from 'lucide-react';

const BinaryConverter: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'textToBinary' | 'binaryToText'>('textToBinary');

  const process = (val: string, m: string) => {
    setInput(val);
    if (!val) { setOutput(''); return; }

    try {
        if (m === 'textToBinary') {
            setOutput(val.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' '));
        } else {
            setOutput(val.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join(''));
        }
    } catch (e) {
        setOutput('Error parsing binary');
    }
  };

  return (
    <ToolTemplate metadata={metadata} howItWorks="Convert text to 8-bit binary code or decode binary sequences back to text.">
       <div className="p-6 space-y-4">
        <div className="flex justify-center mb-4">
            <button 
                onClick={() => { 
                    const newMode = mode === 'textToBinary' ? 'binaryToText' : 'textToBinary';
                    setMode(newMode); 
                    setInput(''); 
                    setOutput('');
                }}
                className="flex items-center gap-2 bg-brand-100 text-brand-700 px-4 py-2 rounded-full font-medium"
            >
                <ArrowLeftRight className="h-4 w-4" /> 
                {mode === 'textToBinary' ? 'Text → Binary' : 'Binary → Text'}
            </button>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
            <div>
                 <label className="block text-sm font-medium text-slate-700 mb-2">Input</label>
                 <textarea
                    value={input}
                    onChange={(e) => process(e.target.value, mode)}
                    className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                    placeholder={mode === 'textToBinary' ? 'Hello' : '01001000 01100101 01101100 01101100 01101111'}
                />
            </div>
            <div>
                 <label className="block text-sm font-medium text-slate-700 mb-2">Result</label>
                 <textarea
                    readOnly
                    value={output}
                    className="w-full h-32 p-4 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none font-mono"
                />
            </div>
        </div>
      </div>
    </ToolTemplate>
  );
};

export default BinaryConverter;