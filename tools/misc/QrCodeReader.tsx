import React, { useState, useEffect, useRef } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import AdNative from '../../components/AdNative';
import { ScanLine, Copy, RefreshCcw, Camera, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';

const QrCodeReader: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [mode, setMode] = useState<'camera' | 'image'>('camera');
  const [isScanning, setIsScanning] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const scannerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try { scannerRef.current.clear(); } catch {}
        scannerRef.current = null;
      }
    };
  }, [mode]);

  useEffect(() => {
    if (mode === 'camera' && isScanning && !scanResult) {
      setTimeout(() => {
        const Html5QrcodeScanner = (window as any).Html5QrcodeScanner;
        if (!Html5QrcodeScanner) return;

        if (scannerRef.current) {
          try { scannerRef.current.clear(); } catch {}
        }

        const scanner = new Html5QrcodeScanner(
          'reader',
          { fps: 10, qrbox: { width: 250, height: 250 } },
          false
        );

        scannerRef.current = scanner;

        scanner.render(
          (text: string) => {
            setScanResult(text);
            try { scanner.clear(); } catch {}
            setIsScanning(false);
          },
          () => {}
        );
      }, 150);
    }
  }, [mode, isScanning, scanResult]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploadError('');
    setScanResult(null);

    const file = e.target.files[0];
    e.target.value = '';

    try {
      const Html5Qrcode = (window as any).Html5Qrcode;
      const reader = new Html5Qrcode('file-reader-hidden');
      const result = await reader.scanFile(file, true);
      setScanResult(result);
      await reader.clear();
    } catch {
      setUploadError('No QR code detected. Try a clearer image.');
    }
  };

  const reset = () => {
    setScanResult(null);
    setUploadError('');
    if (mode === 'camera') setIsScanning(true);
  };

  return (
    <ToolTemplate metadata={metadata}>
      <div className="p-6 space-y-8">

        {/* MODE TOGGLE */}
        <div className="flex justify-center">
          <div className="bg-slate-100 p-1 rounded-lg flex">
            <button
              onClick={() => { setMode('camera'); setScanResult(null); }}
              className={`px-6 py-2 rounded-md flex gap-2 items-center text-sm font-semibold ${
                mode === 'camera' ? 'bg-white text-brand-600 shadow' : 'text-slate-500'
              }`}
            >
              <Camera className="h-4 w-4" /> Camera
            </button>
            <button
              onClick={() => { setMode('image'); setScanResult(null); }}
              className={`px-6 py-2 rounded-md flex gap-2 items-center text-sm font-semibold ${
                mode === 'image' ? 'bg-white text-brand-600 shadow' : 'text-slate-500'
              }`}
            >
              <ImageIcon className="h-4 w-4" /> Upload
            </button>
          </div>
        </div>

        {/* 🔥 AD – AFTER MODE SELECT */}
        <AdNative />

        {/* CAMERA MODE */}
        {mode === 'camera' && !scanResult && (
          <>
            {!isScanning ? (
              <div className="text-center py-10 border border-dashed rounded-xl bg-slate-50">
                <Camera className="h-14 w-14 mx-auto text-slate-300 mb-4" />
                <button
                  onClick={() => setIsScanning(true)}
                  className="bg-brand-600 text-white px-8 py-3 rounded-full font-bold flex gap-2 items-center mx-auto"
                >
                  <ScanLine className="h-5 w-5" /> Start Scanning
                </button>
              </div>
            ) : (
              <div className="max-w-md mx-auto">
                <div id="reader" className="rounded-xl border min-h-[300px]" />
                <button onClick={() => setIsScanning(false)} className="mt-4 w-full text-red-600">
                  Stop Camera
                </button>
              </div>
            )}

            {/* 🔥 AD – BELOW CAMERA AREA */}
            <AdNative />
          </>
        )}

        {/* IMAGE MODE */}
        {mode === 'image' && !scanResult && (
          <>
            <div className="border-2 border-dashed rounded-xl p-10 text-center relative">
              <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              <Upload className="h-14 w-14 mx-auto text-slate-300 mb-4" />
              <p className="font-medium">Upload QR Image</p>
            </div>

            {uploadError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg flex gap-2 justify-center">
                <AlertCircle className="h-5 w-5" /> {uploadError}
              </div>
            )}

            <div id="file-reader-hidden" style={{ display: 'none' }}></div>

            {/* 🔥 AD – AFTER UPLOAD */}
            <AdNative />
          </>
        )}

        {/* RESULT */}
        {scanResult && (
          <>
            {/* 🔥 AD – BEFORE RESULT */}
            <AdNative />

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Scan Successful</h3>

              <div className="bg-white border rounded-xl p-6 mb-6 relative">
                <p className="font-mono break-all">{scanResult}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(scanResult)}
                  className="absolute top-2 right-2 p-2 bg-slate-100 rounded"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={reset}
                  className="bg-brand-600 text-white px-6 py-2 rounded-lg flex gap-2"
                >
                  <RefreshCcw className="h-4 w-4" /> Scan Again
                </button>
                {scanResult.startsWith('http') && (
                  <a href={scanResult} target="_blank" rel="noreferrer" className="border px-6 py-2 rounded-lg">
                    Open Link
                  </a>
                )}
              </div>
            </div>

            {/* 🔥 AD – AFTER RESULT ACTIONS */}
            <AdNative />
          </>
        )}
      </div>
    </ToolTemplate>
  );
};

export default QrCodeReader;
