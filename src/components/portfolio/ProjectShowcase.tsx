'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Code2 } from 'lucide-react';
import type { Project } from '@/types/database.types';

interface ProjectShowcaseProps {
  projects: Project[];
  themeColor: string;
}

export default function ProjectShowcase({ projects, themeColor }: ProjectShowcaseProps) {
  if (!projects || projects.length === 0) return null;

  const sorted = [...projects].sort((a, b) => a.display_order - b.display_order);

  return (
    <section id="projects" className="relative z-10 px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
            Featured Projects
          </h2>
          <div
            className="w-16 h-1 rounded-full"
            style={{ background: `linear-gradient(90deg, ${themeColor}, transparent)` }}
          />
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sorted.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card group overflow-hidden flex flex-col"
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
                  className="h-48 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${themeColor}15, #8b5cf615)`,
                  }}
                >
                  <span className="text-5xl opacity-30">🚀</span>
                </div>
              )}

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white/90 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">
                  {project.description}
                </p>

                {/* Links */}
                <div className="flex gap-3 mt-auto">
                  {project.live_link && (
                    <a
                      href={project.live_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-medium transition-colors duration-300 hover:opacity-80"
                      style={{ color: themeColor }}
                    >
                      <ExternalLink size={15} />
                      Live Demo
                    </a>
                  )}
                  {project.github_link && (
                    <a
                      href={project.github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors duration-300"
                    >
                      <Code2 size={15} />
                      Source
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
