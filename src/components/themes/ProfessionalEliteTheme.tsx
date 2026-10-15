'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Award,
  Briefcase,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  FileText,
  Star,
  CheckCircle2,
  Calendar,
  Building,
  TrendingUp,
  Users,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import GithubIcon from '@/components/portfolio/icons/GithubIcon';
import BackgroundSwitcher from '@/components/portfolio/BackgroundSwitcher';
import type { Profile, Project, Skill, Education, Certification, SocialLink } from '@/types/database.types';

interface ProfessionalEliteThemeProps {
  profile: Profile;
  isPrivatePreview?: boolean;
}

export default function ProfessionalEliteTheme({
  profile,
  isPrivatePreview = false,
}: ProfessionalEliteThemeProps) {
  const prefersReduced = useReducedMotion();
  const speed = profile.animation_speed || 'normal';
  const duration = prefersReduced ? 0 : speed === 'slow' ? 1.2 : speed === 'fast' ? 0.3 : 0.6;
  const staggerDelay = prefersReduced ? 0 : speed === 'slow' ? 0.12 : speed === 'fast' ? 0.03 : 0.06;

  const projects = profile.projects || [];
  const skills = profile.skills || [];
  const education = profile.education || [];
  const certifications = profile.certifications || [];
  const socialLinks = profile.social_links || [];
  const experiences = profile.experiences || [];
  const testimonials = profile.testimonials || [];

  return (
    <div
      className="min-h-screen bg-[#ffffff] text-[#0f1419] font-sans selection:bg-[#0f1419] selection:text-white relative"
      style={{ fontFamily: profile.custom_font || 'inherit' }}
    >
      {/* Background Atmosphere */}
      <BackgroundSwitcher
        effect={(profile.background_effect as any) || 'none'}
        themeColor={profile.theme_color || '#0f1419'}
      />

      {isPrivatePreview && (
        <div className="bg-[#0f1419] text-white py-2 px-4 text-center text-xs font-semibold relative z-20">
          ⭐ Private Preview Mode — Professional Elite Theme Engine • Text Speed: {speed.toUpperCase()} ({duration}s)
        </div>
      )}

      {/* Main Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-20 space-y-20">
        {/* ============================================================
            EXECUTIVE HERO SECTION
            ============================================================ */}
        <motion.section
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
          className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#ffffff]/95 via-[#f8fafc]/95 to-[#f1f5f9]/90 border border-[#e2e8f0] shadow-sm backdrop-blur-xs"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Executive Avatar */}
            <motion.div
              whileHover={prefersReduced ? undefined : { scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="relative shrink-0"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-2 border-[#0f1419] bg-gradient-to-tr from-[#1e293b] to-[#0f172a] flex items-center justify-center text-white text-4xl font-extrabold shadow-lg">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile.full_name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase() || 'PE'
                )}
              </div>
              <span className="absolute -bottom-2.5 inset-x-0 mx-auto w-max px-3 py-0.5 rounded-full bg-[#0f1419] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                <ShieldCheck size={11} className="text-[#10b981]" /> Verified Lead
              </span>
            </motion.div>

            {/* Executive Bio */}
            <div className="flex-1 text-center md:text-left space-y-3.5">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-3 py-1 rounded-full bg-[#0f1419] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Award size={13} className="text-[#f59e0b]" /> Professional Elite
                </span>
                {profile.career_stage && (
                  <span className="px-3 py-1 rounded-full bg-white text-[#536471] text-xs font-semibold capitalize border border-[#cbd5e1]">
                    {profile.career_stage.replace('-', ' ')}
                  </span>
                )}
              </div>

              {/* Animated Headline Reveal */}
              <motion.h1
                initial={prefersReduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl md:text-5xl font-black text-[#0f1419] tracking-tight"
              >
                {profile.full_name}
              </motion.h1>

              <motion.p
                initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration, delay: staggerDelay, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg font-bold"
                style={{ color: profile.theme_color || '#137cc2' }}
              >
                {profile.headline || profile.professional_title || 'Engineering Leader & Technical Architect'}
              </motion.p>

              {profile.bio && (
                <motion.p
                  initial={prefersReduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration, delay: staggerDelay * 1.5 }}
                  className="text-sm text-[#475569] leading-relaxed max-w-2xl font-normal"
                >
                  {profile.bio}
                </motion.p>
              )}

              {/* Meta details */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-[#536471]">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-[#0f1419]" /> {profile.location}
                  </span>
                )}
                {profile.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={13} className="text-[#0f1419]" /> {profile.phone}
                  </span>
                )}
                {profile.resume_url && (
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#0f1419] font-bold hover:underline"
                  >
                    <FileText size={13} /> Executive Dossier / CV
                  </a>
                )}
              </div>

              {/* Professional Links */}
              {socialLinks.length > 0 && (
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
                  {socialLinks.map((s) => (
                    <motion.a
                      key={s.id || s.platform}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={prefersReduced ? undefined : { y: -2 }}
                      className="px-3.5 py-1.5 rounded-xl border border-[#cbd5e1] bg-white text-xs font-semibold text-[#0f1419] hover:bg-[#0f1419] hover:text-white transition-all duration-200 flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>{s.platform}</span>
                      <ExternalLink size={11} className="opacity-60" />
                    </motion.a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* ============================================================
            EXECUTIVE TRACK RECORD / LEADERSHIP EXPERIENCE
            ============================================================ */}
        {experiences.length > 0 && (
          <motion.section
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0f1419] text-white flex items-center justify-center shadow-xs">
                  <Briefcase size={18} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0f1419]">Executive Experience</h2>
                  <p className="text-xs text-[#64748b]">Track record of engineering execution and delivery</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {experiences.map((exp, idx) => (
                <motion.div
                  key={idx}
                  whileHover={prefersReduced ? undefined : { y: -3 }}
                  className="p-8 rounded-3xl bg-white border border-[#e2e8f0] shadow-xs space-y-4 hover:border-[#cbd5e1] transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#f1f5f9]">
                    <div>
                      <h3 className="text-xl font-bold text-[#0f1419]">{exp.role}</h3>
                      <p className="text-sm font-semibold text-[#137cc2] flex items-center gap-1.5 mt-0.5">
                        <Building size={14} /> {exp.company}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#f8fafc] text-[#475569] font-medium text-xs border border-[#e2e8f0] w-max">
                      {exp.duration}
                    </span>
                  </div>

                  {Array.isArray(exp.bullet_points) && exp.bullet_points.length > 0 && (
                    <ul className="space-y-2 text-xs text-[#475569] leading-relaxed">
                      {exp.bullet_points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5">
                          <ChevronRight size={14} className="text-[#137cc2] shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ============================================================
            CORE PILLARS & ARCHITECTURAL SKILLS
            ============================================================ */}
        {skills.length > 0 && (
          <motion.section
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#e2e8f0]">
              <div className="w-9 h-9 rounded-xl bg-[#0f1419] text-white flex items-center justify-center shadow-xs">
                <Star size={18} className="text-[#f59e0b]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0f1419]">Technical Competencies &amp; Governance</h2>
                <p className="text-xs text-[#64748b]">Core competencies and technical breadth</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {skills.map((s, idx) => (
                <motion.div
                  key={s.id || idx}
                  whileHover={prefersReduced ? undefined : { y: -3, scale: 1.02 }}
                  transition={{ duration: 0.15 }}
                  className="p-4 rounded-2xl bg-white border border-[#e2e8f0] hover:border-[#0f1419] transition-colors shadow-2xs space-y-1.5"
                >
                  <strong className="text-xs font-bold text-[#0f1419] block">{s.skill_name}</strong>
                  <div className="flex items-center justify-between text-[11px] text-[#64748b]">
                    <span>{s.category || 'Architecture'}</span>
                    <span className="font-semibold text-[#137cc2]">{s.proficiency || 'Expert'}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ============================================================
            STRATEGIC INITIATIVES & HIGH-VALUE PROJECTS
            ============================================================ */}
        {projects.length > 0 && (
          <motion.section
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0f1419] text-white flex items-center justify-center shadow-xs">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0f1419]">Strategic Projects &amp; Deliverables</h2>
                  <p className="text-xs text-[#64748b]">High-impact system builds and technical initiatives</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((p, idx) => (
                <motion.div
                  key={p.id || idx}
                  whileHover={prefersReduced ? undefined : { y: -4, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="p-7 rounded-3xl bg-white border border-[#e2e8f0] hover:border-[#0f1419]/40 transition-all shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-bold text-[#0f1419]">{p.title}</h3>
                      {p.featured && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#0f1419] text-white text-[10px] font-bold uppercase tracking-wider">
                          Key Deliverable
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#64748b] leading-relaxed">{p.description}</p>
                    {Array.isArray(p.tech_stack) && p.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {p.tech_stack.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-1 rounded-lg bg-[#f8fafc] text-[#334155] text-[10px] font-mono border border-[#e2e8f0]"
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
                        className="text-xs font-semibold text-[#64748b] hover:text-[#0f1419] flex items-center gap-1 transition-colors"
                      >
                        <GithubIcon className="w-3.5 h-3.5" /> Source
                      </a>
                    )}
                    {p.live_url && (
                      <a
                        href={p.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-[#0f1419] hover:bg-[#1f2937] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        Executive Case Study <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ============================================================
            ACADEMICS & CREDENTIALS
            ============================================================ */}
        <div className="grid md:grid-cols-2 gap-8">
          {education.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#0f1419] pb-3 border-b border-[#e2e8f0]">
                Academic Pedigree
              </h3>
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white border border-[#e2e8f0] text-xs">
                    <h4 className="font-bold text-[#0f1419]">{edu.degree}</h4>
                    <p className="text-[#137cc2] font-semibold">{edu.institution}</p>
                    <div className="flex items-center justify-between text-[#64748b] mt-2">
                      <span>{edu.start_year} - {edu.end_year || 'Present'}</span>
                      {edu.grade && <span>Honors: {edu.grade}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#0f1419] pb-3 border-b border-[#e2e8f0]">
                Board &amp; Industry Certifications
              </h3>
              <div className="space-y-2.5">
                {certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white border border-[#e2e8f0] flex items-center justify-between text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-[#0f1419]">{cert.title}</h4>
                      <p className="text-[#64748b]">{cert.issuer}</p>
                    </div>
                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#137cc2] font-semibold hover:underline"
                      >
                        Verify
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================
            FOOTER
            ============================================================ */}
        <footer className="pt-8 border-t border-[#e2e8f0] text-center text-xs text-[#64748b]">
          <p>
            Powered by <strong className="text-[#0f1419]">Persona Flow</strong> • Professional Elite Theme
          </p>
        </footer>
      </div>
    </div>
  );
}
