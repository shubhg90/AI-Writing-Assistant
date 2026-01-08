import React, { useState } from 'react';
import { GeneratedPost } from '../types';
import { Button } from './Button';
import { Copy, Check, Share2, MessageSquare, RefreshCw, PenTool } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface PostPreviewProps {
  post: GeneratedPost | null;
  onRefine: (instruction: string) => void;
  isRefining: boolean;
}

export const PostPreview: React.FC<PostPreviewProps> = ({ post, onRefine, isRefining }) => {
  const [copied, setCopied] = useState(false);
  const [refineInput, setRefineInput] = useState('');
  const [showRefine, setShowRefine] = useState(false);

  const handleCopy = () => {
    if (post) {
      navigator.clipboard.writeText(post.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (refineInput.trim()) {
      onRefine(refineInput);
      setRefineInput('');
      setShowRefine(false);
    }
  };

  if (!post) {
    return (
      <div className="h-full bg-white/50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-8 text-center backdrop-blur-sm transition-colors duration-300">
        <div className="bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-800 p-6 rounded-full mb-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <PenTool className="w-10 h-10 text-indigo-200 dark:text-indigo-900" />
        </div>
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">Ready to Create?</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
          Select your settings on the left and describe what you want to write. We'll handle the rest.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col h-full overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center sticky top-0 z-10 transition-colors">
        <div className="flex items-center gap-3">
           <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
           <div>
             <h3 className="font-bold text-slate-800 dark:text-white text-lg leading-tight">{post.platform}</h3>
             <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">{post.tone} Tone</span>
           </div>
        </div>
        <div className="flex gap-2">
            <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => setShowRefine(!showRefine)}
                icon={<RefreshCw className="w-3.5 h-3.5" />}
                className="border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
                Refine
            </Button>
            <Button 
                variant={copied ? "primary" : "secondary"} 
                size="sm" 
                onClick={handleCopy}
                icon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                className={!copied ? "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400" : ""}
            >
                {copied ? 'Copied' : 'Copy'}
            </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white dark:bg-slate-900 transition-colors">
        <div className="prose prose-slate dark:prose-invert prose-lg max-w-none text-slate-600 dark:text-slate-300 leading-relaxed">
           <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </div>

      {/* Footer / Refine Input */}
      {showRefine && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 animate-in slide-in-from-bottom-5 fade-in duration-300">
             <form onSubmit={handleRefineSubmit} className="flex gap-2">
                 <input 
                    type="text" 
                    value={refineInput}
                    onChange={(e) => setRefineInput(e.target.value)}
                    placeholder="Describe how to change it (e.g. 'Make it funnier')"
                    className="flex-1 text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-sm"
                    autoFocus
                 />
                 <Button type="submit" size="md" isLoading={isRefining}>
                    Update
                 </Button>
             </form>
          </div>
      )}
      
      {!showRefine && (
        <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500 flex justify-between items-center transition-colors">
            <span className="font-medium">{post.content.length} characters</span>
            <span className="flex items-center gap-1.5 font-medium text-indigo-400/80"><Share2 className="w-3.5 h-3.5" /> Ready to post</span>
        </div>
      )}
    </div>
  );
};