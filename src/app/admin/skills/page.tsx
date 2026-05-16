'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { Plus, Trash2, Zap } from 'lucide-react';
import type { Skill } from '@/types/database.types';

const DEFAULT_CATEGORIES = ['Frontend', 'Backend', 'Design', 'DevOps', 'Tools', 'General'];

export default function AdminSkillsPage() {
  const supabase = createClient();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [newSkill, setNewSkill] = useState('');
  const [newCategory, setNewCategory] = useState('Frontend');

  const loadSkills = useCallback(async () => {
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
      .from('skills')
      .select('*')
      .eq('profile_id', profile.id)
      .order('category', { ascending: true });

    setSkills(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  const addSkill = async () => {
    if (!newSkill.trim() || !profileId) return;

    const { data, error } = await supabase
      .from('skills')
      .insert({
        profile_id: profileId,
        skill_name: newSkill.trim(),
        category: newCategory,
      })
      .select()
      .single();

    if (error) {
      setMessage({ type: 'error', text: error.message });
      return;
    }

    setSkills((prev) => [...prev, data as Skill]);
    setNewSkill('');
    setMessage({ type: 'success', text: 'Skill added!' });
  };

  const deleteSkill = async (id: string) => {
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) {
      setMessage({ type: 'error', text: error.message });
      return;
    }
    setSkills((prev) => prev.filter((s) => s.id !== id));
    setMessage({ type: 'success', text: 'Skill removed.' });
  };

  // Group skills by category
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

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
        <h1 className="text-2xl font-bold gradient-text">Skills</h1>
        <p className="text-slate-500 text-sm mt-1">
          Add and organize your technical skills by category
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

      {/* Add Skill Form */}
      <div className="glass-card-static p-6 mb-8">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Add New Skill
        </h3>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
            className="glass-input flex-1 min-w-[200px]"
            placeholder="e.g., React, Node.js, Figma"
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="glass-input !w-auto"
          >
            {DEFAULT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-[#0B0F19]">
                {cat}
              </option>
            ))}
          </select>
          <button onClick={addSkill} className="btn-primary">
            <Plus size={18} />
            Add
          </button>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([category, catSkills]) => (
          <div key={category} className="glass-card-static p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-indigo-400" />
              <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">
                {category}
              </h3>
              <span className="text-xs text-slate-600 ml-1">
                ({catSkills.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {catSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-red-400/30 transition-all duration-200"
                >
                  <span className="text-sm text-slate-300">{skill.skill_name}</span>
                  <button
                    onClick={() => deleteSkill(skill.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {skills.length === 0 && (
          <div className="glass-card-static p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <Zap size={28} className="text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-400 mb-2">No skills yet</h3>
            <p className="text-slate-500 text-sm">
              Start adding your skills using the form above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
