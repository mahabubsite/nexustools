import React, { useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { ArrowLeftRight } from 'lucide-react';

const HtmlEntityConverter: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const process = (text: string, m: 'encode' | 'decode') => {
    setInput(text);
    if (m === 'encode') {
        setOutput(text.replace(/[\u00A0-\u9999<>&]/g, (i) => '&#' + i.charCodeAt(0) + ';'));
    } else {
        const txt = document.createElement('textarea');
        txt.innerHTML = text;
        setOutput(txt.value);
    }
  };

  return (
    <ToolTemplate metadata={metadata} howItWorks="Encode special characters to HTML entities (e.g., & becomes &amp;) or decode them back to text.">
      <div className="p-6 space-y-4">
        <div className="flex justify-center mb-4">
            <button 
                onClick={() => { setMode(mode === 'encode' ? 'decode' : 'encode'); process(input, mode === 'encode' ? 'decode' : 'encode'); }}
                className="flex items-center gap-2 bg-brand-100 text-brand-700 px-4 py-2 rounded-full font-medium"
            >
                <ArrowLeftRight className="h-4 w-4" /> Mode: {mode === 'encode' ? 'Encode' : 'Decode'}
            </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <textarea
                value={input}
                onChange={(e) => process(e.target.value, mode)}
                className="h-64 p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder={mode === 'encode' ? 'Text to encode...' : '&lt;div&gt;Decode me&lt;/div&gt;'}
            />
            <textarea
                readOnly
                value={output}
                className="h-64 p-4 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
            />
        </div>
      </div>
    </ToolTemplate>
  );
};

export default HtmlEntityConverter;