import React, { useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { Search, Download, ExternalLink, Image } from 'lucide-react';

const YoutubeThumbnail: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [error, setError] = useState('');

  const extractVideoId = (input: string) => {
    setError('');
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = input.match(regExp);
    if (match && match[7].length === 11) {
      setVideoId(match[7]);
    } else {
      setError('Invalid YouTube URL');
      setVideoId('');
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUrl(val);
    if (val) extractVideoId(val);
    else setVideoId('');
  };

  return (
    <ToolTemplate 
      metadata={metadata} 
      howItWorks="Paste a YouTube video URL (e.g., https://www.youtube.com/watch?v=...) into the input box. The tool will automatically extract and display thumbnails in various qualities (HD, SD, Normal) which you can download."
    >
      <div className="p-6 space-y-8">
        {/* Input Section */}
        <div className="max-w-3xl mx-auto">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                    type="text" 
                    value={url}
                    onChange={handleInput}
                    placeholder="Paste YouTube URL here..."
                    className="block w-full pl-10 pr-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none shadow-sm text-lg"
                />
            </div>
            {error && <p className="mt-2 text-red-600 text-sm font-medium">{error}</p>}
        </div>

        {/* Results Section */}
        {videoId && (
            <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* HD Quality */}
                <ThumbnailCard 
                    title="Max Resolution (HD)" 
                    size="1280x720"
                    url={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    primary
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ThumbnailCard 
                        title="Standard Quality" 
                        size="640x480"
                        url={`https://img.youtube.com/vi/${videoId}/sddefault.jpg`}
                    />
                    <ThumbnailCard 
                        title="High Quality" 
                        size="480x360"
                        url={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <ThumbnailCard 
                        title="Medium Quality" 
                        size="320x180"
                        url={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                    />
                     <ThumbnailCard 
                        title="Default" 
                        size="120x90"
                        url={`https://img.youtube.com/vi/${videoId}/default.jpg`}
                    />
                </div>
            </div>
        )}

        {!videoId && !error && (
             <div className="text-center py-12 text-slate-400">
                <Image className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p>Thumbnails will appear here after you paste a URL.</p>
             </div>
        )}
      </div>
    </ToolTemplate>
  );
};

const ThumbnailCard: React.FC<{ title: string; size: string; url: string; primary?: boolean }> = ({ title, size, url, primary }) => {
    // Note: Direct download attribute often blocked by CORS for cross-origin images
    // We open in new tab as a fallback safe method
    const download = () => {
        window.open(url, '_blank');
    };

    return (
        <div className={`bg-white rounded-xl border ${primary ? 'border-brand-200 shadow-md ring-1 ring-brand-100' : 'border-slate-200 shadow-sm'} overflow-hidden`}>
            <div className="aspect-video bg-slate-100 relative group">
                <img src={url} alt={title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button 
                        onClick={download}
                        className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all flex items-center gap-2"
                    >
                        <ExternalLink className="h-4 w-4" /> Open
                    </button>
                </div>
            </div>
            <div className="p-4 flex items-center justify-between">
                <div>
                    <h3 className={`font-bold ${primary ? 'text-lg text-slate-900' : 'text-base text-slate-700'}`}>{title}</h3>
                    <p className="text-xs text-slate-500">{size}</p>
                </div>
                <button 
                    onClick={download}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${primary ? 'bg-brand-600 text-white hover:bg-brand-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                    <Download className="h-4 w-4" /> <span className="hidden sm:inline">Download</span>
                </button>
            </div>
        </div>
    );
}

export default YoutubeThumbnail;