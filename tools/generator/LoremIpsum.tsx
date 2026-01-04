import React, { useState, useEffect } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import AdNative from '../../components/AdNative';
import { Copy, RefreshCcw } from 'lucide-react';

const LoremIpsum: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [text, setText] = useState('');

  const generate = () => {
    const lorem =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

    const wordsArr = lorem.replace(/[.,]/g, '').toLowerCase().split(' ');
    let result: string[] = [];

    if (type === 'words') {
      for (let i = 0; i < count; i++) {
        result.push(wordsArr[i % wordsArr.length]);
      }
      setText(result.join(' '));
    } else if (type === 'sentences') {
      const sentences = lorem.split('. ');
      for (let i = 0; i < count; i++) {
        result.push(sentences[i % sentences.length].trim() + '.');
      }
      setText(result.join(' '));
    } else {
      for (let i = 0; i < count; i++) {
        result.push(lorem);
      }
      setText(result.join('\n\n'));
    }
  };

  useEffect(() => {
    generate();
  }, [count, type]);

  return (
    <ToolTemplate
      metadata={metadata}
      howItWorks="Generate standard Lorem Ipsum dummy text. Choose paragraphs, sentences, or words."
    >
      <div className="p-6 space-y-8">

        {/* CONTROLS */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Count</label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-24 px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>

          <button
            onClick={generate}
            className="ml-auto px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2 font-medium"
          >
            <RefreshCcw className="h-4 w-4" /> Regenerate
          </button>
        </div>

        {/* 🔥 AD – AFTER CONTROLS */}
        <AdNative />

        {/* RESULT */}
        <div className="relative">
          <button
            onClick={() => navigator.clipboard.writeText(text)}
            className="absolute top-2 right-2 bg-white/80 hover:bg-white text-slate-600 p-2 rounded-md border border-slate-200"
            title="Copy text"
          >
            <Copy className="h-4 w-4" />
          </button>

          {/* 🔥 AD – BEFORE TEXTAREA */}
          <AdNative />

          <textarea
            readOnly
            value={text}
            className="w-full h-96 p-6 border border-slate-300 rounded-lg text-slate-600 leading-relaxed text-lg resize-y focus:outline-none"
          />

          {/* 🔥 AD – AFTER TEXTAREA */}
          <AdNative />
        </div>

      </div>
    </ToolTemplate>
  );
};

export default LoremIpsum;
