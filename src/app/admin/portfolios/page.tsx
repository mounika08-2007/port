'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Globe,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Loader2,
  Plus,
  Eye,
  Edit3,
  Layers,
  Sparkles,
  GraduationCap,
  Terminal,
  Award,
  ArrowRight,
  ShieldAlert,
  Clock,
} from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { fetchUserEntitlements } from '@/lib/themePacks';
import type { Profile, UserEntitlement } from '@/types/database.types';

export default function AdminPortfoliosPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [myProfiles, setMyProfiles] = useState<Profile[]>([]);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [entitlements, setEntitlements] = useState<UserEntitlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingSlug, setUpdatingSlug] = useState<string | null>(null);
  const [showNoEntitlementModal, setShowNoEntitlementModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'my' | 'all'>('my');

  const loadData = async () => {
    setLoading(true);
    const supabase = createClient();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/admin/login');
        return;
      }

      setCurrentUser(user);

      // 1. Fetch User Entitlements
      const ents = await fetchUserEntitlements(user.id);
      setEntitlements(ents);

      // 2. Fetch User's Own Profiles
      const { data: userProfiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (userProfiles) {
        setMyProfiles(userProfiles as Profile[]);
      }

      // 3. Fetch All Profiles (for administrative auditing)
      const { data: allData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (allData) {
        setAllProfiles(allData as Profile[]);
      }
    } catch (err) {
      console.error('Failed to load portfolio management data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateNewPortfolio = () => {
    if (!entitlements || entitlements.length === 0) {
      setShowNoEntitlementModal(true);
    } else {
      router.push('/creator');
    }
  };

  const handleTogglePublish = async (profileId: string, currentStatus: boolean, slug: string) => {
    setUpdatingSlug(slug);
    const supabase = createClient();
    const nextStatus = !currentStatus;

    try {
      await supabase
        .from('profiles')
        .update({
          is_published: nextStatus,
          published_at: nextStatus ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profileId);

      setMyProfiles((prev) =>
        prev.map((p) => (p.id === profileId ? { ...p, is_published: nextStatus } : p))
      );
      setAllProfiles((prev) =>
        prev.map((p) => (p.id === profileId ? { ...p, is_published: nextStatus } : p))
      );
    } catch (err) {
      console.error('Failed to update publication status:', err);
    } finally {
      setUpdatingSlug(null);
    }
  };

  const getPackDetails = (packSlug?: string) => {
    switch (packSlug) {
      case 'developer-pro':
        return {
          title: 'Developer Pro',
          icon: Terminal,
          badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          gradient: 'from-slate-900 to-slate-800 text-white',
        };
      case 'professional-elite':
        return {
          title: 'Professional Elite',
          icon: Award,
          badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          gradient: 'from-[#0f1419] to-slate-900 text-white',
        };
      default:
        return {
          title: 'Student Starter',
          icon: GraduationCap,
          badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
          gradient: 'from-[#137cc2] to-[#1e9df1] text-white',
        };
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center">
        <Loader2 size={36} className="animate-spin text-[#137cc2] mx-auto mb-3" />
        <p className="text-xs text-[#536471]">Loading your portfolios from Persona Flow...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#e1e8ed] gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1419] flex items-center gap-2">
            <Globe size={24} className="text-[#137cc2]" /> User Portfolios
          </h1>
          <p className="text-xs text-[#536471] mt-1">
            Create, customize, and manage your live personal portfolios and draft workspaces.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="px-3.5 py-2 rounded-xl border border-[#d8e7f0] bg-white hover:bg-[#f1f5f9] text-xs font-semibold text-[#0f1419] flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw size={14} /> Refresh
          </button>

          <button
            onClick={handleCreateNewPortfolio}
            className="px-4 py-2.5 rounded-xl bg-[#137cc2] hover:bg-[#0f66a0] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Plus size={16} /> Create New Portfolio
          </button>
        </div>
      </div>

      {/* View Switcher Pills */}
      <div className="flex items-center gap-2 border-b border-[#e2e8f0] pb-2">
        <button
          onClick={() => setActiveTab('my')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'my'
              ? 'bg-[#137cc2] text-white shadow-xs'
              : 'text-[#536471] hover:bg-[#f1f5f9] hover:text-[#0f1419]'
          }`}
        >
          <Layers size={14} /> My Portfolios ({myProfiles.length})
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#137cc2] text-white shadow-xs'
              : 'text-[#536471] hover:bg-[#f1f5f9] hover:text-[#0f1419]'
          }`}
        >
          <Globe size={14} /> Platform Directory ({allProfiles.length})
        </button>
      </div>

      {/* ============================================================
          TAB 1: MY PORTFOLIOS (Main User Portfolios Area)
          ============================================================ */}
      {activeTab === 'my' && (
        <>
          {myProfiles.length === 0 ? (
            /* Polished Empty State */
            <div className="rounded-3xl border border-[#d8e7f0] bg-gradient-to-b from-white to-[#f8fafc] p-12 text-center max-w-xl mx-auto shadow-xs space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#137cc2] to-[#38bdf8] text-white flex items-center justify-center mx-auto shadow-md">
                <Sparkles size={32} />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#0f1419]">No Portfolios Created Yet</h3>
                <p className="text-xs text-[#536471] leading-relaxed max-w-md mx-auto">
                  You haven&apos;t generated a portfolio yet. Select your activated theme pack,
                  configure your personal details, and publish your personal portfolio in minutes.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleCreateNewPortfolio}
                  className="px-6 py-3.5 rounded-xl bg-[#137cc2] hover:bg-[#0f66a0] text-white text-sm font-bold inline-flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <Plus size={18} /> Create Your First Portfolio
                </button>
              </div>

              <p className="text-[11px] text-[#94a3b8]">
                {entitlements.length > 0
                  ? `Active Entitlements: ${entitlements.map((e) => e.pack_slug).join(', ')}`
                  : 'Requires an activated theme pack. Demo activation is ₹0.'}
              </p>
            </div>
          ) : (
            /* Portfolio Cards Grid */
            <div className="grid md:grid-cols-2 gap-6">
              {myProfiles.map((p) => {
                const pack = getPackDetails(p.active_theme_pack);
                const PackIcon = pack.icon;
                const isPublished = p.is_published ?? false;
                const isUpdating = updatingSlug === p.slug;

                return (
                  <div
                    key={p.id}
                    className="rounded-3xl bg-white border border-[#d8e7f0] hover:border-[#137cc2]/40 transition-all duration-200 overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    {/* Visual Preview Header / Thumbnail Representation */}
                    <div
                      className={`p-6 bg-gradient-to-r ${pack.gradient} relative overflow-hidden flex flex-col justify-between min-h-[140px]`}
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <span className="px-3 py-1 rounded-full bg-black/25 backdrop-blur-xs text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/20">
                          <PackIcon size={13} /> {pack.title}
                        </span>

                        {isPublished ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            Published
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-slate-700 text-slate-200 text-[10px] font-bold uppercase tracking-wider">
                            Draft Mode
                          </span>
                        )}
                      </div>

                      <div className="relative z-10 mt-4">
                        <h3 className="text-xl font-black text-white tracking-tight">
                          {p.full_name || 'My Portfolio'}
                        </h3>
                        <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
                          {p.headline || p.professional_title || 'Software Engineering Portfolio'}
                        </p>
                      </div>

                      {/* Subtle watermarked decor */}
                      <div className="absolute right-[-15px] bottom-[-20px] opacity-10 pointer-events-none text-white font-black text-8xl select-none">
                        PF
                      </div>
                    </div>

                    {/* Card Body Details */}
                    <div className="p-6 space-y-4 flex-1">
                      {/* Meta Tags */}
                      <div className="flex flex-wrap items-center gap-2">
                        {p.career_stage && (
                          <span className="text-[11px] font-medium capitalize px-2.5 py-1 rounded-lg bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0]">
                            {p.career_stage.replace('-', ' ')}
                          </span>
                        )}
                        <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[#E3ECF6] text-[#137cc2] border border-[#d8e7f0]">
                          /portfolio/{p.slug}
                        </span>
                      </div>

                      {/* Date & State info */}
                      <div className="text-[11px] text-[#536471] flex items-center gap-1.5 pt-1 border-t border-[#f1f5f9]">
                        <Clock size={13} />
                        <span>
                          Last updated:{' '}
                          {p.updated_at
                            ? new Date(p.updated_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : 'Recently'}
                        </span>
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="p-4 bg-[#f8fafc] border-t border-[#e2e8f0] flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Link
                          href="/creator"
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#f1f5f9] border border-[#d8e7f0] text-xs font-bold text-[#0f1419] flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <Edit3 size={13} /> Edit Portfolio
                        </Link>

                        <Link
                          href="/creator/preview"
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#f1f5f9] border border-[#d8e7f0] text-xs font-semibold text-[#536471] hover:text-[#0f1419] flex items-center gap-1.5 transition-colors"
                        >
                          <Eye size={13} /> Preview
                        </Link>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTogglePublish(p.id, isPublished, p.slug)}
                          disabled={isUpdating}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isPublished
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          {isUpdating ? 'Updating...' : isPublished ? 'Unpublish' : 'Publish'}
                        </button>

                        {isPublished && (
                          <a
                            href={`/portfolio/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-[#137cc2] hover:bg-[#0f66a0] text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs"
                            title="Open live published portfolio"
                          >
                            <span>Live</span> <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ============================================================
          TAB 2: DIRECTORY / ALL PROFILES AUDIT
          ============================================================ */}
      {activeTab === 'all' && (
        <div className="rounded-3xl bg-white border border-[#d8e7f0] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] border-b border-[#e1e8ed] text-[#475569] font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-5">User / Portfolio</th>
                  <th className="py-3.5 px-4">Career Stage</th>
                  <th className="py-3.5 px-4">Theme Pack</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {allProfiles.map((p) => {
                  const isPublished = p.is_published ?? false;
                  const isUpdating = updatingSlug === p.slug;

                  return (
                    <tr key={p.id} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#E3ECF6] text-[#137cc2] flex items-center justify-center font-bold text-xs shrink-0">
                            {p.avatar_url ? (
                              <img
                                src={p.avatar_url}
                                alt={p.full_name}
                                className="w-full h-full object-cover rounded-xl"
                              />
                            ) : (
                              p.full_name?.[0]?.toUpperCase() || 'U'
                            )}
                          </div>
                          <div>
                            <strong className="text-sm font-bold text-[#0f1419] block">
                              {p.full_name || 'Unnamed Creator'}
                            </strong>
                            <span className="text-[11px] font-mono text-[#536471]">
                              /portfolio/{p.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 capitalize font-medium text-[#334155]">
                        {p.career_stage ? p.career_stage.replace('-', ' ') : 'N/A'}
                      </td>

                      <td className="py-4 px-4 font-mono text-[11px] text-[#137cc2]">
                        {p.active_theme_pack || 'student-starter'}
                      </td>

                      <td className="py-4 px-4">
                        {isPublished ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#10b981]/15 text-[#10b981] font-bold text-[10px] uppercase border border-[#10b981]/30">
                            Published
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#f1f5f9] text-[#64748b] font-bold text-[10px] uppercase border border-[#cbd5e1]">
                            Draft
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-5 text-right space-x-2">
                        <button
                          onClick={() => handleTogglePublish(p.id, isPublished, p.slug)}
                          disabled={isUpdating}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                            isPublished
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                              : 'bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981]/20 border border-[#10b981]/30'
                          }`}
                        >
                          {isUpdating ? 'Saving...' : isPublished ? 'Unpublish' : 'Publish'}
                        </button>

                        <a
                          href={`/portfolio/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl border border-[#d8e7f0] text-xs font-semibold text-[#536471] hover:text-[#0f1419] hover:bg-[#f1f5f9] inline-flex items-center gap-1 transition-colors"
                        >
                          View <ExternalLink size={12} />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Entitlement Required Modal */}
      {showNoEntitlementModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-xl border border-[#d8e7f0] animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
              <ShieldAlert size={28} />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-[#0f1419]">Theme Pack Activation Required</h3>
              <p className="text-xs text-[#536471] leading-relaxed">
                Persona Flow requires an active portfolio theme pack before launching the creator.
                Explore our student and professional theme packs and activate your preferred design.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/packs"
                className="flex-1 py-3 px-4 rounded-xl bg-[#137cc2] hover:bg-[#0f66a0] text-white font-bold text-xs text-center transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                Explore Theme Packs <ArrowRight size={14} />
              </Link>
              <button
                onClick={() => setShowNoEntitlementModal(false)}
                className="py-3 px-4 rounded-xl border border-[#d8e7f0] text-[#536471] hover:bg-[#f8fafc] text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
