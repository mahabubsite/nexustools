import React, { useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import AdNative from '../../components/AdNative';
import { ArrowDownAZ, ArrowUpZA, Shuffle } from 'lucide-react';

const Alphabetizer: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const process = (type: 'az' | 'za' | 'random') => {
    if (!input) return;
    const lines = input.split(/\r?\n/).filter(line => line.trim() !== '');

    if (type === 'az') {
      lines.sort((a, b) => a.localeCompare(b));
    } else if (type === 'za') {
      lines.sort((a, b) => b.localeCompare(a));
    } else {
      for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j], lines[i]];
      }
    }
    setOutput(lines.join('\n'));
  };

  return (
    <ToolTemplate
      metadata={metadata}
      howItWorks="Enter a list of items (one per line). Sort them alphabetically A-Z, Z-A, or randomize the order completely."
    >
      <div className="p-6 space-y-6">

        {/* 🔥 TOP AD */}
        <AdNative />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Input List
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-80 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 resize-none"
              placeholder="Apple&#10;Banana&#10;Cherry"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Sorted Result
            </label>
            <textarea
              readOnly
              value={output}
              className="w-full h-80 p-4 bg-slate-50 border border-slate-300 rounded-lg resize-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => process('az')}
            className="flex items-center gap-2 bg-white border border-slate-300 px-6 py-2 rounded-lg hover:bg-slate-50"
          >
            <ArrowDownAZ className="h-4 w-4" /> Sort A-Z
          </button>

          <button
            onClick={() => process('za')}
            className="flex items-center gap-2 bg-white border border-slate-300 px-6 py-2 rounded-lg hover:bg-slate-50"
          >
            <ArrowUpZA className="h-4 w-4" /> Sort Z-A
          </button>

          <button
            onClick={() => process('random')}
            className="flex items-center gap-2 bg-white border border-slate-300 px-6 py-2 rounded-lg hover:bg-slate-50"
          >
            <Shuffle className="h-4 w-4" /> Randomize
          </button>
        </div>

        {/* 🔥 BOTTOM AD (High CTR) */}
        <AdNative />

      </div>
    </ToolTemplate>
  );
};

export default Alphabetizer;
