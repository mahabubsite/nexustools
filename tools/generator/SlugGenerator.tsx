import React, { useState, useEffect } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { Copy, Link } from 'lucide-react';

const SlugGenerator: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [input, setInput] = useState('');
  const [slug, setSlug] = useState('');

  useEffect(() => {
    const newSlug = input
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(newSlug);
  }, [input]);

  return (
    <ToolTemplate metadata={metadata} howItWorks="Convert article titles or names into URL-friendly slugs. Removes special characters and replaces spaces with hyphens.">
      <div className="p-6 space-y-6">
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Input String</label>
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 text-lg"
                placeholder="Hello World! This is a Title."
            />
        </div>
        
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <label className="block text-sm font-medium text-slate-500 mb-2 uppercase tracking-wide">Generated Slug</label>
            <div className="flex gap-2">
                <div className="flex-1 bg-white p-4 rounded-lg border border-slate-300 font-mono text-brand-600 break-all flex items-center gap-2">
                    <Link className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    {slug || 'result-will-appear-here'}
                </div>
                <button 
                    onClick={() => navigator.clipboard.writeText(slug)}
                    className="bg-brand-600 text-white px-6 rounded-lg font-medium hover:bg-brand-700 transition-colors"
                    disabled={!slug}
                >
                    <Copy className="h-5 w-5" />
                </button>
            </div>
        </div>
      </div>
    </ToolTemplate>
  );
};

export default SlugGenerator;