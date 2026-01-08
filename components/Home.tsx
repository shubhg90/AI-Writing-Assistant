import React from 'react';
import { Platform, GeneratedPost } from '../types';
import { 
  PenTool, 
  Linkedin, 
  Twitter, 
  Instagram, 
  FileText, 
  Clock, 
  ArrowRight, 
  Sparkles,
  LayoutDashboard
} from 'lucide-react';

interface HomeProps {
  userName: string;
  posts: GeneratedPost[];
  onNavigateToEditor: (platform?: Platform) => void;
  onOpenPost: (post: GeneratedPost) => void;
}

export const Home: React.FC<HomeProps> = ({ 
  userName, 
  posts, 
  onNavigateToEditor,
  onOpenPost 
}) => {
  
  const quickActions = [
    {
      id: 'linkedin',
      platform: Platform.LINKEDIN,
      title: 'LinkedIn Post',
      description: 'Professional updates & thought leadership',
      icon: <Linkedin className="w-5 h-5" />,
      color: 'bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-300 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 dark:hover:border-blue-600'
    },
    {
      id: 'twitter',
      platform: Platform.TWITTER,
      title: 'X / Twitter Thread',
      description: 'Short, punchy updates or threads',
      icon: <Twitter className="w-5 h-5" />,
      color: 'bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-400 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:border-slate-500'
    },
    {
      id: 'instagram',
      platform: Platform.INSTAGRAM,
      title: 'Instagram Caption',
      description: 'Engaging captions with hashtags',
      icon: <Instagram className="w-5 h-5" />,
      color: 'bg-pink-50 text-pink-600 border-pink-100 hover:border-pink-300 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800 dark:hover:border-pink-600'
    },
    {
      id: 'blog',
      platform: Platform.BLOG,
      title: 'Blog Outline',
      description: 'Full article structures & intro',
      icon: <FileText className="w-5 h-5" />,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:border-indigo-300 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800 dark:hover:border-indigo-600'
    }
  ];

  const recentPosts = posts.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero Section */}
      <section className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">{userName}</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">
          Ready to create something amazing today? Select a template below or continue where you left off.
        </p>
      </section>

      {/* Quick Actions Grid */}
      <section>
        <div className="flex items-center gap-2 mb-4 text-slate-700 dark:text-slate-300 font-semibold">
          <Sparkles className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          <h2>Quick Start</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onNavigateToEditor(action.platform)}
              className={`
                group relative p-5 rounded-2xl border text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1
                ${action.color} bg-white dark:bg-slate-900
              `}
            >
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110
                ${action.color.split(' ').filter(c => c.startsWith('bg-') || c.startsWith('text-')).join(' ')}
              `}>
                {action.icon}
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white mb-1">{action.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pr-4">
                {action.description}
              </p>
              
              <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Stats & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
              <Clock className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              <h2>Recent Drafts</h2>
            </div>
            {posts.length > 0 && (
               <button 
                  onClick={() => onNavigateToEditor()} // Just opens editor sidebar effectively
                  className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
               >
                 View all
               </button>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            {recentPosts.length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mb-3">
                  <PenTool className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                </div>
                <p>No drafts yet. Start writing your first post!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentPosts.map((post) => (
                  <div 
                    key={post.id}
                    onClick={() => onOpenPost(post)}
                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group flex items-start gap-4"
                  >
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:shadow-sm transition-all">
                       {post.platform === Platform.LINKEDIN && <Linkedin className="w-5 h-5" />}
                       {post.platform === Platform.TWITTER && <Twitter className="w-5 h-5" />}
                       {post.platform === Platform.INSTAGRAM && <Instagram className="w-5 h-5" />}
                       {(post.platform !== Platform.LINKEDIN && post.platform !== Platform.TWITTER && post.platform !== Platform.INSTAGRAM) && <FileText className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 truncate mb-0.5">{post.originalIdea}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{post.content}</p>
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap pt-1">
                      {new Date(post.timestamp).toLocaleDateString()}
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity self-center" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats Card */}
        <div className="space-y-4">
           <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold mb-4">
              <LayoutDashboard className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              <h2>Overview</h2>
            </div>
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-900 dark:to-purple-900 rounded-2xl p-6 text-white shadow-lg">
               <h3 className="text-indigo-100 dark:text-indigo-200 font-medium mb-1">Total Posts Created</h3>
               <div className="text-4xl font-bold mb-4">{posts.length}</div>
               
               <div className="space-y-2">
                 <div className="flex items-center justify-between text-sm text-indigo-100 dark:text-indigo-200">
                    <span>LinkedIn</span>
                    <span className="font-bold">{posts.filter(p => p.platform === Platform.LINKEDIN).length}</span>
                 </div>
                 <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-white h-full" 
                      style={{ width: `${posts.length ? (posts.filter(p => p.platform === Platform.LINKEDIN).length / posts.length) * 100 : 0}%` }}
                    ></div>
                 </div>
                 
                 <div className="flex items-center justify-between text-sm text-indigo-100 dark:text-indigo-200 mt-2">
                    <span>Others</span>
                    <span className="font-bold">{posts.filter(p => p.platform !== Platform.LINKEDIN).length}</span>
                 </div>
                 <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-white h-full" 
                      style={{ width: `${posts.length ? (posts.filter(p => p.platform !== Platform.LINKEDIN).length / posts.length) * 100 : 0}%` }}
                    ></div>
                 </div>
               </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm transition-colors">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Pro Tip</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Try using the "Refine" button after generating a post to adjust tone or length instantly.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};