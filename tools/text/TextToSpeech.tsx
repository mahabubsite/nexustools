import React, { useState, useEffect } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import AdNative from '../../components/AdNative';
import { Play, Pause, Square } from 'lucide-react';

const TextToSpeech: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = () => {
    if (!text) return;

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsSpeaking(true);
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const pause = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsSpeaking(false);
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <ToolTemplate
      metadata={metadata}
      howItWorks="Type your text, select a voice and speed, then click Play to hear it spoken aloud."
    >
      <div className="p-6 space-y-6">

        {/* TEXT INPUT */}
        <textarea
          className="w-full h-40 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
          placeholder="Type something to speak..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* 🔥 AD – AFTER TEXTAREA */}
        <AdNative />

        {/* SETTINGS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Voice
            </label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white"
            >
              {voices.map(voice => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1 text-slate-500">
                <span>Speed</span>
                <span>{rate}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 text-slate-500">
                <span>Pitch</span>
                <span>{pitch}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* 🔥 AD – AFTER CONTROLS */}
        <AdNative />

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 border-t border-slate-100 pt-6">
          <button
            onClick={speak}
            className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700"
          >
            <Play className="h-5 w-5" />
            {isSpeaking ? 'Resume' : 'Play'}
          </button>

          <button
            onClick={pause}
            className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50"
          >
            <Pause className="h-5 w-5" /> Pause
          </button>

          <button
            onClick={stop}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-red-100 ml-auto"
          >
            <Square className="h-5 w-5" /> Stop
          </button>
        </div>

        {/* 🔥 AD – PAGE BOTTOM */}
        <AdNative />

      </div>
    </ToolTemplate>
  );
};

export default TextToSpeech;
