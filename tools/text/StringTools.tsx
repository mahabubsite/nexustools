import React, { useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import AdNative from '../../components/AdNative';
import { RefreshCw, Copy, Smile } from 'lucide-react';

interface Props {
  metadata: ToolMetadata;
  subTool: 'reverse' | 'emoji' | 'upsidedown' | 'palindrome';
}

const StringTools: React.FC<Props> = ({ metadata, subTool }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isPalindrome, setIsPalindrome] = useState<boolean | null>(null);

  const process = (text: string) => {
    setInput(text);
    if (!text) {
      setOutput('');
      setIsPalindrome(null);
      return;
    }

    switch (subTool) {
      case 'reverse':
        setOutput(text.split('').reverse().join(''));
        break;

      case 'emoji':
        setOutput(
          text.replace(
            /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu,
            ''
          )
        );
        break;

      case 'upsidedown':
        const map: Record<string, string> = {
          a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ', j: 'ɾ',
          k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's',
          t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z',
          A: '∀', B: 'q', C: 'Ɔ', D: 'p', E: 'Ǝ', F: 'Ⅎ', G: 'פ', H: 'H', I: 'I',
          J: 'ſ', K: 'ʞ', L: '˥', M: 'W', N: 'N', O: 'O', P: 'd', Q: 'b', R: 'ɹ',
          S: 'S', T: '┴', U: '∩', V: 'Λ', W: 'M', X: 'X', Y: '⅄', Z: 'Z',
          1: 'Ɩ', 2: 'ᄅ', 3: 'Ɛ', 4: 'ㄣ', 5: 'ϛ', 6: '9', 7: 'ㄥ', 8: '8',
          9: '6', 0: '0', '.': '˙', ',': "'", '?': '¿', '!': '¡'
        };
        setOutput(
          text
            .split('')
            .reverse()
            .map(c => map[c] || c)
            .join('')
        );
        break;

      case 'palindrome':
        const clean = text.toLowerCase().replace(/[^a-z0-9]/g, '');
        const rev = clean.split('').reverse().join('');
        const ok = clean === rev && clean.length > 0;
        setIsPalindrome(ok);
        setOutput(ok ? 'Yes, it is a palindrome!' : 'No, it is not a palindrome.');
        break;
    }
  };

  return (
    <ToolTemplate metadata={metadata}>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* INPUT */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Input
          </label>
          <textarea
            value={input}
            onChange={(e) => process(e.target.value)}
            className="w-full h-48 p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Type here..."
          />

          {/* 🔥 AD – AFTER INPUT */}
          <div className="mt-4">
            <AdNative />
          </div>
        </div>

        {/* RESULT */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-slate-700">
              Result
            </label>
            {output && (
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="text-xs text-brand-600 hover:underline flex items-center gap-1"
              >
                <Copy className="h-3 w-3" /> Copy
              </button>
            )}
          </div>

          {subTool === 'palindrome' ? (
            <div
              className={`flex-1 flex items-center justify-center text-xl font-bold rounded-lg border ${
                isPalindrome === true
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : isPalindrome === false
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              {input ? output : 'Waiting for input...'}
            </div>
          ) : (
            <textarea
              readOnly
              value={output}
              className="flex-1 w-full p-4 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none"
              placeholder="Result..."
            />
          )}

          {/* 🔥 AD – AFTER RESULT */}
          <div className="mt-4">
            <AdNative />
          </div>
        </div>

        {/* 🔥 AD – PAGE BOTTOM */}
        <div className="md:col-span-2 mt-2">
          <AdNative />
        </div>

      </div>
    </ToolTemplate>
  );
};

export default StringTools;
