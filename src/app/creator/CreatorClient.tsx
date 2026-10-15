'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  User,
  GraduationCap,
  Sparkles,
  Code2,
  Award,
  Briefcase,
  Share2,
  CheckCircle2,
  Save,
  Eye,
  Globe,
  Plus,
  Trash2,
  ArrowRight,
  Loader2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Sliders,
  RotateCcw,
  Palette,
  Gauge,
} from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { fetchUserEntitlements } from '@/lib/themePacks';
import {
  getFullProfileByUserId,
  saveUserProfile,
  createInitialProfile,
} from '@/lib/portfolioService';
import type {
  Profile,
  Education,
  Certification,
  Project,
  Skill,
  SocialLink,
  Experience,
  CareerStage,
} from '@/types/database.types';

export default function CreatorClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<{
    config: any;
    message?: string;
    isAi: boolean;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<
    'personal' | 'education' | 'skills' | 'projects' | 'certifications' | 'experience' | 'social' | 'vibe'
  >('personal');

  // User and Entitlement
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [slug, setSlug] = useState('');
  const [headline, setHeadline] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [careerStage, setCareerStage] = useState<CareerStage>('first-year');
  const [activeThemePack, setActiveThemePack] = useState('student-starter');
  const [isPublished, setIsPublished] = useState(false);

  // Vibe, Atmosphere & Motion Preferences
  const [animationStyle, setAnimationStyle] = useState<
    'fade' | 'slide-up' | 'glitch' | 'liquid-reveal' | 'blur-reveal' | 'rotate-in'
  >('fade');
  const [animationSpeed, setAnimationSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [backgroundEffect, setBackgroundEffect] = useState<
    'mesh-gradient' | 'particles' | 'matrix' | 'aurora' | 'cyber-grid' | 'none'
  >('mesh-gradient');
  const [layoutVariant, setLayoutVariant] = useState<'classic' | 'minimalist' | 'cyberpunk-grid'>('classic');
  const [customFont, setCustomFont] = useState('Plus Jakarta Sans');
  const [themeColor, setThemeColor] = useState('#137cc2');
  const [previewMotionKey, setPreviewMotionKey] = useState(0);

  // Relational Records
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [skillsList, setSkillsList] = useState<Skill[]>([]);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [certificationsList, setCertificationsList] = useState<Certification[]>([]);
  const [socialLinksList, setSocialLinksList] = useState<SocialLink[]>([]);
  const [experiencesList, setExperiencesList] = useState<Experience[]>([]);

  // Verification & Entitlement Guard
  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/admin/login');
        return;
      }

      setUserId(user.id);
      setUserEmail(user.email || null);

      // Check entitlements
      const ents = await fetchUserEntitlements(user.id);
      const isEntitled = ents.length > 0;

      // Note: for demonstration resilience, if user just signed up and has demo entitlement
      if (!isEntitled) {
        // Redirect to theme packs if un-entitled
        router.push('/packs');
        return;
      }

      // Load Profile
      let profile = await getFullProfileByUserId(supabase, user.id);

      if (!profile) {
        const initialSlug = `user-${Date.now().toString(36)}`;
        profile = await createInitialProfile(supabase, user.id, initialSlug);
      }

      if (profile) {
        setProfileId(profile.id);
        setFullName(profile.full_name || '');
        setSlug(profile.slug || '');
        setHeadline(profile.headline || profile.professional_title || '');
        setProfessionalTitle(profile.professional_title || profile.headline || '');
        setBio(profile.bio || '');
        setLocation(profile.location || '');
        setPhone(profile.phone || '');
        setAvatarUrl(profile.avatar_url || '');
        setResumeUrl(profile.resume_url || '');
        setCareerStage(profile.career_stage || 'first-year');
        setActiveThemePack(profile.active_theme_pack || 'student-starter');
        setIsPublished(profile.is_published ?? true);

        if (profile.animation_style) setAnimationStyle(profile.animation_style as any);
        if (profile.animation_speed) setAnimationSpeed(profile.animation_speed as any);
        if (profile.background_effect) setBackgroundEffect(profile.background_effect as any);
        if (profile.layout_variant) setLayoutVariant(profile.layout_variant as any);
        if (profile.custom_font) setCustomFont(profile.custom_font);
        if (profile.theme_color) setThemeColor(profile.theme_color);

        if (Array.isArray(profile.experiences)) {
          setExperiencesList(profile.experiences);
        }
        if (Array.isArray(profile.education)) {
          setEducationList(profile.education);
        }
        if (Array.isArray(profile.skills)) {
          setSkillsList(profile.skills);
        }
        if (Array.isArray(profile.projects)) {
          setProjectsList(profile.projects);
        }
        if (Array.isArray(profile.certifications)) {
          setCertificationsList(profile.certifications);
        }
        if (Array.isArray(profile.social_links)) {
          setSocialLinksList(profile.social_links);
        }
      }

      setLoading(false);
    };

    init();
  }, [router]);

  // Stage conditional rules
  const showExperience =
    careerStage !== 'first-year' && careerStage !== 'second-year';

  // Real-time Save Draft handler
  const handleSaveDraft = async () => {
    if (!profileId || !userId) return;
    setSaving(true);
    setSaveSuccess(false);
    const supabase = createClient();

    try {
      const res = await saveUserProfile(supabase, profileId, userId, {
        fullName,
        slug,
        headline,
        professionalTitle,
        bio,
        location,
        phone,
        avatarUrl,
        resumeUrl,
        careerStage,
        activeThemePack,
        isPublished,
        educationList,
        skillsList,
        projectsList,
        certificationsList,
        socialLinksList,
        experiencesList,
      });

      if (res.success) {
        await supabase
          .from('profiles')
          .update({
            animation_style: animationStyle,
            animation_speed: animationSpeed,
            background_effect: backgroundEffect,
            layout_variant: layoutVariant,
            custom_font: customFont,
            theme_color: themeColor,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profileId);

        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        console.error('Error saving portfolio draft:', res.error);
      }
    } catch (err) {
      console.error('Error saving portfolio draft:', err);
    } finally {
      setSaving(false);
    }
  };

  // Publish Portfolio Handler
  const handleTogglePublish = async () => {
    if (!profileId || !userId) return;
    setPublishing(true);
    const supabase = createClient();
    const nextStatus = !isPublished;

    try {
      const res = await saveUserProfile(supabase, profileId, userId, {
        fullName,
        slug,
        headline,
        professionalTitle,
        bio,
        location,
        phone,
        avatarUrl,
        resumeUrl,
        careerStage,
        activeThemePack,
        isPublished: nextStatus,
        educationList,
        skillsList,
        projectsList,
        certificationsList,
        socialLinksList,
        experiencesList,
      });

      if (res.success) {
        await supabase
          .from('profiles')
          .update({
            animation_style: animationStyle,
            animation_speed: animationSpeed,
            background_effect: backgroundEffect,
            layout_variant: layoutVariant,
            custom_font: customFont,
            theme_color: themeColor,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profileId);

        setIsPublished(nextStatus);
      } else {
        console.error('Failed to toggle publish status:', res.error);
      }
    } catch (err) {
      console.error('Failed to toggle publish status:', err);
    } finally {
      setPublishing(false);
    }
  };

  // Generate My Portfolio with xAI Grok
  const handleAIGenerate = async () => {
    if (!profileId || !userId) return;
    setAiGenerating(true);
    setAiResult(null);

    try {
      // 1. First save any pending form changes so AI receives fresh data
      await handleSaveDraft();

      // 2. Fetch Supabase session JWT
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        alert('Authentication session expired. Please sign in again.');
        setAiGenerating(false);
        return;
      }

      // 3. Call server-side Grok portfolio generator
      const res = await fetch('/api/ai/generate-portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          target_pack_slug: activeThemePack,
          apply_to_profile: true,
          animation_style: animationStyle,
          animation_speed: animationSpeed,
          background_effect: backgroundEffect,
          custom_font: customFont,
          theme_color: themeColor,
          layout_variant: layoutVariant,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to synthesize AI portfolio design');
      }

      // 4. Apply validated design configuration into Creator state
      const config = data.config;
      if (config.ai_headline) {
        setHeadline(config.ai_headline);
        setProfessionalTitle(config.ai_headline);
      }
      if (config.ai_summary_bio) {
        setBio(config.ai_summary_bio);
      }
      if (config.theme_pack) {
        setActiveThemePack(config.theme_pack);
      }
      if (config.animation_style) setAnimationStyle(config.animation_style);
      if (config.animation_speed) setAnimationSpeed(config.animation_speed);
      if (config.background_effect) setBackgroundEffect(config.background_effect);
      if (config.typography) setCustomFont(config.typography);
      if (config.theme_color) setThemeColor(config.theme_color);
      if (config.layout_variant) setLayoutVariant(config.layout_variant);

      setAiResult({
        config,
        message: config.design_rationale,
        isAi: config.is_ai_generated,
      });
    } catch (err: any) {
      console.error('AI generation error:', err);
      alert(err?.message || 'Error running AI portfolio generation');
    } finally {
      setAiGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-[#0f1419]">
        <div className="text-center space-y-3">
          <Loader2 size={36} className="animate-spin text-[#137cc2] mx-auto" />
          <p className="text-sm font-semibold text-[#536471]">
            Loading your Persona Flow Creator...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8f8] text-[#0f1419] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#e1e8ed] px-6 py-4 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#137cc2] to-[#1e9df1] flex items-center justify-center text-white shadow-xs">
                <Layers size={18} />
              </div>
              <span className="font-extrabold text-base text-[#0f1419] group-hover:text-[#137cc2] transition-colors">
                Persona Flow
              </span>
            </Link>

            <span className="text-xs px-2.5 py-1 rounded-full bg-[#E3ECF6] text-[#137cc2] font-semibold border border-[#d8e7f0]">
              Portfolio Creator
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {saveSuccess && (
              <span className="text-xs text-[#10b981] font-semibold flex items-center gap-1">
                <CheckCircle2 size={14} /> Draft Saved
              </span>
            )}

            <button
              onClick={handleAIGenerate}
              disabled={aiGenerating || saving}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#137cc2] to-[#0284c7] hover:from-[#0f66a0] hover:to-[#0369a1] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
              title="Generate optimized design system and typography"
            >
              {aiGenerating ? (
                <>
                  <Loader2 size={14} className="animate-spin text-white" />
                  <span>Generating Portfolio...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-[#38bdf8]" />
                  <span>Generate Portfolio</span>
                </>
              )}
            </button>

            <button
              onClick={handleSaveDraft}
              disabled={saving || aiGenerating}
              className="px-4 py-2 rounded-xl border border-[#d8e7f0] bg-white hover:bg-[#f1f5f9] text-xs font-semibold text-[#0f1419] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span>Save Draft</span>
            </button>

            <Link
              href="/creator/preview"
              className="px-4 py-2 rounded-xl bg-[#0f1419] hover:bg-[#1e293b] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Eye size={14} />
              <span>Preview</span>
            </Link>

            <button
              onClick={handleTogglePublish}
              disabled={publishing || aiGenerating}
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
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
        {/* Grok AI Generation Banner */}
        {aiResult && (
          <div className="p-4 rounded-2xl border border-[#137cc2]/30 bg-gradient-to-r from-[#E3ECF6] via-[#ffffff] to-[#E3ECF6] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#137cc2] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles size={18} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-[#0f1419]">
                    {aiResult.isAi
                      ? `✨ xAI Grok Design System Applied (${aiResult.config.model_used || 'grok-2'})`
                      : '⚡ Verified Template Preset Applied'}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-[#137cc2] border border-[#d8e7f0] font-semibold">
                    {aiResult.config.theme_pack}
                  </span>
                </div>
                <p className="text-xs text-[#536471] leading-relaxed max-w-2xl">
                  {aiResult.config.design_rationale}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#536471]">
                  <span>Palette: <strong className="text-[#0f1419]">{aiResult.config.theme_color}</strong></span>
                  <span>•</span>
                  <span>Font: <strong className="text-[#0f1419]">{aiResult.config.typography}</strong></span>
                  <span>•</span>
                  <span>Layout: <strong className="text-[#0f1419]">{aiResult.config.layout_variant}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              <Link
                href="/creator/preview"
                className="px-4 py-2 rounded-xl bg-[#137cc2] text-white text-xs font-bold hover:bg-[#0f66a0] flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Eye size={13} />
                <span>View Live Preview</span>
              </Link>
              <button
                onClick={() => setAiResult(null)}
                className="p-2 rounded-xl hover:bg-black/5 text-[#536471] text-xs font-semibold cursor-pointer"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-12 gap-8">
        {/* Left Column: Navigation Tabs & Slug Info */}
        <div className="md:col-span-3 space-y-6">
          {/* Navigation Pill List */}
          <div className="rounded-2xl bg-white border border-[#e1e8ed] p-2 space-y-1 shadow-2xs">
            <button
              onClick={() => setActiveTab('personal')}
              className={`w-full py-2.5 px-3.5 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'personal'
                  ? 'bg-[#137cc2] text-white shadow-xs'
                  : 'text-[#536471] hover:bg-[#f1f5f9] hover:text-[#0f1419]'
              }`}
            >
              <User size={15} /> Personal Details
            </button>

            <button
              onClick={() => setActiveTab('education')}
              className={`w-full py-2.5 px-3.5 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'education'
                  ? 'bg-[#137cc2] text-white shadow-xs'
                  : 'text-[#536471] hover:bg-[#f1f5f9] hover:text-[#0f1419]'
              }`}
            >
              <GraduationCap size={15} /> Education &amp; Academics
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`w-full py-2.5 px-3.5 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'skills'
                  ? 'bg-[#137cc2] text-white shadow-xs'
                  : 'text-[#536471] hover:bg-[#f1f5f9] hover:text-[#0f1419]'
              }`}
            >
              <Sparkles size={15} /> Skills &amp; Stack
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full py-2.5 px-3.5 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-[#137cc2] text-white shadow-xs'
                  : 'text-[#536471] hover:bg-[#f1f5f9] hover:text-[#0f1419]'
              }`}
            >
              <Code2 size={15} /> Projects &amp; Case Studies
            </button>

            <button
              onClick={() => setActiveTab('certifications')}
              className={`w-full py-2.5 px-3.5 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'certifications'
                  ? 'bg-[#137cc2] text-white shadow-xs'
                  : 'text-[#536471] hover:bg-[#f1f5f9] hover:text-[#0f1419]'
              }`}
            >
              <Award size={15} /> Certifications
            </button>

            {showExperience && (
              <button
                onClick={() => setActiveTab('experience')}
                className={`w-full py-2.5 px-3.5 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'experience'
                    ? 'bg-[#137cc2] text-white shadow-xs'
                    : 'text-[#536471] hover:bg-[#f1f5f9] hover:text-[#0f1419]'
                }`}
              >
                <Briefcase size={15} /> Work Experience
              </button>
            )}

            <button
              onClick={() => setActiveTab('social')}
              className={`w-full py-2.5 px-3.5 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'social'
                  ? 'bg-[#137cc2] text-white shadow-xs'
                  : 'text-[#536471] hover:bg-[#f1f5f9] hover:text-[#0f1419]'
              }`}
            >
              <Share2 size={15} /> Links &amp; Contact
            </button>

            <button
              onClick={() => setActiveTab('vibe')}
              className={`w-full py-2.5 px-3.5 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'vibe'
                  ? 'bg-[#137cc2] text-white shadow-xs'
                  : 'text-[#536471] hover:bg-[#f1f5f9] hover:text-[#0f1419]'
              }`}
            >
              <Sliders size={15} /> Vibe &amp; Experience
            </button>
          </div>

          {/* Public URL & Status Card */}
          <div className="rounded-2xl bg-white border border-[#e1e8ed] p-5 space-y-3 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] block">
              Live Public URL
            </span>
            <div className="text-xs font-mono text-[#137cc2] bg-[#f8fafc] p-2.5 rounded-xl border border-[#e2e8f0] break-all">
              /portfolio/{slug || 'your-slug'}
            </div>
            {isPublished ? (
              <a
                href={`/portfolio/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981]/20 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                Open Live Portfolio <ExternalLink size={13} />
              </a>
            ) : (
              <div className="text-[11px] text-[#536471] flex items-center gap-1.5">
                <AlertCircle size={13} className="text-[#f59e0b]" />
                <span>Draft mode. Click Publish to make live.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Tab Editor Form */}
        <div className="md:col-span-9 bg-white rounded-3xl border border-[#e1e8ed] p-6 md:p-8 shadow-xs">
          {/* 1. PERSONAL TAB */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-[#e2e8f0]">
                <h2 className="text-xl font-bold text-[#0f1419]">Personal Information</h2>
                <p className="text-xs text-[#536471] mt-0.5">
                  Core identity details presented across all themes
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0f1419] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="glass-input text-sm"
                    placeholder="e.g. Rahul Sharma"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0f1419] mb-1">
                    Unique Portfolio Slug *
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="glass-input text-sm"
                    placeholder="rahul-sharma"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0f1419] mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="glass-input text-sm"
                    placeholder="e.g. Aspiring Full-Stack Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0f1419] mb-1">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={professionalTitle}
                    onChange={(e) => setProfessionalTitle(e.target.value)}
                    className="glass-input text-sm"
                    placeholder="e.g. Computer Science Undergraduate"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0f1419] mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="glass-input text-sm"
                    placeholder="e.g. Hyderabad, India"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0f1419] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="glass-input text-sm"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0f1419] mb-1">
                    Profile Avatar URL
                  </label>
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="glass-input text-sm"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0f1419] mb-1">
                    Resume PDF Link
                  </label>
                  <input
                    type="text"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    className="glass-input text-sm"
                    placeholder="https://drive.google.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0f1419] mb-1">
                  Professional Biography
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="glass-input text-sm"
                  placeholder="Share a brief overview of your background, interests, and career ambitions..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0f1419] mb-1">
                  Career Stage (Adapts Portfolio Structure)
                </label>
                <select
                  value={careerStage}
                  onChange={(e) => setCareerStage(e.target.value as CareerStage)}
                  className="glass-input text-sm bg-white"
                >
                  <option value="first-year">1st Year Engineering Student</option>
                  <option value="second-year">2nd Year Engineering Student</option>
                  <option value="third-year">3rd Year Engineering Student</option>
                  <option value="fourth-year">4th Year Engineering Student</option>
                  <option value="job-seeker">Active Tech Job Seeker</option>
                  <option value="professional">Experienced Professional</option>
                  <option value="hr-recruiter">HR / Recruitment Professional</option>
                </select>
              </div>
            </div>
          )}

          {/* 2. EDUCATION TAB */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0]">
                <div>
                  <h2 className="text-xl font-bold text-[#0f1419]">Education &amp; Academics</h2>
                  <p className="text-xs text-[#536471]">Degrees, colleges, CGPA, and coursework</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEducationList([
                      ...educationList,
                      {
                        institution: '',
                        degree: 'B.Tech in Computer Science',
                        field_of_study: '',
                        start_year: '2023',
                        end_year: '2027',
                        grade_cgpa: '9.0',
                        achievements: '',
                      },
                    ])
                  }
                  className="px-3 py-1.5 rounded-xl bg-[#137cc2] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Add Education
                </button>
              </div>

              {educationList.length === 0 ? (
                <div className="text-center py-10 text-xs text-[#536471] bg-[#f8fafc] rounded-2xl border border-dashed border-[#d8e7f0]">
                  No education records yet. Click &quot;Add Education&quot; to highlight your degree.
                </div>
              ) : (
                <div className="space-y-4">
                  {educationList.map((edu, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] space-y-3 relative"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setEducationList(educationList.filter((_, i) => i !== idx))
                        }
                        className="absolute top-4 right-4 text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="grid sm:grid-cols-2 gap-3 pr-8">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#0f1419] mb-1">
                            Institution / College *
                          </label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => {
                              const updated = [...educationList];
                              updated[idx].institution = e.target.value;
                              setEducationList(updated);
                            }}
                            placeholder="e.g. IIT Bombay / NIT Warangal"
                            className="glass-input text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#0f1419] mb-1">
                            Degree &amp; Program *
                          </label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              const updated = [...educationList];
                              updated[idx].degree = e.target.value;
                              setEducationList(updated);
                            }}
                            placeholder="e.g. B.Tech in CSE"
                            className="glass-input text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#0f1419] mb-1">
                            CGPA / Grade
                          </label>
                          <input
                            type="text"
                            value={edu.grade_cgpa || ''}
                            onChange={(e) => {
                              const updated = [...educationList];
                              updated[idx].grade_cgpa = e.target.value;
                              setEducationList(updated);
                            }}
                            placeholder="e.g. 9.2 / 10"
                            className="glass-input text-xs"
                          />
                        </div>

                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="block text-[11px] font-semibold text-[#0f1419] mb-1">
                              Start Year
                            </label>
                            <input
                              type="text"
                              value={edu.start_year || ''}
                              onChange={(e) => {
                                const updated = [...educationList];
                                updated[idx].start_year = e.target.value;
                                setEducationList(updated);
                              }}
                              placeholder="2022"
                              className="glass-input text-xs"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-[11px] font-semibold text-[#0f1419] mb-1">
                              End Year
                            </label>
                            <input
                              type="text"
                              value={edu.end_year || ''}
                              onChange={(e) => {
                                const updated = [...educationList];
                                updated[idx].end_year = e.target.value;
                                setEducationList(updated);
                              }}
                              placeholder="2026"
                              className="glass-input text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#0f1419] mb-1">
                          Key Achievements / Relevant Coursework
                        </label>
                        <input
                          type="text"
                          value={edu.achievements || ''}
                          onChange={(e) => {
                            const updated = [...educationList];
                            updated[idx].achievements = e.target.value;
                            setEducationList(updated);
                          }}
                          placeholder="e.g. DSA, Operating Systems, Dean's Merit List"
                          className="glass-input text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. SKILLS TAB */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0]">
                <div>
                  <h2 className="text-xl font-bold text-[#0f1419]">Skills &amp; Technologies</h2>
                  <p className="text-xs text-[#536471]">
                    Programming languages, frameworks, cloud tools, and soft skills
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSkillsList([
                      ...skillsList,
                      { id: '', profile_id: profileId || '', skill_name: '', category: 'Frontend' },
                    ])
                  }
                  className="px-3 py-1.5 rounded-xl bg-[#137cc2] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Add Skill
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {skillsList.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={s.skill_name}
                      onChange={(e) => {
                        const updated = [...skillsList];
                        updated[idx].skill_name = e.target.value;
                        setSkillsList(updated);
                      }}
                      placeholder="e.g. Next.js / Python"
                      className="glass-input text-xs flex-1"
                    />

                    <select
                      value={s.category || 'General'}
                      onChange={(e) => {
                        const updated = [...skillsList];
                        updated[idx].category = e.target.value;
                        setSkillsList(updated);
                      }}
                      className="glass-input text-xs bg-white w-32"
                    >
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Cloud/DevOps">Cloud/DevOps</option>
                      <option value="Database">Database</option>
                      <option value="Languages">Languages</option>
                      <option value="Tools">Tools</option>
                      <option value="Soft Skills">Soft Skills</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setSkillsList(skillsList.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:text-red-700 cursor-pointer p-1"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. PROJECTS TAB */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0]">
                <div>
                  <h2 className="text-xl font-bold text-[#0f1419]">Projects &amp; Case Studies</h2>
                  <p className="text-xs text-[#536471]">
                    Structured problem, solution, tech stack, and live deployment links
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setProjectsList([
                      ...projectsList,
                      {
                        id: '',
                        profile_id: profileId || '',
                        title: '',
                        description: '',
                        problem: '',
                        solution: '',
                        tech_stack: 'Next.js, TypeScript, Tailwind CSS',
                        contribution: '',
                        live_link: '',
                        github_link: '',
                        display_order: projectsList.length,
                        image_url: '',
                      },
                    ])
                  }
                  className="px-3 py-1.5 rounded-xl bg-[#137cc2] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Add Project
                </button>
              </div>

              {projectsList.length === 0 ? (
                <div className="text-center py-10 text-xs text-[#536471] bg-[#f8fafc] rounded-2xl border border-dashed border-[#d8e7f0]">
                  No projects added yet. Click &quot;Add Project&quot; to showcase your work.
                </div>
              ) : (
                <div className="space-y-6">
                  {projectsList.map((proj, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] space-y-4 relative"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setProjectsList(projectsList.filter((_, i) => i !== idx))
                        }
                        className="absolute top-4 right-4 text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="pr-8">
                        <label className="block text-xs font-bold text-[#0f1419] mb-1">
                          Project Title *
                        </label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => {
                            const updated = [...projectsList];
                            updated[idx].title = e.target.value;
                            setProjectsList(updated);
                          }}
                          placeholder="e.g. Distributed Analytics Engine"
                          className="glass-input text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#0f1419] mb-1">
                          Summary / Description
                        </label>
                        <textarea
                          value={proj.description}
                          onChange={(e) => {
                            const updated = [...projectsList];
                            updated[idx].description = e.target.value;
                            setProjectsList(updated);
                          }}
                          rows={2}
                          placeholder="High-level overview of what the application does..."
                          className="glass-input text-xs"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#0f1419] mb-1">
                            Problem Statement
                          </label>
                          <textarea
                            value={proj.problem || ''}
                            onChange={(e) => {
                              const updated = [...projectsList];
                              updated[idx].problem = e.target.value;
                              setProjectsList(updated);
                            }}
                            rows={2}
                            placeholder="What obstacle, latency or limitation did this address?"
                            className="glass-input text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#0f1419] mb-1">
                            Engineered Solution
                          </label>
                          <textarea
                            value={proj.solution || ''}
                            onChange={(e) => {
                              const updated = [...projectsList];
                              updated[idx].solution = e.target.value;
                              setProjectsList(updated);
                            }}
                            rows={2}
                            placeholder="How did you solve it technically?"
                            className="glass-input text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#0f1419] mb-1">
                            Tech Stack (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={proj.tech_stack || ''}
                            onChange={(e) => {
                              const updated = [...projectsList];
                              updated[idx].tech_stack = e.target.value;
                              setProjectsList(updated);
                            }}
                            placeholder="Next.js, Supabase, Tailwind"
                            className="glass-input text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#0f1419] mb-1">
                            GitHub Link
                          </label>
                          <input
                            type="text"
                            value={proj.github_link || ''}
                            onChange={(e) => {
                              const updated = [...projectsList];
                              updated[idx].github_link = e.target.value;
                              setProjectsList(updated);
                            }}
                            placeholder="https://github.com/..."
                            className="glass-input text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#0f1419] mb-1">
                            Live Demo Link
                          </label>
                          <input
                            type="text"
                            value={proj.live_link || ''}
                            onChange={(e) => {
                              const updated = [...projectsList];
                              updated[idx].live_link = e.target.value;
                              setProjectsList(updated);
                            }}
                            placeholder="https://demo.app"
                            className="glass-input text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#0f1419] mb-1">
                          My Contribution
                        </label>
                        <input
                          type="text"
                          value={proj.contribution || ''}
                          onChange={(e) => {
                            const updated = [...projectsList];
                            updated[idx].contribution = e.target.value;
                            setProjectsList(updated);
                          }}
                          placeholder="e.g. Designed backend database schema and real-time WebSockets"
                          className="glass-input text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. CERTIFICATIONS TAB */}
          {activeTab === 'certifications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0]">
                <div>
                  <h2 className="text-xl font-bold text-[#0f1419]">Certifications &amp; Licenses</h2>
                  <p className="text-xs text-[#536471]">
                    Industry badges, cloud certifications, and achievements
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setCertificationsList([
                      ...certificationsList,
                      {
                        id: '',
                        profile_id: profileId || '',
                        title: '',
                        issuer: '',
                        issue_date: '2024',
                        credential_url: '',
                        display_order: certificationsList.length,
                      },
                    ])
                  }
                  className="px-3 py-1.5 rounded-xl bg-[#137cc2] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Add Certification
                </button>
              </div>

              {certificationsList.length === 0 ? (
                <div className="text-center py-10 text-xs text-[#536471] bg-[#f8fafc] rounded-2xl border border-dashed border-[#d8e7f0]">
                  No certifications added yet.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {certificationsList.map((cert, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] space-y-2 relative"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setCertificationsList(certificationsList.filter((_, i) => i !== idx))
                        }
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#0f1419] mb-1">
                          Certification Title *
                        </label>
                        <input
                          type="text"
                          value={cert.title}
                          onChange={(e) => {
                            const updated = [...certificationsList];
                            updated[idx].title = e.target.value;
                            setCertificationsList(updated);
                          }}
                          placeholder="e.g. AWS Certified Solutions Architect"
                          className="glass-input text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#0f1419] mb-1">
                          Issuing Organization *
                        </label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => {
                            const updated = [...certificationsList];
                            updated[idx].issuer = e.target.value;
                            setCertificationsList(updated);
                          }}
                          placeholder="e.g. Amazon Web Services / Coursera"
                          className="glass-input text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#0f1419] mb-1">
                            Issue Date
                          </label>
                          <input
                            type="text"
                            value={cert.issue_date || ''}
                            onChange={(e) => {
                              const updated = [...certificationsList];
                              updated[idx].issue_date = e.target.value;
                              setCertificationsList(updated);
                            }}
                            placeholder="e.g. Oct 2024"
                            className="glass-input text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#0f1419] mb-1">
                            Verification URL
                          </label>
                          <input
                            type="text"
                            value={cert.credential_url || ''}
                            onChange={(e) => {
                              const updated = [...certificationsList];
                              updated[idx].credential_url = e.target.value;
                              setCertificationsList(updated);
                            }}
                            placeholder="https://..."
                            className="glass-input text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 6. WORK EXPERIENCE TAB */}
          {activeTab === 'experience' && showExperience && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0]">
                <div>
                  <h2 className="text-xl font-bold text-[#0f1419]">Work Experience &amp; Internships</h2>
                  <p className="text-xs text-[#536471]">
                    Roles, companies, impact metrics, and key milestones
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setExperiencesList([
                      ...experiencesList,
                      {
                        role: 'Software Engineer',
                        company: '',
                        duration: '2023 - Present',
                        bullet_points: ['Built scalable microservices and APIs'],
                      },
                    ])
                  }
                  className="px-3 py-1.5 rounded-xl bg-[#137cc2] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Add Role
                </button>
              </div>

              {experiencesList.length === 0 ? (
                <div className="text-center py-10 text-xs text-[#536471] bg-[#f8fafc] rounded-2xl border border-dashed border-[#d8e7f0]">
                  No experience entries yet. Click &quot;Add Role&quot; to document your positions.
                </div>
              ) : (
                <div className="space-y-4">
                  {experiencesList.map((exp, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] space-y-3 relative"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setExperiencesList(experiencesList.filter((_, i) => i !== idx))
                        }
                        className="absolute top-4 right-4 text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="grid sm:grid-cols-3 gap-3 pr-8">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#0f1419] mb-1">
                            Role / Job Title *
                          </label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => {
                              const updated = [...experiencesList];
                              updated[idx].role = e.target.value;
                              setExperiencesList(updated);
                            }}
                            placeholder="e.g. Full-Stack Engineer"
                            className="glass-input text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#0f1419] mb-1">
                            Company / Organization *
                          </label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              const updated = [...experiencesList];
                              updated[idx].company = e.target.value;
                              setExperiencesList(updated);
                            }}
                            placeholder="e.g. Acme Tech"
                            className="glass-input text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#0f1419] mb-1">
                            Duration
                          </label>
                          <input
                            type="text"
                            value={exp.duration}
                            onChange={(e) => {
                              const updated = [...experiencesList];
                              updated[idx].duration = e.target.value;
                              setExperiencesList(updated);
                            }}
                            placeholder="e.g. Jan 2023 - Present"
                            className="glass-input text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#0f1419] mb-1">
                          Key Bullet Points (one per line)
                        </label>
                        <textarea
                          rows={3}
                          value={exp.bullet_points?.join('\n') || ''}
                          onChange={(e) => {
                            const updated = [...experiencesList];
                            updated[idx].bullet_points = e.target.value
                              .split('\n')
                              .filter((line) => line.trim().length > 0);
                            setExperiencesList(updated);
                          }}
                          placeholder="• Reduced API latency by 35% through Redis caching..."
                          className="glass-input text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 7. SOCIAL & CONTACT TAB */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0]">
                <div>
                  <h2 className="text-xl font-bold text-[#0f1419]">Social Links &amp; Contact</h2>
                  <p className="text-xs text-[#536471]">
                    GitHub, LinkedIn, Twitter, and professional portfolio links
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSocialLinksList([
                      ...socialLinksList,
                      { id: '', profile_id: profileId || '', platform: 'GitHub', url: '' },
                    ])
                  }
                  className="px-3 py-1.5 rounded-xl bg-[#137cc2] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Add Link
                </button>
              </div>

              <div className="space-y-3">
                {socialLinksList.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center gap-3"
                  >
                    <select
                      value={s.platform}
                      onChange={(e) => {
                        const updated = [...socialLinksList];
                        updated[idx].platform = e.target.value;
                        setSocialLinksList(updated);
                      }}
                      className="glass-input text-xs bg-white w-36"
                    >
                      <option value="GitHub">GitHub</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Twitter">Twitter / X</option>
                      <option value="LeetCode">LeetCode</option>
                      <option value="Codeforces">Codeforces</option>
                      <option value="Email">Email</option>
                      <option value="Website">Personal Website</option>
                    </select>

                    <input
                      type="text"
                      value={s.url}
                      onChange={(e) => {
                        const updated = [...socialLinksList];
                        updated[idx].url = e.target.value;
                        setSocialLinksList(updated);
                      }}
                      placeholder="https://..."
                      className="glass-input text-xs flex-1"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setSocialLinksList(socialLinksList.filter((_, i) => i !== idx))
                      }
                      className="text-red-500 hover:text-red-700 cursor-pointer p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. VIBE & EXPERIENCE TAB */}
          {activeTab === 'vibe' && (
            <div className="space-y-8">
              <div className="pb-4 border-b border-[#e2e8f0]">
                <h2 className="text-xl font-bold text-[#0f1419] flex items-center gap-2">
                  <Sliders size={20} className="text-[#137cc2]" /> Vibe, Motion &amp; Atmosphere
                </h2>
                <p className="text-xs text-[#536471] mt-0.5">
                  Configure visual atmosphere, text reveal speed, motion style, and typography.
                  These preferences directly control your portfolio rendering and AI portfolio generation.
                </p>
              </div>

              {/* SECTION A: TEXT SPEED */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-[#0f1419] flex items-center gap-1.5 uppercase tracking-wider">
                      <Gauge size={14} className="text-[#137cc2]" /> Text Typing &amp; Reveal Speed
                    </label>
                    <p className="text-[11px] text-[#536471]">
                      Visibly controls the typing effect and animated reveal timing for headlines and titles.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#f1f5f9] text-[#137cc2] font-semibold border border-[#e2e8f0]">
                    Current: {animationSpeed.toUpperCase()}
                  </span>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'slow',
                      label: 'Slow (1.2s)',
                      sub: 'Dramatic & Measured',
                      desc: 'Ideal for executive & formal presentations with deliberate impact.',
                      tag: '1.2s base reveal',
                    },
                    {
                      id: 'normal',
                      label: 'Normal (0.6s)',
                      sub: 'Smooth & Balanced',
                      desc: 'Optimal clarity and natural cadence for general engineering portfolios.',
                      tag: '0.6s base reveal',
                    },
                    {
                      id: 'fast',
                      label: 'Fast (0.3s)',
                      sub: 'Snappy & Rapid',
                      desc: 'High velocity transitions designed for quick recruiter browsing.',
                      tag: '0.3s base reveal',
                    },
                  ].map((speed) => {
                    const isSelected = animationSpeed === speed.id;
                    return (
                      <button
                        key={speed.id}
                        type="button"
                        onClick={() => {
                          setAnimationSpeed(speed.id as any);
                          setPreviewMotionKey((k) => k + 1);
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#137cc2] bg-[#E3ECF6]/40 shadow-xs ring-2 ring-[#137cc2]/20'
                            : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1] hover:bg-[#f8fafc]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-[#0f1419]">{speed.label}</span>
                            {isSelected && <CheckCircle2 size={14} className="text-[#137cc2]" />}
                          </div>
                          <span className="text-[11px] font-semibold text-[#137cc2] block mb-1">
                            {speed.sub}
                          </span>
                          <p className="text-[11px] text-[#536471] leading-relaxed">{speed.desc}</p>
                        </div>
                        <span className="mt-3 text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white border border-[#e2e8f0] w-max text-[#64748b]">
                          {speed.tag}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION B: MOTION STYLE */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#0f1419] flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles size={14} className="text-[#137cc2]" /> Motion &amp; Entry Animation Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'fade', label: 'Smooth Fade', desc: 'Clean opacity transition' },
                    { id: 'slide-up', label: 'Slide Up', desc: 'Modern elevation entry' },
                    { id: 'glitch', label: 'Cyber Glitch', desc: 'High-tech scanner effect' },
                    { id: 'liquid-reveal', label: 'Liquid Reveal', desc: 'Organic fluid scaling' },
                    { id: 'blur-reveal', label: 'Lens Blur', desc: 'Depth-of-field soft focus' },
                    { id: 'rotate-in', label: '3D Perspective', desc: 'Subtle rotational entry' },
                  ].map((style) => {
                    const isSelected = animationStyle === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => {
                          setAnimationStyle(style.id as any);
                          setPreviewMotionKey((k) => k + 1);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#137cc2] bg-[#E3ECF6]/40 shadow-xs ring-1 ring-[#137cc2]'
                            : 'border-[#e2e8f0] bg-white hover:bg-[#f8fafc]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <strong className="text-xs font-bold text-[#0f1419]">{style.label}</strong>
                          {isSelected && <CheckCircle2 size={13} className="text-[#137cc2]" />}
                        </div>
                        <span className="text-[10px] text-[#536471]">{style.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION C: VISUAL ATMOSPHERE / BACKGROUND */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#0f1419] flex items-center gap-1.5 uppercase tracking-wider">
                  <Layers size={14} className="text-[#137cc2]" /> Visual Atmosphere (Background Effect)
                </label>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'mesh-gradient',
                      label: 'Mesh Gradient',
                      desc: 'Vibrant, smooth modern ambient light mesh.',
                    },
                    {
                      id: 'particles',
                      label: 'Constellation Particles',
                      desc: 'Subtle floating geometric nodes & connections.',
                    },
                    {
                      id: 'cyber-grid',
                      label: 'Cyber Grid',
                      desc: 'Perspective 3D retro-futuristic coordinate grid.',
                    },
                    {
                      id: 'aurora',
                      label: 'Aurora Glow',
                      desc: 'Ethereal glowing color waves flowing across view.',
                    },
                    {
                      id: 'matrix',
                      label: 'Matrix Code Stream',
                      desc: 'Vertical cascading digital binary streams.',
                    },
                    {
                      id: 'none',
                      label: 'Minimal Clean',
                      desc: 'Pure crisp white background without ambient effects.',
                    },
                  ].map((bg) => {
                    const isSelected = backgroundEffect === bg.id;
                    return (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() => setBackgroundEffect(bg.id as any)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#137cc2] bg-[#E3ECF6]/40 shadow-xs ring-1 ring-[#137cc2]'
                            : 'border-[#e2e8f0] bg-white hover:bg-[#f8fafc]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <strong className="text-xs font-bold text-[#0f1419]">{bg.label}</strong>
                          {isSelected && <CheckCircle2 size={13} className="text-[#137cc2]" />}
                        </div>
                        <p className="text-[11px] text-[#536471] leading-relaxed">{bg.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION D: TYPOGRAPHY & BRAND ACCENT COLOR */}
              <div className="grid sm:grid-cols-2 gap-6 pt-2">
                {/* Font Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0f1419] uppercase tracking-wider block">
                    Typography Font Family
                  </label>
                  <select
                    value={customFont}
                    onChange={(e) => setCustomFont(e.target.value)}
                    className="glass-input text-xs bg-white w-full font-medium"
                  >
                    {[
                      'Plus Jakarta Sans',
                      'Space Grotesk',
                      'Inter',
                      'Outfit',
                      'Syncopate',
                      'JetBrains Mono',
                      'Fira Code',
                    ].map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-[#536471]">
                    Applied across headline banners, titles, and section headers.
                  </p>
                </div>

                {/* Accent Color */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0f1419] uppercase tracking-wider flex items-center gap-1.5">
                    <Palette size={13} className="text-[#137cc2]" /> Theme Accent Color
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[
                      { hex: '#137cc2', label: 'Persona Sky' },
                      { hex: '#0284c7', label: 'Vivid Blue' },
                      { hex: '#0f1419', label: 'Obsidian' },
                      { hex: '#10b981', label: 'Emerald' },
                      { hex: '#6366f1', label: 'Indigo' },
                      { hex: '#8b5cf6', label: 'Violet' },
                      { hex: '#f59e0b', label: 'Amber' },
                      { hex: '#06b6d4', label: 'Cyan' },
                    ].map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setThemeColor(c.hex)}
                        className={`w-7 h-7 rounded-xl transition-all cursor-pointer shrink-0 border ${
                          themeColor === c.hex ? 'scale-115 ring-2 ring-[#0f1419]' : 'border-black/10 hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.label}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] font-mono text-[#536471]">Hex:</span>
                    <input
                      type="text"
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="glass-input text-xs w-28 font-mono bg-white uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION E: LIVE MOTION & SPEED PREVIEW SANDBOX */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#f8fafc] to-[#E3ECF6]/30 border border-[#d8e7f0] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0f1419] flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#137cc2]" /> Live Text Speed &amp; Motion Sandbox
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewMotionKey((k) => k + 1)}
                    className="px-2.5 py-1 rounded-lg border border-[#d8e7f0] bg-white hover:bg-[#f1f5f9] text-[11px] font-semibold text-[#0f1419] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RotateCcw size={12} /> Replay Animation
                  </button>
                </div>

                <div
                  key={previewMotionKey}
                  className="p-6 rounded-xl bg-white border border-[#e2e8f0] shadow-2xs space-y-2 overflow-hidden"
                  style={{ fontFamily: customFont }}
                >
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: animationStyle === 'slide-up' ? 20 : 0,
                      scale: animationStyle === 'liquid-reveal' ? 0.9 : 1,
                      filter: animationStyle === 'blur-reveal' ? 'blur(8px)' : 'none',
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      filter: 'none',
                    }}
                    transition={{
                      duration: animationSpeed === 'slow' ? 1.2 : animationSpeed === 'fast' ? 0.3 : 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="space-y-1.5"
                  >
                    <span
                      className="text-[11px] font-bold uppercase tracking-wider block"
                      style={{ color: themeColor }}
                    >
                      {activeThemePack.replace('-', ' ')} • {animationSpeed.toUpperCase()} MOTION (
                      {animationSpeed === 'slow' ? '1.2s' : animationSpeed === 'fast' ? '0.3s' : '0.6s'})
                    </span>
                    <h3 className="text-2xl font-extrabold text-[#0f1419] tracking-tight">
                      {fullName || 'Alex Morgan'}
                    </h3>
                    <p className="text-sm font-semibold text-[#536471]">
                      {headline || professionalTitle || 'Full-Stack Systems Engineer &amp; Designer'}
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </main>
    </div>
  );
}
