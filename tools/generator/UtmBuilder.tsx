import React, { useState, useEffect } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import AdNative from '../../components/AdNative';
import { Copy } from 'lucide-react';

const UtmBuilder: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [url, setUrl] = useState('');
  const [source, setSource] = useState('');
  const [medium, setMedium] = useState('');
  const [campaign, setCampaign] = useState('');
  const [term, setTerm] = useState('');
  const [content, setContent] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    if (!url) {
      setResult('');
      return;
    }
    try {
      const u = new URL(url);
      if (source) u.searchParams.set('utm_source', source);
      if (medium) u.searchParams.set('utm_medium', medium);
      if (campaign) u.searchParams.set('utm_campaign', campaign);
      if (term) u.searchParams.set('utm_term', term);
      if (content) u.searchParams.set('utm_content', content);
      setResult(u.toString());
    } catch (e) {
      setResult('Invalid URL');
    }
  }, [url, source, medium, campaign, term, content]);

  return (
    <ToolTemplate metadata={metadata}>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* INPUT FORM */}
        <div className="space-y-4">
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="Website URL (e.g., https://example.com)"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-brand-500"
          />
          <input
            type="text"
            value={source}
            onChange={e => setSource(e.target.value)}
            placeholder="Campaign Source (e.g., google, newsletter)"
            className="w-full p-3 border border-slate-300 rounded-lg"
          />
          <input
            type="text"
            value={medium}
            onChange={e => setMedium(e.target.value)}
            placeholder="Campaign Medium (e.g., cpc, banner, email)"
            className="w-full p-3 border border-slate-300 rounded-lg"
          />
          <input
            type="text"
            value={campaign}
            onChange={e => setCampaign(e.target.value)}
            placeholder="Campaign Name (e.g., spring_sale)"
            className="w-full p-3 border border-slate-300 rounded-lg"
          />
          <input
            type="text"
            value={term}
            onChange={e => setTerm(e.target.value)}
            placeholder="Campaign Term (Optional)"
            className="w-full p-3 border border-slate-300 rounded-lg"
          />
          <input
            type="text"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Campaign Content (Optional)"
            className="w-full p-3 border border-slate-300 rounded-lg"
          />

          {/* 🔥 AD – AFTER INPUT FORM */}
          <AdNative />
        </div>

        {/* RESULT */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-900">Generated URL</h3>

          {/* 🔥 AD – BEFORE RESULT */}
          {result && <AdNative />}

          <textarea
            readOnly
            value={result}
            className="w-full h-40 p-4 border border-slate-300 rounded-lg font-mono text-sm text-slate-600 focus:outline-none resize-none"
          />

          <button
            onClick={() => navigator.clipboard.writeText(result)}
            disabled={!result}
            className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Copy className="h-5 w-5" /> Copy URL
          </button>

          {/* 🔥 AD – AFTER COPY */}
          {result && <AdNative />}
        </div>

      </div>
    </ToolTemplate>
  );
};

export default UtmBuilder;
