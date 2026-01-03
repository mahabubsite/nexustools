import React, { useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { Copy, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

const JsonFormatter: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const format = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Invalid JSON');
    }
  };

  const minify = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Invalid JSON');
    }
  };

  return (
    <ToolTemplate
      metadata={metadata}
      howItWorks="Paste your raw JSON string into the editor. Use the 'Format' button to pretty-print it with proper indentation, or 'Minify' to remove all whitespace for compact storage."
    >
      <div className="flex flex-col h-[600px]">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-slate-50">
           <div className="flex gap-2">
             <button onClick={format} className="text-xs font-semibold bg-white border border-slate-300 px-3 py-1.5 rounded hover:bg-slate-50 text-slate-700">Format</button>
             <button onClick={minify} className="text-xs font-semibold bg-white border border-slate-300 px-3 py-1.5 rounded hover:bg-slate-50 text-slate-700">Minify</button>
           </div>
           <div className="flex gap-2">
             <button onClick={() => setInput('')} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
             <button onClick={() => navigator.clipboard.writeText(input)} className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded"><Copy className="h-4 w-4" /></button>
           </div>
        </div>

        {/* Editor Area */}
        <div className="flex-grow relative">
          <textarea
            value={input}
            onChange={(e) => {
                setInput(e.target.value);
                if(error) setError(null);
            }}
            className="w-full h-full p-4 font-mono text-sm bg-slate-900 text-slate-50 focus:outline-none resize-none"
            placeholder='{"key": "value"}'
            spellCheck={false}
          />
          {error && (
            <div className="absolute bottom-4 left-4 right-4 bg-red-900/90 text-red-100 px-4 py-2 rounded-md border border-red-700 flex items-center gap-2 text-sm shadow-lg backdrop-blur-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
            </div>
          )}
          {!error && input && (
             <div className="absolute bottom-4 right-4 bg-emerald-600/20 text-emerald-400 px-2 py-1 rounded text-xs backdrop-blur-sm border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Valid JSON
             </div>
          )}
        </div>
      </div>
    </ToolTemplate>
  );
};

export default JsonFormatter;