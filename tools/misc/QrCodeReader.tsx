import React, { useState, useEffect, useRef } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { ScanLine, Copy, RefreshCcw, Camera, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';

const QrCodeReader: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [mode, setMode] = useState<'camera' | 'image'>('camera');
  const [isScanning, setIsScanning] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  // Reference to the scanner instance to clear it properly
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    // Cleanup function when component unmounts or mode changes
    return () => {
        if (scannerRef.current) {
            try { 
                // Attempt to clear, but don't await in sync cleanup
                scannerRef.current.clear().catch((e: any) => console.debug("Scanner cleanup", e));
            } catch(e) { 
                // ignore
            }
            scannerRef.current = null;
        }
    };
  }, [mode]);

  useEffect(() => {
    if (mode === 'camera' && isScanning && !scanResult) {
      // Small delay to ensure DOM element exists
      const timer = setTimeout(() => {
        try {
            const Html5QrcodeScanner = (window as any).Html5QrcodeScanner;
            
            if (Html5QrcodeScanner) {
                // If a scanner already exists, clear it first
                if (scannerRef.current) {
                    try { scannerRef.current.clear(); } catch(e) {}
                }

                const scanner = new Html5QrcodeScanner(
                    "reader",
                    { 
                        fps: 10, 
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0,
                        rememberLastUsedCamera: true
                    },
                    /* verbose= */ false
                );
                
                scannerRef.current = scanner;
            
                scanner.render(
                    (decodedText: string) => {
                        setScanResult(decodedText);
                        try { scanner.clear(); } catch(e) {}
                        setIsScanning(false);
                    }, 
                    (errorMessage: string) => {
                        // ignore scanning errors during feed
                    }
                );
            }
        } catch (e) {
            console.error("Scanner init error", e);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [mode, isScanning, scanResult]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        // Reset state
        setUploadError('');
        setScanResult(null);
        
        // Reset input value to allow re-uploading same file
        e.target.value = '';
        
        try {
            const Html5Qrcode = (window as any).Html5Qrcode;
            if (!Html5Qrcode) {
                setUploadError("Scanner library not loaded.");
                return;
            }

            const html5QrCode = new Html5Qrcode("file-reader-hidden");
            try {
                // scanFile(file, showImage)
                const result = await html5QrCode.scanFile(file, true);
                setScanResult(result);
            } catch (err: any) {
                const errorMsg = err?.toString() || "";
                // Handle the specific error gracefully
                if (errorMsg.includes("No MultiFormat Readers were able to detect the code")) {
                    setUploadError("No QR code or barcode detected. Please try a clearer image.");
                } else {
                    setUploadError("Could not read image. Please ensure it is a valid image file.");
                    console.warn("Scan error:", err);
                }
            } finally {
                // Ensure we clean up the instance
                try {
                    await html5QrCode.clear();
                } catch (cleanupErr) {
                    // Ignore cleanup errors
                }
            }
        } catch (err) {
            setUploadError("Error initializing scanner.");
            console.error(err);
        }
    }
  };

  const handleCopy = () => {
      if(scanResult) navigator.clipboard.writeText(scanResult);
  };

  const reset = () => {
      setScanResult(null);
      setUploadError('');
      if (mode === 'camera') {
        setIsScanning(true);
      }
  };

  const switchMode = (newMode: 'camera' | 'image') => {
      setMode(newMode);
      setScanResult(null);
      setUploadError('');
      setIsScanning(false);
  };

  return (
    <ToolTemplate metadata={metadata} howItWorks="Use your camera to scan QR codes/Barcodes in real-time, or upload an image file to extract data.">
      <div className="p-6 space-y-6">
        {/* Mode Toggles */}
        <div className="flex justify-center mb-6">
            <div className="bg-slate-100 p-1 rounded-lg inline-flex">
                <button 
                    onClick={() => switchMode('camera')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-semibold transition-all ${mode === 'camera' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Camera className="h-4 w-4" /> Camera
                </button>
                <button 
                    onClick={() => switchMode('image')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-semibold transition-all ${mode === 'image' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <ImageIcon className="h-4 w-4" /> Upload Image
                </button>
            </div>
        </div>

        {/* Camera Mode */}
        {mode === 'camera' && !scanResult && (
            <div className="space-y-6">
                {!isScanning ? (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <Camera className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Ready to Scan</h3>
                        <p className="text-slate-500 mb-6">Access your camera to read QR codes instantly.</p>
                        <button 
                            onClick={() => setIsScanning(true)}
                            className="bg-brand-600 text-white px-8 py-3 rounded-full font-bold hover:bg-brand-700 transition-colors flex items-center gap-2 mx-auto"
                        >
                            <ScanLine className="h-5 w-5" /> Start Scanning
                        </button>
                    </div>
                ) : (
                    <div className="max-w-md mx-auto">
                        <div id="reader" className="overflow-hidden rounded-xl border border-slate-300 shadow-sm bg-black min-h-[300px]"></div>
                        <p className="text-center text-sm text-slate-500 mt-4">Point your camera at a QR code</p>
                        <button onClick={() => setIsScanning(false)} className="mt-4 w-full py-2 text-red-600 hover:bg-red-50 rounded-lg">Stop Camera</button>
                    </div>
                )}
            </div>
        )}

        {/* Image Mode */}
        {mode === 'image' && !scanResult && (
             <div className="space-y-6">
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:bg-slate-50 transition-colors relative">
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload}
                        onClick={(e) => { (e.target as HTMLInputElement).value = ''; }} // Ensure click resets value to allow re-selection
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    />
                    <Upload className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Upload Image</h3>
                    <p className="text-slate-500">Drag & drop or click to select a QR code image</p>
                </div>
                {uploadError && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 justify-center">
                        <AlertCircle className="h-5 w-5" /> {uploadError}
                    </div>
                )}
                {/* Hidden div required for Html5Qrcode file scan */}
                <div id="file-reader-hidden" style={{ display: 'none' }}></div>
             </div>
        )}

        {/* Results Display */}
        {scanResult && (
            <div className="max-w-xl mx-auto text-center animate-in fade-in zoom-in duration-300">
                <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ScanLine className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Scan Successful!</h3>
                
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6 text-left relative group">
                    <p className="font-mono text-lg break-all text-slate-800">{scanResult}</p>
                    <button 
                        onClick={handleCopy}
                        className="absolute top-2 right-2 p-2 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 transition-colors opacity-0 group-hover:opacity-100"
                        title="Copy"
                    >
                        <Copy className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex gap-4 justify-center">
                    <button 
                        onClick={reset}
                        className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 flex items-center gap-2"
                    >
                        <RefreshCcw className="h-4 w-4" /> Scan Another
                    </button>
                    {scanResult.startsWith('http') && (
                        <a 
                            href={scanResult} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-white border border-slate-300 text-slate-700 px-6 py-2 rounded-lg font-medium hover:bg-slate-50"
                        >
                            Open Link
                        </a>
                    )}
                </div>
            </div>
        )}
      </div>
    </ToolTemplate>
  );
};

export default QrCodeReader;