import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { TOOLS } from '../data/tools';
import { CATEGORIES } from '../data/categories';
import { Search } from 'lucide-react';
import { ToolCategory, ToolMetadata } from '../types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const AllTools: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('q') || '';
  
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [tools, setTools] = useState<ToolMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        let mergedTools = [...TOOLS];
        
        try {
            const toolStatusSnap = await getDocs(collection(db, 'tools_status'));
            const toolOverrides = new Map<string, any>();
            toolStatusSnap.docs.forEach(doc => {
                toolOverrides.set(doc.id, doc.data());
            });
            
            mergedTools = TOOLS.map(tool => ({
                ...tool,
                ...(toolOverrides.get(tool.id) || { enabled: true })
            }));

            // Add dynamic tools
            toolStatusSnap.docs.forEach(doc => {
                const data = doc.data();
                if (data.isNew) {
                    mergedTools.push({ id: doc.id, slug: doc.id, ...data } as ToolMetadata);
                }
            });
        } catch(permissionError) {
            // Ignore permission errors and use default tools
        }

        // Filter out disabled tools for public view
        setTools(mergedTools.filter(t => t.enabled !== false));
      } catch (e) {
        console.error("Error fetching tools", e);
        setTools(TOOLS); // Fallback
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, []);

  const filteredTools = tools.filter(tool => {
    const matchesSearch = (tool.name || '').toLowerCase().includes(search.toLowerCase()) || 
                          (tool.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl mb-4">All Developer Tools</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">Browse our complete collection of utilities.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters (Desktop) */}
          <div className="hidden md:block w-64 flex-shrink-0 space-y-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 sticky top-24">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 px-2">Categories</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${selectedCategory === 'all' ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  All Tools
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${selectedCategory === cat.id ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Filters (Horizontal Scroll) */}
          <div className="md:hidden">
             <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${selectedCategory === 'all' ? 'bg-brand-600 text-white border-brand-600' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}
                >
                  All Tools
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${selectedCategory === cat.id ? 'bg-brand-600 text-white border-brand-600' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}
                  >
                    {cat.label}
                  </button>
                ))}
             </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-6 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-lg leading-5 bg-white dark:bg-slate-900 placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors shadow-sm"
                placeholder="Filter tools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.length > 0 ? filteredTools.map((tool) => (
                    <Link 
                    key={tool.id} 
                    to={`/tool/${tool.slug}`}
                    className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-500/50 hover:shadow-md transition-all group"
                    >
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{tool.name}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2">{tool.description}</p>
                    </Link>
                )) : (
                    <div className="col-span-full text-center py-12 bg-slate-100 dark:bg-slate-900 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
                    <p className="text-slate-500 dark:text-slate-400">No tools found matching your search.</p>
                    </div>
                )}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTools;