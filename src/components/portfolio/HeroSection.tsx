'use client';

import { motion } from 'framer-motion';
import { MapPin, FileText } from 'lucide-react';
import type { Profile } from '@/types/database.types';

interface HeroSectionProps {
  profile: Profile;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const themeColor = profile.theme_color || '#6366f1';

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl w-full mx-auto text-center">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
          className="mb-8"
        >
          <div
            className="relative inline-block"
          >
            {/* Glow ring */}
            <div
              className="absolute -inset-1 rounded-full opacity-60 blur-md"
              style={{ background: `linear-gradient(135deg, ${themeColor}, #8b5cf6)` }}
            />
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-white/20">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-4xl font-bold"
                  style={{ background: `linear-gradient(135deg, ${themeColor}50, #8b5cf650)` }}
                >
                  {profile.full_name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={
            profile.animation_style === 'glitch'
              ? {}
              : { opacity: 0, y: 30 }
          }
          animate={
            profile.animation_style === 'glitch'
              ? {}
              : { opacity: 1, y: 0 }
          }
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-4 tracking-tight"
        >
          {profile.animation_style === 'glitch' ? (
            <span className="relative inline-block select-none">
              <span className="absolute left-0 top-0 text-red-500 animate-glitch-1 opacity-70 w-full h-full" style={{ clipPath: 'inset(40% 0 61% 0)' }}>
                {profile.full_name}
              </span>
              <span className="gradient-text relative z-10">{profile.full_name}</span>
              <span className="absolute left-0 top-0 text-cyan-400 animate-glitch-2 opacity-70 w-full h-full" style={{ clipPath: 'inset(12% 0 85% 0)' }}>
                {profile.full_name}
              </span>
              <style>{`
                @keyframes glitch-anim-1 {
                  0% { clip-path: inset(20% 0 60% 0); transform: skew(0.5deg); }
                  20% { clip-path: inset(60% 0 10% 0); transform: skew(-0.3deg); }
                  40% { clip-path: inset(10% 0 80% 0); transform: skew(0.6deg); }
                  60% { clip-path: inset(80% 0 5% 0); transform: skew(-0.4deg); }
                  80% { clip-path: inset(5% 0 90% 0); transform: skew(0.8deg); }
                  100% { clip-path: inset(45% 0 35% 0); transform: skew(0deg); }
                }
                @keyframes glitch-anim-2 {
                  0% { clip-path: inset(40% 0 30% 0); transform: skew(-0.6deg); }
                  20% { clip-path: inset(10% 0 70% 0); transform: skew(0.4deg); }
                  40% { clip-path: inset(80% 0 5% 0); transform: skew(-0.5deg); }
                  60% { clip-path: inset(5% 0 85% 0); transform: skew(0.7deg); }
                  80% { clip-path: inset(70% 0 10% 0); transform: skew(-0.2deg); }
                  100% { clip-path: inset(30% 0 45% 0); transform: skew(0deg); }
                }
                .animate-glitch-1 {
                  animation: glitch-anim-1 1s infinite linear alternate-reverse;
                }
                .animate-glitch-2 {
                  animation: glitch-anim-2 1.2s infinite linear alternate-reverse;
                }
              `}</style>
            </span>
          ) : (
            <span className="gradient-text">{profile.full_name}</span>
          )}
        </motion.h1>

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl font-medium mb-6"
          style={{ color: themeColor }}
        >
          {profile.professional_title}
        </motion.p>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-slate-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {profile.bio}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          {profile.resume_url && (
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${themeColor}, #8b5cf6)`,
                boxShadow: `0 8px 30px -8px ${themeColor}80`,
              }}
            >
              <FileText size={18} />
              View Resume
            </a>
          )}
          <a
            href="#projects"
            className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-slate-300 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
          >
            <MapPin size={18} />
            See My Work
          </a>
        </motion.div>
      </div>
    </section>
  );
}
