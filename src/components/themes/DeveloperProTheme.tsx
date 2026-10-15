'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Terminal,
  Code2,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  FileText,
  Sparkles,
  Cpu,
  Layers,
  GraduationCap,
  Award,
  Calendar,
  CheckCircle2,
  Send,
  Zap,
} from 'lucide-react';
import GithubIcon from '@/components/portfolio/icons/GithubIcon';
import BackgroundSwitcher from '@/components/portfolio/BackgroundSwitcher';
import type { Profile, Project, Skill, Education, Certification, SocialLink } from '@/types/database.types';

interface DeveloperProThemeProps {
  profile: Profile;
  isPrivatePreview?: boolean;
}

export default function DeveloperProTheme({
  profile,
  isPrivatePreview = false,
}: DeveloperProThemeProps) {
  const prefersReduced = useReducedMotion();
  const speed = profile.animation_speed || 'normal';
  const duration = prefersReduced ? 0 : speed === 'slow' ? 1.2 : speed === 'fast' ? 0.3 : 0.6;
  const staggerDelay = prefersReduced ? 0 : speed === 'slow' ? 0.12 : speed === 'fast' ? 0.03 : 0.06;

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [terminalHistory, setTerminalHistory] = useState<Array<{ cmd: string; output: string }>>([
    {
      cmd: 'antigravity --status',
      output: 'Persona Flow Runtime Ready. Active theme: Developer Pro.',
    },
    {
      cmd: 'tech --stack',
      output: 'Next.js 16, Supabase, TypeScript, Tailwind CSS, Framer Motion',
    },
  ]);

  const projects = profile.projects || [];
  const skills = profile.skills || [];
  const education = profile.education || [];
  const certifications = profile.certifications || [];
  const socialLinks = profile.social_links || [];
  const experiences = profile.experiences || [];

  const categories = ['All', ...Array.from(new Set(skills.map((s) => s.category || 'General')))];

  const filteredSkills =
    activeCategory === 'All'
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    let output = '';
    if (cmd === 'help') {
      output = 'Available commands: about, skills, projects, education, contact, clear';
    } else if (cmd === 'about') {
      output = `${profile.full_name}: ${profile.bio || profile.professional_title}`;
    } else if (cmd === 'skills') {
      output = skills.map((s) => s.skill_name).join(', ') || 'No skills listed';
    } else if (cmd === 'projects') {
      output = projects.map((p) => p.title).join(' | ') || 'No projects listed';
    } else if (cmd === 'education') {
      output = education.map((e) => `${e.degree} at ${e.institution}`).join('; ') || 'No education listed';
    } else if (cmd === 'contact') {
      output = `Email: ${socialLinks.find((s) => s.platform.toLowerCase() === 'email')?.url || 'Contact through links'}`;
    } else if (cmd === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else {
      output = `Command not recognized: "${cmd}". Type "help" for available commands.`;
    }

    setTerminalHistory((prev) => [...prev, { cmd: terminalInput, output }]);
    setTerminalInput('');
  };

  return (
    <div
      className="min-h-screen bg-[#ffffff] text-[#0f1419] font-sans selection:bg-[#1da1f2]/20 relative"
      style={{ fontFamily: profile.custom_font || 'inherit' }}
    >
      {/* Background Atmosphere */}
      <BackgroundSwitcher
        effect={(profile.background_effect as any) || 'cyber-grid'}
        themeColor={profile.theme_color || '#1da1f2'}
      />

      {isPrivatePreview && (
        <div className="bg-[#1da1f2] text-white py-2 px-4 text-center text-xs font-semibold relative z-20">
          ⚡ Private Preview Mode — Developer Pro Theme Engine • Text Speed: {speed.toUpperCase()} ({duration}s)
        </div>
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-20 space-y-20">
        {/* ============================================================
            HERO DEVELOPER SECTION
            ============================================================ */}
        <motion.section
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
          className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#ebf3f3]/90 via-[#ffffff]/90 to-[#d8e7f0]/60 border border-[#d8e7f0] shadow-sm backdrop-blur-xs"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <motion.div
              whileHover={prefersReduced ? undefined : { scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="relative shrink-0"
            >
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl overflow-hidden border-2 border-[#1da1f2] bg-slate-900 flex items-center justify-center text-white text-3xl font-mono shadow-md">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Terminal size={40} className="text-[#1da1f2]" />
                )}
              </div>
              <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-[#10b981] text-white text-[10px] font-mono font-bold uppercase shadow-xs">
                online
              </span>
            </motion.div>

            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-3 py-1 rounded-full bg-[#0f1419] text-[#1da1f2] text-xs font-mono font-semibold border border-slate-700 flex items-center gap-1.5">
                  <Terminal size={13} /> Developer Pro Stack
                </span>
                {profile.career_stage && (
                  <span className="px-3 py-1 rounded-full bg-white text-[#536471] text-xs font-semibold capitalize border border-[#d8e7f0]">
                    {profile.career_stage.replace('-', ' ')}
                  </span>
                )}
              </div>

              {/* Animated Headline Reveal */}
              <motion.h1
                initial={prefersReduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl md:text-5xl font-extrabold text-[#0f1419] tracking-tight font-mono"
              >
                {profile.full_name}
              </motion.h1>

              <motion.p
                initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration, delay: staggerDelay, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg font-semibold"
                style={{ color: profile.theme_color || '#137cc2' }}
              >
                {profile.headline || profile.professional_title || 'Full-Stack Developer & Engineer'}
              </motion.p>

              {profile.bio && (
                <motion.p
                  initial={prefersReduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration, delay: staggerDelay * 1.5 }}
                  className="text-sm text-[#536471] leading-relaxed max-w-2xl"
                >
                  {profile.bio}
                </motion.p>
              )}

              {/* Meta Location & Contact */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-[#536471]">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-[#1da1f2]" /> {profile.location}
                  </span>
                )}
                {profile.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={13} className="text-[#1da1f2]" /> {profile.phone}
                  </span>
                )}
                {profile.resume_url && (
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#137cc2] font-semibold hover:underline"
                  >
                    <FileText size={13} /> Download Resume PDF
                  </a>
                )}
              </div>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
                  {socialLinks.map((s) => (
                    <motion.a
                      key={s.id || s.platform}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={prefersReduced ? undefined : { y: -2 }}
                      className="px-3.5 py-1.5 rounded-xl border border-[#d8e7f0] bg-white text-xs font-mono font-medium text-[#0f1419] hover:bg-[#E3ECF6] hover:text-[#137cc2] transition-colors flex items-center gap-1.5"
                    >
                      <ExternalLink size={12} /> {s.platform}
                    </motion.a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* ============================================================
            INTERACTIVE CLI TERMINAL SHELL
            ============================================================ */}
        <motion.section
          initial={prefersReduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl border border-slate-800 bg-[#0f172a] text-slate-200 overflow-hidden shadow-xl"
        >
          <div className="h-10 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
              <div className="w-3 h-3 rounded-full bg-[#eab308]" />
              <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
              <span className="text-xs font-mono text-slate-400 ml-2">
                developer-shell ~ {profile.slug || 'personaflow'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">interactive shell</span>
          </div>

          <div className="p-6 font-mono text-xs space-y-4 max-h-80 overflow-y-auto">
            <p className="text-slate-400">
              Type <strong className="text-[#38bdf8]">&quot;help&quot;</strong> to inspect candidate credentials via console.
            </p>

            {terminalHistory.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-[#10b981]">&gt;</span>
                  <span>{item.cmd}</span>
                </div>
                <div className="text-slate-200 pl-4 border-l border-slate-800">{item.output}</div>
              </div>
            ))}

            <form onSubmit={handleCommand} className="flex items-center gap-2 pt-2">
              <span className="text-[#10b981] font-bold">&gt;</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Type command (e.g. skills, projects)..."
                className="flex-1 bg-transparent border-none outline-hidden text-slate-100 placeholder:text-slate-600 text-xs font-mono"
              />
              <button
                type="submit"
                className="px-3 py-1 rounded bg-[#1da1f2]/20 text-[#1da1f2] hover:bg-[#1da1f2]/30 text-xs flex items-center gap-1 font-mono transition-colors"
              >
                <Send size={12} /> Exec
              </button>
            </form>
          </div>
        </motion.section>

        {/* ============================================================
            SKILLS GRID WITH CATEGORY FILTER
            ============================================================ */}
        {skills.length > 0 && (
          <motion.section
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#e1e8ed] gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#ebf3f3] text-[#137cc2] flex items-center justify-center">
                  <Zap size={16} />
                </div>
                <h2 className="text-2xl font-bold text-[#0f1419]">Technical Stack</h2>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-[#0f1419] text-white font-bold'
                        : 'bg-[#f1f5f9] text-[#536471] hover:bg-[#e2e8f0]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredSkills.map((s, idx) => (
                <motion.div
                  key={s.id || idx}
                  whileHover={prefersReduced ? undefined : { y: -3, scale: 1.02 }}
                  transition={{ duration: 0.15 }}
                  className="p-3.5 rounded-xl bg-white border border-[#d8e7f0] hover:border-[#1da1f2] transition-colors shadow-2xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-mono font-bold text-[#0f1419]">{s.skill_name}</strong>
                    <CheckCircle2 size={13} className="text-[#10b981]" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#536471] font-mono">
                    <span>{s.category || 'General'}</span>
                    <span>{s.proficiency || 'Proficient'}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ============================================================
            PROJECTS MATRIX
            ============================================================ */}
        {projects.length > 0 && (
          <motion.section
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#e1e8ed]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#ebf3f3] text-[#137cc2] flex items-center justify-center">
                  <Code2 size={16} />
                </div>
                <h2 className="text-2xl font-bold text-[#0f1419]">Featured Projects</h2>
              </div>
              <span className="text-xs font-mono text-[#536471]">{projects.length} repos</span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((p, idx) => (
                <motion.div
                  key={p.id || idx}
                  whileHover={prefersReduced ? undefined : { y: -4, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 rounded-2xl bg-white border border-[#d8e7f0] hover:border-[#1da1f2]/50 transition-all shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="text-base font-bold text-[#0f1419] font-mono">{p.title}</h3>
                      {p.featured && (
                        <span className="px-2 py-0.5 rounded bg-[#10b981]/10 text-[#10b981] text-[10px] font-mono font-bold uppercase">
                          featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#536471] leading-relaxed">{p.description}</p>
                    {Array.isArray(p.tech_stack) && p.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {p.tech_stack.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded bg-[#f1f5f9] text-[#0f1419] text-[10px] font-mono border border-[#e2e8f0]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f1f5f9]">
                    {p.github_url && (
                      <a
                        href={p.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono font-semibold text-[#536471] hover:text-[#0f1419] flex items-center gap-1 transition-colors"
                      >
                        <GithubIcon className="w-3.5 h-3.5" /> Source
                      </a>
                    )}
                    {p.live_url && (
                      <a
                        href={p.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#0f1419] text-white text-xs font-mono font-bold hover:bg-[#1f2937] flex items-center gap-1 transition-colors"
                      >
                        Launch <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ============================================================
            WORK EXPERIENCE
            ============================================================ */}
        {experiences.length > 0 && (
          <motion.section
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 pb-4 border-b border-[#e1e8ed]">
              <div className="w-8 h-8 rounded-xl bg-[#ebf3f3] text-[#137cc2] flex items-center justify-center">
                <Layers size={16} />
              </div>
              <h2 className="text-2xl font-bold text-[#0f1419]">Experience &amp; Internships</h2>
            </div>

            <div className="space-y-4">
              {experiences.map((exp, idx) => (
                <motion.div
                  key={idx}
                  whileHover={prefersReduced ? undefined : { y: -2 }}
                  className="p-6 rounded-2xl bg-white border border-[#d8e7f0] shadow-2xs space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-base font-bold text-[#0f1419] font-mono">{exp.role}</h3>
                    <span className="text-xs font-mono text-[#536471]">{exp.duration}</span>
                  </div>
                  <p className="text-xs font-semibold text-[#137cc2]">{exp.company}</p>
                  {Array.isArray(exp.bullet_points) && exp.bullet_points.length > 0 && (
                    <ul className="list-disc list-inside text-xs text-[#536471] space-y-1 pt-2">
                      {exp.bullet_points.map((pt, pIdx) => (
                        <li key={pIdx}>{pt}</li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ============================================================
            ACADEMICS & CERTIFICATIONS SPLIT
            ============================================================ */}
        {(education.length > 0 || certifications.length > 0) && (
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Education */}
            {education.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0f1419] flex items-center gap-2">
                  <GraduationCap size={18} className="text-[#137cc2]" /> Education
                </h3>
                <div className="space-y-3">
                  {education.map((edu, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white border border-[#d8e7f0] text-xs">
                      <h4 className="font-bold text-[#0f1419]">{edu.institution}</h4>
                      <p className="text-[#137cc2] font-semibold">{edu.degree}</p>
                      <div className="flex items-center justify-between text-[#536471] mt-2">
                        <span>CGPA: {edu.grade || 'N/A'}</span>
                        <span>{edu.start_year} - {edu.end_year || 'Present'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0f1419] flex items-center gap-2">
                  <Award size={18} className="text-[#137cc2]" /> Certifications
                </h3>
                <div className="space-y-3">
                  {certifications.map((cert, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white border border-[#d8e7f0] text-xs">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-[#0f1419]">{cert.title}</h4>
                          <p className="text-[#536471]">{cert.issuer}</p>
                        </div>
                        {cert.credential_url && (
                          <a
                            href={cert.credential_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#137cc2] hover:underline"
                          >
                            Verify
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        <footer className="pt-8 border-t border-[#e1e8ed] text-center text-xs text-[#536471]">
          <p>
            Powered by <strong className="text-[#0f1419]">Persona Flow</strong> • Developer Pro Theme
          </p>
        </footer>
      </div>
    </div>
  );
}
