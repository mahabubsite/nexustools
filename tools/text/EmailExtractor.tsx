import React, { useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { Mail, Copy, Trash2 } from 'lucide-react';

const EmailExtractor: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [input, setInput] = useState('');
  const [emails, setEmails] = useState<string[]>([]);

  const extract = (text: string) => {
    setInput(text);
    if (!text) {
        setEmails([]);
        return;
    }
    const extracted = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    if (extracted) {
        // Unique emails only
        setEmails([...new Set(extracted)]);
    } else {
        setEmails([]);
    }
  };

  return (
    <ToolTemplate metadata={metadata} howItWorks="Paste any text, HTML, or messy data. We'll automatically find and extract all valid email addresses for you.">
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Input Text</label>
            <textarea
                value={input}
                onChange={(e) => extract(e.target.value)}
                className="w-full h-96 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none resize-none text-sm"
                placeholder="Paste text containing emails here..."
            />
        </div>
        
        <div>
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-700">Found Emails ({emails.length})</label>
                <div className="flex gap-2">
                    <button 
                        onClick={() => navigator.clipboard.writeText(emails.join('\n'))}
                        className="text-xs flex items-center gap-1 bg-white border border-slate-300 px-2 py-1 rounded hover:bg-slate-50"
                        disabled={emails.length === 0}
                    >
                        <Copy className="h-3 w-3" /> Copy
                    </button>
                </div>
            </div>
            <textarea
                readOnly
                value={emails.join('\n')}
                className="w-full h-96 p-4 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 resize-none text-sm focus:outline-none font-mono"
                placeholder="Extracted emails will appear here..."
            />
        </div>
      </div>
    </ToolTemplate>
  );
};

export default EmailExtractor;