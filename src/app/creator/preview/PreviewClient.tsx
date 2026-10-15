'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Layers,
  ArrowLeft,
  Globe,
  CheckCircle2,
  GraduationCap,
  Terminal,
  Award,
  Loader2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { getFullProfileByUserId } from '@/lib/portfolioService';
import type { Profile } from '@/types/database.types';
import StudentStarterTheme from '@/components/themes/StudentStarterTheme';
import DeveloperProTheme from '@/components/themes/DeveloperProTheme';
import ProfessionalEliteTheme from '@/components/themes/ProfessionalEliteTheme';

export default function PreviewClient() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTheme, setActiveTheme] = useState<string>('student-starter');
  const [publishing, setPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [aiReStyling, setAiReStyling] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/admin/login');
        return;
      }

      // Load Profile with resilient normalized relations
      const normalized = await getFullProfileByUserId(supabase, user.id);

      if (normalized) {
        setProfile(normalized);
        setActiveTheme(normalized.active_theme_pack || 'student-starter');
        setIsPublished(normalized.is_published ?? true);
      }
      setLoading(false);
    };

    loadProfile();
  }, [router]);

  const handleSwitchTheme = async (themeSlug: string) => {
    setActiveTheme(themeSlug);
    if (!profile) return;

    const supabase = createClient();
    try {
      const baseUpdate: any = {
        layout_variant: themeSlug,
      };

      // Also persist in testimonials structure
      if (profile.testimonials && typeof profile.testimonials === 'object' && !Array.isArray(profile.testimonials)) {
        baseUpdate.testimonials = {
          ...(profile.testimonials as any),
          active_theme_pack: themeSlug,
        };
      }

      let { error } = await supabase
        .from('profiles')
        .update({
          ...baseUpdate,
          active_theme_pack: themeSlug,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error && (error.code === 'PGRST204' || error.message?.includes('column'))) {
        await supabase
          .from('profiles')
          .update(baseUpdate)
          .eq('id', profile.id);
      }

      setProfile({
        ...profile,
        active_theme_pack: themeSlug,
        layout_variant: themeSlug as any,
      });
    } catch (err) {
      console.warn('Failed to persist active theme:', err);
    }
  };

  const handlePublish = async () => {
    if (!profile) return;
    setPublishing(true);
    const supabase = createClient();
    const nextStatus = !isPublished;

    try {
      const baseUpdate: any = {
        show_terminal_toggle: nextStatus,
      };

      if (profile.testimonials && typeof profile.testimonials === 'object' && !Array.isArray(profile.testimonials)) {
        baseUpdate.testimonials = {
          ...(profile.testimonials as any),
          is_published: nextStatus,
        };
      }

      let { error } = await supabase
        .from('profiles')
        .update({
          ...baseUpdate,
          is_published: nextStatus,
          published_at: nextStatus ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error && (error.code === 'PGRST204' || error.message?.includes('column'))) {
        await supabase
          .from('profiles')
          .update(baseUpdate)
          .eq('id', profile.id);
      }

      setIsPublished(nextStatus);
      setProfile({
        ...profile,
        is_published: nextStatus,
        show_terminal_toggle: nextStatus,
      });
    } catch (err) {
      console.error('Publish error:', err);
    } finally {
      setPublishing(false);
    }
  };

  const handleAiReStyle = async () => {
    if (!profile) return;
    setAiReStyling(true);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;

      const res = await fetch('/api/ai/generate-portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          target_pack_slug: activeTheme,
          apply_to_profile: true,
        }),
      });

      const data = await res.json();
      if (data.success && data.config) {
        const config = data.config;
        setActiveTheme(config.theme_pack);
        setProfile({
          ...profile,
          active_theme_pack: config.theme_pack,
          theme_color: config.theme_color,
          layout_variant: config.layout_variant,
          animation_style: config.animation_style,
          animation_speed: config.animation_speed,
          background_effect: config.background_effect,
          custom_font: config.typography,
          headline: config.ai_headline || profile.headline,
          professional_title: config.ai_headline || profile.professional_title,
          bio: config.ai_summary_bio || profile.bio,
        });
      }
    } catch (err) {
      console.error('AI Re-Style error:', err);
    } finally {
      setAiReStyling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-[#0f1419]">
        <div className="text-center space-y-3">
          <Loader2 size={36} className="animate-spin text-[#137cc2] mx-auto" />
          <p className="text-sm font-semibold text-[#536471]">
            Generating live portfolio preview...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-white text-center">
        <div className="space-y-4 max-w-md">
          <h2 className="text-2xl font-bold text-[#0f1419]">No Profile Found</h2>
          <p className="text-xs text-[#536471]">
            Please return to the creator dashboard to enter your profile information first.
          </p>
          <Link
            href="/creator"
            className="px-5 py-2.5 rounded-xl bg-[#137cc2] text-white text-xs font-bold inline-block"
          >
            Open Creator Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffffff]">
      {/* Top Floating Control Bar */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e1e8ed] px-6 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/creator"
              className="px-3.5 py-1.5 rounded-xl border border-[#d8e7f0] text-xs font-semibold text-[#536471] hover:text-[#0f1419] hover:bg-[#f1f5f9] flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Editor
            </Link>

            <span className="text-xs font-bold text-[#0f1419] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              Private Preview
            </span>
          </div>

          {/* Theme Switcher Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-[#f1f5f9] rounded-xl border border-[#e2e8f0]">
            <button
              onClick={() => handleSwitchTheme('student-starter')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTheme === 'student-starter'
                  ? 'bg-white text-[#137cc2] shadow-xs'
                  : 'text-[#536471] hover:text-[#0f1419]'
              }`}
            >
              <GraduationCap size={14} /> Student Starter
            </button>

            <button
              onClick={() => handleSwitchTheme('developer-pro')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTheme === 'developer-pro'
                  ? 'bg-white text-[#137cc2] shadow-xs'
                  : 'text-[#536471] hover:text-[#0f1419]'
              }`}
            >
              <Terminal size={14} /> Developer Pro
            </button>

            <button
              onClick={() => handleSwitchTheme('professional-elite')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTheme === 'professional-elite'
                  ? 'bg-white text-[#137cc2] shadow-xs'
                  : 'text-[#536471] hover:text-[#0f1419]'
              }`}
            >
              <Award size={14} /> Professional Elite
            </button>

            <button
              onClick={handleAiReStyle}
              disabled={aiReStyling}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-gradient-to-r from-[#137cc2] to-[#0284c7] hover:opacity-90 text-white shadow-xs disabled:opacity-50"
              title="Re-synthesize design aesthetics using xAI Grok"
            >
              {aiReStyling ? (
                <>
                  <Loader2 size={13} className="animate-spin text-white" />
                  <span>Styling...</span>
                </>
              ) : (
                <>
                  <Sparkles size={13} className="text-[#38bdf8]" />
                  <span>AI Re-Style</span>
                </>
              )}
            </button>
          </div>

          {/* Publication and Link actions */}
          <div className="flex items-center gap-3">
            {isPublished && profile.slug && (
              <a
                href={`/portfolio/${profile.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#137cc2] hover:underline flex items-center gap-1"
              >
                /portfolio/{profile.slug} <ExternalLink size={12} />
              </a>
            )}

            <button
              onClick={handlePublish}
              disabled={publishing}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                isPublished
                  ? 'bg-[#10b981] hover:bg-[#059669] text-white'
                  : 'bg-[#137cc2] hover:bg-[#0f66a0] text-white'
              }`}
            >
              {publishing ? (
                <Loader2 size={14} className="animate-spin" />
              ) : isPublished ? (
                <>
                  <CheckCircle2 size={14} /> Published
                </>
              ) : (
                <>
                  <Globe size={14} /> Publish Portfolio
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Render Active Theme Engine with real user data */}
      <div>
        {activeTheme === 'student-starter' && (
          <StudentStarterTheme profile={profile} isPrivatePreview={true} />
        )}
        {activeTheme === 'developer-pro' && (
          <DeveloperProTheme profile={profile} isPrivatePreview={true} />
        )}
        {activeTheme === 'professional-elite' && (
          <ProfessionalEliteTheme profile={profile} isPrivatePreview={true} />
        )}
      </div>
    </div>
  );
}
