'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Code2, Search } from 'lucide-react';
import type { Project } from '@/types/database.types';

interface ProjectShowcaseProps {
  projects: Project[];
  themeColor: string;
}

const COMMON_TECH_KEYWORDS = [
  'React', 'Next.js', 'Supabase', 'TypeScript', 'Tailwind',
  'Node.js', 'Python', 'Go', 'Docker', 'Kubernetes',
  'PostgreSQL', 'Stripe', 'Kafka', 'Figma', 'API', 'WebSockets', 'GraphQL'
];

export default function ProjectShowcase({ projects, themeColor }: ProjectShowcaseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  if (!projects || projects.length === 0) return null;

  // 1. Helper: extract tags matching tech keywords in title/description
  const getProjectTags = (project: Project): string[] => {
    const textToScan = `${project.title} ${project.description || ''}`.toLowerCase();
    return COMMON_TECH_KEYWORDS.filter(tech => textToScan.includes(tech.toLowerCase()));
  };

  // 2. Collect all unique tags that appear in current projects list
  const allProjectTags = new Set<string>();
  projects.forEach(p => {
    getProjectTags(p).forEach(t => allProjectTags.add(t));
  });
  const tagsList = ['All', ...Array.from(allProjectTags)];

  // 3. Filter & Sort Projects
  const filtered = projects
    .filter(project => {
      const matchesSearch = 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const projectTags = getProjectTags(project);
      const matchesTag = selectedTag === 'All' || projectTags.includes(selectedTag);

      return matchesSearch && matchesTag;
    })
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <section id="projects" className="relative z-10 px-6 py-20">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
                Featured Projects
              </h2>
              <div
                className="w-16 h-1 rounded-full"
                style={{ background: `linear-gradient(90deg, ${themeColor}, transparent)` }}
              />
            </motion.div>
          </div>

          {/* Live Search Input */}
          <div className="relative w-full md:max-w-xs shrink-0">
            <Search className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-zinc-550" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input !pl-10 !py-2 text-xs bg-zinc-950/40 border border-zinc-850 focus:border-zinc-700"
              placeholder="Search projects..."
            />
          </div>
        </div>

        {/* Dynamic Tags Filter list */}
        {tagsList.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {tagsList.map(tag => {
              const isActive = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-250 cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 border-purple-500/25 text-white'
                      : 'border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white bg-zinc-950/20'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => {
              const projectTags = getProjectTags(project);
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card group overflow-hidden flex flex-col h-full bg-[#0B0F19]/40 border border-white/5"
                >
                  {/* Project Image */}
                  {project.image_url ? (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent" />
                    </div>
                  ) : (
                    <div
                      className="h-48 flex items-center justify-center relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${themeColor}15, #8b5cf615)`,
                      }}
                    >
                      <span className="text-5xl opacity-30 group-hover:scale-110 transition-transform duration-300">🚀</span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="text-slate-400 text-xs leading-relaxed mb-4 flex-1">
                      {project.description}
                    </p>

                    {/* Extracted tags inside card */}
                    {projectTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {projectTags.map(t => (
                          <span key={t} className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-950/80 text-zinc-550 border border-zinc-900">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex gap-4 mt-auto border-t border-white/5 pt-4">
                      {project.live_link && (
                        <a
                          href={project.live_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold transition-colors duration-300 hover:opacity-85"
                          style={{ color: themeColor }}
                        >
                          <ExternalLink size={13} />
                          Live Demo
                        </a>
                      )}
                      {project.github_link && (
                        <a
                          href={project.github_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold text-slate-450 hover:text-white transition-colors duration-300"
                        >
                          <Code2 size={13} />
                          Source Code
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center p-16 border border-dashed border-zinc-850 rounded-2xl bg-zinc-950/20">
            <p className="text-zinc-500 text-sm">
              No featured projects found matching &quot;<span className="text-white">{searchQuery || selectedTag}</span>&quot;.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
