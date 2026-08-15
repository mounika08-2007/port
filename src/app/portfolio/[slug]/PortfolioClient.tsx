'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Palette } from 'lucide-react';
import type { Profile } from '@/types/database.types';
import BackgroundSwitcher from '@/components/portfolio/BackgroundSwitcher';
import HeroSection from '@/components/portfolio/HeroSection';
import SkillsGrid from '@/components/portfolio/SkillsGrid';
import ProjectShowcase from '@/components/portfolio/ProjectShowcase';
import SocialLinks from '@/components/portfolio/SocialLinks';
import Footer from '@/components/portfolio/Footer';
import ExperienceTimeline from '@/components/portfolio/ExperienceTimeline';
import TestimonialsSection from '@/components/portfolio/TestimonialsSection';
import TerminalModal from '@/components/portfolio/TerminalModal';
import GuestbookSection from '@/components/portfolio/GuestbookSection';
import StatsDisplay from '@/components/portfolio/StatsDisplay';
import { playSound } from '@/utils/sound';

import AIChatbot from '@/components/portfolio/AIChatbot';
import SkillsQuiz from '@/components/portfolio/SkillsQuiz';
import BlogSection from '@/components/portfolio/BlogSection';

interface PortfolioClientProps {
  profile: Profile;
}

export default function PortfolioClient({ profile }: PortfolioClientProps) {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);

  const {
    animation_style = 'fade',
    animation_speed = 'normal',
    background_effect = 'mesh-gradient',
    layout_variant = 'classic',
    custom_font = 'Plus Jakarta Sans',
    experiences = [],
    testimonials = [],
    theme_color = '#6366f1',
    github_username = '',
    show_terminal_toggle = true,
    sound_effects_enabled = false,
  } = profile;

  // Overridable theme styles
  const [layout, setLayout] = useState(layout_variant);
  const [themeColor, setThemeColor] = useState(theme_color);
  const [fontName, setFontName] = useState(custom_font);
  const [backgroundEffect, setBackgroundEffect] = useState<'mesh-gradient' | 'particles' | 'matrix' | 'aurora' | 'cyber-grid' | 'none'>(background_effect as any);
  const [animationStyle, setAnimationStyle] = useState<'fade' | 'slide-up' | 'glitch' | 'liquid-reveal' | 'blur-reveal' | 'rotate-in'>(animation_style as any);

  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');

  const speed = animation_speed;
  const soundEnabled = sound_effects_enabled;

  const applyPreset = (presetName: string) => {
    playSound('click', soundEnabled);
    if (presetName === 'glassmorphism') {
      setLayout('classic');
      setThemeColor('#6366f1');
      setFontName('Plus Jakarta Sans');
      setBackgroundEffect('mesh-gradient');
      setAnimationStyle('fade');
      setThemeMode('dark');
    } else if (presetName === 'clean-light') {
      setLayout('minimalist');
      setThemeColor('#3b82f6');
      setFontName('Plus Jakarta Sans');
      setBackgroundEffect('none');
      setAnimationStyle('fade');
      setThemeMode('light');
    } else if (presetName === 'retro-terminal') {
      setLayout('minimalist');
      setThemeColor('#10b981');
      setFontName('Courier New');
      setBackgroundEffect('none');
      setAnimationStyle('slide-up');
      setThemeMode('dark');
    } else if (presetName === 'matrix-tech') {
      setLayout('cyberpunk-grid');
      setThemeColor('#22c55e');
      setFontName('Courier New');
      setBackgroundEffect('matrix');
      setAnimationStyle('glitch');
      setThemeMode('dark');
    } else if (presetName === 'cyberpunk-neon') {
      setLayout('cyberpunk-grid');
      setThemeColor('#ec4899');
      setFontName('Plus Jakarta Sans');
      setBackgroundEffect('cyber-grid');
      setAnimationStyle('glitch');
      setThemeMode('dark');
    } else if (presetName === 'aurora-glow') {
      setLayout('classic');
      setThemeColor('#8b5cf6');
      setFontName('Plus Jakarta Sans');
      setBackgroundEffect('aurora');
      setAnimationStyle('blur-reveal');
      setThemeMode('dark');
    } else {
      setLayout(layout_variant);
      setThemeColor(theme_color);
      setFontName(custom_font);
      setBackgroundEffect(background_effect);
      setAnimationStyle(animation_style);
      setThemeMode('dark');
    }
  };




  // 1. Dynamic Font Injection
  useEffect(() => {
    if (!fontName) return;
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@300;400;500;600;700;800&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [fontName]);

  // 2. Map Animation Speed to Duration
  const duration = speed === 'slow' ? 1.2 : speed === 'fast' ? 0.3 : 0.6;

  // 3. Define Entry Animation Variants
  const animVariants = {
    hidden: {
      opacity: 0,
      ...(animationStyle === 'slide-up' ? { y: 50 } : {}),
      ...(animationStyle === 'blur-reveal' ? { filter: 'blur(12px)' } : {}),
      ...(animationStyle === 'rotate-in' ? { rotateX: 20, transformPerspective: 1000 } : {}),
      ...(animationStyle === 'glitch' ? { x: -15 } : {}),
      ...(animationStyle === 'liquid-reveal' ? { clipPath: 'circle(0% at 50% 50%)' } : {}),
    },
    visible: {
      opacity: 1,
      ...(animationStyle === 'slide-up' ? { y: 0 } : {}),
      ...(animationStyle === 'blur-reveal' ? { filter: 'blur(0px)' } : {}),
      ...(animationStyle === 'rotate-in' ? { rotateX: 0, transformPerspective: 1000 } : {}),
      ...(animationStyle === 'glitch' ? { x: 0 } : {}),
      ...(animationStyle === 'liquid-reveal' ? { clipPath: 'circle(100% at 50% 50%)' } : {}),
    },
  };


  const animTransition = (animationStyle === 'liquid-reveal'
    ? {
        type: 'spring' as const,
        stiffness: 35,
        damping: 14,
        duration: duration * 1.5,
      }
    : {
        type: 'tween' as const,
        duration,
        ease: 'easeOut' as const,
      }) as any;

  // 4. Background switch (Minimalist forces a flat solid page)
  const finalBgEffect = layout === 'minimalist' ? 'none' : backgroundEffect;

  // Render layouts
  return (
    <div
      className={`relative min-h-screen transition-all duration-500 pb-12 ${themeMode}`}
      style={{
        fontFamily: `"${fontName}", var(--font-geist-sans), system-ui, sans-serif`,
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Dynamic Background switcher */}
      <BackgroundSwitcher effect={finalBgEffect} themeColor={themeColor} />


      {/* Main Animated Page Entry Wrapper */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={animVariants}
        transition={animTransition}
        className="relative z-10"
      >
        {/* LAYOUT A: CLASSIC FLOW */}
        {layout === 'classic' && (
          <main className="relative">
            <HeroSection profile={profile} />
            <SkillsGrid skills={profile.skills || []} themeColor={themeColor} />
            <BlogSection profileId={profile.id} themeColor={themeColor} soundEnabled={soundEnabled} />
            {profile.experiences && profile.experiences.length > 0 && (
              <ExperienceTimeline experiences={profile.experiences} themeColor={themeColor} />
            )}
            <ProjectShowcase projects={profile.projects || []} themeColor={themeColor} />
            {github_username && (
              <StatsDisplay githubUsername={github_username} themeColor={themeColor} soundEnabled={soundEnabled} />
            )}
            <SkillsQuiz profile={profile} themeColor={themeColor} soundEnabled={soundEnabled} />
            {profile.testimonials && profile.testimonials.length > 0 && (
              <TestimonialsSection testimonials={profile.testimonials} themeColor={themeColor} />
            )}
            <GuestbookSection profileId={profile.id} themeColor={themeColor} soundEnabled={soundEnabled} />
            <SocialLinks links={profile.social_links || []} themeColor={themeColor} />
            <Footer name={profile.full_name} themeColor={themeColor} />
          </main>
        )}


        {/* LAYOUT B: MINIMALIST COLUMN */}
        {layout === 'minimalist' && (
          <main className="max-w-3xl mx-auto px-6 py-24 space-y-16 divide-y divide-white/5">
            <div className="pb-8">
              <HeroSection profile={profile} />
            </div>
            {profile.skills && profile.skills.length > 0 && (
              <div className="pt-16">
                <SkillsGrid skills={profile.skills} themeColor={themeColor} />
              </div>
            )}
            <div className="pt-16">
              <BlogSection profileId={profile.id} themeColor={themeColor} soundEnabled={soundEnabled} />
            </div>
            {profile.experiences && profile.experiences.length > 0 && (
              <div className="pt-16">
                <ExperienceTimeline experiences={profile.experiences} themeColor={themeColor} />
              </div>
            )}
            {profile.projects && profile.projects.length > 0 && (
              <div className="pt-16">
                <ProjectShowcase projects={profile.projects} themeColor={themeColor} />
              </div>
            )}
            {github_username && (
              <div className="pt-16">
                <StatsDisplay githubUsername={github_username} themeColor={themeColor} soundEnabled={soundEnabled} />
              </div>
            )}
            <div className="pt-16">
              <SkillsQuiz profile={profile} themeColor={themeColor} soundEnabled={soundEnabled} />
            </div>
            {profile.testimonials && profile.testimonials.length > 0 && (
              <div className="pt-16">
                <TestimonialsSection testimonials={profile.testimonials} themeColor={themeColor} />
              </div>
            )}
            <div className="pt-16">
              <GuestbookSection profileId={profile.id} themeColor={themeColor} soundEnabled={soundEnabled} />
            </div>
            <div className="pt-16">
              <SocialLinks links={profile.social_links || []} themeColor={themeColor} />
            </div>
            <div className="pt-10 text-center">
              <Footer name={profile.full_name} themeColor={themeColor} />
            </div>
          </main>
        )}


        {/* LAYOUT C: CYBERPUNK BENTO GRID */}
        {layout === 'cyberpunk-grid' && (
          <main className="max-w-7xl mx-auto px-6 py-16 bento-card-container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              
              {/* Grid block 1: Hero */}
              <div className="lg:col-span-2 lg:row-span-2">
                <BentoCard themeColor={themeColor} title="System Profile // Core Info">
                  <HeroSection profile={profile} />
                </BentoCard>
              </div>

              {/* Grid block 2: Skills */}
              <div className="lg:col-span-1">
                <BentoCard themeColor={themeColor} title="Expertise Matrix // Tech Stack">
                  <SkillsGrid skills={profile.skills || []} themeColor={themeColor} />
                </BentoCard>
              </div>

              {/* Grid block 3: Social Links */}
              <div className="lg:col-span-1">
                <BentoCard themeColor={themeColor} title="Network Interface // Social">
                  <SocialLinks links={profile.social_links || []} themeColor={themeColor} />
                </BentoCard>
              </div>

              {/* Grid block 4: Experience */}
              {profile.experiences && profile.experiences.length > 0 && (
                <div className="lg:col-span-3">
                  <BentoCard themeColor={themeColor} title="Timeline Chronology // History">
                    <ExperienceTimeline experiences={profile.experiences} themeColor={themeColor} />
                  </BentoCard>
                </div>
              )}

              {/* Grid block 5: Projects */}
              {profile.projects && profile.projects.length > 0 && (
                <div className="lg:col-span-3">
                  <BentoCard themeColor={themeColor} title="Archived Operations // Projects">
                    <ProjectShowcase projects={profile.projects} themeColor={themeColor} />
                  </BentoCard>
                </div>
              )}

              {/* Grid block 6: Testimonials */}
              {profile.testimonials && profile.testimonials.length > 0 && (
                <div className="lg:col-span-3">
                  <BentoCard themeColor={themeColor} title="Endorsement Log // Recommendations">
                    <TestimonialsSection testimonials={profile.testimonials} themeColor={themeColor} />
                  </BentoCard>
                </div>
              )}

              {/* Grid block 7: GitHub Stats */}
              {github_username && (
                <div className="lg:col-span-1">
                  <BentoCard themeColor={themeColor} title="External Operations // GitHub Stats">
                    <StatsDisplay githubUsername={github_username} themeColor={themeColor} soundEnabled={soundEnabled} />
                  </BentoCard>
                </div>
              )}

              {/* Grid block 8: Real-Time Guestbook */}
              <div className="lg:col-span-2">
                <BentoCard themeColor={themeColor} title="Transmission Registry // Guestbook">
                  <GuestbookSection profileId={profile.id} themeColor={themeColor} soundEnabled={soundEnabled} />
                </BentoCard>
              </div>

              {/* Grid block 9: Blog publisher */}
              <div className="lg:col-span-3">
                <BentoCard themeColor={themeColor} title="External Logs // Articles & Blog">
                  <BlogSection profileId={profile.id} themeColor={themeColor} soundEnabled={soundEnabled} />
                </BentoCard>
              </div>

              {/* Grid block 10: Skills Quiz */}
              <div className="lg:col-span-3">
                <BentoCard themeColor={themeColor} title="Interactive Challenge // Trivia Quiz">
                  <SkillsQuiz profile={profile} themeColor={themeColor} soundEnabled={soundEnabled} />
                </BentoCard>
              </div>

            </div>

            
            <div className="mt-12 text-center">
              <Footer name={profile.full_name} themeColor={themeColor} />
            </div>

            {/* Smart CSS overrides to fit core blocks perfectly inside bento cells without duplicating titles */}
            <style>{`
              .bento-card-container section {
                padding-top: 1rem !important;
                padding-bottom: 1rem !important;
                padding-left: 0 !important;
                padding-right: 0 !important;
                background: transparent !important;
                border: none !important;
                box-shadow: none !important;
              }
              .bento-card-container section h2,
              .bento-card-container section .w-16.h-1 {
                display: none !important;
              }
            `}</style>
          </main>
        )}
      </motion.div>

      {/* Theme Presets Switcher FAB */}
      <div className="fixed top-6 right-6 z-40">
        <button
          onClick={() => {
            playSound('click', soundEnabled);
            setShowPresetsMenu(!showPresetsMenu);
          }}
          className="p-3.5 rounded-full text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer bg-zinc-950/80 border border-zinc-850"
          style={{
            boxShadow: `0 4px 20px -3px ${themeColor}30`,
          }}
          title="Switch Themes"
        >
          <Palette size={20} style={{ color: themeColor }} />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {showPresetsMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-3 w-56 bg-zinc-950 border border-zinc-850 rounded-xl shadow-2xl p-2.5 space-y-1.5"
            >
              <div className="px-2 py-1 border-b border-zinc-900 pb-1.5 mb-1">
                <h4 className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider">Visual Presets</h4>
              </div>
              {[
                { id: 'default', label: '🔄 Profile Defaults', style: 'border-zinc-850 hover:bg-zinc-900 text-zinc-400' },
                { id: 'glassmorphism', label: '🎨 Sleek Glassmorphism (Dark)', style: 'border-indigo-900/20 hover:bg-indigo-950/20 text-indigo-300 font-semibold' },
                { id: 'clean-light', label: '☀️ Clean Minimalist (Light)', style: 'border-blue-900/20 hover:bg-blue-950/20 text-blue-400 font-semibold' },
                { id: 'retro-terminal', label: '📟 Retro Terminal (Dark)', style: 'border-emerald-900/20 hover:bg-emerald-950/20 text-emerald-300 font-semibold' },
                { id: 'matrix-tech', label: '🔌 Matrix Tech Grid (Dark)', style: 'border-green-900/20 hover:bg-green-950/20 text-green-300 font-semibold' },
                { id: 'cyberpunk-neon', label: '⚡ Cyberpunk Pink (Dark)', style: 'border-pink-900/20 hover:bg-pink-950/20 text-pink-300 font-semibold' },
                { id: 'aurora-glow', label: '🌌 Aurora Glow (Dark)', style: 'border-purple-900/20 hover:bg-purple-950/20 text-purple-300 font-semibold' }
              ].map(preset => (

                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    applyPreset(preset.id);
                    setShowPresetsMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 cursor-pointer ${preset.style}`}
                >
                  {preset.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button for Retro Terminal */}
      {show_terminal_toggle && (
        <button
          onClick={() => {
            playSound('click', soundEnabled);
            setIsTerminalOpen(true);
          }}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-full text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
          style={{
            background: `linear-gradient(135deg, ${themeColor}, #8b5cf6)`,
            boxShadow: `0 8px 30px -5px ${themeColor}60`,
          }}
          title="Open Portfolio CLI Terminal"
        >
          <Terminal size={22} />
        </button>
      )}

      {/* AI Chatbot FAB & Window */}
      <AIChatbot
        profile={profile}
        themeColor={themeColor}
        soundEnabled={soundEnabled}
      />

      {/* Retro Interactive Terminal overlay */}
      <AnimatePresence>
        {isTerminalOpen && (
          <TerminalModal
            profile={profile}
            onClose={() => setIsTerminalOpen(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}


/* ============================================================
   BENTO GRID CARD COMPONENT
   ============================================================ */
function BentoCard({
  children,
  className = '',
  themeColor,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  themeColor: string;
  title?: string;
}) {
  return (
    <div
      className={`glass-card-static p-6 md:p-8 relative overflow-hidden border transition-all duration-300 hover:border-white/15 h-full ${className}`}
      style={{
        boxShadow: `0 0 35px -12px ${themeColor}20`,
        borderColor: `${themeColor}20`,
      }}
    >
      {/* Glowing cyberpunk corners */}
      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2" style={{ borderColor: themeColor }} />
      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2" style={{ borderColor: themeColor }} />
      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2" style={{ borderColor: themeColor }} />
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2" style={{ borderColor: themeColor }} />

      {title && (
        <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeColor }} />
            {title}
          </h3>
          <span className="text-[9px] font-mono text-slate-600">ID_0x{Math.floor(Math.random() * 899 + 100)}</span>
        </div>
      )}
      <div className="h-full">{children}</div>
    </div>
  );
}
