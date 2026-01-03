import React, { useState, useEffect } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';

const UrlParser: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [input, setInput] = useState('https://www.example.com:8080/path?query=123#hash');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    try {
        const url = new URL(input);
        setData({
            Protocol: url.protocol,
            Host: url.host,
            Hostname: url.hostname,
            Port: url.port,
            Path: url.pathname,
            Search: url.search,
            Hash: url.hash,
            Origin: url.origin,
            Params: Object.fromEntries(url.searchParams)
        });
    } catch (e) {
        setData(null);
    }
  }, [input]);

  return (
    <ToolTemplate metadata={metadata} howItWorks="Paste a URL to break it down into its components (Protocol, Host, Path, Query Parameters, etc.).">
      <div className="p-6 space-y-6">
        <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
            placeholder="https://..."
        />
        
        {data ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(data).map(([key, value]) => {
                    if (key === 'Params') {
                        return (
                             <div key={key} className="col-span-full bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <span className="block text-xs font-bold text-slate-500 uppercase mb-2">Query Params</span>
                                <pre className="text-sm font-mono text-slate-700 whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>
                            </div>
                        )
                    }
                    return (
                        <div key={key} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <span className="block text-xs font-bold text-slate-500 uppercase mb-1">{key}</span>
                            <span className="text-sm font-mono text-slate-800 break-all">{String(value || '-')}</span>
                        </div>
                    )
                })}
            </div>
        ) : (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm text-center">
                Invalid URL format
            </div>
        )}
      </div>
    </ToolTemplate>
  );
};

export default UrlParser;