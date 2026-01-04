import React, { useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import AdNative from '../../components/AdNative';
import { Copy, RefreshCw } from 'lucide-react';

const CaseConverter: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setMessage('Copied to clipboard!');
    setTimeout(() => setMessage(''), 2000);
  };

  const clearText = () => setText('');

  const transform = (
    type: 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'snake' | 'alternating'
  ) => {
    let result = '';
    switch (type) {
      case 'upper': result = text.toUpperCase(); break;
      case 'lower': result = text.toLowerCase(); break;
      case 'title':
        result = text.replace(/\w\S*/g, w => w.replace(/^\w/, c => c.toUpperCase()));
        break;
      case 'sentence':
        result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        break;
      case 'camel':
        result = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
        break;
      case 'snake':
        result = (text.match(/[A-Z]{2,}(?=[A-Z][a-z]+)|[A-Z]?[a-z]+|[A-Z]|[0-9]+/g) || [])
          .map(x => x.toLowerCase())
          .join('_');
        break;
      case 'alternating':
        result = text
          .split('')
          .map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase())
          .join('');
        break;
      default:
        result = text;
    }
    setText(result);
  };

  return (
    <ToolTemplate
      metadata={metadata}
      howItWorks="Enter your text and convert it into UPPERCASE, lowercase, camelCase, snake_case and more instantly."
    >
      <div className="p-6 space-y-6">

        {/* 🔥 TOP AD */}
        <AdNative />

        <div>
          <div className="mb-2 flex justify-between items-center">
            <label className="text-sm font-medium text-slate-700">Input Text</label>
            {message && (
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                {message}
              </span>
            )}
          </div>

          <textarea
            className="w-full h-48 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 font-mono text-sm resize-y"
            placeholder="Type or paste your content here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Btn onClick={() => transform('upper')} label="UPPER CASE" />
          <Btn onClick={() => transform('lower')} label="lower case" />
          <Btn onClick={() => transform('title')} label="Capitalized Case" />
          <Btn onClick={() => transform('sentence')} label="Sentence case" />
          <Btn onClick={() => transform('camel')} label="camelCase" />
          <Btn onClick={() => transform('snake')} label="snake_case" />
          <Btn onClick={() => transform('alternating')} label="aLtErNaTiNg" />
        </div>

        <div className="flex gap-3 pt-6 border-t border-slate-100">
          <button
            onClick={handleCopy}
            className="flex-1 bg-brand-600 text-white py-3 rounded-lg font-medium hover:bg-brand-700 flex items-center justify-center gap-2"
          >
            <Copy className="h-4 w-4" /> Copy Text
          </button>

          <button
            onClick={clearText}
            className="px-4 py-3 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-4 text-xs text-slate-500 border-t border-slate-100 pt-3">
          <span>Characters: <b>{text.length}</b></span>
          <span>Words: <b>{text.trim() ? text.trim().split(/\s+/).length : 0}</b></span>
        </div>

        {/* 🔥 BOTTOM AD */}
        <AdNative />

      </div>
    </ToolTemplate>
  );
};

const Btn = ({ onClick, label }: any) => (
  <button
    onClick={onClick}
    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-sm font-medium"
  >
    {label}
  </button>
);

export default CaseConverter;
