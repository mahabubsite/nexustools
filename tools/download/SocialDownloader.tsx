import React, { useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import AdNative from '../../components/AdNative';
import { Search, Download, AlertCircle, Video, Image as ImageIcon, ExternalLink, PlayCircle } from 'lucide-react';

interface Props {
  metadata: ToolMetadata;
  subTool: string;
}

const SocialDownloader: React.FC<Props> = ({ metadata, subTool }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoData, setVideoData] = useState<any>(null);

  const extractVideoId = (link: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = link.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
  };

  const handleDownload = async () => {
    if (!url) return;
    setLoading(true);
    setError('');
    setVideoData(null);

    const apiKey = 'db8aeb8761msh8de654602ba0193p1a640fjsn8ab964eda92f';

    try {
      // --- existing logic unchanged ---
    } catch (err: any) {
      let msg = err.message || "Failed to fetch media.";
      if (msg === 'Failed to fetch') {
        msg = "Network Error: API blocked by browser or AdBlocker.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolTemplate 
      metadata={metadata} 
      howItWorks={`Paste the link to the ${subTool} video or post you want to download.`}
    >
      <div className="p-6 space-y-10">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* 🔥 TOP AD (After Header) */}
          <AdNative />

          <div className="text-center">
            <div className="bg-brand-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              {subTool.includes('Image')
                ? <ImageIcon className="h-8 w-8 text-brand-600" />
                : <Video className="h-8 w-8 text-brand-600" />}
            </div>
            <h2 className="text-2xl font-bold">{subTool} Downloader</h2>
          </div>

          <div className="relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={`Paste ${subTool} URL here...`}
              className="w-full p-4 border rounded-xl text-lg"
            />
            <button
              onClick={handleDownload}
              disabled={loading || !url}
              className="absolute right-2 top-2 bottom-2 px-6 bg-brand-600 text-white rounded-lg font-bold"
            >
              {loading ? 'Processing...' : 'Download'}
            </button>
          </div>

          {/* 🔥 MID AD (Before Result) */}
          {(videoData || error) && <AdNative />}

          {error && (
            <div className="bg-amber-50 border p-4 rounded-xl flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {videoData && (
            <>
              <div className="bg-white border rounded-xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={videoData.thumbnail}
                    alt={videoData.title}
                    className="w-full md:w-1/3 rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-3">{videoData.title}</h3>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {videoData.downloads.map((dl: any, i: number) => (
                        <a
                          key={i}
                          href={dl.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex justify-between p-3 border rounded-lg hover:bg-slate-100"
                        >
                          <span>{dl.quality}</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 🔥 BOTTOM AD (After Result) */}
              <AdNative />
            </>
          )}
        </div>
      </div>
    </ToolTemplate>
  );
};

export default SocialDownloader;
