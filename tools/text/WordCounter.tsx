import React, { useState, useEffect } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import AdNative from '../../components/AdNative';
import { FileText, AlignLeft, Hash, Clock, Copy, Trash2 } from 'lucide-react';

const WordCounter: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    charactersNoSpace: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0
  });

  useEffect(() => {
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const characters = text.length;
    const charactersNoSpace = text.replace(/\s/g, '').length;
    const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(Boolean).length;
    const paragraphs = text.trim() === '' ? 0 : text.split(/\n+/).filter(Boolean).length;
    const readingTime = Math.ceil(words / 200);

    setStats({ words, characters, charactersNoSpace, sentences, paragraphs, readingTime });
  }, [text]);

  return (
    <ToolTemplate
      metadata={metadata}
      howItWorks="Type or paste your text into the box. The tool automatically counts words, characters, sentences, and paragraphs in real-time. It also estimates reading time based on an average speed of 200 words per minute."
    >
      <div className="p-6 space-y-6">

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <FileText className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wide">Words</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">{stats.words}</p>
          </div>

          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
              <Hash className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wide">Characters</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">{stats.characters}</p>
            <p className="text-xs text-slate-500 mt-1">
              {stats.charactersNoSpace} w/o spaces
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <AlignLeft className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wide">Sentences</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">{stats.sentences}</p>
            <p className="text-xs text-slate-500 mt-1">
              {stats.paragraphs} paragraphs
            </p>
          </div>
        </div>

        {/* 🔥 AD – AFTER STATS */}
        <AdNative />

        {/* INPUT */}
        <div className="relative">
          <textarea
            className="w-full h-64 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm resize-y leading-relaxed"
            placeholder="Start typing or paste your document here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="absolute bottom-4 right-4 text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Reading time: ~{stats.readingTime} min
          </div>
        </div>

        {/* 🔥 AD – AFTER INPUT */}
        <AdNative />

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            onClick={() => navigator.clipboard.writeText(text)}
            className="flex items-center justify-center gap-2 flex-1 bg-white border border-slate-300 text-slate-700 px-4 py-2.5 rounded-lg hover:bg-slate-50 font-medium transition-colors"
          >
            <Copy className="h-4 w-4" /> Copy Text
          </button>
          <button
            onClick={() => setText('')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium transition-colors"
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>

        {/* 🔥 AD – AFTER ACTIONS */}
        <AdNative />

      </div>
    </ToolTemplate>
  );
};

export default WordCounter;
