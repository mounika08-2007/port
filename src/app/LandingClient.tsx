'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Layers,
  Palette,
  Rocket,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  GraduationCap,
  Briefcase,
  FileText,
  Globe,
  Share2,
  Check,
  ShieldCheck,
} from 'lucide-react';

export default function LandingClient() {
  return (
    <div className="relative min-h-screen bg-[#ffffff] text-[#0f1419] overflow-hidden selection:bg-[#137cc2]/15">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-[12%] right-[-8%] w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(19, 124, 194, 0.08) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-[40%] left-[-10%] w-[550px] h-[550px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.06) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(30, 157, 241, 0.05) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* ============================================================
            A. NAVIGATION BAR
            Left: Persona Flow logo & wordmark
            Right: Only Login & Sign Up action buttons
            ============================================================ */}
        <header className="w-full border-b border-[#e1e8ed]/80 bg-white/90 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Logo and Wordmark */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#137cc2] to-[#1e9df1] flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
                <Layers size={22} className="stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-[#0f1419] group-hover:text-[#137cc2] transition-colors">
                  Persona Flow
                </span>
                <span className="text-[10px] font-medium text-[#536471] -mt-1 tracking-wider uppercase">
                  Portfolio Platform
                </span>
              </div>
            </Link>

            {/* Right Side: Strictly Login & Sign Up buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/admin/login"
                className="px-5 py-2.5 rounded-xl border border-[#d8e7f0] text-sm font-semibold text-[#0f1419] hover:bg-[#f7f8f8] hover:border-[#acb8be] transition-all duration-200"
              >
                Login
              </Link>
              <Link
                href="/admin/signup"
                className="px-5 py-2.5 rounded-xl bg-[#137cc2] hover:bg-[#0f66a0] text-white text-sm font-semibold shadow-sm hover:shadow transition-all duration-200"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </header>

        {/* ============================================================
            B. HERO SECTION
            Compelling headline, supporting description, CTA to start,
            and generic product dashboard illustration (NO team members).
            ============================================================ */}
        <section className="pt-16 pb-20 md:pt-24 md:pb-28 px-6 max-w-7xl mx-auto w-full">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E3ECF6] border border-[#d8e7f0] text-xs font-semibold text-[#137cc2] mb-6"
            >
              <Sparkles size={14} className="text-[#137cc2]" />
              Production Portfolio-as-a-Service Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0f1419] leading-[1.12] mb-6"
            >
              Your Career.{' '}
              <span className="text-[#137cc2]">Your Identity.</span>{' '}
              <br className="hidden sm:inline" />
              Your Portfolio.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-[#536471] leading-relaxed max-w-2xl mx-auto mb-8 font-normal"
            >
              Create a professional portfolio that grows with your career. Persona Flow transforms
              your skills, education, projects and achievements into a personalized digital portfolio
              — without writing a single line of code.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3.5"
            >
              <Link
                href="/admin/signup"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#137cc2] hover:bg-[#0f66a0] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 inline-flex items-center justify-center gap-2"
              >
                <span>Get Started with Persona Flow</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/packs"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-[#d8e7f0] bg-white hover:bg-[#f7f8f8] text-[#0f1419] font-semibold text-sm transition-all duration-200 inline-flex items-center justify-center gap-2"
              >
                <span>Explore Portfolio Theme Packs</span>
              </Link>
            </motion.div>
          </div>

          {/* Abstract Product Illustration / Generic Portfolio Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative max-w-5xl mx-auto"
          >
            {/* Outer Browser/App Window Frame */}
            <div className="rounded-3xl border border-[#d8e7f0] bg-white shadow-2xl overflow-hidden ring-1 ring-black/[0.03]">
              {/* Browser Window Title Bar */}
              <div className="h-11 px-4 bg-[#f7f8f8] border-b border-[#e1e8ed] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ef4444]/80" />
                  <div className="w-3 h-3 rounded-full bg-[#f59e0b]/80" />
                  <div className="w-3 h-3 rounded-full bg-[#10b981]/80" />
                </div>
                <div className="px-4 py-1 rounded-md bg-white border border-[#e1e8ed] text-[11px] font-mono text-[#536471] flex items-center gap-1.5 shadow-2xs">
                  <Globe size={11} className="text-[#137cc2]" />
                  <span>personaflow.io/portfolio/alex-morgan</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded-full border border-[#10b981]/20">
                  <CheckCircle2 size={11} /> Published Live
                </div>
              </div>

              {/* Inside Generic Portfolio Dashboard Simulation */}
              <div className="p-6 md:p-8 bg-gradient-to-b from-[#ffffff] to-[#f8fafc]">
                {/* Header Profile Bar */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-[#e2e8f0] gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#137cc2] to-[#38bdf8] flex items-center justify-center text-white font-black text-xl shadow-md">
                      AM
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-[#0f1419]">Alex Morgan</h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#E3ECF6] text-[#137cc2] text-xs font-semibold border border-[#d8e7f0]">
                          Final Year Student &amp; Aspiring Engineer
                        </span>
                      </div>
                      <p className="text-sm text-[#536471] mt-0.5">
                        Building full-stack cloud applications &amp; data-intensive systems
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end md:self-auto">
                    <span className="px-3 py-1.5 rounded-xl border border-[#d8e7f0] bg-white text-xs font-medium text-[#536471] shadow-2xs">
                      12 Projects Completed
                    </span>
                    <span className="px-3.5 py-1.5 rounded-xl bg-[#137cc2] text-white text-xs font-semibold shadow-xs">
                      Resume PDF
                    </span>
                  </div>
                </div>

                {/* Dashboard Grid Simulation */}
                <div className="grid md:grid-cols-12 gap-6 pt-6">
                  {/* Left Column: Education & Skills */}
                  <div className="md:col-span-5 space-y-4">
                    {/* Education Card */}
                    <div className="p-5 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0f1419] flex items-center gap-1.5">
                          <GraduationCap size={15} className="text-[#137cc2]" /> Academic Credentials
                        </span>
                        <span className="text-[10px] font-semibold text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded-md">
                          CGPA: 9.4 / 10
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#0f1419]">
                          B.Tech in Computer Science &amp; Engineering
                        </h4>
                        <p className="text-[11px] text-[#536471]">
                          National Institute of Technology • 2022 - 2026
                        </p>
                      </div>
                      <div className="text-[11px] text-[#536471] bg-[#f8fafc] p-2.5 rounded-xl border border-[#e2e8f0]/80">
                        Honors: Dean&apos;s Academic Merit List, President of Coding Society
                      </div>
                    </div>

                    {/* Technical Competencies Card */}
                    <div className="p-5 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs space-y-2.5">
                      <span className="text-xs font-bold text-[#0f1419] block">
                        Verified Skills &amp; Stack
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {['TypeScript', 'Next.js', 'React', 'Python', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'REST APIs'].map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-lg bg-[#E3ECF6] text-[#137cc2] text-[11px] font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Case Studies & Structured Projects */}
                  <div className="md:col-span-7 space-y-4">
                    <div className="p-5 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0f1419] flex items-center gap-1.5">
                          <Briefcase size={15} className="text-[#137cc2]" /> Featured Project Case Study
                        </span>
                        <span className="text-[10px] font-mono text-[#137cc2] bg-[#E3ECF6] px-2 py-0.5 rounded-md">
                          Live Demo + GitHub
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-[#0f1419]">
                          Distributed Event Streaming &amp; Analytics Platform
                        </h3>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="p-2.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                            <span className="text-[10px] font-bold text-[#0f1419] block mb-0.5">Problem</span>
                            <p className="text-[11px] text-[#536471] leading-tight">
                              Legacy batch processing delayed user telemetry by 45 minutes.
                            </p>
                          </div>
                          <div className="p-2.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                            <span className="text-[10px] font-bold text-[#10b981] block mb-0.5">Solution</span>
                            <p className="text-[11px] text-[#536471] leading-tight">
                              Engineered real-time pipelines processing 10k events/sec under 100ms.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#f1f5f9] flex items-center justify-between text-[11px] text-[#536471]">
                        <span>Stack: Next.js, Supabase, Tailwind, TypeScript</span>
                        <span className="text-[#137cc2] font-semibold flex items-center gap-1">
                          View Full Case Study <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>

                    {/* Achievements & Certifications Pill */}
                    <div className="p-4 rounded-2xl bg-[#E3ECF6]/60 border border-[#d8e7f0] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-[#10b981]" />
                        <span className="font-semibold text-[#0f1419]">
                          3 Verified Industry Certifications Added
                        </span>
                      </div>
                      <span className="text-[#137cc2] font-semibold">View Credentials</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ============================================================
            C. PRODUCT VALUE SECTION
            Three clean feature cards:
            1. Career-Stage-Based Portfolios
            2. Professional Themes
            3. Simple Portfolio Generation
            ============================================================ */}
        <section className="py-20 md:py-24 bg-[#f7f8f8] border-y border-[#e1e8ed]/80 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#137cc2] block mb-2">
                Platform Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f1419] tracking-tight">
                Designed for Every Step of Your Journey
              </h2>
              <p className="text-[#536471] text-base mt-3">
                Persona Flow delivers tailored portfolio experiences adapted to your unique academic
                and professional milestones.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature Card 1 */}
              <div className="p-8 rounded-3xl bg-white border border-[#d8e7f0] shadow-sm hover:border-[#137cc2]/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#E3ECF6] text-[#137cc2] flex items-center justify-center mb-6 shadow-xs">
                    <GraduationCap size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-[#0f1419] mb-3">
                    Career-Stage-Based Portfolios
                  </h3>
                  <p className="text-sm text-[#536471] leading-relaxed">
                    Personalized portfolio structures for first-year through fourth-year students,
                    job seekers, experienced professionals and HR/recruitment professionals.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#f1f5f9] flex items-center text-xs font-semibold text-[#137cc2]">
                  <span>7 tailored career stages</span>
                </div>
              </div>

              {/* Feature Card 2 */}
              <div className="p-8 rounded-3xl bg-white border border-[#d8e7f0] shadow-sm hover:border-[#137cc2]/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#E3ECF6] text-[#137cc2] flex items-center justify-center mb-6 shadow-xs">
                    <Palette size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-[#0f1419] mb-3">
                    Professional Themes
                  </h3>
                  <p className="text-sm text-[#536471] leading-relaxed">
                    Choose from professionally designed portfolio theme packs tailored to different
                    career goals, from academic foundations to full developer interactive suites.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#f1f5f9] flex items-center text-xs font-semibold text-[#137cc2]">
                  <span>Student, Developer &amp; Executive themes</span>
                </div>
              </div>

              {/* Feature Card 3 */}
              <div className="p-8 rounded-3xl bg-white border border-[#d8e7f0] shadow-sm hover:border-[#137cc2]/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#E3ECF6] text-[#137cc2] flex items-center justify-center mb-6 shadow-xs">
                    <Rocket size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-[#0f1419] mb-3">
                    Simple Portfolio Generation
                  </h3>
                  <p className="text-sm text-[#536471] leading-relaxed">
                    Enter your details, select your plan, generate your portfolio and publish your
                    unique portfolio URL with instantaneous live updates.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#f1f5f9] flex items-center text-xs font-semibold text-[#137cc2]">
                  <span>Zero code • One-click publish</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            D. HOW IT WORKS SECTION
            Simple four-step product workflow:
            1. Create your Persona Flow account.
            2. Choose your career stage and portfolio plan.
            3. Enter your details and generate your portfolio.
            4. Publish and share your professional portfolio.
            ============================================================ */}
        <section className="py-20 md:py-28 px-6 max-w-7xl mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#137cc2] block mb-2">
              Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f1419] tracking-tight">
              How Persona Flow Works
            </h2>
            <p className="text-[#536471] text-base mt-3">
              Go from zero to a live, production-ready portfolio in four simple steps.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-white border border-[#d8e7f0] shadow-sm space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-[#0f1419] text-white flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-[#0f1419]">
                Create your Persona Flow account
              </h3>
              <p className="text-xs text-[#536471] leading-relaxed">
                Sign up with your email to access your secure dashboard and manage all your digital
                career credentials.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-white border border-[#d8e7f0] shadow-sm space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-[#137cc2] text-white flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-[#0f1419]">
                Choose your career stage and portfolio plan
              </h3>
              <p className="text-xs text-[#536471] leading-relaxed">
                Select from 7 career stages and choose the theme pack that matches your professional
                aspirations.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-white border border-[#d8e7f0] shadow-sm space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-[#137cc2] text-white flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-[#0f1419]">
                Enter your details and generate your portfolio
              </h3>
              <p className="text-xs text-[#536471] leading-relaxed">
                Fill in your education, technical skills, case studies and certifications with
                conditional stage-based forms.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-3xl bg-white border border-[#d8e7f0] shadow-sm space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-[#10b981] text-white flex items-center justify-center font-bold text-sm">
                04
              </div>
              <h3 className="text-base font-bold text-[#0f1419]">
                Publish and share your professional portfolio
              </h3>
              <p className="text-xs text-[#536471] leading-relaxed">
                Publish your unique public URL with a single click, ready to share with recruiters,
                colleagues and employers.
              </p>
            </div>
          </div>

          {/* Bottom Action Card */}
          <div className="mt-16 p-8 md:p-10 rounded-3xl bg-gradient-to-r from-[#ebf3f3] via-[#ffffff] to-[#E3ECF6] border border-[#d8e7f0] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left shadow-sm">
            <div>
              <h3 className="text-2xl font-bold text-[#0f1419]">
                Ready to create your personalized portfolio?
              </h3>
              <p className="text-sm text-[#536471] mt-1">
                Join students, developers, and professionals building their career identities on Persona Flow.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/admin/signup"
                className="px-6 py-3.5 rounded-xl bg-[#137cc2] hover:bg-[#0f66a0] text-white font-bold text-sm shadow-md transition-colors"
              >
                Sign Up Now
              </Link>
              <Link
                href="/packs"
                className="px-6 py-3.5 rounded-xl border border-[#d8e7f0] bg-white text-[#0f1419] font-semibold text-sm hover:bg-[#f7f8f8] transition-colors"
              >
                View Plans
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================
            E. FOOTER
            Professional, product-focused footer (no team member lists).
            ============================================================ */}
        <footer className="mt-auto border-t border-[#e1e8ed] bg-white py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#137cc2] to-[#1e9df1] flex items-center justify-center text-white shadow-2xs">
                <Layers size={18} />
              </div>
              <span className="font-extrabold text-base text-[#0f1419]">
                Persona Flow
              </span>
              <span className="text-xs text-[#536471] ml-2">
                — Your Career. Your Identity. Your Portfolio.
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm text-[#536471]">
              <Link href="/admin/login" className="hover:text-[#137cc2] transition-colors">
                Login
              </Link>
              <Link href="/admin/signup" className="hover:text-[#137cc2] transition-colors">
                Sign Up
              </Link>
              <Link href="/packs" className="hover:text-[#137cc2] transition-colors">
                Theme Packs
              </Link>
            </div>

            <p className="text-xs text-[#536471]">
              &copy; {new Date().getFullYear()} Persona Flow. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
