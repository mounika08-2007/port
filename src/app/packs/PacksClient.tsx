'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Layers,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  GraduationCap,
  Briefcase,
  Sparkles,
  Check,
  Globe,
} from 'lucide-react';
import type { ThemePack, CareerStage, UserEntitlement } from '@/types/database.types';
import ThemePackThumbnail from '@/components/packs/ThemePackThumbnail';
import { createClient } from '@/lib/supabase';
import { fetchUserEntitlements } from '@/lib/themePacks';

interface PacksClientProps {
  initialPacks: ThemePack[];
}

export default function PacksClient({ initialPacks }: PacksClientProps) {
  const [packs] = useState<ThemePack[]>(initialPacks);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'students' | 'pros'>('all');
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [entitlements, setEntitlements] = useState<UserEntitlement[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        setUserEmail(user.email || null);
        const userEnts = await fetchUserEntitlements(user.id);
        setEntitlements(userEnts);
      }
      setLoadingUser(false);
    };

    checkAuth();
  }, []);

  const hasAnyActivePack = entitlements.length > 0;

  const filteredPacks = packs.filter((pack) => {
    if (selectedFilter === 'students') {
      return (
        pack.recommended_for.includes('first-year') ||
        pack.recommended_for.includes('second-year') ||
        pack.recommended_for.includes('third-year')
      );
    }
    if (selectedFilter === 'pros') {
      return (
        pack.recommended_for.includes('job-seeker') ||
        pack.recommended_for.includes('professional') ||
        pack.recommended_for.includes('hr-recruiter')
      );
    }
    return true;
  });

  // Helper to get button label per requirements
  const getButtonLabel = (slug: string) => {
    switch (slug) {
      case 'student-starter':
        return 'Choose Starter';
      case 'developer-pro':
        return 'Choose Pro';
      case 'professional-elite':
        return 'Choose Professional';
      default:
        return 'Select Plan';
    }
  };

  // Helper to format user categories
  const getIntendedCategory = (slug: string) => {
    switch (slug) {
      case 'student-starter':
        return '1st & 2nd Year Engineering Students';
      case 'developer-pro':
        return '3rd & 4th Year Students & Tech Job Seekers';
      case 'professional-elite':
        return 'Experienced Professionals & HR Specialists';
      default:
        return 'All Professionals';
    }
  };

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
          className="absolute bottom-[5%] left-[-10%] w-[550px] h-[550px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.06) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 md:py-14">
        {/* Top Navbar */}
        <div className="flex items-center justify-between mb-12 pb-6 border-b border-[#e1e8ed]">
          {/* Logo & Wordmark */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#137cc2] to-[#1e9df1] flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Layers size={22} className="stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-[#0f1419] group-hover:text-[#137cc2] transition-colors">
                Persona Flow
              </span>
              <span className="text-[10px] font-medium text-[#536471] -mt-1 tracking-wider uppercase">
                Portfolio Theme Packs
              </span>
            </div>
          </Link>

          {/* User state / Auth Navigation */}
          <div className="flex items-center gap-3">
            {userId ? (
              <div className="flex items-center gap-2.5">
                <span className="hidden sm:inline-flex text-xs px-3 py-1.5 rounded-full bg-[#f1f5f9] text-[#536471] font-medium border border-[#e2e8f0]">
                  {userEmail}
                </span>
                {hasAnyActivePack && (
                  <Link
                    href="/admin/portfolios"
                    className="px-4 py-2 rounded-xl bg-[#137cc2] text-white text-sm font-semibold hover:bg-[#0f66a0] transition-colors shadow-xs inline-flex items-center gap-1.5"
                  >
                    <Globe size={15} /> User Portfolios
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/login"
                  className="px-4 py-2 rounded-xl border border-[#d8e7f0] text-sm font-semibold text-[#0f1419] hover:bg-[#f7f8f8] transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/admin/signup"
                  className="px-4 py-2 rounded-xl bg-[#137cc2] text-white text-sm font-semibold hover:bg-[#0f66a0] transition-colors shadow-xs"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0f1419] mb-4">
            Select Your Portfolio <span className="text-[#137cc2]">Theme Pack</span>
          </h1>
          <p className="text-[#536471] text-base md:text-lg leading-relaxed">
            Choose from professionally crafted theme packs engineered for students, job seekers, and
            industry professionals. Each pack unlocks tailored sections and verified portfolio layouts.
          </p>

          {/* Filter Pills */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-[#137cc2] text-white shadow-xs'
                  : 'bg-[#f1f5f9] text-[#536471] hover:bg-[#e2e8f0]'
              }`}
            >
              All Packs (3)
            </button>
            <button
              onClick={() => setSelectedFilter('students')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedFilter === 'students'
                  ? 'bg-[#137cc2] text-white shadow-xs'
                  : 'bg-[#f1f5f9] text-[#536471] hover:bg-[#e2e8f0]'
              }`}
            >
              <GraduationCap size={14} /> Student Focus
            </button>
            <button
              onClick={() => setSelectedFilter('pros')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedFilter === 'pros'
                  ? 'bg-[#137cc2] text-white shadow-xs'
                  : 'bg-[#f1f5f9] text-[#536471] hover:bg-[#e2e8f0]'
              }`}
            >
              <Briefcase size={14} /> Job Seekers &amp; Pros
            </button>
          </div>
        </div>

        {/* Theme Packs Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 items-stretch">
          {filteredPacks.map((pack, index) => {
            const isEntitled = entitlements.some((e) => e.pack_slug === pack.slug);
            const isRecommended = pack.slug === 'developer-pro';

            return (
              <motion.div
                key={pack.slug}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`relative rounded-3xl bg-white border flex flex-col justify-between overflow-hidden transition-all duration-200 ${
                  isRecommended
                    ? 'border-[#137cc2] shadow-lg ring-1 ring-[#137cc2]/30 md:-translate-y-1.5'
                    : 'border-[#d8e7f0] shadow-sm hover:border-[#137cc2]/40 hover:shadow-md'
                }`}
              >
                {/* Recommended Badge for Developer Pro */}
                {isRecommended && (
                  <div className="bg-[#137cc2] text-white text-[11px] font-bold uppercase tracking-wider py-1.5 text-center">
                    Recommended Choice
                  </div>
                )}

                <div className="p-6 md:p-7 flex-1 flex flex-col">
                  {/* Clean, Full-Color Thumbnail (NO watermarks, NO lock overlays) */}
                  <div className="mb-5">
                    <ThemePackThumbnail packSlug={pack.slug} packName={pack.name} />
                  </div>

                  {/* Pack Title & Short Description */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h3 className="text-xl font-bold text-[#0f1419]">{pack.name}</h3>
                      {isEntitled && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#10b981]/10 text-[#10b981] text-xs font-semibold flex items-center gap-1 border border-[#10b981]/20 shrink-0">
                          <CheckCircle2 size={12} /> Active
                        </span>
                      )}
                    </div>
                    <p className="text-[#536471] text-xs leading-relaxed min-h-[36px]">
                      {pack.tagline}
                    </p>
                  </div>

                  {/* Intended User Category */}
                  <div className="mb-5 p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] block mb-1">
                      Target Audience
                    </span>
                    <span className="text-xs font-semibold text-[#0f1419] block">
                      {getIntendedCategory(pack.slug)}
                    </span>
                  </div>

                  {/* Clean Price Display */}
                  <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-[#e1e8ed]">
                    <div>
                      <span className="text-xs text-[#536471] block font-medium">Listed Price</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-[#0f1419]">
                          ₹{pack.listed_price}
                        </span>
                        <span className="text-xs text-[#536471] font-medium">/ portfolio</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#0284c7] bg-[#E3ECF6] px-2.5 py-1 rounded-full border border-[#d8e7f0]">
                      Standard Access
                    </span>
                  </div>

                  {/* Main Included Features */}
                  <div className="space-y-2.5 mb-6 flex-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0f1419] block mb-2">
                      Included Features:
                    </span>
                    {pack.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#0f1419]">
                        <Check size={14} className="text-[#10b981] shrink-0 mt-0.5" />
                        <span className="leading-snug text-[#334155]">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Selection Button */}
                  <div className="pt-2">
                    {isEntitled ? (
                      <Link
                        href="/admin/portfolios"
                        className="w-full py-3.5 px-4 rounded-xl bg-[#ecfdf5] hover:bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0] font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-xs"
                      >
                        <CheckCircle2 size={16} className="text-[#10b981]" /> Active Plan — View in Portfolios
                      </Link>
                    ) : (
                      <Link
                        href={`/checkout/${pack.slug}`}
                        className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-xs ${
                          isRecommended
                            ? 'bg-[#137cc2] hover:bg-[#0f66a0] text-white shadow-sm'
                            : 'bg-[#0f1419] hover:bg-[#1f2937] text-white'
                        }`}
                      >
                        <span>{getButtonLabel(pack.slug)}</span>
                        <ArrowRight size={15} />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Clean Footer Notice */}
        <div className="max-w-2xl mx-auto text-center text-xs text-[#536471] py-4 border-t border-[#e1e8ed]">
          <p>
            All plans include a unique public URL, mobile responsive design, and full editing
            capabilities through your Persona Flow creator dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
