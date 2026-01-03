import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../data/categories';
import { getPopularTools, getToolBySlug, TOOLS } from '../data/tools';
import { Search, ArrowRight, Zap, Shield, Code2, Command, Map } from 'lucide-react';
import { ToolMetadata } from '../types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Home: React.FC = () => {
  const [popularTools, setPopularTools] = useState<ToolMetadata[]>([]);
  const [recentTools, setRecentTools] = useState<ToolMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let mergedTools = [...TOOLS];
        
        try {
            // Fetch Tool Configs
            const toolStatusSnap = await getDocs(collection(db, 'tools_status'));
            const toolOverrides = new Map<string, any>();
            toolStatusSnap.docs.forEach(doc => {
                toolOverrides.set(doc.id, doc.data());
            });
            
            mergedTools = TOOLS.map(tool => ({
                ...tool,
                ...(toolOverrides.get(tool.id) || { enabled: true })
            }));

            // Add dynamic tools if marked popular
            toolStatusSnap.docs.forEach(doc => {
                const data = doc.data();
                if (data.isNew) {
                    mergedTools.push({ id: doc.id, slug: doc.id, ...data } as ToolMetadata);
                }
            });
        } catch(permissionError) {
            // Ignore permission errors and use default tools
            // console.warn("Using default tools configuration.");
        }

        // Filter Enabled & Popular
        setPopularTools(mergedTools.filter(t => t.enabled !== false && t.popular));

        // Recent Tools Logic
        const saved = localStorage.getItem('recent_tools');
        if (saved) {
            const slugs: string[] = JSON.parse(saved);
            const tools = slugs.map(s => mergedTools.find(t => t.slug === s)).filter((t): t is ToolMetadata => !!t && t.enabled !== false);
            setRecentTools(tools);
        }
      } catch(e) {
        console.error("Failed to load tools", e);
        setPopularTools(getPopularTools()); // Fallback
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchTerm.trim()) {
          navigate(`/tools?q=${encodeURIComponent(searchTerm)}`);
      }
  };

  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="pt-24 pb-12 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl z-0 pointer-events-none opacity-50 dark:opacity-100">
            <div className="absolute top-20 left-20 w-72 h-72 bg-brand-400/20 dark:bg-brand-600/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-normal"></div>
            <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-normal"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 text-sm mb-8 backdrop-blur-sm">
             <Command className="h-3 w-3" /> 
             <span>Nexus Tools v2.0 is live</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">
            We build tools for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-500">builders & creators.</span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Nexus Tools is on a mission to simplify the web for developers. We provide free, privacy-first, and high-performance utilities to help you ship faster.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative mb-12">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-brand-500 dark:text-brand-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-14 pr-32 py-5 text-lg bg-white dark:bg-slate-900/80 border-2 border-slate-200 dark:border-slate-800 rounded-full leading-5 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 shadow-xl dark:shadow-none backdrop-blur-md transition-all"
              placeholder="Search for a tool..."
            />
            <div className="absolute inset-y-2 right-2">
                <button 
                    type="submit" 
                    className="h-full px-6 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-bold transition-colors shadow-md"
                >
                    Search
                </button>
            </div>
          </form>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800/50 pt-12">
            <div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">50+</div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Tools Available</div>
            </div>
            <div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">10k+</div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Monthly Users</div>
            </div>
             <div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">99.9%</div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Uptime</div>
            </div>
             <div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Yes</div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Open Source</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      {recentTools.length > 0 && (
          <section className="py-12 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 transition-colors">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Recent Activity</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {recentTools.map(tool => (
                        <Link 
                            key={tool.id}
                            to={`/tool/${tool.slug}`}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-brand-300 dark:hover:border-brand-500/50 shadow-sm transition-all flex items-center gap-3 group"
                        >
                            <div className="bg-brand-50 dark:bg-slate-800 p-2 rounded-lg group-hover:bg-brand-100 dark:group-hover:bg-brand-900/50 transition-colors">
                                <Command className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                            </div>
                            <div className="overflow-hidden">
                                <h3 className="font-semibold text-slate-900 dark:text-slate-200 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400">{tool.name}</h3>
                                <p className="text-xs text-slate-500 truncate">Last used recently</p>
                            </div>
                        </Link>
                    ))}
                </div>
             </div>
          </section>
      )}

      {/* Popular Tools */}
      <section className="py-20 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Popular Tools</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">The most used utilities by our community.</p>
            </div>
            <Link to="/tools" className="text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-1 hover:text-brand-700 dark:hover:text-brand-300">View All <ArrowRight className="h-4 w-4" /></Link>
          </div>

          {loading ? (
             <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularTools.map((tool) => (
                <Link 
                    key={tool.id} 
                    to={`/tool/${tool.slug}`}
                    className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-500/30 hover:shadow-lg dark:hover:shadow-brand-900/10 transition-all group"
                >
                    <div className="flex items-start justify-between mb-4">
                    <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg group-hover:bg-brand-50 dark:group-hover:bg-brand-900/30 transition-colors">
                        <Zap className="h-5 w-5 text-slate-500 dark:text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400" />
                    </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{tool.name}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2">{tool.description}</p>
                </Link>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Feature Cards (Moved) */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                        <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Privacy First</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        We believe in data privacy. Most of our tools run entirely client-side, meaning your data never leaves your browser.
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-6">
                        <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Lightning Fast</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        No bloat, no lag. Our tools are optimized for performance, utilizing WebAssembly and modern browser APIs.
                    </p>
                </div>
                 <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
                        <Code2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Developer Centric</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Built by developers, for developers. We include features like JSON validation, regex testing, and API playgrounds.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Roadmap Movement (Updated) */}
      <section className="py-20 bg-white dark:bg-slate-950 transition-colors border-t border-slate-100 dark:border-slate-900">
         <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-900 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 rounded-3xl p-8 md:p-12 border border-slate-800 dark:border-slate-700/50 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                 
                 <div className="relative z-10 flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold mb-4 border border-brand-500/30">
                        <Map className="h-3 w-3" /> ROADMAP
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Community Driven Development</h2>
                    <p className="text-slate-300 mb-8 leading-relaxed">
                        Nexus Tools is built in the open. Vote on upcoming features, suggest new tools, and see what we are shipping next.
                    </p>
                    <Link to="/roadmap" className="inline-flex items-center gap-2 bg-white text-slate-950 font-bold py-3 px-6 rounded-xl hover:bg-slate-200 transition-colors">
                        View Full Roadmap <ArrowRight className="h-4 w-4" />
                    </Link>
                 </div>

                 {/* Roadmap Preview Card */}
                 <div className="relative z-10 w-full md:w-auto md:min-w-[320px]">
                    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 space-y-4 shadow-xl">
                        <h4 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-2">Coming Soon</h4>
                        <div className="flex items-center gap-3 p-3 bg-slate-800/80 rounded-lg border border-slate-700/50">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                            <span className="text-slate-200 text-sm font-medium">PDF Tools Suite</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-800/80 rounded-lg border border-slate-700/50">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            <span className="text-slate-200 text-sm font-medium">SEO Analyzer</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-800/80 rounded-lg border border-slate-700/50">
                            <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                            <span className="text-slate-200 text-sm font-medium">Diff Checker</span>
                        </div>
                    </div>
                 </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;