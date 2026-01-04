import React, { useState, useEffect } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import AdNative from '../../components/AdNative';
import { Copy, RefreshCw } from 'lucide-react';

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

    if (!chars) return;

    let pass = '';
    for (let i = 0; i < length; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
  };

  useEffect(() => {
    generate();
  }, []);

  return (
    <ToolTemplate
      metadata={metadata}
      howItWorks="Choose password length and character types. Passwords are generated securely in your browser and never stored."
    >
      <div className="p-6 space-y-8">

        {/* PASSWORD DISPLAY */}
        <div className="relative">
          <div className="bg-slate-100 p-5 rounded-lg border border-slate-200 break-all font-mono text-xl text-center text-slate-800 tracking-wider">
            {password}
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(password)}
            className="absolute top-2 right-2 p-2 text-slate-400 hover:text-brand-600 bg-white/60 hover:bg-white rounded-md"
            title="Copy"
          >
            <Copy className="h-5 w-5" />
          </button>
        </div>

        {/* 🔥 AD – AFTER PASSWORD */}
        <AdNative />

        {/* CONTROLS */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password Length: {length}
            </label>
            <input
              type="range"
              min="6"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-brand-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              ['uppercase', 'Uppercase (A-Z)'],
              ['lowercase', 'Lowercase (a-z)'],
              ['numbers', 'Numbers (0-9)'],
              ['symbols', 'Symbols (!@#)'],
            ].map(([key, label]) => (
              <label
                key={key}
                className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={(options as any)[key]}
                  onChange={(e) =>
                    setOptions({ ...options, [key]: e.target.checked })
                  }
                  className="w-4 h-4 text-brand-600 rounded"
                />
                <span className="text-slate-700 text-sm font-medium">
                  {label}
                </span>
              </label>
            ))}
          </div>

          {/* 🔥 AD – AFTER OPTIONS */}
          <AdNative />

          <button
            onClick={generate}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-md active:scale-95"
          >
            <RefreshCw className="h-5 w-5" /> Generate New Password
          </button>

          {/* 🔥 AD – EXIT ZONE */}
          <AdNative />
        </div>
      </div>
    </ToolTemplate>
  );
};

export default PasswordGenerator;
