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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-4 tracking-tight"
        >
          <span className="gradient-text">{profile.full_name}</span>
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
