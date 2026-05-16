'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { Plus, Trash2, Save, GripVertical, Upload } from 'lucide-react';
import type { Project } from '@/types/database.types';

export default function AdminProjectsPage() {
  const supabase = createClient();
  const [projects, setProjects] = useState<Project[]>([]);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const loadProjects = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Get the profile id for this auth user
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
      .from('projects')
      .select('*')
      .eq('profile_id', profile.id)
      .order('display_order', { ascending: true });

    setProjects(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const addProject = async () => {
    if (!profileId) return;

    const { data, error } = await supabase
      .from('projects')
      .insert({
        profile_id: profileId,
        title: 'New Project',
        description: '',
        display_order: projects.length,
      })
      .select()
      .single();

    if (error) {
      setMessage({ type: 'error', text: error.message });
      return;
    }

    setProjects((prev) => [...prev, data as Project]);
    setMessage({ type: 'success', text: 'Project added!' });
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    setSaving(id);
    const { error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
      setMessage({ type: 'success', text: 'Project saved!' });
    }
    setSaving(null);
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return;

    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      setMessage({ type: 'error', text: error.message });
      return;
    }
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setMessage({ type: 'success', text: 'Project deleted.' });
  };

  const handleImageUpload = async (id: string, file: File) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `projects/${user.id}-${id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-assets')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      setMessage({ type: 'error', text: uploadError.message });
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('portfolio-assets').getPublicUrl(fileName);

    await updateProject(id, { image_url: publicUrl });
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
          <h1 className="text-2xl font-bold gradient-text">Projects</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your portfolio projects
          </p>
        </div>
        <button onClick={addProject} className="btn-primary">
          <Plus size={18} />
          Add Project
        </button>
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

      {/* No profile warning */}
      {!profileId && (
        <div className="glass-card-static p-8 text-center">
          <p className="text-slate-400">
            Please set up your profile first before adding projects.
          </p>
        </div>
      )}

      {/* Projects List */}
      {profileId && (
        <div className="space-y-4">
          {projects.map((project, index) => (
            <div key={project.id} className="glass-card-static p-6">
              <div className="flex items-start gap-4">
                {/* Drag Handle + Order */}
                <div className="flex flex-col items-center gap-1 pt-2">
                  <GripVertical size={18} className="text-slate-600" />
                  <span className="text-xs text-slate-600">#{index + 1}</span>
                </div>

                {/* Image */}
                <div className="shrink-0">
                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-white/10 bg-white/5 relative group">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl opacity-30">
                        📁
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                      <Upload size={18} className="text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(project.id, file);
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Fields */}
                <div className="flex-1 space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      type="text"
                      value={project.title}
                      onChange={(e) =>
                        setProjects((prev) =>
                          prev.map((p) =>
                            p.id === project.id ? { ...p, title: e.target.value } : p
                          )
                        )
                      }
                      className="glass-input"
                      placeholder="Project Title"
                    />
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={project.live_link || ''}
                        onChange={(e) =>
                          setProjects((prev) =>
                            prev.map((p) =>
                              p.id === project.id
                                ? { ...p, live_link: e.target.value }
                                : p
                            )
                          )
                        }
                        className="glass-input"
                        placeholder="Live URL"
                      />
                      <input
                        type="url"
                        value={project.github_link || ''}
                        onChange={(e) =>
                          setProjects((prev) =>
                            prev.map((p) =>
                              p.id === project.id
                                ? { ...p, github_link: e.target.value }
                                : p
                            )
                          )
                        }
                        className="glass-input"
                        placeholder="GitHub URL"
                      />
                    </div>
                  </div>
                  <textarea
                    value={project.description || ''}
                    onChange={(e) =>
                      setProjects((prev) =>
                        prev.map((p) =>
                          p.id === project.id
                            ? { ...p, description: e.target.value }
                            : p
                        )
                      )
                    }
                    className="glass-textarea !min-h-[70px]"
                    placeholder="Project description..."
                    rows={2}
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={() =>
                      updateProject(project.id, {
                        title: project.title,
                        description: project.description,
                        live_link: project.live_link,
                        github_link: project.github_link,
                        display_order: index,
                      })
                    }
                    disabled={saving === project.id}
                    className="btn-ghost !px-3"
                    title="Save"
                  >
                    {saving === project.id ? (
                      <div className="loading-spinner !w-4 !h-4" />
                    ) : (
                      <Save size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="btn-danger !px-3"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <div className="glass-card-static p-12 text-center">
              <FolderIcon />
              <h3 className="text-lg font-semibold text-slate-400 mt-4 mb-2">
                No projects yet
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Add your first project to showcase in your portfolio.
              </p>
              <button onClick={addProject} className="btn-primary">
                <Plus size={18} />
                Add Your First Project
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FolderIcon() {
  return (
    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
      <span className="text-3xl">📁</span>
    </div>
  );
}
