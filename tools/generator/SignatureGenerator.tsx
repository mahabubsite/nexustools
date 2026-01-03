import React, { useRef, useState, useEffect } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { Download, Eraser, PenTool } from 'lucide-react';

const SignatureGenerator: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [width, setWidth] = useState(2);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e);
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getPos = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'signature.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <ToolTemplate metadata={metadata} howItWorks="Draw your signature in the box below using your mouse or touch screen. Download it as a transparent PNG.">
      <div className="p-6">
        <div className="mb-4 flex gap-4 items-center">
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-10 w-10 p-1 rounded cursor-pointer border border-slate-300" />
            <input type="range" min="1" max="10" value={width} onChange={e => setWidth(parseInt(e.target.value))} className="w-32" />
        </div>

        <div className="border-2 border-dashed border-slate-300 rounded-xl overflow-hidden bg-white touch-none mb-6">
            <canvas
                ref={canvasRef}
                width={800}
                height={300}
                className="w-full h-[300px] cursor-crosshair block"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
            />
        </div>

        <div className="flex gap-4">
            <button onClick={clear} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-6 py-2 rounded-lg font-medium hover:bg-slate-200">
                <Eraser className="h-4 w-4" /> Clear
            </button>
            <button onClick={download} className="flex items-center gap-2 bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 shadow-sm ml-auto">
                <Download className="h-4 w-4" /> Download Signature
            </button>
        </div>
      </div>
    </ToolTemplate>
  );
};

export default SignatureGenerator;