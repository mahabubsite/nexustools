import React, { useEffect, useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { Laptop, Monitor } from 'lucide-react';

const UserAgentParser: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [ua, setUa] = useState(navigator.userAgent);
  const [info, setInfo] = useState<{ browser: string; os: string }>({ browser: '', os: '' });

  const parse = (agent: string) => {
    // Basic manual parsing (for production, a library like UAParser.js is recommended)
    let browser = "Unknown";
    if (agent.includes("Firefox")) browser = "Mozilla Firefox";
    else if (agent.includes("SamsungBrowser")) browser = "Samsung Internet";
    else if (agent.includes("Opera") || agent.includes("OPR")) browser = "Opera";
    else if (agent.includes("Trident")) browser = "Microsoft Internet Explorer";
    else if (agent.includes("Edge")) browser = "Microsoft Edge";
    else if (agent.includes("Chrome")) browser = "Google Chrome";
    else if (agent.includes("Safari")) browser = "Apple Safari";

    let os = "Unknown";
    if (agent.includes("Win")) os = "Windows";
    else if (agent.includes("Mac")) os = "MacOS";
    else if (agent.includes("Linux")) os = "Linux";
    else if (agent.includes("Android")) os = "Android";
    else if (agent.includes("like Mac")) os = "iOS";

    setInfo({ browser, os });
  };

  useEffect(() => {
    parse(ua);
  }, [ua]);

  return (
    <ToolTemplate metadata={metadata} howItWorks="Paste or edit a user agent string to identify the browser and operating system.">
      <div className="p-6 space-y-8">
        {/* User Agent Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">User Agent String</label>
          <textarea
            value={ua}
            onChange={(e) => { setUa(e.target.value); parse(e.target.value); }}
            className="w-full p-4 border border-slate-300 rounded-lg h-32 focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono"
            placeholder="Paste your User Agent string here..."
          />
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-center gap-4">
            <Laptop className="h-10 w-10 text-blue-600" />
            <div>
              <h3 className="font-bold text-slate-900">Operating System</h3>
              <p className="text-lg text-blue-800">{info.os}</p>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 flex items-center gap-4">
            <Monitor className="h-10 w-10 text-purple-600" />
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
