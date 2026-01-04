import React, { useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import AdNative from '../../components/AdNative'; // 🔥 add this

const ColorConverter: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [hex, setHex] = useState('#0ea5e9');
  
  // Basic conversions
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgb = hexToRgb(hex) || { r: 0, g: 0, b: 0 };
  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

  return (
    <ToolTemplate metadata={metadata} howItWorks="Select a color using the picker or enter a HEX code. We instantly convert it to RGB format.">
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3">
                 <div 
                    className="w-full aspect-square rounded-xl shadow-inner border border-slate-200 mb-4"
                    style={{ backgroundColor: hex }}
                 ></div>
                 <input 
                    type="color" 
                    value={hex}
                    onChange={(e) => setHex(e.target.value)}
                    className="w-full h-12 cursor-pointer"
                 />
            </div>

            <div className="w-full md:w-2/3 space-y-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <label className="text-xs font-bold text-slate-500 uppercase">HEX</label>
                    <div className="text-xl font-mono text-slate-800">{hex}</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <label className="text-xs font-bold text-slate-500 uppercase">RGB</label>
                    <div className="text-xl font-mono text-slate-800">{rgbString}</div>
                </div>
                 <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <label className="text-xs font-bold text-slate-500 uppercase">CSS</label>
                    <div className="text-xl font-mono text-slate-800">background-color: {hex};</div>
                </div>
            </div>
        </div>

        {/* 🔥 AD PLACE — AFTER RESULT */}
        <AdNative />
      </div>
    </ToolTemplate>
  );
};

export default ColorConverter;
