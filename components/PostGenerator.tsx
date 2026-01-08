import React, { useState, useEffect } from 'react';
import { Platform, Tone, Length, GenerationConfig } from '../types';
import { Button } from './Button';
import { Sparkles, Command } from 'lucide-react';

interface PostGeneratorProps {
  onGenerate: (config: GenerationConfig) => void;
  isGenerating: boolean;
  initialPlatform?: Platform;
}

export const PostGenerator: React.FC<PostGeneratorProps> = ({ 
  onGenerate, 
  isGenerating,
  initialPlatform
}) => {
  const [idea, setIdea] = useState('');
  const [platform, setPlatform] = useState<Platform>(initialPlatform || Platform.LINKEDIN);
  const [tone, setTone] = useState<Tone>(Tone.PROFESSIONAL);
  const [length, setLength] = useState<Length>(Length.MEDIUM);

  // Update platform if prop changes (e.g. navigating from Home)
  useEffect(() => {
    if (initialPlatform) {
      setPlatform(initialPlatform);
    }
  }, [initialPlatform]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
    onGenerate({ idea, platform, tone, length });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
      {/* Subtle top decoration */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 w-full"></div>
      
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-2.5 mb-6 text-slate-800 dark:text-white">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
             <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-lg">Magic Editor</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="idea" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Topic or rough idea
            </label>
            <textarea
              id="idea"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. Announcing our new product feature that saves 50% time..."
              className="w-full h-36 p-4 text-sm text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block p-3 transition-colors outline-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-600"
              >
                {Object.values(Platform).map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block p-3 transition-colors outline-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-600"
              >
                {Object.values(Tone).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Length</label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value as Length)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block p-3 transition-colors outline-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-600"
              >
                {Object.values(Length).map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              isLoading={isGenerating} 
              className="w-full py-3 text-base shadow-indigo-100 dark:shadow-none hover:shadow-indigo-200 dark:hover:shadow-none transition-all" 
              size="lg"
              disabled={!idea.trim()}
              icon={<Sparkles className="w-5 h-5" />}
            >
              {isGenerating ? 'Writing Magic...' : 'Generate Content'}
            </Button>
            <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-4 flex items-center justify-center gap-1.5 uppercase tracking-wide">
              <Command className="w-3 h-3" /> 
              Powered by Gemini 2.5
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};