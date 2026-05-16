'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { Save, Upload, User, ExternalLink } from 'lucide-react';
import type { Profile } from '@/types/database.types';

export default function AdminProfilePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profile, setProfile] = useState<Partial<Profile>>({
    slug: '',
    full_name: '',
    professional_title: '',
    avatar_url: '',
    bio: '',
    resume_url: '',
    theme_color: '#6366f1',
  });
  const [profileExists, setProfileExists] = useState(false);

  const loadProfile = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setProfile(data);
      setProfileExists(true);
    } else {
      setProfile((prev) => ({ ...prev, user_id: user.id }));
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      user_id: user.id,
      slug: profile.slug,
      full_name: profile.full_name,
      professional_title: profile.professional_title,
      avatar_url: profile.avatar_url,
      bio: profile.bio,
      resume_url: profile.resume_url,
      theme_color: profile.theme_color,
    };

    let error;
    if (profileExists) {
      ({ error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('user_id', user.id));
    } else {
      ({ error } = await supabase.from('profiles').insert(payload));
    }

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Profile saved successfully!' });
      setProfileExists(true);
    }
    setSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `avatars/${user.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-assets')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      setMessage({ type: 'error', text: uploadError.message });
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('portfolio-assets').getPublicUrl(fileName);

    setProfile((prev) => ({ ...prev, avatar_url: publicUrl }));
    setUploading(false);
    setMessage({ type: 'success', text: 'Avatar uploaded! Remember to save your profile.' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Profile Settings</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your portfolio profile information
          </p>
        </div>
        {profile.slug && profileExists && (
          <a
            href={`/portfolio/${profile.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            <ExternalLink size={16} />
            View Portfolio
          </a>
        )}
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`mb-6 px-4 py-3 rounded-xl text-sm border ${
            message.type === 'error'
              ? 'bg-red-500/10 border-red-500/20 text-red-400'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Form */}
      <div className="glass-card-static p-8 space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 bg-white/5">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={28} className="text-slate-600" />
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="btn-ghost cursor-pointer">
              <Upload size={16} />
              {uploading ? 'Uploading...' : 'Upload Avatar'}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            <p className="text-slate-600 text-xs mt-2">JPG, PNG or WebP. Max 2MB.</p>
          </div>
        </div>

        {/* Fields Grid */}
        <div className="grid gap-5 md:grid-cols-2">
          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-slate-400 mb-2">
              Portfolio Slug *
            </label>
            <input
              id="slug"
              type="text"
              value={profile.slug || ''}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                }))
              }
              className="glass-input"
              placeholder="e.g., meharaj"
            />
            <p className="text-slate-600 text-xs mt-1">
              Your portfolio will be at /portfolio/{profile.slug || 'your-slug'}
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-400 mb-2">
              Full Name *
            </label>
            <input
              id="fullName"
              type="text"
              value={profile.full_name || ''}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, full_name: e.target.value }))
              }
              className="glass-input"
              placeholder="Your full name"
            />
          </div>

          {/* Professional Title */}
          <div>
            <label
              htmlFor="profTitle"
              className="block text-sm font-medium text-slate-400 mb-2"
            >
              Professional Title
            </label>
            <input
              id="profTitle"
              type="text"
              value={profile.professional_title || ''}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, professional_title: e.target.value }))
              }
              className="glass-input"
              placeholder="e.g., Full-Stack Developer"
            />
          </div>

          {/* Theme Color */}
          <div>
            <label
              htmlFor="themeColor"
              className="block text-sm font-medium text-slate-400 mb-2"
            >
              Theme Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={profile.theme_color || '#6366f1'}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, theme_color: e.target.value }))
                }
                className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent"
              />
              <input
                id="themeColor"
                type="text"
                value={profile.theme_color || '#6366f1'}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, theme_color: e.target.value }))
                }
                className="glass-input flex-1"
                placeholder="#6366f1"
              />
            </div>
          </div>
        </div>

        {/* Resume URL */}
        <div>
          <label htmlFor="resumeUrl" className="block text-sm font-medium text-slate-400 mb-2">
            Resume URL
          </label>
          <input
            id="resumeUrl"
            type="url"
            value={profile.resume_url || ''}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, resume_url: e.target.value }))
            }
            className="glass-input"
            placeholder="https://drive.google.com/..."
          />
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-slate-400 mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            value={profile.bio || ''}
            onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
            className="glass-textarea"
            placeholder="Tell the world about yourself..."
            rows={4}
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? (
              <div className="loading-spinner !w-5 !h-5" />
            ) : (
              <>
                <Save size={18} />
                Save Profile
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
