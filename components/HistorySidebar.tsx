import React from 'react';
import { GeneratedPost } from '../types';
import { History, Trash2, ChevronRight, PenSquare, LayoutDashboard } from 'lucide-react';

interface HistorySidebarProps {
  posts: GeneratedPost[];
  onSelectPost: (post: GeneratedPost) => void;
  onDeletePost: (id: string) => void;
  onNavigateHome: () => void;
  selectedPostId?: string;
  isOpen: boolean;
  onClose: () => void;
  currentView: 'home' | 'editor';
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  posts, 
  onSelectPost, 
  onDeletePost, 
  onNavigateHome,
  selectedPostId,
  isOpen,
  onClose,
  currentView
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside 
        className={`
          fixed top-0 left-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 w-80 z-30 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:h-screen lg:flex-shrink-0 flex flex-col
        `}
      >
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-lg">
            <PenSquare className="w-6 h-6" />
            <span>AI Writing Assistant</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
        </div>
        
        {/* Navigation */}
        <div className="p-2 space-y-1 border-b border-slate-100 dark:border-slate-800">
             <button 
                onClick={() => {
                    onNavigateHome();
                    if (window.innerWidth < 1024) onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${currentView === 'home' 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }
                `}
             >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
             </button>
        </div>

        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30">
           <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <History className="w-3 h-3" />
              Recent History
           </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-white dark:bg-slate-900">
          {posts.length === 0 ? (
            <div className="text-center py-10 px-4 text-slate-400 dark:text-slate-500 text-sm">
              <p>No posts yet.</p>
              <p className="mt-1">Start writing to build your history!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div 
                key={post.id}
                className={`
                  group relative p-3 rounded-lg border text-left transition-all cursor-pointer
                  ${selectedPostId === post.id && currentView === 'editor'
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 shadow-sm' 
                    : 'bg-white dark:bg-slate-800/50 border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }
                `}
                onClick={() => {
                  onSelectPost(post);
                  if (window.innerWidth < 1024) onClose();
                }}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                    {post.platform}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    {new Date(post.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-1 mb-1">
                  {post.originalIdea}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {post.content}
                </p>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePost(post.id);
                  }}
                  className="absolute right-2 bottom-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500 text-center bg-white dark:bg-slate-900">
          Powered by Gemini 2.5 Flash
        </div>
      </aside>
    </>
  );
};