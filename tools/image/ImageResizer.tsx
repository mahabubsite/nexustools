import React, { useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { Upload, Download, RefreshCcw } from 'lucide-react';

const ImageResizer: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [src, setSrc] = useState<string>('');
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(true);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const url = URL.createObjectURL(e.target.files[0]);
        const img = new Image();
        img.src = url;
        img.onload = () => {
            setImage(img);
            setSrc(url);
            setWidth(img.width);
            setHeight(img.height);
        };
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    setWidth(val);
    if (aspectRatio && image) {
        setHeight(Math.round(val * (image.height / image.width)));
    }
  };

  const download = () => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.drawImage(image, 0, 0, width, height);
        const link = document.createElement('a');
        link.download = 'resized-image.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
  };

  return (
    <ToolTemplate metadata={metadata} howItWorks="Upload an image, set your desired dimensions, and download the resized version. All processing happens in your browser.">
      <div className="p-6 space-y-6">
        {!image ? (
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:bg-slate-50 transition-colors relative">
                <input type="file" accept="image/*" onChange={handleUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <Upload className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p className="font-medium">Upload Image to Resize</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-center">
                    <img src={src} className="max-w-full max-h-96 object-contain" alt="Preview" />
                </div>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Width (px)</label>
                            <input type="number" value={width} onChange={handleWidthChange} className="w-full p-2 border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Height (px)</label>
                            <input 
                                type="number" 
                                value={height} 
                                onChange={(e) => setHeight(parseInt(e.target.value))}
                                className="w-full p-2 border border-slate-300 rounded-lg"
                                disabled={aspectRatio}
                            />
                        </div>
                    </div>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={aspectRatio} onChange={(e) => setAspectRatio(e.target.checked)} className="rounded text-brand-600" />
                        <span className="text-sm text-slate-700">Maintain Aspect Ratio</span>
                    </label>

                    <div className="flex gap-4 pt-4">
                        <button onClick={download} className="flex-1 bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 flex items-center justify-center gap-2">
                            <Download className="h-5 w-5" /> Download Resized
                        </button>
                        <button onClick={() => { setImage(null); setSrc(''); }} className="px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700">
                            <RefreshCcw className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </ToolTemplate>
  );
};

export default ImageResizer;