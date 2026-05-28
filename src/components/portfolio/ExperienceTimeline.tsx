'use client';

import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import type { Experience } from '@/types/database.types';

interface ExperienceTimelineProps {
  experiences: Experience[];
  themeColor: string;
}

export default function ExperienceTimeline({ experiences, themeColor }: ExperienceTimelineProps) {
  if (!experiences || experiences.length === 0) return null;

  return (
    <section id="experience" className="relative z-10 px-6 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center md:text-left"
        >
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
            Work Experience
          </h2>
          <div
            className="w-16 h-1 rounded-full mx-auto md:mx-0"
            style={{ background: `linear-gradient(90deg, ${themeColor}, transparent)` }}
          />
        </motion.div>

        {/* Timeline Stack */}
        <div className="relative border-l border-white/10 pl-6 md:pl-8 ml-4 md:ml-6 space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Timeline Icon Node */}
              <div
                className="absolute -left-[39px] md:-left-[47px] top-1 w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-[#050508] flex items-center justify-center text-white"
                style={{
                  backgroundColor: themeColor,
                  boxShadow: `0 0 15px ${themeColor}60`,
                }}
              >
                <Briefcase size={12} className="md:w-3.5 md:h-3.5 text-white" />
              </div>

              {/* Card Container */}
              <div className="glass-card-static p-6 md:p-8 hover:border-white/15 hover:bg-white/5 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">{exp.role}</h3>
                    <p className="text-sm font-semibold transition-colors duration-200 mt-0.5" style={{ color: themeColor }}>
                      {exp.company}
                    </p>
                  </div>
                  <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 self-start md:self-center">
                    {exp.duration}
                  </span>
                </div>

                {/* Bullet Points */}
                {exp.bullet_points && exp.bullet_points.length > 0 && (
                  <ul className="space-y-3.5 text-slate-400 text-sm md:text-[0.925rem] leading-relaxed">
                    {exp.bullet_points.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex gap-2.5 items-start">
                        <span 
                          className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" 
                          style={{ backgroundColor: themeColor }}
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
