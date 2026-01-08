import React, { useState, useEffect, useCallback } from 'react';
import { Menu, Plus, LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { HistorySidebar } from './components/HistorySidebar';
import { PostGenerator } from './components/PostGenerator';
import { PostPreview } from './components/PostPreview';
import { Onboarding } from './components/Onboarding';
import { Home } from './components/Home';
import { generatePostContent, refinePostContent } from './services/geminiService';
import { GeneratedPost, GenerationConfig, Platform } from './types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'postflow_history_v1';
const USER_KEY = 'postflow_username_v1';
const THEME_KEY = 'postflow_theme_v1';

type ViewState = 'home' | 'editor';
type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  const [currentPost, setCurrentPost] = useState<GeneratedPost | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Default to dark theme
  const [theme, setTheme] = useState<Theme>('dark');
  
  // Navigation State
  const [view, setView] = useState<ViewState>('home');
  const [initialPlatform, setInitialPlatform] = useState<Platform | undefined>(undefined);

  // Load settings from local storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    const savedUser = localStorage.getItem(USER_KEY);
    const savedTheme = localStorage.getItem(THEME_KEY) as Theme;
    
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setPosts(parsed);
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    if (savedUser) {
      setUserName(savedUser);
    }

    if (savedTheme) {
      setTheme(savedTheme);
    }
    // Removed system preference check as we default to dark now
  }, []);

  // Save history whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  // Handle Theme Change
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleOnboardingComplete = (name: string) => {
    setUserName(name);
    localStorage.setItem(USER_KEY, name);
    setView('home');
  };

  const handleLogout = () => {
    setUserName('');
    localStorage.removeItem(USER_KEY);
    setPosts([]);
    setCurrentPost(null);
    localStorage.removeItem(STORAGE_KEY);
    setView('home');
  };

  const handleGenerate = async (config: GenerationConfig) => {
    setIsGenerating(true);
    setError(null);
    
    // Ensure we are in editor view (should already be)
    if (window.innerWidth < 1024) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }

    try {
      const content = await generatePostContent({
        idea: config.idea,
        platform: config.platform,
        tone: config.tone,
        length: config.length
      });

      const newPost: GeneratedPost = {
        id: uuidv4(),
        originalIdea: config.idea,
        content: content,
        platform: config.platform,
        tone: config.tone,
        timestamp: Date.now()
      };

      setPosts(prev => [newPost, ...prev]);
      setCurrentPost(newPost);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefine = async (instruction: string) => {
    if (!currentPost) return;
    
    setIsGenerating(true);
    setError(null);

    try {
        const refinedContent = await refinePostContent(currentPost.content, instruction);
        
        const updatedPost = {
            ...currentPost,
            content: refinedContent,
            timestamp: Date.now()
        };

        setPosts(prev => prev.map(p => p.id === currentPost.id ? updatedPost : p));
        setCurrentPost(updatedPost);

    } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to refine post");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleDeletePost = useCallback((id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    if (currentPost?.id === id) {
      setCurrentPost(null);
    }
  }, [currentPost]);

  const handleNewDraft = (platform?: Platform) => {
      setCurrentPost(null);
      setInitialPlatform(platform); // Pre-select platform if provided
      setView('editor');
  };

  const handleSelectPost = (post: GeneratedPost) => {
      setCurrentPost(post);
      setView('editor');
  };

  const navigateHome = () => {
      setView('home');
      setInitialPlatform(undefined);
  };

  // If no user name, show onboarding
  if (!userName) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-300">
      <HistorySidebar 
        posts={posts}
        onSelectPost={handleSelectPost}
        onDeletePost={handleDeletePost}
        onNavigateHome={navigateHome}
        selectedPostId={currentPost?.id}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentView={view}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full bg-slate-50/50 dark:bg-slate-950/50">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between shadow-sm lg:shadow-none z-10 shrink-0 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden lg:block cursor-pointer" onClick={navigateHome}>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Hello, <span className="text-indigo-600 dark:text-indigo-400">{userName}</span>
              </h1>
            </div>
            <div className="lg:hidden font-bold text-indigo-600 dark:text-indigo-400" onClick={navigateHome}>AI Writing Assistant</div>
          </div>

          <div className="flex items-center gap-2">
             <button
                onClick={toggleTheme}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                title="Toggle Theme"
             >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
             </button>

             <button 
                onClick={handleLogout} 
                className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Switch User"
             >
                <LogOut className="w-3 h-3" />
                <span className="hidden sm:inline">Sign out</span>
             </button>
             
             {view === 'home' && (
               <button 
                  onClick={() => handleNewDraft()}
                  className="flex items-center gap-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 px-4 py-2 rounded-lg transition-colors shadow-sm"
               >
                  <Plus className="w-4 h-4" /> 
                  <span className="hidden sm:inline">New Draft</span>
               </button>
             )}
             
             {view === 'editor' && (
               <button 
                  onClick={navigateHome}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors"
               >
                  <LayoutDashboard className="w-4 h-4" /> 
                  <span className="hidden sm:inline">Dashboard</span>
               </button>
             )}
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto">
          
          {view === 'home' ? (
             <Home 
               userName={userName}
               posts={posts}
               onNavigateToEditor={handleNewDraft}
               onOpenPost={handleSelectPost}
             />
          ) : (
            <div className="p-4 lg:p-8">
              <div className="max-w-7xl mx-auto h-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pb-20 lg:pb-0">
                
                {/* Left Column: Input (5 cols) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                   <div className="hidden lg:block mb-1">
                      <p className="text-slate-500 dark:text-slate-400">What would you like to write about today?</p>
                   </div>
                   
                   <PostGenerator 
                      onGenerate={handleGenerate} 
                      isGenerating={isGenerating} 
                      initialPlatform={initialPlatform}
                   />
                   
                   {error && (
                       <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-sm animate-in fade-in slide-in-from-top-2">
                           {error}
                       </div>
                   )}
                </div>

                {/* Right Column: Preview (7 cols) */}
                <div className="lg:col-span-7 h-full min-h-[500px] lg:min-h-[calc(100vh-16rem)]">
                   <PostPreview 
                      post={currentPost} 
                      onRefine={handleRefine}
                      isRefining={isGenerating}
                   />
                </div>

              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;