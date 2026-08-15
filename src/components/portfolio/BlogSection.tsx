'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calendar, X, Eye } from 'lucide-react';
import { playSound } from '@/utils/sound';
import type { BlogPost } from '@/types/database.types';

interface BlogSectionProps {
  profileId: string;
  themeColor: string;
  soundEnabled: boolean;
}

export default function BlogSection({ profileId, themeColor, soundEnabled }: BlogSectionProps) {
  const supabase = createClient();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  // Fetch published blog articles
  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('profile_id', profileId)
          .order('published_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [profileId, supabase]);

  const handlePostClick = (post: BlogPost) => {
    playSound('click', soundEnabled);
    setActivePost(post);
  };

  const handleClose = () => {
    playSound('click', soundEnabled);
    setActivePost(null);
  };

  // Simple pure JS/TS Markdown renderer to avoid installing dynamic package modules
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    
    return text.split('\n').map((line, idx) => {
      const lineStr = line.trim();
      
      if (lineStr.startsWith('# ')) {
        return <h1 key={idx} className="text-2xl font-extrabold text-white mt-6 mb-3 border-b border-zinc-900 pb-2">{lineStr.slice(2)}</h1>;
      }
      if (lineStr.startsWith('## ')) {
        return <h2 key={idx} className="text-xl font-bold text-white mt-5 mb-2.5">{lineStr.slice(3)}</h2>;
      }
      if (lineStr.startsWith('### ')) {
        return <h3 key={idx} className="text-lg font-bold text-white mt-4 mb-2">{lineStr.slice(4)}</h3>;
      }
      if (lineStr.startsWith('#### ')) {
        return <h4 key={idx} className="text-base font-bold text-white mt-3.5 mb-1.5">{lineStr.slice(5)}</h4>;
      }
      if (lineStr.startsWith('- ') || lineStr.startsWith('* ')) {
        return (
          <li key={idx} className="list-disc ml-5 text-zinc-350 text-xs md:text-sm leading-relaxed mb-1.5">
            {lineStr.slice(2)}
          </li>
        );
      }
      if (lineStr.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-4 border-purple-500 pl-4 py-1.5 my-3 bg-zinc-900/40 text-zinc-400 italic text-xs rounded-r-lg">
            {lineStr.slice(2)}
          </blockquote>
        );
      }
      
      // Return normal line or space spacer
      return lineStr === '' ? (
        <div key={idx} className="h-2.5" />
      ) : (
        <p key={idx} className="text-zinc-350 text-xs md:text-sm leading-relaxed mb-3.5">
          {lineStr}
        </p>
      );
    });
  };

  if (!loading && posts.length === 0) return null;

  return (
    <section id="blog" className="relative z-10 px-6 py-20">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center md:text-left"
        >
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-3 flex items-center justify-center md:justify-start gap-2.5">
            <BookOpen className="w-8 h-8 shrink-0" style={{ color: themeColor }} />
            Articles & Documentation
          </h2>
          <div
            className="w-16 h-1 rounded-full mx-auto md:mx-0"
            style={{ background: `linear-gradient(90deg, ${themeColor}, transparent)` }}
          />
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="loading-spinner !w-8 !h-8" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => handlePostClick(post)}
                className="glass-card-static p-6 border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-[10px] text-zinc-550 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(post.published_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850">
                      Article
                    </span>
                  </div>

                  <h3 className="text-base md:text-lg font-bold text-white leading-tight group-hover:text-purple-400 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-zinc-400 text-xs md:text-sm leading-relaxed line-clamp-3">
                    {post.summary || 'Click to open and read full article contents...'}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold mt-6" style={{ color: themeColor }}>
                  <Eye size={13} />
                  Read Documentation
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Full Article Reader Modal Overlay */}
      <AnimatePresence>
        {activePost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-[#000]/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-zinc-950 border border-zinc-850 w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden rounded-2xl shadow-2xl"
              style={{
                boxShadow: `0 20px 45px -12px ${themeColor}15`,
              }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4.5 border-b border-zinc-900 bg-zinc-900/30">
                <div className="min-w-0 pr-4">
                  <span className="text-[10px] text-zinc-550 font-mono flex items-center gap-1">
                    <Calendar size={11} />
                    Published: {new Date(activePost.published_at).toLocaleDateString()}
                  </span>
                  <h3 className="text-base md:text-lg font-bold text-white truncate mt-1">{activePost.title}</h3>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-lg text-zinc-550 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer"
                  title="Close Reader"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Modal Content Scrollable Area */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-zinc-950/80 font-sans">
                {activePost.summary && (
                  <p className="text-zinc-400 text-xs md:text-sm italic leading-relaxed border-b border-zinc-900 pb-5 mb-5 pl-3 border-l-2 border-zinc-700">
                    {activePost.summary}
                  </p>
                )}
                <div className="prose prose-invert max-w-none">
                  {renderMarkdown(activePost.content)}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
