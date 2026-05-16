'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { UserPlus, Eye, EyeOff, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminSignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [slug, setSlug] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    if (!slug.trim()) {
      setError('Portfolio slug is required.');
      setLoading(false);
      return;
    }

    // 1. Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (!authData.user) {
      setError('Failed to create account. Please try again.');
      setLoading(false);
      return;
    }

    // 2. Check if a profile with this slug already exists (seed data)
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, user_id')
      .eq('slug', slug.toLowerCase())
      .single();

    if (existingProfile && !existingProfile.user_id) {
      // Claim the existing seed profile by linking user_id
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ user_id: authData.user.id })
        .eq('id', existingProfile.id);

      if (updateError) {
        setError('Account created but failed to link profile: ' + updateError.message);
        setLoading(false);
        return;
      }
    } else if (existingProfile && existingProfile.user_id) {
      setError('This slug is already taken by another user. Choose a different one.');
      setLoading(false);
      return;
    } else {
      // 3. Create a brand new profile
      const { error: profileError } = await supabase.from('profiles').insert({
        user_id: authData.user.id,
        slug: slug.toLowerCase(),
        full_name: fullName,
        professional_title: '',
        bio: '',
        theme_color: '#6366f1',
      });

      if (profileError) {
        setError('Account created but failed to create profile: ' + profileError.message);
        setLoading(false);
        return;
      }
    }

    setSuccess(
      'Account created successfully! Check your email for a confirmation link, then sign in.'
    );
    setLoading(false);

    // Auto-redirect to login after 3 seconds
    setTimeout(() => {
      router.push('/admin/login');
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="blob blob-1"
          style={{
            width: '500px',
            height: '500px',
            background:
              'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)',
            top: '-15%',
            right: '-10%',
          }}
        />
        <div
          className="blob blob-2"
          style={{
            width: '400px',
            height: '400px',
            background:
              'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
            bottom: '5%',
            left: '-10%',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-400 mb-6">
            <Sparkles size={14} className="text-emerald-400" />
            Join the Team
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Create Account</h1>
          <p className="text-slate-500">
            Sign up to build and manage your portfolio
          </p>
        </div>

        {/* Signup Card */}
        <div className="glass-card-static p-8">
          <form onSubmit={handleSignup} className="space-y-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-slate-400 mb-2"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="glass-input"
                placeholder="e.g., Meharaj"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-slate-400 mb-2"
              >
                Portfolio Slug
              </label>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) =>
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
                }
                className="glass-input"
                placeholder="e.g., meharaj"
                required
              />
              <p className="text-slate-600 text-xs mt-1">
                Your portfolio URL: /portfolio/{slug || 'your-slug'}
                {' '}— If a seed profile exists with this slug, it will be linked to your account.
              </p>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-400 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-400 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input pr-11"
                  placeholder="Min. 6 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-400 mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="glass-input"
                placeholder="Re-enter your password"
                required
              />
            </div>

            {/* Error */}
            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3">
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center"
              style={{
                background: 'linear-gradient(135deg, #10b981, #6366f1)',
              }}
            >
              {loading ? (
                <div className="loading-spinner !w-5 !h-5" />
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}
              <Link
                href="/admin/login"
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-400 text-sm transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
