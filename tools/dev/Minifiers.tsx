import React, { useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { FileCode, ArrowDown } from 'lucide-react';
import AdNative from '../../components/AdNative'; // 🔥 add this

interface Props {
  metadata: ToolMetadata;
  subTool: 'html' | 'css' | 'js';
}

const Minifiers: React.FC<Props> = ({ metadata, subTool }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState({ oldSize: 0, newSize: 0, saved: 0 });

  const minify = () => {
    if(!input) return;
    let res = input;
    
    if (subTool === 'html') {
        res = res.replace(/<!--[\s\S]*?-->/g, "").replace(/\s+/g, " ").replace(/>\s+</g, "><");
    } else if (subTool === 'css') {
        res = res.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,])\s*/g, "$1").replace(/;}/g, "}");
    } else {
        res = res.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*/g, "");
        res = res.replace(/\s+/g, " ");
        res = res.replace(/\s*([=+\-*/{}();,])\s*/g, "$1");
    }

    setOutput(res.trim());
    
    const oldB = new Blob([input]).size;
    const newB = new Blob([res]).size;
    setStats({
        oldSize: oldB,
        newSize: newB,
        saved: Math.round((1 - newB/oldB) * 100)
    });
  };

  return (
    <ToolTemplate metadata={metadata}>
      <div className="p-6 space-y-6">
        <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            className="w-full h-64 p-4 font-mono text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder={`Paste your ${subTool.toUpperCase()} code here...`}
        />

        <div className="flex justify-center">
            <button onClick={minify} className="bg-brand-600 text-white px-8 py-3 rounded-full font-bold hover:bg-brand-700 flex items-center gap-2">
                Minify {subTool.toUpperCase()} <ArrowDown className="h-5 w-5" />
            </button>
        </div>

        {output && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-2 px-2">
                    <span className="text-sm font-bold text-slate-700">Result</span>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Saved {stats.saved}% ({stats.oldSize}b → {stats.newSize}b)</span>
                </div>
                <textarea
                    readOnly
                    value={output}
                    className="w-full h-64 p-4 font-mono text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
                />
            </div>
        )}

        {/* 🔥 AD PLACE — after result */}
        <AdNative />
      </div>
    </ToolTemplate>
  );
};

export default Minifiers;
