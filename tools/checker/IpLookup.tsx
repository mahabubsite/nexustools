import React, { useState, useEffect } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { Globe, MapPin, Network } from 'lucide-react';
import AdNative from '../../components/AdNative'; // 🔥 add this

const IpLookup: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [ip, setIp] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const lookup = async (targetIp: string = '') => {
    setLoading(true);
    setError('');
    setData(null);
    try {
        const res = await fetch(`https://ipapi.co/${targetIp}/json/`);
        if (!res.ok) throw new Error('Failed to fetch data');
        const json = await res.json();
        if (json.error) throw new Error(json.reason);
        setData(json);
        if(!targetIp) setIp(json.ip);
    } catch (e: any) {
        setError(e.message || 'Lookup failed. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    lookup(); // Lookup own IP on mount
  }, []);

  return (
    <ToolTemplate metadata={metadata} howItWorks="Find details about an IP address including geolocation, ISP, and network information. Leave blank to check your own IP.">
      <div className="p-6 space-y-6">
        <div className="flex gap-4">
            <input 
                type="text" 
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="Enter IP Address (e.g., 8.8.8.8)"
                className="flex-1 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button 
                onClick={() => lookup(ip)}
                disabled={loading}
                className="bg-brand-600 text-white px-6 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50"
            >
                {loading ? 'Searching...' : 'Lookup'}
            </button>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

        {data && (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-brand-600" /> Location
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b border-slate-50 pb-2">
                            <span className="text-slate-500">City</span>
                            <span className="font-medium">{data.city}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-2">
                            <span className="text-slate-500">Region</span>
                            <span className="font-medium">{data.region}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-2">
                            <span className="text-slate-500">Country</span>
                            <span className="font-medium">{data.country_name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Coordinates</span>
                            <span className="font-medium">{data.latitude}, {data.longitude}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Network className="h-5 w-5 text-brand-600" /> Network
                    </h3>
                    <div className="space-y-2 text-sm">
                         <div className="flex justify-between border-b border-slate-50 pb-2">
                            <span className="text-slate-500">IP</span>
                            <span className="font-medium">{data.ip}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-2">
                            <span className="text-slate-500">ISP</span>
                            <span className="font-medium">{data.org}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-slate-500">ASN</span>
                            <span className="font-medium">{data.asn}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔥 AD PLACE — AFTER DATA */}
            <AdNative />
            </>
        )}
      </div>
    </ToolTemplate>
  );
};

export default IpLookup;
