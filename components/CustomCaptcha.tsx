import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Check } from 'lucide-react';

interface CustomCaptchaProps {
  onVerify: (isValid: boolean) => void;
}

const CustomCaptcha: React.FC<CustomCaptchaProps> = ({ onVerify }) => {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateCode = () => {
    // Exclude characters that look similar (I, 1, O, 0, l)
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const drawCaptcha = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background
    ctx.fillStyle = '#f8fafc'; // slate-50
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Noise Lines
    for (let i = 0; i < 7; i++) {
        ctx.strokeStyle = `rgba(100, 116, 139, ${Math.random() * 0.5})`;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
    }

    // Noise Dots
    for (let i = 0; i < 50; i++) {
        ctx.fillStyle = `rgba(100, 116, 139, ${Math.random() * 0.5})`;
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Text
    ctx.font = 'bold 28px monospace';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    
    // Draw characters with rotation and slight styling
    const startX = 25;
    const spacing = 28;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        ctx.save();
        ctx.translate(startX + i * spacing, canvas.height / 2);
        ctx.rotate((Math.random() - 0.5) * 0.4); // Random tilt
        ctx.fillStyle = `rgb(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)})`;
        ctx.fillText(char, 0, 0);
        ctx.restore();
    }
  };

  const refresh = () => {
    const newCode = generateCode();
    setCode(newCode);
    setInput('');
    setIsVerified(false);
    setError(false);
    onVerify(false);
    // Draw on next tick to ensure canvas is ready/refreshed
    setTimeout(() => drawCaptcha(newCode), 0);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleVerifyClick = () => {
    if (input.toUpperCase().trim() === code) {
        setIsVerified(true);
        setError(false);
        onVerify(true);
    } else {
        setIsVerified(false);
        setError(true);
        onVerify(false);
        // Optional: refresh on fail to prevent brute force? 
        // Keeping current code allows user to fix typo.
        setInput('');
        refresh(); // Refreshing code on error for better security
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex items-center justify-between gap-3">
            <canvas 
                ref={canvasRef} 
                width={200} 
                height={60} 
                className="rounded-lg border border-slate-300 bg-white cursor-pointer w-full max-w-[200px]" 
                onClick={refresh} 
                title="Click to get a new code" 
            />
            <button 
                type="button" 
                onClick={refresh} 
                className="p-2 text-slate-500 hover:text-brand-600 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm transition-colors"
            >
                <RefreshCw className="h-5 w-5" />
            </button>
        </div>
        
        <div className="relative">
            <input 
                type="text" 
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(false); }}
                disabled={isVerified}
                placeholder="Type the letters above"
                className={`w-full p-3 border rounded-lg text-center uppercase tracking-widest font-bold focus:outline-none focus:ring-2 transition-all ${
                    error 
                    ? 'border-red-300 focus:ring-red-200 bg-red-50 text-red-900' 
                    : isVerified 
                        ? 'border-green-300 bg-green-50 text-green-900'
                        : 'border-slate-300 focus:ring-brand-500 dark:bg-slate-900 dark:border-slate-600'
                }`}
                maxLength={6}
            />
        </div>

        <div className="flex items-center">
            <button 
                type="button"
                onClick={handleVerifyClick}
                disabled={isVerified || !input}
                className={`flex items-center gap-3 px-1 py-1 rounded-lg transition-all w-full select-none ${isVerified ? 'cursor-default' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
                <div className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-colors ${
                    isVerified 
                    ? 'bg-green-500 border-green-500' 
                    : error 
                        ? 'border-red-400' 
                        : 'bg-white dark:bg-slate-900 border-slate-400'
                }`}>
                    {isVerified && <Check className="h-4 w-4 text-white" />}
                </div>
                <span className={`text-sm font-medium ${isVerified ? 'text-green-600' : error ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'}`}>
                    {isVerified ? 'Verification Successful' : error ? 'Incorrect Code, Try Again' : 'I am not a robot'}
                </span>
            </button>
        </div>
    </div>
  );
};

export default CustomCaptcha;