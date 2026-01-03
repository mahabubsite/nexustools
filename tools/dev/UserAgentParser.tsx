import React, { useEffect, useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { Laptop } from 'lucide-react';

const UserAgentParser: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [ua, setUa] = useState(navigator.userAgent);
  const [info, setInfo] = useState<any>({});

  const parse = (agent: string) => {
    // Basic manual parsing (Production usually uses a library like UAParser.js)
    let browser = "Unknown";
    if (agent.indexOf("Firefox") > -1) browser = "Mozilla Firefox";
    else if (agent.indexOf("SamsungBrowser") > -1) browser = "Samsung Internet";
    else if (agent.indexOf("Opera") > -1 || agent.indexOf("OPR") > -1) browser = "Opera";
    else if (agent.indexOf("Trident") > -1) browser = "Microsoft Internet Explorer";
    else if (agent.indexOf("Edge") > -1) browser = "Microsoft Edge";
    else if (agent.indexOf("Chrome") > -1) browser = "Google Chrome";
    else if (agent.indexOf("Safari") > -1) browser = "Apple Safari";

    let os = "Unknown";
    if (agent.indexOf("Win") > -1) os = "Windows";
    else if (agent.indexOf("Mac") > -1) os = "MacOS";
    else if (agent.indexOf("Linux") > -1) os = "Linux";
    else if (agent.indexOf("Android") > -1) os = "Android";
    else if (agent.indexOf("like Mac") > -1) os = "iOS";

    setInfo({ browser, os });
  };

  useEffect(() => {
    parse(ua);
  }, [ua]);

  return (
    <ToolTemplate metadata={metadata}>
      <div className="p-6 space-y-8">
        <div>
             <label className="block text-sm font-medium text-slate-700 mb-2">User Agent String</label>
             <textarea 
                value={ua}
                onChange={(e) => { setUa(e.target.value); parse(e.target.value); }}
                className="w-full p-4 border border-slate-300 rounded-lg h-32 focus:ring-brand-500"
             />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-center gap-4">
                <Laptop className="h-10 w-10 text-blue-600" />
                <div>
                    <h3 className="font-bold text-slate-900">Operating System</h3>
                    <p className="text-lg text-blue-800">{info.os}</p>
                </div>
            </div>
             <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 flex items-center gap-4">
                <div className="h-10 w-10 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 font-bold">B</div>
                <div>
                    <h3 className="font-bold text-slate-900">Browser</h3>
                    <p className="text-lg text-purple-800">{info.browser}</p>
                </div>
            </div>
        </div>
      </div>
    </ToolTemplate>
  );
};

export default UserAgentParser;