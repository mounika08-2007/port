'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Layers,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Tag,
  User,
  Mail,
  Loader2,
  Check,
  BadgeAlert,
} from 'lucide-react';
import type { ThemePack, CareerStage, UserEntitlement } from '@/types/database.types';
import { createClient } from '@/lib/supabase';
import { activateDemoPack, fetchUserEntitlements } from '@/lib/themePacks';
import ThemePackThumbnail from '@/components/packs/ThemePackThumbnail';

interface CheckoutClientProps {
  pack: ThemePack;
}

export default function CheckoutClient({ pack }: CheckoutClientProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string } | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Inline auth state if not signed in
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [slug, setSlug] = useState('');
  const [careerStage, setCareerStage] = useState<CareerStage>('first-year');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Checkout activation state
  const [activating, setActivating] = useState(false);
  const [activationSuccess, setActivationSuccess] = useState<UserEntitlement | null>(null);
  const [checkoutError, setCheckoutError] = useState('');

  // Check current session
  useEffect(() => {
    const supabase = createClient();
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && user.email) {
        setCurrentUser({ id: user.id, email: user.email });
        const ents = await fetchUserEntitlements(user.id);
        const existing = ents.find((e) => e.pack_slug === pack.slug);
        if (existing) {
          setActivationSuccess(existing);
        }
      }
      setLoadingAuth(false);
    };

    checkUser();
  }, [pack.slug]);

  // Handle inline sign-in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user || !data.user.email) {
        setAuthError(error?.message || 'Login failed. Please verify your credentials.');
        setAuthLoading(false);
        return;
      }

      setCurrentUser({ id: data.user.id, email: data.user.email });
      setAuthLoading(false);
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Login failed');
      setAuthLoading(false);
    }
  };

  // Handle inline sign-up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      setAuthLoading(false);
      return;
    }

    const assignedSlug =
      slug.trim() ||
      fullName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-') ||
      `user-${Date.now().toString(36)}`;

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error || !data.user || !data.user.email) {
        setAuthError(error?.message || 'Registration failed. Try again.');
        setAuthLoading(false);
        return;
      }

      try {
        await supabase.from('profiles').insert({
          user_id: data.user.id,
          full_name: fullName.trim() || 'Portfolio Creator',
          slug: assignedSlug,
          career_stage: careerStage,
          active_theme_pack: pack.slug,
          is_published: false,
        });
      } catch (err) {
        console.warn('Profile creation fallback:', err);
      }

      setCurrentUser({ id: data.user.id, email: data.user.email });
      setAuthLoading(false);
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Registration failed');
      setAuthLoading(false);
    }
  };

  // Handle Plan Activation
  const handleActivatePlan = async () => {
    if (!currentUser) return;
    setActivating(true);
    setCheckoutError('');

    try {
      const result = await activateDemoPack({
        userId: currentUser.id,
        packSlug: pack.slug,
        userEmail: currentUser.email,
      });

      if (!result.success) {
        setCheckoutError(result.error || 'Failed to activate plan.');
        setActivating(false);
        return;
      }

      setActivationSuccess(result.entitlement);
      setActivating(false);
    } catch (err: unknown) {
      setCheckoutError(err instanceof Error ? err.message : 'Unexpected activation failure');
      setActivating(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#ffffff] text-[#0f1419] py-10 px-6 selection:bg-[#137cc2]/15">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-[15%] right-[-10%] w-[650px] h-[650px] rounded-full"
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

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#e1e8ed]">
          <Link
            href="/packs"
            className="flex items-center gap-2 text-sm font-semibold text-[#536471] hover:text-[#137cc2] transition-colors"
          >
            <ArrowLeft size={16} /> Back to Theme Packs
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-[#f1f5f9] text-[#536471] font-semibold border border-[#e2e8f0]">
              Persona Flow Checkout
            </span>
          </div>
        </div>

        {/* Success Confirmation Card */}
        {activationSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl bg-white border border-[#10b981]/50 p-8 md:p-10 shadow-lg space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#10b981]/10 text-[#10b981] flex items-center justify-center shrink-0">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <span className="px-3 py-0.5 rounded-full bg-[#10b981]/10 text-[#10b981] text-xs font-bold uppercase tracking-wider">
                  Plan Activated
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#0f1419] mt-1">
                  You&apos;re Ready to Build Your Portfolio
                </h2>
              </div>
            </div>

            {/* Receipt Summary */}
            <div className="p-6 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] space-y-3 text-sm">
              <div className="flex justify-between pb-3 border-b border-[#e2e8f0]">
                <span className="text-[#536471]">Selected Plan</span>
                <strong className="text-[#0f1419]">{pack.name}</strong>
              </div>
              <div className="flex justify-between pb-3 border-b border-[#e2e8f0]">
                <span className="text-[#536471]">Catalog Listed Price</span>
                <span className="text-[#536471] line-through">₹{activationSuccess.listed_price_inr}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-[#e2e8f0]">
                <span className="text-[#536471]">Promotional Waiver</span>
                <span className="text-[#10b981] font-semibold">-100% Free Access</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-[#e2e8f0]">
                <span className="text-[#0f1419] font-bold">Total Amount Due</span>
                <strong className="text-lg text-[#10b981]">₹{activationSuccess.amount_paid_inr}.00</strong>
              </div>
              <div className="flex justify-between pb-3 border-b border-[#e2e8f0]">
                <span className="text-[#536471]">Transaction Reference</span>
                <span className="font-mono text-xs text-[#137cc2]">{activationSuccess.transaction_ref}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#536471]">Plan Status</span>
                <span className="px-2 py-0.5 rounded bg-[#10b981]/10 text-[#10b981] text-xs font-bold uppercase">
                  {activationSuccess.status} (Verified)
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] text-xs text-[#065f46] flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#10b981] shrink-0" />
              <span>Theme pack activated successfully! Create, manage, and publish your portfolios in your <strong>User Portfolios</strong> dashboard.</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/admin/portfolios"
                className="flex-1 py-4 px-6 rounded-xl bg-[#137cc2] hover:bg-[#0f66a0] text-white font-bold text-center transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                Proceed to User Portfolios <ArrowRight size={18} />
              </Link>
              <Link
                href="/packs"
                className="py-4 px-6 rounded-xl border border-[#d8e7f0] text-[#536471] hover:text-[#0f1419] hover:bg-[#f8fafc] text-center font-medium transition-colors"
              >
                View Other Plans
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Checkout Grid */
          <div className="grid md:grid-cols-12 gap-8">
            {/* Left Column: Plan Summary */}
            <div className="md:col-span-5 space-y-6">
              <div className="rounded-3xl bg-white border border-[#d8e7f0] p-6 shadow-sm space-y-5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#536471]">
                  Selected Theme Pack
                </span>

                <ThemePackThumbnail packSlug={pack.slug} packName={pack.name} />

                <div>
                  <h3 className="text-xl font-bold text-[#0f1419]">{pack.name}</h3>
                  <p className="text-xs text-[#536471] mt-1 leading-relaxed">{pack.tagline}</p>
                </div>

                {/* Price Breakdown */}
                <div className="pt-4 border-t border-[#e2e8f0] space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#536471]">Listed Price</span>
                    <span className="font-semibold text-[#0f1419]">₹{pack.listed_price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#536471]">Promotional Discount</span>
                    <span className="font-semibold text-[#10b981]">-₹{pack.listed_price} (100% OFF)</span>
                  </div>
                  <div className="pt-3 border-t border-[#e2e8f0] flex justify-between items-baseline">
                    <span className="text-sm font-bold text-[#0f1419]">Amount Due Today</span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-[#137cc2]">₹0</span>
                      <span className="text-[10px] text-[#536471] block">No credit card required</span>
                    </div>
                  </div>
                </div>

                {/* Features included */}
                <div className="pt-4 border-t border-[#e2e8f0]">
                  <span className="text-[11px] font-bold text-[#0f1419] block mb-2">
                    Included with this pack:
                  </span>
                  <div className="space-y-1.5">
                    {pack.features.slice(0, 4).map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#536471]">
                        <Check size={13} className="text-[#10b981]" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: User Auth & Activation Confirmation */}
            <div className="md:col-span-7 space-y-6">
              {loadingAuth ? (
                <div className="rounded-3xl bg-white border border-[#d8e7f0] p-12 text-center shadow-sm">
                  <Loader2 size={32} className="animate-spin text-[#137cc2] mx-auto mb-3" />
                  <p className="text-xs text-[#536471]">Loading account status...</p>
                </div>
              ) : currentUser ? (
                /* Authenticated User State */
                <div className="rounded-3xl bg-white border border-[#d8e7f0] p-8 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 pb-6 border-b border-[#e2e8f0]">
                    <div className="w-12 h-12 rounded-full bg-[#E3ECF6] text-[#137cc2] flex items-center justify-center font-bold text-lg">
                      {currentUser.email[0].toUpperCase()}
                    </div>
                    <div>
                      <span className="text-xs text-[#536471] block">Signed in as</span>
                      <strong className="text-sm text-[#0f1419]">{currentUser.email}</strong>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#0f1419] mb-1">
                      Confirm Plan Activation
                    </h3>
                    <p className="text-xs text-[#536471] leading-relaxed">
                      Click below to activate the {pack.name}. Your creator dashboard will be unlocked
                      immediately with full access.
                    </p>
                  </div>

                  {checkoutError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
                      <BadgeAlert size={16} />
                      <span>{checkoutError}</span>
                    </div>
                  )}

                  <button
                    onClick={handleActivatePlan}
                    disabled={activating}
                    className="w-full py-4 px-6 rounded-xl bg-[#137cc2] hover:bg-[#0f66a0] text-white font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-md disabled:opacity-60 cursor-pointer"
                  >
                    {activating ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Activating Plan...
                      </>
                    ) : (
                      <>
                        Activate Plan <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-[#536471]">
                    Access will be immediately linked to your Persona Flow account.
                  </p>
                </div>
              ) : (
                /* Unauthenticated User: Quick Sign Up or Sign In */
                <div className="rounded-3xl bg-white border border-[#d8e7f0] p-8 shadow-sm space-y-6">
                  {/* Tabs */}
                  <div className="flex rounded-xl bg-[#f1f5f9] p-1 border border-[#e2e8f0]">
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        authMode === 'signup'
                          ? 'bg-white text-[#137cc2] shadow-xs'
                          : 'text-[#536471] hover:text-[#0f1419]'
                      }`}
                    >
                      Quick Sign Up
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode('signin')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        authMode === 'signin'
                          ? 'bg-white text-[#137cc2] shadow-xs'
                          : 'text-[#536471] hover:text-[#0f1419]'
                      }`}
                    >
                      Existing User Login
                    </button>
                  </div>

                  {authError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
                      <BadgeAlert size={16} />
                      <span>{authError}</span>
                    </div>
                  )}

                  {authMode === 'signup' ? (
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#0f1419] mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="glass-input text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#0f1419] mb-1.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="student@college.edu"
                          className="glass-input text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#0f1419] mb-1.5">
                          Password (min 6 characters)
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="glass-input text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#0f1419] mb-1.5">
                          Career Stage
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

                      <div>
                        <label className="block text-xs font-semibold text-[#0f1419] mb-1.5">
                          Desired Portfolio Slug (optional)
                        </label>
                        <div className="flex items-center gap-1.5 text-xs text-[#536471]">
                          <span>/portfolio/</span>
                          <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="rahul-sharma"
                            className="glass-input text-sm flex-1"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full py-3.5 px-4 rounded-xl bg-[#137cc2] hover:bg-[#0f66a0] text-white font-bold text-sm transition-colors shadow-xs disabled:opacity-60 cursor-pointer"
                      >
                        {authLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 size={16} className="animate-spin" /> Creating Account...
                          </span>
                        ) : (
                          'Sign Up & Continue'
                        )}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#0f1419] mb-1.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="glass-input text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#0f1419] mb-1.5">
                          Password
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="glass-input text-sm"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full py-3.5 px-4 rounded-xl bg-[#137cc2] hover:bg-[#0f66a0] text-white font-bold text-sm transition-colors shadow-xs disabled:opacity-60 cursor-pointer"
                      >
                        {authLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 size={16} className="animate-spin" /> Logging In...
                          </span>
                        ) : (
                          'Log In & Continue'
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
