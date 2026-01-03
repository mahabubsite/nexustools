import React, { useState, useEffect } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { Play, RotateCcw, Monitor, Code, FileType } from 'lucide-react';

const CodePlayground: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [html, setHtml] = useState('<h1>Hello World</h1>\n<p>Start typing to see magic happen!</p>');
  const [css, setCss] = useState('body {\n  font-family: sans-serif;\n  padding: 20px;\n}\nh1 {\n  color: #3b82f6;\n}');
  const [js, setJs] = useState('console.log("Hello from JS");');
  const [srcDoc, setSrcDoc] = useState('');
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js' | 'preview'>('html');

  // Desktop vs Mobile check (simple approximation)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const runCode = () => {
    const doc = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>
            try {
              ${js}
            } catch (err) {
              console.error(err);
            }
          </script>
        </body>
      </html>
    `;
    setSrcDoc(doc);
    if (isMobile) setActiveTab('preview');
  };

  // Auto-run on mount
  useEffect(() => {
    runCode();
  }, []);

  const reset = () => {
    setHtml('');
    setCss('');
    setJs('');
    setSrcDoc('');
  };

  const Editor = ({ 
    lang, 
    value, 
    onChange, 
    placeholder 
  }: { lang: string, value: string, onChange: (v: string) => void, placeholder: string }) => (
    <div className="flex flex-col h-full border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{lang}</span>
        </div>
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 w-full p-4 font-mono text-sm bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none resize-none"
            placeholder={placeholder}
            spellCheck={false}
        />
    </div>
  );

  return (
    <ToolTemplate 
      metadata={metadata}
      howItWorks="Enter your HTML, CSS, and JavaScript in the respective editors. Click 'Run' to compile and render the result in the preview pane. You can use this to test snippets individually or combine them for a full component preview."
    >
      <div className="p-4 sm:p-6 h-[550px] lg:h-[800px] flex flex-col">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-0">
            <div className="flex gap-2 lg:hidden w-full overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                <TabButton active={activeTab === 'html'} onClick={() => setActiveTab('html')} label="HTML" />
                <TabButton active={activeTab === 'css'} onClick={() => setActiveTab('css')} label="CSS" />
                <TabButton active={activeTab === 'js'} onClick={() => setActiveTab('js')} label="JS" />
                <TabButton active={activeTab === 'preview'} onClick={() => setActiveTab('preview')} label="Preview" icon={Monitor} />
            </div>
            <div className="flex gap-2 ml-auto w-full sm:w-auto justify-end">
                <button 
                    onClick={reset}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Reset Code"
                >
                    <RotateCcw className="h-5 w-5" />
                </button>
                <button 
                    onClick={runCode}
                    className="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                    <Play className="h-4 w-4" /> Run
                </button>
            </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 min-h-0">
            {isMobile ? (
                <div className="h-full">
                    {activeTab === 'html' && <Editor lang="HTML" value={html} onChange={setHtml} placeholder="<div>Hello</div>" />}
                    {activeTab === 'css' && <Editor lang="CSS" value={css} onChange={setCss} placeholder="body { color: red; }" />}
                    {activeTab === 'js' && <Editor lang="JS" value={js} onChange={setJs} placeholder="console.log('Hi');" />}
                    {activeTab === 'preview' && (
                        <div className="h-full border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white">
                            <iframe 
                                srcDoc={srcDoc}
                                title="Preview"
                                className="w-full h-full"
                                sandbox="allow-scripts"
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-rows-2 h-full gap-4">
                    {/* Top: Editors */}
                    <div className="grid grid-cols-3 gap-4 h-full min-h-0">
                        <Editor lang="HTML" value={html} onChange={setHtml} placeholder="<!-- HTML here -->" />
                        <Editor lang="CSS" value={css} onChange={setCss} placeholder="/* CSS here */" />
                        <Editor lang="JS" value={js} onChange={setJs} placeholder="// JS here" />
                    </div>
                    {/* Bottom: Preview */}
                    <div className="h-full border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col">
                        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-2">
                            <Monitor className="h-4 w-4 text-slate-500" />
                            <span className="text-xs font-bold text-slate-500 uppercase">Live Preview</span>
                        </div>
                        <iframe 
                            srcDoc={srcDoc}
                            title="Preview"
                            className="w-full h-full"
                            sandbox="allow-scripts"
                        />
                    </div>
                </div>
            )}
        </div>
      </div>
    </ToolTemplate>
  );
};

const TabButton = ({ active, onClick, label, icon: Icon }: any) => (
    <button 
        onClick={onClick}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 whitespace-nowrap ${
            active 
            ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' 
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
    >
        {Icon && <Icon className="h-3 w-3" />}
        {label}
    </button>
);

export default CodePlayground;