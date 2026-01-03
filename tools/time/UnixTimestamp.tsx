import React, { useState, useEffect } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { Clock } from 'lucide-react';

const UnixTimestamp: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [dateStr, setDateStr] = useState('');
  const [current, setCurrent] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const timer = setInterval(() => setCurrent(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTsChange = (val: string) => {
    const ts = parseInt(val);
    if (!isNaN(ts)) {
        setTimestamp(ts);
        setDateStr(new Date(ts * 1000).toISOString());
    }
  };

  return (
    <ToolTemplate metadata={metadata} howItWorks="Convert Unix timestamps (seconds since Jan 1 1970) to human readable dates and vice-versa.">
      <div className="p-6 space-y-8">
        <div className="bg-brand-50 p-6 rounded-xl border border-brand-100 text-center">
            <span className="text-sm font-bold text-brand-600 uppercase tracking-wider mb-2 block">Current Unix Timestamp</span>
            <div className="text-4xl font-mono font-bold text-brand-900">{current}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-brand-600" /> Timestamp to Date
                </h3>
                <input 
                    type="number" 
                    value={timestamp}
                    onChange={(e) => handleTsChange(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg mb-4 font-mono"
                />
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm">
                    <div className="grid grid-cols-3 gap-2">
                        <span className="text-slate-500">UTC:</span>
                        <span className="col-span-2 font-mono">{new Date(timestamp * 1000).toUTCString()}</span>
                        <span className="text-slate-500">Local:</span>
                        <span className="col-span-2 font-mono">{new Date(timestamp * 1000).toString()}</span>
                        <span className="text-slate-500">ISO 8601:</span>
                        <span className="col-span-2 font-mono">{new Date(timestamp * 1000).toISOString()}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </ToolTemplate>
  );
};

export default UnixTimestamp;