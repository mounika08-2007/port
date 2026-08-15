'use client';

import { useState, useEffect } from 'react';
import { 
  Save, Sparkles, Layout, Type, Plus, Trash2, 
  Briefcase, MessageSquare, ChevronRight, Play, Eye,
  Terminal, Volume2, BookOpen, Edit3
} from 'lucide-react';
import GithubIcon from '@/components/portfolio/icons/GithubIcon';
import { createClient } from '@/lib/supabase';

import { motion, AnimatePresence } from 'framer-motion';
import type { Profile, Experience, Testimonial, BlogPost } from '@/types/database.types';


const ULTRA_MODERN_FONTS = [
  'Plus Jakarta Sans',
  'Space Grotesk',
  'Inter',
  'Outfit',
  'Syncopate'
];

interface VibeControlsContainerProps {
  profile: Partial<Profile>;
  saving: boolean;
  onSave: (updatedProfile: Partial<Profile>) => Promise<void>;
}

export default function VibeControlsContainer({ profile: initialProfile, saving, onSave }: VibeControlsContainerProps) {
  const [profile, setProfile] = useState<Partial<Profile>>({
    animation_style: 'fade',
    animation_speed: 'normal',
    background_effect: 'mesh-gradient',
    layout_variant: 'classic',
    custom_font: 'Plus Jakarta Sans',
    experiences: [],
    testimonials: [],
    theme_color: '#6366f1',
    github_username: '',
    show_terminal_toggle: true,
    sound_effects_enabled: false,
    custom_terminal_welcome: 'Type "help" to view available commands...',
    ...initialProfile
  });


  const [activeTab, setActiveTab] = useState<'studio' | 'sections' | 'blog'>('studio');
  const [previewKey, setPreviewKey] = useState(0);

  // Blog Publisher state & logic
  const supabase = createClient();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [blogEditId, setBlogEditId] = useState<string | null>(null); // null = list, '-1' = add new, 'uuid' = edit
  const [tempBlog, setTempBlog] = useState<Partial<BlogPost>>({
    title: '',
    summary: '',
    content: ''
  });

  const loadPosts = async () => {
    if (!profile.id) return;
    setPostsLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('profile_id', profile.id)
      .order('published_at', { ascending: false });
    if (data) setPosts(data);
    setPostsLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'blog' && profile.id) {
      loadPosts();
    }
  }, [activeTab, profile.id]);

  const startAddBlog = () => {
    setTempBlog({ title: '', summary: '', content: '' });
    setBlogEditId('-1');
  };

  const startEditBlog = (post: BlogPost) => {
    setTempBlog({ ...post });
    setBlogEditId(post.id);
  };

  const saveBlog = async () => {
    if (!tempBlog.title?.trim() || !tempBlog.content?.trim()) {
      alert('Title and Content are required.');
      return;
    }
    if (!profile.id) return;

    try {
      if (blogEditId === '-1') {
        const { error } = await supabase
          .from('posts')
          .insert([
            {
              profile_id: profile.id,
              title: tempBlog.title.trim(),
              summary: tempBlog.summary?.trim() || '',
              content: tempBlog.content.trim()
            }
          ]);
        if (error) throw error;
      } else if (blogEditId) {
        const { error } = await supabase
          .from('posts')
          .update({
            title: tempBlog.title.trim(),
            summary: tempBlog.summary?.trim() || '',
            content: tempBlog.content.trim()
          })
          .eq('id', blogEditId);
        if (error) throw error;
      }
      setBlogEditId(null);
      loadPosts();
    } catch (err: any) {
      alert(`Error saving article: ${err.message}`);
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
      loadPosts();
      if (blogEditId === id) setBlogEditId(null);
    } catch (err: any) {
      alert(`Error deleting article: ${err.message}`);
    }
  };


  // Subsections editing states
  const [expEditIndex, setExpEditIndex] = useState<number | null>(null);
  const [tempExp, setTempExp] = useState<Experience>({
    role: '',
    company: '',
    duration: '',
    bullet_points: []
  });
  const [newBullet, setNewBullet] = useState('');

  const [testiEditIndex, setTestiEditIndex] = useState<number | null>(null);
  const [tempTesti, setTempTesti] = useState<Testimonial>({
    reviewer_name: '',
    designation: '',
    review_text: '',
    avatar_url: ''
  });

  const triggerPreviewReplay = () => {
    setPreviewKey(prev => prev + 1);
  };

  const handleSaveClick = () => {
    onSave(profile);
  };

  /* ============================================================
     EXPERIENCE TIMELINE BUILDER (JSONB CRUD)
     ============================================================ */
  const startAddExp = () => {
    setTempExp({ role: '', company: '', duration: '', bullet_points: [] });
    setExpEditIndex(-1);
    setNewBullet('');
  };

  const startEditExp = (index: number) => {
    setTempExp({ ...(profile.experiences?.[index] as Experience) });
    setExpEditIndex(index);
    setNewBullet('');
  };

  const saveExp = () => {
    if (!tempExp.role.trim() || !tempExp.company.trim() || !tempExp.duration.trim()) {
      alert('Please fill in Role, Company and Duration.');
      return;
    }

    const currentExps = [...(profile.experiences || [])];
    if (expEditIndex === -1) {
      currentExps.push(tempExp);
    } else if (expEditIndex !== null) {
      currentExps[expEditIndex] = tempExp;
    }

    setProfile(prev => ({ ...prev, experiences: currentExps }));
    setExpEditIndex(null);
  };

  const deleteExp = (index: number) => {
    if (!confirm('Remove this career history item?')) return;
    const currentExps = [...(profile.experiences || [])];
    currentExps.splice(index, 1);
    setProfile(prev => ({ ...prev, experiences: currentExps }));
    if (expEditIndex === index) setExpEditIndex(null);
  };

  const moveExp = (index: number, direction: 'up' | 'down') => {
    const currentExps = [...(profile.experiences || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentExps.length) return;

    const temp = currentExps[index];
    currentExps[index] = currentExps[targetIndex];
    currentExps[targetIndex] = temp;

    setProfile(prev => ({ ...prev, experiences: currentExps }));
  };

  const addBullet = () => {
    if (!newBullet.trim()) return;
    setTempExp(prev => ({
      ...prev,
      bullet_points: [...prev.bullet_points, newBullet.trim()]
    }));
    setNewBullet('');
  };

  const removeBullet = (bulletIdx: number) => {
    const updated = [...tempExp.bullet_points];
    updated.splice(bulletIdx, 1);
    setTempExp(prev => ({ ...prev, bullet_points: updated }));
  };

  /* ============================================================
     TESTIMONIALS MANAGER (JSONB CRUD)
     ============================================================ */
  const startAddTesti = () => {
    setTempTesti({ reviewer_name: '', designation: '', review_text: '', avatar_url: '' });
    setTestiEditIndex(-1);
  };

  const startEditTesti = (index: number) => {
    setTempTesti({ ...(profile.testimonials?.[index] as Testimonial) });
    setTestiEditIndex(index);
  };

  const saveTesti = () => {
    if (!tempTesti.reviewer_name.trim() || !tempTesti.review_text.trim()) {
      alert('Reviewer Name and Review Text are required.');
      return;
    }

    const currentTestis = [...(profile.testimonials || [])];
    if (testiEditIndex === -1) {
      currentTestis.push(tempTesti);
    } else if (testiEditIndex !== null) {
      currentTestis[testiEditIndex] = tempTesti;
    }

    setProfile(prev => ({ ...prev, testimonials: currentTestis }));
    setTestiEditIndex(null);
  };

  const deleteTesti = (index: number) => {
    if (!confirm('Remove this endorsement?')) return;
    const currentTestis = [...(profile.testimonials || [])];
    currentTestis.splice(index, 1);
    setProfile(prev => ({ ...prev, testimonials: currentTestis }));
    if (testiEditIndex === index) setTestiEditIndex(null);
  };

  const previewDuration = profile.animation_speed === 'slow' ? 1.2 : profile.animation_speed === 'fast' ? 0.3 : 0.6;
  const themeColor = profile.theme_color || '#6366f1';

  return (
    <div className="space-y-6">
      {/* Visual Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-purple-400 w-5 h-5 animate-pulse" />
            Vibe & Experience Studio
          </h2>
          <p className="text-xs text-slate-500">
            Customize entrance animations, layout grids, canvases, and manage timeline milestones.
          </p>
        </div>
        <button 
          onClick={handleSaveClick} 
          disabled={saving} 
          className="btn-primary"
        >
          {saving ? (
            <div className="loading-spinner !w-5 !h-5" />
          ) : (
            <>
              <Save size={16} />
              Commit Configuration
            </>
          )}
        </button>
      </div>

      {/* Modern Studio Tabs */}
      <div className="flex border-b border-zinc-800 space-x-2 p-1 rounded-xl bg-zinc-900/50 max-w-md">
        <button
          onClick={() => setActiveTab('studio')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-semibold transition-all duration-200 ${
            activeTab === 'studio'
              ? 'bg-purple-600 text-white border border-purple-500/20 shadow-lg'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          🎨 Animation & Theme Studio
        </button>
        <button
          onClick={() => setActiveTab('sections')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-semibold transition-all duration-200 ${
            activeTab === 'sections'
              ? 'bg-purple-600 text-white border border-purple-500/20 shadow-lg'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          📦 Timeline & Reviews Builder
        </button>
        <button
          onClick={() => setActiveTab('blog')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-semibold transition-all duration-200 ${
            activeTab === 'blog'
              ? 'bg-purple-600 text-white border border-purple-500/20 shadow-lg'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          📝 Blog Publisher
        </button>
      </div>


      {/* ============================================================
         TAB 1: ANIMATION & THEME STUDIO
         ============================================================ */}
      {activeTab === 'studio' && (
        <div className="grid gap-6 md:grid-cols-3 items-start">
          
          <div className="md:col-span-2 space-y-6">
            
            {/* Animation Style Selector Grid */}
            <div className="glass-card-static p-6 space-y-4">
              <div>
                <h3 className="text-white font-semibold text-sm flex items-center gap-1.5">
                  <Play size={15} className="text-purple-400" />
                  Animation Style
                </h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Controls how elements materialize on scroll.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'fade', label: 'Fade In', desc: 'Progressive opacity entrance.' },
                  { id: 'slide-up', label: 'Slide Up', desc: 'Vertical rising slide entrance.' },
                  { id: 'glitch', label: 'Digital Glitch', desc: 'Cyber text clipping shadows.' },
                  { id: 'liquid-reveal', label: 'Liquid Reveal', desc: 'Circular gooey spring reveal.' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setProfile(p => ({ ...p, animation_style: opt.id as any }));
                      setTimeout(triggerPreviewReplay, 50);
                    }}
                    className={`p-3 text-left border rounded-xl capitalize transition-all duration-200 ${
                      profile.animation_style === opt.id
                        ? 'border-purple-500 bg-purple-500/10 text-white'
                        : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="text-xs font-semibold text-white">{opt.label}</div>
                    <div className="text-[10px] text-zinc-500 mt-1 leading-relaxed">{opt.desc}</div>
                  </button>
                ))}
              </div>

              {/* Animation Speed Selector */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-zinc-400">
                    Animation Speed Primitive
                  </label>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-900 text-purple-400">
                    {profile.animation_speed === 'slow' ? 'Slow (1.2s)' : profile.animation_speed === 'fast' ? 'Fast (0.3s)' : 'Normal (0.6s)'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {['slow', 'normal', 'fast'].map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => {
                        setProfile(prev => ({ ...prev, animation_speed: spd as any }));
                        setTimeout(triggerPreviewReplay, 50);
                      }}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        profile.animation_speed === spd
                          ? 'border-purple-500 bg-purple-500/10 text-white'
                          : 'border-zinc-800 bg-transparent text-zinc-400 hover:bg-zinc-900/50 hover:text-white'
                      }`}
                    >
                      {spd.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Ambient Background Selector Grid */}
            <div className="glass-card-static p-6 space-y-4">
              <div>
                <h3 className="text-white font-semibold text-sm flex items-center gap-1.5">
                  <Layout size={15} className="text-purple-400" />
                  Ambient Background Effect
                </h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Real-time ambient rendering selector.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: 'mesh-gradient', label: 'Mesh Blob', icon: '🎨' },
                  { id: 'particles', label: 'Particles', icon: '✨' },
                  { id: 'matrix', label: 'Matrix Rain', icon: '👾' },
                  { id: 'none', label: 'Solid Dark', icon: '🌑' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setProfile(p => ({ ...p, background_effect: opt.id as any }))}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                      profile.background_effect === opt.id
                        ? 'border-purple-500 bg-purple-500/10 text-white'
                        : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-lg">{opt.icon}</span>
                    <span className="text-xs font-semibold">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Layout Variants & Typography Selectors */}
            <div className="glass-card-static p-6 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-white mb-2 flex items-center gap-1">
                    <Layout size={13} className="text-purple-400" />
                    Layout Structure Variant
                  </label>
                  <select
                    value={profile.layout_variant || 'classic'}
                    onChange={(e) => setProfile(p => ({ ...p, layout_variant: e.target.value as any }))}
                    className="glass-input bg-zinc-950 border border-zinc-850"
                  >
                    <option value="classic">Classic Vertical Flow</option>
                    <option value="minimalist">Clean Minimalist Column</option>
                    <option value="cyberpunk-grid">Cyberpunk Bento Grid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white mb-2 flex items-center gap-1">
                    <Type size={13} className="text-purple-400" />
                    Google Custom Font Pairing
                  </label>
                  <select
                    value={profile.custom_font || 'Plus Jakarta Sans'}
                    onChange={(e) => setProfile(p => ({ ...p, custom_font: e.target.value }))}
                    className="glass-input bg-zinc-950 border border-zinc-850"
                  >
                    {ULTRA_MODERN_FONTS.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>


            {/* Interactive Features & Integrations */}
            <div className="glass-card-static p-6 space-y-5">
              <div>
                <h3 className="text-white font-semibold text-sm flex items-center gap-1.5 border-b border-zinc-800 pb-2">
                  <Terminal size={15} className="text-purple-400" />
                  Interactive Features & Integrations
                </h3>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {/* GitHub Username */}
                <div>
                  <label className="block text-xs font-semibold text-white mb-2 flex items-center gap-1">
                    <GithubIcon size={13} className="text-purple-400" />
                    GitHub Username (Stats API)
                  </label>
                  <input
                    type="text"
                    value={profile.github_username || ''}
                    onChange={(e) => setProfile(p => ({ ...p, github_username: e.target.value }))}
                    className="glass-input bg-zinc-950 border border-zinc-850"
                    placeholder="e.g. torvalds"
                  />
                  <span className="text-[10px] text-zinc-500 mt-1 block">
                    Displays dynamic statistics (repositories, followers) on your portfolio.
                  </span>
                </div>

                {/* Sound Effects */}
                <div>
                  <label className="block text-xs font-semibold text-white mb-2 flex items-center gap-1">
                    <Volume2 size={13} className="text-purple-400" />
                    Audio Feedback (Sound Effects)
                  </label>
                  <div className="flex items-center gap-3 mt-1.5">
                    <button
                      type="button"
                      onClick={() => setProfile(p => ({ ...p, sound_effects_enabled: !p.sound_effects_enabled }))}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        profile.sound_effects_enabled ? 'bg-purple-600' : 'bg-zinc-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          profile.sound_effects_enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span className="text-xs text-zinc-400">
                      {profile.sound_effects_enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-2 block">
                    Synthesizes retro audio feedback for keystrokes and button clicks.
                  </span>
                </div>

                {/* Terminal Toggle */}
                <div className="md:col-span-2 border-t border-zinc-900 pt-4 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-white mb-2 flex items-center gap-1">
                      <Terminal size={13} className="text-purple-400" />
                      CLI Terminal mode
                    </label>
                    <div className="flex items-center gap-3 mt-1.5">
                      <button
                        type="button"
                        onClick={() => setProfile(p => ({ ...p, show_terminal_toggle: !p.show_terminal_toggle }))}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          profile.show_terminal_toggle ? 'bg-purple-600' : 'bg-zinc-800'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            profile.show_terminal_toggle ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <span className="text-xs text-zinc-400">
                        {profile.show_terminal_toggle ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500 mt-2 block">
                      Enables a retro command-line terminal FAB on your portfolio.
                    </span>
                  </div>

                  {profile.show_terminal_toggle && (
                    <div>
                      <label className="block text-xs font-semibold text-white mb-2">
                        Terminal Welcome Message
                      </label>
                      <input
                        type="text"
                        value={profile.custom_terminal_welcome || ''}
                        onChange={(e) => setProfile(p => ({ ...p, custom_terminal_welcome: e.target.value }))}
                        className="glass-input bg-zinc-950 border border-zinc-850"
                        placeholder="Type 'help' to view commands..."
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>


          {/* Real-time Visual Sandbox Preview Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">Live Sandbox Preview</span>
              <button 
                onClick={triggerPreviewReplay}
                className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all text-xs flex items-center gap-1"
              >
                <Play size={10} /> Replay Vibe
              </button>
            </div>

            <div className="glass-card-static p-6 relative overflow-hidden flex flex-col justify-between aspect-square" style={{ backgroundColor: '#050508', borderColor: `${themeColor}20` }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{
                    opacity: 0,
                    ...(profile.animation_style === 'slide-up' ? { y: 35 } : {}),
                    ...(profile.animation_style === 'liquid-reveal' ? { clipPath: 'circle(0% at 50% 50%)' } : {}),
                  }}
                  animate={{
                    opacity: 1,
                    ...(profile.animation_style === 'slide-up' ? { y: 0 } : {}),
                    ...(profile.animation_style === 'liquid-reveal' ? { clipPath: 'circle(100% at 50% 50%)' } : {}),
                  }}
                  transition={
                    profile.animation_style === 'liquid-reveal'
                      ? { type: 'spring', stiffness: 40, damping: 13, duration: previewDuration * 1.5 }
                      : { duration: previewDuration, ease: 'easeOut' }
                  }
                  className="h-full flex flex-col justify-between"
                  style={{ fontFamily: `'${profile.custom_font}', sans-serif` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }} />
                      <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Sys_Check</span>
                    </div>
                    <span className="text-[8px] font-mono text-[#22c55e] animate-pulse">● ONLINE</span>
                  </div>

                  <div className="my-auto space-y-2">
                    {profile.animation_style === 'glitch' ? (
                      <h4 className="text-xl font-extrabold text-white tracking-tight relative inline-block dynamic-glitch-text uppercase" data-text="STUDIO VIEW">
                        <span className="gradient-text relative z-10">STUDIO VIEW</span>
                      </h4>
                    ) : (
                      <h4 className="text-xl font-extrabold text-white tracking-tight uppercase">STUDIO VIEW</h4>
                    )}
                    <p className="text-zinc-400 text-[10px] leading-relaxed max-w-[190px]">
                      Chosen typography, colors, and layout animations are synchronized instantly.
                    </p>
                  </div>

                  <div className="border-t border-zinc-900 pt-2 flex items-center justify-between text-[7px] text-zinc-650 font-mono">
                    <span>ANIM: {profile.animation_style?.toUpperCase()}</span>
                    <span>FONT: {profile.custom_font?.toUpperCase()}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================
         TAB 2: TIMELINE & REVIEWS BUILDER
         ============================================================ */}
      {activeTab === 'sections' && (
        <div className="grid gap-6 md:grid-cols-2 items-start">
          
          {/* Career Timelines Manager */}
          <div className="glass-card-static p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-white font-semibold text-sm flex items-center gap-1.5">
                  <Briefcase size={15} className="text-purple-400" />
                  Experience Timeline Builder
                </h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Manipulates profile timeline entries arrays dynamically.</p>
              </div>
              {expEditIndex === null && (
                <button
                  type="button"
                  onClick={startAddExp}
                  className="btn-ghost !py-1 px-2.5 text-xs text-purple-400 hover:text-white flex items-center gap-1 border-zinc-800 hover:bg-zinc-900"
                >
                  <Plus size={13} /> Add Milestone
                </button>
              )}
            </div>

            {/* Exp Milestone Editor Form */}
            {expEditIndex !== null ? (
              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/20 space-y-4">
                <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                  {expEditIndex === -1 ? 'Add Career Milestone' : `Edit Career Milestone #${expEditIndex + 1}`}
                </h4>

                <div className="grid gap-3 grid-cols-2">
                  <div className="col-span-2">
                    <label className="text-[9px] text-zinc-450 uppercase font-bold">Role/Title *</label>
                    <input
                      type="text"
                      value={tempExp.role}
                      onChange={(e) => setTempExp(prev => ({ ...prev, role: e.target.value }))}
                      className="glass-input mt-1 !py-1.5 text-xs bg-zinc-950 border border-zinc-850"
                      placeholder="e.g. Principal Lead Architect"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-zinc-450 uppercase font-bold">Company *</label>
                    <input
                      type="text"
                      value={tempExp.company}
                      onChange={(e) => setTempExp(prev => ({ ...prev, company: e.target.value }))}
                      className="glass-input mt-1 !py-1.5 text-xs bg-zinc-950 border border-zinc-850"
                      placeholder="e.g. Google Cloud"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-zinc-450 uppercase font-bold">Duration *</label>
                    <input
                      type="text"
                      value={tempExp.duration}
                      onChange={(e) => setTempExp(prev => ({ ...prev, duration: e.target.value }))}
                      className="glass-input mt-1 !py-1.5 text-xs bg-zinc-950 border border-zinc-850"
                      placeholder="e.g. 2024 - PRESENT"
                    />
                  </div>
                </div>

                {/* Achievement Bullet Points Sub-forms */}
                <div className="space-y-2">
                  <label className="text-[9px] text-zinc-450 uppercase font-bold">Bullet Accomplishments</label>
                  
                  <ul className="space-y-1">
                    {tempExp.bullet_points.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex gap-2 items-center bg-zinc-950 border border-zinc-850 px-2.5 py-1.5 rounded-lg text-xs">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: themeColor }} />
                        <span className="flex-1 text-zinc-300 leading-normal">{bullet}</span>
                        <button
                          type="button"
                          onClick={() => removeBullet(bIdx)}
                          className="text-red-400 hover:text-red-300 ml-2"
                        >
                          <Trash2 size={12} />
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newBullet}
                      onChange={(e) => setNewBullet(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBullet())}
                      className="glass-input !py-1.5 text-xs flex-1 bg-zinc-950 border border-zinc-850"
                      placeholder="Add metrics-driven milestone detail..."
                    />
                    <button
                      type="button"
                      onClick={addBullet}
                      className="btn-ghost !p-2 shrink-0 border-zinc-850 hover:bg-zinc-900"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-zinc-850">
                  <button
                    type="button"
                    onClick={() => setExpEditIndex(null)}
                    className="btn-ghost !py-1 px-3 text-xs border-zinc-850 hover:bg-zinc-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveExp}
                    className="btn-primary !py-1 px-3 text-xs"
                  >
                    Save Milestone
                  </button>
                </div>
              </div>
            ) : null}

            {/* Careers timeline list with up/down arrows */}
            <div className="space-y-3">
              {(profile.experiences || []).map((exp, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 border border-zinc-850 rounded-xl bg-zinc-950 hover:border-zinc-700 transition-all">
                  <div className="flex-1 pr-4 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{exp.role}</h4>
                    <p className="text-[11px] text-zinc-550 truncate mt-0.5">{exp.company} | {exp.duration}</p>
                  </div>
                  
                  <div className="flex items-center gap-1 shrink-0">
                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => moveExp(idx, 'up')}
                        disabled={idx === 0}
                        className="text-[9px] font-bold text-zinc-500 hover:text-white p-0.5 disabled:opacity-30 disabled:hover:text-zinc-500"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => moveExp(idx, 'down')}
                        disabled={idx === (profile.experiences || []).length - 1}
                        className="text-[9px] font-bold text-zinc-500 hover:text-white p-0.5 disabled:opacity-30 disabled:hover:text-zinc-500"
                        title="Move Down"
                      >
                        ▼
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => startEditExp(idx)}
                      className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-white"
                    >
                      <ChevronRight size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteExp(idx)}
                      className="p-1.5 rounded hover:bg-red-500/10 text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}

              {(!profile.experiences || profile.experiences.length === 0) && expEditIndex === null && (
                <div className="p-8 border border-dashed border-zinc-800 rounded-xl text-center text-zinc-500 text-xs">
                  No careers history timelines added. Click &quot;Add Milestone&quot; to begin.
                </div>
              )}
            </div>

          </div>

          {/* Testimonial Recommendations Builder */}
          <div className="glass-card-static p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-white font-semibold text-sm flex items-center gap-1.5">
                  <MessageSquare size={15} className="text-purple-400" />
                  Testimonials Builder
                </h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Verified review grids cards builder.</p>
              </div>
              {testiEditIndex === null && (
                <button
                  type="button"
                  onClick={startAddTesti}
                  className="btn-ghost !py-1 px-2.5 text-xs text-purple-400 hover:text-white flex items-center gap-1 border-zinc-850 hover:bg-zinc-900"
                >
                  <Plus size={13} /> Add Review
                </button>
              )}
            </div>

            {/* Testimonials Edit Form */}
            {testiEditIndex !== null ? (
              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/20 space-y-4">
                <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                  {testiEditIndex === -1 ? 'Add New Testimonial' : `Edit Testimonial #${testiEditIndex + 1}`}
                </h4>

                <div className="grid gap-3 grid-cols-2">
                  <div>
                    <label className="text-[9px] text-zinc-450 uppercase font-bold">Reviewer Name *</label>
                    <input
                      type="text"
                      value={tempTesti.reviewer_name}
                      onChange={(e) => setTempTesti(prev => ({ ...prev, reviewer_name: e.target.value }))}
                      className="glass-input mt-1 !py-1.5 text-xs bg-zinc-950 border border-zinc-850"
                      placeholder="e.g. Mounika Reddy"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-zinc-450 uppercase font-bold">Designation *</label>
                    <input
                      type="text"
                      value={tempTesti.designation}
                      onChange={(e) => setTempTesti(prev => ({ ...prev, designation: e.target.value }))}
                      className="glass-input mt-1 !py-1.5 text-xs bg-zinc-950 border border-zinc-850"
                      placeholder="e.g. Director of Engineering"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[9px] text-zinc-450 uppercase font-bold">Avatar Image URL</label>
                    <input
                      type="url"
                      value={tempTesti.avatar_url || ''}
                      onChange={(e) => setTempTesti(prev => ({ ...prev, avatar_url: e.target.value }))}
                      className="glass-input mt-1 !py-1.5 text-xs bg-zinc-950 border border-zinc-850"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[9px] text-zinc-450 uppercase font-bold">Review Text *</label>
                    <textarea
                      value={tempTesti.review_text}
                      onChange={(e) => setTempTesti(prev => ({ ...prev, review_text: e.target.value }))}
                      className="glass-textarea mt-1 !py-1.5 text-xs bg-zinc-950 border border-zinc-850"
                      placeholder="Type peer recommendation detail here..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Sub Verified Review Card Live Preview */}
                {tempTesti.reviewer_name && (
                  <div className="border border-zinc-850 p-3 rounded-lg bg-zinc-950 space-y-2">
                    <span className="text-[8px] font-mono text-zinc-550 uppercase tracking-widest flex items-center gap-1">
                      <Eye size={10} /> Live Review Card Check
                    </span>
                    <p className="text-[10px] text-zinc-450 italic leading-relaxed">&ldquo;{tempTesti.review_text || '...'}&rdquo;</p>
                    <div className="flex items-center gap-2.5 pt-2 border-t border-zinc-850">
                      {tempTesti.avatar_url ? (
                        <img src={tempTesti.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0" style={{ background: `linear-gradient(135deg, ${themeColor}, #8b5cf6)` }}>
                          {tempTesti.reviewer_name.split(' ').slice(0,2).map(n=>n[0]).join('').toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h5 className="text-white font-semibold text-[10px] leading-none">{tempTesti.reviewer_name}</h5>
                        <span className="text-[8px] text-zinc-550 leading-none mt-1 inline-block">{tempTesti.designation}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-zinc-850">
                  <button
                    type="button"
                    onClick={() => setTestiEditIndex(null)}
                    className="btn-ghost !py-1 px-3 text-xs border-zinc-850 hover:bg-zinc-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveTesti}
                    className="btn-primary !py-1 px-3 text-xs"
                  >
                    Save Review
                  </button>
                </div>
              </div>
            ) : null}

            {/* Recommendations List Grid */}
            <div className="space-y-3">
              {(profile.testimonials || []).map((t, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 border border-zinc-850 rounded-xl bg-zinc-950 hover:border-zinc-700 transition-all">
                  <div className="flex items-center gap-3 flex-1 pr-4 min-w-0">
                    {t.avatar_url ? (
                      <img src={t.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[9px] text-white shrink-0" style={{ background: `linear-gradient(135deg, ${themeColor}, #8b5cf6)` }}>
                        {t.reviewer_name.split(' ').slice(0,2).map(n=>n[0]).join('').toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate leading-tight">{t.reviewer_name}</h4>
                      <p className="text-[10px] text-zinc-550 truncate mt-0.5">{t.designation}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEditTesti(idx)}
                      className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-white"
                    >
                      <ChevronRight size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteTesti(idx)}
                      className="p-1.5 rounded hover:bg-red-500/10 text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}

              {(!profile.testimonials || profile.testimonials.length === 0) && testiEditIndex === null && (
                <div className="p-8 border border-dashed border-zinc-800 rounded-xl text-center text-zinc-500 text-xs">
                  No recommendations left. Click &quot;Add Review&quot; to write one.
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ============================================================
         TAB 3: BLOG PUBLISHER
         ============================================================ */}
      {activeTab === 'blog' && (
        <div className="space-y-6">
          <div className="glass-card-static p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-white font-semibold text-sm flex items-center gap-1.5">
                  <BookOpen size={15} className="text-purple-400" />
                  Article Publisher Studio
                </h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Publish and manage blog posts directly linked to your profile.</p>
              </div>
              {blogEditId === null && (
                <button
                  type="button"
                  onClick={startAddBlog}
                  className="btn-ghost !py-1 px-2.5 text-xs text-purple-400 hover:text-white flex items-center gap-1 border-zinc-850 hover:bg-zinc-900"
                >
                  <Plus size={13} /> Add Article
                </button>
              )}
            </div>

            {/* Article editor form */}
            {blogEditId !== null ? (
              <div className="border border-zinc-850 rounded-xl p-4 bg-zinc-900/20 space-y-4">
                <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                  {blogEditId === '-1' ? 'Create New Article' : 'Edit Article Settings'}
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase font-bold">Article Title *</label>
                    <input
                      type="text"
                      value={tempBlog.title || ''}
                      onChange={(e) => setTempBlog(prev => ({ ...prev, title: e.target.value }))}
                      className="glass-input mt-1 !py-1.5 text-xs bg-zinc-950 border border-zinc-850"
                      placeholder="e.g. Master React and Next.js Server Components"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase font-bold">Short Summary / Subtitle</label>
                    <input
                      type="text"
                      value={tempBlog.summary || ''}
                      onChange={(e) => setTempBlog(prev => ({ ...prev, summary: e.target.value }))}
                      className="glass-input mt-1 !py-1.5 text-xs bg-zinc-950 border border-zinc-850"
                      placeholder="e.g. An in-depth guide on streaming and dynamic layouts."
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase font-bold">Body Content (Markdown Supported) *</label>
                    <textarea
                      value={tempBlog.content || ''}
                      onChange={(e) => setTempBlog(prev => ({ ...prev, content: e.target.value }))}
                      className="glass-textarea mt-1 !py-2 text-xs bg-zinc-950 border border-zinc-850 font-mono"
                      placeholder="Write your article markdown content here..."
                      rows={12}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-zinc-850">
                  <button
                    type="button"
                    onClick={() => setBlogEditId(null)}
                    className="btn-ghost !py-1 px-3 text-xs border-zinc-850 hover:bg-zinc-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveBlog}
                    className="btn-primary !py-1 px-4 text-xs"
                  >
                    Publish Post
                  </button>
                </div>
              </div>
            ) : null}

            {/* List of articles */}
            {blogEditId === null && (
              <div className="space-y-3">
                {postsLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="loading-spinner !w-6 !h-6" />
                  </div>
                ) : posts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 border border-zinc-850 rounded-xl bg-zinc-950 hover:border-zinc-800 transition-all font-sans">
                    <div className="min-w-0 pr-4">
                      <h4 className="text-sm font-semibold text-white truncate">{post.title}</h4>
                      <p className="text-[10px] text-zinc-550 truncate mt-0.5">
                        {post.summary || 'No summary compiled.'}
                      </p>
                      <span className="text-[8px] text-zinc-650 font-mono uppercase tracking-wider mt-1.5 inline-block">
                        Published: {new Date(post.published_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEditBlog(post)}
                        className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-white"
                        title="Edit Article"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteBlog(post.id)}
                        className="p-1.5 rounded hover:bg-red-500/10 text-red-400 hover:text-red-300"
                        title="Delete Article"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                {!postsLoading && posts.length === 0 && (
                  <div className="p-12 border border-dashed border-zinc-850 rounded-xl text-center text-zinc-650 text-xs">
                    No articles published yet. Click &quot;Add Article&quot; to compile your first post.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

