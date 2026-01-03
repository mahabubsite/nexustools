import React, { useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
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
        if (subTool === 'YouTube') {
            const videoId = extractVideoId(url);
            if (!videoId) throw new Error("Invalid YouTube URL");

            const response = await fetch(`https://youtube-media-downloader.p.rapidapi.com/v2/video/details?videoId=${videoId}`, {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': apiKey,
                    'x-rapidapi-host': 'youtube-media-downloader.p.rapidapi.com'
                }
            });

            if (!response.ok) {
                const errText = await response.text().catch(() => 'Unknown API Error');
                throw new Error(`YouTube API Error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data) {
                setVideoData({
                    title: data.title || 'YouTube Video',
                    thumbnail: data.thumbnails?.[data.thumbnails.length - 1]?.url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                    duration: data.lengthSeconds ? `${Math.floor(data.lengthSeconds / 60)}:${(data.lengthSeconds % 60).toString().padStart(2, '0')}` : '',
                    downloads: [
                        ...(data.videos?.items || []).map((v: any) => ({
                            quality: v.qualityLabel || 'Video',
                            format: v.container || 'mp4',
                            url: v.url,
                            size: v.sizeText || ''
                        })),
                        ...(data.audios?.items || []).map((a: any) => ({
                            quality: a.qualityLabel || 'Audio',
                            format: a.container || 'mp3',
                            url: a.url,
                            size: a.sizeText || ''
                        }))
                    ]
                });
            }
        } 
        else if (subTool.includes('Instagram')) {
            // Using endpoint /?url=... as standard for this host.
            // Note: If CORS fails, it's a browser restriction.
            const response = await fetch(`https://instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com/?url=${encodeURIComponent(url)}`, {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': apiKey,
                    'x-rapidapi-host': 'instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com'
                }
            });

            if (!response.ok) throw new Error(`Instagram API Error: ${response.status} (Check if account is private)`);
            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                const item = data[0];
                setVideoData({
                    title: 'Instagram Media',
                    thumbnail: item.thumbnail || '',
                    downloads: [{
                        quality: 'High',
                        format: item.type === 'video' ? 'mp4' : 'jpg',
                        url: item.url,
                        size: ''
                    }]
                });
            } else if (data && data.url) {
                 // Handle single object response format
                 setVideoData({
                    title: 'Instagram Media',
                    thumbnail: data.thumbnail || '',
                    downloads: [{
                        quality: 'High',
                        format: 'media',
                        url: data.url,
                        size: ''
                    }]
                });
            } else {
                throw new Error("No media found. The account might be private or the link is invalid.");
            }
        }
        else if (subTool === 'Facebook') {
            // Attempting to use the scraper3 host for video download
            const response = await fetch(`https://facebook-scraper3.p.rapidapi.com/video/download?url=${encodeURIComponent(url)}`, {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': apiKey,
                    'x-rapidapi-host': 'facebook-scraper3.p.rapidapi.com'
                }
            });

            if (!response.ok) {
                 // Try to read error body if possible
                 try {
                    const errJson = await response.json();
                    if (errJson.message) throw new Error(errJson.message);
                 } catch(e) {}
                 throw new Error('Video is private, removed, or the API cannot access it.');
            }
            
            const data = await response.json();

            if (data && (data.hd || data.sd)) {
                 setVideoData({
                    title: data.title || 'Facebook Video',
                    thumbnail: data.thumbnail || '',
                    downloads: [
                        data.hd && { quality: 'HD', format: 'mp4', url: data.hd },
                        data.sd && { quality: 'SD', format: 'mp4', url: data.sd }
                    ].filter(Boolean)
                });
            } else {
                 throw new Error("Could not parse video links from response.");
            }
        }
        else if (subTool === 'TikTok') {
            const formData = new URLSearchParams();
            formData.append('url', url);
            formData.append('hd', '1');

            const response = await fetch('https://tiktok-video-no-watermark2.p.rapidapi.com/', {
                method: 'POST',
                headers: {
                    'x-rapidapi-key': apiKey,
                    'x-rapidapi-host': 'tiktok-video-no-watermark2.p.rapidapi.com',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData
            });

            if (!response.ok) throw new Error(`TikTok API Error: ${response.status}`);
            const data = await response.json();

            if (data && data.data) {
                const v = data.data;
                setVideoData({
                    title: v.title || 'TikTok Video',
                    thumbnail: v.cover || v.origin_cover,
                    downloads: [
                        v.play && { quality: 'No Watermark', format: 'mp4', url: v.play },
                        v.wmplay && { quality: 'Original', format: 'mp4', url: v.wmplay },
                        v.music && { quality: 'Audio', format: 'mp3', url: v.music }
                    ].filter(Boolean)
                });
            } else {
                throw new Error("Failed to process TikTok URL. Please check the link.");
            }
        }
        else {
            setTimeout(() => {
                setError(`API integration for ${subTool} is currently under maintenance.`);
                setLoading(false);
            }, 1000);
            return;
        }

    } catch (err: any) {
        console.error("Download Error:", err);
        let msg = err.message || "Failed to fetch media.";
        
        if (msg === 'Failed to fetch') {
            msg = "Network Error: The API request was blocked. This often happens due to CORS (Cross-Origin Resource Sharing) restrictions in the browser or AdBlockers. Please try disabling your AdBlocker or use a different browser.";
        }
        
        setError(msg);
    } finally {
        setLoading(false);
    }
  };

  return (
    <ToolTemplate 
      metadata={metadata} 
      howItWorks={`Paste the link to the ${subTool} video or post you want to download. Click the download button to process the link.`}
    >
      <div className="p-6 space-y-8">
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center">
                <div className="bg-brand-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    {subTool.includes('Image') ? <ImageIcon className="h-8 w-8 text-brand-600" /> : <Video className="h-8 w-8 text-brand-600" />}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{subTool} Downloader</h2>
            </div>
            
            <div className="relative">
                <input 
                    type="text" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={`Paste ${subTool} URL here...`}
                    className="block w-full p-4 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none shadow-sm text-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
                <button 
                    onClick={handleDownload}
                    disabled={loading || !url}
                    className="absolute right-2 top-2 bottom-2 px-6 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'Download'}
                </button>
            </div>

            {error && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl text-left flex gap-3 items-start animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-amber-800 dark:text-amber-300">Notice</h4>
                        <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">{error}</p>
                    </div>
                </div>
            )}

            {videoData && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/3">
                            <img src={videoData.thumbnail} alt={videoData.title} className="w-full rounded-lg shadow-md aspect-video object-cover" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{videoData.title}</h3>
                            {videoData.duration && <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1"><PlayCircle className="h-4 w-4" /> {videoData.duration}</p>}
                            
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Download Links</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {videoData.downloads && videoData.downloads.length > 0 ? (
                                        videoData.downloads.map((dl: any, idx: number) => (
                                            <a 
                                                key={idx} 
                                                href={dl.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors group"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{dl.quality}</span>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">{dl.format}</span>
                                                </div>
                                                <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-brand-600" />
                                            </a>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500">No direct download links found. This might be a restricted video.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </ToolTemplate>
  );
};

export default SocialDownloader;