import React, { useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import AdNative from '../../components/AdNative';
import { HardDrive } from 'lucide-react';

interface Props {
  metadata: ToolMetadata;
  subTool: 'separator' | 'extractor' | 'size';
}

const TextUtilities: React.FC<Props> = ({ metadata, subTool }) => {
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState('-');
  const [output, setOutput] = useState('');
  const [sizeInfo, setSizeInfo] = useState({ bytes: 0, kb: 0, mb: 0 });

  const process = (val: string, sep: string) => {
    setInput(val);

    if (subTool === 'separator') {
      const char = sep === 'newline' ? '\n' : sep;
      const parts = val.split(/[\s,\.\-]+/).filter(Boolean);
      setOutput(parts.join(char));
    }

    if (subTool === 'extractor') {
      const urls = val.match(/(https?:\/\/[^\s]+)/g);
      setOutput(urls ? urls.join('\n') : 'No URLs found.');
    }

    if (subTool === 'size') {
      const blob = new Blob([val]);
      setSizeInfo({
        bytes: blob.size,
        kb: parseFloat((blob.size / 1024).toFixed(2)),
        mb: parseFloat((blob.size / (1024 * 1024)).toFixed(4)),
      });
    }
  };

  return (
    <ToolTemplate metadata={metadata}>
      <div className="p-6 space-y-6">

        {/* SEPARATOR OPTIONS */}
        {subTool === 'separator' && (
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-slate-700">
              Separate By:
            </label>
            <select
              value={separator}
              onChange={(e) => {
                setSeparator(e.target.value);
                process(input, e.target.value);
              }}
              className="p-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="-">Hyphen (-)</option>
              <option value="_">Underscore (_)</option>
              <option value=",">Comma (,)</option>
              <option value=".">Dot (.)</option>
              <option value="|">Pipe (|)</option>
              <option value="newline">New Line</option>
            </select>
          </div>
        )}

        {/* 🔥 AD – AFTER OPTIONS */}
        <AdNative />

        {/* INPUT / OUTPUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Input Text
            </label>
            <textarea
              value={input}
              onChange={(e) => process(e.target.value, separator)}
              className="w-full h-64 p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Enter your text here..."
            />
          </div>

          {subTool === 'size' ? (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 flex flex-col justify-center items-center space-y-4">
              <HardDrive className="h-12 w-12 text-brand-600" />
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">
                  {sizeInfo.bytes}{' '}
                  <span className="text-lg font-normal text-slate-500">
                    Bytes
                  </span>
                </div>
                <div className="text-xl font-semibold text-slate-700">
                  {sizeInfo.kb}{' '}
                  <span className="text-sm font-normal text-slate-500">
                    KB
                  </span>
                </div>
                <div className="text-lg text-slate-600">
                  {sizeInfo.mb}{' '}
                  <span className="text-sm font-normal text-slate-500">
                    MB
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Result
              </label>
              <textarea
                readOnly
                value={output}
                className="w-full h-64 p-4 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* 🔥 AD – AFTER RESULT */}
        <AdNative />

      </div>
    </ToolTemplate>
  );
};

export default TextUtilities;
