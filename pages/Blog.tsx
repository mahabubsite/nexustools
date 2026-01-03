import React, { useEffect, useState } from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { BlogPost } from '../types';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
        try {
            const q = query(collection(db, 'posts'), orderBy('date', 'desc'));
            const snap = await getDocs(q);
            const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
            setPosts(data);
        } catch (e: any) {
            // Suppress permission errors if the user doesn't have access
            if (e?.code !== 'permission-denied' && !e?.message?.includes('Missing or insufficient permissions')) {
                console.error("Failed to fetch posts", e);
            }
        } finally {
            setLoading(false);
        }
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-16 pb-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">The Nexus Blog</h1>
            <p className="text-slate-600 dark:text-slate-400">Insights, updates, and engineering deep dives.</p>
        </div>

        {loading ? (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
            </div>
        ) : posts.length === 0 ? (
            <div className="text-center text-slate-500 dark:text-slate-400 py-20">
                No blog posts found.
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.map(post => (
                    <div key={post.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-brand-300 dark:hover:border-brand-500/50 shadow-sm hover:shadow-md transition-all group flex flex-col">
                        <div className="h-48 w-full relative bg-slate-100 dark:bg-slate-800 overflow-hidden">
                             {post.imageUrl ? (
                                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                             ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                             )}
                             <div className="absolute top-4 left-4 bg-white/90 dark:bg-brand-900/80 text-brand-700 dark:text-brand-300 text-xs font-bold px-2 py-1 rounded backdrop-blur-sm border border-brand-100 dark:border-transparent">
                                {post.category}
                             </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(post.date).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author}</span>
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">{post.title}</h2>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                            <Link to={`/blog/${post.id}`} className="text-brand-600 dark:text-brand-400 text-sm font-medium hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1">
                                Read Article <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Blog;