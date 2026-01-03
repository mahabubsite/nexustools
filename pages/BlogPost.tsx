import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { BlogPost as BlogPostType } from '../types';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
        if (!id) return;
        try {
            const docRef = doc(db, 'posts', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setPost({ id: docSnap.id, ...docSnap.data() } as BlogPostType);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    fetchPost();
  }, [id]);

  if (loading) return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
      </div>
  );

  if (!post) return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 text-center">
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300">Post not found</h2>
          <Link to="/blog" className="text-brand-600 mt-4 inline-block hover:underline">Back to Blog</Link>
      </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-20 pb-20 transition-colors">
        {/* Hero */}
        <div className="w-full h-64 md:h-96 bg-slate-100 dark:bg-slate-900 relative">
            {post.imageUrl && (
                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
                    <Link to="/blog" className="text-slate-300 hover:text-white flex items-center gap-2 mb-4 text-sm font-medium transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Blog
                    </Link>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">{post.category}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">{post.title}</h1>
                    <div className="flex items-center gap-6 text-slate-300 text-sm">
                        <span className="flex items-center gap-2"><User className="h-4 w-4" /> {post.author}</span>
                        <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {new Date(post.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {Math.ceil(post.content.split(' ').length / 200)} min read</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                {/* Basic HTML rendering for demo. Ideally use a markdown renderer or sanitize HTML */}
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
        </div>
    </div>
  );
};

export default BlogPost;