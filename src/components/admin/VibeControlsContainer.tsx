'use client';

import { useState } from 'react';
import { 
  Save, Sparkles, Layout, Type, Plus, Trash2, 
  Briefcase, MessageSquare, ChevronRight, Play, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Profile, Experience, Testimonial } from '@/types/database.types';

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
    ...initialProfile
  });

  const [activeTab, setActiveTab] = useState<'theme' | 'sections'>('theme');
  const [previewKey, setPreviewKey] = useState(0);

  // Subsections states
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

  // Move items inexperiences array to rearrange order in JSON payload
  const moveExp = (index: number, direction: 'up' | 'down') => {
    const currentExps = [...(profile.experiences || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentExps.length) return;

    // Swap elements
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
      {/* Visual Controls Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-indigo-400 w-5 h-5 animate-pulse" />
            Visual Orchestrator Dashboard
          </h2>
          <p className="text-xs text-slate-500">
            Design animations, background canvases, asymmetry layout grids, and manage timelines.
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

      {/* Tabs Menu switcher */}
      <div className="flex border-b border-white/5 space-x-1.5 p-1 rounded-xl bg-white/5 max-w-sm">
        <button
          onClick={() => setActiveTab('theme')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'theme'
              ? 'bg-[#0B0F19] text-white border border-white/5 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layout size={15} />
          Theme & Studio
        </button>
        <button
          onClick={() => setActiveTab('sections')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'sections'
              ? 'bg-[#0B0F19] text-white border border-white/5 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase size={15} />
          Timeline & Reviews
        </button>
      </div>

      {/* ============================================================
         TAB A: ANIMATION & THEME STUDIO
         ============================================================ */}
      {activeTab === 'theme' && (
        <div className="grid gap-6 md:grid-cols-3 items-start">
          
          {/* Main Selectors Column */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Card A1: Entrance Animation */}
            <div className="glass-card-static p-6 space-y-4">
              <div>
                <h3 className="text-white font-semibold text-sm flex items-center gap-1.5">
                  <Play size={15} className="text-indigo-400" />
                  Entrance Animation Style
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Define the entry visual transition loaded when visitors access your page.
                </p>
              </div>

              {/* Radio card options */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'fade', label: 'Fade In', desc: 'Progressive opacity entrance.' },
                  { id: 'slide-up', label: 'Slide Up', desc: 'Vertical rising slide entrance.' },
                  { id: 'glitch', label: 'Digital Glitch', desc: 'Cyber text clipping shadows.' },
                  { id: 'liquid-reveal', label: 'Liquid Reveal', desc: 'Circular gooey spring reveal.' }
                ].map(opt => (
                  <label
                    key={opt.id}
                    onClick={() => {
                      setProfile(p => ({ ...p, animation_style: opt.id as any }));
                      setTimeout(triggerPreviewReplay, 50);
                    }}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 block ${
                      profile.animation_style === opt.id
                        ? 'bg-indigo-500/10 border-indigo-500/30'
                        : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="radio"
                      name="animationStyle"
                      checked={profile.animation_style === opt.id}
                      onChange={() => {}}
                      className="sr-only"
                    />
                    <div className="text-sm font-semibold text-white">{opt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-1 leading-relaxed">{opt.desc}</div>
                  </label>
                ))}
              </div>

              {/* Animation Speed Selector */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-400">
                    Animation Speed (Duration Primitive)
                  </label>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white/10 text-slate-300">
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
                          ? 'bg-white/10 border-white/25 text-white'
                          : 'bg-transparent border-white/5 text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {spd.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Card A2: Ambient Canvas Background Switcher */}
            <div className="glass-card-static p-6 space-y-4">
              <div>
                <h3 className="text-white font-semibold text-sm flex items-center gap-1.5">
                  <Layout size={15} className="text-indigo-400" />
                  Ambient Background effect
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Switch background effects. Mobile devices automatically fallback to solid profiles.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: 'mesh-gradient', label: 'Mesh Blob', icon: '🎨', tooltip: 'Moving CSS blur blob gradient.' },
                  { id: 'particles', label: 'Particles', icon: '✨', tooltip: 'Mouse-reactive node connection network.' },
                  { id: 'matrix', label: 'Matrix Rain', icon: '👾', tooltip: 'Digital glow rainfall in theme accent.' },
                  { id: 'none', label: 'Solid Dark', icon: '🌑', tooltip: 'Flat deep backdrops.' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    title={opt.tooltip}
                    onClick={() => setProfile(p => ({ ...p, background_effect: opt.id as any }))}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                      profile.background_effect === opt.id
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-white'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-lg">{opt.icon}</span>
                    <span className="text-xs font-semibold">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Card A3: Layout Modes & Typography */}
            <div className="glass-card-static p-6 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                
                {/* Layout switch */}
                <div>
                  <label className="block text-xs font-semibold text-white mb-2 flex items-center gap-1">
                    <Layout size={13} className="text-indigo-400" />
                    Layout Structure Variant
                  </label>
                  <select
                    value={profile.layout_variant || 'classic'}
                    onChange={(e) => setProfile(p => ({ ...p, layout_variant: e.target.value as any }))}
                    className="glass-input bg-[#0B0F19]"
                  >
                    <option value="classic">Classic Vertical Flow</option>
                    <option value="minimalist">Clean Minimalist Column</option>
                    <option value="cyberpunk-grid">Cyberpunk Bento Grid</option>
                  </select>
                </div>

                {/* Font Selector */}
                <div>
                  <label className="block text-xs font-semibold text-white mb-2 flex items-center gap-1">
                    <Type size={13} className="text-indigo-400" />
                    Google Custom Font
                  </label>
                  <select
                    value={profile.custom_font || 'Plus Jakarta Sans'}
                    onChange={(e) => setProfile(p => ({ ...p, custom_font: e.target.value }))}
                    className="glass-input bg-[#0B0F19]"
                  >
                    {ULTRA_MODERN_FONTS.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

              </div>
            </div>

          </div>

          {/* Visual Live Preview Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Live Preview</span>
              <button 
                onClick={triggerPreviewReplay}
                className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all text-xs flex items-center gap-1"
              >
                <Play size={10} /> Replay
              </button>
            </div>

            {/* Simulated Frame */}
            <div className="glass-card-static p-6 relative overflow-hidden flex flex-col justify-between aspect-square" style={{ backgroundColor: '#090a10', borderColor: `${themeColor}20` }}>
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
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }} />
                      <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Sys_Core</span>
                    </div>
                    <span className="text-[8px] font-mono text-[#10b981] animate-pulse">● LIVE</span>
                  </div>

                  <div className="my-auto space-y-2">
                    {profile.animation_style === 'glitch' ? (
                      <h4 className="text-xl font-extrabold text-white tracking-tight relative inline-block">
                        <span className="absolute left-0 top-0 text-red-500 animate-glitch-1 opacity-70 w-full h-full" style={{ clipPath: 'inset(40% 0 61% 0)' }}>VISITOR</span>
                        <span className="text-white relative z-10">VISITOR</span>
                        <span className="absolute left-0 top-0 text-cyan-400 animate-glitch-2 opacity-70 w-full h-full" style={{ clipPath: 'inset(12% 0 85% 0)' }}>VISITOR</span>
                        <style>{`
                          @keyframes preview-glitch-1 {
                            0% { clip-path: inset(20% 0 60% 0); transform: skew(0.5deg); }
                            50% { clip-path: inset(80% 0 5% 0); transform: skew(-0.4deg); }
                            100% { clip-path: inset(45% 0 35% 0); transform: skew(0deg); }
                          }
                          @keyframes preview-glitch-2 {
                            0% { clip-path: inset(40% 0 30% 0); transform: skew(-0.6deg); }
                            50% { clip-path: inset(5% 0 85% 0); transform: skew(0.7deg); }
                            100% { clip-path: inset(30% 0 45% 0); transform: skew(0deg); }
                          }
                          .animate-glitch-1 { animation: preview-glitch-1 0.8s infinite linear alternate-reverse; }
                          .animate-glitch-2 { animation: preview-glitch-2 0.9s infinite linear alternate-reverse; }
                        `}</style>
                      </h4>
                    ) : (
                      <h4 className="text-xl font-extrabold text-white tracking-tight">VISITOR</h4>
                    )}
                    <p className="text-slate-400 text-[10px] leading-relaxed max-w-[190px]">
                      Chosen animation and typography styles are simulated in real-time.
                    </p>
                  </div>

                  <div className="border-t border-white/5 pt-2 flex items-center justify-between text-[7px] text-slate-600 font-mono">
                    <span>ANIM: {profile.animation_style?.toUpperCase()}</span>
                    <span>LAYOUT: {profile.layout_variant?.toUpperCase()}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================
         TAB B: INTERACTIVE SECTIONS MANAGER
         ============================================================ */}
      {activeTab === 'sections' && (
        <div className="grid gap-6 md:grid-cols-2 items-start">
          
          {/* Job Timeline CRUD List */}
          <div className="glass-card-static p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="text-white font-semibold text-sm flex items-center gap-1.5">
                  <Briefcase size={15} className="text-indigo-400" />
                  Experience Timeline Builder
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Manage job timelines. commit payload is held in local memory.</p>
              </div>
              {expEditIndex === null && (
                <button
                  type="button"
                  onClick={startAddExp}
                  className="btn-ghost !py-1 px-2.5 text-xs text-indigo-400 hover:text-white flex items-center gap-1"
                >
                  <Plus size={13} /> Add Job
                </button>
              )}
            </div>

            {/* Position editor form */}
            {expEditIndex !== null ? (
              <div className="border border-white/10 rounded-xl p-4 bg-white/5 space-y-4">
                <h4 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                  {expEditIndex === -1 ? 'Add New Position' : `Edit Position #${expEditIndex + 1}`}
                </h4>

                <div className="grid gap-3 grid-cols-2">
                  <div className="col-span-2">
                    <label className="text-[9px] text-slate-400 uppercase font-bold">Role/Title *</label>
                    <input
                      type="text"
                      value={tempExp.role}
                      onChange={(e) => setTempExp(prev => ({ ...prev, role: e.target.value }))}
                      className="glass-input mt-1 !py-1.5 text-xs"
                      placeholder="e.g. Senior Backend Engineer"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase font-bold">Company *</label>
                    <input
                      type="text"
                      value={tempExp.company}
                      onChange={(e) => setTempExp(prev => ({ ...prev, company: e.target.value }))}
                      className="glass-input mt-1 !py-1.5 text-xs"
                      placeholder="e.g. Supabase"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase font-bold">Duration *</label>
                    <input
                      type="text"
                      value={tempExp.duration}
                      onChange={(e) => setTempExp(prev => ({ ...prev, duration: e.target.value }))}
                      className="glass-input mt-1 !py-1.5 text-xs"
                      placeholder="e.g. 2024 - Present"
                    />
                  </div>
                </div>

                {/* Nested achievements bullets */}
                <div className="space-y-2">
                  <label className="text-[9px] text-slate-400 uppercase font-bold">Bullet Accomplishments</label>
                  
                  <ul className="space-y-1">
                    {tempExp.bullet_points.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex gap-2 items-center bg-white/5 border border-white/5 px-2.5 py-1.5 rounded-lg text-xs">
                        <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: themeColor }} />
                        <span className="flex-1 text-slate-300 leading-normal">{bullet}</span>
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
                      className="glass-input !py-1.5 text-xs flex-1"
                      placeholder="Add bullet accomplishment..."
                    />
                    <button
                      type="button"
                      onClick={addBullet}
                      className="btn-ghost !p-2 shrink-0"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setExpEditIndex(null)}
                    className="btn-ghost !py-1 px-3 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveExp}
                    className="btn-primary !py-1 px-3 text-xs"
                  >
                    Keep Position
                  </button>
                </div>
              </div>
            ) : null}

            {/* List with rearrangement capabilities */}
            <div className="space-y-3">
              {(profile.experiences || []).map((exp, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 border border-white/5 rounded-xl bg-[#090a10] hover:border-white/10 transition-all">
                  <div className="flex-1 pr-4 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{exp.role}</h4>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{exp.company} | {exp.duration}</p>
                  </div>
                  
                  {/* Operations actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => moveExp(idx, 'up')}
                        disabled={idx === 0}
                        className="text-[9px] font-bold text-slate-500 hover:text-white p-0.5 disabled:opacity-30 disabled:hover:text-slate-500"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => moveExp(idx, 'down')}
                        disabled={idx === (profile.experiences || []).length - 1}
                        className="text-[9px] font-bold text-slate-500 hover:text-white p-0.5 disabled:opacity-30 disabled:hover:text-slate-500"
                        title="Move Down"
                      >
                        ▼
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => startEditExp(idx)}
                      className="p-1.5 rounded hover:bg-white/5 text-slate-400 hover:text-white"
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
                <div className="p-8 border border-dashed border-white/10 rounded-xl text-center text-slate-500 text-xs">
                  No careers history timelines added. Click &quot;Add Job&quot; to begin.
                </div>
              )}
            </div>

          </div>

          {/* Testimonial reviews Form mapper */}
          <div className="glass-card-static p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="text-white font-semibold text-sm flex items-center gap-1.5">
                  <MessageSquare size={15} className="text-indigo-400" />
                  Testimonials & Recommendations
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Let teammates leave reviews.</p>
              </div>
              {testiEditIndex === null && (
                <button
                  type="button"
                  onClick={startAddTesti}
                  className="btn-ghost !py-1 px-2.5 text-xs text-indigo-400 hover:text-white flex items-center gap-1"
                >
                  <Plus size={13} /> Add Review
                </button>
              )}
            </div>

            {/* Testimonials edit form */}
            {testiEditIndex !== null ? (
              <div className="border border-white/10 rounded-xl p-4 bg-white/5 space-y-4">
                <h4 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                  {testiEditIndex === -1 ? 'Add New Testimonial' : `Edit Testimonial #${testiEditIndex + 1}`}
                </h4>

                <div className="grid gap-3 grid-cols-2">
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase font-bold">Name *</label>
                    <input
                      type="text"
                      value={tempTesti.reviewer_name}
                      onChange={(e) => setTempTesti(prev => ({ ...prev, reviewer_name: e.target.value }))}
                      className="glass-input mt-1 !py-1.5 text-xs"
                      placeholder="e.g. Mounika"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase font-bold">Designation *</label>
                    <input
                      type="text"
                      value={tempTesti.designation}
                      onChange={(e) => setTempTesti(prev => ({ ...prev, designation: e.target.value }))}
                      className="glass-input mt-1 !py-1.5 text-xs"
                      placeholder="e.g. Lead Designer"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[9px] text-slate-400 uppercase font-bold">Avatar Link</label>
                    <input
                      type="url"
                      value={tempTesti.avatar_url}
                      onChange={(e) => setTempTesti(prev => ({ ...prev, avatar_url: e.target.value }))}
                      className="glass-input mt-1 !py-1.5 text-xs"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[9px] text-slate-400 uppercase font-bold">Review Text *</label>
                    <textarea
                      value={tempTesti.review_text}
                      onChange={(e) => setTempTesti(prev => ({ ...prev, review_text: e.target.value }))}
                      className="glass-textarea mt-1 !py-1.5 text-xs"
                      placeholder="Type testimonial here..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Sub Live preview card */}
                {tempTesti.reviewer_name && (
                  <div className="border border-white/5 p-3 rounded-lg bg-[#090a10] space-y-2">
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1">
                      <Eye size={10} /> Live Preview
                    </span>
                    <p className="text-[10px] text-slate-400 italic leading-relaxed">&ldquo;{tempTesti.review_text || '...'}&rdquo;</p>
                    <div className="flex items-center gap-2.5 pt-2 border-t border-white/5">
                      {tempTesti.avatar_url ? (
                        <img src={tempTesti.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ background: `linear-gradient(135deg, ${themeColor}, #8b5cf6)` }}>
                          {tempTesti.reviewer_name.split(' ').slice(0,2).map(n=>n[0]).join('').toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h5 className="text-white font-semibold text-[10px] leading-none">{tempTesti.reviewer_name}</h5>
                        <span className="text-[8px] text-slate-500 leading-none mt-1 inline-block">{tempTesti.designation}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setTestiEditIndex(null)}
                    className="btn-ghost !py-1 px-3 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveTesti}
                    className="btn-primary !py-1 px-3 text-xs"
                  >
                    Keep Review
                  </button>
                </div>
              </div>
            ) : null}

            {/* Recommendation list */}
            <div className="space-y-3">
              {(profile.testimonials || []).map((t, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 border border-white/5 rounded-xl bg-[#090a10] hover:border-white/10 transition-all">
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
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{t.designation}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEditTesti(idx)}
                      className="p-1.5 rounded hover:bg-white/5 text-slate-400 hover:text-white"
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
                <div className="p-8 border border-dashed border-white/10 rounded-xl text-center text-slate-500 text-xs">
                  No recommendations left. Click &quot;Add Review&quot; to write one.
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
