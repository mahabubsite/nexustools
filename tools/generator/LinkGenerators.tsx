import React, { useState, useEffect } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import AdNative from '../../components/AdNative';
import { Copy, ExternalLink } from 'lucide-react';

interface Props {
  metadata: ToolMetadata;
  subTool: 'mailto' | 'whatsapp';
}

const LinkGenerators: React.FC<Props> = ({ metadata, subTool }) => {
  const [email, setEmail] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const [phone, setPhone] = useState('');
  const [waMessage, setWaMessage] = useState('');

  const [result, setResult] = useState('');

  useEffect(() => {
    if (subTool === 'mailto') {
      let link = `mailto:${email}`;
      const params = [];
      if (cc) params.push(`cc=${encodeURIComponent(cc)}`);
      if (bcc) params.push(`bcc=${encodeURIComponent(bcc)}`);
      if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
      if (body) params.push(`body=${encodeURIComponent(body)}`);
      if (params.length > 0) link += `?${params.join('&')}`;
      setResult(link);
    } else {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      let link = `https://wa.me/${cleanPhone}`;
      if (waMessage) link += `?text=${encodeURIComponent(waMessage)}`;
      setResult(link);
    }
  }, [email, cc, bcc, subject, body, phone, waMessage, subTool]);

  return (
    <ToolTemplate metadata={metadata}>
      <div className="p-6 space-y-8">

        {/* INPUTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {subTool === 'mailto' ? (
              <>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Recipient Email" className="w-full p-3 border border-slate-300 rounded-lg" />
                <input value={cc} onChange={e => setCc(e.target.value)} placeholder="CC (Optional)" className="w-full p-3 border border-slate-300 rounded-lg" />
                <input value={bcc} onChange={e => setBcc(e.target.value)} placeholder="BCC (Optional)" className="w-full p-3 border border-slate-300 rounded-lg" />
                <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" className="w-full p-3 border border-slate-300 rounded-lg" />
                <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Email Body" className="w-full p-3 border border-slate-300 rounded-lg h-32" />
              </>
            ) : (
              <>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone with country code" className="w-full p-3 border border-slate-300 rounded-lg" />
                <textarea value={waMessage} onChange={e => setWaMessage(e.target.value)} placeholder="Message (Optional)" className="w-full p-3 border border-slate-300 rounded-lg h-32" />
              </>
            )}

            {/* 🔥 AD – AFTER INPUT */}
            <AdNative />
          </div>

          {/* RESULT */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-6">
            <h3 className="font-bold text-slate-900">Generated Link</h3>

            {/* 🔥 AD – BEFORE RESULT */}
            <AdNative />

            <div className="bg-white p-4 rounded-lg border border-slate-300 break-all font-mono text-sm text-slate-600 min-h-[100px]">
              {result || 'Your generated link will appear here'}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="flex-1 bg-white border border-slate-300 py-2 rounded-lg font-medium hover:bg-slate-50 flex items-center justify-center gap-2"
              >
                <Copy className="h-4 w-4" /> Copy
              </button>

              <a
                href={result}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-brand-600 text-white py-2 rounded-lg font-medium hover:bg-brand-700 flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-4 w-4" /> Open
              </a>
            </div>

            {/* 🔥 AD – AFTER ACTIONS */}
            <AdNative />
          </div>
        </div>
      </div>
    </ToolTemplate>
  );
};

export default LinkGenerators;
