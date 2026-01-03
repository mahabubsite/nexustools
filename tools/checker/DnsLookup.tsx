import React, { useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { Search } from 'lucide-react';

const DnsLookup: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [domain, setDomain] = useState('');
  const [type, setType] = useState('A');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const lookup = async () => {
    if (!domain) return;
    setLoading(true);
    setResults([]);
    try {
        // Using Cloudflare DNS over HTTPS API
        const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=${type}`, {
            headers: { 'accept': 'application/dns-json' }
        });
        const json = await res.json();
        if (json.Answer) {
            setResults(json.Answer);
        }
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  return (
    <ToolTemplate metadata={metadata} howItWorks="Perform a real-time DNS lookup for any domain name using Cloudflare's public DNS-over-HTTPS resolver.">
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
            <input 
                type="text" 
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com"
                className="flex-1 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="p-3 border border-slate-300 rounded-lg bg-white"
            >
                <option value="A">A</option>
                <option value="AAAA">AAAA</option>
                <option value="CNAME">CNAME</option>
                <option value="MX">MX</option>
                <option value="TXT">TXT</option>
                <option value="NS">NS</option>
            </select>
            <button 
                onClick={lookup}
                disabled={loading}
                className="bg-brand-600 text-white px-6 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50"
            >
                {loading ? '...' : 'Check'}
            </button>
        </div>

        <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 text-slate-500 font-medium">
                    <tr>
                        <th className="p-4">Type</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Data / Value</th>
                        <th className="p-4">TTL</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {results.length > 0 ? results.map((r, i) => (
                        <tr key={i} className="bg-white">
                            <td className="p-4 font-mono">{type}</td>
                            <td className="p-4">{r.name}</td>
                            <td className="p-4 font-mono break-all">{r.data}</td>
                            <td className="p-4">{r.TTL}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={4} className="p-8 text-center text-slate-400">
                                {loading ? 'Querying DNS...' : 'No records found or enter a domain to search.'}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </ToolTemplate>
  );
};

export default DnsLookup;