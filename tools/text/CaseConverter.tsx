import React, { useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { Copy, RefreshCw, Download } from 'lucide-react';

const CaseConverter: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setMessage('Copied to clipboard!');
    setTimeout(() => setMessage(''), 2000);
  };

  const clearText = () => setText('');

  const transform = (type: 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'snake' | 'kebab' | 'alternating') => {
    let result = '';
    switch (type) {
      case 'upper': result = text.toUpperCase(); break;
      case 'lower': result = text.toLowerCase(); break;
      case 'title': 
        result = text.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
        break;
      case 'sentence':
        result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
        break;
      case 'camel':
        result = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        break;
      case 'snake':
        result = text && text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
            ? (text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) || [])
                .map(x => x.toLowerCase())
                .join('_')
            : text;
        break;
        // Simple snake case for demo if regex fails for edge cases
      case 'alternating':
        result = text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
        break;
      default: result = text;
    }
    setText(result);
  };

  return (
    <ToolTemplate 
      metadata={metadata}
      howItWorks="Enter your text into the box. Click any of the conversion buttons (UPPER CASE, lower case, etc.) to instantly transform your text. You can then copy the result or clear the field to start over."
      faqs={[
        { question: "Is my text saved?", answer: "No, all conversions happen instantly in your browser. We do not store or send your text to any server." },
        { question: "Does it support special characters?", answer: "Yes, standard casing rules apply to standard ASCII characters. Special characters are usually preserved or handled based on the specific mode." }
      ]}
    >
      <div className="p-6">
        <div className="mb-4 flex justify-between items-center">
            <label className="block text-sm font-medium text-slate-700">Input Text</label>
            {message && <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">{message}</span>}
        </div>
        <textarea
          className="w-full h-48 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent font-mono text-sm resize-y"
          placeholder="Type or paste your content here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button onClick={() => transform('upper')} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-sm font-medium transition-colors">UPPER CASE</button>
            <button onClick={() => transform('lower')} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-sm font-medium transition-colors">lower case</button>
            <button onClick={() => transform('title')} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-sm font-medium transition-colors">Capitalized Case</button>
            <button onClick={() => transform('sentence')} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-sm font-medium transition-colors">Sentence case</button>
            <button onClick={() => transform('camel')} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-sm font-medium transition-colors">camelCase</button>
            <button onClick={() => transform('snake')} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-sm font-medium transition-colors">snake_case</button>
             <button onClick={() => transform('alternating')} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-sm font-medium transition-colors">aLtErNaTiNg</button>
        </div>

        <div className="mt-6 flex gap-3 pt-6 border-t border-slate-100">
           <button 
             onClick={handleCopy}
             className="flex items-center justify-center gap-2 flex-1 bg-brand-600 text-white px-4 py-3 rounded-lg hover:bg-brand-700 font-medium transition-all shadow-sm active:scale-95"
           >
             <Copy className="h-4 w-4" /> Copy Text
           </button>
           <button 
             onClick={clearText}
             className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-all"
           >
             <RefreshCw className="h-4 w-4" /> Clear
           </button>
        </div>
        
        <div className="mt-4 flex gap-4 text-xs text-slate-500 border-t border-slate-100 pt-3">
             <span>Character Count: <span className="font-semibold">{text.length}</span></span>
             <span>Word Count: <span className="font-semibold">{text.trim() === '' ? 0 : text.trim().split(/\s+/).length}</span></span>
        </div>
      </div>
    </ToolTemplate>
  );
};

export default CaseConverter;