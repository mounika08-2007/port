'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Users, Sparkles } from 'lucide-react';
import type { Profile } from '@/types/database.types';
import Link from 'next/link';

interface LandingClientProps {
  profiles: Profile[];
}

export default function LandingClient({ profiles }: LandingClientProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="blob blob-1"
          style={{
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
            top: '-10%',
            right: '-5%',
          }}
        />
        <div
          className="blob blob-2"
          style={{
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
            bottom: '10%',
            left: '-10%',
          }}
        />
        <div
          className="blob blob-3"
          style={{
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
            top: '50%',
            left: '40%',
          }}
        />
      </div>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-400 mb-8">
            <Sparkles size={14} className="text-indigo-400" />
            Team Portfolio Ecosystem
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
            <span className="gradient-text">Meet Our</span>
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
              }}
            >
              Team
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto leading-relaxed">
            Explore the portfolios of our talented team members. Each one showcases unique skills, projects, and expertise.
          </p>
        </motion.div>

        {/* Team Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto w-full mb-16"
        >
          {profiles.map((profile, i) => {
            const color = profile.theme_color || '#6366f1';
            return (
              <motion.div
                key={profile.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.15 }}
              >
                <Link
                  href={`/portfolio/${profile.slug}`}
                  className="glass-card block p-8 group cursor-pointer"
                >
                  {/* Avatar */}
                  <div className="relative mb-5 inline-block">
                    <div
                      className="absolute -inset-1 rounded-full opacity-50 blur-md transition-opacity duration-300 group-hover:opacity-80"
                      style={{ background: `linear-gradient(135deg, ${color}, #8b5cf6)` }}
                    />
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/15">
                      {profile.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-2xl font-bold text-white"
                          style={{
                            background: `linear-gradient(135deg, ${color}60, #8b5cf660)`,
                          }}
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

                  {/* Info */}
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-white/90 transition-colors">
                    {profile.full_name}
                  </h3>
                  <p className="text-sm font-medium mb-3" style={{ color }}>
                    {profile.professional_title}
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-5">
                    {profile.bio}
                  </p>

                  {/* View Link */}
                  <div
                    className="flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3"
                    style={{ color }}
                  >
                    View Portfolio
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}

          {/* Empty state */}
          {profiles.length === 0 && (
            <div className="col-span-full text-center py-20">
              <Users size={48} className="mx-auto text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-400 mb-2">No team members yet</h3>
              <p className="text-slate-500 mb-6">
                Head to the admin dashboard to add your first team member.
              </p>
              <Link href="/admin" className="btn-primary inline-flex">
                Open Admin Dashboard
              </Link>
            </div>
          )}
        </motion.div>

        {/* Admin Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link
            href="/admin"
            className="text-slate-500 hover:text-slate-300 text-sm transition-colors duration-300"
          >
            Admin Dashboard →
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
