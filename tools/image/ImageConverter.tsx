import React, { useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { Upload, Download, Image as ImageIcon } from 'lucide-react';

const ImageConverter: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [image, setImage] = useState<string | null>(null);
  const [format, setFormat] = useState('image/png');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            if (ev.target?.result) setImage(ev.target.result as string);
        };
        reader.readAsDataURL(e.target.files[0]);
    }
  };

  const convertAndDownload = () => {
    if (!image) return;
    const img = new Image();
    img.src = image;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(img, 0, 0);
            const ext = format.split('/')[1];
            const dataUrl = canvas.toDataURL(format);
            const link = document.createElement('a');
            link.download = `converted.${ext}`;
            link.href = dataUrl;
            link.click();
        }
    };
  };

  return (
    <ToolTemplate metadata={metadata} howItWorks="Upload an image and convert it to PNG, JPG, or WEBP formats entirely in your browser.">
      <div className="p-6 space-y-6">
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors relative">
            <input 
                type="file" 
                accept="image/*" 
                onChange={handleUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {image ? (
                <img src={image} alt="Preview" className="max-h-64 mx-auto rounded shadow-sm" />
            ) : (
                <div className="text-slate-500">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p className="font-medium">Click or Drag to Upload Image</p>
                    <p className="text-sm">Supports JPG, PNG, WEBP, BMP</p>
                </div>
            )}
        </div>

        {image && (
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center bg-slate-50 p-6 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-slate-700">Convert to:</label>
                    <select 
                        value={format} 
                        onChange={(e) => setFormat(e.target.value)}
                        className="p-2 border border-slate-300 rounded-lg"
                    >
                        <option value="image/png">PNG</option>
                        <option value="image/jpeg">JPG</option>
                        <option value="image/webp">WEBP</option>
                    </select>
                </div>
                <button 
                    onClick={convertAndDownload}
                    className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 shadow-sm flex items-center gap-2"
                >
                    <Download className="h-4 w-4" /> Download
                </button>
            </div>
        )}
      </div>
    </ToolTemplate>
  );
};

export default ImageConverter;