import React, { useState, useEffect } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { Copy, RefreshCw, ShieldCheck } from 'lucide-react';

const PasswordGenerator: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  const generate = () => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '0123456789';
    const syms = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (options.uppercase) chars += upper;
    if (options.lowercase) chars += lower;
    if (options.numbers) chars += nums;
    if (options.symbols) chars += syms;

    if (chars === '') return;

    let pass = '';
    for (let i = 0; i < length; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
  };

  useEffect(() => {
    generate();
  }, []); // Run once on mount

  return (
    <ToolTemplate
      metadata={metadata}
      howItWorks="Select your desired password length and character types (uppercase, numbers, etc.). The tool automatically generates a secure, random string locally in your browser."
    >
      <div className="p-6">
        <div className="relative mb-6">
          <div className="bg-slate-100 p-5 rounded-lg border border-slate-200 break-all font-mono text-xl text-center text-slate-800 tracking-wider">
            {password}
          </div>
          <button 
            onClick={() => navigator.clipboard.writeText(password)}
            className="absolute top-2 right-2 p-2 text-slate-400 hover:text-brand-600 bg-white/50 hover:bg-white rounded-md transition-colors"
            title="Copy"
          >
            <Copy className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
             <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Password Length: {length}</label>
             </div>
             <input 
                type="range" 
                min="6" 
                max="64" 
                value={length} 
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <label className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={options.uppercase} 
                  onChange={(e) => setOptions({...options, uppercase: e.target.checked})}
                  className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                />
                <span className="text-slate-700 text-sm font-medium">Uppercase (A-Z)</span>
             </label>
             <label className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={options.lowercase} 
                  onChange={(e) => setOptions({...options, lowercase: e.target.checked})}
                  className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                />
                <span className="text-slate-700 text-sm font-medium">Lowercase (a-z)</span>
             </label>
             <label className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={options.numbers} 
                  onChange={(e) => setOptions({...options, numbers: e.target.checked})}
                  className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                />
                <span className="text-slate-700 text-sm font-medium">Numbers (0-9)</span>
             </label>
             <label className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={options.symbols} 
                  onChange={(e) => setOptions({...options, symbols: e.target.checked})}
                  className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                />
                <span className="text-slate-700 text-sm font-medium">Symbols (!@#)</span>
             </label>
          </div>

          <button 
            onClick={generate}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
          >
            <RefreshCw className="h-5 w-5" /> Generate New Password
          </button>
        </div>
      </div>
    </ToolTemplate>
  );
};

export default PasswordGenerator;