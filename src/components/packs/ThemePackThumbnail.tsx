'use client';

import React from 'react';
import {
  GraduationCap,
  Code2,
  Briefcase,
  Terminal,
  Award,
  Sparkles,
  ExternalLink,
  CheckCircle,
  Star,
  Layers,
  Cpu,
} from 'lucide-react';

interface ThemePackThumbnailProps {
  packSlug: string;
  packName: string;
}

export default function ThemePackThumbnail({
  packSlug,
  packName,
}: ThemePackThumbnailProps) {
  return (
    <div className="relative w-full h-52 rounded-2xl overflow-hidden border border-[#d8e7f0] bg-[#ffffff] shadow-sm transition-all duration-300 hover:shadow-md select-none group">
      {/* 1. STUDENT STARTER THEME PREVIEW */}
      {packSlug === 'student-starter' && (
        <div className="h-full flex flex-col justify-between bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]/40 p-3.5">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-2 border-b border-[#cbd5e1]/60">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-[#0284c7]/15 flex items-center justify-center text-[#0284c7]">
                <GraduationCap size={13} />
              </div>
              <span className="text-[11px] font-bold text-[#0f172a]">Academic Portfolio</span>
            </div>
            <span className="text-[9px] font-semibold text-[#0284c7] bg-[#0284c7]/10 px-1.5 py-0.5 rounded-full border border-[#0284c7]/20">
              CGPA 9.2 / 10
            </span>
          </div>

          {/* Student Profile Card */}
          <div className="flex items-center gap-2.5 py-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0284c7] to-[#38bdf8] flex items-center justify-center text-white font-bold text-xs shadow-sm">
              AS
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#0f172a] truncate">Aarav Sharma</span>
                <span className="text-[9px] text-[#64748b]">B.Tech CSE &apos;26</span>
              </div>
              <p className="text-[10px] text-[#64748b] truncate">
                Coursework: DSA, System Design, Web Dev
              </p>
            </div>
          </div>

          {/* Coursework & Project Pill Grid */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <div className="p-2 rounded-lg bg-white border border-[#e2e8f0] shadow-2xs">
              <span className="text-[9px] font-semibold text-[#0284c7] block">Mini Project</span>
              <span className="text-[10px] font-medium text-[#1e293b] truncate block">Campus Club Portal</span>
            </div>
            <div className="p-2 rounded-lg bg-white border border-[#e2e8f0] shadow-2xs">
              <span className="text-[9px] font-semibold text-[#10b981] block">Lab &amp; Hackathon</span>
              <span className="text-[10px] font-medium text-[#1e293b] truncate block">Smart Attendance App</span>
            </div>
          </div>

          {/* Footer Highlights */}
          <div className="flex items-center justify-between text-[9px] text-[#64748b] pt-1.5 border-t border-[#cbd5e1]/40">
            <span>Verified Student Profile</span>
            <span className="text-[#0284c7] font-semibold">Starter Theme</span>
          </div>
        </div>
      )}

      {/* 2. DEVELOPER PRO THEME PREVIEW */}
      {packSlug === 'developer-pro' && (
        <div className="h-full flex flex-col justify-between bg-[#0f172a] p-3.5 text-slate-200">
          {/* Top Bar with Terminal Controls */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-700/80">
            <div className="flex items-center gap-1.5">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
                <div className="w-2 h-2 rounded-full bg-[#eab308]" />
                <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
              </div>
              <span className="text-[10px] font-mono text-slate-400 ml-1">portfolio.dev ~ zsh</span>
            </div>
            <span className="text-[9px] font-mono text-[#38bdf8] bg-[#38bdf8]/15 px-1.5 py-0.5 rounded border border-[#38bdf8]/30">
              Live GitHub API
            </span>
          </div>

          {/* Developer Identity Row */}
          <div className="flex items-center gap-2.5 py-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0284c7] to-[#06b6d4] flex items-center justify-center text-white font-bold text-xs shadow-md">
              <Terminal size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate">Devendra V.</span>
                <span className="text-[9px] text-[#38bdf8] font-mono">Full-Stack Dev</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono truncate">
                $ stack: [Next.js, Supabase, Tailwind, AI]
              </p>
            </div>
          </div>

          {/* Architecture Case Study Mockup */}
          <div className="p-2 rounded-lg bg-slate-800/90 border border-slate-700 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-[#22c55e] flex items-center gap-1">
                <Cpu size={10} /> Cloud Microservice Pipeline
              </span>
              <span className="text-[8px] font-mono text-slate-400">99.98% SLA</span>
            </div>
            <div className="flex gap-1">
              <span className="px-1 py-0.5 rounded bg-slate-900 text-[8px] font-mono text-sky-300">Next.js</span>
              <span className="px-1 py-0.5 rounded bg-slate-900 text-[8px] font-mono text-emerald-300">Supabase</span>
              <span className="px-1 py-0.5 rounded bg-slate-900 text-[8px] font-mono text-amber-300">Docker</span>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 pt-1.5 border-t border-slate-700/80">
            <span className="text-emerald-400">● 1.4k commits</span>
            <span className="text-[#38bdf8]">Developer Pro Theme</span>
          </div>
        </div>
      )}

      {/* 3. PROFESSIONAL ELITE THEME PREVIEW */}
      {packSlug === 'professional-elite' && (
        <div className="h-full flex flex-col justify-between bg-gradient-to-br from-[#ffffff] via-[#f8fafc] to-[#f1f5f9] p-3.5">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-[#0f172a] text-white flex items-center justify-center">
                <Award size={12} className="text-[#f59e0b]" />
              </div>
              <span className="text-[11px] font-bold text-[#0f172a]">Executive Portfolio</span>
            </div>
            <div className="flex items-center gap-1 text-[9px] font-semibold text-[#0f172a] bg-[#f8fafc] px-2 py-0.5 rounded-full border border-[#cbd5e1]">
              <Star size={10} className="fill-[#f59e0b] text-[#f59e0b]" />
              <span>Verified Leadership</span>
            </div>
          </div>

          {/* Executive Profile Card */}
          <div className="flex items-center gap-2.5 py-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1e293b] to-[#0f172a] flex items-center justify-center text-white font-bold text-xs shadow-sm">
              RM
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#0f172a] truncate">Rohan Mehta</span>
                <span className="text-[9px] text-[#0284c7] font-semibold">VP of Engineering</span>
              </div>
              <p className="text-[10px] text-[#64748b] truncate">
                10+ Yrs • Cloud Architecture &amp; Team Leadership
              </p>
            </div>
          </div>

          {/* Executive Metric Highlights */}
          <div className="grid grid-cols-3 gap-1.5 pt-1 text-center">
            <div className="p-1.5 rounded-lg bg-white border border-[#e2e8f0] shadow-2xs">
              <span className="text-[11px] font-black text-[#0f172a] block">10+ Yrs</span>
              <span className="text-[8px] text-[#64748b] block">Experience</span>
            </div>
            <div className="p-1.5 rounded-lg bg-white border border-[#e2e8f0] shadow-2xs">
              <span className="text-[11px] font-black text-[#0284c7] block">$4.2M</span>
              <span className="text-[8px] text-[#64748b] block">Scale Delivered</span>
            </div>
            <div className="p-1.5 rounded-lg bg-white border border-[#e2e8f0] shadow-2xs">
              <span className="text-[11px] font-black text-[#10b981] block">24+</span>
              <span className="text-[8px] text-[#64748b] block">Engineers Led</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-[9px] text-[#64748b] pt-1.5 border-t border-[#e2e8f0]">
            <span>Recruiter &amp; HR Ready</span>
            <span className="text-[#0f172a] font-semibold">Professional Elite</span>
          </div>
        </div>
      )}
    </div>
  );
}
