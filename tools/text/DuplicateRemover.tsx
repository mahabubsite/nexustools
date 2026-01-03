import React, { useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { Trash, Copy, Check } from 'lucide-react';

const DuplicateRemover: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState({ original: 0, unique: 0, removed: 0 });

  const process = () => {
    if (!input) {
        setOutput('');
        return;
    }
    const lines = input.split(/\r?\n/);
    const uniqueLines = [...new Set(lines)];
    
    setOutput(uniqueLines.join('\n'));
    setStats({
        original: lines.length,
        unique: uniqueLines.length,
        removed: lines.length - uniqueLines.length
    });
  };

  return (
    <ToolTemplate metadata={metadata} howItWorks="Paste your list of text items. The tool will automatically remove duplicate lines, leaving only unique entries.">
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 h-[600px]">
        <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-700">Input List</label>
                <span className="text-xs text-slate-500">{stats.original} lines</span>
            </div>
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none resize-none text-sm"
                placeholder="Paste list here..."
            />
        </div>
        
        <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-700">Unique Result</label>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-green-600 font-medium">Removed: {stats.removed}</span>
                    <span className="text-xs text-slate-500">{stats.unique} lines</span>
                </div>
            </div>
            <textarea
                readOnly
                value={output}
                className="flex-1 w-full p-4 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 resize-none text-sm focus:outline-none"
                placeholder="Result will appear here..."
            />
        </div>

        <div className="md:col-span-2 flex justify-center gap-4">
             <button 
                onClick={process}
                className="bg-brand-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-brand-700 shadow-sm"
            >
                Remove Duplicates
            </button>
            <button 
                onClick={() => navigator.clipboard.writeText(output)}
                className="bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 flex items-center gap-2"
                disabled={!output}
            >
                <Copy className="h-4 w-4" /> Copy Result
            </button>
        </div>
      </div>
    </ToolTemplate>
  );
};

export default DuplicateRemover;