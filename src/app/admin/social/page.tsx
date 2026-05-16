'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { Plus, Trash2, Share2 } from 'lucide-react';
import type { SocialLink } from '@/types/database.types';

const PLATFORMS = [
  'GitHub',
  'LinkedIn',
  'Twitter',
  'X',
  'Instagram',
  'YouTube',
  'Website',
  'Email',
  'Dribbble',
  'Behance',
  'Medium',
  'Dev.to',
];

export default function AdminSocialPage() {
  const supabase = createClient();
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [newPlatform, setNewPlatform] = useState('GitHub');
  const [newUrl, setNewUrl] = useState('');

  const loadLinks = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      setLoading(false);
      return;
    }

    setProfileId(profile.id);

    const { data } = await supabase
      .from('social_links')
      .select('*')
      .eq('profile_id', profile.id)
      .order('platform', { ascending: true });

    setLinks(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  const addLink = async () => {
    if (!newUrl.trim() || !profileId) return;

    const { data, error } = await supabase
      .from('social_links')
      .insert({
        profile_id: profileId,
        platform: newPlatform,
        url: newUrl.trim(),
      })
      .select()
      .single();

    if (error) {
      setMessage({ type: 'error', text: error.message });
      return;
    }

    setLinks((prev) => [...prev, data as SocialLink]);
    setNewUrl('');
    setMessage({ type: 'success', text: 'Link added!' });
  };

  const deleteLink = async (id: string) => {
    const { error } = await supabase.from('social_links').delete().eq('id', id);
    if (error) {
      setMessage({ type: 'error', text: error.message });
      return;
    }
    setLinks((prev) => prev.filter((l) => l.id !== id));
    setMessage({ type: 'success', text: 'Link removed.' });
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold gradient-text">Social Links</h1>
        <p className="text-slate-500 text-sm mt-1">
          Add your social media and contact links
        </p>
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

      {/* Add Link Form */}
      <div className="glass-card-static p-6 mb-8">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Add New Link
        </h3>
        <div className="flex flex-wrap gap-3">
          <select
            value={newPlatform}
            onChange={(e) => setNewPlatform(e.target.value)}
            className="glass-input !w-auto"
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p} className="bg-[#0B0F19]">
                {p}
              </option>
            ))}
          </select>
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addLink()}
            className="glass-input flex-1 min-w-[250px]"
            placeholder="https://github.com/yourusername"
          />
          <button onClick={addLink} className="btn-primary">
            <Plus size={18} />
            Add
          </button>
        </div>
      </div>

      {/* Links List */}
      <div className="space-y-3">
        {links.map((link) => (
          <div
            key={link.id}
            className="glass-card-static p-4 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Share2 size={18} className="text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{link.platform}</p>
              <p className="text-xs text-slate-500 truncate">{link.url}</p>
            </div>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost !px-3 text-slate-400 hover:text-white"
              title="Open link"
            >
              ↗
            </a>
            <button
              onClick={() => deleteLink(link.id)}
              className="btn-danger !px-3"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {links.length === 0 && (
          <div className="glass-card-static p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <Share2 size={28} className="text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-400 mb-2">
              No social links yet
            </h3>
            <p className="text-slate-500 text-sm">
              Add your social profiles using the form above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
