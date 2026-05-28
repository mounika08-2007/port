'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { ExternalLink } from 'lucide-react';
import type { Profile } from '@/types/database.types';
import VibeControlsContainer from '@/components/admin/VibeControlsContainer';

export default function AdminVibePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profile, setProfile] = useState<Partial<Profile>>({
    animation_style: 'fade',
    animation_speed: 'normal',
    background_effect: 'mesh-gradient',
    layout_variant: 'classic',
    custom_font: 'Plus Jakarta Sans',
    experiences: [],
    testimonials: [],
    theme_color: '#6366f1'
  });

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
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSave = async (updatedProfile: Partial<Profile>) => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        animation_style: updatedProfile.animation_style,
        animation_speed: updatedProfile.animation_speed,
        background_effect: updatedProfile.background_effect,
        layout_variant: updatedProfile.layout_variant,
        custom_font: updatedProfile.custom_font,
        experiences: updatedProfile.experiences,
        testimonials: updatedProfile.testimonials
      })
      .eq('user_id', user.id);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Visual studio parameters committed successfully!' });
      setProfile(updatedProfile); // Sync local state
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Visual studio Header actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Vibe & Experience Controls</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your live portfolio entry animations, fonts, layouts, and recommendations.
          </p>
        </div>
        {profile.slug && (
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

      {/* Save Notification messages */}
      {message.text && (
        <div
          className={`px-4 py-3 rounded-xl text-sm border ${
            message.type === 'error'
              ? 'bg-red-500/10 border-red-500/20 text-red-400'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Render the visual controls dashboard */}
      <div className="glass-card-static p-8">
        <VibeControlsContainer 
          profile={profile} 
          saving={saving} 
          onSave={handleSave} 
        />
      </div>
    </div>
  );
}
