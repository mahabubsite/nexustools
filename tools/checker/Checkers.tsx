import React, { useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { Globe, Server } from 'lucide-react';

interface Props {
  metadata: ToolMetadata;
  subTool: 'whois' | 'headers';
}

const Checkers: React.FC<Props> = ({ metadata, subTool }) => {
  const [target, setTarget] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const check = async () => {
    setLoading(true);
    setResult('');
    
    // Simulate check or provide link because CORS blocks real checks from browser
    setTimeout(() => {
        setLoading(false);
        if (subTool === 'whois') {
             setResult(`WHOIS lookup for ${target} cannot be performed directly from the browser due to CORS protocol restrictions. \n\nPlease use a terminal command: \n$ whois ${target}\n\nOr visit a dedicated registrar.`);
        } else {
             setResult(`HTTP Headers for ${target}:\n\nHEAD / HTTP/1.1\nHost: ${target}\nUser-Agent: DevToolbox/1.0\n\n(Note: Actual live headers require a server-side proxy to bypass CORS.)`);
        }
    }, 1000);
  };

  return (
    <ToolTemplate metadata={metadata}>
      <div className="p-6 space-y-6">
        <div className="flex gap-4">
            <input 
                type="text" 
                value={target}
                onChange={e => setTarget(e.target.value)}
                placeholder={subTool === 'whois' ? 'example.com' : 'https://example.com'}
                className="flex-1 p-3 border border-slate-300 rounded-lg"
            />
            <button 
                onClick={check} 
                disabled={loading}
                className="bg-brand-600 text-white px-6 rounded-lg font-bold"
            >
                {loading ? 'Checking...' : 'Check'}
            </button>
        </div>

        <div className="bg-slate-900 text-slate-50 p-6 rounded-xl font-mono text-sm whitespace-pre-wrap min-h-[200px]">
            {result || '// Results will appear here...'}
        </div>
      </div>
    </ToolTemplate>
  );
};

export default Checkers;