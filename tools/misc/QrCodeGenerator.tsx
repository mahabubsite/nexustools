import React, { useState, useEffect, useRef } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { Download, Wifi, MessageCircle, User, Link as LinkIcon, Type, Smartphone, Box } from 'lucide-react';
import QRCode from 'qrcode';

type QRType = 'text' | 'url' | 'wifi' | 'whatsapp' | 'barcode';

const QrCodeGenerator: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [type, setType] = useState<QRType>('text');
  
  // Generic State
  const [text, setText] = useState('https://example.com');
  
  // WiFi State
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState('WPA');
  
  // WhatsApp State
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  // Barcode State
  const [barcodeFormat, setBarcodeFormat] = useState('CODE128');
  
  // Visual Options
  const [size, setSize] = useState(256);
  const [colorDark, setColorDark] = useState('#000000');
  const [dataUrl, setDataUrl] = useState('');

  // Barcode specific
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    generate();
  }, [type, text, ssid, password, encryption, phone, message, size, colorDark, barcodeFormat]);

  const generate = () => {
    if (type === 'barcode') {
        generateBarcode();
        return;
    }

    let rawData = '';
    
    switch (type) {
        case 'url':
        case 'text':
            rawData = text;
            break;
        case 'wifi':
            rawData = `WIFI:S:${ssid};T:${encryption};P:${password};;`;
            break;
        case 'whatsapp':
            rawData = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
            break;
    }

    if (!rawData) return;

    QRCode.toDataURL(rawData, {
      width: size,
      margin: 2,
      color: {
        dark: colorDark,
        light: '#ffffff',
      },
    })
      .then((url) => {
        setDataUrl(url);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const generateBarcode = () => {
    const JsBarcode = (window as any).JsBarcode;
    if (barcodeRef.current && text && JsBarcode) {
        try {
            JsBarcode(barcodeRef.current, text, {
                format: barcodeFormat,
                lineColor: colorDark,
                width: 2,
                height: 100,
                displayValue: true
            });
            setDataUrl(''); // Clear QR data
        } catch (e) {
            console.error("Barcode error", e);
        }
    }
  };

  const download = () => {
    const link = document.createElement('a');
    if (type === 'barcode' && barcodeRef.current) {
        // Simple SVG download logic
        const svgData = new XMLSerializer().serializeToString(barcodeRef.current);
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        link.download = 'barcode.svg';
        link.href = url;
    } else if (dataUrl) {
        link.download = 'qrcode.png';
        link.href = dataUrl;
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ToolTemplate
      metadata={metadata}
      howItWorks="Select the type of code you want to generate. Enter the required details, customize colors and size, and download the result instantly."
    >
      <div className="p-6">
        {/* Type Selector */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center sm:justify-start">
            <TypeBtn active={type === 'text'} onClick={() => setType('text')} icon={Type} label="Text" />
            <TypeBtn active={type === 'url'} onClick={() => setType('url')} icon={LinkIcon} label="URL" />
            <TypeBtn active={type === 'wifi'} onClick={() => setType('wifi')} icon={Wifi} label="WiFi" />
            <TypeBtn active={type === 'whatsapp'} onClick={() => setType('whatsapp')} icon={MessageCircle} label="WhatsApp" />
            <TypeBtn active={type === 'barcode'} onClick={() => { setType('barcode'); setText('12345678'); }} icon={Box} label="Barcode" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                
                {/* Inputs based on Type */}
                {(type === 'text' || type === 'url' || type === 'barcode') && (
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            {type === 'url' ? 'Website URL' : type === 'barcode' ? 'Barcode Content' : 'Text Content'}
                        </label>
                        <input 
                            type="text" 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="block w-full p-3 border border-slate-300 rounded-lg focus:ring-brand-500 focus:border-brand-500"
                            placeholder={type === 'url' ? 'https://...' : 'Enter content'}
                        />
                    </div>
                )}

                {type === 'wifi' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Network Name (SSID)</label>
                            <input type="text" value={ssid} onChange={(e) => setSsid(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg" placeholder="MyWiFi" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg" placeholder="SecretPassword" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Encryption</label>
                            <select value={encryption} onChange={(e) => setEncryption(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg bg-white">
                                <option value="WPA">WPA/WPA2</option>
                                <option value="WEP">WEP</option>
                                <option value="nopass">None</option>
                            </select>
                        </div>
                    </div>
                )}

                {type === 'whatsapp' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg" placeholder="+1 234 567 8900" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                            <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg h-24" placeholder="Hello..." />
                        </div>
                    </div>
                )}

                {/* Common Options */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    {type === 'barcode' ? (
                        <div className="col-span-2">
                             <label className="block text-sm font-medium text-slate-700 mb-2">Format</label>
                             <select value={barcodeFormat} onChange={(e) => setBarcodeFormat(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg bg-white">
                                <option value="CODE128">Code 128</option>
                                <option value="CODE39">Code 39</option>
                                <option value="EAN13">EAN-13</option>
                                <option value="UPC">UPC</option>
                                <option value="ITF14">ITF-14</option>
                                <option value="MSI">MSI</option>
                                <option value="pharmacode">Pharmacode</option>
                             </select>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Size (px)</label>
                            <input 
                                type="number" value={size} onChange={(e) => setSize(Number(e.target.value))}
                                min="100" max="1000" step="10"
                                className="w-full p-2 border border-slate-300 rounded-lg"
                            />
                        </div>
                    )}
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
                        <input 
                            type="color" value={colorDark} onChange={(e) => setColorDark(e.target.value)}
                            className="w-full h-10 p-1 border border-slate-300 rounded-lg cursor-pointer"
                        />
                     </div>
                </div>
            </div>

            {/* Preview Section */}
            <div className="bg-slate-100 rounded-xl p-6 flex flex-col items-center justify-center border border-slate-200 min-h-[300px]">
                {type === 'barcode' ? (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-6 overflow-x-auto max-w-full">
                         <svg ref={barcodeRef}></svg>
                    </div>
                ) : dataUrl ? (
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6">
                        <img src={dataUrl} alt="Generated QR Code" className="max-w-full h-auto" />
                    </div>
                ) : (
                    <p className="text-slate-400 mb-6">Enter data to generate</p>
                )}
                
                <button 
                    onClick={download}
                    className="flex items-center gap-2 bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors shadow-sm"
                >
                    <Download className="h-4 w-4" /> Download {type === 'barcode' ? 'SVG' : 'PNG'}
                </button>
            </div>
        </div>
      </div>
    </ToolTemplate>
  );
};

const TypeBtn: React.FC<{ active: boolean; onClick: () => void; icon: any; label: string }> = ({ active, onClick, icon: Icon, label }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            active 
            ? 'bg-brand-600 text-white shadow-md transform scale-105' 
            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
        }`}
    >
        <Icon className="h-4 w-4" /> {label}
    </button>
);

export default QrCodeGenerator;