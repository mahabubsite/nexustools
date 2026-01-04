import React, { useState, useEffect, useRef } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { Download, Wifi, MessageCircle, Link as LinkIcon, Type, Box } from 'lucide-react';
import QRCode from 'qrcode';
import AdNative from '../../components/AdNative';

type QRType = 'text' | 'url' | 'wifi' | 'whatsapp' | 'barcode';

const QrCodeGenerator: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [type, setType] = useState<QRType>('text');

  const [text, setText] = useState('https://example.com');

  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState('WPA');

  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const [barcodeFormat, setBarcodeFormat] = useState('CODE128');

  const [size, setSize] = useState(256);
  const [colorDark, setColorDark] = useState('#000000');
  const [dataUrl, setDataUrl] = useState('');

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
      case 'text':
      case 'url':
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
      color: { dark: colorDark, light: '#ffffff' }
    }).then(setDataUrl);
  };

  const generateBarcode = () => {
    const JsBarcode = (window as any).JsBarcode;
    if (barcodeRef.current && text && JsBarcode) {
      JsBarcode(barcodeRef.current, text, {
        format: barcodeFormat,
        lineColor: colorDark,
        width: 2,
        height: 100,
        displayValue: true
      });
      setDataUrl('');
    }
  };

  const download = () => {
    const link = document.createElement('a');
    if (type === 'barcode' && barcodeRef.current) {
      const svg = new XMLSerializer().serializeToString(barcodeRef.current);
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      link.href = URL.createObjectURL(blob);
      link.download = 'barcode.svg';
    } else {
      link.href = dataUrl;
      link.download = 'qrcode.png';
    }
    link.click();
  };

  return (
    <ToolTemplate metadata={metadata}>
      <div className="p-6 space-y-10">

        {/* 🔥 TOP AD */}
        <AdNative />

        {/* TYPE SELECTOR */}
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          <TypeBtn active={type === 'text'} onClick={() => setType('text')} icon={Type} label="Text" />
          <TypeBtn active={type === 'url'} onClick={() => setType('url')} icon={LinkIcon} label="URL" />
          <TypeBtn active={type === 'wifi'} onClick={() => setType('wifi')} icon={Wifi} label="WiFi" />
          <TypeBtn active={type === 'whatsapp'} onClick={() => setType('whatsapp')} icon={MessageCircle} label="WhatsApp" />
          <TypeBtn active={type === 'barcode'} onClick={() => setType('barcode')} icon={Box} label="Barcode" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* INPUTS */}
          <div className="space-y-6">
            {(type === 'text' || type === 'url' || type === 'barcode') && (
              <input
                className="w-full p-3 border rounded-lg"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Enter content"
              />
            )}

            {type === 'wifi' && (
              <>
                <input className="w-full p-3 border rounded-lg" placeholder="SSID" value={ssid} onChange={e => setSsid(e.target.value)} />
                <input className="w-full p-3 border rounded-lg" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <select className="w-full p-3 border rounded-lg" value={encryption} onChange={e => setEncryption(e.target.value)}>
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None</option>
                </select>
              </>
            )}

            {type === 'whatsapp' && (
              <>
                <input className="w-full p-3 border rounded-lg" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
                <textarea className="w-full p-3 border rounded-lg" placeholder="Message" value={message} onChange={e => setMessage(e.target.value)} />
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              {type !== 'barcode' && (
                <input type="number" className="p-2 border rounded-lg" value={size} onChange={e => setSize(+e.target.value)} />
              )}
              <input type="color" value={colorDark} onChange={e => setColorDark(e.target.value)} />
            </div>
          </div>

          {/* PREVIEW */}
          <div className="bg-slate-100 rounded-xl p-6 flex flex-col items-center justify-center">

            {/* 🔥 MIDDLE AD */}
            <AdNative />

            {type === 'barcode' ? (
              <svg ref={barcodeRef} />
            ) : (
              dataUrl && <img src={dataUrl} alt="QR" />
            )}

            <button onClick={download} className="mt-6 bg-brand-600 text-white px-6 py-2 rounded-lg flex items-center gap-2">
              <Download className="h-4 w-4" /> Download
            </button>
          </div>
        </div>

        {/* 🔥 BOTTOM AD */}
        <AdNative />

      </div>
    </ToolTemplate>
  );
};

const TypeBtn = ({ active, onClick, icon: Icon, label }: any) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm ${
      active ? 'bg-brand-600 text-white' : 'bg-white border'
    }`}
  >
    <Icon className="h-4 w-4" /> {label}
  </button>
);

export default QrCodeGenerator;
