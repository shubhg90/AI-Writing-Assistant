import React, { useState } from 'react';
import { Button } from './Button';
import { Sparkles, ArrowRight, PenTool } from 'lucide-react';

interface OnboardingProps {
  onComplete: (name: string) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 dark:border-slate-800 p-8 z-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl mb-4 text-indigo-600 dark:text-indigo-400 shadow-sm transform rotate-3">
            <PenTool className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">AI Writing Assistant</h1>
          <p className="text-slate-500 dark:text-slate-400">Your intelligent creative writing partner.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              What should we call you?
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600"
              placeholder="Enter your name"
              autoFocus
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-lg shadow-indigo-200 dark:shadow-none hover:shadow-indigo-300 dark:hover:shadow-indigo-900/50 transition-all"
            disabled={!name.trim()}
            icon={<ArrowRight className="w-5 h-5" />}
          >
            Get Started
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-center gap-6 text-sm text-slate-400 dark:text-slate-500">
             <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400 dark:text-indigo-500" />
                Smart AI
             </span>
             <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
             <span>Instant Drafts</span>
             <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
             <span>Multi-platform</span>
          </div>
        </div>
      </div>
    </div>
  );
};