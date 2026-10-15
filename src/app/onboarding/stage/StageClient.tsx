'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Briefcase,
  UserCheck,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase';
import type { CareerStage } from '@/types/database.types';

interface StageOption {
  id: CareerStage;
  title: string;
  category: 'Student' | 'Professional';
  description: string;
  icon: typeof GraduationCap;
  features: string[];
}

const STAGE_OPTIONS: StageOption[] = [
  {
    id: 'first-year',
    title: '1st Year Engineering Student',
    category: 'Student',
    description: 'Focus on foundational coursework, lab skills, club participation, and early mini-projects.',
    icon: GraduationCap,
    features: ['Academic CGPA & Coursework', 'Club & Community Activities', 'Mini-Project Problem Cards'],
  },
  {
    id: 'second-year',
    title: '2nd Year Engineering Student',
    category: 'Student',
    description: 'Showcase core data structures, algorithms, hackathon participation, and technical projects.',
    icon: GraduationCap,
    features: ['Technical Skills & Stack', 'Hackathons & Competitions', 'Structured Project Showcases'],
  },
  {
    id: 'third-year',
    title: '3rd Year Engineering Student',
    category: 'Student',
    description: 'Highlight internship readiness, open-source work, full-stack apps, and live deployments.',
    icon: GraduationCap,
    features: ['Internships & Work Experience', 'Live Demos & GitHub Links', 'Case Studies with Architecture'],
  },
  {
    id: 'fourth-year',
    title: '4th Year Engineering Student',
    category: 'Student',
    description: 'Engineered for campus placements, major capstone projects, research papers, and technical depth.',
    icon: GraduationCap,
    features: ['Capstone Engineering Projects', 'Placement-Ready Resume PDF', 'GitHub & Live Code Repos'],
  },
  {
    id: 'job-seeker',
    title: 'Active Tech Job Seeker',
    category: 'Professional',
    description: 'Optimized to impress technical recruiters with deep case studies, verified skills, and fast contact.',
    icon: Briefcase,
    features: ['Problem-Solution Case Studies', 'Recruiter Quick-Connect Widget', 'Interactive Terminal & Demos'],
  },
  {
    id: 'professional',
    title: 'Experienced Professional',
    category: 'Professional',
    description: 'Executive career timeline, team leadership milestones, business impact, and recommendations.',
    icon: Briefcase,
    features: ['Career Milestones & Timeline', 'Metrics & Scale Delivered', 'Client & Peer Recommendations'],
  },
  {
    id: 'hr-recruiter',
    title: 'HR / Recruitment Professional',
    category: 'Professional',
    description: 'Tailored for talent acquisition partners, recruitment consultants, and hiring leaders.',
    icon: UserCheck,
    features: ['Talent Sourcing Credentials', 'Hiring Scale & Metrics', 'Corporate Recommendations'],
  },
];

export default function StageClient() {
  const router = useRouter();
  const [selectedStage, setSelectedStage] = useState<CareerStage>('first-year');
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        // Load current profile's career stage if exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('career_stage')
          .eq('user_id', user.id)
          .single();

        if (profile?.career_stage) {
          setSelectedStage(profile.career_stage as CareerStage);
        }
      }
    };

    checkAuth();
  }, []);

  const handleContinue = async () => {
    setSaving(true);
    const supabase = createClient();

    if (userId) {
      try {
        await supabase
          .from('profiles')
          .update({
            career_stage: selectedStage,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);
      } catch (err) {
        console.warn('Career stage update warning:', err);
      }
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('paas_selected_stage', selectedStage);
    }

    // Proceed to Theme Pack selection
    router.push('/packs');
  };

  return (
    <div className="relative min-h-screen bg-[#ffffff] text-[#0f1419] py-12 px-6 selection:bg-[#137cc2]/15">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-[10%] right-[-5%] w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(19, 124, 194, 0.08) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-[5%] left-[-10%] w-[550px] h-[550px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.06) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-[#e1e8ed]">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#137cc2] to-[#1e9df1] flex items-center justify-center text-white shadow-sm">
              <Layers size={22} className="stroke-[2.2]" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-[#0f1419] group-hover:text-[#137cc2] transition-colors">
                Persona Flow
              </span>
              <span className="block text-[11px] text-[#536471] -mt-1 font-medium uppercase tracking-wider">
                Step 1 of 4: Career Stage
              </span>
            </div>
          </Link>

          <span className="text-xs font-semibold text-[#137cc2] bg-[#E3ECF6] px-3 py-1.5 rounded-full border border-[#d8e7f0]">
            Personalized Structure
          </span>
        </div>

        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f1419] tracking-tight mb-3">
            Select Your <span className="text-[#137cc2]">Career Stage</span>
          </h1>
          <p className="text-[#536471] text-sm sm:text-base leading-relaxed">
            Persona Flow adapts form fields and portfolio sections to your exact career milestone —
            ensuring your accomplishments are presented with maximum impact.
          </p>
        </div>

        {/* Career Stage Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {STAGE_OPTIONS.map((opt) => {
            const isSelected = selectedStage === opt.id;
            const Icon = opt.icon;

            return (
              <div
                key={opt.id}
                onClick={() => setSelectedStage(opt.id)}
                className={`p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#137cc2] bg-[#f0f7fc] shadow-md ring-2 ring-[#137cc2]/30 -translate-y-1'
                    : 'border-[#d8e7f0] bg-white shadow-xs hover:border-[#137cc2]/40 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs ${
                        isSelected ? 'bg-[#137cc2] text-white' : 'bg-[#E3ECF6] text-[#137cc2]'
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                    {isSelected ? (
                      <span className="text-xs font-bold text-[#137cc2] flex items-center gap-1">
                        <CheckCircle2 size={16} /> Selected
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-[#64748b] bg-[#f1f5f9] px-2 py-0.5 rounded-md">
                        {opt.category}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-[#0f1419] mb-1.5">{opt.title}</h3>
                  <p className="text-xs text-[#536471] leading-relaxed mb-4">{opt.description}</p>
                </div>

                {/* Features Pill list */}
                <div className="pt-3 border-t border-[#e2e8f0]/80 space-y-1">
                  {opt.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[#334155]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#137cc2]" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="max-w-md mx-auto text-center space-y-3">
          <button
            onClick={handleContinue}
            disabled={saving}
            className="w-full py-4 px-6 rounded-xl bg-[#137cc2] hover:bg-[#0f66a0] text-white font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-md disabled:opacity-60 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Saving Career Stage...
              </>
            ) : (
              <>
                Continue to Theme Packs <ArrowRight size={18} />
              </>
            )}
          </button>
          <p className="text-xs text-[#536471]">
            You can modify your career stage anytime from your creator dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
