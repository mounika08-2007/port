'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  Code2,
  Award,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  FileText,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import GithubIcon from '@/components/portfolio/icons/GithubIcon';
import BackgroundSwitcher from '@/components/portfolio/BackgroundSwitcher';
import type { Profile, Education, Certification, Project, Skill, SocialLink } from '@/types/database.types';

interface StudentStarterThemeProps {
  profile: Profile;
  isPrivatePreview?: boolean;
}

export default function StudentStarterTheme({
  profile,
  isPrivatePreview = false,
}: StudentStarterThemeProps) {
  const prefersReduced = useReducedMotion();
  const speed = profile.animation_speed || 'normal';
  const duration = prefersReduced ? 0 : speed === 'slow' ? 1.2 : speed === 'fast' ? 0.3 : 0.6;
  const staggerDelay = prefersReduced ? 0 : speed === 'slow' ? 0.12 : speed === 'fast' ? 0.03 : 0.06;

  const educationList = profile.education || [];
  const projectsList = profile.projects || [];
  const skillsList = profile.skills || [];
  const certsList = profile.certifications || [];
  const socialList = profile.social_links || [];

  // Categorize skills
  const skillsByCategory = skillsList.reduce((acc, s) => {
    const cat = s.category || 'Core Skills';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div
      className="min-h-screen bg-[#ffffff] text-[#0f1419] font-sans selection:bg-[#137cc2]/15 relative"
      style={{ fontFamily: profile.custom_font || 'inherit' }}
    >
      {/* Background Atmosphere */}
      <BackgroundSwitcher
        effect={(profile.background_effect as any) || 'mesh-gradient'}
        themeColor={profile.theme_color || '#137cc2'}
      />

      {/* Top Banner if in preview mode */}
      {isPrivatePreview && (
        <div className="bg-[#137cc2] text-white py-2 px-4 text-center text-xs font-semibold relative z-20">
          👀 Private Preview Mode — Student Starter Theme Engine • Text Speed: {speed.toUpperCase()} ({duration}s)
        </div>
      )}

      {/* Main Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-16 space-y-16">
        {/* ============================================================
            HERO / PROFILE HEADER
            ============================================================ */}
        <motion.section
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
          className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-[#f8fafc]/90 via-[#ffffff]/90 to-[#E3ECF6]/50 border border-[#d8e7f0] shadow-xs backdrop-blur-xs"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <motion.div
              whileHover={prefersReduced ? undefined : { scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="relative shrink-0"
            >
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl overflow-hidden border-2 border-[#137cc2]/30 bg-gradient-to-tr from-[#137cc2] to-[#38bdf8] flex items-center justify-center text-white text-3xl font-black shadow-md">
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
                    .toUpperCase() || 'PF'
                )}
              </div>
            </motion.div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <span className="px-3 py-1 rounded-full bg-[#E3ECF6] text-[#137cc2] text-xs font-bold uppercase tracking-wider border border-[#d8e7f0] flex items-center gap-1.5">
                  <GraduationCap size={14} /> Student Starter Portfolio
                </span>
                {profile.career_stage && (
                  <span className="px-3 py-1 rounded-full bg-[#f1f5f9] text-[#536471] text-xs font-semibold capitalize border border-[#e2e8f0]">
                    {profile.career_stage.replace('-', ' ')}
                  </span>
                )}
              </div>

              {/* Animated Headline Reveal */}
              <motion.h1
                initial={prefersReduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl md:text-4xl font-extrabold text-[#0f1419] tracking-tight"
              >
                {profile.full_name}
              </motion.h1>

              <motion.p
                initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration, delay: staggerDelay, ease: [0.16, 1, 0.3, 1] }}
                className="text-base font-semibold"
                style={{ color: profile.theme_color || '#137cc2' }}
              >
                {profile.headline || profile.professional_title || 'Aspiring Software Engineer'}
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

              {/* Meta details */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-[#536471]">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-[#137cc2]" /> {profile.location}
                  </span>
                )}
                {profile.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={13} className="text-[#137cc2]" /> {profile.phone}
                  </span>
                )}
                {profile.resume_url && (
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#137cc2] font-semibold hover:underline"
                  >
                    <FileText size={13} /> View Resume PDF
                  </a>
                )}
              </div>

              {/* Social Links */}
              {socialList.length > 0 && (
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-3">
                  {socialList.map((social) => (
                    <motion.a
                      key={social.id || social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={prefersReduced ? undefined : { y: -2 }}
                      className="px-3 py-1.5 rounded-xl border border-[#d8e7f0] bg-white hover:bg-[#f1f5f9] text-xs font-semibold text-[#0f1419] inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      {social.platform.toLowerCase().includes('github') && (
                        <GithubIcon className="w-3.5 h-3.5" />
                      )}
                      {social.platform.toLowerCase().includes('email') && <Mail size={13} />}
                      <span>{social.platform}</span>
                      <ExternalLink size={11} className="text-[#94a3b8]" />
                    </motion.a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* ============================================================
            SKILLS & PROFICIENCY
            ============================================================ */}
        {skillsList.length > 0 && (
          <motion.section
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#e1e8ed]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E3ECF6] text-[#137cc2] flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <h2 className="text-2xl font-bold text-[#0f1419]">Technical Skills</h2>
              </div>
              <span className="text-xs text-[#536471] font-medium">
                {skillsList.length} competencies
              </span>
            </div>

            <div className="space-y-4">
              {Object.entries(skillsByCategory).map(([category, items], catIdx) => (
                <div
                  key={catIdx}
                  className="p-6 rounded-2xl bg-white border border-[#d8e7f0] shadow-2xs space-y-3"
                >
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#536471]">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill, idx) => (
                      <motion.div
                        key={skill.id || idx}
                        whileHover={prefersReduced ? undefined : { scale: 1.05 }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#f8fafc] hover:bg-[#E3ECF6]/60 border border-[#e2e8f0] text-xs font-semibold text-[#0f1419] flex items-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 size={13} className="text-[#10b981]" />
                        <span>{skill.skill_name}</span>
                        {skill.proficiency && (
                          <span className="text-[10px] text-[#536471] font-mono">
                            • {skill.proficiency}
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ============================================================
            PROJECTS SHOWCASE
            ============================================================ */}
        {projectsList.length > 0 && (
          <motion.section
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#e1e8ed]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E3ECF6] text-[#137cc2] flex items-center justify-center">
                  <Code2 size={16} />
                </div>
                <h2 className="text-2xl font-bold text-[#0f1419]">Featured Projects</h2>
              </div>
              <span className="text-xs text-[#536471] font-medium">
                {projectsList.length} projects built
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {projectsList.map((project, idx) => (
                <motion.div
                  key={project.id || idx}
                  whileHover={prefersReduced ? undefined : { y: -4, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-3xl bg-white border border-[#d8e7f0] hover:border-[#137cc2]/40 transition-all duration-200 overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  {project.image_url && (
                    <div className="w-full h-44 bg-[#f1f5f9] overflow-hidden border-b border-[#e2e8f0]">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6 space-y-3 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold text-[#0f1419]">{project.title}</h3>
                      {project.featured && (
                        <span className="px-2 py-0.5 rounded-full bg-[#137cc2]/10 text-[#137cc2] text-[10px] font-bold uppercase">
                          Featured
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#536471] leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tech stack pills */}
                    {Array.isArray(project.tech_stack) && project.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.tech_stack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md bg-[#f1f5f9] text-[#475569] text-[11px] font-mono font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions footer */}
                  <div className="p-4 bg-[#f8fafc] border-t border-[#e2e8f0] flex items-center justify-end gap-3">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-[#536471] hover:text-[#0f1419] inline-flex items-center gap-1 transition-colors"
                      >
                        <GithubIcon className="w-3.5 h-3.5" /> Code
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-[#137cc2] hover:bg-[#0f66a0] text-white text-xs font-bold inline-flex items-center gap-1 transition-colors shadow-2xs"
                      >
                        Demo <ArrowUpRight size={13} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ============================================================
            ACADEMICS & EDUCATION
            ============================================================ */}
        {educationList.length > 0 && (
          <motion.section
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#e1e8ed]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E3ECF6] text-[#137cc2] flex items-center justify-center">
                  <BookOpen size={16} />
                </div>
                <h2 className="text-2xl font-bold text-[#0f1419]">Education &amp; Academics</h2>
              </div>
            </div>

            <div className="space-y-4">
              {educationList.map((edu, idx) => (
                <motion.div
                  key={edu.id || idx}
                  whileHover={prefersReduced ? undefined : { y: -2 }}
                  className="p-6 rounded-2xl bg-white border border-[#d8e7f0] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#0f1419]">{edu.degree}</h3>
                    <p className="text-xs text-[#137cc2] font-semibold">{edu.institution}</p>
                    {edu.field_of_study && (
                      <p className="text-xs text-[#536471]">Field: {edu.field_of_study}</p>
                    )}
                  </div>

                  <div className="flex md:flex-col items-start md:items-end justify-between gap-1 text-xs text-[#536471] shrink-0">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar size={12} /> {edu.start_year} — {edu.end_year || 'Present'}
                    </span>
                    {edu.grade && (
                      <span className="px-2 py-0.5 rounded bg-[#f1f5f9] text-[#0f1419] font-bold text-[11px]">
                        Grade / GPA: {edu.grade}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ============================================================
            CERTIFICATIONS & HONORS
            ============================================================ */}
        {certsList.length > 0 && (
          <motion.section
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#e1e8ed]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E3ECF6] text-[#137cc2] flex items-center justify-center">
                  <Award size={16} />
                </div>
                <h2 className="text-2xl font-bold text-[#0f1419]">Certifications &amp; Honors</h2>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {certsList.map((cert, idx) => (
                <motion.div
                  key={cert.id || idx}
                  whileHover={prefersReduced ? undefined : { y: -2 }}
                  className="p-5 rounded-2xl bg-white border border-[#d8e7f0] shadow-2xs flex items-start justify-between gap-3"
                >
                  <div>
                    <h3 className="text-sm font-bold text-[#0f1419]">{cert.title}</h3>
                    <p className="text-xs text-[#137cc2] font-medium">{cert.issuer}</p>
                    {cert.issue_date && (
                      <span className="text-[10px] text-[#536471] block mt-1">
                        Issued: {cert.issue_date}
                      </span>
                    )}
                  </div>
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-[#f1f5f9] text-[#137cc2] hover:bg-[#E3ECF6] transition-colors shrink-0"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ============================================================
            FOOTER
            ============================================================ */}
        <footer className="pt-8 border-t border-[#e1e8ed] text-center text-xs text-[#536471]">
          <p>
            Powered by <strong className="text-[#0f1419]">Persona Flow</strong> • Student Starter Theme
          </p>
        </footer>
      </div>
    </div>
  );
}
