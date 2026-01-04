import React, { useState, useEffect } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import AdNative from '../../components/AdNative';
import { Play, RotateCcw, Monitor } from 'lucide-react';

const CodePlayground: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [html, setHtml] = useState('<h1>Hello World</h1>\n<p>Start typing to see magic happen!</p>');
  const [css, setCss] = useState('body {\n  font-family: sans-serif;\n  padding: 20px;\n}\nh1 {\n  color: #3b82f6;\n}');
  const [js, setJs] = useState('console.log("Hello from JS");');
  const [srcDoc, setSrcDoc] = useState('');
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js' | 'preview'>('html');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const runCode = () => {
    setSrcDoc(`
      <!DOCTYPE html>
      <html>
        <head><style>${css}</style></head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `);
    if (isMobile) setActiveTab('preview');
  };

  useEffect(() => { runCode(); }, []);

  const reset = () => {
    setHtml('');
    setCss('');
    setJs('');
    setSrcDoc('');
  };

  const Editor = ({ lang, value, onChange, placeholder }: any) => (
    <div className="flex flex-col h-full border border-slate-200 rounded-lg overflow-hidden bg-white">
      <div className="bg-slate-100 px-4 py-2 border-b">
        <span className="text-xs font-bold uppercase text-slate-500">{lang}</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 p-4 font-mono text-sm bg-slate-50 resize-none outline-none"
        placeholder={placeholder}
        spellCheck={false}
      />
    </div>
  );

  return (
    <ToolTemplate
      metadata={metadata}
      howItWorks="Write HTML, CSS & JavaScript and preview the output instantly in your browser."
    >
      <div className="p-4 sm:p-6 h-[550px] lg:h-[800px] flex flex-col">

        {/* 🔥 TOP AD (Toolbar Below) */}
        <AdNative />

        {/* Toolbar */}
        <div className="flex justify-between items-center my-4">
          <div className="flex gap-2 lg:hidden">
            {['html','css','js','preview'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-3 py-1 rounded ${
                  activeTab === tab ? 'bg-brand-100 text-brand-700' : 'bg-slate-100'
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex gap-2 ml-auto">
            <button onClick={reset} className="p-2 hover:bg-red-50 rounded">
              <RotateCcw className="h-5 w-5 text-slate-500" />
            </button>
            <button onClick={runCode} className="bg-brand-600 text-white px-5 py-2 rounded flex gap-2">
              <Play className="h-4 w-4" /> Run
            </button>
          </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 min-h-0">
          {isMobile ? (
            <>
              {activeTab === 'html' && <Editor lang="HTML" value={html} onChange={setHtml} />}
              {activeTab === 'css' && <Editor lang="CSS" value={css} onChange={setCss} />}
              {activeTab === 'js' && <Editor lang="JS" value={js} onChange={setJs} />}
              {activeTab === 'preview' && (
                <>
                  {/* 🔥 MOBILE PREVIEW AD */}
                  <AdNative />
                  <iframe srcDoc={srcDoc} className="w-full h-full border rounded-lg" />
                </>
              )}
            </>
          ) : (
            <div className="grid grid-rows-2 h-full gap-4">
              <div className="grid grid-cols-3 gap-4">
                <Editor lang="HTML" value={html} onChange={setHtml} />
                <Editor lang="CSS" value={css} onChange={setCss} />
                <Editor lang="JS" value={js} onChange={setJs} />
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-slate-50 border-b px-3 py-2 flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-slate-500" />
                  <span className="text-xs font-bold">Live Preview</span>
                </div>

                {/* 🔥 PREVIEW AD */}
                <AdNative />

                <iframe srcDoc={srcDoc} className="w-full h-full" sandbox="allow-scripts" />
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolTemplate>
  );
};

export default CodePlayground;
