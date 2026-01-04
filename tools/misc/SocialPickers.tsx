import React, { useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import AdNative from '../../components/AdNative';
import { Gift, AlertCircle } from 'lucide-react';

interface Props {
  metadata: ToolMetadata;
  subTool: 'facebook-comment' | 'youtube-comment' | 'facebook-like';
}

const SocialPickers: React.FC<Props> = ({ metadata }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const pick = () => {
    if (!url) return;
    setLoading(true);
    setWinner(null);

    setTimeout(() => {
      setLoading(false);
      setWinner('John Doe');
    }, 2000);
  };

  return (
    <ToolTemplate
      metadata={metadata}
      howItWorks="Paste the link to the post or video. We will fetch the interactions and randomly select a winner for your giveaway."
    >
      <div className="p-6 space-y-10 text-center">

        {/* ICON + INPUT */}
        <div className="max-w-xl mx-auto">
          <div className="bg-pink-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="h-8 w-8 text-pink-600" />
          </div>

          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="Paste Post / Video URL..."
            className="w-full p-4 border border-slate-300 rounded-xl mb-4 shadow-sm focus:ring-2 focus:ring-pink-500"
          />

          {/* 🔥 AD – AFTER INPUT */}
          <AdNative />

          <button
            onClick={pick}
            disabled={loading || !url}
            className="mt-6 bg-pink-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-pink-700 disabled:opacity-50 transition-all transform active:scale-95"
          >
            {loading ? 'Picking Winner...' : 'Pick a Random Winner'}
          </button>

          {/* 🔥 AD – AFTER BUTTON */}
          <div className="mt-6">
            <AdNative />
          </div>
        </div>

        {/* RESULT */}
        {winner && (
          <>
            {/* 🔥 AD – BEFORE RESULT */}
            <AdNative />

            <div className="bg-white border-2 border-pink-100 p-8 rounded-2xl shadow-lg max-w-lg mx-auto animate-in zoom-in duration-300">
              <p className="text-slate-500 uppercase tracking-widest text-xs font-bold mb-2">
                The Winner Is
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 mb-2">
                {winner}
              </h3>
              <p className="text-sm text-slate-400">
                Selected randomly from simulated data
              </p>
            </div>
          </>
        )}

        {/* 🔥 AD – BEFORE DISCLAIMER */}
        <AdNative />

        {/* DISCLAIMER */}
        <div className="flex justify-center">
          <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-lg flex items-center gap-2 max-w-md text-left">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            This tool simulates the picking process. Real social media APIs require authentication and server-side processing.
          </div>
        </div>

      </div>
    </ToolTemplate>
  );
};

export default SocialPickers;
