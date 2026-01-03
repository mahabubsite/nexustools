import React, { useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { ShieldAlert, ShieldCheck, Check, X } from 'lucide-react';

const PasswordStrength: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [password, setPassword] = useState('');

  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length > 8) score += 20;
    if (pwd.length > 12) score += 10;
    if (/[A-Z]/.test(pwd)) score += 20;
    if (/[a-z]/.test(pwd)) score += 20;
    if (/[0-9]/.test(pwd)) score += 15;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 15;
    return Math.min(score, 100);
  };

  const strength = calculateStrength(password);

  const getStrengthLabel = (s: number) => {
    if (s < 40) return { label: 'Weak', color: 'text-red-600', bg: 'bg-red-500' };
    if (s < 70) return { label: 'Medium', color: 'text-amber-600', bg: 'bg-amber-500' };
    return { label: 'Strong', color: 'text-green-600', bg: 'bg-green-500' };
  };

  const info = getStrengthLabel(strength);

  return (
    <ToolTemplate
      metadata={metadata}
      howItWorks="Enter a password to check its strength against common security criteria. We analyze length, character variety, and complexity. No data is ever sent to a server."
    >
      <div className="p-6">
        <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input 
                type="text" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                placeholder="Type a password..."
                autoComplete="off"
            />
        </div>

        {password && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Meter */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-500">Strength Rating</span>
                        <span className={`text-lg font-bold ${info.color}`}>{info.label} ({strength}%)</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-500 ease-out ${info.bg}`} 
                            style={{ width: `${strength}%` }}
                        ></div>
                    </div>
                </div>

                {/* Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <Requirement label="At least 8 characters" met={password.length >= 8} />
                     <Requirement label="Contains uppercase letter" met={/[A-Z]/.test(password)} />
                     <Requirement label="Contains lowercase letter" met={/[a-z]/.test(password)} />
                     <Requirement label="Contains number" met={/[0-9]/.test(password)} />
                     <Requirement label="Contains special character" met={/[^A-Za-z0-9]/.test(password)} />
                </div>
            </div>
        )}
        
        {!password && (
            <div className="text-center py-10 text-slate-400">
                <ShieldAlert className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Start typing to see analysis</p>
            </div>
        )}
      </div>
    </ToolTemplate>
  );
};

const Requirement: React.FC<{ label: string; met: boolean }> = ({ label, met }) => (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${met ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-slate-100'}`}>
        {met ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-slate-300" />}
        <span className={`text-sm font-medium ${met ? 'text-green-700' : 'text-slate-500'}`}>{label}</span>
    </div>
);

export default PasswordStrength;