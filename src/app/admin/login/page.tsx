'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { LogIn, Eye, EyeOff, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh();
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
            background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
            top: '-15%',
            right: '-10%',
          }}
        />
        <div
          className="blob blob-2"
          style={{
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
            bottom: '5%',
            left: '-10%',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo / Heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-400 mb-6">
            <Sparkles size={14} className="text-indigo-400" />
            Admin Panel
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
          <p className="text-slate-500">Sign in to manage your portfolio</p>
        </div>

        {/* Login Card */}
        <div className="glass-card-static p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-2">
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
              <label htmlFor="password" className="block text-sm font-medium text-slate-400 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input pr-11"
                  placeholder="••••••••"
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

            {/* Error */}
            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center"
            >
              {loading ? (
                <div className="loading-spinner !w-5 !h-5" />
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>
          {/* Signup link */}
          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              Don&apos;t have an account?{' '}
              <Link
                href="/admin/signup"
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
